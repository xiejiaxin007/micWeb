/*
 * @author: hewei
 * @Date: 2021-05-21 11:18:19
 * @LastEditors: hewei
 * @LastEditTime: 2021-05-26 11:29:51
 * @description: 导出历史列表和成交单回款公共js
 */

/**
 * @description 月份日期范围限制方法
 * @param {Date} dateArr 可生成日期对象数组
 * @param {Number} rangeNum 控制范围 如3个月就传3
 * @returns 
 */
export const dateChange = function (dateArr, rangeNum) {
    if (!dateArr) {
        // 解决日期清空后默认值为null问题
        setTimeout(() => {
            this.contractForm.monthRange = ['', ''];
        });
        return;
    }
    const range = +rangeNum - 1;
    const [start, end] = dateArr;
    // 获取起始月份
    const startMonth = new Date(start).getMonth();
    // 计算最大月份
    const rangeEndMonth = startMonth + range;
    // 重新生成一个日期对象，解除引用
    const newstart = new Date(+new Date(start));
    // 获取最大日期范围
    const rangeEndDate = newstart.setMonth(rangeEndMonth);
    if (rangeEndDate < +new Date(end)) {
        this.$message.warning(`所选最大范围不得超过${rangeNum}个月`);
        this.contractForm.monthRange = [];
    }
}

/**
 * 搜索前校验
 * @param {Function} fn 回调函数
 */
export const getDataByOptions = function (fn) {
    this.pages.curPage = 1;
    // 判断 不能只筛选记录月份
    // 计算每个参数的长度累加值是否为0或2
    const val = Object.values(this.contractForm).reduce((acc, cur) => acc + cur.length, 0);
    // 如果val为0表明所有筛选项为空
    if (val === 0) {
        this.$message.error('筛选项不能为空');
        return;
    }
    // 表示只选择了月份范围
    if (val === 2 && this.contractForm.monthRange.length > 0) {
        this.$message.error('不能只筛选记录月份');
        return;
    }
    fn();
}

// 计算当前页条数
export const curPageTotal = function () {
    return Math.ceil(this.pages.total / 20) > this.pages.curPage ? 20 : this.pages.total % 20;
}