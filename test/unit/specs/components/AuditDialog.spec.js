/*
 * @author: kangxue
 * @Date: 2020-12-01 16:59:26
 * @LastEditors: kangxue
 * @LastEditTime: 2020-12-07 15:28:44
 * @description: 驳回弹窗组件jest
 */
import {
    mount
} from '@vue/test-utils';
import AuditDialog from '@/components/AuditDialog.vue';
describe('AuditDialog审核弹窗组件的测试内容', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(AuditDialog, {
            propsData: {
                visible: true
            }
        });
    })
    afterEach(() => {
        wrapper.destroy();
    })
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
    it('切换审核结果，通过没有审核原因模块', () => {
        wrapper.setProps({
            radioGroup: [{
                    value: '3',
                    name: '通过'
                },
                {
                    value: '4',
                    name: '不通过'
                }
            ],
            rejectId: '4'
        });
        wrapper.setData({
            auditForm: {
                audit: '3'
            }
        })
        wrapper.vm.$nextTick(() => {
            expect(wrapper.find('textarea').exists()).toBeFalsy();
        })
    })
    it('切换审核结果，不通过需要填原因', () => {
        wrapper.setProps({
            radioGroup: [
                { value: '3', name: '通过' },
                { value: '4', name: '不通过' }
            ], 
            rejectId: '4',
            maxLength: 100
        });
        wrapper.setData({
            auditForm: {
                audit: '4'
            }
        })
        wrapper.vm.$nextTick(() => {
            expect(wrapper.find('textarea').exists()).toBeTruthy();
            expect(wrapper.find('textarea').attributes().maxlength).toEqual('100');
        })
    })
    it('测试点击取消按钮', () => {
        wrapper.setData({
            auditForm: {
                audit: '2',
                reason: '填写原因呀'
            }
        });
        const mockFn = jest.fn();
        wrapper.vm.$on('close', mockFn);
        wrapper.vm.cancel();
        expect(mockFn).toBeCalled();
        // 取消方法后，表单重置
        expect(wrapper.vm.auditForm.reason).toEqual('');
        expect(wrapper.vm.auditForm.audit).toEqual('');
    });
    it('测试点击确定按钮，没有填写任何内容时', () => {
        console.warn = jest.fn();
        wrapper.setData({
            auditForm: {
                audit: '',
                reason: ''
            }
        });
        const mockFn = jest.fn();
        wrapper.vm.$on('confirm', mockFn);
        wrapper.vm.confirm();
        expect(mockFn).not.toBeCalled();
        expect(console.warn).toHaveBeenCalled();
        expect(console.warn).toHaveBeenCalledTimes(2);
    });
    it('测试点击确定按钮，不通过审核却无内容时', () => {
        console.warn = jest.fn();
        wrapper.setData({
            auditForm: {
                audit: '2',
                reason: ''
            }
        });
        wrapper.vm.confirm();
        wrapper.vm.$nextTick(() => {
            // 确定方法后，没有填写原因，无法执行emit方法
            expect(wrapper.emitted().confirm).toBeFalsy();
            expect(console.warn).toHaveBeenCalled();
            expect(console.warn).toHaveBeenCalledTimes(1);
        })
    });
    it('测试点击确定按钮非必填，不通过审核却无内容时', async () => {
        wrapper.setProps({
            isRequired: false
        });
        await wrapper.vm.$nextTick();
        wrapper.setData({
            auditForm: {
                audit: '2',
                reason: ''
            }
        });
        const mockFn = jest.fn();
        wrapper.vm.$on('confirm', mockFn);
        wrapper.vm.confirm();
        expect(mockFn).toHaveBeenCalled();
        expect(mockFn).toHaveBeenCalledWith({
            audit: '2',
            reason: ''
        });
    });
    it('测试点击确定按钮通过', () => {
        wrapper.setData({
            auditForm: {
                audit: '2',
                reason: '原因呀'
            }
        });
        const mockFn = jest.fn();
        wrapper.vm.$on('confirm', mockFn);
        wrapper.vm.confirm();
        expect(mockFn).toBeCalled();
        wrapper.vm.confirm();
        expect(mockFn).toHaveBeenCalledTimes(2);
        expect(mockFn).toHaveBeenCalledWith({
            audit: '2',
            reason: '原因呀'
        });
    });
})
