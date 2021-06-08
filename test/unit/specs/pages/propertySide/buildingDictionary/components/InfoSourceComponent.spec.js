/*
 * @author: kangxue
 * @Date: 2020-12-22 13:59:58
 * @LastEditors: kangxue
 * @LastEditTime: 2020-12-22 14:06:50
 * @description: 楼盘组件
 */
import {
    mount
} from '@vue/test-utils';
import InfoSourceComponent from '@/pages/propertySide/buildingDictionary/components/InfoSourceComponent.vue';
describe('InfoSourceComponent', () => {
    let wrapper;
    beforeAll(() => {
        wrapper = mount(InfoSourceComponent);
    })
    afterAll(() => {
        wrapper.destroy();
    })
    it('测试watch', () => {
        
    });
})