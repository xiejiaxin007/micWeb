/*
 * @author: xiejiaxin
 * @Date: 2020-12-20 10:26:08
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-01-04 16:24:45
 * @description: 上传相关方法测试用例
 */
import { createLocalVue, mount } from '@vue/test-utils';
import mockAxios from '#/__mocks__/axios.js';
// 模拟OSS
const OSS = require('ali-oss');
jest.mock('ali-oss');
const localVue = createLocalVue()
import upload from '@/assets/js/upload/upload.js';
// 保留console方法
const originConsole = console.log;
let client;

describe('上传upload相关测试', () => {
    beforeEach(() => {
        upload.install(localVue);
    });
    afterEach(() => {
        mockAxios.mockClear();
        OSS.mockClear();
    });
    afterAll(() => {
        localVue.destroy();
    });
    it('测试创建oss对象--createOssClient方法', async() => {
        // 模拟签名请求
        mockAxios.get = jest.fn().mockImplementationOnce(() => {
            return Promise.resolve({
                data: {
                    code: 0,
                    data: {
                        host: 'https://comjia-1.oss-cn-beijing.aliyuncs.com',
                        AccessKeyId: 'LTAI4FkD1jAiSJoTgzxQoD4m',
                        AccessKeySecret: 'LTAI4FkD1jAiSJoTgzxQoD4m',
                        stsToken: '3'
                    }
                }
            });
        }).mockImplementationOnce(() => {
            return Promise.reject('get failed');
        }).mockImplementationOnce(() => {
            return Promise.resolve({
                data: {
                    code: 1,
                    data: {}
                }
            });
        }).mockImplementationOnce(() => {
            return Promise.resolve({
                data: {
                    code: 0,
                    data: {
                        host: '',
                        AccessKeyId: 'LTAI4FkD1jAiSJoTgzxQoD4m',
                        AccessKeySecret: 'LTAI4FkD1jAiSJoTgzxQoD4m',
                        stsToken: '3'
                    }
                }
            });
        }).mockImplementationOnce(() => {
            return Promise.resolve({
                data: {
                    code: 0,
                    data: {
                        host: 'https://comjia-1.oss-cn-beijing.aliyunc./',
                        AccessKeyId: 'LTAI4FkD1jAiSJoTgzxQoD4m',
                        AccessKeySecret: 'LTAI4FkD1jAiSJoTgzxQoD4m',
                        stsToken: '3'
                    }
                }
            });
        });
        console.log = jest.fn(); 
        // 第一次访问--正常
        client = await localVue.prototype.createOssClient();
        expect(client).toBeTruthy();
        // 第二次访问走catch
        const resultSec = await localVue.prototype.createOssClient();
        expect(resultSec).toBeFalsy();
        expect(console.log).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith('get failed');
        // 恢复console
        console.log = originConsole;
        // 第三次访问，resolve，但是code！==0
        const resultNext = await localVue.prototype.createOssClient();
        expect(resultNext).toBeFalsy();
        // 第四次访问，host为空
        const resultFour = await localVue.prototype.createOssClient();
        expect(resultFour).toBeFalsy();
        // 第五次访问，host格式不正规
        // const resultFive = await localVue.prototype.createOssClient();
        // expect(resultFive).toBeFalsy();
    });
    it('测试下载重命名--downloadFileFromOss方法逻辑', async() => {
        mockAxios.get = jest.fn(() => {
            return Promise.resolve({
                data: {
                    code: 0,
                    data: {
                        host: 'https://comjia-1.oss-cn-beijing.aliyuncs.com',
                        AccessKeyId: 'LTAI4FkD1jAiSJoTgzxQoD4m',
                        AccessKeySecret: 'LTAI4FkD1jAiSJoTgzxQoD4m',
                        stsToken: '3',
                        dir: 'test/'
                    }
                }
            });
        });
        const result = await localVue.prototype.downloadFileFromOss('test', 'text', 'ddd');
        expect(result).toEqual('success-url');
        // 如果没有传入文件url
        const resultNoUrl = await localVue.prototype.downloadFileFromOss('test', 'text');
        expect(resultNoUrl).not.toEqual('success-url');
        expect(resultNoUrl).toBe(false);
    });
    it('测试上传--ossUploadFileFromOss方法逻辑', async() => {
        mockAxios.get = jest.fn(() => {
            return Promise.resolve({
                data: {
                    code: 0,
                    data: {
                        host: 'https://comjia-1.oss-cn-beijing.aliyuncs.com',
                        AccessKeyId: 'LTAI4FkD1jAiSJoTgzxQoD4m',
                        AccessKeySecret: 'LTAI4FkD1jAiSJoTgzxQoD4m',
                        stsToken: '3',
                        dir: 'test/'
                    }
                }
            });
        }).mockImplementationOnce(() => {
            return Promise.resolve({
                data: {
                    code: 0,
                    data: {
                        host: 'https://comjia-1.oss-cn-beijing.aliyuncs.com',
                        AccessKeyId: 'LTAI4FkD1jAiSJoTgzxQoD4m',
                        AccessKeySecret: 'LTAI4FkD1jAiSJoTgzxQoD4m',
                        stsToken: '3'
                    }
                }
            });
        });
        // 保存uploadFile源方法
        const uploadFn = localVue.prototype.ossUploadFile;
        localVue.prototype.ossUploadFile = jest.fn().mockImplementationOnce(() => {
            return Promise.reject('上传失败');
        }).mockImplementationOnce(() => {
            return Promise.resolve({
                res: {
                    statusCode: 200
                }
            });
        });
        // 文件为空的情况
        try {
            await localVue.prototype.ossUploadFileFromOss();
        } catch (error) {
            expect(error).toEqual('没有要上传的文件');
        }
        // uploadFile方法reject
        try {
            const failResult = await localVue.prototype.ossUploadFileFromOss({
                file: new File(["foo"], "foo.txt", {
                        type: "text/plain",
                })
            });
            expect(failResult).toBe(false);
        } catch (error) {
            expect(error).toBe('上传失败');
        }
        // 正常情况下
        const result = await localVue.prototype.ossUploadFileFromOss({
            file: new File(["foo"], "foo.txt", {
                type: "text/plain",
            })
        });
        expect(result.res.statusCode).toBe(200);
        // 恢复
        localVue.prototype.ossUploadFile = uploadFn;
    });
    it('测试下载重命名--downloadUrl方法逻辑', () => {
        const result = localVue.prototype.downloadUrl(client.client, 'test', 'text', '/test/test.txt');
        expect(result).toBeTruthy();
        expect(result).toEqual('success-url');
        // 如果传的client是一个空对象
        const resultNoO = localVue.prototype.downloadUrl({}, 'test', 'text', 'ddd');
        expect(resultNoO).toBeFalsy();
        // 如果传的client是一个空字符串
        const resultNoC = localVue.prototype.downloadUrl('', 'test', 'text', 'ddd');
        expect(resultNoC).toBeFalsy();
        // 如果传的url是一个空字符串
        const resultNoUrl = localVue.prototype.downloadUrl(client.client, 'test', 'text', '');
        expect(resultNoUrl).toBeFalsy();
        // 如果传的client对象内容不对
        const resultNoFun = localVue.prototype.downloadUrl({
            signatureUrl: ''
        }, 'test', 'text', '');
        expect(resultNoFun).toBeFalsy();
    });
    it('测试上传--ossUploadFile方法逻辑', async() => {
        // 正常情况
        let params = {
            client: client.client,
            dir: 'test/',
            host: 'https://comjia-1.oss-cn-beijing.aliyuncs.com'
        };
        const result = await localVue.prototype.ossUploadFile(params, {
            file: new File(["foo"], "foo.txt", {
                type: "text/plain",
            })
        });
        expect(result.res.statusCode).toBe(200);
        expect(result.res.requestUrls[0]).toBeTruthy();
        // 没有传入文件
        try {
            await localVue.prototype.ossUploadFile(params);
        } catch (error) {
            expect(error).toEqual('没有要上传的文件');
        }
        // 参数传递错误
        try {
            await localVue.prototype.ossUploadFile('', {
                file: new File(["foo"], "foo.txt", {
                    type: "text/plain",
                })
            });
        } catch (error) {
            expect(error).toEqual('参数传递错误');
        }
        // 空数组
        try {
            await localVue.prototype.ossUploadFile([], {
                file: new File(["foo"], "foo.txt", {
                    type: "text/plain",
                })
            });
        } catch (error) {
            expect(error).toEqual('参数传递错误');
        }
        // 其他格式
        try {
            await localVue.prototype.ossUploadFile(new Date(), {
                file: new File(["foo"], "foo.txt", {
                    type: "text/plain",
                })
            });
        } catch (error) {
            expect(error).toEqual('参数传递错误');
        }
        // 返回有？
        const resultUrl = await localVue.prototype.ossUploadFile(params, {
            file: new File(["foo"], "foo.txt", {
                type: "text/plain",
            })
        });
        expect(resultUrl.res.statusCode).toBe(200);
        expect(result.res.requestUrls[0]).toBeTruthy();
        // reject触发
        try {
            await localVue.prototype.ossUploadFile({
                client: client.client,
                host: 'https://comjia-1.oss-cn-beijing.aliyuncs.com'
            }, {
                file: new File(["foo"], "foo.txt", {
                    type: "text/plain",
                })
            });
        } catch (error) {
            expect(error).toEqual('failed');
        }
        // code不为200
        try {
            await localVue.prototype.ossUploadFile({
                client: client.client,
                host: 'https://comjia-1.oss-cn-beijing.aliyuncs.com'
            }, {
                file: new File(["foo"], "foo.txt", {
                    type: "text/plain",
                })
            });
        } catch (error) {
            expect(error).toEqual('上传失败');
        }
        // 没有dir  
        const noDirRes = await localVue.prototype.ossUploadFile({
            client: client.client,
            host: 'https://comjia-1.oss-cn-beijing.aliyuncs.com'
        }, {
            file: new File(["foo"], "foo.txt", {
                type: "text/plain",
            })
        });
        expect(noDirRes.res.statusCode).toBe(200);
        expect(noDirRes.res.requestUrls[0]).toBeTruthy();
        // 拿到可能出现问号的url/测试success和progress函数
        let option = {
            file: new File(["foo"], "foo.txt", {
                type: "text/plain",
            }),
            onSuccess: jest.fn(),
            onProgress: jest.fn()
        };
        const fnResults = await localVue.prototype.ossUploadFile({
            client: client.client,
            host: 'https://comjia-1.oss-cn-beijing.aliyuncs.com'
        }, option);
        expect(fnResults.res.requestUrls[0]).toBeTruthy();
        expect(option.onSuccess).toHaveBeenCalled();
        expect(option.onProgress).toHaveBeenCalled();
        expect(option.onProgress).toHaveBeenCalledWith({
            percent: 100
        });
    });
    it('测试filter方法', async() => {
        // 实际生成一个组件
        const Child = localVue.component('Child', {
            name: 'Child',
            props: ['money'],
            template: "<div>{{money | currency}}</div>"
        });
        const wrapper = mount(Child, {
            propsData: {
                money: 1000223
            }
        });
        expect(wrapper.vm.money).toEqual(1000223);
        expect(wrapper.html()).toBe('<div>¥1,000,223.00</div>');
        expect(wrapper.find('div').element.innerHTML).toEqual('¥1,000,223.00');
        await wrapper.setProps({
            money: null
        });
        expect(wrapper.find('div').element.innerHTML).toEqual('');
        await wrapper.setProps({
            money: ''
        });
        expect(wrapper.find('div').element.innerHTML).toEqual('');
        await wrapper.setProps({
            money: new Date()
        });
        expect(wrapper.find('div').element.innerHTML).toEqual('');
        // 超过精度
        await wrapper.setProps({
            money: '9007199254740993080989080'
        });
        expect(wrapper.find('div').element.innerHTML).toEqual('¥9.007,199,254,740,993e+24');
        // 数组会取第一个进行转换
        await wrapper.setProps({
            money: ['3345345', '334']
        });
        expect(wrapper.find('div').element.innerHTML).toEqual('¥3,345,345.00');
        await wrapper.setProps({
            money: '-3345345'
        });
        expect(wrapper.find('div').element.innerHTML).toEqual('-¥3,345,345.00');
        await wrapper.setProps({
            money: '0'
        });
        expect(wrapper.find('div').element.innerHTML).toEqual('¥0.00');
        // TODO
        // 输入NaN的时候，出现了死循环的情况，单元测试一直在运行，停不下来，处理方式：重新挂载一个，在mounted阶段赋值就没事
        const wrappers = mount(Child, {
            propsData: {
                money: NaN
            }
        });
        expect(wrappers.find('div').element.innerHTML).toEqual('');

        // 测试后几个参数
        const ChildFilter = localVue.component('Child', {
            name: 'ChildFilter',
            props: ['money'],
            template: "<div>{{money | currency('$')}}</div>"
        });
        const wrapperFilter = mount(ChildFilter, {
            propsData: {
                money: 1000223
            }
        });
        expect(wrapperFilter.find('div').element.innerHTML).toEqual('$1,000,223.00');
        const ChildFilterSec = localVue.component('Child', {
            name: 'ChildFilterSec',
            props: ['money'],
            template: "<div>{{money | currency('$', 'y')}}</div>"
        });
        const wrapperFilterSec = mount(ChildFilterSec, {
            propsData: {
                money: 1000223.878978
            }
        });
        expect(wrapperFilterSec.find('div').element.innerHTML).toEqual('');
        // 小数位数是整数
        const ChildFilterThir = localVue.component('Child', {
            name: 'ChildFilterThir',
            props: ['money'],
            template: "<div>{{money | currency('$', 2)}}</div>"
        });
        const wrapperFilterThir = mount(ChildFilterThir, {
            propsData: {
                money: 1000223.878978
            }
        });
        expect(wrapperFilterThir.find('div').element.innerHTML).toEqual('$1,000,223.88');
    });
});
