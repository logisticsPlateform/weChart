// pages/publish/publish.js

// 引入配置
var config = require('../../config');

// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
});

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
});

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();

  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  });
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadUrl: config.service.uploadUrl,
    imgUrl: [],
    focus:"aaaa",
    input_content:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload')
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('onReachBottom')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log('onShareAppMessage')
  },
   doUpload:function() {
     console.log('doUpload')
    var that = this

    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var filePath = res.tempFilePaths
        console.log('filePath',filePath)
        that.setData({
          imgUrl: filePath
        })
        
      },
      fail: function (e) {
        console.error(e)
      }
    })
  },
   previewImage:function() {
     console.log('previewImage')
     wx.previewImage({
       // current:filePath,
       // urls:[filePath]
       current: this.data.imgUrl,
       urls: [this.data.imgUrl],
       success: function (res) {
         console.log('预览图片')
       }
     })
   },
   uploadImage:function(i,len,e){
     var that = this;
     wx.uploadFile({
       url: that.data.uploadUrl,
       //      filePath: filePath,
       filePath: this.data.imgUrl[i],
       name: 'file',
 /*      formData: {
         'user': 'test'
       },
 */  
       success: function (res) {
         showSuccess('上传图片成功')
         res = JSON.parse(res.data)
         console.log(res)
         console.log(res.imageUrl)
       },

       fail: function (e) {
         console.error(e)
       },
       complete:function(){
         i++;
         if (i == len) {
           that.setData({
             imgUrl: ''
           })
           that.submitdata(e);         
         }
         else {  
           that.uploadImage( i, len,e);
         }

       }
     })
   },
   publish:function(e){
     console.log('publish')
     var that = this;
     var filePath =  this.data.imgUrl
     var i = 0;
     var len = filePath.length;
     console.log('this.data.imgUrl', filePath)
     console.log('that.data.imgUrl.lenth',len)
    if(len != 0){
     this.uploadImage(i,len,e);
    }else{
      that.submitdata(e);
     
    }
       },
   //表单提交
   submitdata:function(e){
     var that = this;
     console.log('表单提交')
     var formData = e.detail.value;
     console.log('formdata=======>', formData)
     wx.request({
       url: 'http://localhost:8080/publish/content',
       method: 'POST',
       data: formData,
       header: {
         'Content-Type': 'application/json'
       },
       success: function (res) {
         console.log('执行到这里');
         that.formReset();
         //   console.log(res.data)
         //   that.modalTap();
       }
     })
   }
    ,

   formSubmit: function (e) {
     var that = this;
     that.publish(e);

     
   },
   formReset: function () {
     var that = this;
     console.log('form发生了reset事件')
     that.setData({
       input_content:""
     })
     console.log('表单置空')
     
   }
})

