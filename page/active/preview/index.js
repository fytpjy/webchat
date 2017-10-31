var api = require('../../../util/api.js');

Page({
    data:{
		title: "",          //活动主题
		target: "",         //共读目标
		start_time: "",     //开始时间
		end_time: "",       //结束时间
		location: "",       //活动地点
		limit_number: "",   //活动限制人数
		longitude: "",
		latitude: "",
		desc: "",           //活动介绍
		process_ids: [],    //流程id
	    wechatno: "",       //举办人二维码
		group_qrcode: "",   //群二维码
		active_type: [],
    },
    onLoad: function(){
    	let app = getApp();
    	let data = app.globalData.localdata;
        let typeArr = new Array();
        if(data.active_type.length>0){
            for(var i=0;i<data.active_type.length;i++){
                if(this.inArray(data.active_type[i].id,data.process_ids)){
                    typeArr.push(data.active_type[i])
                }
            }
        }
        data.active_type = typeArr;
    	data.process_ids = data.process_ids.join(",");
        data.start_time = data.date+" "+data.start_time+":00";
        data.end_time = data.date+" "+data.end_time+":00";
        data.location = data.location+" "+data.locationinfo;
        data.limit_number = data.limit_number?data.limit_number:'不限';
    	this.setData(data)
    },
    scancode: function(){
        wx.previewImage({
            current: this.data.qrcode,
            urls: [this.data.qrcode]
        })
    },
    saveData: function(){
        
    	api.getRequest('/SameCity/SameCityActivity/releaseActivities', this.data)
    	.then((json) => {
    	    if(json.code==1){
    	    	wx.navigateTo({
    	    	    url: '/page/active/success/index'
    	    	})
    	    }else{
    	    	wx.showToast({
    	    	    title: json.msg,
    	    	    icon: 'success',
    	    	})
    	    }
    	})
    },
    inArray: function(n,arr){
        var j = 0;
        for(var i in arr){
            if(arr[i]==n){
                return true
                j++
            }
        }
        if(j == 0){
            return false
        }
    }
})