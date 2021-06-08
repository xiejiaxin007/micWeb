/*
 * @author: kangxue
 * @Date: 2020-12-22 13:59:58
 * @LastEditors: kangxue
 * @LastEditTime: 2020-12-22 14:06:37
 * @description: 楼盘组件
 */
import {
    mount
} from '@vue/test-utils';
import BuildingDictionarySelect from '@/pages/propertySide/buildingDictionary/components/BuildingDictionarySelect.vue';
describe('BuildingDictionarySelect', () => {
    let wrapper;
    beforeAll(() => {
        wrapper = mount(BuildingDictionarySelect);
    })
    afterAll(() => {
        wrapper.destroy();
    })
    it('测试watch', () => {
        
    });
})