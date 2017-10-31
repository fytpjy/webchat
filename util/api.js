var request = require('request.js');
var config = require('../config.js');

module.exports = {
    getUrl(route) {
        if(route.indexOf('http') >= 0)
            return route;
        else
            return `${config.host}${config.basePath}${route}`;
    },

    getPostData(data) {
    	let app = getApp();
    	let postData = data !=  null ? data : {};
        if(app.globalData.hasLogin) {
            postData.user_id = app.globalData.userInfoMes.user_id;
            postData.user_token = app.globalData.userInfoMes.user_token;
        }
        // postData.user_id = postData.user_id?postData.user_id:"511326";
        // postData.user_token = "d4a7f1e0f73818e96d67e0baf3d567ae";
        return postData;
    }, 

    getRequest(url, data) {
    	let fullUrl = this.getUrl(url),
    		postData = this.getPostData(data);
    	return request({
            method: 'POST',
            url: fullUrl,
            header: {'content-type': 'application/json'},
            data: postData,
        });
    },
};