/*
 * @author: kangxue
 * @Date: 2020-12-01 16:59:26
 * @LastEditors: kangxue
 * @LastEditTime: 2020-12-07 15:22:45
 * @description: 驳回弹窗组件jest
 */
import {
    mount
} from '@vue/test-utils';
import RejectDialog from '@/components/RejectDialog.vue';
describe('RejectDialog驳回弹窗组件的测试内容', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(RejectDialog, {
            propsData: {
                visible: true
            }
        });
    })
    afterEach(() => {
        wrapper.destroy();
    })
    it('props传的值必须是数字', () => {
        expect(wrapper.vm.$options.props.title.type).toEqual(String);
        expect(wrapper.vm.$options.props.visible.type).toEqual(Boolean);
        expect(wrapper.vm.$options.props.maxLength.type).toEqual(Number);
    });
    it('测试props渲染', () => {
        wrapper.setProps({
            title: 'test title',
            visible: true
        });
        wrapper.vm.$nextTick(() => {
            expect(wrapper.find('.el-dialog__title').text()).toEqual('test title');
            expect(wrapper.vm.dialogVisble).toBe(true);
        })
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
    it('测试输入项文本长度', () => {
        // 需要先让visible=true，才能测试dialog内部内容
        wrapper.setProps({
            maxLength: 200
        });
        // 不放在nextTick中会是300，因为表单是后面根据visible加载出来的
        wrapper.vm.$nextTick(() => {
            expect(wrapper.find('textarea').attributes().maxlength).toEqual('200');
        })
    })
    it('测试点击取消按钮', () => {
        wrapper.setData({
            rejectForm: {
                reason: '填写原因呀'
            }
        });
        const mockFn = jest.fn();
        wrapper.vm.$on('close', mockFn);
        wrapper.vm.cancelReject();
        expect(mockFn).toBeCalled();
        expect(wrapper.vm.rejectForm.reason).toEqual('');
    });
    // 此模块不写，Branches只有二分之一
    it('测试点击确定按钮无内容时', () => {
        console.warn = jest.fn();
        wrapper.setData({
            rejectForm: {
                reason: ''
            }
        });
        wrapper.vm.confirmReject();
        wrapper.vm.$nextTick(() => {
            // 确定方法后，没有填写原因，无法执行emit方法
            expect(wrapper.emitted().confirm).toBeFalsy();
            expect(console.warn).toHaveBeenCalled();
            expect(console.warn).toHaveBeenCalledTimes(1);
        })
    });
    it('测试点击确定按钮', () => {
        wrapper.setData({
            rejectForm: {
                reason: '填写原因呀'
            }
        });
        const mockFn = jest.fn();
        wrapper.vm.$on('confirm', mockFn);
        wrapper.vm.confirmReject();
        expect(mockFn).toBeCalled();
        expect(mockFn).toHaveBeenCalledWith('填写原因呀');
        wrapper.vm.confirmReject();
        expect(mockFn).toHaveBeenCalledTimes(2);
        expect(mockFn).toHaveBeenCalledWith('填写原因呀');
    });
})
