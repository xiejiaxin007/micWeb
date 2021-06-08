/*
 * @Author: xie bin
 * @Date: 2021-05-14 15:35:42
 * @LastEditTime: 2021-05-17 15:29:38
 * @LastEditors: xie bin
 * @Description: 咨询师绩效配置
 * @FilePath: /webapp_backend/src/pages/consultor/consultantPerformance/config/config.js
 */
export const pickerOptions = {
    shortcuts: [{
    text: '最近一周',
    onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', [start, end]);
    }
    }, {
        text: '最近一个月',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
        }
    }, {
        text: '最近三个月',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
        }
    }],
    disabledDate(time) {
        let curDate = new Date().getTime();
        let three = 180 * 24 * 3600 * 1000;
        let threeMonths = curDate - three;
        // var thatDay = time.getTime();
        return (
            time.getTime() > Date.now() - 8.64e6 ||
            time.getTime() < threeMonths
        );
    }
}