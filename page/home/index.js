var api = require('../../util/api.js');
var util = require('../../util/util.js');
var login = require('../../util/login.js');
var button = require('../../util/button.js');
var config = require('../../config.js');

Page({
    data:{
    	city: "全国",             //当前城市
        cityJionNum: "0",         //报名人数    
    	cityAll: false,           //tab切换控制
        userInfo: null,
    	imgUrls:[],               //全部活动轮播图
        cityjoinactive:[],        //城市--已参加活动
        citynotjoinactive:[],     //城市--未报名活动
    	joinactive:[],            //全部活动--已参加活动
    	notjoinactive:[],         //全部活动--未报名活动
        loaded: false,            //是否记载
        isShow: false,
        isJoin: false,            //是否加入同城
        page: 1,
        isMore: false,
    },
    tabclickAll: function(){
        let app = getApp();
        if(this.data.loaded){
        	this.setData({
        		cityAll: true
        	})
        }else{
            this.getAllData()
        }
        app.globalData.homeCityStaye = true;
    },
    tabclickCity: function(){
        let app = getApp();
    	this.setData({
    		cityAll: false
    	})
        app.globalData.homeCityStaye = false;
    },
    onLoad: function(){
        
    },
    onShow:function(scene){
        let app = getApp();
        util.checkUserInfo(this.getCityData);
        this.setData({
            cityAll: app.globalData.homeCityStaye?app.globalData.homeCityStaye:false
        })
    },
    codecheck: function(){
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
    getCityData: function(){
        wx.showToast({
            title: "加载中",
            icon: 'loading'
        })
        this.cityStorage();
        this.setData({
            isShow: true
        })
    },
    getAllData: function(){
        wx.showToast({
            title: "加载中",
            icon: 'loading'
        })
        this.cityActivityList(0,"now");
        this.cityActivityList(0,"pass");

        let that = this;
        api.getRequest('/SameCity/SameCityActivity/bannerList')
        .then((json) => {
            if(json.code==1){
                that.setData({
                    imgUrls: json.data.list
                })
            }else{
                wx.showToast({
                    title: json.msg,
                    icon: 'success'
                })
            }
        })
    },
    cityStorage: function(){
        //当前城市判断
        let locationcity = wx.getStorageSync('locationcity');
        let app = getApp();
        if(locationcity){
            this.setData({
                city: locationcity.split(":")[1]
            })
            this.getIsJoinSameCity(locationcity.split(":")[0]);
        }else{
            api.getRequest('/SameCity/SameCityActivity/lngLatConvertCity', {
                longitude: String(app.globalData.userLngLat.longitude),
                latitude: String(app.globalData.userLngLat.latitude)
            })
            .then((json) => {
                if(json.code==1){
                    wx.setStorageSync('locationcity', json.data.city_info.city_id+":"+json.data.city_info.name);
                    wx.setStorageSync('locationcityName', json.data.city_info.city_id+":"+json.data.city_info.name);
                    this.setData({
                        city: json.data.city_info.name
                    })
                    this.getIsJoinSameCity(json.data.city_info.city_id);
                }else{
                    wx.showToast({
                        title: json.msg,
                        icon: 'success'
                    })
                }
            })
            
        }
        //浏览记录判断
        let visitCity = wx.getStorageSync('visitCity');
        if(visitCity){
            if(visitCity.indexOf(locationcity)<0){
                wx.setStorageSync('visitCity', visitCity+"#"+locationcity);
            }else{
                //存在更新排序后面优化
            }
        }else{
            wx.setStorageSync('visitCity', locationcity);
        }
    },
    getIsJoinSameCity: function(city_id){
        this.userInfo(city_id);
        let that = this;
        api.getRequest('/SameCity/SameCityActivity/isJoinSameCity',{
            city_id: city_id
        })
        .then((json) => {
            if(json.code==1){
                //wx.hideToast();
                if(json.data.is_join==1){
                    this.cityActivityList(city_id,"sign_up");
                    this.cityActivityList(city_id,"not_sign_up",1);
                    this.getCityPmaCount(city_id);
                    that.setData({
                        isJoin: true
                    })
                }else{
                    that.setData({
                        cityjoinactive: [],
                        citynotjoinactive: [],
                        isJoin: false
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
    getCityPmaCount: function(cityid){
        let that = this;
        api.getRequest('/SameCity/SameCityActivity/cityPmaCount',{
            city_id: cityid
        })
        .then((json) => {
            if(json.code==1){
                that.setData({
                    cityJionNum: json.data.count
                })
            }else{
                wx.showToast({
                    title: json.msg,
                    icon: 'success'
                })
            }
        })
    },
    userInfo: function(city_id){
        var that = this;
        api.getRequest('/SameCity/SameCityActivity/userInfo',{
            city_id: city_id
        })
        .then((json) => {
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
    cityActivityList: function(id,type,page){
        let app = getApp();
        let that = this;
        let jsonData,url;
        if(id==0){
            jsonData = {
                type: type
            }
            url = "activityList";
        }else{
            jsonData = {
                city_id: id,
                type: type,
                page: page
            }
            url = "cityActivityList";
        }
        api.getRequest('/SameCity/SameCityActivity/'+url,jsonData)
        .then((json) => {
            if(json.code==1){
                let dat = new Array();
                if(id != 0 && page && page>1){
                    dat = that.data.citynotjoinactive;
                }
                json.data.list.forEach(function(res){
                    dat.push({
                        id: res.id,
                        canton: res.canton,
                        limit_number: res.limit_number,
                        location: res.location,
                        start_time: res.start_time.substring(0,res.start_time.length-3),
                        title: res.title,
                        target: res.target,
                        button_info: res.button_info,
                        url: util.getUrl(res.button_info.type),
                        more: (type == "sign_up" && id != 0),
                    })
                })
                if(type == "sign_up" && id != 0){    //城市报名活动
                    console.log("1")
                    that.setData({
                        cityjoinactive: dat
                    })
                }else if(type == "not_sign_up" && id != 0){    //城市未报名活动
                    console.log("2")
                    if(json.data.list.length<=0){
                        that.setData({
                            isMore: true
                        })
                    }else{
                        that.setData({
                            page: ++that.data.page
                        })
                        if(page==1){
                            that.setData({
                                isMore: false,
                                page: 2
                            })
                        }
                    }
                    that.setData({
                        citynotjoinactive: dat,
                    })
                    
                }else if(id == 0 && type == "now"){    //所有报名活动
                    console.log("3")
                    that.setData({
                        joinactive: dat,
                        loaded: true,
                        cityAll: true
                    })
                }else if(id == 0 && type == "pass"){    //所有未报名活动
                    console.log("4")
                    // wx.showLoading({
                    //     title: JSON.stringify(dat)
                    // })
                    that.setData({
                        notjoinactive: dat,
                        loaded: true,
                        cityAll: true
                    })
                }else{
                    wx.showToast({
                        title: "前端参数错误",
                        icon: 'success'
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
    dirctionTo: function(e){
        wx.showToast({
            title: "加载中",
            icon: 'loading'
        })
        let userInfo = this.data.userInfo;
        let app = getApp();
        if(userInfo.sex && userInfo.job && userInfo.province && userInfo.city && userInfo.intro){
            
            let visitCity = wx.getStorageSync('locationcity');
            var that = this;
            let city_id = visitCity.split(":")[0];

            wx.request({
                url: config.host+'/SameCity/SameCityActivity/joinSameCity',
                method: 'POST',
                data: {
                    city_id: city_id,
                    user_id: app.globalData.userInfoMes.user_id,
                    user_token: app.globalData.userInfoMes.user_token,
                    formId: e.detail.formId
                },
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: function(json) {
                    console.log(json)
                    if(json.data.code==1){
                        wx.showToast({
                            title: "加入成功",
                            icon: 'success'
                        })
                        that.cityActivityList(city_id,"sign_up");
                        that.cityActivityList(city_id,"not_sign_up",1);
                        that.getCityPmaCount(city_id)
                        that.setData({
                            isJoin: true
                        })
                    }else{
                        wx.showToast({
                            title: json.data.msg,
                            icon: 'success'
                        })
                    }
                }
            })
        }else{
            wx.navigateTo({
                url: '/page/pma/member/edit'
            })
        }
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
    memberindex: function(){
        let user_data = wx.getStorageSync('user_data');
        wx.navigateTo({
            url: "/page/pma/member/index?id="+user_data.user_id+"&token="+user_data.user_token
        })
    },
    errTips: function(){
        //授权失败
        util.checkUserInfo(this.getCityData);
    },
    onShareAppMessage: function () {
        return {
            title: "我加入了有书同城共读会，一起加入吧",
            path: "/page/home/index"
        }
    },
    onPullDownRefresh: function(){
        let that = this;
        setTimeout(function(){
            wx.stopPullDownRefresh();

            if(that.data.cityAll){
                that.getAllData()
            }else{
                that.getCityData();
            }
        },1000)
    },
    //底部加载更多
    onReachBottom: function(e){
        console.log("最新加载更多"+this.data.page);
        if(!this.data.cityAll && !this.data.isMore){
            let locationcity = wx.getStorageSync('locationcity');
            this.cityActivityList(locationcity.split(":")[0],"not_sign_up",this.data.page)
        }
    },
})