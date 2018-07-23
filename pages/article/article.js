// pages/article/article.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    document: [],
    size: null,
    saveData: [],
    page: 1,
    per: 10,
    docData: [],
    disabled:true,
    isEmpty: true,
  },
  //打开文件
  openDocuments: function (event) {
    var that = this;
    that.setData({
      disabled:false
    })
    var id = event.currentTarget.dataset.id;
    var url = 'https://xhreading.xy-mind.com'
    var filePath = url + event.currentTarget.dataset.src;
    // // 打开文档
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
  //下载数据到本地
  downData: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.item.id;
    wx.getStorage({
      key: 'key',
      success: function (res) {         
        that.data.saveData = res.data;
        var flag = true;
        for (var i = 0; i < res.data.length; i++){
          if (id == res.data[i].id){
            flag = false; 
          }
        }
        if(!flag){
          wx.showModal({
            title: '提示',
            content: '文件不能重复下载哦',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
              } else if (res.cancel) {
              }
            }
          })
        }else{
          that.data.size += e.currentTarget.dataset.item.file_size;
          if (that.data.size < 10485760){
            that.data.saveData = [...that.data.saveData, e.currentTarget.dataset.item]
            wx.setStorage({
              key: "key",
              data: that.data.saveData
            })
            wx.showModal({
              title: '提示',
              content: '下载已完成 在个人中心查看',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                } else if (res.cancel) {
                }
              }
            })
          } else{
            wx.showModal({
              title: '提示',
              content: '文件超过10M，不能下载哦',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                } else if (res.cancel) {
                }
              }
            })
          }
        }  
      },
      fail: function () {
        that.data.saveData = [...that.data.saveData, e.currentTarget.dataset.item]
        wx.setStorage({
          key: "key",
          data: that.data.saveData
        })
      },
    })
  },
  // 按照文件标题搜索
  searchValueInput: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      searchValue: value,
    });
    wx.request({
      url: "https://xhreading.xy-mind.com/api/home/doc_files",
      method: "GET",
      data: {
        catalog_id: that.data.id,
        name: value
      },
      header: {
        Usertoken: app.globalData.Usertoken,
        CurrentStr: app.globalData.CurrentStr
      },
      success: function (res) {
        if (res.data.status == 201) {
          that.setData({
            document: res.data.data
          })
        }
      }
    })
  },
  //收藏数据
  clickCollect: function (e) {
    var that = this
    var index = e.target.dataset.index;
    var id = e.target.dataset.id;
    var list = that.data.document;
    if (list[index]) {
      list[index].is_c = true;
    } else {
      // list[index].file_name = false;
    }
    that.setData({
      document: list
    })
    wx.request({
      url: "https://xhreading.xy-mind.com/api/users/click_collection",
      method: "POST",
      data: {
        doc_file_id: id,
        c_type: "Collection",
      },
      header: {
        Usertoken: app.globalData.Usertoken,
        CurrentStr: app.globalData.CurrentStr
      },
      success: function (res) {
        if (res.data.status == 201) {
          wx.showToast({
            title: "收藏成功",
            icon: 'success',
            duration: 500,
            mask: true
          })
        }
      }
    })
  },
  // 取消收藏
  cancelCollect: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var list = that.data.document;
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
      success: function (res) {
        if (res.data.status == 200) {
          wx.showToast({
            title: '取消收藏',
            icon: 'success',
            duration: 1000,
            mask: true
          })
          for (var i = 0; i < list.length; i++) {
            if (list[i].id == id) {
              list[i].is_c = false
              that.setData({
                document: list
              })
            }
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    this.setData({
      id: options.id
    }),
    wx.request({
      url: "https://xhreading.xy-mind.com/api/home/doc_files",
      method: "GET",
      data: {
        catalog_id: that.data.id
      },
      header: {
        Usertoken: app.globalData.Usertoken,
        CurrentStr: app.globalData.CurrentStr
      },
      success: function (res) {
        console.log(res)
        if (res.data.status == 201) {
          console.log(res);
          var data = res.data.data.length
          if (data) {
            that.setData({
              document: res.data.data
            })
          } else {
            that.setData({
              isEmpty: false
            })
          }
        }
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.searchValue) {
      var that = this;
      var value = e.detail.value;
      that.setData({
        searchValue: value,
      });
      wx.request({
        url: "https://xhreading.xy-mind.com/api/home/doc_files",
        method: "GET",
        data: {
          catalog_id: that.data.id,
          name: value,
          per: that.data.per += 10
        },
        header: {
          Usertoken: app.globalData.Usertoken,
          CurrentStr: app.globalData.CurrentStr
        },
        success: function (res) {
          if (res.data.status == 201) {
            that.data.docData = res.data.data
            if (that.data.document.length && that.data.document.length < res.data.total_count) {
              wx.showToast({
                title: "加载中...",
                icon: 'success',
                mask: true,
                success: function () {
                  that.setData({
                    document: that.data.docData
                  })
                }
              })
            }
          }
        }
      })
    } else {
      var that = this;
      this.setData({
        id: that.data.id
      }),
      wx.request({
        url: "https://xhreading.xy-mind.com/api/home/doc_files",
        method: "GET",
        data: {
          catalog_id: that.data.id,
          per: that.data.per += 10
        },
        header: {
          Usertoken: app.globalData.Usertoken,
          CurrentStr: app.globalData.CurrentStr
        },
        success: function (res) {
          if (res.data.status == 201  ) {
            that.data.docData = res.data.data
            if (that.data.document.length && that.data.document.length < res.data.total_count) {
              wx.showToast({
                title: "加载中...",
                icon: 'success',
                mask: true,
                success: function () {
                  that.setData({
                    document: that.data.docData
                  })
                }
              })
            }
          }
        }
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
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
})