var api = require('../../../util/api.js');
var config = require('../../../config.js');
var util = require('../../../util/util.js');

Page({
    data:{
    	activity_id: "",   //活动ID
    	shareShow: true,
        activity: ""
    },
    onLoad: function(params) {
        this.setData({
        	activity_id: params.id
        })
        wx.showToast({
            title: "加载中",
            icon: 'loading'
        })
        
    },
    onShow: function(){
        let that = this;
        util.checkUserInfo(function(){
            that.getData();
            let app = getApp();
            that.setData({
                user_id: app.globalData.userInfoMes.user_id,
                user_token: app.globalData.userInfoMes.user_token
            })
        });      

    },
    report: function(e){
        //console.log(this.data.activity.button_info.id)
        let that = this;
        let app = getApp();
        switch(this.data.activity.button_info.id){
            case 1:
                //去报名
                wx.showToast({
                    title: "加载中",
                    icon: 'loading'
                })
                wx.request({
                    url: config.host+'/SameCity/SameCityActivity/signUp',
                    method: 'POST',
                    data: {
                        activity_id: this.data.activity_id,
                        user_id: app.globalData.userInfoMes.user_id,
                        user_token: app.globalData.userInfoMes.user_token,
                        formId: e.detail.formId
                    },
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    success: function(json) {
                        if(json.data.code==1){
                            app.globalData.successcode = json.data.data;
                            wx.navigateTo({
                                url: '/page/active/report/success'
                            })
                        }else if(json.data.code==4509){
                            wx.navigateTo({
                                url: '/page/pma/member/edit?form=report'
                            })
                        }else{
                            wx.showToast({
                                title: json.data.msg,
                                icon: 'success'
                            })
                        }
                    }
                })
            break;
            case 8:
                if(this.data.activity.button_info.type == "endactivity"){
                    //结束活动
                    wx.showModal({
                        title: '提示',
                        content: '正在准备结束活动',
                        success: function(res) {
                            if (res.confirm) {
                                api.getRequest('/SameCity/SameCityActivity/endActivity',{
                                    activity_id: that.data.activity_id
                                })
                                .then((json) => {
                                    if(json.code==1){
                                        wx.navigateBack({
                                            delta: 1
                                        })
                                    }else{
                                        wx.showToast({
                                            title: json.msg,
                                            icon: 'success'
                                        })
                                    }
                                })
                            }
                        }
                    })
                }else{
                    //签到二维码
                    wx.navigateTo({
                        url: '/page/active/sign/index?id='+this.data.activity_id
                    })
                }
            break;
            case 4:
                //扫码签到
                wx.scanCode({
                    success: (res) => {
                        api.getRequest('/SameCity/SameCityActivity/userSign', {
                            qrcode_key: res.result,
                        })
                        .then((json) => {
                            if(json.code==1){
                                
                                let app = getApp();
                                app.globalData.codecheck = json.data.info;
                                wx.navigateTo({
                                    url: "/page/active/sign/code"
                                })
                                
                            }else{
                                wx.showToast({
                                    title: json.msg,
                                    icon: 'success'
                                })
                            }
                        })
                    },
                    fail: (res) => {
                        wx.showToast({
                            title: '扫码失败'
                        })
                    }
                })
            break;
            case 2:
                //待评价
                wx.navigateTo({
                    url: '/page/active/comment/index?id='+this.data.activity_id
                })
            break;
            //更多按钮状态处理
        }
    },
    hiddenshare: function(){
    	this.setData({
    		shareShow: true
    	})
    },
    scancode: function(){
        wx.previewImage({
            current: this.data.activity.qrcode_img,
            urls: [this.data.activity.qrcode_img]
        })
    },
    showshare: function(){
    	this.setData({
    		shareShow: false
    	})
    },
    getData: function(){
        let app = getApp();
        let that = this;
        api.getRequest('/SameCity/SameCityActivity/activityInfo',{
            activity_id: this.data.activity_id
        })
        .then((json) => {
            if(json.code==1){
                let setInfo = json.data.info;
                setInfo.start_time = setInfo.start_time.substring(0,setInfo.start_time.length-3)+"-"+setInfo.end_time.substring(11,setInfo.end_time.length-3)
                that.setData({
                    activity: setInfo
                })
                app.globalData.qrcode_img = json.data.info.qrcode_img;
            }else{
                wx.showToast({
                    title: json.msg,
                    icon: 'success'
                })
            }
        })
    },
    openaddr: function(){
        wx.openLocation({
            latitude: Number(this.data.activity.latitude),
            longitude: Number(this.data.activity.longitude),
            scale: 20
        })
    },
    onShareAppMessage: function () {
        return {
            title: "发现了一个好活动，快来报名参加吧",
            path: "/page/active/report/index?id="+this.data.activity_id
        }
    }
})