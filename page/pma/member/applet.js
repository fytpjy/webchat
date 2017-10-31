Page({
  data:{
      avatar: "",
  },
  onLoad:function(options){
      let userInfoMes = wx.getStorageSync('user_data');
      this.setData({
        avatar: userInfoMes.avatar
      })
  },
    onShareAppMessage: function () {
        return {
            title:"我的小程序码",
            path: "/page/pma/member/applet"
        }
    }
})