/*
 * @author: kangxue
 * @Date: 2021-04-16 18:10:00
 * @LastEditors: kangxue
 * @LastEditTime: 2021-04-23 16:52:13
 * @description: 测试新建编辑楼栋
 */
import {
    mount,
    createLocalVue
} from '@vue/test-utils';
import BuildingDetailEdit from '@/pages/propertySide/buildingDictionary/expandInfoTaskList/BuildingDetailEdit.vue';
import info from './data/BuildingDetailEdit.js'
import mockAxios from '#/__mocks__/axios.js';
import VueRouter from 'vue-router';
const localVue = createLocalVue();
localVue.use(VueRouter);
const routes = [{
    path: '/buildingDetailEdit',
    name: 'buildingDetailEdit'
}, {
    path: '/buildingDetailAdd',
    name: 'buildingDetailAdd'
}, {
    path: '/test',
    name: 'test'
}]
// 模拟utils/index中的方法
const utils = require('@/pages/propertySide/buildingDictionary/utils/index.js');
jest.mock('@/pages/propertySide/buildingDictionary/utils/index.js', () => {
    return {
        isRequiredInfoOrigin: jest.fn().mockReturnValue(true).mockReturnValueOnce(false),
        getOriginOperateInfo: jest.fn().mockImplementation(() => {
            return '来源填写时间';
        }),
        confirmMsg: jest.fn().mockImplementation(() => {
            return Promise.resolve(true);
        }).mockImplementationOnce(() => {
            return Promise.resolve(false);
        }),
        setTrack: jest.fn().mockImplementation(() => {
            return 'setTrack';
        }),
    }
})
// 模拟commonFun
jest.mock('@/assets/js/utils/utils.js', () => {
    return {
        commonFun: {
            deepClone: jest.fn().mockImplementation((params) => {
                return params;
            }),
            getDevice: jest.fn().mockReturnValue('mac').mockReturnValueOnce('mac').mockReturnValueOnce('windows')
        }
    }
})
// 模拟$message
const Message = jest.fn();
Message.error = jest.fn();
Message.warning = jest.fn();
localVue.prototype.$message = Message;
const Alert = jest.fn();
localVue.prototype.$alert = Alert;
describe('测试编辑楼栋', () => {
    mockAxios.get.mockImplementation((url) => {
        let data = {};
        let msg = '';
        switch (url) {
            case '/backend-api/project/cj-project/get':
                data = {
                    city_id: "2",
                    name: "测试区域缓存-2",
                    project_type_text: "住宅"
                };
                break;
            case '/backend-api/project/cj-building-info/field-source-get-info':
                data = info.fieldSourceInfo;
                break;
            case '/backend-api/project/cj-project-field-belong-config/get-page-module-fields-by-page':
                data = info.getEmptyInitData;
                break;
            case '/backend-api/project/qd-building/get-license-building':
                data = info.getlicenseBuildingById;
                break;
            case '/backend-api/project/cj-project-field-belong-config/del-building':
                data = {};
                msg = '删除成功';
                break;
        }
        return Promise.resolve({
            data: {
                code: 0,
                data: data,
                msg: msg
            }
        })
    });
    let wrapper, router, query;
    const mockStore = {
        dispatch: jest.fn(),
        state: {
            buildingDictionary: {
                isAuditorAuth: 2
            }
        }
    }
    let getNecessaryDataSpy, initInfoDealwithSpy, getHrefUrlSpy, editInfoSpy, toNewPageSpy, getInfoValidSpy, goToDynamicSaleSpy, remoteDelBuildingByIdSpy, saveCapacityInfoSpy;
    beforeAll(() => {
        // 模拟window.open
        window.open = jest.fn();
        // 模拟localstorage
        jest.spyOn(Storage.prototype, 'getItem');
        localStorage.getItem.mockImplementation((key) => {
            return JSON.stringify(info[key]);
        });
        // 模拟监听
        jest.spyOn(document, 'addEventListener');
        query = {
            projectId: 200488456,
            taskId: 1,
            buildingId: 123,
            isEdit: 1,
            buildingName: '%E6%A5%BC%E7%9B%98',
            role: 'operation',
            isDynamic: 1
        }
        router = new VueRouter({
            routes
        });
        router.push({
            name: 'buildingDetailEdit',
            query: query
        });
        wrapper = mount(BuildingDetailEdit, {
            localVue,
            router,
            mocks: {
                $store: mockStore,
                $message: Message,
                $alert: Alert
            }
        });
        getNecessaryDataSpy = jest.spyOn(wrapper.vm, 'getNecessaryData');
        initInfoDealwithSpy = jest.spyOn(wrapper.vm, 'initInfoDealwith');
        getHrefUrlSpy = jest.spyOn(wrapper.vm, 'getHrefUrl');
        editInfoSpy = jest.spyOn(wrapper.vm, 'editInfo');
        toNewPageSpy = jest.spyOn(wrapper.vm, 'toNewPage');
        getInfoValidSpy = jest.spyOn(wrapper.vm, 'getInfoValid');
        goToDynamicSaleSpy = jest.spyOn(wrapper.vm, 'goToDynamicSale');
        remoteDelBuildingByIdSpy = jest.spyOn(wrapper.vm, 'remoteDelBuildingById').mockResolvedValue(true).mockResolvedValueOnce(false);
        saveCapacityInfoSpy = jest.spyOn(wrapper.vm, 'saveCapacityInfo');
        jest.spyOn(global, 'setTimeout');
    });
    afterAll(() => {
        wrapper.destroy();
    });
    describe('test created', () => {
        it('computed--mapState', () => {
            expect(wrapper.vm.getEditAuth).toBe(2);
            expect(wrapper.vm.isEdit).toBe(true);
        })
        it('test-getConfigLists', () => {
            expect(localStorage.getItem).toHaveBeenCalled();
            expect(localStorage.getItem).toHaveBeenCalledWith('getConfigLists');
            expect(wrapper.vm.getConfigList).toStrictEqual(info.getConfigLists);
        })
        it('test created ---- getisEditAuth', () => {
            expect(mockStore.dispatch).toHaveBeenCalled();
            expect(mockStore.dispatch).toHaveBeenLastCalledWith('isEditAuth', {
                task_id: 1,
                page_id: 8
            });
        })
        it('test created ---- getProjectInfo', () => {
            expect(wrapper.vm.cityId).toBe('2');
            expect(wrapper.vm.projectName).toBe('测试区域缓存-2');
            expect(wrapper.vm.buildingType).toBe('(住宅)');
            expect(wrapper.vm.getProjectNameAndTypes).toBe('测试区域缓存-2(住宅)--');
        })
        it('test created ---- initHandle', () => {
            expect(wrapper.vm.projectId).toBe(query.projectId);
            expect(wrapper.vm.taskId).toBe(1);
            expect(wrapper.vm.buildingId).toBe(123);
            expect(wrapper.vm.isEditVal).toBe(1);
            expect(wrapper.vm.buildingName).toBe('楼盘');
            expect(wrapper.vm.isEdit).toBe(true);
        })
        it('test created ---- isOperation', () => {
            expect(wrapper.vm.breadText).toBe('楼盘列表');
        })
        it('test created ---- getBuildInitData----getEmptyInitData', () => {
            let data1 = info.fieldSourceInfo;
            let data2 = info.getEmptyInitData;
            expect(wrapper.vm.initOriginData).toStrictEqual(data1);
            expect(wrapper.vm.originData).toStrictEqual([data1.building_base_detail.data]);
            expect(wrapper.vm.buildingData).toHaveLength(1);
            expect(wrapper.vm.buildingData[0]).toHaveProperty('name');
            expect(wrapper.vm.buildingData[0]).toHaveProperty('baseInfo');
            expect(wrapper.vm.buildingData[0]).toHaveProperty('relativeInfo');
            expect(wrapper.vm.buildingData[0].name).toEqual('initOrg');
            expect(wrapper.vm.needRemote).toBe(true);
            expect(getNecessaryDataSpy).toHaveBeenCalled();
            expect(getNecessaryDataSpy).toHaveBeenCalledTimes(4);
            expect(initInfoDealwithSpy).toHaveBeenCalled();
            expect(initInfoDealwithSpy).toHaveBeenCalledTimes(2);
            expect(initInfoDealwithSpy).toHaveBeenNthCalledWith(1, data1);
            expect(initInfoDealwithSpy).toHaveBeenNthCalledWith(2, data2);
            expect(wrapper.vm.spaceModuleData).toHaveProperty('baseInfo');
            expect(wrapper.vm.spaceModuleData).toHaveProperty('relativeInfo');
            expect(wrapper.vm.spaceModuleData).toHaveProperty('name');
            expect(wrapper.vm.spaceModuleData.name).toEqual('initEmptyOrg');
        })
        it('test created ---- getlicenseBuildingById', () => {
            expect(wrapper.vm.licenseBuildingList).toEqual(info.getlicenseBuildingById);
        })
    })
    describe('test Listener', () => {
        it('test Listener', () => {
            expect(document.addEventListener).toHaveBeenCalled();
            expect(document.addEventListener).toHaveBeenCalledTimes(2);
            expect(document.addEventListener).toHaveBeenNthCalledWith(1, 'keydown', wrapper.vm.handleKeyDown);
            expect(document.addEventListener).toHaveBeenNthCalledWith(2, 'keyup', wrapper.vm.handleKeyUp);
            expect(wrapper.vm.device).toBe('mac');
        })
        it('test Listener ---- handleKeyDown --mac状态点击保存', async () => {
            getInfoValidSpy.mockClear();
            let mockFn = jest.fn();
            wrapper.vm.handleKeyDown({
                key: 'meta',
                preventDefault: mockFn
            });
            wrapper.vm.handleKeyDown({
                key: 's',
                preventDefault: mockFn
            });
            expect(wrapper.vm.arrKey).toStrictEqual(['meta', 's']);
            expect(wrapper.vm.keydown).toBe('meta+s');
            expect(wrapper.vm.dialogVisible).toBe(false);
            expect(getInfoValidSpy).toHaveBeenCalled();
            expect(mockFn).toHaveBeenCalled();
            // 如果dialogVisible = true
            await wrapper.setData({
                dialogVisible: true,
                keydown: '',
                arrKey: []
            })
            wrapper.vm.handleKeyDown({
                key: 'meta',
                preventDefault: mockFn
            });
            wrapper.vm.handleKeyDown({
                key: 's',
                preventDefault: mockFn
            });
            expect(wrapper.vm.arrKey).toStrictEqual(['meta', 's']);
            expect(wrapper.vm.keydown).toBe('meta+s');
            expect(wrapper.vm.isGo).toBe(true);
            expect(getInfoValidSpy).toHaveBeenCalled();
            expect(getInfoValidSpy).toHaveBeenCalledTimes(2);
            expect(wrapper.vm.dialogVisible).toBe(false);
            expect(mockFn).toHaveBeenCalledTimes(2);
            // 点击去重
            let result = wrapper.vm.handleKeyDown({
                key: 's',
                preventDefault: mockFn
            });
            expect(result).not.toBeDefined();
        })
        it('test Listener ---- handleKeyDown --mac状态点击编辑', async () => {
            editInfoSpy.mockClear();
            await wrapper.setData({
                isEdit: false,
                keydown: '',
                arrKey: []
            })
            let mockFn = jest.fn();
            wrapper.vm.handleKeyDown({
                key: 'meta',
                preventDefault: mockFn
            });
            wrapper.vm.handleKeyDown({
                key: 'e',
                preventDefault: mockFn
            });
            expect(wrapper.vm.arrKey).toStrictEqual(['meta', 'e']);
            expect(wrapper.vm.keydown).toBe('meta+e');
            expect(editInfoSpy).toHaveBeenCalled();
            expect(editInfoSpy).toHaveBeenCalledWith(true);
            expect(mockFn).toHaveBeenCalled();
        })
        it('test Listener ---- handleKeyUp', () => {
            let mockFn = jest.fn();
            wrapper.vm.handleKeyUp({
                preventDefault: mockFn
            });
            expect(wrapper.vm.keydown).toBe('');
            expect(wrapper.vm.arrKey).toStrictEqual([]);
            expect(mockFn).toHaveBeenCalled();
        })
    })
    describe('test other methods', () => {
        it('test editInfo', () => {
            router.push = jest.fn();
            let params = {
                projectId: 200488456,
                taskId: 1,
                buildingId: 123,
                buildingName: '%E6%A5%BC%E7%9B%98',
                role: 'operation',
                isEdit: "1"
            };
            // 先确定前置条件
            expect(wrapper.vm.$route.query).toEqual(params);
            expect(wrapper.vm.$route.name).toBe('buildingDetailEdit');
            // 第1次测试
            wrapper.vm.editInfo(true);
            expect(wrapper.vm.$route.query).not.toHaveProperty('isDynamic')
            expect(router.push).toHaveBeenLastCalledWith({
                name: 'buildingDetailEdit',
                query: {
                    ...params,
                    isEdit: '1'
                }
            })
            // 第2次测试
            wrapper.vm.editInfo(false);
            let {
                isEdit,
                ...params2
            } = params;
            expect(router.push).toHaveBeenCalledTimes(2);
            expect(router.push).toHaveBeenLastCalledWith({
                name: 'buildingDetailEdit',
                query: {
                    ...params2,
                }
            })
            expect(wrapper.vm.$route.query).not.toHaveProperty('isDynamic')
            expect(wrapper.vm.$route.query).not.toHaveProperty('isEdit')
        })
        it('test dealwithHouse', () => {
            let result1 = wrapper.vm.dealwithHouse({
                relation_house_types: '1'
            });
            expect(result1).toBe('1');
            let result2 = wrapper.vm.dealwithHouse({
                relation_house_types: ['1', '2'],
                test: ['3', '4']
            });
            expect(result2).toStrictEqual(['1', '2']);
            let result3 = wrapper.vm.dealwithHouse({
                test: ['3', '4']
            });
            expect(result3).not.toBeDefined();
        })
        it('test getHrefUrl', () => {
            let taskId = query.taskId,
                projectId = query.projectId,
                role = query.role;
            let baseUrl = '/dist/building/tabToggleList?projectId=' + projectId + '&taskId=' + taskId + '&role=' + role;
            let result1 = wrapper.vm.getHrefUrl(1);
            expect(result1).toBe(baseUrl + '&cityId=2&projectName=测试区域缓存-2&buildingType=(住宅)&positionTab=1&isEdit=');
            let result2 = wrapper.vm.getHrefUrl(2);
            expect(result2).toBe(baseUrl + '&cityId=2&projectName=测试区域缓存-2&buildingType=(住宅)&positionTab=2&isEdit=');
            let result3 = wrapper.vm.getHrefUrl(2, 1);
            expect(result3).toBe(baseUrl + '&cityId=2&projectName=测试区域缓存-2&buildingType=(住宅)&positionTab=2&isEdit=1');
        })
        it('test editBuildingStatus', () => {
            utils.setTrack.mockClear();
            // 第1次测试
            wrapper.setData({
                getConfigList: {
                    current_role_source: 8
                }
            })
            wrapper.vm.editBuildingStatus();
            expect(utils.setTrack).toHaveBeenCalled();
            expect(utils.setTrack).toHaveBeenCalledWith(6484, {
                error_type: '3',
                role: '1',
                frompage: '3',
                topage: '3'
            });
            expect(wrapper.vm.selfConsistentDialogvisible).toBe(false);
            // 第2次测试
            wrapper.setData({
                getConfigList: {
                    current_role_source: 7
                }
            })
            wrapper.vm.editBuildingStatus();
            expect(utils.setTrack).toHaveBeenCalledTimes(2);
            expect(utils.setTrack).toHaveBeenCalledWith(6484, {
                error_type: '3',
                role: '2',
                frompage: '3',
                topage: '3'
            });
            expect(wrapper.vm.selfConsistentDialogvisible).toBe(false);
        })
        it('test editProjectStatus', () => {
            utils.setTrack.mockClear();
            window.open.mockClear();
            getHrefUrlSpy.mockClear();
            // 第1次测试
            wrapper.setData({
                getConfigList: {
                    current_role_source: 8
                }
            })
            wrapper.vm.editProjectStatus();
            expect(utils.setTrack).toHaveBeenCalled();
            expect(utils.setTrack).toHaveBeenCalledWith(6482, {
                error_type: '3',
                role: '1',
                frompage: '3',
                topage: '1'
            });
            expect(window.open).toHaveBeenCalled();
            expect(getHrefUrlSpy).toHaveBeenCalled();
            expect(getHrefUrlSpy).toHaveBeenCalledWith(2);
            // 第2次测试
            wrapper.setData({
                getConfigList: {
                    current_role_source: 7
                }
            })
            wrapper.vm.editProjectStatus();
            expect(utils.setTrack).toHaveBeenCalled();
            expect(utils.setTrack).toHaveBeenCalledTimes(2);
            expect(utils.setTrack).toHaveBeenCalledWith(6482, {
                error_type: '3',
                role: '2',
                frompage: '3',
                topage: '1'
            });
            expect(window.open).toHaveBeenCalled();
            expect(getHrefUrlSpy).toHaveBeenCalledTimes(2);
            expect(getHrefUrlSpy).toHaveBeenLastCalledWith(2);
        })
        it('test changeMark', () => {
            let item1 = {
                    field_value: '1'
                },
                item2 = {
                    field_value: '3'
                }
            wrapper.vm.changeMark(item1);
            expect(item1.field_value).toBe('2');
            wrapper.vm.changeMark(item2);
            expect(item2.field_value).toBe('1');
        })
        it('test getValueOrText', () => {
            let result1 = wrapper.vm.getValueOrText({
                field_name: 'test',
                field_value: '1'
            });
            expect(result1).toBe('1');
            let result2 = wrapper.vm.getValueOrText({
                field_name: 'test2',
                field_value: '2'
            });
            expect(result2).toBe('2');
            let result3 = wrapper.vm.getValueOrText({
                field_name: 'saling_status',
                field_value: 'saling_status_value',
                field_text: '销售状态'
            });
            expect(result3).toBe('销售状态');
            let result4 = wrapper.vm.getValueOrText({
                field_name: 'saling_status',
                field_value: 'saling_status_value',
                field_text: ['1室', '1厅']
            });
            expect(result4).toBe('1室,1厅');
            let result5 = wrapper.vm.getValueOrText({
                field_name: 'relation_house_types',
                field_value: '22',
                field_text: ['2', '3', '4']
            });
            expect(result5).toBe('2,3,4');
        })
        it('test getNecessaryData', () => {
            const test1 = {
                field_id: '1',
                field_name: '2',
                field_value: '3',
                field_text: '4',
                field_desc: '5',
                belong_role: '6',
                belong_other: '7',
                is_show_belong_role: '8',
                belong_employee_id: '9',
                belong_employee_name: '10',
                belong_datetime: '11',
                table_id: '12',
                url: '14',
                field_test: '13',
            }
            const test2 = {
                field_id: '1',
                field_name: '2',
                field_value: '3',
                field_text: '4',
                field_desc: '5',
                belong_role: '6',
                belong_other: '7',
                is_show_belong_role: '8',
                belong_employee_id: '9',
                belong_employee_name: '10',
                belong_datetime: '11',
                table_id: '12'
            }
            const origin1 = {
                test1: test1,
                test2: test2
            };
            let result1 = wrapper.vm.getNecessaryData(origin1);
            expect(result1).toHaveProperty('test1');
            expect(result1).toHaveProperty('test2');
            expect(result1.test1).not.toHaveProperty('field_test');
            expect(result1.test1).toHaveProperty('url', '14');
            expect(result1.test1).toEqual({
                ...test2,
                url: '14'
            });
            expect(result1.test2).not.toHaveProperty('url');
            expect(result1.test2).toEqual(test2);
        })
        it('test initInfoDealwith', () => {
            const initData = {
                saling_status: {
                    field_value: ''
                },
                is_show: {
                    field_value: '1'
                },
                test_data1: {
                    is_show_belong_role: '1',
                    belong_role: '2',
                },
                test_data2: {
                    is_show_belong_role: '2',
                    belong_role: '2',
                },
            }
            const data = {
                building_base_detail: {
                    data: initData
                }
            }
            let result = wrapper.vm.initInfoDealwith(data);
            expect(result.saling_status.field_value).toBe('');
            expect(result.is_show.field_value).toBe(1);
            expect(result.test_data1.belong_role).toBe(2);
            expect(result.test_data2.belong_role).toBe('2');
        })
        it('test changeSource', () => {
            let buildingData = wrapper.vm.buildingData;
            wrapper.setData({
                buildingData: [{
                        baseInfo: {
                            used_name: {
                                belong_role: '2'
                            }
                        },
                        name: 'initOrg'
                    }, {
                        baseInfo: {
                            used_name: {
                                belong_role: '2'
                            }
                        },
                        name: 'initOrg'
                    },
                    {
                        baseInfo: {
                            used_name: {
                                belong_role: '3'
                            }
                        },
                        name: 'initEmptyOrg'
                    },
                ]
            })
            // 第1次测试
            wrapper.vm.changeSource('initOrg', 'used_name', 1, '1', '');
            expect(wrapper.vm.buildingData[0].baseInfo).toHaveProperty('used_name');
            expect(wrapper.vm.buildingData[0].baseInfo.used_name.belong_role).toBe('1');
            expect(wrapper.vm.buildingData[1].baseInfo.used_name.belong_role).toBe('2');
            // 第2次测试
            wrapper.vm.changeSource('initOrg', 'used_name', 2, '1', '');
            expect(wrapper.vm.buildingData[2].baseInfo.used_name.belong_role).toBe('3');
            // 第3次测试
            wrapper.vm.changeSource('initEmptyOrg', 'used_name', 2, '1', '');
            expect(wrapper.vm.buildingData[2].baseInfo.used_name.belong_role).toBe('3');
            // 第4次测试
            wrapper.vm.changeSource('initEmptyOrg', 'used_name', 1, '1', '');
            expect(wrapper.vm.buildingData[2].baseInfo.used_name.belong_role).toBe('1');
            // 第5次测试
            jest.useFakeTimers();
            setTimeout.mockClear();
            wrapper.vm.changeSource('initOrg', 'used_name', 1, '10', '其他');
            expect(wrapper.vm.buildingData[0].baseInfo.used_name.belong_other).toBe('其他');
            expect(setTimeout).toBeCalledTimes(1);
            expect(setTimeout).toBeCalledWith(expect.any(Function), 800);
            jest.advanceTimersByTime(800);
            expect(wrapper.vm.belongOther).toBe('其他');
            // 避免后面的测试需要用，还是还原一下比较好
            wrapper.setData({
                buildingData: buildingData
            })
        })
        it('test isOperation', () => {
            // 第1次测试
            wrapper.vm.$route.query.role = 'test';
            wrapper.vm.isOperation();
            expect(wrapper.vm.breadText).toBe('楼盘列表');
            // 第2次测试
            wrapper.vm.$route.query.role = 'operation';
            wrapper.vm.isOperation();
            expect(wrapper.vm.breadText).toBe('楼盘列表');
            // 第3次测试
            wrapper.vm.$route.query.role = 'expand';
            wrapper.vm.isOperation();
            expect(wrapper.vm.breadText).toBe('楼盘任务列表');
            // 还原初始的role值
            wrapper.vm.$route.query.role = 'operation';
        })
        it('test goToListPage', () => {
            // 模拟window.location
            let location = window.location;
            const windowLocation = JSON.stringify(window.location);
            delete window.location;
            Object.defineProperty(window, 'location', {
                value: JSON.parse(windowLocation),
                writable: true
            });
            router.push.mockClear();
            // 第1次测试
            wrapper.vm.$route.query.role = 'test';
            wrapper.vm.goToListPage();
            expect(router.push).not.toHaveBeenCalled();
            // 第2次测试
            wrapper.vm.$route.query.role = 'operation';
            wrapper.vm.goToListPage();
            expect(window.location.href).toBe('/index.php?r=yw-projects/index');
            // 第3次测试
            wrapper.vm.$route.query.role = 'expand';
            wrapper.vm.goToListPage();
            expect(router.push).toHaveBeenCalled();
            expect(router.push).toHaveBeenCalledWith({
                path: '/building/ExpandTaskList'
            });
            // 还原初始的role值
            wrapper.vm.$route.query.role = 'operation';
            // 还原location
            window.location = location;
        })
        it('test goToDynamicSale', () => {
            router.push.mockClear();
            getHrefUrlSpy.mockClear();
            wrapper.vm.goToDynamicSale();
            expect(getHrefUrlSpy).toHaveBeenCalled();
            expect(getHrefUrlSpy).toHaveBeenCalledWith(2);
            expect(router.push).toHaveBeenLastCalledWith(expect.not.stringContaining('/dist/'));
        })
        it('test addSpaceBuilding', () => {
            let buildingData = wrapper.vm.buildingData;
            let spaceModuleData = wrapper.vm.spaceModuleData;
            let originData = wrapper.vm.originData;
            wrapper.vm.buildingData = [{
                        baseInfo: {
                            building_name: {
                                field_value: '2'
                            }
                        }
                    },
                    {
                        baseInfo: {
                            building_name: {
                                field_value: '3'
                            }
                        }
                    },
                ],
                wrapper.vm.spaceModuleData = {
                    baseInfo: {
                        building_name: {
                            field_value: '1'
                        }
                    }
                };
            wrapper.vm.originData = [];
            wrapper.vm.addSpaceBuilding();
            expect(wrapper.vm.buildingData).toHaveLength(3);
            expect(wrapper.vm.buildingData[2]).toEqual({
                baseInfo: {
                    building_name: {
                        field_value: ''
                    }
                }
            });
            expect(wrapper.vm.originData).toHaveLength(1);
            expect(wrapper.vm.originData[0]).toEqual({
                building_name: {
                    field_value: ''
                }
            });
            // 避免后面的测试需要用，还是还原一下比较好
            wrapper.setData({
                buildingData: buildingData,
                spaceModuleData: spaceModuleData,
                originData: originData
            })
        })
        it('test delBuild remoteDelBuildingById', async () => {
            utils.confirmMsg.mockClear();
            let buildingData = wrapper.vm.buildingData;
            let originData = wrapper.vm.originData;
            // 前置条件
            wrapper.setData({
                buildingData: [1, 2, 3],
                originData: [11, 22, 33],
            })
            // 第一次测试---confirmMsg=false
            wrapper.vm.needRemote = true;
            let result1 = await wrapper.vm.delBuild(0);
            expect(utils.confirmMsg).toHaveBeenCalled();
            expect(utils.confirmMsg).toHaveBeenCalledWith('一旦删除则数据无法恢复，请确认是否删除！');
            expect(result1).not.toBeDefined();
            expect(remoteDelBuildingByIdSpy).not.toHaveBeenCalled();
            expect(wrapper.vm.buildingData).toHaveLength(3);
            expect(wrapper.vm.originData).toHaveLength(3);
            // 第2次测试 ---confirmMsg=true, remoteDelBuildingByIdSpy=false
            let result2 = await wrapper.vm.delBuild(0);
            expect(utils.confirmMsg).toHaveBeenCalledTimes(2);
            expect(result2).not.toBeDefined();
            expect(remoteDelBuildingByIdSpy).toHaveBeenCalled();
            expect(wrapper.vm.buildingData).toHaveLength(3);
            expect(wrapper.vm.originData).toHaveLength(3);
            // 第3次测试 ---confirmMsg=true
            await wrapper.vm.delBuild(1);
            expect(utils.confirmMsg).toHaveBeenCalledTimes(3);
            expect(remoteDelBuildingByIdSpy).toHaveBeenCalledTimes(1);
            expect(wrapper.vm.buildingData).toStrictEqual([1, 3]);
            expect(wrapper.vm.originData).toStrictEqual([11, 33]);
            // 第4次测试 ---confirmMsg=true
            wrapper.vm.needRemote = false;
            await wrapper.vm.delBuild(0);
            expect(utils.confirmMsg).toHaveBeenCalledTimes(4);
            expect(remoteDelBuildingByIdSpy).toHaveBeenCalledTimes(1);
            expect(wrapper.vm.buildingData).toEqual([3]);
            expect(wrapper.vm.originData).toEqual([33]);
            // 恢复数据
            wrapper.setData({
                buildingData: buildingData,
                originData: originData,
            })
        })
        it('test remoteDelBuildingById', async () => {
            remoteDelBuildingByIdSpy.mockRestore();
            localVue.prototype.$message.mockClear();
            wrapper.vm.needRemote = true;
            expect(wrapper.vm.needRemote).toBe(true);
            let res = await wrapper.vm.remoteDelBuildingById();
            expect(localVue.prototype.$message).toHaveBeenCalled();
            expect(localVue.prototype.$message).toHaveBeenLastCalledWith('删除成功');
            expect(wrapper.vm.needRemote).toBe(false);
            expect(res).toBe(true);
        })
        it('test copyPrevBuilding', () => {
            let buildingData = wrapper.vm.buildingData;
            let originData = wrapper.vm.originData;
            // 第一次测试
            wrapper.setData({
                buildingData: [1, 2, {
                    baseInfo: {
                        building_name: {
                            field_value: '1'
                        },
                        used_name: {
                            field_value: '2'
                        }
                    }
                }],
                originData: [11],
            })
            wrapper.vm.copyPrevBuilding();
            expect(wrapper.vm.buildingData).toHaveLength(4);
            expect(wrapper.vm.buildingData[3]).toEqual({
                baseInfo: {
                    building_name: {
                        field_value: ''
                    },
                    used_name: {
                        field_value: ''
                    }
                }
            });
            expect(wrapper.vm.originData).toHaveLength(2);
            expect(wrapper.vm.originData[1]).toEqual({
                building_name: {
                    field_value: ''
                },
                used_name: {
                    field_value: ''
                }
            });
            // 第2次测试
            wrapper.setData({
                buildingData: [1, {
                    baseInfo: {
                        building_name: {
                            field_value: '1'
                        }
                    }
                }],
                originData: [1, 2],
            })
            wrapper.vm.copyPrevBuilding();
            expect(wrapper.vm.buildingData).toHaveLength(3);
            expect(wrapper.vm.buildingData[2]).toEqual({
                baseInfo: {
                    building_name: {
                        field_value: ''
                    }
                }
            });
            expect(wrapper.vm.originData).toHaveLength(3);
            expect(wrapper.vm.originData[2]).toEqual({
                building_name: {
                    field_value: ''
                }
            });
            // 恢复数据
            wrapper.setData({
                buildingData: buildingData,
                originData: originData,
            })
        })
        it('test toNewPage', () => {
            window.open.mockClear();
            getHrefUrlSpy.mockClear();
            // 第一次测试    data中没有url
            wrapper.vm.url = '/building/projectSituation'
            wrapper.vm.toNewPage();
            expect(window.open).toHaveBeenCalled();
            expect(getHrefUrlSpy).toHaveBeenCalled();
            expect(getHrefUrlSpy).toHaveBeenLastCalledWith(4);
            // 第2次测试
            wrapper.setData({
                url: '/building/capacityPlan'
            })
            let result2 = wrapper.vm.toNewPage();
            expect(window.open).toHaveBeenCalled();
            expect(window.open).toHaveBeenCalledTimes(2);
            expect(getHrefUrlSpy).toHaveBeenCalled();
            expect(getHrefUrlSpy).toHaveBeenLastCalledWith(3, 1);
            expect(result2).not.toBeDefined();
            // 第3次测试
            wrapper.setData({
                url: '/building/tabToggleList'
            })
            let result3 = wrapper.vm.toNewPage();
            expect(window.open).toHaveBeenCalled();
            expect(window.open).toHaveBeenCalledTimes(3);
            expect(getHrefUrlSpy).toHaveBeenCalled();
            expect(getHrefUrlSpy).toHaveBeenLastCalledWith(2, 1);
            expect(result3).not.toBeDefined();
            // 第4次测试
            wrapper.setData({
                url: '/building/test'
            })
            let result4 = wrapper.vm.toNewPage();
            expect(window.open).toHaveBeenCalled();
            expect(window.open).toHaveBeenCalledTimes(4);
            expect(window.open).toHaveBeenLastCalledWith('/building/test');
            expect(result4).not.toBeDefined();
        })
        it('test toEdit', () => {
            wrapper.vm.toEdit('baidu.com');
            expect(wrapper.vm.url).toBe('baidu.com');
            expect(wrapper.vm.dialogVisible).toBe(true);
            wrapper.setData({
                dialogVisible: false
            })
            wrapper.vm.toEdit('julive.com');
            expect(wrapper.vm.url).toBe('julive.com');
            expect(wrapper.vm.dialogVisible).toBe(true);
        })
        it('test goToPage', () => {
            editInfoSpy.mockClear();
            toNewPageSpy.mockClear();
            getInfoValidSpy.mockClear();
            // 第1次测试
            let result1 = wrapper.vm.goToPage(true);
            expect(wrapper.vm.isGo).toBe(true);
            expect(getInfoValidSpy).toHaveBeenCalled();
            expect(wrapper.vm.dialogVisible).toBe(false);
            expect(editInfoSpy).not.toHaveBeenCalled();
            expect(result1).not.toBeDefined();
            // 第2次测试
            getInfoValidSpy.mockClear();
            wrapper.vm.goToPage(false);
            expect(toNewPageSpy).toHaveBeenCalled();
            expect(wrapper.vm.dialogVisible).toBe(false);
            expect(editInfoSpy).toHaveBeenCalled();
            expect(editInfoSpy).toHaveBeenCalledWith(false);
            expect(getInfoValidSpy).not.toHaveBeenCalled();
        })
        it('test goToBuildPos', () => {
            window.open.mockClear();
            wrapper.vm.goToBuildPos('lz');
            expect(wrapper.vm.dialogVisible).toBe(true);
            expect(wrapper.vm.url).toBe('/index.php?r=yw-projects%2Fupdate&project_id=' + query.projectId + '&page_tag=view-common-info');
            wrapper.vm.goToBuildPos('smxkz');
            expect(window.open).toHaveBeenCalled();
            expect(window.open).toHaveBeenCalledWith('/index.php?r=cj-license%2Findex&project_id=' + query.projectId);
        })
        describe('test getInfoValid group', () => {
            let buildingData, callBackFn, validateTrue;
            beforeAll(() => {
                buildingData = wrapper.vm.buildingData;
                // 表单validate 的callback模拟
                callBackFn = jest.fn().mockImplementation((params) => {
                    return !!params;
                })
                validateTrue = {
                    validate: (callBack) => {
                        callBack(callBackFn(true));
                    }
                }
            })
            beforeEach(() => {
                goToDynamicSaleSpy.mockClear();
                localVue.prototype.$message.warning.mockClear();
                localVue.prototype.$message.mockClear();
                saveCapacityInfoSpy.mockClear();
            })
            afterAll(() => {
                wrapper.setData({
                    buildingData: buildingData,
                })
            })
            it('test getInfoValid---1---是否有值', () => {
                wrapper.setData({
                    buildingData: [],
                })
                let result = wrapper.vm.getInfoValid();
                expect(goToDynamicSaleSpy).toHaveBeenCalled();
                expect(result).not.toBeDefined();
            })
            it('test getInfoValid---2----必填', () => {
                wrapper.setData({
                    buildingData: [1, 2],
                })
                wrapper.vm.$refs.buildingForm = [
                    validateTrue,
                    {
                        validate: (callBack) => {
                            callBack(callBackFn(false));
                        }
                    }
                ]
                let result = wrapper.vm.getInfoValid();
                expect(localVue.prototype.$message.warning).toHaveBeenCalled();
                expect(localVue.prototype.$message.warning).toHaveBeenLastCalledWith('请检查必填信息是否填写完整!');
                expect(result).not.toBeDefined();
            })
            it('test getInfoValid---3---楼栋名称重复提醒', () => {
                wrapper.setData({
                    buildingData: [{
                        baseInfo: {
                            building_name: {
                                field_value: 'name1'
                            }
                        }
                    }, {
                        baseInfo: {
                            building_name: {
                                field_value: 'name1'
                            }
                        }
                    }],
                })
                wrapper.vm.$refs.buildingForm = [
                    validateTrue,
                    validateTrue
                ]
                let result = wrapper.vm.getInfoValid();
                expect(localVue.prototype.$message.warning).toHaveBeenCalled();
                expect(localVue.prototype.$message.warning).toHaveBeenCalledWith('楼栋名称不可重复');
                expect(result).not.toBeDefined();
            })
            it('test getInfoValid---4--楼栋销售状态自洽判断1', () => {
                wrapper.setData({
                    buildingData: [{
                        baseInfo: {
                            building_name: {
                                field_value: 'name1',
                            },
                            saling_status: {
                                field_value: '3'
                            },
                            on_sale_num: {
                                field_value: '20'
                            }
                        }
                    }],
                })
                wrapper.vm.$refs.buildingForm = [
                    validateTrue
                ]
                let result = wrapper.vm.getInfoValid();
                expect(localVue.prototype.$message).toHaveBeenCalled();
                expect(localVue.prototype.$message).toHaveBeenCalledWith('售罄楼栋在售房源量需要为0或者空');
                expect(result).not.toBeDefined();
            })
            it('test getInfoValid---5---楼栋销售状态自洽判断2', () => {
                wrapper.setData({
                    buildingData: [{
                        baseInfo: {
                            building_name: {
                                field_value: 'name2'
                            },
                            saling_status: {
                                field_value: '2'
                            },
                            on_sale_num: {
                                field_value: 0
                            }
                        }
                    }]
                })
                wrapper.vm.$refs.buildingForm = [
                    validateTrue
                ]
                let result = wrapper.vm.getInfoValid();
                expect(localVue.prototype.$message).toHaveBeenCalled();
                expect(localVue.prototype.$message).toHaveBeenCalledWith('在售/待售楼栋的在售房源量不能为0');
                expect(result).not.toBeDefined();
            })
            it('test getInfoValid---6---isRequiredInfoOrigin不符合', () => {
                wrapper.setData({
                    buildingData: [{
                        baseInfo: {
                            building_name: {
                                field_value: 'name2'
                            },
                            saling_status: {
                                field_value: '2'
                            },
                            on_sale_num: {
                                field_value: '1'
                            }
                        }
                    }]
                })
                wrapper.vm.$refs.buildingForm = [
                    validateTrue
                ]
                let result = wrapper.vm.getInfoValid();
                expect(result).not.toBeDefined();
            })
            it('test getInfoValid---7---通过', () => {
                let baseInfo = (name) => {
                    return {
                        building_name: {
                            field_value: name
                        },
                        saling_status: {
                            field_value: '2'
                        },
                        on_sale_num: {
                            field_value: '1'
                        }
                    }
                }
                let relativeInfo = {
                    test: 1
                }
                wrapper.setData({
                    buildingData: [{
                        baseInfo: baseInfo('name1'),
                        relativeInfo: relativeInfo
                    }, {
                        baseInfo: baseInfo('name2'),
                        relativeInfo: relativeInfo
                    }, {
                        baseInfo: baseInfo('name3'),
                        relativeInfo: relativeInfo
                    }]
                })
                wrapper.vm.$refs.buildingForm = [
                    validateTrue,
                    validateTrue,
                    validateTrue
                ]
                wrapper.vm.getInfoValid();
                expect(saveCapacityInfoSpy).toHaveBeenCalled();
                expect(saveCapacityInfoSpy).toHaveBeenCalledWith({
                    org: {
                        building_base_detail: baseInfo('name1'),
                        building_relation_detail: relativeInfo
                    },
                    new: [{
                            building_base_detail: baseInfo('name2'),
                            building_relation_detail: relativeInfo
                        },
                        {
                            building_base_detail: baseInfo('name3'),
                            building_relation_detail: relativeInfo
                        }
                    ]
                });
            })
        })
        it('test cancleEdit', () => {
            goToDynamicSaleSpy.mockClear();
            editInfoSpy.mockClear();
            let buildingData = wrapper.vm.buildingData;
            // 第1次测试
            wrapper.setData({
                buildingData: [1, 2]
            })
            let result1 = wrapper.vm.cancleEdit();
            expect(wrapper.vm.buildingData).not.toHaveLength(0);
            expect(wrapper.vm.$route.query.isDynamic).toBeFalsy();
            expect(editInfoSpy).toHaveBeenCalled();
            expect(editInfoSpy).toHaveBeenCalledWith(false);
            expect(result1).not.toBeDefined();
            // 第2次测试
            wrapper.vm.$route.query.isDynamic = 1
            wrapper.vm.cancleEdit();
            expect(wrapper.vm.$route.query.isDynamic).toBeTruthy();
            expect(goToDynamicSaleSpy).toHaveBeenCalled();
            // 第3次测试
            wrapper.setData({
                buildingData: []
            })
            let result3 = wrapper.vm.cancleEdit();
            expect(goToDynamicSaleSpy).toHaveBeenCalled();
            expect(goToDynamicSaleSpy).toHaveBeenCalledTimes(2);
            expect(result3).not.toBeDefined();
            // 避免后面的测试需要用，还是还原一下比较好
            wrapper.setData({
                buildingData: buildingData
            })
        })
        describe('test saveCapacityInfo', () => {
            let log;
            beforeAll(() => {
                log = console.log;
                saveCapacityInfoSpy.mockRestore();
                mockAxios.post.mockImplementation(() => {
                    return Promise.resolve({
                        data: {
                            code: 0,
                            msg: '操作成功'
                        }
                    })
                }).mockImplementationOnce(() => {
                    return Promise.reject('请求失败')
                }).mockImplementationOnce(() => {
                    return Promise.resolve({
                        data: {
                            code: 1,
                            msg: '操作失败'
                        }
                    })
                }).mockImplementationOnce(() => {
                    return Promise.resolve({
                        data: {
                            code: 10007,
                            msg: '10007错误'
                        }
                    })
                }).mockImplementationOnce(() => {
                    return Promise.resolve({
                        data: {
                            code: 10008,
                            msg: '10008错误'
                        }
                    })
                })
            })
            beforeEach(() => {
                console.log = jest.fn();
                localVue.prototype.$message.mockClear();
                localVue.prototype.$alert.mockClear();
                editInfoSpy.mockClear();
                toNewPageSpy.mockClear();
            })
            afterEach(() => {
                console.log = log;
            })
            afterAll(() => {})
            it('test saveCapacityInfo---1----请求失败', async () => {
                wrapper.vm.saveCapacityInfo();
                expect(wrapper.vm.pageLoading).toBe(true);
                expect(wrapper.vm.isSubmiting).toBe(true);
                await wrapper.vm.$nextTick();
                expect(wrapper.vm.isSubmiting).toBe(false);
                expect(wrapper.vm.pageLoading).toBe(false);
                expect(console.log).toHaveBeenCalled();
                expect(console.log).toHaveBeenCalledWith('请求失败');
            })
            it('test saveCapacityInfo---2----code=1', async () => {
                wrapper.vm.saveCapacityInfo();
                expect(wrapper.vm.pageLoading).toBe(true);
                expect(wrapper.vm.isSubmiting).toBe(true);
                await wrapper.vm.$nextTick();
                expect(wrapper.vm.isSubmiting).toBe(false);
                expect(localVue.prototype.$message).toHaveBeenCalled();
                expect(localVue.prototype.$message).toHaveBeenCalledWith('操作失败');
                expect(wrapper.vm.url).toBe('');
                expect(wrapper.vm.isGo).toBe(false);
                expect(wrapper.vm.pageLoading).toBe(false);
            })
            it('test saveCapacityInfo---3----code=10007', async () => {
                wrapper.vm.saveCapacityInfo();
                expect(wrapper.vm.pageLoading).toBe(true);
                expect(wrapper.vm.isSubmiting).toBe(true);
                await wrapper.vm.$nextTick();
                expect(wrapper.vm.isSubmiting).toBe(false);
                expect(localVue.prototype.$alert).toHaveBeenCalled();
                expect(localVue.prototype.$alert).toHaveBeenCalledWith('10007错误', '提示', {
                    confirmButtonText: '确定'
                });
                expect(wrapper.vm.url).toBe('');
                expect(wrapper.vm.isGo).toBe(false);
                expect(wrapper.vm.pageLoading).toBe(false);
            })
            it('test saveCapacityInfo---4----code=10008', async () => {
                wrapper.vm.saveCapacityInfo();
                expect(wrapper.vm.pageLoading).toBe(true);
                expect(wrapper.vm.isSubmiting).toBe(true);
                await wrapper.vm.$nextTick();
                expect(wrapper.vm.isSubmiting).toBe(false);
                expect(localVue.prototype.$alert).not.toHaveBeenCalled();
                expect(localVue.prototype.$message).not.toHaveBeenCalled();
                expect(wrapper.vm.selfConsistentMessage).toBe('10008错误');
                expect(wrapper.vm.selfConsistentDialogvisible).toBe(true);
                expect(wrapper.vm.url).toBe('');
                expect(wrapper.vm.isGo).toBe(false);
                expect(wrapper.vm.pageLoading).toBe(false);
            })
            it('test saveCapacityInfo---5----code=0', async () => {
                wrapper.setData({
                    isGo: false
                })
                wrapper.vm.saveCapacityInfo();
                expect(wrapper.vm.pageLoading).toBe(true);
                expect(wrapper.vm.isSubmiting).toBe(true);
                await wrapper.vm.$nextTick();
                expect(wrapper.vm.isSubmiting).toBe(false);
                expect(localVue.prototype.$message).toHaveBeenCalled();
                expect(localVue.prototype.$message).toHaveBeenCalledWith('保存成功');
                expect(wrapper.vm.$route.query.buildingId).toBeTruthy();
                expect(editInfoSpy).toHaveBeenCalled();
                expect(editInfoSpy).toHaveBeenCalledWith(false);
                expect(toNewPageSpy).not.toHaveBeenCalled();
                expect(wrapper.vm.url).toBe('');
                expect(wrapper.vm.isGo).toBe(false);
                expect(wrapper.vm.pageLoading).toBe(false);
            })
            it('test saveCapacityInfo---6----code=0', async () => {
                wrapper.setData({
                    isGo: true
                })
                wrapper.vm.saveCapacityInfo();
                expect(wrapper.vm.pageLoading).toBe(true);
                expect(wrapper.vm.isSubmiting).toBe(true);
                await wrapper.vm.$nextTick();
                expect(wrapper.vm.isSubmiting).toBe(false);
                expect(localVue.prototype.$message).toHaveBeenCalled();
                expect(localVue.prototype.$message).toHaveBeenCalledWith('保存成功');
                expect(wrapper.vm.$route.query.buildingId).toBeTruthy();
                expect(editInfoSpy).toHaveBeenCalled();
                expect(editInfoSpy).toHaveBeenCalledWith(false);
                expect(wrapper.vm.dialogVisible).toBe(false);
                expect(toNewPageSpy).toHaveBeenCalled();
                expect(wrapper.vm.url).toBe('');
                expect(wrapper.vm.isGo).toBe(false);
                expect(wrapper.vm.pageLoading).toBe(false);
            })
            it('test saveCapacityInfo---7----重复提交', async () => {
                wrapper.vm.saveCapacityInfo();
                expect(wrapper.vm.pageLoading).toBe(true);
                expect(wrapper.vm.isSubmiting).toBe(true);
                wrapper.vm.saveCapacityInfo();
                expect(wrapper.vm.pageLoading).toBe(true);
                expect(wrapper.vm.isSubmiting).toBe(true);
                let res = await wrapper.vm.saveCapacityInfo();
                expect(res).not.toBeDefined();
            })
        })
    })
})
describe('测试新建楼栋--windows', () => {
    let wrapper, router, query;
    const mockStore = {
        dispatch: jest.fn(),
        state: {
            buildingDictionary: {
                isAuditorAuth: 2
            }
        }
    }
    jest.spyOn(document, 'addEventListener');
    let editInfoSpy, getInfoValidSpy, getBuildInitDataSpy;
    let warn = console.warn;
    let routerPush;
    beforeAll(() => {
        console.warn = jest.fn();
        query = {
            projectId: 200488456,
            role: 'expand',
            isDynamic: 1
        }
        router = new VueRouter({
            routes
        });
        routerPush = router.push;
        router.push({
            name: 'buildingDetailEdit',
            query: query
        });
        wrapper = mount(BuildingDetailEdit, {
            localVue,
            router,
            mocks: {
                $store: mockStore
            }
        });
        editInfoSpy = jest.spyOn(wrapper.vm, 'editInfo');
        getInfoValidSpy = jest.spyOn(wrapper.vm, 'getInfoValid');
        getBuildInitDataSpy = jest.spyOn(wrapper.vm, 'getBuildInitData');
    });
    afterAll(() => {
        wrapper.destroy();
        console.warn = warn;
    });
    it('test creat', () => {
        expect(wrapper.vm.buildingName).toBe('');
        expect(wrapper.vm.breadText).toBe('楼盘任务列表');
    })
    describe('test Listener', () => {
        it('test Listener', () => {
            expect(wrapper.vm.device).toBe('windows');
            expect(wrapper.vm.isEdit).toBe(true);
        })
        it('test Listener ---- handleKeyDown --window状态点击保存', async () => {
            getInfoValidSpy.mockClear();
            let mockFn = jest.fn();
            wrapper.vm.handleKeyDown({
                key: 'control',
                preventDefault: mockFn
            });
            wrapper.vm.handleKeyDown({
                key: 's',
                preventDefault: mockFn
            });
            expect(wrapper.vm.arrKey).toStrictEqual(['control', 's']);
            expect(wrapper.vm.keydown).toBe('control+s');
            expect(wrapper.vm.dialogVisible).toBe(false);
            expect(getInfoValidSpy).toHaveBeenCalled();
            expect(mockFn).toHaveBeenCalled();
            // 如果dialogVisible = true
            await wrapper.setData({
                dialogVisible: true,
                keydown: '',
                arrKey: []
            })
            wrapper.vm.handleKeyDown({
                key: 'control',
                preventDefault: mockFn
            });
            wrapper.vm.handleKeyDown({
                key: 's',
                preventDefault: mockFn
            });
            expect(wrapper.vm.arrKey).toStrictEqual(['control', 's']);
            expect(wrapper.vm.keydown).toBe('control+s');
            expect(wrapper.vm.isGo).toBe(true);
            expect(getInfoValidSpy).toHaveBeenCalled();
            expect(getInfoValidSpy).toHaveBeenCalledTimes(2);
            expect(wrapper.vm.dialogVisible).toBe(false);
            expect(mockFn).toHaveBeenCalledTimes(2);
        })
        it('test Listener ---- handleKeyDown --点击编辑', async () => {
            editInfoSpy.mockClear();
            await wrapper.setData({
                isEdit: false,
                keydown: '',
                arrKey: []
            })
            let mockFn = jest.fn();
            wrapper.vm.handleKeyDown({
                key: 'control',
                preventDefault: mockFn
            });
            wrapper.vm.handleKeyDown({
                key: 'e',
                preventDefault: mockFn
            });
            expect(wrapper.vm.arrKey).toStrictEqual(['control', 'e']);
            expect(wrapper.vm.keydown).toBe('control+e');
            expect(editInfoSpy).toHaveBeenCalled();
            expect(editInfoSpy).toHaveBeenCalledWith(true);
            expect(mockFn).toHaveBeenCalled();
        })
    })
    it('test goToListPage', () => {
        router.push = jest.fn();
        wrapper.vm.goToListPage();
        expect(router.push).toHaveBeenCalled();
        expect(router.push).toHaveBeenCalledWith({
            path: '/building/ExpandTaskList'
        });
    })
    it('test saveCapacityInfo', async () => {
        router.push.mockClear();
        expect(wrapper.vm.$route.query.buildingId).toBeFalsy();
        mockAxios.post.mockImplementationOnce(() => {
            return Promise.resolve({
                data: {
                    code: 0,
                    msg: '操作成功',
                    data: {
                        id: '1'
                    }
                }
            })
        })
        wrapper.setData({
            isGo: false
        })
        wrapper.vm.saveCapacityInfo();
        expect(wrapper.vm.pageLoading).toBe(true);
        expect(wrapper.vm.isSubmiting).toBe(true);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.isSubmiting).toBe(false);
        expect(localVue.prototype.$message).toHaveBeenCalled();
        expect(localVue.prototype.$message).toHaveBeenCalledWith('保存成功');
        expect(router.push).toHaveBeenCalled();
        expect(router.push).toHaveBeenCalledWith({
            path: '/building/buildingDetailEdit',
            query: {
                projectId: 200488456,
                taskId: undefined,
                buildingId: '1'
            }
        });
        expect(wrapper.vm.url).toBe('');
        expect(wrapper.vm.isGo).toBe(false);
        expect(wrapper.vm.pageLoading).toBe(false);
    })
    it('test watch $route', async () => {
        router.push = routerPush;
        getBuildInitDataSpy.mockClear();
        router.push({
            name: 'test',
            query: {
                isEdit: '1'
            }
        })
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.isEdit).toBe(true);
        expect(getBuildInitDataSpy).toHaveBeenCalled();
        // 第2次变更
        router.push({
            name: 'buildingDetailEdit',
            query: query
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.isEdit).not.toBeDefined();
        expect(getBuildInitDataSpy).toHaveBeenCalledTimes(2);
    })
})