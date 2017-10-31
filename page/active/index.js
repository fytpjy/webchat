var api = require('../../util/api.js');
var util = require('../../util/util.js');
var button = require('../../util/button.js');

Page({
    data:{
    	joinactive:[],
        page: 1,
        type: "",
        notmore: false,
    },
    onLoad: function(params) {
        this.setData({
            type: params.type
        })
        this.ActivityList(params.type)
    },
    ActivityList: function(type,page){
        wx.showToast({
            title: "加载中",
            icon: 'loading'
        })
        let that = this;
        let url = type=="home"? 'userActivityHistory' : 'activityList'
        api.getRequest('/SameCity/SameCityActivity/'+url,{
            type: type,
            page: page
        })
        .then((json) => {
            if(json.code==1){
                let datat = new Array();
                if(page > 1){
                    datat = that.data.joinactive;
                }
                json.data.list.forEach(function(res){
                    datat.push({
                        id: res.id,
                        limit_number: res.limit_number,
                        canton: res.canton?res.canton:res.location.substring(0,5),
                        location: res.location.substring(0,5),
                        start_time: res.start_time.substring(0,res.start_time.length-3),
                        title: res.title,
                        target: res.target,
                        button_info: res.button_info,
                        url: util.getUrl(res.button_info.type),
                        more: false,
                    })
                })
                that.setData({
                    joinactive: datat,
                    page: ++that.data.page
                })
                if(json.data.list.length<=0){
                    that.setData({
                        notmore: true
                    })
                }
            }else{
                wx.showToast({
                    title: json.msg,
                    icon: 'success'
                })
            }
        })
    },

    dirctionUrl: function(e){
        button.dirctionUrl(e)
    },
    dirctionMeber: function(e){
        button.dirctionMeber(e)
    },
    dirctionLiUrl: function(e){
        button.dirctionLiUrl(e)
    },

    codecheck: function(){
        wx.showToast({
            title: "加载中",
            icon: 'loading'
        })
        let that = this;
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
    },

    //底部加载更多
    onReachBottom: function(e){
        if(!this.data.notmore)
        this.ActivityList(this.data.type,this.data.page+1)
    },
    onPullDownRefresh: function(){

    setTimeout(function(){
            wx.stopPullDownRefresh();
            this.setData({
                page: 1
            })
            //上拉刷新
            this.ActivityList(this.data.type,1)
        },1000)

},
})