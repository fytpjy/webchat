var api = require('../../../util/api.js');
var config = require('../../../config.js');

Page({
    data:{
        code: "",
        title: "",
        target: ""
    },
    onLoad: function(params){
        let userInfoMes = wx.getStorageSync('user_data');
        this.setData({
            code: config.host+"/SameCity/SameCityActivity/signQRcodes?user_id="+userInfoMes.user_id+"&user_token="+userInfoMes.user_token+"&activity_id="+params.id,
            title: params.title,
            target: params.target
        })
    }
})