/*
 * @author: kangxue
 * @Date: 2020-11-30 16:15:59
 * @LastEditors: kangxue
 * @LastEditTime: 2021-02-26 10:24:48
 * @description: alert提示弹窗组件测试文件
 */
import { mount } from '@vue/test-utils';
import ImageView from '@/pages/propertySide/buildingDictionary/components/ImageView.vue';
describe('ImageView', () => {
    let wrapper,mockFn;
    beforeAll(() => {
        wrapper = mount(ImageView);
        mockFn = jest.fn();
        wrapper.vm.$on('update:vshow', mockFn);
    })
    afterAll(() => {
        wrapper.destroy();
    })
    it('测试watch', async () => {
        await wrapper.setProps({
            vshow: false
        });
        expect(wrapper.vm.viewShow).toBe(false);
        await wrapper.setProps({
            vshow: true
        });
        expect(wrapper.vm.viewShow).toBe(true);
    });
    it('测试closeImgView', async () => {
        await wrapper.vm.closeImgView();
        expect(wrapper.vm.viewShow).toBe(false);
        expect(mockFn).toHaveBeenCalled();
        expect(mockFn).toHaveBeenLastCalledWith(false);
    });
    it('测试imgPreview', async () => {
        await wrapper.vm.imgPreview();
        expect(wrapper.vm.viewShow).toBe(true);
        expect(mockFn).toHaveBeenCalled();
        expect(mockFn).toHaveBeenCalledTimes(2);
        expect(mockFn).toHaveBeenLastCalledWith(true);
    });
});
