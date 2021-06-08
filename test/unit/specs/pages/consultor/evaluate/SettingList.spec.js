/*
 * @author: kangxue
 * @Date: 2021-02-20 11:10:46
 * @LastEditors: kangxue
 * @LastEditTime: 2021-03-18 17:15:33
 * @description: 评价配置页单元测试
 */
import {
    mount,
    createLocalVue
} from '@vue/test-utils';
import SettingList from '@/pages/consultor/evaluate/SettingList.vue';
import mockAxios from '#/__mocks__/axios.js';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);
const log = console.log;
describe('SettingList评价配置页--正常数据', () => {
    mockAxios.post.mockImplementationOnce(() => {
        return Promise.resolve({
            data: {
                code: 0,
                data: {
                    total: '52',
                    list: [{
                        id: "155"
                    }]
                }
            }
        })
    })
    let wrapper, store, fn, router;
    beforeAll(() => {
        store = new Vuex.Store({
            state: {
                role: 'admin'
            }
        });
        router = new VueRouter();
        wrapper = mount(SettingList, {
            store,
            localVue,
            router
        });
        fn = jest.spyOn(wrapper.vm, 'searchEvaluateList')
        expect(wrapper.vm.loading).toBe(true);
    })
    afterAll(() => {
        wrapper.destroy();
    })
    beforeEach(() => {
        console.log = jest.fn();
    })
    afterEach(() => {
        console.log = log;
    })
    it('测试created', () => {
        expect(wrapper.vm.role).toBe('admin');
        let list = [{}, {
            id: "155"
        }]
        expect(wrapper.vm.tableData).toStrictEqual(list);
        expect(wrapper.vm.total).toBe(52);
        expect(wrapper.vm.loading).toBe(false);
    });
    it('测试computed tableRowInfo', async () => {
        expect(wrapper.vm.tableRowInfo).toStrictEqual({
            start: 1,
            end: 20
        });
        expect(wrapper.find('.page-num').text()).toEqual('第1-20条数据，共52条数据');
        await wrapper.setData({
            limit: 10,
            currentPage: 2
        })
        expect(wrapper.vm.tableRowInfo).toStrictEqual({
            start: 11,
            end: 20
        });
        expect(wrapper.find('.page-num').text()).toEqual('第11-20条数据，共52条数据');
        await wrapper.setData({
            limit: 10,
            currentPage: 6
        })
        expect(wrapper.vm.tableRowInfo).toStrictEqual({
            start: 51,
            end: 52
        });
        expect(wrapper.find('.page-num').text()).toEqual('第51-52条数据，共52条数据');
    });
    it('test search', async () => {
        expect(wrapper.vm.currentPage).toBe(6);
        await wrapper.vm.searchDataChange();
        expect(fn).toHaveBeenCalled();
        expect(fn).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.currentPage).toBe(1);
        await wrapper.vm.searchDataChange();
        expect(fn).toHaveBeenCalled();
        expect(fn).toHaveBeenCalledTimes(2);
    })
    it('test add btn or edit router push', async () => {
        router.push = jest.fn();
        await wrapper.vm.goEdit('0');
        expect(router.push).toHaveBeenCalledWith({
            path: '/evaluate/editSetting',
            query: {
                setId: '0'
            }
        })
        await wrapper.vm.goEdit('111');
        expect(router.push).toHaveBeenLastCalledWith({
            path: '/evaluate/editSetting',
            query: {
                setId: '111'
            }
        })
        expect(router.push).toHaveBeenCalledTimes(2);
    })
    it('test watch', async () => {
        store.state.role = 'finance';
        await wrapper.vm.$nextTick();
        expect(router.push).toHaveBeenLastCalledWith({
            path: '/noPermissions'
        })
        store.state.role = 'admin';
        await wrapper.vm.$nextTick();
        expect(fn).toHaveBeenCalled();
        expect(fn).toHaveBeenCalledTimes(3);
    })
    it('请求无数据', async () => {
        mockAxios.post.mockImplementationOnce(() => {
            return Promise.resolve({
                data: {
                    code: 0,
                    data: {
                        total: '0'
                    }
                }
            })
        })
        wrapper.setData({
            limit: 20,
            currentPage: 1
        })
        await wrapper.vm.pageChange();
        expect(fn).toHaveBeenCalled();
        await wrapper.vm.searchEvaluateList();
        expect(wrapper.vm.tableRowInfo).toStrictEqual({
            start: 1,
            end: 0
        });
        expect(wrapper.vm.total).toBe(0);
        expect(wrapper.vm.tableData).toStrictEqual([{}]);
        expect(wrapper.find('.page-num').text()).toEqual('没有符合条件的数据');
    })
    it('请求数据错误', async () => {
        mockAxios.post.mockImplementationOnce(() => {
            return Promise.reject('请求错误')
        })
        await wrapper.vm.searchEvaluateList();
        expect(console.log).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith('请求错误');
        expect(wrapper.vm.loading).toBe(false);
    })
})
describe('SettingList评价配置页--非admin', () => {
    let wrapper, store;
    beforeAll(() => {
        store = new Vuex.Store({
            state: {
                role: 'finance'
            }
        });
        wrapper = mount(SettingList, {
            store,
            localVue,
        });
    })
    afterAll(() => {
        wrapper.destroy();
    })
    it('测试created', () => {
        expect(wrapper.vm.role).toBe('finance');
        expect(wrapper.vm.tableData).toStrictEqual([]);
    });
})
