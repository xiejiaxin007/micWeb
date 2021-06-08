/*
 * @author: xiejiaxin
 * @Date: 2020-12-28 15:05:50
 * @LastEditors: kangxue
 * @LastEditTime: 2021-04-19 14:03:05
 * @description: 分片上传组件
 */
import { createLocalVue, mount } from '@vue/test-utils';
// import mockAxios from 'axios';
// 模拟OSS
// const OSS = require('ali-oss');
// jest.mock('ali-oss');
const localVue = createLocalVue()
import upload from '@/assets/js/upload/upload.js';
import UploadFiles from '@/components/UploadFiles.vue';
// 模拟$message
const Message = jest.fn();
Message.warning = jest.fn();
localVue.prototype.$message = Message;

describe('测试分片上传组件', () => {
    let wrapper;
    beforeAll(() => {
        // 因为单元测试不走main.js，所以需要手动注册upload函数
        upload.install(localVue);
    });
    beforeEach(() => {
        wrapper = mount(UploadFiles, {
            mocks: {
                createOssClient: jest.spyOn(localVue.prototype, 'createOssClient'),
                ossUploadFile: jest.fn().mockImplementationOnce(() => {
                    return Promise.reject('failed');
                }).mockImplementationOnce(() => {
                    return Promise.resolve('success');
                }),
                $message: Message
            }
        });
    });
    afterEach(() => {
        // mockAxios.mockClear();
        // OSS.mockClear();
        wrapper.destroy();
    });
    it('测试props', async() => {
        expect(wrapper.vm.limit).toBe(10);
        expect(wrapper.vm.limitType).toEqual([]);
        expect(wrapper.vm.limitSize).toEqual(10);
        expect(wrapper.vm.autoUpload).toBe(true);
        expect(wrapper.vm.multiple).toBe(false);
        await wrapper.setProps({
            limit: 1,
            limitType: ['png'],
            limitSize: 2,
            autoUpload: false,
            multiple: true
        });
        expect(wrapper.vm.limit).toStrictEqual(1);
        expect(wrapper.vm.limitType).toEqual(['png']);
        expect(wrapper.vm.limitSize).toEqual(2);
        expect(wrapper.vm.autoUpload).toStrictEqual(false);
        expect(wrapper.vm.multiple).toStrictEqual(true);
    });
    it('测试computed', async() => {
        await wrapper.setProps({
            limitType: ['png', 'jpg']
        });
        expect(wrapper.vm.acceptStr).toStrictEqual('png,jpg');
        await wrapper.setProps({
            limitType: ['']
        });
        expect(wrapper.vm.acceptStr).toStrictEqual('');
        await wrapper.setProps({
            limitType: [1]
        });
        expect(wrapper.vm.acceptStr).toStrictEqual('1');
    });
    it('测试slot', () => {
        const slotWp = mount(UploadFiles, {
            slots: {
                default: '<div class="btn-upload">点击下载</div>'
            }
        });
        const slotDom = slotWp.find('.btn-upload');
        expect(slotDom).toBeTruthy();
        expect(slotDom.text()).toStrictEqual('点击下载');
    });
    it('测试触发点击事件-triggerUpload', async() => {
        // 点击dom，手动触发隐藏input=file的点击事件
        await wrapper.vm.triggerUpload();
        expect(wrapper.vm.fileList).toStrictEqual([]);
        const fileDom = wrapper.find('input[type=file]');
        expect(fileDom).toBeTruthy();
        expect(fileDom.element.value).toBe('');
    });
    it('测试单文件上传方法-upload', async() => {
        // 模拟doUpload方法
        const doFn = jest.spyOn(wrapper.vm, 'doUpload');
        // 模拟emit
        const mockFn = jest.fn();
        wrapper.vm.$on('beforeUpload', mockFn);
        await wrapper.vm.upload({
            target: {
                files: [new File(["foo"], "foo.txt", {
                    type: "text/plain",
                })]
            }
        });
        // 触发开始上传回调
        expect(mockFn).toHaveBeenCalled();
        expect(mockFn).toHaveBeenLastCalledWith([new File(["foo"], "foo.txt", {
            type: "text/plain"
        })]);
        expect(doFn).toHaveBeenCalled();
        // 清除被调用次数
        doFn.mockClear();
        // window.event = {
        //     target: {}
        // }
        // await wrapper.vm.upload();
        // window.event = event;
        // 模拟size超过限制情况
        await wrapper.setProps({
            limitSize: 0.000000002
        });
        const result = await wrapper.vm.upload({
            target: {
                files: [new File(["foo"], "foo.txt", {
                    type: "text/plain",
                })]
            }
        });
        expect(result).toStrictEqual(false);
        // 模拟上传选择文件类型与设置不一致
        await wrapper.setProps({
            limitType: ['.png'],
            limitSize: 10
        });
        const resultType = await wrapper.vm.upload({
            target: {
                files: [new File(["foo"], "foo.txt", {
                    type: "text/plain",
                })]
            }
        });
        expect(resultType).toStrictEqual(false);
        // 设置autoUpload为false测试
        await wrapper.setProps({
            autoUpload: false,
            limitType: ['.txt'],
            limitSize: 10
        });
        const noAutoRes = await wrapper.vm.upload({
            target: {
                files: [new File(["foo"], "foo.txt", {
                    type: "text/plain",
                })]
            }
        });
        expect(mockFn).toHaveBeenCalled();
        // 未被调用
        expect(doFn.mock.calls).toHaveLength(0);
        expect(noAutoRes).toStrictEqual(undefined);
        // 清除被调用次数
        doFn.mockClear();
        // 后缀名字格式不对
        const extensionRes = await wrapper.vm.upload({
            target: {
                files: [new File(["foo"], "foo", {
                    type: "text/plain",
                })]
            }
        });
        expect(extensionRes).toStrictEqual(false);
    });
    it('测试多文件上传方法-upload', async() => {
        // 模拟doUpload方法
        const doFn = jest.spyOn(wrapper.vm, 'doUpload');
        const mockFn = jest.fn();
        wrapper.vm.$on('beforeUpload', mockFn);
        await wrapper.setProps({
            multiple: true
        });
        await wrapper.vm.upload({
            target: {
                files: [new File(["foo1"], "foo1.txt", {
                    type: "text/plain",
                }), new File(["foo2"], "foo2.txt", {
                    type: "text/plain",
                })]
            }
        });
        expect(mockFn).toHaveBeenCalled();
        expect(mockFn).toHaveBeenLastCalledWith([new File(["foo1"], "foo1.txt", {
            type: "text/plain",
        }), new File(["foo2"], "foo2.txt", {
            type: "text/plain",
        })]);
        expect(doFn).toHaveBeenCalled();
        // 清除被调用次数
        doFn.mockClear();
        // 模拟size超过限制情况
        await wrapper.setProps({
            limitSize: 0.000000002
        });
        const result = await wrapper.vm.upload({
            target: {
                files: [new File(["foo"], "foo.txt", {
                    type: "text/plain",
                }), new File(["foo"], "foo.txt", {
                    type: "text/plain",
                })]
            }
        });
        expect(result).toStrictEqual(false);
        expect(localVue.prototype.$message).toHaveBeenCalled();
        expect(localVue.prototype.$message).toHaveBeenLastCalledWith('上传的单个文件不能超过2e-9M，请重新上传！');
        // 模拟上传选择文件类型与设置不一致
        await wrapper.setProps({
            limitType: ['.png'],
            limitSize: 10
        });
        const resultType = await wrapper.vm.upload({
            target: {
                files: [new File(["foo"], "foo.txt", {
                    type: "text/plain",
                }), new File(["foo"], "foo.txt", {
                    type: "text/plain",
                })]
            }
        });
        expect(resultType).toStrictEqual(false);
        expect(localVue.prototype.$message).toHaveBeenCalled();
        expect(localVue.prototype.$message).toHaveBeenLastCalledWith({
            customClass: 'pop-msg-box',
            message: '请上传文件类型为.png的文件'
        });
        // 模拟上传选择文件类型与设置不一致，并且大小也不符合
        await wrapper.setProps({
            limitType: ['.png'],
            limitSize: 0.000000002
        });
        const failType = await wrapper.vm.upload({
            target: {
                files: [new File(["foo"], "foo.txt", {
                    type: "text/plain",
                }), new File(["foo"], "foo.txt", {
                    type: "text/plain",
                })]
            }
        });
        expect(failType).toStrictEqual(false);
        // 设置autoUpload为false测试
        await wrapper.setProps({
            autoUpload: false,
            limitType: ['.txt'],
            limitSize: 10
        });
        await wrapper.vm.upload({
            target: {
                files: [new File(["foo"], "foo.txt", {
                    type: "text/plain",
                }), new File(["foo"], "foo.txt", {
                    type: "text/plain",
                })]
            }
        });
        expect(mockFn).toHaveBeenCalled();
        // 未被调用
        expect(doFn.mock.calls).toHaveLength(0);
        // 校验文件个数
        await wrapper.setProps({
            limit: 1
        });
        const limitResult = await wrapper.vm.upload({
            target: {
                files: [new File(["foo"], "foo.txt", {
                    type: "text/plain",
                }), new File(["foo"], "foo.txt", {
                    type: "text/plain",
                })]
            }
        });
        expect(limitResult).toStrictEqual(false);
        expect(localVue.prototype.$message.warning).toHaveBeenCalled();
        expect(localVue.prototype.$message.warning).toHaveBeenLastCalledWith('最大上传1个文件');
    });
    it('测试开始上传doUpload方法', async() => {
        // 重新挂载
        let wrapperMock = mount(UploadFiles, {
            mocks: {
                createOssClient: jest.fn(() => {
                    return Promise.resolve({
                        client: 'client',
                        dir: 'test/',
                        host: 'http:host.com'
                    });
                }).mockImplementationOnce(() => {
                    return Promise.resolve(null);
                }).mockImplementationOnce(() => {
                    return Promise.resolve({
                        client: ''
                    });
                }).mockImplementationOnce(() => {
                    return Promise.reject('fail2');
                }).mockImplementationOnce(() => {
                    return Promise.resolve({
                        client: 'client',
                        dir: 'test/',
                        host: 'http:host.com'
                    });
                })
            }
        });
        // 模拟失败emit
        const mockFn = jest.fn();
        wrapperMock.vm.$on('fail', mockFn);
        // 模拟成功emit
        const mockFnSuccess = jest.fn();
        wrapperMock.vm.$on('success', mockFnSuccess);
        // 无文件时候的调用
        const noFileRel = await wrapperMock.vm.doUpload([]);
        expect(noFileRel).toStrictEqual(false);
        expect(mockFn).toHaveBeenCalled();
        // 传入对象---不可能是对象结构
        // const objResult = await wrapperMock.vm.doUpload({});
        // expect(objResult).toStrictEqual(false);
        // expect(mockFn).toHaveBeenCalled();
        // 传入空
        const nullResult = await wrapperMock.vm.doUpload('');
        expect(nullResult).toStrictEqual(false);
        expect(mockFn).toHaveBeenCalled();
        // 有文件时候调用，但是oss初始化失败
        const failResult = await wrapperMock.vm.doUpload(['file']);
        expect(failResult).toStrictEqual(false);
        expect(mockFn).toHaveBeenCalled();
        const failNormalResult = await wrapperMock.vm.doUpload(['file']);
        expect(failNormalResult).toStrictEqual(false);
        expect(mockFn).toHaveBeenCalled();
        // oss实例化方法reject
        const rejectResult = await wrapperMock.vm.doUpload(['file']);
        expect(rejectResult).toStrictEqual(false);
        expect(mockFn).toHaveBeenCalled();
        // 请求成功
        const uploadFileFn = wrapperMock.vm.uploadFile;
        wrapperMock.vm.uploadFile = jest.fn().mockImplementationOnce(() => {
            // uploadFile方法肯定如果resole，肯定有res，而且肯定有file对象，如果没有file对象，则不可能resolve
            return Promise.resolve({
                res: {
                    requestUrls: ['/test/test.txt']
                },
                file: new File(["foo2"], "foo2.txt", {
                    type: "text/plain",
                }),
                name: 'name'
            });
        }).mockImplementationOnce(() => {
            return Promise.reject('failed');
        }).mockImplementationOnce(() => {
            return Promise.resolve({
                res: {
                    requestUrls: ['/test/test1.txt']
                },
                file: new File(["foo1"], "foo1.txt", {
                    type: "text/plain",
                }),
                name: 'name1'
            })
        }).mockImplementationOnce(() => {
            return Promise.resolve()
        });
        await wrapperMock.vm.doUpload(['file', 'file1', 'file2', 'file3']);
        await wrapper.vm.$nextTick();
        expect(wrapperMock.vm.uploadFile).toHaveBeenCalled();
        expect(wrapperMock.vm.uploadFile).toHaveReturnedTimes(4);
        expect(mockFnSuccess).toHaveBeenLastCalledWith([{
            url: 'name',
            fullUrl: 'http:host.com/test/test.txt',
            name: 'foo2.txt',
            size: 4,
            extension: 'txt'
        }, {
            url: 'name1',
            fullUrl: 'http:host.com/test/test1.txt',
            name: 'foo1.txt',
            size: 4,
            extension: 'txt'
        }]);
        expect(wrapperMock.vm.fileList).toStrictEqual([]);
        wrapperMock.vm.uploadFile = uploadFileFn;
    });
    it('测试uploadFile方法', async() => {
        // 触发reject
        try {
            await wrapper.vm.uploadFile('file', 'client', 'dir', 'host');
        } catch (error) {
            expect(error).toStrictEqual('failed');
        }
        // 触发resolve
        const result = await wrapper.vm.uploadFile('file', 'client', 'dir', 'host');
        expect(result).toStrictEqual('success');
    });
});
