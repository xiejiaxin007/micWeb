/*
 * @author: kangxue
 * @Date: 2020-12-16 15:19:37
 * @LastEditors: kangxue
 * @LastEditTime: 2021-02-20 17:42:34
 * @description: 头部的测试用例
 */
import {
    mount
} from '@vue/test-utils';
import PageHeader from '@/components/PageHeader.vue';
import mockAxios from '#/__mocks__/axios.js';
import {
    commonFun
} from '@/assets/js/utils/utils.js';
const userInfo = {
    "cityName": "全国",
    "role": "super_admin",
    "roleName": "超级管理员",
    "post": "11-员工关系主管",
    "post_num": "0",
    "employeeName": "钱美晨",
    "uid": 45,
    "job_number": 19
}
const personInfo = [{
        "menuName": "个人设置",
        "menuUrl": "/index.php?r=employee%2Fhome",
        "track_id": "",
        "num": ""
    },
    {
        "menuName": "我的消息",
        "menuUrl": "/index.php?r=yw-message%2Findex",
        "track_id": 2,
        "num": "21"
    },
    {
        "menuName": "待办事项",
        "menuUrl": "/index.php?r=yw-message%2Fto-do",
        "track_id": 4,
        "num": "19328"
    }
]
const logout = {
    "menuName": "退出",
    "menuUrl": "/index.php?r=site%2Flogout"
}
const schedule = {
    "menuName": "我的日程",
    "menuUrl": "/index.php?r=yw-schedule%2Findex",
    "track_id": 6
}
const logo = {
    "menuUrl": "/",
    "track_id": 1
}
const message = {
    "menuName": "消息图标",
    "menuUrl": "/index.php?r=yw-message%2Findex",
    "track_id": 2,
    "num": "21"
}
const needToDo = {
    "menuName": "待办事项图标",
    "menuUrl": "/index.php?r=yw-message%2Fto-do",
    "track_id": 5,
    "num": "19328"
}
const headData = {
    userInfo: userInfo,
    logo: logo,
    logout: logout,
    personInfo: personInfo,
    schedule: schedule,
    message: message,
    needToDo: needToDo
}
const roleList = [{
    "key": "admin",
    "value": "总管理员"
}, {
    "key": "admin-sop",
    "value": "管理员(SOP)"
}, {
    "key": "header",
    "value": "咨询师"
}, {
    "key": "header_manager",
    "value": "咨询师主管"
}, {
    "key": "super_admin",
    "value": "超级管理员"
}]
const log = console.log;
describe('PageHeader头部的测试内容', () => {
    mockAxios.post.mockImplementationOnce((url, params) => {
        return Promise.resolve({
            data: {
                code: 0,
                data: headData
            }
        })
    }).mockImplementationOnce((url, params) => {
        return Promise.resolve({
            data: {
                code: 0,
                data: {
                    data: roleList
                }
            }
        })
    })
    commonFun.setTrackMenu = jest.fn();
    let wrapper;
    const mockStore = {
        dispatch: jest.fn()
    }
    let location = window.location;
    beforeAll(() => {
        wrapper = mount(PageHeader, {
            mocks: {
                $store: mockStore
            }
        });
        const windowLocation = JSON.stringify(window.location);
        delete window.location;
        Object.defineProperty(window, 'location', {
            value: JSON.parse(windowLocation)
        });
    })
    afterAll(() => {
        wrapper.destroy();
        window.location = location;
    })
    it('create初始化---getheaderInfo获取头部信息，获取角色列表', () => {
        expect(wrapper.vm.username).toStrictEqual(userInfo);
        expect(wrapper.vm.userinfo).toStrictEqual(personInfo);
        expect(wrapper.vm.quit).toStrictEqual(logout);
        expect(wrapper.vm.daywork).toStrictEqual(schedule);
        expect(wrapper.vm.logoninfo).toStrictEqual(logo);
        expect(wrapper.vm.message).toStrictEqual(message);
        expect(wrapper.vm.needToDo).toStrictEqual(needToDo);
        expect(wrapper.vm.roleInfo).toStrictEqual({
            role: "super_admin",
            jobs: "全国"
        });
        // 测试vuex store dispath
        expect(mockStore.dispatch).toHaveBeenCalledTimes(6);
        expect(mockStore.dispatch).toHaveBeenCalledWith('get_employee_name', {
            role: "super_admin",
            jobs: "全国"
        });
        expect(mockStore.dispatch).toHaveBeenCalledWith('get_uid', 45);
        expect(mockStore.dispatch).toHaveBeenCalledWith('get_role', "super_admin");
        expect(mockStore.dispatch).toHaveBeenCalledWith('get_post_num', "0");
        expect(mockStore.dispatch).toHaveBeenCalledWith('get_user_info', userInfo);
        expect(mockStore.dispatch).toHaveBeenCalledWith('get_role_list', roleList);
        // 获取角色列表
        expect(wrapper.vm.roleList).toStrictEqual(roleList);
    })
    it('请求正确后页面正确渲染', () => {
        expect(wrapper.find(".jl-header-left a").attributes().href).toBe(logo.menuUrl);
        expect(wrapper.find(".jl-username").text()).toBe(userInfo.employeeName);
        expect(wrapper.find(".jl-quit").text()).toBe(logout.menuName);
        expect(wrapper.find(".jl-quit").attributes().href).toBe(logout.menuUrl);
        expect(wrapper.find(".jl-datework").text()).toBe(schedule.menuName);
        expect(wrapper.find(".jl-datework").attributes().href).toBe(schedule.menuUrl);
        expect(wrapper.find(".iconinformatiom").attributes().title).toBe(message.menuName);
        expect(wrapper.find(".iconinformatiom").attributes().href).toBe(message.menuUrl);
        expect(wrapper.find(".jl-info-msg").text()).toBe(message.num);
        expect(wrapper.find(".iconicon-todo2").attributes().title).toBe(needToDo.menuName);
        expect(wrapper.find(".iconicon-todo2").attributes().href).toBe(needToDo.menuUrl);
        expect(wrapper.find(".jl-info-note").text()).toBe(needToDo.num);
    })
    it('切换角色', async () => {
        const hrefUrl = "http://baidu.com";
        mockStore.dispatch.mockClear();
        mockAxios.post.mockImplementation((url, params) => {
            return Promise.resolve({
                data: {
                    code: 0,
                    data: {
                        url: hrefUrl
                    }
                }
            })
        }).mockImplementationOnce((url, params) => {
            return Promise.resolve({
                data: {
                    code: 1,
                    data: "请求失败"
                }
            })
        })
        mockStore.dispatch.mockClear();
        // 第一次——请求失败
        await wrapper.findAll(".el-menu-item").at(3).trigger("click");
        expect(wrapper.vm.roleInfo.role).toBe("super_admin");
        expect(mockStore.dispatch).not.toHaveBeenCalled();
        mockStore.dispatch.mockClear();
        // 第二次——点击另一角色
        await wrapper.findAll(".el-menu-item").at(1).trigger("click");
        expect(wrapper.vm.roleInfo.role).toBe("admin-sop");
        expect(mockStore.dispatch).toHaveBeenCalledTimes(2);
        expect(mockStore.dispatch).toHaveBeenCalledWith('get_employee_name', {
            role: "admin-sop",
            jobs: "全国"
        });
        expect(mockStore.dispatch).toHaveBeenCalledWith('get_role', "admin-sop");
        expect(window.location.href).toEqual(hrefUrl);
        mockStore.dispatch.mockClear();
        // 第三次—— 点击相同角色
        await wrapper.findAll(".el-menu-item").at(1).trigger("click");
        expect(wrapper.vm.roleInfo.role).toBe("admin-sop");
        expect(mockStore.dispatch).not.toHaveBeenCalled();
        mockStore.dispatch.mockClear();
        // 第四次——点击另一角色
        await wrapper.findAll(".el-menu-item").at(2).trigger("click");
        expect(wrapper.vm.roleInfo.role).toBe("header");
        expect(mockStore.dispatch).toHaveBeenCalledTimes(2);
        expect(mockStore.dispatch).toHaveBeenCalledWith('get_employee_name', {
            role: "header",
            jobs: "全国"
        });
        expect(mockStore.dispatch).toHaveBeenCalledWith('get_role', "header");
        expect(window.location.href).toEqual(hrefUrl);
    })
    describe('测试埋点', () => {
        it('logo点击埋点', () => {
            wrapper.find('.jl-header-left a').trigger("click");
            expect(commonFun.setTrackMenu).toHaveBeenCalled();
            expect(commonFun.setTrackMenu).toHaveBeenCalledWith(logo.track_id, {});
            wrapper.find('.jl-header-left a').trigger("click");
            expect(commonFun.setTrackMenu).toHaveBeenCalledTimes(2);
            expect(commonFun.setTrackMenu).toHaveBeenCalledWith(logo.track_id, {});
        })
        it('用户下拉点击埋点', () => {
            commonFun.setTrackMenu.mockClear();
            expect(wrapper.find('.jl-selectdown').findAll('li')).toHaveLength(3);
            wrapper.find('.jl-selectdown').findAll('li').at(0).trigger("click");
            expect(commonFun.setTrackMenu).toHaveBeenCalled();
            expect(commonFun.setTrackMenu).toHaveBeenCalledWith(personInfo[0].track_id, {});
            wrapper.find('.jl-selectdown').findAll('li').at(2).trigger("click");
            expect(commonFun.setTrackMenu).toHaveBeenCalledTimes(2);
            expect(commonFun.setTrackMenu).toHaveBeenCalledWith(personInfo[2].track_id, {});
        })
        it('日程点击埋点', () => {
            commonFun.setTrackMenu.mockClear();
            wrapper.find('.jl-datework').trigger("click");
            expect(commonFun.setTrackMenu).toHaveBeenCalled();
            expect(commonFun.setTrackMenu).toHaveBeenCalledWith(schedule.track_id, {});
            wrapper.find('.jl-datework').trigger("click");
            expect(commonFun.setTrackMenu).toHaveBeenCalledTimes(2);
            expect(commonFun.setTrackMenu).toHaveBeenCalledWith(schedule.track_id, {});
        })
        it('消息点击埋点', () => {
            commonFun.setTrackMenu.mockClear();
            wrapper.find('.iconinformatiom').trigger("click");
            expect(commonFun.setTrackMenu).toHaveBeenCalled();
            expect(commonFun.setTrackMenu).toHaveBeenCalledWith(message.track_id, {});
            wrapper.find('.iconinformatiom').trigger("click");
            expect(commonFun.setTrackMenu).toHaveBeenCalledTimes(2);
            expect(commonFun.setTrackMenu).toHaveBeenCalledWith(message.track_id, {});
        })
        it('代办点击埋点', () => {
            commonFun.setTrackMenu.mockClear();
            wrapper.find('.iconicon-todo2').trigger("click");
            expect(commonFun.setTrackMenu).toHaveBeenCalled();
            expect(commonFun.setTrackMenu).toHaveBeenCalledWith(needToDo.track_id, {});
            wrapper.find('.iconicon-todo2').trigger("click");
            expect(commonFun.setTrackMenu).toHaveBeenCalledTimes(2);
            expect(commonFun.setTrackMenu).toHaveBeenCalledWith(needToDo.track_id, {});
        })
    })
    // 模拟错误请求都放在埋点后面，埋点使用正确数据
    it('获取头部信息失败', async () => {
        mockStore.dispatch.mockClear();
        mockAxios.post.mockImplementationOnce((url, params) => {
            return Promise.resolve({
                data: {
                    code: 1,
                    message: '未登录'
                }
            })
        })
        await wrapper.vm.getheaderInfo();
        expect(mockStore.dispatch).not.toHaveBeenCalled();
    })
    it('获取头部信息失败2', async () => {
        mockStore.dispatch.mockClear();
        console.log = jest.fn();
        mockAxios.post.mockImplementationOnce(() => {
            return Promise.reject('请求失败')
        })
        await wrapper.vm.getheaderInfo();
        expect(console.log).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledTimes(1);
        expect(console.log).toHaveBeenCalledWith('请求失败');
        console.log = log;
    })
    it('获取角色列表失败', async () => {
        mockStore.dispatch.mockClear();
        mockAxios.post.mockImplementationOnce((url, params) => {
            return Promise.resolve({
                data: {
                    code: 1,
                    message: '未登录'
                }
            })
        })
        await wrapper.vm.getRoleList();
        expect(mockStore.dispatch).not.toHaveBeenCalled();
    })
    it('后端返回角色列表信息有误', async () => {
        mockStore.dispatch.mockClear();
        mockAxios.post.mockImplementationOnce((url, params) => {
            return Promise.resolve({
                data: {
                    code: 0,
                    data: ''
                }
            })
        })
        await wrapper.vm.getRoleList();
        expect(mockStore.dispatch).toHaveBeenCalled();
        expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
        expect(mockStore.dispatch).toHaveBeenCalledWith('get_role_list', []);
        expect(wrapper.vm.roleList).toStrictEqual([]);
    })
    it('消息和代办返回数目为0时不展示数目', async () => {
        mockStore.dispatch.mockClear();
        mockAxios.post.mockImplementationOnce((url, params) => {
            let copyHeadData = JSON.parse(JSON.stringify(headData));
            copyHeadData.personInfo = [];
            copyHeadData.message.num = "";
            copyHeadData.needToDo.num = "";
            return Promise.resolve({
                data: {
                    code: 0,
                    data: copyHeadData
                }
            })
        }).mockImplementationOnce((url, params) => {
            return Promise.resolve({
                data: {
                    code: 0,
                    data: {
                        data: []
                    }
                }
            })
        })
        await wrapper.vm.getRoleList();
        expect(wrapper.find(".jl-userroles-wrap").exists()).toBeFalsy();
    })
});
