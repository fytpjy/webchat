var api = require('../../../util/api.js');
var config = require('../../../config.js');
var util = require('../../../util/util.js');

Page({

    data:{
    	shareShow: true,
        userInfo: "",
    },
    sharecard: function(){
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
    hiddenshare: function(){
    	this.setData({
    		shareShow: true
    	})
    },
    onLoad: function(params){
        let userInfoMes = wx.getStorageSync('user_data');
        if(params.f == "member"){
            var dt = {
                user_id: params.id,
                token: userInfoMes.user_token,
                fromUrl: params.from,
                other_uid: params.other_uid
            }
        }else{
            var dt = {
                user_id: params.id,
                token: params.token,
                fromUrl: params.from,
                other_uid: params.other_uid
            }
        }
        this.setData(dt)

        wx.showToast({
            title: params.token+":"+params.id,
            icon: 'success'
        })
    },
    onShow: function(){
        this.getData(this.data.user_id,this.data.token,this.data.other_uid)
    },
    getData: function(id,token,other_uid){
        wx.showToast({
            title: "加载中",
            icon: 'loading'
        })
        let that = this;
        let locationcity = wx.getStorageSync('locationcity');
        api.getRequest('/SameCity/SameCityActivity/userInfo',{
            user_id : id,
            city_id: locationcity.split(":")[0]?locationcity.split(":")[0]:1,
            user_token: token,
            other_uid: other_uid
        })
        .then((json) => {
            wx.hideToast();
            if(json.code==1){
                that.setData({
                    userInfo: json.data.user_info
                })
            }else{
                wx.showToast({
                    title: json.msg,
                    icon: 'success'
                })
            }
        })
    },
    onShareAppMessage: function () {
        let userInfoMes = wx.getStorageSync('user_data');
        return {
            title: "这是我的同城名片，你也来试试",
            path: "/page/pma/member/index?id="+userInfoMes.user_id+"&token="+userInfoMes.user_token+"&from=out"
        }
    },
    showcard: function(){
        wx.previewImage({
            current: config.host+"/SameCity/SameCityActivity/shareCard?user_id="+this.data.user_id+"&user_token="+this.data.token,
            urls: [config.host+"/SameCity/SameCityActivity/shareCard?user_id="+this.data.user_id+"&user_token="+this.data.token]
        })
    },
    editCard: function(){
        util.checkUserInfo(function(){
            wx.navigateTo({
                url: "/page/pma/member/edit"
            })
        });
    },
    goHome: function(){
        wx.redirectTo({
            url: '/page/home/index'
        })
    },
    //上拉刷新
    onPullDownRefresh: function(){
        console.log("上拉刷新")
        setTimeout(function(){
            wx.stopPullDownRefresh();
        },1000)
    }
})