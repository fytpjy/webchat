var api = require('../../../util/api.js');

Page({
    data:{
    	userInfo: "",
        from: ""   //来路页面
    },
    onLoad: function(params){
        wx.showToast({
            title: "加载中",
            icon: 'loading'
        })
        this.setData({
            from: params.form?params.form:""
        })
        let app = getApp();
    	let that = this;
        let locationcity = wx.getStorageSync('locationcity');
    	api.getRequest('/SameCity/SameCityActivity/userInfo',{
            city_id: locationcity.split(":")[0]
        })
    	.then((json) => {
    	    if(json.code==1){
    	        that.setData({
    	            userInfo: json.data.user_info
    	        })
                app.globalData.userInfo = json.data.user_info;
    	    }else{
    	        wx.showToast({
    	            title: json.msg,
    	            icon: 'success'
    	        })
    	    }
    	})
    },
    onShow: function(){
        let app = getApp();
        if(app.globalData.userInfo){
            this.setData({
                userInfo: app.globalData.userInfo
            })
        }
    },
    saveData: function(){
    	let that = this;
        if(!that.data.userInfo.sex){
            wx.showToast({
                title: "请选择性别",
                icon: 'success'
            })
        }else if(!that.data.userInfo.job){
            wx.showToast({
                title: "请填写你的职业",
                icon: 'success'
            })
        }else if(!that.data.userInfo.intro){
            wx.showToast({
                title: "请完善个人介绍",
                icon: 'success'
            })
        }else if(!that.data.userInfo.province || !that.data.userInfo.city){
            wx.showToast({
                title: "请选择所在地区",
                icon: 'success'
            })
        }else{
            if(that.data.from == "report"){
                if(!that.data.userInfo.real_name){
                    wx.showToast({
                        title: "填写你的真实姓名",
                        icon: 'success'
                    })
                    return false
                }else if(!that.data.userInfo.mobile){
                    wx.showToast({
                        title: "请填写你的手机号码",
                        icon: 'success'
                    })
                    return false
                }
            }
            wx.showToast({
                title: "加载中",
                icon: 'loading'
            })
        	api.getRequest('/SameCity/SameCityActivity/saveUserInfo',{
                user_id : that.data.userInfo.user_id,
                sex : that.data.userInfo.sex,
                job : that.data.userInfo.job,
                intro : that.data.userInfo.intro,
                real_name : that.data.userInfo.real_name,
                mobile : that.data.userInfo.mobile,
                province : that.data.userInfo.province,
                city : that.data.userInfo.city
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