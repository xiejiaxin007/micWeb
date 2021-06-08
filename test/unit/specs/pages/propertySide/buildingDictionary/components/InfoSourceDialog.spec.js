/*
 * @author: xiejiaxin
 * @Date: 2020-12-30 11:18:14
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2020-12-31 16:32:45
 * @description: 动销表格-信息来源弹窗
 */
import { createLocalVue, mount } from '@vue/test-utils';
import InfoSourceDialog from '@/pages/propertySide/buildingDictionary/components/InfoSourceDialog.vue';
const localVue = createLocalVue()
// 模拟来源下拉
const list = [{
    id: 7,
    text: "开发商"
}, {
    id: 9,
    text: "售楼处"
}, {
    id: 2,
    text: "商务"
}, {
    id: 1,
    text: "拓展"
}, {
    id: 3,
    text: "驻场"
}, {
    id: 5,
    text: "咨询师"
}, {
    id: 10,
    text: "其他"
}];

describe('来源选择弹窗', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(InfoSourceDialog, {
            propsData: {
                originArr: list
            }
        });
    });
    afterEach(() => {
        wrapper.destroy();
    });
    it('组件默认渲染', () => {
        const wrappers = mount(InfoSourceDialog);
        expect(wrappers.find('.info-source').exists()).toBe(true);
        // 默认值测试
        expect(wrappers.vm.value).toStrictEqual('');
        expect(wrappers.vm.otherVal).toStrictEqual('');
        expect(wrappers.vm.originArr).toStrictEqual([]);
        expect(wrappers.vm.otherValue).toStrictEqual('');
        expect(wrappers.vm.originValue).toStrictEqual('');
        expect(wrappers.vm.originList).toStrictEqual([]);
    });
    it('组件watch', async() => {
        await wrapper.setProps({
            value: '1',
            otherVal: '1',
            originArr: ['1']
        });
        expect(wrapper.vm.value).toStrictEqual('1');
        expect(wrapper.vm.otherVal).toStrictEqual('1');
        expect(wrapper.vm.originArr).toStrictEqual(['1']);
        expect(wrapper.vm.originList).toStrictEqual(['1']);
    });
    it('测试弹窗里面radio切换事件', async() => {
        // 测试来源切换时候input框展示
        await wrapper.vm.handFocus();
        expect(wrapper.find('.other-origin').isVisible()).toBe(false);
        await wrapper.vm.radioChange(10);
        // 触发change事件，还需要手动设置v-model值，这里就不进行click触发，属于element-ui
        await wrapper.setData({
            originValue: 10,
            otherValue: 'test'
        });
        expect(wrapper.find('.other-origin').isVisible()).toBe(true);
        expect(wrapper.find('.other-origin .el-input__inner').element.value).toBe('test');
        await wrapper.vm.radioChange(7);
        // 触发change事件，还需要手动设置v-model值，这里就不进行click触发，属于element-ui
        await wrapper.setData({
            originValue: 7
        });
        expect(wrapper.find('.other-origin').isVisible()).toBe(false);
        expect(wrapper.find('.other-origin .el-input__inner').element.value).toBe('');
    });
    it('测试选择为非“其他”情况组件的展示', async() => {
        await wrapper.setProps({
            value: 1,
            otherVal: ''
        });
        const selectWrapper = wrapper.find('.source-val');
        expect(selectWrapper.exists()).toBe(true);
        expect(selectWrapper.find('.el-input__inner').exists()).toBe(true);
        expect(selectWrapper.find('.el-icon-circle-close').exists()).toBe(false);
        // 默认选中项
        expect(selectWrapper.find('.el-input__inner').element.value).toStrictEqual('拓展');
        // 触发focus
        await wrapper.vm.handFocus();
        const labels = wrapper.findAll('.origin-radio');
        // 弹窗出现
        expect(wrapper.vm.dialogFormVisible).toStrictEqual(true);
        // 出现radio而不是input
        expect(labels).toHaveLength(7);
        expect(labels.at(3).attributes().class).toContain('is-checked');
        // v-show
        expect(wrapper.find('.other-origin').isVisible()).toBe(false);

    });
    it('测试选择为“其他”情况组件的展示', async() => {
        await wrapper.setProps({
            value: 10,
            otherVal: '安居客'
        });
        const inputWrapper = wrapper.find('.el-input__inner');
        expect(wrapper.find('.source-val').exists()).toBe(false);
        // select里面也有一个el-input
        expect(wrapper.findAll('.el-input__inner')).toHaveLength(1);
        expect(inputWrapper.exists()).toBe(true);
        // v-else的input有一个类名为：el-icon-circle-close的icon
        expect(wrapper.find('.el-icon-circle-close').exists()).toBe(true);
        // 触发focus
        await wrapper.vm.handFocus();
        // 弹窗出现
        expect(wrapper.vm.dialogFormVisible).toStrictEqual(true);
        expect(wrapper.vm.hasSubmit).toBe(false);
        // v-show
        expect(wrapper.find('.other-origin').isVisible()).toBe(true);
        expect(wrapper.find('.other-origin .el-input__inner').element.value).toBe('安居客');
    });
    it('测试清空事件', async() => {
        await wrapper.setProps({
            value: 10,
            otherVal: '安居客'
        });
        const mockInputFn = jest.fn();
        wrapper.vm.$on('input', mockInputFn);
        const changeFn = jest.fn();
        wrapper.vm.$on('change', changeFn);
        const updateFn = jest.fn();
        wrapper.vm.$on('update:otherVal', updateFn);
        await wrapper.vm.clearOriginVal();
        expect(wrapper.vm.originValue).toBe('');
        expect(wrapper.vm.otherValue).toBe('');
        expect(mockInputFn).toHaveBeenCalled();
        expect(mockInputFn).toHaveBeenCalledWith('');
        expect(changeFn).toHaveBeenCalled();
        expect(changeFn).toHaveBeenCalledWith('', '');
        expect(updateFn).toHaveBeenCalled();
        expect(updateFn).toHaveBeenCalledWith('');
        // TODO update:otherVal
        // await wrapper.vm.$nextTick();
        // expect(wrapper.vm.otherVal).toBe('');
    });
    it('测试打开和关闭弹窗方法', async() => {
        await wrapper.setProps({
            value: 10,
            otherVal: '安居客'
        });
        // 触发focus
        await wrapper.vm.handFocus();
        // 弹窗出现
        expect(wrapper.vm.dialogFormVisible).toStrictEqual(true);
        expect(wrapper.vm.hasSubmit).toBe(false);
        // 关闭弹窗，比如说点右上角的叉号
        await wrapper.vm.closeDialog();
        expect(wrapper.vm.originValue).toBe(10);
        expect(wrapper.vm.otherValue).toBe('安居客');
    });
    it('测试提交方法', async() => {
        await wrapper.setProps({
            value: 1
        });
        // 保存$message
        const originMessage = localVue.prototype.$message;
        localVue.prototype.$message.error = jest.fn();
        // 模拟emit
        const inputFn = jest.fn();
        wrapper.vm.$on('input', inputFn);
        const changeFn = jest.fn();
        wrapper.vm.$on('change', changeFn);
        const updateFn = jest.fn();
        wrapper.vm.$on('update:otherVal', updateFn);
        // 触发focus
        await wrapper.vm.handFocus();
        // 选择‘其他’选项
        await wrapper.setData({
            originValue: 10,
            otherValue: ''
        });
        expect(wrapper.find('.other-origin').isVisible()).toBe(true);
        await wrapper.vm.checkedCurVal();
        expect(localVue.prototype.$message.error).toHaveBeenCalled();
        expect(localVue.prototype.$message.error).toHaveBeenLastCalledWith('请输入来源为其他对应的值');
        // 方法不再继续执行
        expect(inputFn.mock.calls).toHaveLength(0);
        // 弹窗不关闭
        expect(wrapper.vm.dialogFormVisible).toBe(true);
        // 这个时候如果点击右上角关闭按钮
        await wrapper.vm.closeDialog();
        expect(wrapper.vm.originValue).toBe(1);
        expect(wrapper.vm.otherValue).toBe('');
        localVue.prototype.$message = originMessage;
        // 选择‘其他’选项，并且填入内容
        await wrapper.setData({
            originValue: 10,
            otherValue: '其他输入值'
        });
        expect(wrapper.find('.other-origin').isVisible()).toBe(true);
        await wrapper.vm.checkedCurVal();
        expect(inputFn).toHaveBeenCalled();
        expect(inputFn).toHaveBeenCalledWith(10);
        expect(changeFn).toHaveBeenCalled();
        expect(changeFn).toHaveBeenCalledWith(10, '其他输入值');
        expect(updateFn).toHaveBeenCalled();
        expect(updateFn).toHaveBeenCalledWith('其他输入值');
        // 这个时候如果点击右上角关闭按钮
        await wrapper.vm.closeDialog();
        expect(wrapper.vm.originValue).toBe(10);
        expect(wrapper.vm.otherValue).toBe('其他输入值');
        // 选择非‘其他’选项
        await wrapper.setData({
            originValue: 1,
            otherValue: ''
        });
        expect(wrapper.find('.other-origin').isVisible()).toBe(false);
        await wrapper.vm.checkedCurVal();
        expect(inputFn).toHaveBeenCalled();
        expect(inputFn).toHaveBeenLastCalledWith(1);
        expect(changeFn).toHaveBeenCalled();
        expect(changeFn).toHaveBeenLastCalledWith(1, '');
        expect(updateFn).toHaveBeenCalled();
        expect(updateFn).toHaveBeenLastCalledWith('');
    });
});