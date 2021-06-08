<template>
    <div class="edit-next-week-box">
        <el-dialog custom-class="common-dialog-wrapper"
            :visible.sync="workScheduleShow"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            center>
            <div slot="title"
                class="dialog-header">
                排班规则
            </div>
            <div class="body-box-content">
                <ul class="left-right-layout">
                    <li>
                        <div class="th">日期：</div>
                        <div class="td">{{date}}</div>
                    </li>
                    <li>
                        <div class="th">上户量：</div>
                        <div class="td week-wrap">
                            <div class="item-week">
                                <span>周一</span>
                                <jl-number-input v-model="mondey"
                                    reg="int" />
                            </div>
                            <div class="item-week">
                                <span>周二</span>
                                <jl-number-input v-model="tuesday"
                                    reg="int" />
                            </div>
                            <div class="item-week">
                                <span>周三</span>
                                <jl-number-input v-model="wednesday"
                                    reg="int" />
                            </div>
                            <div class="item-week">
                                <span>周四</span>
                                <jl-number-input v-model="thursday"
                                    reg="int" />
                            </div>
                            <div class="item-week">
                                <span>周五</span>
                                <jl-number-input v-model="saturday"
                                    reg="int" />
                            </div>
                            <div class="item-week">
                                <span>周六</span>
                                <jl-number-input v-model="friday"
                                    reg="int" />
                            </div>
                            <div class="item-week">
                                <span>周日</span>
                                <jl-number-input v-model="sunday"
                                    reg="int" />
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="th">爆单值：</div>
                        <div class="td">
                            <jl-number-input v-model="explosive"
                                reg="int" />
                        </div>
                    </li>
                    <li>
                        请确认好信息后保存，变更信息可能导致城市下所有员工需要从新排班
                    </li>
                </ul>
            </div>
            <span slot="footer"
                class="dialog-footer">
                <el-button class="cancel"
                    @click="close(false)">取消</el-button>
                <el-button class="confirm"
                    type="primary"
                    @click="confirmSchedule">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import workRestApi from '../api/workRestApi';
    import { mapState } from 'vuex';
    import { commonFun } from '@/assets/js/utils/utils';
    export default {
        name: 'editNextWeekBox',
        props: {
            // 排班规则显示
            workScheduleShow: {
                type: Boolean,
                default: false
            },
            // 城市id
            cityId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                // 日期
                date: '',
                // 周数据
                mondey: '',
                tuesday: '',
                wednesday: '',
                thursday: '',
                friday: '',
                saturday: '',
                sunday: '',
                // 爆单值
                explosive: ''
            };
        },
        methods: {
            // 编辑初始化弹窗数据
            async initData() {
                try {
                    let params = {
                        city_id: this.cityId
                    };
                    const {
                        data: { code, data }
                    } = await workRestApi.initWorkSchedule(params);
                    if (code === 0) {
                        this.date = data.date;
                        this.mondey = data.monday_plan_incostomer;
                        this.tuesday = data.tuesday_plan_incostomer;
                        this.wednesday = data.wednesday_plan_incostomer;
                        this.thursday = data.thursday_plan_incostomer;
                        this.friday = data.friday_plan_incostomer;
                        this.saturday = data.saturday_plan_incostomer;
                        this.sunday = data.sunday_plan_incostomer;
                        this.explosive = data.explosive_value;
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 确定排班规则
            async confirmSchedule() {
                if (!this.mondey || !this.tuesday || !this.wednesday || !this.thursday || !this.friday || !this.saturday || !this.sunday || !this.explosive) {
                    this.$message('请完成全部内容');
                    return;
                }
                try {
                    let params = {
                        city_id: this.cityId,
                        explosive_value: this.explosive,
                        monday_plan_incostomer: this.mondey,
                        tuesday_plan_incostomer: this.tuesday,
                        wednesday_plan_incostomer: this.wednesday,
                        thursday_plan_incostomer: this.thursday,
                        friday_plan_incostomer: this.friday,
                        saturday_plan_incostomer: this.saturday,
                        sunday_plan_incostomer: this.sunday
                    };
                    const {
                        data: { code, msg }
                    } = await workRestApi.editWorkSchedule(params);
                    if (code === 0) {
                        // 进行埋点
                        commonFun.setTrack('8153', this.trackCommon.info, {}, this.trackCommon.backendApi);
                        // 关闭弹窗
                        this.close(true);
                        this.$message({
                            message: msg,
                            type: 'success'
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            /**
             * 关闭弹窗
             * @param {String} res true是保存后关闭弹窗 false点击取消关闭弹窗
             * @return
             */
            close(res) {
                if (!res) {
                    // 进行埋点
                    commonFun.setTrack('8152', this.trackCommon.info, {}, this.trackCommon.backendApi);
                }
                this.$emit('closeScheduleDialog', res);
            }
        },
        computed: {
            ...mapState(['trackCommon'])
        },
        watch: {
            workScheduleShow: {
                deep: true,
                handler(val) {
                    // 下周排班
                    if (val) {
                        this.initData();
                    }
                }
            }
        }
    };
</script>
<style lang="less" scoped>
.edit-next-week-box {
    .left-right-layout {
        .th {
            width: 80px;
            text-align: right;
            margin-right: 20px;
            color: #888;
        }
        /deep/.week-wrap {
            width: 370px;
            display: flex;
            flex-wrap: wrap;
            margin-right: -16px;
            box-sizing: border-box;
            .item-week {
                margin-right: 16px;
            }
            .number-input-box {
                width: 60px;
                display: inline-block;
            }
        }
    }
}
</style>