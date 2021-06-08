/*
 * @author: kangxue
 * @Date: 2020-12-09 10:55:50
 * @LastEditors: kangxue
 * @LastEditTime: 2020-12-11 16:41:13
 * @description: dataStorage的测试
 */
import func from '@/assets/js/utils/dataStorage.js';
import MockDate from 'mockdate'
afterEach(() => {
    // 重置时间，不然cookie有效期不对会报错
    MockDate.reset();
})
afterAll(() => {
    // 重置storage
    localStorage.clear();
})

describe('dataStorage的测试内容', () => {
    it('测试setStorage', () => {
        // 模拟时间
        let Date1 = new Date('2020-10-10 12:00:00').getTime()
        MockDate.set(Date1);
        func.setStorage("storage", 'storage1');
        let Date2 = new Date('2020-10-10 18:00:00').getTime()
        MockDate.set(Date2);
        func.setStorage("storage2", [1, 2, 3]);
        func.setStorage("storage3", 100);
        func.setStorage("storage4", '');
        func.setStorage("storage5", null);
        func.setStorage("storage6");
        expect(localStorage.getItem('storage')).toContain('"oData":"storage1"');
        expect(localStorage.getItem('storage2')).toContain("[1,2,3]");
        expect(localStorage.getItem('storage3')).toContain("100");
        expect(localStorage.getItem('storage4')).toBeNull();
        expect(localStorage.getItem('storage5')).toBeNull();
        expect(localStorage.getItem('storage6')).toBeNull();
        function getVal(key) {
            return JSON.parse(localStorage.getItem(key));
        }
        expect(getVal('storage')).toEqual({
            createTime: Date1,
            oData: 'storage1'
        });
        expect(getVal('storage2')).toEqual({
            createTime: Date2,
            oData: [1, 2, 3]
        });
    });
    it('测试setStorSimple', () => {
        func.setStorSimple("test", 'test1');
        func.setStorSimple("test2", [1, 2, 3]);
        func.setStorSimple("test3", 100);
        func.setStorSimple("test4", '');
        func.setStorSimple("test5", null);
        func.setStorSimple("test6");
        expect(localStorage.getItem('test')).toContain("test1");
        expect(localStorage.getItem('test2')).toEqual("[1,2,3]");
        expect(localStorage.getItem('test3')).toBe("100");
        expect(localStorage.getItem('test4')).toBeNull();
        expect(localStorage.getItem('test5')).toBeNull();
        expect(localStorage.getItem('test6')).toBeNull();
    });
    it('测试getStorage', () => {
        expect(func.getStorage('test')).toBe("test1");
        expect(func.getStorage('test2')).toEqual([1, 2, 3]);
        expect(func.getStorage('test3')).toBe(100);
        expect(func.getStorage('test4')).toBe(false);
        expect(func.getStorage('test5')).toBe(false);
        expect(func.getStorage('test6')).toBe(false);
    });
    it('测试isFresh', () => {
        expect(func.isFresh('test')).toBe(true);
        expect(func.isFresh('test2', 828273293)).toBe(true);
        // 未设置第二参数，2020-10-10，早已超过一天，已过期
        expect(func.isFresh('storage')).toBe(false);
        let Date1 = new Date('2020-12-10 12:00:00').getTime()
        MockDate.set(Date1);
        // 2020-12-10 12:00:00 与 storage的实际时间差为5270300000，如果有效期大于5270300000，就代表未过期
        expect(func.isFresh('storage', 5270400001)).toBe(true);
        // 时间差大于等于有效期，已过期
        expect(func.isFresh('storage', 5270400000)).toBe(false);
        expect(func.isFresh('storage', 5270300000)).toBe(false);
    });
    it('测试setCookie', () => {
        func.setCookie("test", 'test set cookie data by jest');
        expect(document.cookie).toBe("test=test set cookie data by jest");
        func.setCookie("test2", 'test2');
        expect(document.cookie).toBe("test=test set cookie data by jest; test2=test2");
        func.setCookie("test3");
        expect(document.cookie).toBe("test=test set cookie data by jest; test2=test2; test3=undefined");
    });
    it('测试getCookie', () => {
        expect(func.getCookie("test")).toBe("test set cookie data by jest");
        expect(func.getCookie("test2")).toBe("test2");
        expect(func.getCookie("test3")).toBe("undefined");
        expect(func.getCookie("test4")).toBeNull();
    });
    it('测试delCookie', () => {
        func.delCookie("test5")
        expect(document.cookie).toBe("test=test set cookie data by jest; test2=test2; test3=undefined");
        func.delCookie("test2")
        expect(document.cookie).toBe("test=test set cookie data by jest; test3=undefined");
        func.delCookie("test")
        expect(document.cookie).toBe("test3=undefined");
        func.delCookie("test3")
        expect(document.cookie).toBe("");
    });
});
