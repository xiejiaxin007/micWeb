/*
 * @author: kangxue
 * @Date: 2020-11-30 16:15:59
 * @LastEditors: kangxue
 * @LastEditTime: 2021-01-14 18:07:15
 * @description: alert提示弹窗组件测试文件
 */
import { mount } from '@vue/test-utils';
import AlertDialog from '@/components/AlertDialog.vue';
describe('alert-dialog确认弹窗的测试内容', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(AlertDialog, {
            propsData: {
                title: '提示',
                confirmBtn: '确定按钮',
                // width: '400px',
                visible: true
            }
        });
    })
    afterEach(() => {
        wrapper.destroy();
    })
    // 断言弹窗内容渲染
    it('测试标题、内容、取消按钮文本、确定按钮文本有没有正确显示', () => {
        expect(wrapper.find('.el-dialog__title').text()).not.toBe('');
        expect(wrapper.find('.el-dialog').element.style.width).toBe('350px');
        expect(wrapper.find('.el-button--primary').text()).toEqual('确定按钮');
        expect(wrapper.vm.dialogVisble).toBe(true);
    });
    it('测试watch', () => {
        wrapper.setProps({
            visible: false
        });
        // 断言函数是否执行
        wrapper.vm.$nextTick(() => {
            expect(wrapper.vm.dialogVisble).toBe(false);
        })
    });
    it('测试点击确定按钮', () => {
        wrapper.vm.confirm();
        wrapper.vm.$nextTick(() => {
            // emit确实被执行
            expect(wrapper.emitted().confirm).toBeTruthy();
        })
    })
});
