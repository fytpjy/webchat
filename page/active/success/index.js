Page({
    data:{
    	shareShow: true,
        qd: ""
    },
    onLoad: function(params){
        this.setData({
            qd: params.qd
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
    goToHome: function(){
		wx.reLaunch({
            url: '/page/home/index'
        })
    }
})