var util = require('../../../util/util.js');
var api = require('../../../util/api.js');
var config = require('../../../config.js');

Page({
    data:{
        width:0,
        wordLen:300,
        height: "",
        feedback:"",    //反馈
        process:[],     //流程
        start:"",       //评分
        activity_id: "",
        active_type: []
    },
    onLoad: function(params) {
        let that = this;
        this.setData({
            activity_id: params.id
        })

        wx.showToast({
            title: "加载中",
            icon: 'loading'
        })

        api.getRequest('/SameCity/SameCityActivity/activityInfo',{
            activity_id: params.id
        })
        .then((json) => {
            if(json.code==1){
                wx.hideToast()
                let nTime = new Date();
                that.setData({
                    active_type: json.data.info.activity_process,
                })
            }else{
                wx.showToast({
                    title: json.msg,
                    icon: 'success'
                })
            }
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
    radioChange: function(e) {
        let curr = e.detail.value;
        let type = this.data.active_type;
        if(type.length>0){
            for(var i=0;i<type.length;i++){
                if(this.inArray(type[i].id,curr)){
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
    changeWidth:function(e){
        var x= e.detail.x;
        var y= e.detail.y;
        var width = this.data.width;
        var start = this.data.start;
        var startsWith="";
        wx.getSystemInfo({
            success: function(res) {
                startsWith=res.windowWidth
            }
        })
        var per=(x/startsWith)*100;
        if(per<4){
            per=0;
            start=0
        }
        else if(per<22){
            per=20;
             start=1
        }
        else if(per<44){
            per=40;
             start=2
        }
        else if(per<66){
            per=60;
             start=3
        }
        else if(per<88){
            per=80;
             start=4
        }
        else if(per>=89){
            per=100;
             start=5
        }
        this.setData({
            width: per+"%",
            start:start
        })
    },
    getUploadConent: function(e) {
        var len=300-e.detail.value.length;
        this.setData({
            wordLen: len
        })
    },
    bindlinechange:function(e){
        var height=e.detail.height;
        this.setData({
            height:(height+20)+"px"
        })
    },
    formSubmit: function(e){
        console.log(e)
        var formData = e.detail.value;
        var start=this.data.start;
        if(!start){
            wx.showToast({
                title: "您尚未评分",
                icon: 'success',
            })
        }
        else if(e.detail.value.process.length==0){
            wx.showToast({
                title: "您对哪个环节感兴趣",
                icon: 'success',
            })
        }else if(!e.detail.value.feedback) {
            wx.showToast({
                title: "评价内容不能为空",
                icon: 'success',
            })
        }else{
                let that = this;
                wx.showToast({
                    title: "加载中",
                    icon: 'loading'
                })
                api.getRequest('/SameCity/SameCityActivity/ActivityEvaluation',{
                    activity_id: that.data.activity_id,
                    score: start,
                    feedback: e.detail.value.feedback,
                    process: e.detail.value.process.join(",")
                })
                .then((json) => {
                    if(json.code==1){
                        
                        wx.navigateTo({
                            url: '/page/active/success/index'
                        })

                    }else{
                        wx.showToast({
                            title: json.msg,
                            icon: 'success'
                        })
                    }
                })
            }
        },
    // onShareAppMessage: function () {
    //     return {
    //         title:"本次活动圆满结束，进来说说你的感受吧",
    //         path: "/page/active/comment/index"
    //     }
    // }

})