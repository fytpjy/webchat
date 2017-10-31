var util = require('../../../util/util.js');
var api = require('../../../util/api.js');
var config = require('../../../config.js');

Page({
    data:{
        height: "",
    	title: "",             //活动主题
        target: "",            //共读目标
        date: "",              //活动日期
        start_time: "14:00",   //开始时间
        end_time: "17:00",     //结束时间
        location: "",          //活动地点
        limit_number: "",      //活动限制人数
        longitude: "",
        latitude: "",
        desc: "",              //活动介绍
        process_ids: [],       //流程id
        wechatno: "",          //举办人二维码
        group_qrcode: "",      //群二维码
        srcUpload: "",
    	active_type: [],
        limit_numberShow: true,
        wordLen: 400,
        ycT: ""
    },
    onLoad: function(){
        let that = this;
        wx.showToast({
            title: "加载中",
            icon: 'loading'
        })
        api.getRequest('/SameCity/SameCityActivity/processList')
        .then((json) => {
            if(json.code==1){
                let nTime = new Date();
                that.setData({
                    active_type: json.data,
                    date: util.getDateStr(1)
                })
            }else{
                wx.showToast({
                    title: json.msg,
                    icon: 'success'
                })
            }
        })
    },
    formSubmit: function(e){
    	if(!e.detail.value.title || util.getTextNum(e.detail.value.title)>60){
            wx.showToast({
                title: "请填写活动名称",
                icon: 'success',
            })
        }else if(!e.detail.value.location || util.getTextNum(e.detail.value.location)>300){
            wx.showToast({
                title: "请选择活动地点",
                icon: 'success',
            })
        }else if(!e.detail.value.desc){
            wx.showToast({
                title: "请填写活动介绍",
                icon: 'success',
            })
    	}else if(!this.data.group_qrcode){
            wx.showToast({
                title: "请上传二维码图片",
                icon: 'success',
            })
        }else{
            let active_type = 0;
            this.data.active_type.forEach(function(res){
                if(res.active){active_type++}
            })
            if(active_type==0){
                wx.showToast({
                    title: "请选择活动流程",
                    icon: 'success',
                })
            }else{
                let app = getApp();
                app.globalData.localdata = e.detail.value;
                app.globalData.localdata.active_type = this.data.active_type;
                app.globalData.localdata.qrcode = this.data.group_qrcode;
                wx.navigateTo({
                    url: '/page/active/preview/index'
                })
            }
        }
    },
    switch1Change: function(e){
        if(!e.detail.value){
            this.setData({
                limit_numberShow: true,
                limit_number: 0,
            })
        }else{
            this.setData({
                limit_numberShow: false,
                limit_number: '',
            })
        }
    },
    radioChange: function(e) {
        let select = e.detail.value;
        let type = this.data.active_type;
        if(type.length>0){
            for(var i=0;i<type.length;i++){
                if(this.inArray(type[i].id,select)){
                    type[i].active = true
                }else{
                    type[i].active = false
                }                
            }
        }
        this.setData({
        	active_type: type
        })
    },
    inArray: function(n,arr){
        var j = 0;
        for(var i in arr){
            if(arr[i]==n){
                return true
                j++
            }
        }
        if(j == 0){
            return false
        }
    },
    selectAddr: function(){
        let that = this;
        wx.chooseLocation({
            type: 'wgs84',
            success: function(res) {
                that.setData({
                    location: res.name,
                    longitude: res.longitude,
                    latitude: res.latitude,
                })
            }
        })
    },
    uploadImages: function(){
        var that = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                wx.showToast({
                    title: "上传中...",
                    icon: 'loading',
                    duration: 10000
                })
                var tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    url: config.host+'/SameCity/SameCityActivity/uploadImg',
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData:{},
                    success: function(json) {
                        if(json.statusCode==200){
                            that.setData({
                                group_qrcode: JSON.parse(json.data).data.real_url,
                                srcUpload: JSON.parse(json.data).data.filename[0]
                            })
                        }else{
                            wx.showToast({
                              title: json.errMsg,
                              icon: 'success',
                              duration: 1000
                            })
                        }
                    },
                    fail: function(){
                        wx.showToast({
                            title: "图片上传失败",
                            icon: 'success',
                            duration: 2000
                        })
                    }
                })
            }
        })
    },
    bindDate: function(e) {
        this.setData({
            date: e.detail.value,
        })
    },
    bindStartTime: function(e) {
        this.setData({
            start_time: e.detail.value,
        })
    },
    bindEndTime: function(e) {
        this.setData({
            end_time: e.detail.value
        })
    },
    getUploadConent: function(e) {
        var that = this;
        clearTimeout(that.data.ycT)
        that.data.ycT = setTimeout(function(){
            var len=400-e.detail.value.length;
            that.setData({
                wordLen: len
            })    
        },1000)
        


    },
    bindlinechange:function(e){
        // var height=e.detail.height;
        // this.setData({
        //     height:(height+20)+"px"
        // })
    }
})