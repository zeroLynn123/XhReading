var app = getApp()

Page({
  data: {
    currentTabIndex: 0,
    name: '',
    employeNum: '',
    // 收藏列表
    collectionList: [],
    size: null,
    // 下载列表
    edit: false,
    select_all: false,
    downList: [],
    // 最近浏览
    recentViewList: [],
    per:10,
    disabled: true,
    down_empty: true,
  },
  // 页面显示
  onShow: function () {
    this.getdownData()
    this.getCollectList()
  },
  // 页面隐藏
  onHide: function () {},
  // 页面关闭
  onUnload: function () {},
  // 页面加载
  onLoad: function (options) {
    let that = this
    that.setData({
      name: app.globalData.name,      
      employeNum: app.globalData.employeNum
    })
  },
  // tab栏切换
  onTabItemTap: function (e) {
    this.getCollectList()
    this.recentView()
    this.getdownData()
    var index = e.currentTarget.dataset.index
    this.setData({
      currentTabIndex: index
    })
  },
  // 获取收藏列表
  getCollectList: function () {
    var that = this
    wx.request({
      url: 'https://xhreading.xy-mind.com/api/users/list_c_b',
      method: 'GET',
      data: {
        c_type: 'Collection'
      },
      header: {
        Usertoken: app.globalData.Usertoken,
        CurrentStr: app.globalData.CurrentStr
      },
      success: function (res) {
        var data = res.data.data
        that.setData({
          collectionList : data
        })
      }
    })
  },
  // 取消收藏
  cancelCollect: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var data = []
    if (that.data.currentTabIndex == 0){
      data = that.data.collectionList
    } else {
      data = that.data.recentViewList
    }
    wx.request({
      url: 'https://xhreading.xy-mind.com/api/users/delete_collection',
      method: 'POST',
      data: {
        doc_file_id: id
      },
      header: {
        Usertoken: app.globalData.Usertoken,
        CurrentStr: app.globalData.CurrentStr
      },
      success: function(res){
        if(res.data.status == 200) {
          wx.showToast({
            title: '取消收藏',
            icon: 'success',
            duration: 500,
            mask: true
          })
          for(var i = 0; i < data.length; i++){
            if (data[i].id == id){
              data[i].is_c = false
              if(that.data.currentTabIndex == 0){
                that.setData({
                  collectionList: data
                })
              } else {
                that.setData({
                  recentViewList: data
                })
              }
            }
          }
        }
      }
    })
  },
  // 收藏
  collect: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    if (that.data.currentTabIndex == 0) {
      data = that.data.collectionList
    } else {
      data = that.data.recentViewList
    }
    wx.request({
      url: 'https://xhreading.xy-mind.com/api/users/click_collection',
      method: 'POST',
      data: {
        doc_file_id: id,
        c_type: 'Collection'
      },
      header: {
        Usertoken: app.globalData.Usertoken,
        CurrentStr: app.globalData.CurrentStr
      },
      success: function (res) {
        if (res.data.status == 201) {
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 500,
            mask: true
          })
          for (var i = 0; i < data.length; i++) {
            if (data[i].id == id) {
              data[i].is_c = true
              if (that.data.currentTabIndex == 0) {
                that.setData({
                  collectionList: data
                })
              } else {
                that.setData({
                  recentViewList: data
                })
              }
            }
          }
        }
      }
    })
  },
  // 获取下载列表
  getdownData: function () {
    let that = this
    wx.getStorage({
      key: 'key',
      success: function (res) {
        that.setData({
          downList: res.data
        })
      }
    })
  },
  // 打开文档
  openDocuments: function (e) {
    var that = this;
    that.setData({
      disabled: false
    })
    if (that.data.edit){
      return
    }
    var id = e.currentTarget.dataset.id
    var url = 'https://xhreading.xy-mind.com'
    var filePath = url + e.currentTarget.dataset.url
    wx.downloadFile({
      url: filePath,
      success: function (res) {
        var filePath = res.tempFilePath;
        wx.openDocument({
          filePath: filePath,
        }),
        that.setData({
          disabled: true
        })
      }
    })
    wx.request({
      url: "https://xhreading.xy-mind.com/api/users/click_collection",
      method: "POST",
      data: {
        doc_file_id: id,
        c_type: "Browser",
      },
      header: {
        Usertoken: app.globalData.Usertoken,
        CurrentStr: app.globalData.CurrentStr
      },
      success: function (res) {
      }
    })
  },
  // 点击弹出编辑
  edit: function () {
    let that = this
    that.setData({
      edit: true
    })
  },
  // 完成隐藏
  cancel_edit: function (e) {
    let that = this
    for(var i = 0; i < that.data.downList.length; i++){
      that.data.downList[i].checkStatu = false
    }
    that.setData({
      edit: false,
      select_all: false,
      downList: that.data.downList
    })
  },
  // 选择
  select: function (e) {
    var that = this
    let arr = []
    if (that.data.edit == false) {
      return
    } else {
      var arr2 = that.data.downList
      var index = e.currentTarget.dataset.id
      arr2[index].checkStatu = !arr2[index].checkStatu
      for (let i = 0; i < arr2.length; i++) {
        if (arr2[i].checkStatu) {
          arr.push(arr2[i])
        }
      }
      that.setData({
        downList: arr2
      })
    }
  },
  // 全选
  select_all: function () {
    let that = this
    that.setData({
      select_all: !that.data.select_all
    })
    if (that.data.select_all) {
      let arr = that.data.downList
      let arr2 = []
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].checkStatu == true) {
          arr2.push(arr[i])
        } else {
          arr[i].checkStatu = true
          arr2.push(arr[i])
        }
      }
      that.setData({
        downList: arr2
      })
    }
  },
  // 取消全选
  select_none: function () {
    let that = this
    that.setData({
      select_all: !that.data.select_all
    })
    let arr = that.data.downList
    let arr2 = []
    for (let i = 0; i < arr.length; i++) {
      arr[i].checkStatu = false
      arr2.push(arr[i])
    }
    that.setData({
      downList: arr2,
      middleArr: []
    })
  },
  // 删除
  del: function () {
    var that = this
    let arr = that.data.downList
    let arr2 = []
    if (arr.length) {
      var flag = true
      for (let i = 0; i < arr.length; i++) {
        if (!arr[i].checkStatu) {
          flag = false
          arr2.push(arr[i])
        }
      }
      if (!flag){
        wx.showModal({
          title: '提示',
          content: '是否删除？',
          success: function (res) {
            if(res.confirm){
              wx.setStorage({
                key: 'key',
                data: arr2,
              })
              that.setData({
                downList: arr2
              })
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '是否删除？',
          success: function(res){
            if(res.confirm){
              wx.removeStorage({
                key: 'key',
                data: arr2
              })
              that.setData({
                downList: arr2
              })
            }
          }
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请选择文件',
        showCancel: false
      })
    }
  },
  // 最近浏览
  recentView: function (e) {
    var that = this
    wx.request({
      url: 'https://xhreading.xy-mind.com/api/users/list_c_b',
      method: 'GET',
      data: {
        'c_type': 'Browser'
      },
      header: {
        Usertoken: app.globalData.Usertoken,
        CurrentStr: app.globalData.CurrentStr
      },
      success: function (res) {
        var data = res.data.data
        that.setData({
          recentViewList: data
        })
      }
    })
  },
  // 文件下载
  downLoadFile: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.item.id
    wx.getStorage({
      key: 'key',
      success: function(res) {
        var data = res.data
        var flag = true
        for(var i = 0; i < data.length; i++){
          if(data[i].id == id){
            flag = false
          }
        }
        if(!flag){
          wx.showModal({
            title: '提示',
            content: '文件不能重复下载',
            showCancel: false,
            success: function (res) {
              console.log('数据重复啦')
            }
          })
        } else {
          that.data.size += e.currentTarget.dataset.item.file_size
          if (that.data.size < 10485760){
            that.data.downList = [...that.data.downList, e.currentTarget.dataset.item]
            wx.setStorage({
              key: 'key',
              data: that.data.downList
            })
            wx.showModal({
              title: '提示',
              content: '下载已完成 在下载列表查看',
              showCancel: false
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '文件超过10M，不能下载哦',
              showCancel: false
            })
          }
        }
      },
      fail: function(){
        that.data.downList = [...that.data.downList, e.currentTarget.dataset.item]
        wx.setStorage({
          key: 'key',
          data: that.data.downList,
        })
        wx.showModal({
          title: '提示',
          content: '下载已完成 在下载列表查看',
          showCancel: false
        })
      }
    })
  },
  //上拉加载更多
  onReachBottom: function () {
    var that = this
    if (that.data.currentTabIndex == 0) {
      wx.request({
        url: 'https://xhreading.xy-mind.com/api/users/list_c_b',
        method: 'GET',
        data: {
          'c_type': 'Collection',
          'per': that.data.per += 10
        },
        header: {
          Usertoken: app.globalData.Usertoken,
          CurrentStr: app.globalData.CurrentStr
        },
        success: function (res) {
          if (res.data.status == 200) {
            var data = res.data.data
            if (that.data.collectionList.length && that.data.collectionList.length < res.data.total_count) {
              wx.showToast({
                title: "加载中...",
                icon: 'success',
                mask: true,
                success: function () {
                  that.setData({
                    collectionList: data
                  })
                }
              })
            }
          }
        }
      })
    } else if (that.data.currentTargetIndex == 2) {
      wx.request({
        url: 'https://xhreading.xy-mind.com/api/users/list_c_b',
        method: 'GET',
        data: {
          'c_type': 'Browser',
          'per': that.data.per += 10
        },
        header: {
          Usertoken: app.globalData.Usertoken,
          CurrentStr: app.globalData.CurrentStr
        },
        success: function (res) {
          if (res.data.status == 200) {
            var data = res.data.data
            if (that.data.recentViewList.length && that.data.recentViewList.length < res.data.total_count) {
              wx.showToast({
                title: "加载中...",
                icon: 'success',
                mask: true,
                success: function () {
                  that.setData({
                    recentViewList: data
                  })
                }
              })
            }
          }
        }
      })
    }
  }
})
