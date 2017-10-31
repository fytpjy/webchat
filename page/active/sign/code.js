
Page({
    data:{
        avatar: "",
        name: "",
        title: "",
        target: ""
    },
    // onShareAppMessage: function () {
    //     return {
    //         title: "有书同城小程序",
    //         desc: "我正在参加xx（城市信息）同城共读会线下活动",
    //         path: "/page/active/report/index"
    //     }
    // },
    onShow: function(){
        let app = getApp();
        let codecheck = app.globalData.codecheck;
        this.setData({
            avatar: codecheck.avatar,
            name: codecheck.name,
            title: codecheck.title,
            target: codecheck.target,
        })
    }
})