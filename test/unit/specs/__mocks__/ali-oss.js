/*
 * @author: xiejiaxin
 * @Date: 2020-12-20 10:29:49
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2020-12-29 17:33:01
 * @description: 模拟OSS
 */
const multipartUpload = jest.fn((fileName, file, callBack) => {
    // 模拟传入函数，函数会被执行，影响外面的值
    if (callBack && typeof callBack.progress == 'function') {
        callBack.progress(1)
    }
    return Promise.resolve({
        res: {
            statusCode: 200,
            requestUrls: ['test/test/20201223/20201223212345_cefj.txt?']
        }
    });
}).mockImplementationOnce((fileName, file, callBack) => {
    if (callBack && typeof callBack.progress == 'function') {
        callBack.progress(1)
    }
    return Promise.resolve({
        res: {
            statusCode: 200,
            requestUrls: ['test/stes.txt']
        }
    });
}).mockImplementationOnce((fileName, file, callBack) => {
    if (callBack && typeof callBack.progress == 'function') {
        callBack.progress(1)
    }
    return Promise.resolve({
        res: {
            statusCode: 200,
            requestUrls: ['test/stes.txt?']
        }
    });
}).mockImplementationOnce(() => {
    return Promise.reject('failed');
}).mockImplementationOnce(() => {
    return Promise.resolve({
        res: {
            statusCode: 1
        }
    });
});
// 获取下载文件url方法
const signatureUrl = jest.fn().mockImplementation(() => {
    return 'success-url';
});
let OSS = jest.fn().mockImplementation(() => {
    return {
        multipartUpload,
        signatureUrl
    }
});

module.exports = OSS;