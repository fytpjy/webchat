
Page({
    data:{
        shareShow: true,
        qrcode: "",
        wechat_no: ""
    },
    onShow: function(){
        let app = getApp();
        this.setData({
            qrcode: app.globalData.successcode.qrcode,
            wechat_no: app.globalData.successcode.wechat_no
        })
    },
    gohome: function(){
    	wx.redirectTo({
    	    url: '/page/home/index'
    	})
    },
    showShare: function(){
        this.setData({
            shareShow: false
        })
        let that = this;
        setTimeout(function(){
            that.setData({
                shareShow: true
            })
        },1000)
    },
    hiddenShare: function(){
        this.setData({
            shareShow: true
        })
    },
    // onShareAppMessage: function () {
    //     this.hiddenShare();
    //     return {
    //         title: "我报名了这个活动，邀请你一起",
    //         path: "/page/active/report/index"
    //     }
    // },
    scancode: function(){
        wx.previewImage({
            current: this.data.qrcode,
            urls: [this.data.qrcode]
        })
    }
})