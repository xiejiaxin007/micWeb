<!--
 * @Author: xie bin
 * @Date: 2020-06-18 10:29:02
 * @LastEditTime: 2020-06-24 17:34:22
 * @LastEditors: xie bin
 * @Description: 添加虚拟号
 * @FilePath: /webapp_backend/src/pages/newPlatForm/virtualNumber/VirtualAddNum.vue
--> 
<template>
    <div class="virtual-box">
        <!---面包屑--->
        <el-breadcrumb class="bread-crumb" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>虚拟号管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path: '/virtualNum/virtualNumStock'}">虚拟号库存</el-breadcrumb-item>
            <el-breadcrumb-item>添加虚拟号</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content-box">
            <el-form
                :model="formInline"
                :rules="rules"
                ref="formInline"
                label-width="130px">
                <el-form-item label="虚拟号归属城市:" prop="getCityVal">
                    <el-select
                        v-model="formInline.getCityVal"
                        filterable
                        placeholder="请选择虚拟号归属城市">
                        <el-option
                            v-for="(item, index) in getCityData"
                            :key="index"
                            :label="item.text"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="虚拟号类型:" prop="virtualType">
                    <el-select v-model="formInline.virtualType" placeholder="请选择虚拟号类型">
                        <el-option
                                v-for="(item, index) in virtualNumTypeData"
                                :key="index"
                                :label="item.text"
                                :value="item.id">
                            </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="虚拟号号码:" prop="virtualNum">
                    <el-input
                        class="jl-textarea"
                        type="textarea"
                        v-model="formInline.virtualNum"
                        placeholder="请输入虚拟号号码">
                        </el-input>
                </el-form-item>
            </el-form>
            <div class="btn-box">
                <el-button type="primary" @click="submitForm('formInline')">保存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import commonApi from './api/commonApi';
import virtualNumApi from './api/virtualNumStock';
export default {
    data() {
        return {
           formInline: {
                // 城市下拉val
                getCityVal: '',
                // 虚拟号类型
                virtualType: '',
                // 虚拟号号码
                virtualNum: ''
            },
            // 城市下拉数据
            getCityData: [],
            // 虚拟号类型
            virtualNumTypeData: [],
            rules: {
                getCityVal: [
                    { required: true, message: '请选择虚拟号归属城市', trigger: 'change' },
                ],
                virtualType: [
                    { required: true, message: '请选择虚拟号类型', trigger: 'change' }
                ],
                virtualNum: [
                    { required: true, message: '请输入虚拟号号码', trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
        // 获取全部虚拟城市
        this.getAllCityList();
        // 获取通用下拉配置
        this.getGeneralSelConfig();
    },
    methods: {
        /**
         * @description: 提交
         * @param {string} formName 表单ref
         */
        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                try {
                    if (!valid) {
                        return
                    }
                    // 判断虚拟号码是否重复&检测手机号长度
                    let virtualNumArr;
                    let subStringNum;
                    // 转换字符串中的中文逗号
                    subStringNum = this.formInline.virtualNum.replace(/\，/g, ',');
                    if (subStringNum.substring(subStringNum.length-1).indexOf(',') > -1 || subStringNum.substring(subStringNum.length-1).indexOf('，') > -1) {
                        console.log()
                        subStringNum = subStringNum.substring(0, subStringNum.length-1);
                    }
                    virtualNumArr = subStringNum.split(',');
                    let flagData = this.isRepeat(virtualNumArr);
                    // 号码格式错误
                    if (!flagData.minNum) {
                        this.$alert(flagData.elData + '格式错误，请检查');
                        return;
                    }
                    // 号码重复
                    if (!flagData.flag) {
                        this.$alert(flagData.elData + '已经存在，请检查');
                        return;
                    }
                    // 提交接口
                    let params = {
                        city_id: this.formInline.getCityVal,
                        type: this.formInline.virtualType,
                        phones: subStringNum
                    }
                    let { data } = await virtualNumApi.addVirtualNumData(params);
                    console.log(data)
                    if (data.code === 0) {
                        this.$message('提交成功');
                        this.$router.push({
                            path: '/virtualNum/virtualNumStock'
                        })
                    } else {
                        this.$alert(data.msg);
                    }
                }
                catch(error) {
                    console.log(error);
                }
            });
        },
        /**
         * @description: 检测手机号长度&是否重复
         * @param {Array} arr 虚拟号码 
         * @return: Object
         */
        isRepeat(arr) {
            var hash = {};
            for (var i in arr) {
                if (arr[i].length < 11) {
                    return {
                        minNum: false,
                        elData: arr[i]
                    }
                }
                if (hash[arr[i]]){
                    return {
                        flag: false,
                        elData: arr[i]
                    }
                }
                hash[arr[i]] = true;
            }
            return {
                flag: true,
                minNum: true
            };
        },
        // 获取全部虚拟城市
        async getAllCityList() {
            try {
                let params = {
                    type: '2'
                }
                let { data } = await virtualNumApi.getCityListData(params);
                console.log(data);
                if (data.code === 0) {
                    this.getCityData = data.data;
                }
            }
            catch(error) {
                console.log(error);
            }
        },
        // 获取通用下拉配置
        async getGeneralSelConfig() {
            try {
                let params = {
                    type: [1,2,3]
                }
                let { data } = await commonApi.getConfigListData(params);
                console.log(data);
                if (data.code === 0) {
                    this.virtualNumTypeData = data.data.virtual_type;
                }
            }
            catch(error) {
                console.log(error);
            }
        }
    }
}
</script>

<style lang="less" scoped>
.virtual-box {
    padding: 20px 50px;
    box-sizing: border-box;
    .content-box {
        background: #fff;
        padding: 20px 20px;
        margin-top: 30px;
        /deep/ .jl-textarea {
            width: 500px;
            .el-textarea__inner {
                height: 100px;
            }
        }
        .btn-box {
            text-align: center;
        }
    }
}
</style>