/*
 * @author: kangxue
 * @Date: 2020-11-30 10:54:24
 * @LastEditors: kangxue
 * @LastEditTime: 2020-12-01 16:32:40
 * @description: 二次确认弹窗组件测试文件
 */
import { mount } from '@vue/test-utils';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
describe('confirm-dialog二次弹窗的测试内容', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(ConfirmDialog, {
            propsData: {
                title: 'test title',
                content: 'test content',
                cancelBtn: '取消按钮',
                confirmBtn: '确定按钮',
                width: '400px',
                visible: true
            }
        });
    })
    afterEach(() => {
        wrapper.destroy();
    })
    // 断言弹窗内容渲染
    it('测试标题、内容、取消按钮文本、确定按钮文本有没有正确显示', () => {
        expect(wrapper.find('.el-dialog__title').text()).toEqual('test title');
        expect(wrapper.find('.confirm-info').text()).toEqual('test content');
        expect(wrapper.find('.el-dialog').element.style.width).toBe('400px');
        expect(wrapper.find('.confirm-btn').text()).toEqual('确定按钮');
        expect(wrapper.find('.cancel-btn').text()).toEqual('取消按钮');
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
    it('测试点击取消按钮', () => {
        wrapper.vm.cancel();
        wrapper.vm.$nextTick(() => {
            // emit确实被执行
            expect(wrapper.emitted().cancel).toBeTruthy();
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
