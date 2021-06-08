/*
 * @author: kangxue
 * @Date: 2020-12-09 10:55:50
 * @LastEditors: kangxue
 * @LastEditTime: 2021-02-20 17:42:26
 * @description: utils公共方法 单元测试
 */
import {
    commonFun
} from '@/assets/js/utils/utils.js';
import mockAxios from '#/__mocks__/axios.js'
// import { createLocalVue } from '@vue/test-utils'
// import Vuex from 'vuex';
// import mutations from '@/store/mutations'
// const localVue = createLocalVue();
// localVue.use(Vuex);

function setWindow(prop, attr, val) {
    Object.defineProperty(prop, attr, {
        value: val,
        writable: true
    });
}
const agent = navigator.userAgent;
const platform = navigator.platform;
const log = console.log;
describe('utils的commonFun的测试内容', () => {
    it('getDecimalLen--获取小数中小数点后的位数', () => {
        expect(commonFun.getDecimalLen(10)).toBe(0);
        expect(commonFun.getDecimalLen('10')).toBe(0);
        expect(commonFun.getDecimalLen(1.59)).toBe(2);
        expect(commonFun.getDecimalLen('1.1')).toBe(1);
        expect(commonFun.getDecimalLen('5.35.123')).not.toBeDefined();
        expect(commonFun.getDecimalLen('我')).not.toBeDefined();
        expect(commonFun.getDecimalLen('1.')).toBe(0);
        expect(commonFun.getDecimalLen('.33')).toBe(2);
    });
    it('numRound--对数字进行四舍五入', () => {
        expect(commonFun.numRound('我')).not.toBeDefined();
        expect(commonFun.numRound(10)).toBe(10);
        expect(commonFun.numRound()).not.toBeDefined();
        expect(commonFun.numRound(10)).toBe(10);
        expect(commonFun.numRound('10')).toBe(10);
        expect(commonFun.numRound(-10)).toBe(-10);
        expect(commonFun.numRound(5.2345)).toBe(5);
        expect(commonFun.numRound(5.45)).toBe(5);
        expect(commonFun.numRound(4.55)).toBe(5);
        expect(commonFun.numRound(4.)).toBe(4);
        expect(commonFun.numRound(-5.45)).toBe(-5);
        expect(commonFun.numRound(-4.55)).toBe(-5);
    });
    it('computedFloatNumber--两位数的+-*/运算', () => {
        expect(commonFun.computedFloatNumber()).not.toBeDefined();
        expect(commonFun.computedFloatNumber(100)).not.toBeDefined();
        expect(commonFun.computedFloatNumber(100, '*')).not.toBeDefined();
        expect(commonFun.computedFloatNumber(0.1, '+', 0.2)).toBe(0.3);
        expect(commonFun.computedFloatNumber(4.56, '-', 2.56)).toBe(2);
        expect(commonFun.computedFloatNumber(10.2, '*', 2.1)).toBe(21.42);
        expect(commonFun.computedFloatNumber(21.42, '/', 2.1)).toBe(10.2);
        expect(commonFun.computedFloatNumber(10.2, '%', 2.2)).toBe(0);
    });
    it('getInfoByProjectId--根据楼盘id获取楼盘基本信息', async () => {
        console.log = jest.fn();
        mockAxios.get.mockImplementation((url, params) => {
            if (params.params.project_id) {
                return Promise.resolve('请求成功' + params.params.project_id)
            } else {
                return Promise.reject('请求失败')
            }
        })
        // 传参，请求成功
        await expect(commonFun.getInfoByProjectId(5)).resolves.toEqual('请求成功5');
        await commonFun.getInfoByProjectId();
        expect(console.log).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledTimes(1);
        expect(console.log).toHaveBeenCalledWith('请求失败');
        console.log = log;
    });
    it('siblingElems--获取当前元素的其他兄弟元素', () => {
        document.body.innerHTML = '<ul>' +
            '<li class="li1" name="attr1">子级1</li>' +
            '<li class="li2" name="attr2">子级2</li>' +
            '<li class="li3">子级3</li>' +
            '</ul>' +
            '<ul>' +
            '<li class="li4">子级4</li>' +
            '<li class="li5">子级5</li>' +
            '<li class="li6">子级6</li>' +
            '<li class="li7">子级7</li>' +
            '</ul>';

        function getEle(className) {
            return document.body.querySelectorAll(className)[0];
        }
        expect(document.body.querySelectorAll('.li1').length).toBe(1);
        expect(document.body.querySelectorAll('.li2').length).toBe(1);
        expect(document.body.querySelectorAll('.li3').length).toBe(1);
        expect(commonFun.siblingElems(getEle('.li1'))).toEqual([getEle('.li2'), getEle('.li3')]);
        expect(commonFun.siblingElems(getEle('.li2'))).toEqual([getEle('.li1'), getEle('.li3')]);
        expect(commonFun.siblingElems(getEle('.li7'))).toEqual([getEle('.li6'), getEle('.li5'), getEle('.li4')]);
        expect(commonFun.siblingElems(getEle('.li1').getAttributeNode("name"))).toEqual([]);
    });
    it('deepClone--深拷贝', () => {
        expect(commonFun.deepClone()).not.toBeDefined();
        expect(commonFun.deepClone('')).toBe('');
        let arr1 = [1, 2, 3];
        let arr2 = commonFun.deepClone(arr1);
        arr1[1] = 4;
        expect(arr1).toEqual([1, 4, 3]);
        expect(arr2).toEqual([1, 2, 3]);
        let arr3 = [1, [4, 5], 3];
        let arr4 = commonFun.deepClone(arr3);
        arr3[1][1] = 6;
        expect(arr3).toEqual([1, [4, 6], 3]);
        expect(arr4).toEqual([1, [4, 5], 3]);
        let obj1 = {
            name: 'zhang',
            age: '30',
            other: {
                sex: '1',
                height: '180'
            }
        }
        let obj2 = commonFun.deepClone(obj1);
        obj1.age = '29';
        obj1.other.sex = '2';
        obj2.name = 'li';
        obj2.other.height = '190';
        expect(obj1).toEqual({
            name: 'zhang',
            age: '29',
            other: {
                sex: '2',
                height: '180'
            }
        });
        expect(obj2).toEqual({
            name: 'li',
            age: '30',
            other: {
                sex: '1',
                height: '190'
            }
        });
    });
    it('verifyTelNum--校验手机号', () => {
        expect(commonFun.verifyTelNum()).toBe(false);
        expect(commonFun.verifyTelNum('11')).toBe(false);
        expect(commonFun.verifyTelNum('01112345980')).toBe(false);
        expect(commonFun.verifyTelNum('test')).toBe(false);
        expect(commonFun.verifyTelNum('111234567890')).toBe(false);
        expect(commonFun.verifyTelNum('181234567890111')).toBe(false);
        expect(commonFun.verifyTelNum('1012345678')).toBe(false);
        expect(commonFun.verifyTelNum('1112345678')).toBe(false);
        expect(commonFun.verifyTelNum('12812345678')).toBe(false);
        expect(commonFun.verifyTelNum('13838493402')).toBe(true);
        expect(commonFun.verifyTelNum('14849030932')).toBe(true);
        expect(commonFun.verifyTelNum('15812828273')).toBe(true);
        expect(commonFun.verifyTelNum('16867362881')).toBe(true);
        expect(commonFun.verifyTelNum('17801281982')).toBe(true);
        expect(commonFun.verifyTelNum('18812345678')).toBe(true);
        expect(commonFun.verifyTelNum('19812345678')).toBe(true);
    });
    it('verifyEmail--校验邮箱', () => {
        expect(commonFun.verifyEmail()).toBe(false);
        expect(commonFun.verifyEmail('11')).toBe(false);
        expect(commonFun.verifyEmail('11.com')).toBe(false);
        expect(commonFun.verifyEmail('11@.com')).toBe(false);
        expect(commonFun.verifyEmail('@22ww.com')).toBe(false);
        expect(commonFun.verifyEmail('sdsd@22ww')).toBe(false);
        expect(commonFun.verifyEmail('sdsd@22ww.')).toBe(false);
        expect(commonFun.verifyEmail('11@22ww@sdsd.com')).toBe(false);
        expect(commonFun.verifyEmail('11@22ss#$%ww@sdsd.com')).toBe(false);
        expect(commonFun.verifyEmail('我的邮箱@sdsd.com')).toBe(false);
        expect(commonFun.verifyEmail('1111￥@sdsd.as')).toBe(false);
        expect(commonFun.verifyEmail('1111$@sdsd.as')).toBe(false);
        expect(commonFun.verifyEmail('1111$111@sdsd.as')).toBe(false);
        expect(commonFun.verifyEmail('1111@sdsd.as')).toBe(true);
        expect(commonFun.verifyEmail('1111@sdsd.cn')).toBe(true);
        expect(commonFun.verifyEmail('11@22ww.com')).toBe(true);
        expect(commonFun.verifyEmail('11-11+111@sdsd.as')).toBe(true);
        expect(commonFun.verifyEmail('11.111@sdsd.as')).toBe(true);
    });
    it('trim--去掉首尾空格', () => {
        expect(commonFun.trim(11)).toBe(11);
        expect(commonFun.trim(null)).toBe(null);
        expect(commonFun.trim()).not.toBeDefined();
        expect(commonFun.trim('11  ')).toBe('11');
        expect(commonFun.trim('    22  ')).toBe('22');
        expect(commonFun.trim('    我 你  他  ')).toBe('我 你  他');
    });
    it('trimAll--去掉所有空格', () => {
        expect(commonFun.trimAll(11)).toBe(11);
        expect(commonFun.trimAll(null)).toBe(null);
        expect(commonFun.trimAll()).not.toBeDefined();
        expect(commonFun.trimAll('11  ')).toBe('11');
        expect(commonFun.trimAll('    22  ')).toBe('22');
        expect(commonFun.trimAll('    我 你  他  ')).toBe('我你他');
    });
    it('random_string--生成随机字符串', () => {
        expect(commonFun.random_string()).toHaveLength(32);
        expect(commonFun.random_string(42)).toHaveLength(42);
        let arr1 = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'.split('');
        let arr2 = commonFun.random_string(3).split('');
        expect(arr1).toEqual(expect.arrayContaining(arr2));
        let arr3 = commonFun.random_string(69).split('');
        expect(arr1).toEqual(expect.arrayContaining(arr3));
    });
    it('highThottle--函数节流', () => {});
    it('getDevice--获取设备', () => {
        let device = commonFun.getDevice();
        expect(device).toBeTruthy();
        expect(device).toMatch(/windows pc|iphone|ipad|android|linux pc|mac|other/);
        // 直接设置navigator.userAgent的值，不影响实际项目中的userAgent的值
        function setAgent(val) {
            setWindow(navigator, 'userAgent', val);
        }
        setAgent('windows');
        expect(commonFun.getDevice()).toBe('windows pc');
        setAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1');
        expect(commonFun.getDevice()).toBe('iphone');
        setAgent('ipod 1290sjds MOBILE');
        expect(commonFun.getDevice()).toBe('iphone');
        setAgent('ipad akskaasa&%%^ka mobile windows');
        expect(commonFun.getDevice()).toBe('windows pc');
        setAgent('Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1');
        expect(commonFun.getDevice()).toBe('ipad');
        setAgent('Mozilla/5.0 (Linux; Android 6.0.1; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Mobile Safari/537.36');
        expect(commonFun.getDevice()).toBe('android');
        setAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36');
        expect(commonFun.getDevice()).toBe('mac');
        setAgent('linux pc 12121212');
        expect(commonFun.getDevice()).toBe('linux pc');
        setAgent('121sdsdsdsd');
        expect(commonFun.getDevice()).toBe('other');
        setWindow(navigator, 'userAgent', agent);
    });
    it('getOS--获取操作系统版本', () => {
        setWindow(navigator, 'platform', 'MacIntel');
        expect(commonFun.getOS()).toBe('Mac');
        setWindow(navigator, 'platform', 'Mac68K');
        expect(commonFun.getOS()).toBe('Mac');
        setWindow(navigator, 'platform', 'MacPPC');
        expect(commonFun.getOS()).toBe('Mac');
        setWindow(navigator, 'platform', 'Macintosh');
        expect(commonFun.getOS()).toBe('Mac');
        setWindow(navigator, 'platform', 'X11');
        expect(commonFun.getOS()).toBe('Unix');
        setWindow(navigator, 'platform', '22222Linux11111');
        expect(commonFun.getOS()).toBe('Linux');
        setWindow(navigator, 'platform', 'random Value');
        expect(commonFun.getOS()).toStrictEqual({
            os: 'other',
            os_version: ''
        });
        setWindow(navigator, 'platform', 'Win32');
        expect(commonFun.getOS()).toBeTruthy();
        expect(commonFun.getOS()).toStrictEqual({
            os: 'other',
            os_version: ''
        });
        setWindow(navigator, 'platform', 'Windows');
        setWindow(navigator, 'userAgent', 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.81 Safari/537.36 SE 2.X MetaSr 1.0');
        expect(commonFun.getOS()).toEqual({
            os: 'windows',
            os_version: '7'
        });
        setWindow(navigator, 'userAgent', 'Windows 2000');
        expect(commonFun.getOS()).toEqual({
            os: 'windows',
            os_version: '2000'
        });
        setWindow(navigator, 'userAgent', 'Windows XP');
        expect(commonFun.getOS()).toEqual({
            os: 'windows',
            os_version: 'XP'
        });
        setWindow(navigator, 'userAgent', 'Windows NT 5.2');
        expect(commonFun.getOS()).toEqual({
            os: 'windows',
            os_version: '2003'
        });
        setWindow(navigator, 'userAgent', 'Windows Vista');
        expect(commonFun.getOS()).toEqual({
            os: 'windows',
            os_version: 'Vista'
        });
        setWindow(navigator, 'userAgent', 'Windows NT 10');
        expect(commonFun.getOS()).toEqual({
            os: 'windows',
            os_version: '10'
        });
        // 重置navigator
        setWindow(navigator, 'userAgent', agent);
        setWindow(navigator, 'platform', platform);
        expect(commonFun.getOS()).toStrictEqual({
            os: 'other',
            os_version: ''
        });
    });
    it('ScreenWidth', () => {
        expect(commonFun.ScreenWidth()).toBeGreaterThanOrEqual(0);
        setWindow(screen, 'width', 1900);
        expect(commonFun.ScreenWidth()).toBe(1900);
        setWindow(screen, 'width', 800);
        expect(commonFun.ScreenWidth()).toBe(800);
    });
    it('ScreenHeight', () => {
        expect(commonFun.ScreenHeight()).toBeGreaterThanOrEqual(0);
        setWindow(screen, 'height', 300);
        expect(commonFun.ScreenHeight()).toBe(300);
        setWindow(screen, 'height', 800);
        expect(commonFun.ScreenHeight()).toBe(800);
    });
    it('getBrowse', () => {
        const sougou = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.81 Safari/537.36 SE 2.X MetaSr 1.0';
        const safari = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Safari/605.1.15';
        const fireFox = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:73.0) Gecko/20100101 Firefox/73.0';
        const qq = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.104 Safari/537.36 Core/1.53.2669.400 QQBrowser/9.6.11215.400';
        setWindow(navigator, 'userAgent', sougou);
        expect(commonFun.getBrowse()).toEqual({
            browser: 'sougou',
            browser_version: '0'
        });
        setWindow(navigator, 'userAgent', safari);
        expect(commonFun.getBrowse()).toEqual({
            browser: 'safari',
            browser_version: '12.1'
        });
        setWindow(navigator, 'userAgent', fireFox);
        expect(commonFun.getBrowse()).toEqual({
            browser: 'firefox',
            browser_version: '73.0'
        });
        setWindow(navigator, 'userAgent', qq);
        expect(commonFun.getBrowse()).toEqual({
            browser: 'qqbrowser',
            browser_version: '9.6.11215.400'
        });
        setWindow(navigator, 'userAgent', agent);
        expect(commonFun.getBrowse()).toEqual({
            browser: 'unknown',
            browser_version: '0'
        });




    });
    it('matchFigure--验证是否是数字、或者是否是数字字符串', () => {
        expect(commonFun.matchFigure()).toBe(false);
        expect(commonFun.matchFigure('')).toBe(false);
        expect(commonFun.matchFigure(11)).toBe(true);
        expect(commonFun.matchFigure('112323')).toBe(true);
        expect(commonFun.matchFigure(12929323)).toBe(true);
        expect(commonFun.matchFigure('0012929323')).toBe(true);
        expect(commonFun.matchFigure('1asj1')).toBe(false);
        expect(commonFun.matchFigure('1asj我')).toBe(false);
    });
    it('setTrack---旧埋点', async () => {
        console.log = jest.fn();
        let trackId = '5798',
            trackInfo = {
                a: 1
            },
            paraObj = {
                fromIndex: 5,
                fromPage: 'page1'
            },
            api = 'http://julive.com';
        mockAxios.post.mockImplementationOnce((url, params) => {
            expect(url).toBe(api + '/send-data/index');
            expect(url).toContain('/send-data/index');
            expect(params.track_id).toBe(trackId);
            expect(params.extrack_arr).toBeTruthy();
            expect(params.extrack_arr.ini_params).toBeTruthy();
            expect(params.extrack_arr.ini_params).toEqual(expect.objectContaining(trackInfo));
            expect(params.extrack_arr).toEqual(expect.objectContaining(paraObj));
            return Promise.resolve({
                data: {
                    code: 0
                }
            });
        }).mockImplementationOnce((url, params) => {
            expect(params.extrack_arr).not.toEqual(expect.objectContaining(paraObj));
            return Promise.resolve({
                data: {
                    code: 1
                }
            });
        }).mockImplementationOnce(() => Promise.reject('埋点失败了'))
        // trackId 和 backendApi必填
        expect(commonFun.setTrack('', trackInfo, '', api)).toBe(false);
        expect(commonFun.setTrack('1111')).toBe(false);
        await commonFun.setTrack(trackId, trackInfo, paraObj, api);
        // paraObj有if判断，此处测试为空时的情况
        await commonFun.setTrack(trackId, trackInfo, '', api);
        // 测试埋点的catch
        await commonFun.setTrack(trackId, trackInfo, paraObj, api);
        Vue.nextTick(() => {
            expect(console.log).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledTimes(1);
            expect(console.log).toHaveBeenCalledWith('埋点失败了');
            console.log = log;
        })
    });
    it('setTrackNew-- 新埋点', async () => {
        // console.log = jest.fn();
        commonFun.setTrackNew().then(res => {
            expect(res).toBe(false);
        })
    });
    it('setTrackMenu', async () => {
        console.log = jest.fn();
        let trackId = '5798',
            paraObj = {
                fromIndex: 5,
                fromPage: 'page1'
            };
        mockAxios.post.mockImplementationOnce((url, params) => {
            expect(params.track_id).toBe(trackId);
            expect(params.extrack_arr).toBeTruthy();
            expect(params.extrack_arr.ini_params).toBeTruthy();
            // expect(params.extrack_arr.ini_params).toEqual(expect.objectContaining(store.state.trackMessages));
            expect(params.extrack_arr).toEqual(expect.objectContaining(paraObj));
            return Promise.resolve({
                data: {
                    code: 0
                }
            });
        }).mockImplementationOnce((url, params) => {
            expect(params.extrack_arr).not.toEqual(expect.objectContaining(paraObj));
            return Promise.resolve({
                data: {
                    code: 1
                }
            });
        }).mockImplementationOnce(() => Promise.reject('埋点失败了'))
        // trackId 和 backendApi必填
        expect(commonFun.setTrackMenu('')).toBe(false);
        await commonFun.setTrackMenu(trackId, paraObj);
        // paraObj有if判断，此处测试为空时的情况
        await commonFun.setTrackMenu(trackId, '');
        // 测试埋点的catch
        await commonFun.setTrackMenu(trackId, paraObj);
        Vue.nextTick(() => {
            expect(console.log).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledTimes(1);
            expect(console.log).toHaveBeenCalledWith('埋点失败了');
            console.log = log;
        })
    });
    it('base64ToBlob--base64图片转为blob', () => {
        
    });
});
