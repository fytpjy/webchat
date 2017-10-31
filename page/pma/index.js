var api = require('../../util/api.js');

Page({
    data:{
        activity_id: "",
        create_user: [],
        user_list: [],
        user_width:"",
        intro_width:"",
        len:"",
        merberlen: ""
    },
    onLoad: function(params) {
        console.log(params);
        this.setData({
            activity_id: params.id
        })
        this.getData();
    },
    onShow: function(){
        let user_data = wx.getStorageSync('user_data');
        this.setData({
            user_id: user_data.user_id
        })
    },
    onReady: function(e) {
        console.log(e);
    },
    getData: function(){
        wx.showToast({
            title: "加载中",
            icon: 'loading'
        })
        let that = this;
        api.getRequest('/SameCity/SameCityActivity/sharedReadInfo',{
            activity_id: this.data.activity_id
        })
        .then((json) => {
            let len=json.data.pma_list.length
            if(json.code==1){
                that.setData({
                    create_user: json.data.pma_list,
                    user_list: json.data.user_list,
                    user_width: 160*len+30,
                    intro_width: 540*json.data.user_list.length+30,
                    len:len,
                    merberlen: json.data.user_list.length
                })
            }else{
                wx.showToast({
                    title: json.msg,
                    icon: 'success'
                })
            }
        })
    },
    // onShareAppMessage: function () {
    //     return {
    //         title: "有书同城小程序",
    //         desc: "来看看哪些伙伴参加了活动，互相了解下",
    //         path: "/page/pma/index"
    //     }
    // }
})