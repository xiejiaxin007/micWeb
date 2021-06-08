/*
 * @author: kangxue
 * @Date: 2021-01-05 14:59:32
 * @LastEditors: kangxue
 * @LastEditTime: 2021-02-26 10:02:15
 * @description: 自动生成动态组件
 */
import {
    mount,
    createLocalVue
} from '@vue/test-utils';
import AutoSetDynamic from '@/pages/propertySide/buildingDictionary/components/AutoSetDynamic.vue';
import mockAxios from '#/__mocks__/axios.js';
import VueRouter from 'vue-router';
const localVue = createLocalVue();
localVue.use(VueRouter);
const routes = [{
    path: '/test',
    name: 'test'
}]
const log = console.log;
// 模拟$message
const Message = jest.fn();
Message.error = jest.fn();
localVue.prototype.$message = Message;
describe('自动生成动态组件AutoSetDynamic', () => {
    mockAxios.get.mockImplementationOnce(() => {
        return Promise.resolve({
            data: {
                code: 0,
                data: {
                    is_show: '1'
                }
            }
        })
    })
    let wrapper, router;
    beforeAll(() => {
        router = new VueRouter({
            routes
        });
        router.push({
            name: 'test',
            query: {
                projectId: '1001',
                taskId: ''

            }
        });
        wrapper = mount(AutoSetDynamic, {
            localVue,
            router,
            mocks: {
                $message: Message
            }
        });
    });
    afterAll(() => {
        wrapper.destroy();
    });
    beforeEach(() => {
        console.log = jest.fn();
    })
    afterEach(() => {
        console.log = log;
    })
    it('初始化获取楼盘信息', () => {
        expect(wrapper.vm.isProjectShow).toBe('1');
        expect(wrapper.find('.el-button').exists()).toBeTruthy();
    })
    it('点击按钮自动生成动态', async () => {
        mockAxios.get.mockImplementationOnce(() => {
            return Promise.reject('请求失败')
        }).mockImplementationOnce(() => {
            return Promise.resolve({
                data: {
                    code: 0,
                    msg: '操作成功'
                }
            })
        }).mockImplementationOnce(() => {
            return Promise.resolve({
                data: {
                    code: 1,
                    msg: '操作失败'
                }
            })
        })
        // 第一次请求
        wrapper.find('.el-button').trigger('click');
        expect(wrapper.vm.isSubmiting).toBe(true);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.isSubmiting).toBe(false);
        expect(console.log).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledTimes(1);
        expect(console.log).toHaveBeenCalledWith('请求失败');
        // 第二次请求，正常
        wrapper.find('.el-button').trigger('click');
        expect(wrapper.vm.isSubmiting).toBe(true);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.isSubmiting).toBe(false);
        expect(localVue.prototype.$message).toHaveBeenCalled();
        expect(localVue.prototype.$message).toHaveBeenLastCalledWith({
            type: 'success',
            message: '操作成功'
        });
        // 第三次请求，code=1
        wrapper.find('.el-button').trigger('click');
        expect(wrapper.vm.isSubmiting).toBe(true);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.isSubmiting).toBe(false);
        expect(localVue.prototype.$message).toHaveBeenCalled();
        expect(localVue.prototype.$message).toHaveBeenCalledTimes(2);
        expect(localVue.prototype.$message).toHaveBeenLastCalledWith({
            type: 'warning',
            message: '操作失败'
        });
        // 第4次点击，第5次点击测试重复校验
        wrapper.find('.el-button').trigger('click');
        expect(wrapper.vm.isSubmiting).toBe(true);
        wrapper.find('.el-button').trigger('click');
        expect(wrapper.vm.isSubmiting).toBe(true);
        let res = await wrapper.vm.autoSetDynamic();
        expect(res).not.toBeDefined();
    });
    it('请求楼盘信息失败', async () => {
        mockAxios.get.mockImplementationOnce(() => {
            return Promise.resolve({
                data: {
                    code: 1,
                    msg: '无法获取楼盘信息'
                }
            })
        }).mockImplementationOnce(() => {
            return Promise.reject('请求楼盘信息失败')
        })
        await wrapper.vm.getProjectInfo();
        expect(localVue.prototype.$message.error).toHaveBeenCalled();
        expect(localVue.prototype.$message.error).toHaveBeenLastCalledWith('无法获取楼盘信息');
        await wrapper.vm.getProjectInfo();
        expect(console.log).toHaveBeenCalled();
        expect(console.log).toHaveBeenLastCalledWith('请求楼盘信息失败');
    })
    it('无权限操作组件', async () => {
        router.push({
            name: 'test',
            query: {
                projectId: '1001',
                taskId: '1'

            }
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.el-button').exists()).toBeFalsy();
    })
})
