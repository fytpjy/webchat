var api = require('../../../util/api.js');

Page({
    data:{
    	locationCity: [],
    	visitCity: [],
    	hotCity: []
    },
    onLoad: function(){

    },
    onShow: function(){
        wx.showToast({
            title: "加载中",
            icon: 'loading'
        })
        let that = this;
        api.getRequest('/SameCity/SameCityActivity/hotCity')
        .then((json) => {
            if(json.code==1){
                that.setData({
                    hotCity: json.data.city_list
                })
            }else{
                wx.showToast({
                    title: json.msg,
                    icon: 'success',
                })
            }
        })

        let locationcity = wx.getStorageSync('locationcityName');
        if(locationcity){
            let city = locationcity.split(":");
            this.setData({
                locationCity: [{city_id: city[0],name: city[1]}]
            })
        }

        let visitCity = wx.getStorageSync('visitCity');
        if(visitCity){
            let city = new Array();
            if(visitCity.indexOf("#")>=0){
                city = visitCity.split("#")
            }else{
                city.push(visitCity)
            }
            let cityarry = new Array();
            city.forEach(function(res){
                let data = res.split(":");
                cityarry.push({
                    city_id: data[0],
                    name: data[1]
                })
            })
            this.setData({
                visitCity: cityarry
            })
        }
    },
    switchCity: function(event){
    	wx.setStorageSync('locationcity', event.target.dataset.cityid+":"+event.target.dataset.cityname);
        let app = getApp();
        app.globalData.homeCityStaye = false;
    	wx.navigateBack({
            delta: 1
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