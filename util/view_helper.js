module.exports = {
    // 显示loading提示
    showLoading: function(that, loadingMessage) {
        that.setData({
            showLoading: true,
            loadingMessage: loadingMessage
        });
    },

    // 隐藏loading提示
    hideLoading: function(that) {
        that.setData({
            showLoading: false,
            loadingMessage: '',
        });
    },

    // 显示toast消息
    showToast: function(that, toastMessage) {
        that.setData({
            showToast: true,
            toastMessage: toastMessage,
        });
    },

    // 隐藏toast消息
    hideToast: function(that) {
        that.setData({
            showToast: false,
            toastMessage: ''
        });
    },
};