
module.exports = {

    // 跳转活动详情链接
    dirctionUrl(e){
        wx.navigateTo({
            url: e.target.dataset.url
        })
    },

    // 跳转成员链接
    dirctionMeber(e){
        console.log("跳转成员链接")
        console.log(e)
        wx.navigateTo({
            url: e.currentTarget.dataset.url
        })
    },

    // 跳转详情页面
    dirctionLiUrl(e){
        wx.navigateTo({
            url: e.currentTarget.dataset.url
        })
    },

};