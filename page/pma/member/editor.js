var api = require('../../../util/api.js');

Page({
    data:{
        keyvalue: true,
        userInfo: "",
        inputBox: {
            show: true,
        },
        sexBox: {
            show: true,
            mtf: [
                {
                    title: "男",
                    value: "1",
                    active: true
                },
                {
                    title: "女",
                    value: "2",
                    active: true
                }
            ]
        },
        textBox: {
            show: true,
        },
        addrBox: {
            show: true,
        },
        typeBox: "" ,  //编辑字段
        wordLen: 120,

        provinceArray: [],
        cityArray: [],
        provinceIndex: 0,
        cityIndex: 0,

        provinceArrayList: [],
        cityArrayList: [],
    },
    onLoad: function(params){
        let app = getApp();
        this.setData({
            type: params.type,
            userInfo: app.globalData.userInfo
        })
        switch(params.type){
            case "sex":
                let lData = this.data.sexBox;
                if(this.data.userInfo.sex==1){
                    lData.mtf[0].active = false
                }else{
                    lData.mtf[1].active = false
                }
                lData.show = false;
                this.setData({
                    sexBox: lData
                })
            break;
            case "text":
                this.setData({
                    textBox: {
                        show: false,
                        value: this.data.userInfo.intro,
                        code: "个人介绍"
                    }
                })
            break;
            case "job":
                this.setData({
                    inputBox: {
                        show: false,
                        value: this.data.userInfo.job,
                        code: "职业"
                    }
                })
            break;
            case "name":
                this.setData({
                    inputBox: {
                        show: false,
                        value: this.data.userInfo.real_name,
                        code: "姓名"
                    }
                })
            break;
            case "mobile":
                this.setData({
                    inputBox: {
                        show: false,
                        value: this.data.userInfo.mobile,
                        code: "手机号"
                    }
                })
            break;
            case "addr":
                let that = this;
                let app = getApp();
                console.log(app.globalData.userInfo)
                api.getRequest('/SameCity/SameCityActivity/provinceList')
                .then((json) => {
                    if(json.code==1){
                        let pData = new Array();
                        let pIndex = 0;
                        let pId;
                        json.data.list.forEach(function(res,index){
                            pData.push(res.name)
                            if(res.name == app.globalData.userInfo.province){
                                pIndex = index;
                                pId = res.province_id
                            }
                        })

                        that.setData({
                            provinceArrayList: json.data.list,
                            provinceArray: pData,
                            provinceIndex: pIndex,
                        })

                        console.log(pId?pId:"1")

                        that.getCityData(pId?pId:"1");
                        
                    }else{
                        wx.showToast({
                            title: json.msg,
                            icon: 'success'
                        })
                    }
                })
                this.setData({
                    addrBox: {
                        show: false,
                    }
                })
            break;
        }
    },
    bindProvincePickerChange: function(e){
        // 省份更改
        let that = this;
        that.setData({
            provinceIndex: e.detail.value
        })
        that.getCityData(that.data.provinceArrayList[e.detail.value].province_id)
    },
    formSubmit: function(e){
        console.log(e.detail.value)
        let app = getApp();
        let lData = app.globalData.userInfo;
        let that = this;
        switch(that.data.type){
            case "job":
                if(e.detail.value.inputbox){
                    lData.job = e.detail.value.inputbox;
                    that.setData({
                        userInfo: lData
                    })
                }else{
                    wx.showToast({
                        title: "职业不能为空",
                        icon: 'success'
                    })
                    return false;
                }
            break;
            case "name":
                lData.real_name = e.detail.value.inputbox;
                that.setData({
                    userInfo: lData
                })
            break;
            case "mobile":
                var reg = /^1[3|4|5|7|8][0-9]{9}$/;
                if(reg.test(e.detail.value.inputbox)){
                    lData.mobile = e.detail.value.inputbox;
                    that.setData({
                        userInfo: lData
                    })
                }else{
                    wx.showToast({
                        title: "请填写正确手机号码",
                        icon: 'success'
                    })
                    return false;
                }
            break;
            case "text":
                if(e.detail.value.textbox){
                    lData.intro = e.detail.value.textbox;
                    that.setData({
                        userInfo: lData
                    })
                }else{
                    wx.showToast({
                        title: "个人介绍不能为空",
                        icon: 'success'
                    })
                    return false;
                }
                
            break;
            case "addr":
                lData.province = this.data.provinceArray[this.data.provinceIndex];
                lData.city = this.data.cityArray[this.data.cityIndex];
                that.setData({
                    userInfo: lData
                })
            break;
        }

        app.globalData.userInfo = that.data.userInfo;
        wx.navigateBack({
            delta: 1
        })
    },
    keyfunc: function(e){
        if(!e.detail.value){
            this.setData({
                keyvalue: false
            })
        }else{
            this.setData({
                keyvalue: true
            })
        }
    },
    bindCityPickerChange: function(e) {
        // 城市更改
        let that = this;
        that.setData({
            cityIndex: e.detail.value
        })
    },
    radioChange: function(e) {
        let select = e.detail.value;
        let sexTitle = this.data.sexBox;
        if(select==1){
            sexTitle.mtf[0].active = false;
            sexTitle.mtf[1].active = true;
        }else if(select==2){
            sexTitle.mtf[0].active = true;
            sexTitle.mtf[1].active = false;
        }else{

        }
        let lData = this.data.userInfo;
        lData.sex = select;
        this.setData({
            sexBox: sexTitle,
            userInfo: lData
        })
    },
    sexSelect: function(e){
        let userData = this.data.userInfo;
        userData.sex = e.target.dataset.value;
        this.setData({
            userInfo: userData
        })
    },
    getUploadConent: function(e) {
        var len=120-e.detail.value.length;
        this.setData({
            wordLen: len
        })
        this.keyfunc(e);
    },
    getCityData: function(provinceid){
        let that = this;
        let app = getApp();
        api.getRequest('/SameCity/SameCityActivity/cityList',{
            province_id: String(provinceid)
        })
        .then((json) => {
            if(json.code==1){
                let cData = new Array();
                let cIndex = 0;
                json.data.list.forEach(function(res,index){
                    cData.push(res.name)
                    if(res.name == app.globalData.userInfo.city){
                        cIndex = index
                    }
                })

                that.setData({
                    cityArrayList: json.data.list,
                    cityArray: cData,
                    cityIndex: cIndex,
                })
            }else{
                wx.showToast({
                    title: json.msg,
                    icon: 'success'
                })
            }
        })
    }
})