var config = require('../config.js');
var api = require('api.js');

module.exports = {

    doWXLogin: function(callback) {
        let app = getApp();
        var that = this;
        wx.login({
            success: function(res) {
                let code = res.code;
                wx.getUserInfo({
                    success: function(resp) {
                        that.getYSUserInfo(code, resp, callback);
                    },
                    fail: function(ress){
                        wx.showToast({
                            title: "授权失败，请允许授权",
                            icon: 'success'
                        })
                    }
                });
            }
        })
    },

    // 获取youshu的用户信息
    getYSUserInfo: function(code, resp, callback) {
        let that = this;
        api.getRequest('/WpLogin/getUserInfoByWp', {
            code: code,
            signature: resp.signature,
            rawData: resp.rawData,
            encryptedData: resp.encryptedData,
            iv: resp.iv,
            type: "samecity"
        })
        .then((infoResp) => {
            if(infoResp.code==1){
                let app = getApp();
                if(infoResp.data != null) {
                    app.globalData.hasLogin = true;
                    app.globalData.hasUserInfo = true;
                    app.globalData.userInfoMes = infoResp.data;
                    wx.setStorage({"key": 'user_data', "data": infoResp.data});
                }
                callback(infoResp.data);
                //that.updateLocation();
            }else{
                app.globalData.hasLogin = false;
            }
        });
    },

    // 更新用户地理位置
    updateLocation: function(callback){
        wx.getLocation({
           type: 'gcj02',
           success: function(res) {
                console.log("更新用户地理位置")
                let app = getApp();
                app.globalData.userLngLat = res;
                if(callback){callback()}
           },
            fail: function(e){
                wx.showToast({
                  title: "地理位置定位失败，请开启定位",
                  icon: 'success',
                })
           }
        })
    },

    tUrl: function(){
        wx.getStorage({
            key: 'isVip',
            success: function(res) {
                if(res.data=="true"){
                    wx.switchTab({
                        url: '/page/home/index'
                    })
                }
            },
            fail: function(){
                try {
                    wx.setStorageSync('isVip', 'true')
                } catch (e) {

                }
            }
        })
    }

};