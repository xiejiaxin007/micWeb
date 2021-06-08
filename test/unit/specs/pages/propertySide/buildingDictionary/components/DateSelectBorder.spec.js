/*
 * @author: kangxue
 * @Date: 2021-01-05 17:38:20
 * @LastEditors: kangxue
 * @LastEditTime: 2021-01-07 17:48:40
 * @description: 年月日三级联动
 */
import {
    mount
} from '@vue/test-utils';
import DateSelectBorder from '@/pages/propertySide/buildingDictionary/components/DateSelectBorder.vue';
import MockDate from 'mockdate'
const monthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const day28 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
const day29 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
const day30 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
const day31 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
describe('年月日三级联动--初始化为空', () => {
    let wrapper, getTimeFn, yearInput, monthInput, dayInput;
    beforeAll(() => {
        MockDate.set('1991-10-10')
        wrapper = mount(DateSelectBorder, {
            propsData: {
                value: ''
            }
        });
        getTimeFn = jest.fn();
        wrapper.vm.$on('getTime', getTimeFn);
        yearInput = wrapper.findAll('.el-input__inner').at(0);
        monthInput = wrapper.findAll('.el-input__inner').at(1);
        dayInput = wrapper.findAll('.el-input__inner').at(2);
    });
    afterAll(() => {
        wrapper.destroy();
    });
    it('初始化mounted', () => {
        expect(wrapper.vm.currentPropDate).toBe('');
        expect(wrapper.vm.yearOptions).toStrictEqual([1990, 1991]);
    })
    it('选择年', () => {
        yearInput.trigger("change");
        wrapper.findAll('li').at(1).trigger('click');
        expect(wrapper.vm.currentPropDate).toBe('1991年');
        expect(getTimeFn).toHaveBeenCalled();
        expect(getTimeFn).toHaveBeenCalledWith('1991年');
    })
    it('月份focus获取下拉', () => {
        monthInput.trigger("focus");
        expect(wrapper.vm.monthOptions).toStrictEqual(monthArr);
    })
    it('选择5月', () => {
        monthInput.trigger("change");
        // 选择5月
        wrapper.findAll('ul').at(1).findAll('li').at(4).trigger('click');
        expect(wrapper.vm.currentPropDate).toBe('1991年5月');
        expect(getTimeFn).toHaveBeenCalledTimes(2);
        expect(getTimeFn).toHaveBeenCalledWith('1991年5月');
    })
    it('日focus获取下拉', () => {
        dayInput.trigger("focus");
        expect(wrapper.vm.dayOptions).toStrictEqual(day31);
    })
    it('选择日', () => {
        dayInput.trigger("change");
        wrapper.findAll('ul').at(2).findAll('li').at(30).trigger('click');
        expect(wrapper.vm.currentPropDate).toBe('1991年5月31日');
        expect(getTimeFn).toHaveBeenCalledTimes(3);
        expect(getTimeFn).toHaveBeenCalledWith('1991年5月31日');
    })
    it('选择1990年，选择2月，focus下拉日，选择日', () => {
        getTimeFn.mockClear();
        dayInput.trigger("blur");
        yearInput.trigger("change");
        wrapper.findAll('ul').at(0).findAll('li').at(0).trigger('click');
        expect(wrapper.vm.currentPropDate).toBe('1990年5月');
        expect(getTimeFn).toHaveBeenCalledWith('1990年5月');
        expect(wrapper.vm.dayVal).toBe('');
        // 选择2月
        monthInput.trigger("change");
        wrapper.findAll('ul').at(1).findAll('li').at(1).trigger('click');
        expect(wrapper.vm.currentPropDate).toBe('1990年2月');
        expect(getTimeFn).toHaveBeenCalledTimes(2);
        expect(getTimeFn).toHaveBeenCalledWith('1990年2月');
        // 选择20日
        dayInput.trigger("focus");
        dayInput.trigger("change");
        expect(wrapper.vm.dayOptions).toStrictEqual(day28);
        wrapper.findAll('ul').at(2).findAll('li').at(19).trigger('click');
        expect(wrapper.vm.currentPropDate).toBe('1990年2月20日');
        expect(getTimeFn).toHaveBeenCalledTimes(3);
        expect(getTimeFn).toHaveBeenCalledWith('1990年2月20日');
        // 选择28日
        dayInput.trigger("change");
        expect(wrapper.vm.dayOptions).toStrictEqual(day28);
        wrapper.findAll('ul').at(2).findAll('li').at(27).trigger('click');
        expect(wrapper.vm.currentPropDate).toBe('1990年2月28日');
        expect(getTimeFn).toHaveBeenCalledTimes(4);
        expect(getTimeFn).toHaveBeenCalledWith('1990年2月28日');
    })
    it('清空日', () => {
        wrapper.vm.getDayVal();
        expect(getTimeFn).toHaveBeenCalled();
        expect(getTimeFn).toHaveBeenCalledWith('1990年2月');
    })
    it('清空月', () => {
        wrapper.vm.getMonthVal();
        expect(wrapper.vm.dayOptions).toStrictEqual([]);
        expect(wrapper.vm.dayVal).toBe('');
        expect(wrapper.vm.currentPropDate).toBe('1990年');
        expect(getTimeFn).toHaveBeenCalled();
        expect(getTimeFn).toHaveBeenCalledWith('1990年');
    })
    it('清空年', () => {
        wrapper.vm.getyearVal();
        expect(wrapper.vm.monthOptions).toStrictEqual([]);
        expect(wrapper.vm.monthVal).toBe('');
        expect(wrapper.vm.dayOptions).toStrictEqual([]);
        expect(wrapper.vm.dayVal).toBe('');
        expect(wrapper.vm.currentPropDate).toBe('');
        expect(getTimeFn).toHaveBeenCalled();
        expect(getTimeFn).toHaveBeenCalledWith('');
    })
})
describe('年月日三级联动--初始化年月日', () => {
    let wrapper, getTimeFn, monthInput, dayInput;
    beforeAll(() => {
        MockDate.set('2020-10-10')
        wrapper = mount(DateSelectBorder, {
            propsData: {
                value: '2010年1月1日'
            }
        });
        getTimeFn = jest.fn();
        wrapper.vm.$on('getTime', getTimeFn);
        monthInput = wrapper.findAll('.el-input__inner').at(1);
        dayInput = wrapper.findAll('.el-input__inner').at(2);
    });
    afterAll(() => {
        wrapper.destroy();
    });
    it('初始化mounted', () => {
        expect(wrapper.vm.currentPropDate).toBe('2010年1月1日');
        expect(wrapper.vm.yearOptions).toContain(1990);
        expect(wrapper.vm.yearOptions).not.toContain(1989);
        expect(wrapper.vm.yearOptions).toContain(2020);
        expect(wrapper.vm.yearOptions).not.toContain(2021);
        expect(wrapper.vm.yearOptions).toHaveLength(31);
        expect(wrapper.vm.yearVal).toBe(2010);
        expect(wrapper.vm.monthVal).toBe(1);
        expect(wrapper.vm.dayVal).toBe(1);
    })
    it('清空日', () => {
        wrapper.vm.getDayVal();
        expect(getTimeFn).toHaveBeenCalled();
        expect(getTimeFn).toHaveBeenCalledWith('2010年1月');
    })
    it('月份focus获取下拉', () => {
        monthInput.trigger("focus");
        expect(wrapper.vm.monthOptions).toStrictEqual(monthArr);
    })
    it('选择6月', () => {
        monthInput.trigger("change");
        wrapper.findAll('ul').at(1).findAll('li').at(5).trigger('click');
        expect(wrapper.vm.currentPropDate).toBe('2010年6月');
        expect(getTimeFn).toHaveBeenCalledTimes(2);
        expect(getTimeFn).toHaveBeenCalledWith('2010年6月');
    })
    it('清空月', () => {
        wrapper.vm.getMonthVal();
        expect(wrapper.vm.dayOptions).toStrictEqual([]);
        expect(wrapper.vm.dayVal).toBe('');
        expect(wrapper.vm.currentPropDate).toBe('2010年');
        expect(getTimeFn).toHaveBeenCalled();
        expect(getTimeFn).toHaveBeenCalledWith('2010年');
    })
    it('选择日', () => {
        dayInput.trigger("change");
        expect(wrapper.findAll('ul').at(2).findAll('li')).toHaveLength(0);
    })
})
describe('年月日三级联动--不是有效的年月日格式', () => {
    let wrapper, yearInput, monthInput, dayInput;
    beforeAll(() => {
        wrapper = mount(DateSelectBorder, {
            propsData: {
                value: '2018-2-18'
            }
        });
        yearInput = wrapper.findAll('.el-input__inner').at(0);
        monthInput = wrapper.findAll('.el-input__inner').at(1);
        dayInput = wrapper.findAll('.el-input__inner').at(2);
    });
    afterAll(() => {
        wrapper.destroy();
    });
    it('初始化mounted', () => {
        // 直接return false了，全部数据都是空，下拉都为空
        expect(wrapper.vm.currentPropDate).toBe('');
        expect(wrapper.vm.yearOptions).toStrictEqual([]);
        expect(wrapper.vm.yearVal).toBe('');
        expect(wrapper.vm.monthVal).toBe('');
        expect(wrapper.vm.dayVal).toBe('');
        expect(wrapper.findAll('li').exists()).toBeFalsy();
    })
    it('选择年--无下拉', () => {
        yearInput.trigger("focus");
        expect(wrapper.findAll('ul').at(0).findAll('li')).toHaveLength(0);
    })
    it('选择月--无下拉', () => {
        monthInput.trigger("focus");
        expect(wrapper.findAll('ul').at(1).findAll('li')).toHaveLength(0);
    })
    it('选择日--无下拉', () => {
        dayInput.trigger("focus");
        expect(wrapper.findAll('ul').at(2).findAll('li')).toHaveLength(0);
    })
})
describe('年月日三级联动--初始化值是年月格式', () => {
    let wrapper, getTimeFn, dayInput;
    beforeAll(() => {
        MockDate.set('1992-10-10')
        wrapper = mount(DateSelectBorder, {
            propsData: {
                value: '1991年11月'
            }
        });
        getTimeFn = jest.fn();
        wrapper.vm.$on('getTime', getTimeFn);
        dayInput = wrapper.findAll('.el-input__inner').at(2);
    });
    afterAll(() => {
        wrapper.destroy();
    });
    it('初始化mounted', () => {
        expect(wrapper.vm.currentPropDate).toBe('1991年11月');
        expect(wrapper.vm.yearOptions).toStrictEqual([1990, 1991, 1992]);
        expect(wrapper.vm.yearVal).toBe(1991);
        expect(wrapper.vm.monthVal).toBe(11);
        expect(wrapper.vm.dayVal).toBe('');
    })
    it('日focus获取下拉', () => {
        dayInput.trigger("focus");
        expect(wrapper.vm.dayOptions).toStrictEqual(day30);
    })
    it('选择日', () => {
        dayInput.trigger("change");
        wrapper.findAll('ul').at(2).findAll('li').at(10).trigger('click');
        expect(wrapper.vm.currentPropDate).toBe('1991年11月11日');
        expect(getTimeFn).toHaveBeenCalled();
        expect(getTimeFn).toHaveBeenCalledWith('1991年11月11日');
    })
})
describe('年月日三级联动--初始化值是年格式', () => {
    let wrapper, getTimeFn, yearInput, monthInput, dayInput;
    beforeAll(() => {
        MockDate.set('1992-10-10')
        wrapper = mount(DateSelectBorder, {
            propsData: {
                value: '1990年'
            }
        });
        getTimeFn = jest.fn();
        wrapper.vm.$on('getTime', getTimeFn);
        yearInput = wrapper.findAll('.el-input__inner').at(0);
        monthInput = wrapper.findAll('.el-input__inner').at(1);
        dayInput = wrapper.findAll('.el-input__inner').at(2);
    });
    afterAll(() => {
        wrapper.destroy();
    });
    it('初始化mounted', () => {
        expect(wrapper.vm.currentPropDate).toBe('1990年');
        expect(wrapper.vm.yearOptions).toStrictEqual([1990, 1991, 1992]);
        expect(wrapper.vm.yearVal).toBe(1990);
        expect(wrapper.vm.monthVal).toBe('');
        expect(wrapper.vm.dayVal).toBe('');
    })
    it('选择日--无下拉', () => {
        dayInput.trigger("focus");
        expect(wrapper.findAll('ul').at(2).findAll('li')).toHaveLength(0);
    })
    it('月份focus获取下拉', () => {
        monthInput.trigger("focus");
        expect(wrapper.vm.monthOptions).toStrictEqual(monthArr);
    })
    it('选择年', () => {
        yearInput.trigger("change");
        wrapper.findAll('li').at(2).trigger('click');
        expect(wrapper.vm.currentPropDate).toBe('1992年');
        expect(getTimeFn).toHaveBeenCalled();
        expect(getTimeFn).toHaveBeenCalledWith('1992年');
    })
    it('选择2月', () => {
        monthInput.trigger("change");
        wrapper.findAll('ul').at(1).findAll('li').at(1).trigger('click');
        expect(wrapper.vm.currentPropDate).toBe('1992年2月');
        expect(getTimeFn).toHaveBeenCalledTimes(2);
        expect(getTimeFn).toHaveBeenCalledWith('1992年2月');
    })
    it('日focus获取下拉', () => {
        dayInput.trigger("focus");
        expect(wrapper.vm.dayOptions).toStrictEqual(day29);
    })
    it('选择日', () => {
        dayInput.trigger("change");
        wrapper.findAll('ul').at(2).findAll('li').at(28).trigger('click');
        expect(wrapper.vm.currentPropDate).toBe('1992年2月29日');
        expect(getTimeFn).toHaveBeenCalledTimes(3);
        expect(getTimeFn).toHaveBeenCalledWith('1992年2月29日');
    })
})
