/*
 * @author: kangxue
 * @Date: 2021-02-20 17:33:35
 * @LastEditors: kangxue
 * @LastEditTime: 2021-02-22 19:02:22
 * @description: 选择城市
 */
import {
    mount, createLocalVue
} from '@vue/test-utils';
import SelectCity from '@/components/SelectCity.vue';
import mockAxios from '#/__mocks__/axios.js';
const localVue = createLocalVue()
const cityList = [{
    "name": "北京",
    "value": "2"
}, {
    "name": "上海",
    "value": "20000001"
}, {
    "name": "天津",
    "value": "20000019"
}]
const log = console.log;
// 模拟$message
const Message = jest.fn();
Message.error = jest.fn();
localVue.prototype.$message = Message;
describe('SelectCity', () => {
    mockAxios.get.mockImplementationOnce(() => {
        return Promise.resolve({
            data: {
                code: 0,
                data: {
                    list: cityList
                }
            }
        })
    })
    let wrapper;
    const mockFn = jest.fn();
    beforeAll(() => {
        wrapper = mount(SelectCity, {
            mocks: {
                $message: Message
            }
        });
        wrapper.vm.$on('input', mockFn);
        console.log = jest.fn();
    })
    afterAll(() => {
        wrapper.destroy();
        console.log = log;
    })
    it('test mounted', () => {
        expect(wrapper.vm.cityList).toStrictEqual(cityList);
        expect(wrapper.vm.city).toStrictEqual([]);
        expect(mockFn).toHaveBeenCalled();
        expect(mockFn).toHaveBeenCalledWith([]);
        expect(wrapper.findAll('.el-select-dropdown__item').length).toBe(4);
        expect(wrapper.findAll('.el-select-dropdown__item').at(0).text()).toBe('全部');
    })
    it('test city change', async () => {
        const allCity = ['2', '20000001', '20000019'];
        await wrapper.vm.cityChange(['20000001', '-1']);
        expect(wrapper.vm.city).toStrictEqual(allCity);
        expect(mockFn).toHaveBeenCalled();
        expect(mockFn).toHaveBeenLastCalledWith(allCity);
        expect(mockFn).toHaveBeenCalledTimes(2);
        expect(wrapper.findAll('.el-tag').length).toBe(2);
    })
    it('showMore toBe true', async () => {
        wrapper.setProps({
            showMore: true
        })
        await wrapper.vm.cityChange(['20000019', '-1']);
        expect(wrapper.findAll('.el-tag').length).toBe(3);
        expect(wrapper.find('.el-select__tags').text()).toBe('北京上海天津');
    })
    it('axios get cityList toBe []', async () => {
        mockAxios.get.mockImplementationOnce(() => {
            return Promise.resolve({
                data: {
                    code: 0,
                    data: {
                        list: []
                    }
                }
            })
        })
        await wrapper.vm.getCityList();
        expect(wrapper.vm.cityList).toStrictEqual([]);
        expect(wrapper.findAll('.el-select-dropdown__item').length).toBe(0);
    })
    it('axios failed', async () => {
        mockAxios.get.mockImplementationOnce(() => {
            return Promise.resolve({
                data: {
                    code: 1,
                    msg: '请求错误，无数据'
                }
            })
        })
        await wrapper.vm.getCityList();
        expect(localVue.prototype.$message.error).toHaveBeenCalled();
        expect(localVue.prototype.$message.error).toHaveBeenLastCalledWith('请求错误，无数据');
    })
    it('axios catch failed', async () => {
        mockAxios.get.mockImplementationOnce(() => {
            return Promise.reject('请求失败');
        })
        await wrapper.vm.getCityList();
        expect(console.log).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith('请求失败');
    })
});
