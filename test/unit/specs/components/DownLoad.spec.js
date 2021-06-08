/*
 * @author: xiejiaxin
 * @Date: 2020-12-26 12:20:25
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2020-12-28 14:44:11
 * @description: 下载公共组件测试用例
 */
import { createLocalVue, mount } from '@vue/test-utils';
import mockAxios from 'axios';
// 模拟OSS
const OSS = require('ali-oss');
jest.mock('ali-oss');
const localVue = createLocalVue()
import upload from '@/assets/js/upload/upload.js';
import DownLoad from '@/components/DownLoad.vue';
// 保留console方法
const originConsole = console.log;
describe('测试DownLoad组件', () => {
    let wrapper;
    const { location } = window;
    beforeAll(() => {
        // 因为单元测试不走main.js，所以需要手动注册upload函数
        upload.install(localVue);
        // 单独模拟window.location对象
        const windowLocation = JSON.stringify(window.location);
        delete window.location;
        Object.defineProperty(window, 'location', {
            value: JSON.parse(windowLocation)
        });
    });
    beforeEach(() => {
        wrapper = mount(DownLoad, {
            mocks: {
                createOssClient: jest.spyOn(localVue.prototype, 'createOssClient'),
                downloadUrl: jest.spyOn(localVue.prototype, 'downloadUrl')
            },
            propsData: {
                file: {
                    name: 'test',
                    ext: 'txt',
                    url: 'test/test'
                }
            },
            slots: {
                trigger: '<div class="btn-download">点击下载</div>'
            }
        });
    });
    afterEach(() => {
        mockAxios.mockClear();
        OSS.mockClear();
        wrapper.destroy();
    });
    afterAll(() => {
        window.location = location;
    });
    it('测试组件渲染', () => {
        expect(wrapper.vm.file).toBeTruthy();
        expect(wrapper.vm.multiple).toEqual(false);
        expect(wrapper.find('.btn-download').exists()).toBe(true);
        expect(wrapper.find('.btn-download').text()).toEqual('点击下载');
        // 修改slot传入
        const slotWrapper = mount(DownLoad, {
            propsData: {
                file: {
                    name: 'test',
                    ext: 'txt',
                    url: 'test/test'
                }
            },
            slots: {
                trigger: '',
                default: '<div class="btn-download">点击下载</div>'
            }
        });
        expect(slotWrapper.find('.btn-download').exists()).toBe(true);
        expect(slotWrapper.find('.btn-download').text()).toEqual('点击下载');
    });
    it('测试单个文件的点击下载事件--slot为trigger', async() => {
        // 模拟签名请求
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
        }).mockImplementationOnce(() => {
            return Promise.reject('get failed');
        });
        // const mockFn = jest.spyOn(wrapper.vm, 'ossDownloadFile');
        const mockEmitFn = jest.fn();
        console.log = jest.fn();
        wrapper.vm.$on('success', mockEmitFn);
        const triggerDom = wrapper.find('.download-wrapper div');
        await triggerDom.trigger('click');
        await wrapper.vm.$nextTick();
        // expect(mockFn).toHaveBeenCalled();
        expect(mockEmitFn).toHaveBeenCalled();
        expect(window.location.href).toEqual('success-url'); 
        // 还原window.location
        window.location.href = '';
        // 第二次点击
        await triggerDom.trigger('click');
        await wrapper.vm.$nextTick();
        expect(console.log).toHaveBeenLastCalledWith('get failed');
        expect(window.location.href).toEqual(''); 
        // 测试url返回为空
        await wrapper.setProps({
            file: {
                name: '',
                url: ''
            }
        })
        await triggerDom.trigger('click');
        await wrapper.vm.$nextTick();
        expect(window.location.href).toEqual(''); 
    });
    it('测试多个文件的点击下载事件--slot为trigger', async() => {
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
        })
        const fileList = [{
            name: 'test',
            ext: 'txt',
            url: 'test/test'
        },{
            name: 'test',
            ext: 'txt',
            url: 'test/test'
        }];
        await wrapper.setProps({
            file: fileList
        });
        console.log = jest.fn();
        const mockEmitFn = jest.fn();
        wrapper.vm.$on('success', mockEmitFn);
        const triggerDom = wrapper.find('.download-wrapper div');
        await triggerDom.trigger('click');
        await wrapper.vm.$nextTick();
        // 未设置批量下载props
        expect(mockEmitFn).toHaveBeenCalled();
        expect(console.log).toHaveBeenLastCalledWith('组件传参错误');
        // 恢复console
        console.log = originConsole;
        // 设置为批量下载
        await wrapper.setProps({
            multiple: true
        });
        wrapper.vm.downloadFile = jest.fn();
        await triggerDom.trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.downloadFile).toHaveBeenCalled();
        expect(wrapper.vm.downloadFile.mock.calls[0][0]).toBe('success-url');
        expect(wrapper.vm.downloadFile).toHaveBeenCalledTimes(fileList.length);
    });
    it('测试动态创建iframe进行文件下载方法', async() => {
        // 开启模拟定时器
        jest.useFakeTimers();
        await wrapper.vm.downloadFile('http://test/test.txt');
        expect(document.body.getElementsByTagName('iframe')).toHaveLength(1);
        expect(document.body.getElementsByTagName('iframe')[0].src).toBe('http://test/test.txt');
        // 结束所有定时器
        jest.runAllTimers();
        // 确保这个用例执行之前，其他测试用例没有进行iframe的插入
        expect(document.body.getElementsByTagName('iframe')).toHaveLength(0);
    });
});

