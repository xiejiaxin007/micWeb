/*
 * @author: kangxue
 * @Date: 2020-12-22 13:59:58
 * @LastEditors: kangxue
 * @LastEditTime: 2020-12-29 17:23:48
 * @description: 楼盘组件
 */
import {
    mount
} from '@vue/test-utils';
import DatePickerTenday from '@/pages/propertySide/buildingDictionary/components/DatePickerTenday.vue';
const month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const day1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
const day2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
const day3 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
const day4 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
const warn = console.warn;
let wrapper;
beforeAll(() => {
    console.warn = jest.fn();
    wrapper = mount(DatePickerTenday);
})
afterAll(() => {
    wrapper.destroy();
    console.warn = warn;
})
describe('DatePickerTenday', () => {
    it('测试initDate —— 年月日都正确', () => {
        wrapper = mount(DatePickerTenday, {
            propsData: {
                year: 2019,
                month: '10',
                day: 3,
                tenday: '2',
                minYear: 1999,
                maxYear: 2004
            }
        });
        expect(wrapper.vm.dateForm.year).toBe(2019);
        expect(wrapper.vm.dateForm.month).toBe('10');
        expect(wrapper.vm.dateForm.day).toBe(3);
        expect(wrapper.vm.dateForm.tenday).toBe(2);
        expect(wrapper.vm.yearList).toStrictEqual([1999, 2000, 2001, 2002, 2003, 2004]);
        expect(wrapper.vm.monthList).toStrictEqual(month);
        expect(wrapper.vm.dayList).toStrictEqual(day4);
    })
    it('测试initDate —— 年月日旬输入范围错误', () => {
        wrapper = mount(DatePickerTenday, {
            propsData: {
                year: 1960,
                month: '17',
                day: 32
            }
        });
        expect(wrapper.vm.dateForm.year).toBe(1970);
        expect(wrapper.vm.dateForm.month).toBe('');
        expect(wrapper.vm.dateForm.day).toBe('');
    })
    it('测试initDate —— 不输入年月日旬', () => {
        wrapper = mount(DatePickerTenday, {
            propsData: {
                year: '',
                month: '',
                day: '',
                tenday: ''
            }
        });
        expect(wrapper.vm.dateForm.year).not.toBe('');
        expect(wrapper.vm.dateForm.month).toBe('');
        expect(wrapper.vm.dateForm.day).toBe('');
        expect(wrapper.vm.dateForm.tenday).toBe('');
        expect(wrapper.vm.dayList).toStrictEqual([]);
    })
    it('测试createYearList——正常输入', () => {
        wrapper.setProps({
            minYear: 1999,
            maxYear: 2004
        });
        expect(wrapper.vm.createYearList()).toStrictEqual([1999, 2000, 2001, 2002, 2003, 2004]);
    })
    it('测试createYearList——错误输入1', () => {
        wrapper.setProps({
            minYear: 2000,
            maxYear: 1990
        });
        expect(wrapper.vm.createYearList()).toStrictEqual([]);
    })
    it('测试createYearList——错误输入2', async () => {
        wrapper.setProps({
            minYear: 1968,
            maxYear: 1969
        })
        let res = wrapper.vm.createYearList();
        expect(res).toContain(1970);
        expect(res).toContain(2050);
        expect(res).not.toContain(1968);
        expect(res).not.toContain(1969);
        expect(res).not.toContain(2051);
    })
    it('测试getCurMonthDays当前选中月总天数', async () => {
        // dateForm。year必定有值
        await wrapper.setData({
            dateForm: {
                year: '2019'
            }
        })
        expect(wrapper.vm.getCurMonthDays(2)).toBe(28);
        expect(wrapper.vm.getCurMonthDays(10)).toBe(31);
        await wrapper.setData({
            dateForm: {
                year: '2020'
            }
        })
        expect(wrapper.vm.getCurMonthDays('2')).toBe(29);
        expect(wrapper.vm.getCurMonthDays()).toBe(false);
    })
    it('测试createDays日下拉——正常输入', async () => {
        await wrapper.setData({
            dateForm: {
                year: '2019'
            }
        })
        expect(wrapper.vm.createDays(2)).toStrictEqual(day1);
        expect(wrapper.vm.createDays(10)).toStrictEqual(day4);
        await wrapper.setData({
            dateForm: {
                year: '2020'
            }
        })
        expect(wrapper.vm.createDays('2')).toStrictEqual(day2);
        expect(wrapper.vm.createDays(4)).toStrictEqual(day3);
        expect(wrapper.vm.createDays('')).toStrictEqual([]);
    })
    it('测试joinDateStr', () => {
        const mockFn = jest.fn();
        wrapper.vm.$on('input', mockFn);
        wrapper.vm.joinDateStr({
            year: '',
            month: '10',
            day: '12',
            tenday: '3'
        });
        expect(wrapper.vm.dateValue).not.toBe('年10月12日');
        expect(mockFn).not.toHaveBeenCalled();
        wrapper.vm.joinDateStr({
            year: '2019',
            month: '10',
            day: '12',
            tenday: '3'
        });
        expect(wrapper.vm.dateValue).toBe('2019年10月12日');
        expect(mockFn).toHaveBeenCalled();
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith('2019年10月12日');
        wrapper.vm.joinDateStr({
            year: '2019',
            month: '10',
            day: '',
            tenday: 2
        });
        expect(wrapper.vm.dateValue).toBe('2019年10月中旬');
        expect(mockFn).toHaveBeenCalled();
        expect(mockFn).toHaveBeenCalledTimes(2);
        expect(mockFn).toHaveBeenCalledWith('2019年10月中旬');
    })
    it('测试computed', async () => {
        let rule1 = [{
            required: true,
            message: '请选择月份',
            trigger: 'change'
        }];
        let rule2 = {
            required: false
        };
        wrapper.setProps({
            type: '1'
        });
        await Vue.nextTick();
        expect(wrapper.vm.monthRule).toStrictEqual(rule1);
        wrapper.setProps({
            type: '2'
        });
        await Vue.nextTick();
        expect(wrapper.vm.monthRule).toStrictEqual(rule2);
        wrapper.setProps({
            type: '3'
        });
        await Vue.nextTick();
        expect(wrapper.vm.monthRule).toStrictEqual(rule2);
    });
    it('测试watch', () => {
        wrapper.setProps({
            value: '2020-12-12'
        });
        wrapper.vm.$nextTick(() => {
            expect(wrapper.vm.dateValue).toEqual('2020-12-12');
        })
    });
    it('测试输入框focus——1', async () => {
        wrapper.setProps({
            year: 2000,
            month: '8',
            day: 3,
            tenday: '2',
        })
        await wrapper.find(".select-input input").trigger('focus');
        expect(wrapper.vm.dateForm.year).toBe(2000);
        expect(wrapper.vm.dateForm.month).toBe('8');
        expect(wrapper.vm.dateForm.day).toBe('');
        expect(wrapper.vm.dateForm.tenday).toBe(2);
        expect(wrapper.vm.selectDialogVisible).toBe(true);
        wrapper.setProps({
            year: 1968,
            month: '18',
            day: 3,
            tenday: '',
        })
        await wrapper.find(".select-input input").trigger('focus');
        expect(wrapper.vm.dateForm.year).toBe(1970);
        expect(wrapper.vm.dateForm.month).toBe('');
        expect(wrapper.vm.dateForm.day).toBe(3);
        expect(wrapper.vm.dateForm.tenday).toBe('');
        expect(wrapper.vm.selectDialogVisible).toBe(true);
    })
    it('测试输入框focus——2', () => {
        wrapper = mount(DatePickerTenday, {
            propsData: {
                year: '',
                month: '18',
                day: 32,
                tenday: '3',
            }
        });
        wrapper.find(".select-input input").trigger('focus');
        expect(wrapper.vm.dateForm.year).not.toBe('');
        expect(wrapper.vm.dateForm.year).toBe(new Date().getFullYear());
        expect(wrapper.vm.dateForm.month).toBe('');
        expect(wrapper.vm.dateForm.day).toBe('');
        expect(wrapper.vm.dateForm.tenday).toBe(3);
        expect(wrapper.vm.selectDialogVisible).toBe(true);
    })
    it('年、月下拉触发——changeMonth', async () => {
        wrapper.setData({
            dateForm: {
                year: 2020
            }
        })
        await wrapper.vm.changeMonth();
        expect(wrapper.vm.dayList).toStrictEqual([]);
        expect(wrapper.vm.dateForm.day).toBe('');
        await wrapper.vm.changeMonth(3);
        expect(wrapper.vm.dayList).toStrictEqual(day4);
        expect(wrapper.vm.dateForm.day).toBe('');
        await wrapper.vm.changeMonth(2);
        expect(wrapper.vm.dayList).toStrictEqual(day2);
        expect(wrapper.vm.dateForm.day).toBe('');
    })
    it('天下拉触发——changeDay', async () => {
        let res = await wrapper.vm.changeDay('');
        expect(res).not.toBeDefined();
        wrapper.setData({
            dateForm: {
                month: 5
            }
        })
        await wrapper.vm.changeDay(3);
        expect(wrapper.vm.dateForm.tenday).toBe('');
        // 设置此，避免提示月份必填
        wrapper.setProps({
            type: '3'
        });
        await Vue.nextTick();
        wrapper.setData({
            dateForm: {
                month: ''
            }
        })
        let res2 = await wrapper.vm.changeDay(13);
        expect(wrapper.vm.dateForm.day).toBe('');
        expect(res2).not.toBeDefined();
    })
    it('旬下拉触发——changeTenday', async () => {
        let res = await wrapper.vm.changeTenday('');
        expect(res).not.toBeDefined();
        wrapper.setData({
            dateForm: {
                month: 5
            }
        })
        await wrapper.vm.changeTenday(3);
        expect(wrapper.vm.dateForm.day).toBe('');
        wrapper.setProps({
            type: '3'
        });
        await Vue.nextTick();
        wrapper.setData({
            dateForm: {
                month: ''
            }
        })
        let res2 = await wrapper.vm.changeTenday(1);
        expect(wrapper.vm.dateForm.tenday).toBe('');
        expect(res2).not.toBeDefined();
    })
    it('点击确定submitDate----校验不通过', async () => {
        // 月份必填
        wrapper.setProps({
            type: '1'
        });
        await Vue.nextTick();
        wrapper.setData({
            dateForm: {
                year: 2019,
                month: ''
            }
        })
        await wrapper.find('.dialog-footer .el-button--primary').trigger('click');
        expect(console.warn).toHaveBeenCalled();
        expect(console.warn).toHaveBeenCalledTimes(1);
    })
    it('点击确定submitDate----校验通过', async () => {
        wrapper.setProps({
            type: '2'
        });
        await Vue.nextTick();
        const mockInput = jest.fn();
        const mockYear = jest.fn();
        const mockMonth = jest.fn();
        const mockDay = jest.fn();
        const mockTenday = jest.fn();
        const mockChange = jest.fn();
        wrapper.vm.$on('input', mockInput);
        wrapper.vm.$on('update:year', mockYear);
        wrapper.vm.$on('update:month', mockMonth);
        wrapper.vm.$on('update:day', mockDay);
        wrapper.vm.$on('update:tenday', mockTenday);
        wrapper.vm.$on('change', mockChange);
        // 年月日
        wrapper.setData({
            dateForm: {
                year: 2015,
                month: 10,
                day: 27,
                tenday: ''
            }
        })
        await wrapper.find('.dialog-footer .el-button--primary').trigger('click');
        expect(mockInput).toHaveBeenCalled();
        expect(mockInput).toHaveBeenCalledWith('2015年10月27日');
        expect(mockYear).toHaveBeenCalled();
        expect(mockYear).toHaveBeenCalledWith(2015);
        expect(mockMonth).toHaveBeenCalled();
        expect(mockMonth).toHaveBeenCalledWith(10);
        expect(mockDay).toHaveBeenCalled();
        expect(mockDay).toHaveBeenCalledWith(27);
        expect(mockTenday).toHaveBeenCalled();
        expect(mockTenday).toHaveBeenCalledWith('');
        expect(mockChange).toHaveBeenCalled();
        expect(mockChange).toHaveBeenCalledWith({
            year: 2015,
            month: 10,
            day: 27,
            tenday: ''
        });
        expect(wrapper.vm.selectDialogVisible).toBe(false);
        // 年月下旬
        wrapper.setData({
            dateForm: {
                year: 2020,
                month: 10,
                day: '',
                tenday: 3
            }
        })
        await wrapper.find('.dialog-footer .el-button--primary').trigger('click');
        expect(mockInput).toHaveBeenCalledTimes(4);
        expect(mockInput).toHaveBeenLastCalledWith('2020年10月下旬');
        expect(mockYear).toHaveBeenCalledTimes(2);
        expect(mockYear).toHaveBeenLastCalledWith(2020);
        expect(mockMonth).toHaveBeenCalledTimes(2);
        expect(mockMonth).toHaveBeenLastCalledWith(10);
        expect(mockDay).toHaveBeenCalledTimes(2);
        expect(mockDay).toHaveBeenLastCalledWith(31);
        expect(mockTenday).toHaveBeenCalledTimes(2);
        expect(mockTenday).toHaveBeenLastCalledWith(3);
        expect(mockChange).toHaveBeenCalledTimes(2);
        expect(mockChange).toHaveBeenLastCalledWith({
            year: 2020,
            month: 10,
            day: 31,
            tenday: 3
        });
        expect(wrapper.vm.selectDialogVisible).toBe(false);
        // 年月中旬
        wrapper.setData({
            dateForm: {
                year: 2020,
                month: 10,
                day: '',
                tenday: 2
            }
        })
        await wrapper.find('.dialog-footer .el-button--primary').trigger('click');
        expect(mockInput).toHaveBeenCalledTimes(6);
        expect(mockInput).toHaveBeenLastCalledWith('2020年10月中旬');
        expect(mockYear).toHaveBeenCalledTimes(3);
        expect(mockYear).toHaveBeenLastCalledWith(2020);
        expect(mockMonth).toHaveBeenCalledTimes(3);
        expect(mockMonth).toHaveBeenLastCalledWith(10);
        expect(mockDay).toHaveBeenCalledTimes(3);
        expect(mockDay).toHaveBeenLastCalledWith(20);
        expect(mockTenday).toHaveBeenCalledTimes(3);
        expect(mockTenday).toHaveBeenLastCalledWith(2);
        expect(mockChange).toHaveBeenCalledTimes(3);
        expect(mockChange).toHaveBeenLastCalledWith({
            year: 2020,
            month: 10,
            day: 20,
            tenday: 2
        });
        expect(wrapper.vm.selectDialogVisible).toBe(false);
        // 年月下旬 ，月错误
        wrapper.setData({
            dateForm: {
                year: 2020,
                month: '',
                day: '',
                tenday: 3
            }
        })
        await wrapper.find('.dialog-footer .el-button--primary').trigger('click');
        expect(mockInput).toHaveBeenCalledTimes(8);
        expect(mockInput).toHaveBeenLastCalledWith('2020年下旬');
        expect(mockYear).toHaveBeenCalledTimes(4);
        expect(mockYear).toHaveBeenLastCalledWith(2020);
        expect(mockMonth).toHaveBeenCalledTimes(4);
        expect(mockMonth).toHaveBeenLastCalledWith('');
        expect(mockDay).toHaveBeenCalledTimes(4);
        expect(mockDay).toHaveBeenLastCalledWith('');
        expect(mockTenday).toHaveBeenCalledTimes(4);
        expect(mockTenday).toHaveBeenLastCalledWith(3);
        expect(mockChange).toHaveBeenCalledTimes(4);
        expect(mockChange).toHaveBeenLastCalledWith({
            year: 2020,
            month: '',
            day: '',
            tenday: 3
        });
        expect(wrapper.vm.selectDialogVisible).toBe(false);
    })
})
