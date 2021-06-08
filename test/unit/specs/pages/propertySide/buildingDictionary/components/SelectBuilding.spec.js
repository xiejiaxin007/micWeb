/*
 * @author: kangxue
 * @Date: 2021-01-04 15:41:07
 * @LastEditors: kangxue
 * @LastEditTime: 2021-04-16 18:04:15
 * @description: 选择关联楼栋组件，可以选择全部；
 */
import {
    mount
} from '@vue/test-utils';
import SelectBuilding from '@/pages/propertySide/buildingDictionary/components/SelectBuilding.vue';
const buildingList = [{
    id: "41104",
    text: "1#"
}, {
    id: "41105",
    text: "2#"
}, {
    id: "41106",
    text: "3#",
    disabled: true
}, {
    id: "41107",
    text: "4#"
}, {
    id: "41108",
    text: "5#"
}];
describe('选择关联楼栋组件，可全选', () => {
    let wrapper;
    beforeAll(() => {
        wrapper = mount(SelectBuilding, {
            propsData: {
                value: ['41104', '41105'],
                options: buildingList
            }
        });
    });
    afterAll(() => {
        wrapper.destroy();
    });
    it('初始化触发watch的immediate', () => {
        expect(wrapper.vm.buildingOptions).toStrictEqual(buildingList);
        expect(wrapper.vm.buildings).toStrictEqual(['41104', '41105']);
    })
    it('测试watch--emit-input', async () => {
        const inputMock = jest.fn();
        wrapper.vm.$on('input', inputMock);
        await wrapper.setProps({
            value: ['41104']
        });
        expect(inputMock).toHaveBeenCalled();
        expect(inputMock).toHaveBeenCalledWith(['41104']);
        expect(wrapper.vm.buildings).toStrictEqual(['41104']);
        await wrapper.vm.$nextTick();
        await wrapper.setProps({
            value: ['41105','41107','41108']
        });
        expect(inputMock).toHaveBeenCalled();
        expect(inputMock).toHaveBeenCalledTimes(2);
        expect(inputMock).toHaveBeenLastCalledWith(['41105','41107','41108']);
        expect(wrapper.vm.buildings).toStrictEqual(['41105','41107','41108']);
    });
    it('测试点击事件，下拉里面有全部这一项',  ()=>{
        wrapper.findComponent({ref: 'relationBuilds'}).trigger('click');
        expect(wrapper.findAll('li').at(0).text()).toBe('全部');
        expect(wrapper.findAll('li')).toHaveLength(6);
    })
    it('测试移除标签', async () => {
        const removeMock = jest.fn();
        wrapper.vm.$on('remove-tag', removeMock);
        await wrapper.vm.removeBuildings('41105');
        expect(removeMock).toHaveBeenCalled();
        expect(removeMock).toHaveBeenCalledWith('41105');
        await wrapper.vm.removeBuildings('41107');
        expect(removeMock).toHaveBeenCalledTimes(2);
        expect(removeMock).toHaveBeenCalledWith('41107');
    });
    it('测试下拉选择', async () => {
        const changeMock = jest.fn();
        wrapper.vm.$on('change', changeMock);
        // 选择一个楼栋41105
        await wrapper.vm.changeBuildings(['41105']);
        expect(changeMock).toHaveBeenCalled();
        expect(changeMock).toHaveBeenCalledWith(['41105']);
        // 再选择一个楼栋41107
        await wrapper.vm.changeBuildings(['41105','41107']);
        expect(changeMock).toHaveBeenCalledTimes(2);
        expect(changeMock).toHaveBeenCalledWith(['41105','41107']);
        // 再选择一个全部楼栋
        await wrapper.vm.changeBuildings(['41105','41107','-1']);
        expect(wrapper.vm.buildings).toStrictEqual(['41104','41105','41107','41108']);
        expect(changeMock).toHaveBeenCalledTimes(3);
        expect(changeMock).toHaveBeenCalledWith(['41104','41105','41107','41108']);
        // 测试blur事件
        expect(wrapper.find('.el-select-dropdown').element.style.display).toBe('none');
        // 41106被禁用了，但是初始存在，就会全部选中
        await wrapper.setProps({
            value: ['41104', '41106']
        });
        expect(wrapper.vm.buildings).toStrictEqual(['41104','41106']);
        await wrapper.vm.changeBuildings(['-1']);
        expect(wrapper.vm.buildings).toStrictEqual(['41104','41105','41106','41107','41108']);
        expect(changeMock).toHaveBeenCalledTimes(4);
        expect(changeMock).toHaveBeenCalledWith(['41104','41105','41106','41107','41108']);
        expect(wrapper.find('.el-select-dropdown').element.style.display).toBe('none');
    });
})
describe('选择关联楼栋组件，可全选，没有设置propsData', () => {
    let wrapper;
    beforeAll(() => {
        wrapper = mount(SelectBuilding);
    });
    afterAll(() => {
        wrapper.destroy();
    });
    it('初始化触发watch的immediate', () => {
        expect(wrapper.vm.buildingOptions).toStrictEqual([]);
        expect(wrapper.vm.buildings).toStrictEqual([]);
    })
    it('测试点击事件，下拉为空',  ()=>{
        wrapper.findComponent({ref: 'relationBuilds'}).trigger('click');
        expect(wrapper.findAll('li').exists()).toBeFalsy();
    })
})