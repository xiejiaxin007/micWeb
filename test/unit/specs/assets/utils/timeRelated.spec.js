/*
 * @author: kangxue
 * @Date: 2020-12-09 10:55:50
 * @LastEditors: kangxue
 * @LastEditTime: 2020-12-09 14:03:30
 * @description: 时间戳转换为年月日格式 单元测试
 */
import timeRelated from '@/assets/js/utils/timeRelated.js';
describe('timeRelated时间戳转换为年月日格式的测试内容', () => {
    it('测试时间戳转换为年月日', () => {
        expect(timeRelated.filterDate()).not.toBeDefined();
        let dateNum1 = new Date('2020-12-09 12:20:59').getTime();
        expect(timeRelated.filterDate(dateNum1, 'YYYY-MM-DD HH:mm:ss')).toBe('2020-12-09 12:20:59');
        let dateNum2 = new Date('2020-12-08 12:00:00').getTime();
        expect(timeRelated.filterDate(dateNum2, 'YYYY/MM/DD')).toBe('2020/12/08');
        let dateNum3 = new Date('1991-11-12 18:59:59').getTime();
        expect(timeRelated.filterDate(dateNum3, 'YYYY年MM月DD日 HH时mm分ss秒')).toBe('1991年11月12日 18时59分59秒');
        let dateNum4 = new Date('1991-11-12 18:59').getTime();
        expect(timeRelated.filterDate(dateNum4, 'YYYY年MM月DD日 HH时mm分ss秒')).toBe('1991年11月12日 18时59分00秒');
        let dateNum5 = new Date('1991-11-12').getTime();
        expect(timeRelated.filterDate(dateNum5, 'YYYY年MM月DD日 HH时mm分ss秒')).toBe('1991年11月12日 08时00分00秒');
        let dateNum6 = new Date('2018-12-09 12:2:9').getTime();
        expect(timeRelated.filterDate(dateNum6, 'YY-M-D H:m:s')).toBe('18-12-9 12:2:9');
        let dateNum7 = new Date('1991-11-12 18:59').getTime();
        expect(timeRelated.filterDate(dateNum7)).not.toBe('1991-11-12 18:59');
    });
});
