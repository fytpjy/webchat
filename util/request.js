var Promise = require('es6-promise.min').Promise;

module.exports = (options) => {
    return new Promise((resolve, reject) => {
        options = Object.assign(options, {
            success(result) {
                if (result.statusCode === 200) {
                    resolve(result.data);
                } else {
                    reject(result);
                }
            },

            fail: reject,
        });

        options.success = function(result) {
            if (result.statusCode == 200) {
                resolve(result.data);
            } 
            else {
                reject(result);
            }
        };
        options.fail = reject;
        wx.request(options);
    });
};