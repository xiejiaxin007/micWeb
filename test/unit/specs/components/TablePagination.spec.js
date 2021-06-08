/*
 * @author: kangxue
 * @Date: 2020-12-01 10:34:32
 * @LastEditors: kangxue
 * @LastEditTime: 2020-12-14 18:33:48
 * @description: 表格分页的测试
 */
import {
    mount
} from '@vue/test-utils';
import TablePagination from '@/components/TablePagination.vue';
describe('TablePagination分页表格展示的测试内容', () => {
    let wrapper;
    beforeAll(() => {
        wrapper = mount(TablePagination);
    })
    afterAll(() => {
        wrapper.destroy();
    })
    it('props传值组件是否变现', () => {
        wrapper.setProps({
            total: 100,
            page: 2,
            pageSize: 12
        });
        expect(wrapper.props().total).toBe(100);
        expect(wrapper.props().page).toBe(2);
        expect(wrapper.props().pageSize).toBe(12);
    });
    it('测试watch', () => {
        wrapper.setProps({
            page: 2
        });
        wrapper.vm.$nextTick(() => {
            expect(wrapper.vm.currentPage).toEqual(2);
        })
    });
    it('total=0不展示第多少条', () => {
        wrapper.setProps({
            total: 0
        })
        wrapper.vm.$nextTick(() => {
            expect(wrapper.find('.total-num').find('span').exists()).toBeFalsy();
            expect(wrapper.find('.total-num').text()).toEqual('共0条数据');
        })
    });
    it('total大于0展示第多少条', () => {
        wrapper.setProps({
            total: 30
        })
        wrapper.vm.$nextTick(() => {
            expect(wrapper.find('.total-num').find('span').exists()).toBeTruthy();
            expect(wrapper.find('.total-num').text()).toMatch(/^第.*条，共30条数据$/);
        })
    });
    it('computed计算首页分页展示', () => {
        wrapper.setProps({
            total: 54,
            page: 1,
            pageSize: 5
        })
        wrapper.vm.$nextTick(() => {
            expect(wrapper.find('.total-num').text()).toEqual('第1-5条，共54条数据');
            expect(wrapper.vm.countRange).toEqual('1-5');
        })
    });
    it('computed计算中间页分页展示', () => {
        wrapper.setProps({
            total: 54,
            page: 2,
            pageSize: 10
        })
        wrapper.vm.$nextTick(() => {
            expect(wrapper.find('.total-num').text()).toEqual('第11-20条，共54条数据');
            expect(wrapper.vm.countRange).toEqual('11-20');
        })
    });
    it('computed计算尾页分页展示', () => {
        wrapper.setProps({
            total: 56,
            page: 3,
            pageSize: 20
        })
        wrapper.vm.$nextTick(() => {
            expect(wrapper.find('.total-num').text()).toEqual('第41-56条，共56条数据');
            expect(wrapper.vm.countRange).toEqual('41-56');
        })
    });
    it('总数小于每页条数不展示分页模块', () => {
        wrapper.setProps({
            total: 10,
            pageSize: 20
        })
        wrapper.vm.$nextTick(() => {
            expect(wrapper.find('.pagination').find('.el-pagination').exists()).toBeFalsy();
        })
    });
    it('总数大于每页条数才展示分页模块', () => {
        wrapper.setProps({
            total: 30,
            pageSize: 20
        })
        wrapper.vm.$nextTick(() => {
            expect(wrapper.find('.pagination').find('.el-pagination').exists()).toBeTruthy();
        })
    });
    // 测试命名插槽
    it('btns按钮组的插槽是否正确显示', () => {
        wrapper = mount(TablePagination, {
            slots: {
                btns: '按钮组',
                table: '表格渲染内容呀'
            }
        });
        expect(wrapper.find('.operation-area').text()).toBe('按钮组');
        expect(wrapper.find('.table-wrap').text()).toContain('表格渲染内容呀');
    })
    it('测试翻页', () => {
        wrapper.setData({
            currentPage: 10
        });
        const mockFn = jest.fn();
        wrapper.vm.$on('pageChange', mockFn);
        wrapper.vm.pageChange();
        expect(mockFn).toBeCalled();
        expect(mockFn).toHaveBeenCalledWith(10);
    })
});
