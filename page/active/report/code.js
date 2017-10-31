var api = require('../../../util/api.js');

Page({
    data:{
    	qrcode_img: ""
    },
    onLoad: function(params) {
        let app = getApp();
        console.log(app)
        this.setData({
            qrcode_img: app.globalData.qrcode_img
        })
    }
})