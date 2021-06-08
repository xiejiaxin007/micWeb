/*
 * @author: kangxue
 * @Date: 2021-02-20 11:10:46
 * @LastEditors: kangxue
 * @LastEditTime: 2021-03-18 17:16:50
 * @description: 评价配置编辑页单元测试
 */
import {
    mount,
    shallowMount,
    createLocalVue
} from '@vue/test-utils';
import EditSetting from '@/pages/consultor/evaluate/EditSetting.vue';
// import SelectCity from '@/components/SelectCity.vue';
import mockAxios from '#/__mocks__/axios.js';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);
const routes = [{
    path: '/editSetting',
    name: 'editSetting'
}]
const log = console.log;
const warn = console.warn;
// 模拟$message
const Message = jest.fn();
Message.error = jest.fn();
localVue.prototype.$message = Message;
describe('EditSetting评价配置编辑页', () => {
    const signInfo = {
        "accessid": "111",
        "signature": "222"
    };
    const detail = {
        "id": "215",
        "type": "1",
        "name": "测试",
        "grade_levels": "3,4,5",
        "is_show": "2",
        "sort": "0",
        "config_type": "2",
        "img_url": "",
        "yes_text": "123",
        "no_text": "2222",
        "middle_text": "",
        "yes_tag_config_id": "1",
        "no_tag_config_id": "7",
        "middle_tag_config_id": "0",
        "answer_number": "2",
        "customer_type": "3",
        "city_id": ["2", "20000001", "20000019"]
    }
    const tagList = [{
        "tag_config_id": "1",
        "tag_name": "楼盘学习未完成"
    }, {
        "tag_config_id": "2",
        "tag_name": "不合理关上户"
    }]
    let wrapper, store, router, fn, initFn, optFn;
    beforeAll(() => {
        // 获取签名的接口模拟
        mockAxios.post.mockImplementation((url) => {
            if (url === '/backend-api/bk-api-upload/get-upload-sign') {
                return Promise.resolve({
                    data: {
                        code: 0,
                        data: signInfo
                    }
                })
            } else if (url === '/backend-api/comment/detail') {
                // 获取配置详情
                return Promise.resolve({
                    data: {
                        code: 0,
                        data: detail
                    }
                })
            } else if (url === '/backend-api/bk-api-tag-manage/tags-down-list') {
                // 获取标签下拉
                return Promise.resolve({
                    data: {
                        code: 0,
                        data: tagList
                    }
                })
            }
        })
        store = new Vuex.Store({
            state: {
                role: 'admin'
            }
        });
        router = new VueRouter({
            routes
        });
        router.push({
            name: 'editSetting',
            query: {
                setId: '215'
            }
        });
        wrapper = mount(EditSetting, {
            store,
            localVue,
            router,
            mocks: {
                $message: Message
            }
            // stubs: ['SelectCity']
        });
        router.push = jest.fn();
        fn = jest.spyOn(wrapper.vm, 'pageInit')
        initFn = jest.spyOn(wrapper.vm, 'initData');
        optFn = jest.spyOn(wrapper.vm, 'initTagOpts');
    })
    afterAll(() => {
        wrapper.destroy();
    })
    beforeEach(() => {
        console.log = jest.fn();
        console.warn = jest.fn();
    })
    afterEach(() => {
        console.log = log;
        console.warn = warn;
    })
    it('测试created', () => {
        expect(wrapper.vm.role).toBe('admin');
        expect(wrapper.vm.ossData).toStrictEqual(signInfo);
        expect(wrapper.vm.configId).toBe('215');
        expect(wrapper.vm.evaluateForm.evaluateType).toBe("1");
        expect(wrapper.vm.evaluateForm.type).toBe("2");
        expect(wrapper.vm.evaluateForm.title).toBe("测试");
        expect(wrapper.vm.oldTagName).toBe("：测试");
        expect(wrapper.vm.evaluateForm.city).toStrictEqual(["2", "20000001", "20000019"]);
        expect(wrapper.vm.evaluateForm.stars).toStrictEqual(['3', '4', '5']);
        expect(wrapper.vm.evaluateForm.isShow).toBe("2");
        expect(wrapper.vm.evaluateForm.level).toBe(0);
        expect(wrapper.vm.evaluateForm.imgUrl).toBe("");
        expect(wrapper.vm.evaluateForm.imgShow).toBe(1);
        expect(wrapper.vm.imgSrc).toBe("");
        expect(wrapper.vm.evaluateForm.answerNum).toBe("2");
        expect(wrapper.vm.evaluateForm.yesText).toBe("123");
        expect(wrapper.vm.evaluateForm.noText).toBe("2222");
        expect(wrapper.vm.evaluateForm.middleText).toBe("");
        expect(wrapper.vm.evaluateForm.yesTagId).toBe("1");
        expect(wrapper.vm.evaluateForm.noTagId).toBe("7");
        expect(wrapper.vm.evaluateForm.middleId).toBe("");
        expect(wrapper.vm.evaluateForm.seeType).toBe("3");
        expect(wrapper.vm.options).toStrictEqual(tagList);
    });
    it('test computed pageTitle', () => {
        expect(wrapper.vm.pageTitle).toBe('编辑');
    })
    it('test computed answerRule', () => {
        expect(wrapper.vm.answerRule).toBe(8);
    })
    it('test answerChange', async () => {
        let yesItem = wrapper.findComponent({
            ref: 'yesItem'
        })
        let middleItem = wrapper.findComponent({
            ref: 'middleItem'
        })
        let noItem = wrapper.findComponent({
            ref: 'noItem'
        })
        let resetYesFn = jest.spyOn(wrapper.vm.$refs.yesItem, 'resetField');
        let resetNoFn = jest.spyOn(wrapper.vm.$refs.noItem, 'resetField');
        wrapper.vm.answerChange();
        expect(yesItem.exists()).toBe(true);
        expect(resetYesFn).toHaveBeenCalled();
        expect(middleItem.exists()).toBe(false);
        expect(noItem.exists()).toBe(true);
        expect(resetNoFn).toHaveBeenCalled();
        // 有中间答案
        await wrapper.setData({
            evaluateForm: {
                answerNum: '3'
            }
        })
        let resetMiddleFn = jest.spyOn(wrapper.vm.$refs.middleItem, 'resetField');
        wrapper.vm.answerChange();
        expect(yesItem.exists()).toBe(true);
        expect(resetYesFn).toHaveBeenCalled();
        expect(resetYesFn).toHaveBeenCalledTimes(2);
        expect(wrapper.findComponent({
            ref: 'middleItem'
        }).exists()).toBe(true);
        expect(resetMiddleFn).toHaveBeenCalled();
        expect(noItem.exists()).toBe(true);
        expect(resetNoFn).toHaveBeenCalled();
        expect(resetYesFn).toHaveBeenCalledTimes(2);
        // 设置回2，后面的测试按照答案数目为2进行的
        wrapper.setData({
            evaluateForm: {
                answerNum: '2'
            }
        })
    })
    it('test answerInput', () => {
        let callback = jest.fn();
        wrapper.vm.answerInput({
            field: 'yesText'
        }, '正确文案', callback);
        expect(callback).toHaveBeenCalled();
        wrapper.vm.answerInput({
            field: 'yesText'
        }, '正确文案正确文案正确文案', callback);
        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenLastCalledWith(new Error('最多输入8个字'));
        wrapper.vm.answerInput({
            field: 'yesText'
        }, '', callback);
        expect(callback).toHaveBeenCalledTimes(3);
        expect(callback).toHaveBeenLastCalledWith(new Error('请输入正向答案文案'));
        wrapper.vm.answerInput({
            field: 'noText'
        }, '', callback);
        expect(callback).toHaveBeenCalledTimes(4);
        expect(callback).toHaveBeenLastCalledWith(new Error('请输入负向答案文案'));
        wrapper.vm.answerInput({
            field: 'middleText'
        }, '', callback);
        expect(callback).toHaveBeenCalledTimes(5);
        expect(callback).toHaveBeenLastCalledWith(new Error('请输入中间答案文案'));
    })
    it('test getFileURL', () => {
        const validateFn = jest.spyOn(wrapper.vm.$refs.evaluateForm, 'clearValidate');
        let res = wrapper.vm.getFileURL([]);
        expect(wrapper.vm.loading).toBe(false);
        expect(localVue.prototype.$message).toHaveBeenCalled();
        expect(localVue.prototype.$message).toHaveBeenLastCalledWith('上传失败,请重新上传');
        expect(res).not.toBeDefined();
        wrapper.vm.getFileURL([{
                fileURL: '10.png',
                upURL: 'http://testm/10.png'
            },
            {
                fileURL: '20.png',
                upURL: 'http://testm/20.png'
            },
        ]);
        expect(wrapper.vm.loading).toBe(false);
        expect(wrapper.vm.imgSrc).toBe('10.png');
        expect(wrapper.vm.evaluateForm.imgUrl).toBe('http://testm/10.png');
        expect(validateFn).toHaveBeenCalled();
        expect(validateFn).toHaveBeenLastCalledWith(['imgUrl']);
    })
    it('test saveConfig', async () => {
        const validateFn = jest.spyOn(wrapper.vm.$refs.evaluateForm, 'validate');
        mockAxios.post.mockImplementationOnce(() => {
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
        // 第1次请求，正常
        wrapper.find('.btn-area .el-button').trigger('click');
        expect(validateFn).toHaveBeenCalled();
        expect(wrapper.vm.isSubmit).toBe(true);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.isSubmit).toBe(false);
        expect(router.push).toHaveBeenLastCalledWith({
            path: '/evaluate/settingList'
        })
        // 第2次请求，code=1
        wrapper.find('.btn-area .el-button').trigger('click');
        expect(wrapper.vm.isSubmit).toBe(true);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.isSubmit).toBe(false);
        // 第3，4次点击，第5次点击测试重复校验
        wrapper.find('.btn-area .el-button').trigger('click');
        expect(wrapper.vm.isSubmit).toBe(true);
        wrapper.find('.btn-area .el-button').trigger('click');
        expect(wrapper.vm.isSubmit).toBe(true);
    })
    it('test typechange', async () => {
        await wrapper.vm.typeChange();
        expect(wrapper.vm.evaluateForm.city).toStrictEqual([]);
    })
    it('test changeType', async () => {
        wrapper.setData({
            evaluateForm: {
                city: ['2']
            }
        })
        expect(wrapper.vm.evaluateForm.city).toStrictEqual(['2']);
        await wrapper.vm.changeType();
        expect(wrapper.vm.evaluateForm.city).toStrictEqual([]);
    })
    it('test allStarChange', async () => {
        await wrapper.vm.allStarChange(true);
        expect(wrapper.vm.evaluateForm.stars).toStrictEqual(['0', '1', '3', '4', '5']);
        await wrapper.vm.allStarChange(false);
        expect(wrapper.vm.evaluateForm.stars).toStrictEqual([]);
    })
    it('test delimg', async () => {
        expect(wrapper.find('.btn-close').exists()).toBeFalsy();
        await wrapper.setData({
            imgSrc: 'img/1.png',
            evaluateForm: {
                imgShow: 2,
                imgUrl: '1.png'
            }
        })
        expect(wrapper.find('.btn-close').exists()).toBeTruthy();
        await wrapper.find('.btn-close').trigger('click');
        expect(wrapper.vm.imgSrc).toBe('');
        expect(wrapper.vm.evaluateForm.imgUrl).toBe('');
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
        expect(initFn).toHaveBeenCalled();
        expect(optFn).toHaveBeenCalled();
    })
})

describe('EditSetting评价配置编辑页--错误信息', () => {
    const detail = {
        "id": "215",
        "type": "1",
        "name": "测试",
        "grade_levels": "",
        "is_show": "2",
        "sort": "0",
        "config_type": "2",
        "img_url": "1.jpg",
        "host_img_url": "testm.com/1.jpg",
        "yes_text": "",
        "no_text": "",
        "middle_text": "444",
        "yes_tag_config_id": "0",
        "no_tag_config_id": "0",
        "middle_tag_config_id": "4",
        "answer_number": "3",
        "customer_type": "",
        "city_id": ''
    }
    let wrapper, store, router;
    beforeAll(() => {
        mockAxios.post.mockImplementation((url) => {
            if (url === '/backend-api/comment/detail') {
                // 获取配置详情
                return Promise.resolve({
                    data: {
                        code: 0,
                        data: detail
                    }
                })
            } else {
                // 获取标签下拉
                return Promise.resolve({
                    data: {
                        code: 1
                    }
                })
            }
        })
        store = new Vuex.Store({
            state: {
                role: 'admin'
            }
        });
        router = new VueRouter({
            routes
        });
        router.push({
            name: 'editSetting',
            query: {
                setId: '12'
            }
        });
        wrapper = shallowMount(EditSetting, {
            store,
            localVue,
            router
        });
        router.push = jest.fn();
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
    it('getsign failed', async () => {
        mockAxios.post.mockImplementationOnce(() => {
            return Promise.reject('请求失败')
        })
        await wrapper.vm.getSignCode();
        expect(wrapper.vm.ossData).toStrictEqual({});
        expect(console.log).toHaveBeenCalled();
        expect(console.log).toHaveBeenLastCalledWith('请求失败');
    })
    it('测试created', () => {
        expect(wrapper.vm.role).toBe('admin');
        expect(wrapper.vm.ossData).toStrictEqual({});
        expect(wrapper.vm.configId).toBe('12');
        expect(wrapper.vm.evaluateForm.evaluateType).toBe("1");
        expect(wrapper.vm.evaluateForm.type).toBe("2");
        expect(wrapper.vm.evaluateForm.title).toBe("测试");
        expect(wrapper.vm.oldTagName).toBe("：测试");
        expect(wrapper.vm.evaluateForm.city).toStrictEqual([]);
        expect(wrapper.vm.evaluateForm.stars).toStrictEqual([]);
        expect(wrapper.vm.evaluateForm.isShow).toBe("2");
        expect(wrapper.vm.evaluateForm.level).toBe(0);
        expect(wrapper.vm.evaluateForm.imgUrl).toBe("1.jpg");
        expect(wrapper.vm.evaluateForm.imgShow).toBe(2);
        expect(wrapper.vm.imgSrc).toBe("testm.com/1.jpg");
        expect(wrapper.vm.evaluateForm.answerNum).toBe("3");
        expect(wrapper.vm.evaluateForm.yesText).toBe("");
        expect(wrapper.vm.evaluateForm.noText).toBe("");
        expect(wrapper.vm.evaluateForm.middleText).toBe("444");
        expect(wrapper.vm.evaluateForm.yesTagId).toBe("");
        expect(wrapper.vm.evaluateForm.noTagId).toBe("");
        expect(wrapper.vm.evaluateForm.middleId).toBe("4");
        expect(wrapper.vm.evaluateForm.seeType).toBe("3");
        expect(wrapper.vm.options).toStrictEqual([]);
    });
    it('test computed answerRule', () => {
        expect(wrapper.vm.answerRule).toBe(4);
    })
    it('test initData error', async () => {
        mockAxios.post.mockImplementationOnce(() => {
            return Promise.reject('初始化请求失败')
        }).mockImplementationOnce(() => {
            return Promise.resolve({
                data: {
                    code: 1
                }
            })
        })
        await wrapper.vm.initData();
        expect(console.log).toHaveBeenCalled();
        expect(console.log).toHaveBeenLastCalledWith('初始化请求失败');
        wrapper.setData({
            evaluateForm: {
                evaluateType: ''
            }
        })
        await wrapper.vm.initData();
        expect(wrapper.vm.evaluateForm.evaluateType).toBe("");
    })
})
describe('EditSetting评价配置新增页，非admin权限', () => {
    let wrapper, store, router;
    beforeAll(() => {
        router = new VueRouter({
            routes
        });
        store = new Vuex.Store({
            state: {
                role: 'admin'
            }
        });
        router.push({
            name: 'editSetting',
            query: {
                setId: '0'
            }
        });
        wrapper = mount(EditSetting, {
            store,
            localVue,
            router
        });
    })
    afterAll(() => {
        wrapper.destroy();
    })
    it('test computed pageTitle', () => {
        expect(wrapper.vm.pageTitle).toBe('新增');
    })
    it('test add saveconfig', async () => {
        expect(store.state.role).toBe('admin');
        mockAxios.post.mockImplementationOnce((url, params) => {
            expect(params.img_url).toBe('1.png');
            expect(params.yes_tag_config_id).toBe('1');
            expect(params.no_tag_config_id).toBe('2');
            expect(params.middle_tag_config_id).toBe('');
            return Promise.resolve({
                data: {
                    code: 1
                }
            })
        }).mockImplementationOnce((url, params) => {
            expect(params.yes_tag_config_id).toBe('');
            expect(params.no_tag_config_id).toBe('');
            return Promise.resolve({
                data: {
                    code: 1
                }
            })
        })
        wrapper.setData({
            evaluateForm: {
                evaluateType: '1',
                type: '2',
                answerNum: '2',
                seeType: '3',
                city: ["2", "20000001", "20000019"],
                stars: ['3', '4', '5'],
                title: '测试',
                yesText: '正确文案',
                noText: '错误问啊',
                middleText: '',
                yesTagId: '1',
                noTagId: '2',
                middleId: '0',
                imgShow: 2,
                imgUrl: '1.png',
                level: 0,
                isShow: '2'
            }
        })
        // 第1次请求 测试img_url赋值，yes_tag_config_id，no_tag_config_id赋值
        wrapper.find('.btn-area .el-button').trigger('click');
        expect(wrapper.vm.isSubmit).toBe(true);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.isSubmit).toBe(false);
        // 第2次请求 测试
        wrapper.setData({
            evaluateForm: {
                yesTagId: '0',
                noTagId: '0'
            }
        })
        wrapper.find('.btn-area .el-button').trigger('click');
        expect(wrapper.vm.isSubmit).toBe(true);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.isSubmit).toBe(false);
        // 判断文案字数，问题最多40个字
        await wrapper.setData({
            evaluateForm: {
                title: '我的文案字多我的文案字多我的文案字多我的文案字多我的文案字多我的文案字多我的文案字多超过40个字'
            }
        })
        wrapper.find('.btn-area .el-button').trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.findAll('.el-form-item__error').exists()).toBe(true);
        expect(wrapper.findAll('.el-form-item__error').length).toBe(1);
        expect(wrapper.find('.el-form-item__error').text()).toBe('请控制在40个字内');
        // 判断文案字数，问题字数正常
        await wrapper.setData({
            evaluateForm: {
                title: '我的文案字多我的文案字多我的文案，问题文案不超过40个字'
            }
        })
        wrapper.find('.btn-area .el-button').trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.findAll('.el-form-item__error').exists()).toBe(false);
        // 判断文案字数，标签最多10个字
        await wrapper.setData({
            evaluateForm: {
                type: '1'
            }
        })
        wrapper.find('.btn-area .el-button').trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.findAll('.el-form-item__error').exists()).toBe(true);
        expect(wrapper.find('.el-form-item__error').text()).toBe('请控制在10个字内');
        // 判断文案字数，标签最多10个字
        await wrapper.setData({
            evaluateForm: {
                type: '1',
                title: '标签最多10个字'
            }
        })
        wrapper.find('.btn-area .el-button').trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.findAll('.el-form-item__error').exists()).toBe(false);
    })
    it('test computed pageTitle', () => {
        router.push({
            name: 'editSetting',
            query: {
                setId: '21'
            }
        });
        wrapper = shallowMount(EditSetting, {
            store,
            localVue,
            router
        });
        expect(wrapper.vm.configId).toBe('21');
        expect(wrapper.vm.pageTitle).toBe('编辑');
    })
    it('test computed pageTitle', () => {
        router.push({
            name: 'editSetting',
            query: {
                setId: ''
            }
        });
        wrapper = shallowMount(EditSetting, {
            store,
            localVue,
            router
        });
        expect(wrapper.vm.configId).toBe('');
        expect(wrapper.vm.pageTitle).toBe('编辑');
    })
    it('test other power not admin created', () => {
        store = new Vuex.Store({
            state: {
                role: 'finance'
            }
        });
        wrapper = shallowMount(EditSetting, {
            store,
            localVue
        });
        let fn = jest.spyOn(wrapper.vm, 'pageInit')
        let initFn = jest.spyOn(wrapper.vm, 'initData');
        let optFn = jest.spyOn(wrapper.vm, 'initTagOpts');
        expect(wrapper.vm.configId).toBe('0');
        expect(fn).not.toHaveBeenCalled();
        expect(initFn).not.toHaveBeenCalled();
        expect(optFn).not.toHaveBeenCalled();
    })
})
