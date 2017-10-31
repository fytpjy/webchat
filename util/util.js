var userLogin = require('login.js');

module.exports = {
    // 一维数组转二维数组
    listToMatrix(list, elementsPerSubArray) {
        let matrix = [], i, k;

        for (i = 0, k = -1; i < list.length; i += 1) {
            if (i % elementsPerSubArray === 0) {
                k += 1;
                matrix[k] = [];
            }

            matrix[k].push(list[i]);
        }

        return matrix;
    },

    // 为promise设置简单回调（无论成功或失败都执行）
    always(promise, callback) {
        promise.then(callback, callback);
        return promise;
    },

    // 获取日期
    getDateStr(AddDayCount) {
        var dd = new Date(); 
        dd.setDate(dd.getDate()+AddDayCount);
        var y = dd.getFullYear(); 
        var m = dd.getMonth()+1;
        var d = dd.getDate(); 
        return y+"-"+m+"-"+d; 
    },

    //获取字符长度
    getTextNum(str){
        var intLength=0 
        for (var i=0;i<str.length;i++) { 
            if ((str.charCodeAt(i) < 0) || (str.charCodeAt(i) > 255)) 
                intLength=intLength+2 
            else 
                intLength=intLength+1    
        } 
        return intLength 
    },

    //跳转url
    getUrl(type){
        if(type){
            switch(type){
                case "report":
                    return "/page/active/report/index"
                break;
                case "comment":
                    return "/page/active/comment/index"
                break;
                case "signcode":
                    return "/page/active/sign/index"
                break;
                case "none":
                    return "none"
                break;
            }
        }else{
            return 
        }
    },

    //检查用户登陆信息
    checkUserInfo(callback){
        let userInfoMes = wx.getStorageSync('user_data');
        if(userInfoMes != null && userInfoMes != "" && userInfoMes.user_id) {
            let app = getApp();
            app.globalData.hasLogin = true;
            app.globalData.hasUserInfo = true;
            app.globalData.userInfoMes = userInfoMes;
            if(!app.globalData.userLngLat){
                callback?userLogin.updateLocation(callback):"";
            }else{
               callback?callback():"";
            }
        }
        else {
            userLogin.doWXLogin(function(userData){
                let app = getApp();
                app.globalData.hasLogin = true;
                app.globalData.hasUserInfo = true;
                app.globalData.userInfoMes = userData;
                if(!app.globalData.userLngLat){
                    callback?userLogin.updateLocation(callback):"";
                }else{
                   callback?callback():"";
                }
            })
        }    
    }
};