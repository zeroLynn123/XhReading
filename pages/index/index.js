var app = getApp();
Page({
  data: {
    isLogin: true,
    userName: '',
    password: '',
    page: 1,
    per: 10,
    currentTabIndex: 0,
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏
    setdata: [],
    test: 0,
  },
  //一级目录点击刷新
  click: function (e) {
    var that = this;
    this.setData({
      test: e.currentTarget.dataset.index
    })
    var index = e.currentTarget.dataset.index
    this.setData({
      currentTabIndex: index
    })
    wx.request({
      url: 'https://xhreading.xy-mind.com/api/home/catalogs',
      method: 'GET',
      header: {
        Usertoken: app.globalData.Usertoken
      },
      success: function (res) {
        var imgUrl = ['../../imgs/pumpkin.png', '../../imgs/leaf.png', '../../imgs/back_b.png', '../../imgs/YanTao.png']
        for (var i = 0; i < res.data.data[that.data.test].children.length; i++) {
          res.data.data[that.data.test].children[i].avater = imgUrl[i % 4];
        }
        if (res.data.status == 201) {
          that.setData({//如果在sucess直接写this就变成了wx.request()的this了.必须为getdata函数的this,不然无法重置调用函数
            setdata: res.data.data,
          })
        }
      }
    })
  },
  // 列表数据
  // 首页
  onImgJump: function (e) {
    wx.navigateTo({
      url: '../article/article'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://xhreading.xy-mind.com/api/home/catalogs',
      method: 'GET',
      header: {
        Usertoken: app.globalData.Usertoken
      },
      success: function (res) {
        console.log(res)
        var imgUrl = ['../../imgs/pumpkin.png', '../../imgs/leaf.png', '../../imgs/back_b.png', '../../imgs/YanTao.png']
        for (var i = 0; i < res.data.data[that.data.test].children.length; i++) {
          res.data.data[that.data.test].children[i].avater = imgUrl[i % 4];
        }
        if (res.data.status == 201) {
          that.setData({//如果在sucess直接写this就变成了wx.request()的this了.必须为getdata函数的this,不然无法重置调用函数
            setdata: res.data.data,
          })
        }
      }
    })
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
    this.setData({
      // currentTabIndex: 0
    })
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
    // console.log("上拉刷新");

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})