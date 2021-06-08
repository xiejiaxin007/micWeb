/*
 * @author: xiejiaxin
 * @Date: 2020-12-09 17:08:09
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-01-03 21:52:24
 * @description: 远程实时下拉
 */
import { mount } from '@vue/test-utils';
import SearchSelectRadio from '@/components/SearchSelectRadio.vue';
import mockAxios from '#/__mocks__/axios.js';
const list = [
    {
        value: '1',
        name: '黄金糕'
    }, {
        value: '2',
        name: '双皮奶'
    }
];
const result = {
    // 正常返回
    normal: {
        data: {
            code: 0,
            data: {
                list: list
            }
        }
    },
    // 未搜索到内容
    empty: {
        data: {
            code: 0,
            data: {
                list: []
            }
        }
    },
    // 数据返回异常
    typeErr: {
        data: {
            code: 1,
            data: {
                list: []
            }
        }
    },
    mostDataQ: {
        data: {
            code: 0,
            data: {
                list: [
                    {
                        value: '1',
                        name: '黄金糕'
                    }, {
                        value: '2',
                        name: '双皮奶'
                    }, {
                        value: '4',
                        name: '猪蹄儿'
                    }
                ]
            }
        }
    },
    // 数据比较多情况
    mostData: {
        data: {
            code: 0,
            data: {
                list: [
                    {
                        value: '1',
                        name: '黄金糕'
                    }, {
                        value: '2',
                        name: '双皮奶'
                    }, {
                        value: '3',
                        name: '烧烤'
                    }, {
                        value: '4',
                        name: '猪蹄儿'
                    }, {
                        value: '5',
                        name: '烤鱼'
                    }, {
                        value: '6',
                        name: '火锅'
                    }
                ]
            }
        }
    },
    // 数据list返回异常
    listErr: {
        data: {
            code: 0,
            data: {
                list: ''
            }
        }
    }
}
const fn = (type) => {
    return mockAxios.get.mockImplementation(() => {
        // 使用深度克隆，防止请求配置对象被修改
        return new Promise((resolve) => resolve(JSON.parse(JSON.stringify(result[type]))));
    });
};
const errFn = () => {
    return mockAxios.get.mockImplementation(() => {
        return Promise.reject('failed');
    });
};
const mountFun = (attr) => {
    // multiple=true，value如果设置成字符串，单元测试会报错
    let obj = {
        value: '',
        apiInfo: {},
        multiple: false
    };
    Object.assign(obj, attr);
    let wrp = mount(SearchSelectRadio, {
        propsData: obj
    });
    return wrp;
}
describe('远程实时下拉搜索基础测试', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(SearchSelectRadio, {
            propsData: {
                value: '',
                apiInfo: {},
                placeholder: '测试placeholder',
                isDisabled: false
            }
        });
    });
    afterEach(() => {
        wrapper.destroy();
    });
    it('测试组件是否正常渲染', () => {
        expect(wrapper.classes()).toContain('custom-search-input');
        expect(wrapper.find('.el-select').exists()).toBe(true);
    });
    it('测试组件的v-model绑定', () => {
        const mockFn = jest.fn();
        wrapper.vm.$on('input', mockFn);
        wrapper.setProps({
            value: '1'
        });
        wrapper.vm.$nextTick(() => {
            expect(wrapper.vm.selectModel).toBe('1');
            expect(mockFn).toHaveBeenCalled();
            expect(mockFn).toHaveBeenCalledWith('1');
        });
    });
    it('测试默认值', async () => {
        await wrapper.setProps({
            value: '3',
            chosenList: [
                {
                    value: '3',
                    name: '豆乳奶茶'
                }
            ],
            apiInfo: {
                api: ''
            }
        });
        // 测试text值
        // expect(wrapper.vm.$el.querySelector('.el-input__inner').text).toBe('豆乳奶茶');
        expect(wrapper.vm.selectModel).toBe('3');
        expect(wrapper.vm.apiInfo).toStrictEqual({
            api: ''
        });
    });
    it('测试属性placeholder', () => {
        expect(wrapper.find('.el-input__inner').attributes().placeholder).toBe('测试placeholder');
    });
    it('测试属性isDisabled', () => {
        expect(wrapper.find('.el-input__inner').attributes().readonly).toBe('readonly');
    });
    it('测试属性clearable', () => {
        wrapper.setProps({
            clearable: true,
            value: '1'
        });
        let vm = wrapper.find('.el-select').vm;
        const select = vm.$children[0];
        select.inputHovering = true;
        setTimeout(() => {
            const iconClear = vm.$el.querySelector('.el-input__icon.el-icon-circle-close');
            expect(iconClear.exists()).toBe(true);
            iconClear.trigger('click')
            expect(vm.value).toBe('');
        }, 100);
    });
    it('没有开始搜索-测试单选情况下，已经选中为空的情况', () => {
        // 测试mounted函数里面的逻辑，需要单独挂载
        let newWp = mount(SearchSelectRadio, {
            propsData: {
                value: '',
                apiInfo: {},
                multiple: false,
                chosenObj: {}
            }
        });
        expect(newWp.vm.listKey).toStrictEqual({
            key: 'value',
            keyWord: 'name'
        });
        expect(newWp.vm.chosenObj[newWp.vm.listKey.key]).toBe('');
        expect(newWp.vm.chosenObj[newWp.vm.listKey.keyWord]).toBe('');
        let secWp = mountFun({
            multiple: true,
            chosenObj: {}
        });
        expect(secWp.vm.chosenObj).toStrictEqual({});
        newWp.destroy();
        secWp.destroy();

    });
    it('单选情况下，默认选中值类型判断、有默认值和没有默认值下拉数组判断', async() => {
        await wrapper.setProps({
            multiple: false
        });
        // 判断list
        expect(wrapper.vm.options).toStrictEqual([]);
        await wrapper.setProps({
            chosenObj: {}
        });
        wrapper.vm.$nextTick(() => {
            // 默认值测试
            expect(wrapper.vm.listKey).toStrictEqual({
                key: 'value',
                keyWord: 'name'
            });
            expect(wrapper.vm.chosenObj[wrapper.vm.listKey.key]).toBe('');
            expect(wrapper.vm.chosenObj[wrapper.vm.listKey.keyWord]).toBe('');
        });
        // 下拉框有值，并且默认选中也有值，是下拉框里面包含的选项
        await wrapper.setData({
            options: [{
                value: '1',
                name: '黄金糕'
            }],
            mountedFlag: true
        });
        await wrapper.setProps({
            chosenObj: {
                value: '1',
                name: '黄金糕'
            }
        });
        expect(wrapper.vm.options).toStrictEqual([{
            value: '1',
            name: '黄金糕'
        }]);
    });
    it('没有开始搜索-单选情况下，有默认值和没有默认值下拉数组判断', () => {
        let newWp = mountFun({
            chosenObj: {}
        });
        expect(newWp.vm.options).toStrictEqual([]);
        // 如果默认值类型是数组，list不会受影响
        let secWp = mountFun({
            chosenObj: [
                {
                    value: '3',
                    name: '豆乳奶茶'
                }
            ]
        });
        expect(secWp.vm.chosenObj[secWp.vm.listKey.key]).not.toBeDefined();
        expect(secWp.vm.options).toStrictEqual([]);
        // 单选情况下，已经选中的数组应该是个空数组
        expect(secWp.vm.hasChosenList).toStrictEqual([]);
        // 测试有默认值
        let thrWp = mountFun({
            chosenObj: {
                value: '3',
                name: '豆乳奶茶'
            }
        });
        expect(thrWp.vm.chosenObj).toBeDefined();
        expect(thrWp.vm.chosenObj[thrWp.vm.listKey.key]).toBeDefined();
        thrWp.vm.$nextTick(() => {
            expect(thrWp.vm.options).toStrictEqual([
                {
                    value: '3',
                    name: '豆乳奶茶'
                }
            ]);
            // 单选情况下，已经选中的数组应该是个空数组
            expect(thrWp.vm.hasChosenList).toStrictEqual([]);
        });
        newWp.destroy();
        secWp.destroy();
        thrWp.destroy();
    });
    it('多选情况下，有默认值和没有默认值测试', () => {
        let newWp = mountFun({
            multiple: true,
            chosenObj: []
        });
        newWp.vm.$nextTick(() => {
            expect(newWp.vm.options).toStrictEqual([]);
            expect(newWp.vm.hasChosenList).toStrictEqual([]);
        });
        let data = [
            {
                value: '3',
                name: '豆乳奶茶'
            },
            {
                value: '4',
                name: '奶酪'
            }
        ];
        let secWp = mountFun({
            multiple: true,
            chosenObj: data
        });
        
        secWp.vm.$nextTick(() => {
            expect(secWp.vm.options).toStrictEqual(data);
            expect(secWp.vm.hasChosenList).toStrictEqual(data);
        });
        newWp.destroy();
        secWp.destroy();
    });
});
describe('远程实时下拉接口请求后展示数据测试', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(SearchSelectRadio, {
            propsData: {
                value: '',
                apiInfo: {}
            }
        });
    });
    afterEach(() => {
        wrapper.destroy();
    });
    it('点击组件，触发远程搜索方法', async() => {
        wrapper.vm.remoteMethod = jest.fn();
        await wrapper.find('.el-select').trigger('click');
        expect(wrapper.find('.el-input').classes()).toContain('is-focus');
        expect(wrapper.vm.remoteMethod).toBeCalled();
    });
    it('测试远程下拉基础数据', async() => {
        // 接口正常情况下，有默认值，测试默认值
        wrapper.setProps({
            apiInfo: {
                api: fn('normal'),
                params: {
                    q: ''
                }
            },
            chosenList: [
                {
                    value: '11',
                    name: '默认已经选中'
                }
            ]
        });
        await wrapper.vm.remoteMethod('2');
        expect(wrapper.vm.apiInfo.params.q).toStrictEqual('2');
        expect(wrapper.vm.apiInfo.params.exclude).toStrictEqual(['11']);
        // 测试默认值格式不正确
        wrapper.setProps({
            chosenList: [
                {
                    value: ''
                }
            ]
        });
        await wrapper.vm.remoteMethod();
        expect(wrapper.vm.apiInfo.params.exclude).toStrictEqual([]);
        // 测试接口返回的数据list格式不正确
        wrapper.setProps({
            apiInfo: {
                api: fn('listErr'),
                params: {
                    q: ''
                }
            }
        });
        await wrapper.vm.remoteMethod();
        expect(wrapper.vm.options).toStrictEqual([
            {
                value: 999,
                name: '没有更多数据了',
                disabled: true
            }
        ]);
        // 测试接口返回报错情况
        const originConsole = console.log;
        console.log = jest.fn();
        wrapper.setProps({
            apiInfo: {
                api: errFn(),
                params: {
                    q: ''
                }
            }
        });
        await wrapper.vm.remoteMethod();
        expect(console.log).toHaveBeenCalled();
        expect(wrapper.vm.loading).toBe(false);
        expect(console.log).toHaveBeenCalledWith('failed');
        console.log = originConsole;
    });
    it('测试[单选]情况下的远程下拉数据', async() => {
        wrapper.setProps({
            apiInfo: {
                api: fn('normal'),
                params: {
                    q: ''
                }
            }
        });
        // 正常返回值
        await wrapper.vm.remoteMethod('2');
        expect(wrapper.vm.apiInfo.params.q).toStrictEqual('2');
        expect(wrapper.vm.options).toStrictEqual([
            {
                value: '1',
                name: '黄金糕'
            }, {
                value: '2',
                name: '双皮奶'
            }
        ]);
        // 测试有正常值和默认值
        wrapper.setProps({
            apiInfo: {
                api: fn('normal'),
                params: {
                    q: ''
                }
            },
            chosenObj: {
                value: '3',
                name: '豆乳奶茶'
            }
        });
        await wrapper.vm.remoteMethod();
        expect(wrapper.vm.options).toStrictEqual([
            {
                value: '3',
                name: '豆乳奶茶'
            },
            {
                value: '1',
                name: '黄金糕'
            }, {
                value: '2',
                name: '双皮奶'
            }
        ]);
        // 测试有正常值和默认值（下拉里面已经包含默认值情况）
        wrapper.setProps({
            apiInfo: {
                api: fn('normal'),
                params: {
                    q: ''
                }
            },
            chosenObj: {
                value: '1',
                name: '黄金糕'
            }
        });
        await wrapper.vm.remoteMethod();
        expect(wrapper.vm.options).toStrictEqual([
            {
                value: '1',
                name: '黄金糕'
            }, {
                value: '2',
                name: '双皮奶'
            }
        ]);
        // 返回数据格式不正常
        wrapper.setProps({
            apiInfo: {
                api: fn('typeErr'),
                params: {
                    q: ''
                }
            }
        });
        await wrapper.vm.remoteMethod()
        expect(wrapper.vm.options).toStrictEqual([]);
        // 不正常值
        wrapper.setProps({
            apiInfo: {
                api: fn('empty'),
                params: {
                    q: ''
                }
            }
        });
        await wrapper.vm.remoteMethod('');
        expect(wrapper.vm.options).toStrictEqual([
            {
                value: 999,
                name: '没有更多数据了',
                disabled: true
            }
        ]);
    });
    it('测试[多选]情况下的远程下拉数据', async() => {
        wrapper.setProps({
            multiple: true,
            value: [],
            apiInfo: {
                api: fn('normal'),
                params: {
                    q: ''
                }
            },
            chosenObj: {}
        });
        // 正常返回值
        await wrapper.vm.remoteMethod('2');
        expect(wrapper.vm.apiInfo.params.q).toStrictEqual('2');
        expect(wrapper.vm.options).toStrictEqual([
            {
                value: '1',
                name: '黄金糕'
            }, {
                value: '2',
                name: '双皮奶'
            }
        ]);
        // 有正常值和格式错误的默认值
        wrapper.setProps({
            apiInfo: {
                api: fn('normal'),
                params: {
                    q: ''
                }
            },
            chosenObj: {
                value: '3',
                name: '豆乳奶茶'
            }
        });
        await wrapper.vm.remoteMethod();
        expect(wrapper.vm.options).toStrictEqual([
            {
                value: '1',
                name: '黄金糕'
            }, {
                value: '2',
                name: '双皮奶'
            }
        ]);
        wrapper.setProps({
            chosenObj: [
                {
                    value: '3',
                    name: '豆乳奶茶'
                },
                {
                    value: '4',
                    name: '香喷喷的烤鱼'
                }
            ]
        });
        await wrapper.vm.remoteMethod();
        expect(wrapper.vm.options).toStrictEqual([
            {
                value: '4',
                name: '香喷喷的烤鱼'
            },
            {
                value: '3',
                name: '豆乳奶茶'
            },
            {
                value: '1',
                name: '黄金糕'
            }, {
                value: '2',
                name: '双皮奶'
            }
        ]);
        // 返回数据格式不正常
        wrapper.setProps({
            apiInfo: {
                api: fn('typeErr'),
                params: {
                    q: ''
                }
            }
        });
        await wrapper.vm.remoteMethod()
        expect(wrapper.vm.options).toStrictEqual([]);
        // 不正常值
        wrapper.setProps({
            apiInfo: {
                api: fn('empty'),
                params: {
                    q: ''
                }
            },
        });
        await wrapper.vm.remoteMethod('');
        expect(wrapper.vm.options).toStrictEqual([
            {
                value: 999,
                name: '没有更多数据了',
                disabled: true
            }
        ]);
    });
    it('下拉框选中事件change', async() => {
        const mockFn = jest.fn();
        wrapper.vm.$on('changeSelect', mockFn);
        await wrapper.vm.changeOption('1');
        expect(mockFn).toBeTruthy();
        expect(mockFn).toHaveBeenCalled();
        expect(mockFn).toHaveBeenCalledWith('1');
    });
    it('测试下拉展开的时候才进行请求方法调用', async() => {
        wrapper.vm.remoteMethod = jest.fn();
        await wrapper.vm.visibleChangeSelect(false);
        expect(wrapper.vm.remoteMethod).not.toBeCalled();
    });
    it('测试原生绑定的下拉框项选中事件', async() => {
        wrapper.setProps({
            apiInfo: {
                api: fn('normal'),
                params: {
                    q: ''
                }
            }
        });
        wrapper.vm.selectChange = jest.fn();
        const select = wrapper.find('.el-select').vm;
        await wrapper.find('.el-input__inner').setValue('1');
        await wrapper.vm.remoteMethod('1');
        const dropItem = select.$el.querySelectorAll('.el-select-dropdown__item');
        await dropItem[0].click();
        expect(wrapper.vm.selectChange).toBeCalled();
    });
    it('测试绑定的原生事件被触发后，emit是否触发', async() => {
        const mockFn = jest.fn();
        wrapper.vm.$on('getOption', mockFn);
        wrapper.vm.selectChange({
            value: '1',
            name: '黄金糕'
        });
        // 触发原生绑定事件后，emit
        expect(mockFn).toBeTruthy();
        expect(mockFn).toHaveBeenCalledWith({
            value: '1',
            name: '黄金糕'
        });
        await wrapper.setProps({
            multiple: true
        });
        wrapper.vm.selectChange({
            value: '2',
            name: '烧烤'
        });
        expect(mockFn).toBeTruthy();
        expect(wrapper.vm.hasChosenList).toStrictEqual([{
            value: '2',
            name: '烧烤'
        }]);
        expect(mockFn).toHaveBeenLastCalledWith([{
            value: '2',
            name: '烧烤'
        }]);
    });
    it('测试删除数组方法', () => {
        let lists = [
            {
                value: '1',
                name: '测试1'
            },
            {
                value: '2',
                name: '测试2'
            }
        ];
        expect(lists).toHaveLength(2);
        wrapper.vm.delByIndex('1', lists);
        expect(lists).toHaveLength(1);
        expect(lists).toStrictEqual([
            {
                value: '2',
                name: '测试2'
            }
        ]);
        let listTwo = [
            {
                value: '2',
                name: '测试2'
            }
        ];
        // 判断传入的第二个参数必须是数组
        const res = wrapper.vm.delByIndex('1', {});
        expect(res).toBe(false);
        // 传入的id没有找到
        wrapper.vm.delByIndex(1, listTwo);
        expect(listTwo).toHaveLength(1);
        expect(lists).toStrictEqual([
            {
                value: '2',
                name: '测试2'
            }
        ]);
    });
    it('测试watch--已经选择了几个选项后，去掉某一个选项', async() => {
        await wrapper.setProps({
            multiple: true,
            value: ['1', '2', '3', '4', '5'],
            apiInfo: {
                api: fn('mostData'),
                params: {
                    q: ''
                }
            },
            chosenObj: [
                {
                    value: '1',
                    name: '黄金糕'
                }, {
                    value: '2',
                    name: '双皮奶'
                }, {
                    value: '3',
                    name: '烧烤'
                }, {
                    value: '4',
                    name: '猪蹄儿'
                }, {
                    value: '5',
                    name: '烤鱼'
                }
            ]
        });
        await wrapper.vm.remoteMethod();
        // wrapper.vm.delByIndex = jest.fn();
        // 去掉最后一个
        await wrapper.setData({
            selectModel: ['1', '2', '3', '4']
        });
        // expect(wrapper.vm.delByIndex).toHaveBeenCalled();
        expect(wrapper.vm.hasChosenList).toStrictEqual([{
            value: '1',
            name: '黄金糕'
        }, {
            value: '2',
            name: '双皮奶'
        }, {
            value: '3',
            name: '烧烤'
        }, {
            value: '4',
            name: '猪蹄儿'
        }]);
        expect(wrapper.vm.options).toStrictEqual([ {
            value: '1',
            name: '黄金糕'
        },{
            value: '2',
            name: '双皮奶'
        }, {
            value: '3',
            name: '烧烤'
        }, {
            value: '4',
            name: '猪蹄儿'
        }, {
            value: '5',
            name: '烤鱼'
        }, {
            value: '6',
            name: '火锅'
        }]);
        // 去掉中间某一个
        await wrapper.setData({
            selectModel: ['1', '2', '4']
        });
        expect(wrapper.vm.hasChosenList).toStrictEqual([{
            value: '1',
            name: '黄金糕'
        }, {
            value: '2',
            name: '双皮奶'
        }, {
            value: '4',
            name: '猪蹄儿'
        }]);
        expect(wrapper.vm.options).toStrictEqual([ {
            value: '1',
            name: '黄金糕'
        },{
            value: '2',
            name: '双皮奶'
        }, {
            value: '3',
            name: '烧烤'
        },{
            value: '4',
            name: '猪蹄儿'
        }, {
            value: '5',
            name: '烤鱼'
        }, {
            value: '6',
            name: '火锅'
        }]);
        await wrapper.setProps({
            apiInfo: {
                api: fn('mostDataQ'),
                params: {
                    q: '黄金糕'
                }
            }
        });
        await wrapper.setData({
            selectModel: ['1', '2', '4']
        });
        await wrapper.vm.remoteMethod();
        expect(wrapper.vm.hasChosenList).toStrictEqual([{
            value: '1',
            name: '黄金糕'
        }, {
            value: '2',
            name: '双皮奶'
        }, {
            value: '4',
            name: '猪蹄儿'
        }]);
        expect(wrapper.vm.options).toStrictEqual([{
            value: '1',
            name: '黄金糕'
        }, {
            value: '2',
            name: '双皮奶'
        }, {
            value: '4',
            name: '猪蹄儿'
        }]);
        // 删除某一个，并且删除的那一项不在搜索范围内
        await wrapper.setProps({
            apiInfo: {
                api: fn('mostDataQ'),
                params: {
                    q: '黄金糕'
                }
            }
        });
        await wrapper.setData({
            selectModel: ['1', '2']
        });
        expect(wrapper.vm.hasChosenList).toStrictEqual([{
            value: '1',
            name: '黄金糕'
        }, {
            value: '2',
            name: '双皮奶'
        }]);
        expect(wrapper.vm.options).toStrictEqual([{
            value: '1',
            name: '黄金糕'
        }, {
            value: '2',
            name: '双皮奶'
        }]);
        // 删除某一个，并且删除的那一项在搜索范围内
        await wrapper.setProps({
            apiInfo: {
                api: fn('mostDataQ'),
                params: {
                    q: '黄金糕'
                }
            }
        });
        await wrapper.setData({
            selectModel: ['2']
        });
        expect(wrapper.vm.hasChosenList).toStrictEqual([{
            value: '2',
            name: '双皮奶'
        }]);
        expect(wrapper.vm.options).toStrictEqual([{
            value: '1',
            name: '黄金糕'
        }, {
            value: '2',
            name: '双皮奶'
        }]);
    });
    it('测试手动失去焦点事件', async() => {
        // 测试isBlurByChange是false
        expect(wrapper.vm.isBlurByChange).toBe(false);
        await wrapper.setProps({
            isBlurByChange: true
        });
        expect(wrapper.vm.isBlurByChange).toBe(true);
        expect(wrapper.find('.el-input').classes).not.toContain('is-focus');
        // 再次获取焦点
        await wrapper.find('.el-select').trigger('click');
        expect(wrapper.find('.el-input').classes()).toContain('is-focus');
        // 修改传入的值
        await wrapper.setProps({
            isBlurByChange: false
        });
        expect(wrapper.find('.el-input').classes).not.toContain('is-focus');
    });
});