/*
 * @author: kangxue
 * @Date: 2020-12-07 11:45:54
 * @LastEditors: kangxue
 * @LastEditTime: 2020-12-14 18:13:54
 * @description: 音频倍速播放
 */
import {
    mount
} from '@vue/test-utils';
import AudioPlay from '@/components/AudioPlay.vue';
describe('AudioPlay音频倍速播放组件的测试内容', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(AudioPlay);
    })
    afterEach(() => {
        wrapper.destroy();
    })
    it('测试音频链接渲染', () => {
        wrapper.setProps({
            url: '111111111.mp3'
        })
        wrapper.vm.$nextTick(() => {
            expect(wrapper.find('audio').attributes().src).toEqual('111111111.mp3');
        })
    });
    // todo 倍速没有测试
    it('测试速度切换', async () => {
        wrapper.vm.changeRate('2');
    });
});