var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    passWord: '',
    showIcon:false,
    showPass:false,
  },
  //获取输入框的账号密码
  userNameInput: function (e) {
    if (e.detail.value){
      this.setData({
        userName: e.detail.value,
        showIcon:true
      })
    }else{
      this.setData({
        showIcon: false
      })
    }
  },
  passwordInput: function (e) {
    if (e.detail.value){
      this.setData({
        passWord: e.detail.value,
        showPass: true
      })
    }else{
        showPass: false
    } 
  },
  //清空用户
  clearText:function(){
    this.setData({
      userName: '',
      showIcon: false
    })
    return;
  },
  //清空密码
  clearPass: function () {
    this.setData({
      passWord: '',
      showPass: false
    })
    return;
  },
  // 登录
  logIn: function (e) {
    wx.request({
      url: 'https://xhreading.xy-mind.com/api/users/login',
      data: {
        nickname: this.data.userName,
        password: this.data.passWord
      },
      method: 'POST',
      success: function (res) {
        if (res.data.status === 201) {
          app.globalData.Usertoken = res.data.data.authentication_token
          app.globalData.CurrentStr = res.data.data.current_sign_in_at
          app.globalData.name = res.data.data.name;
          app.globalData.employeNum = res.data.data.nickname;
          wx.switchTab({
            url: '../index/index'
          })
        } else if (res.data.status === 200) {
          wx.showModal({
            title: '提示',
            content: '请输入正确的账号名密码',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
              } else if (res.cancel) {
              }
            }
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  //跳转身份验证页面
  forget: function (e) {
    wx.navigateTo({
      url: '../cation/cation',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})