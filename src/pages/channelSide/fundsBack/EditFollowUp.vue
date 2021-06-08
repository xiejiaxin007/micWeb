<!--
 * @Name: 回款流程跟进录入
 * @Description: 回款流程跟进录入
 * @Author: wangxue
 * @Date: 2020-4-22
 -->
<template>
    <div class="edit-follow-up-box">
        <div class="el-row">
            <el-col :span="24"
                class="content-main">
                <!-- 面包屑 -->
                <el-breadcrumb class="bread-crumb-box"
                    separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item>
                        <a href="/">首页</a>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>回款流程跟进</el-breadcrumb-item>
                </el-breadcrumb>
                <div class="content-box">
                    <!-- 回款组 -->
                    <div class="group-table-box">
                        <div class="hd">
                            <h2>当前阶段：{{currentStageName}}   <span class="group-id">回款组ID：{{groupId}}</span></h2>
                        </div>
                        <div class="bd">
                            <el-form class="header-box"
                                ref="followTimeForm"
                                :model="followTimeForm"
                                label-width="124px"
                                :inline="true">
                                <el-form-item label="实际跟进时间："
                                    prop="actualTime"
                                    :rules="[{ required: true, message: '请选择实际跟进时间', trigger: ['blur', 'change']}]">
                                    <el-date-picker v-model="followTimeForm.actualTime"
                                        type="datetime"
                                        placeholder="选择日期"
                                        format="yyyy-MM-dd HH:mm:ss"
                                        value-format="timestamp"
                                        :picker-options="pickerOptionsBefore">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="预计回款时间："
                                    prop="estimateTime"
                                    :rules="[{ required: true, message: '请选择预计回款时间', trigger: ['blur', 'change']}]">
                                    <el-date-picker v-model="followTimeForm.estimateTime"
                                        type="date"
                                        placeholder="选择日期"
                                        format="yyyy-MM-dd"
                                        value-format="timestamp"
                                        :picker-options="pickerOptionsAfter">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="创建人：">
                                    {{userInfoObj.text}}
                                </el-form-item>
                                <el-form-item class="tips">
                                    移除的成交单将在提交本次跟进后，自动生成一份同当前阶段的回款组
                                </el-form-item>
                            </el-form>
                            <!-- 表格内容 -->
                            <follow-up-list ref="followUpList"
                                typeList='2'
                                :id="groupId"
                                pageType='1'
                                :currentStage="currentStage">
                            </follow-up-list>
                            <!-- 跟进内容 -->
                            <div class="follow-up-box"
                                v-if="followUpForm.length > 0">
                                <el-form ref="followUpOtherForm"
                                    :model="followUpOtherForm"
                                    :inline="true">
                                    <!-- 1-确认业绩 -->
                                    <div class="step-item-box left-right-layout"
                                        v-if="currentStage==='1'">
                                        <el-form ref="followUpForm0"
                                            :model="followUpForm[0]"
                                            :inline="true">
                                            <div class="step-left">
                                                <el-form-item label="以上成交单业绩是否确认：">
                                                    <el-radio-group v-model="followUpForm[0].follow_result">
                                                        <el-radio label="1">是</el-radio>
                                                        <el-radio label="2">否</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>
                                            </div>
                                            <div class="step-right">
                                                <div class="form-item-box">
                                                    <el-form-item v-if="followUpForm[0].follow_result==='1'"
                                                        label="业绩确认完成日期："
                                                        prop="business_datetime"
                                                        :rules="[{ required: true, message: '请选择日期', trigger: ['blur', 'change']}]">
                                                        <el-date-picker v-model="followUpForm[0].business_datetime"
                                                            type="date"
                                                            placeholder="选择日期"
                                                            format="yyyy-MM-dd"
                                                            value-format="timestamp"
                                                            :picker-options="pickerOptionsBefore">
                                                        </el-date-picker>
                                                    </el-form-item>
                                                </div>
                                                <div class="form-item-box">
                                                    <el-form-item v-if="followUpForm[0].follow_result==='2'"
                                                        label="预计业绩确认完成日期："
                                                        prop="business_datetime"
                                                        :rules="[{ required: true, message: '请选择日期', trigger: ['blur', 'change']}]">
                                                        <el-date-picker v-model="followUpForm[0].business_datetime"
                                                            type="date"
                                                            placeholder="选择日期"
                                                            format="yyyy-MM-dd"
                                                            value-format="timestamp"
                                                            :picker-options="pickerOptionsAfter">
                                                        </el-date-picker>
                                                    </el-form-item>
                                                </div>
                                                <div class="form-item-box">
                                                    <el-form-item v-if="followUpForm[0].follow_result==='1'"
                                                        label="业绩确认完成的凭证（上传的凭证）："
                                                        prop="file_type"
                                                        :rules="[{ required: true, message: '请选择凭证类型', trigger: ['blur', 'change']}]">
                                                        <el-radio-group v-model="followUpForm[0].file_type">
                                                            <el-radio label="1">标准：业绩确认单</el-radio>
                                                            <el-radio label="2">非标准：微信聊天记录等</el-radio>
                                                        </el-radio-group>
                                                    </el-form-item>
                                                </div>
                                                <!-- 当业绩确认为是的时候展示 -->
                                                <div class="form-item-box img-form-item-box"
                                                     v-if="followUpForm[0].follow_result==='1'">
                                                    <el-form-item
                                                        label="业绩确认单："
                                                        prop="imgList"
                                                        :rules="[{ required: true, validator: checkImg, message: '', trigger: ['blur', 'change']}]">
                                                        <div class="upload-btn-box">
                                                            <jl-file-upload class="upload-btn"
                                                                v-if="imgLimit"
                                                                ref="confirmFileUpload"
                                                                fileType="jpg,png,jpeg,gif,pdf"
                                                                fileMaxSize="10mb"
                                                                upID="confirmImgUpload"
                                                                :isMulti="true"
                                                                :limit="imgLimit"
                                                                :ossData="ossData"
                                                                @beforeUpdate="beforeUpdate"
                                                                @getFileURL="(fileList) => getFileURLMethod(fileList, followUpForm[0].imgList)">
                                                                <el-button type="primary">上传业绩确认单</el-button>
                                                            </jl-file-upload>
                                                            <span class="upload-tips">可上传图片、pdf，上传不超过10个文件，每个附件不超过10M</span>
                                                        </div>
                                                        <!-- 文件展示 -->
                                                        <div class="img-list-box"
                                                            v-if="imgListLenFlag">
                                                            <div class="file-box-wrapper"
                                                                 v-for="(item, i) in followUpForm[0].imgList.file"
                                                                :key="item.file_path_full">
                                                                <a :href="OSSView + item.file_path_full"
                                                                    class="img-item"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer">
                                                                    <span class="file-name">{{item.file_name}}</span>
                                                                    <span class="btn-del" @click.prevent="delImg(followUpForm[0].imgList.file, i)">删除</span>
                                                                </a>
                                                            </div>
                                                            <div :class="{'img-box-wrapper': followUpForm[0].imgList.file.length > 0}">
                                                                <a v-for="(item, i) in followUpForm[0].imgList.img"
                                                                    :href="item.file_path_full"
                                                                    class="img-item"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    :key="item.file_path_full">
                                                                    <div class="img-box">
                                                                        <img :src="item.file_path_full"
                                                                            alt="上传图片">
                                                                    </div>
                                                                    <div class="btn-del">
                                                                        <span @click.prevent="delImg(followUpForm[0].imgList.img, i)">删除</span>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </el-form-item>
                                                </div>
                                            </div>
                                        </el-form>
                                    </div>
                                    <!-- 2-核对佣金 -->
                                    <div class="step-item-box left-right-layout"
                                        v-if="followUpForm[0].follow_result==='1' || currentStage==='2'">
                                        <el-form ref="followUpForm1"
                                            :model="followUpForm[1]"
                                            :inline="true">
                                            <div class="step-left">
                                                <el-form-item label="以上成交单是否完成「佣金核对」："
                                                    prop="follow_result"
                                                    :rules="[{ required: true, message: '请选择当前阶段完成情况', trigger: ['blur', 'change']}]">
                                                    <el-radio-group v-model="followUpForm[1].follow_result">
                                                        <el-radio label="1">是</el-radio>
                                                        <el-radio label="2">否</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>
                                            </div>
                                            <div class="step-right">
                                                <div class="form-item-box">
                                                    <el-form-item v-if="followUpForm[1].follow_result==='1'"
                                                        label="佣金核对完成日期："
                                                        prop="business_datetime"
                                                        :rules="[{ required: true, message: '请选择日期', trigger: ['blur', 'change']}]">
                                                        <el-date-picker v-model="followUpForm[1].business_datetime"
                                                            type="date"
                                                            placeholder="选择日期"
                                                            format="yyyy-MM-dd"
                                                            value-format="timestamp"
                                                            :picker-options="pickerOptionsBefore">
                                                        </el-date-picker>
                                                    </el-form-item>
                                                </div>
                                                <div class="form-item-box">
                                                    <el-form-item v-if="followUpForm[1].follow_result==='2'"
                                                        label="预计佣金核对完成日期："
                                                        prop="business_datetime"
                                                        :rules="[{ required: true, message: '请选择日期', trigger: ['blur', 'change']}]">
                                                        <el-date-picker v-model="followUpForm[1].business_datetime"
                                                            type="date"
                                                            placeholder="选择日期"
                                                            format="yyyy-MM-dd"
                                                            value-format="timestamp"
                                                            :picker-options="pickerOptionsAfter">
                                                        </el-date-picker>
                                                    </el-form-item>
                                                </div>
                                                <div class="form-item-box">
                                                    <el-form-item v-if="followUpForm[1].follow_result==='1'"
                                                        label="佣金核对完成的凭证（上传的凭证）："
                                                        prop="file_type"
                                                        :rules="[{ required: true, message: '请选择凭证类型', trigger: ['blur', 'change']}]">
                                                        <el-radio-group v-model="followUpForm[1].file_type">
                                                            <el-radio label="1">标准：对账单</el-radio>
                                                            <el-radio label="2">非标准：微信聊天记录等</el-radio>
                                                        </el-radio-group>
                                                    </el-form-item>
                                                </div>
                                            </div>
                                        </el-form>
                                    </div>
                                    <!-- 3-准备材料
                                    if的判断过程 需要满足条件才显示
                                    1、后置返费/成交奖 commissionType全等于'1'
                                    2、有此阶段配置 is_open
                                    3、当前是第3阶段
                                        或者 第2阶段选择1 -->
                                    <div class="step-item-box left-right-layout"
                                        v-if="commissionType === '1' && followUpForm[2].is_open && (currentStage==='3' || followUpForm[1].follow_result==='1')">
                                        <el-form ref="followUpForm2"
                                            :model="followUpForm[2]"
                                            :inline="true">
                                            <div class="step-left">
                                                <el-form-item label="以上成交单「结佣材料」是否准备齐全，且提交至合作方："
                                                    prop="follow_result"
                                                    :rules="[{ required: true, message: '请选择当前阶段完成情况', trigger: ['blur', 'change']}]">
                                                    <el-radio-group v-model="followUpForm[2].follow_result">
                                                        <el-radio label="1">是</el-radio>
                                                        <el-radio label="2">否</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>
                                            </div>
                                            <div class="step-right">
                                                <div class="form-item-box">
                                                    <el-form-item v-if="followUpForm[2].follow_result==='1'"
                                                        label="「结佣材料」准备齐全日期："
                                                        prop="business_datetime"
                                                        :rules="[{ required: true, message: '请选择日期', trigger: ['blur', 'change']}]">
                                                        <el-date-picker v-model="followUpForm[2].business_datetime"
                                                            type="date"
                                                            placeholder="选择日期"
                                                            format="yyyy-MM-dd"
                                                            value-format="timestamp"
                                                            :picker-options="pickerOptionsBefore">
                                                        </el-date-picker>
                                                    </el-form-item>
                                                </div>
                                                <div class="form-item-box">
                                                    <el-form-item v-if="followUpForm[2].follow_result==='2'"
                                                        label="「结佣材料」预计准备齐全日期："
                                                        prop="business_datetime"
                                                        :rules="[{ required: true, message: '请选择日期', trigger: ['blur', 'change']}]">
                                                        <el-date-picker v-model="followUpForm[2].business_datetime"
                                                            type="date"
                                                            placeholder="选择日期"
                                                            format="yyyy-MM-dd"
                                                            value-format="timestamp"
                                                            :picker-options="pickerOptionsAfter">
                                                        </el-date-picker>
                                                    </el-form-item>
                                                </div>
                                            </div>
                                        </el-form>
                                    </div>
                                    <!-- 4-审核材料
                                    if判断过程 需要满足条件才显示
                                    1、后置返费/成交奖 commissionType全等于1'
                                    2、有此阶段配置 is_open
                                    3、当前是第4阶段
                                       或者 第3阶段选择1
                                       或者 没有第3阶段且第2阶段选择1 -->
                                    <div class="step-item-box left-right-layout"
                                        v-if="commissionType === '1' && followUpForm[3].is_open && (currentStage==='4' || followUpForm[2].follow_result==='1' || (followUpForm[1].follow_result==='1' && !followUpForm[2].is_open))">
                                        <el-form ref="followUpForm3"
                                            :model="followUpForm[3]"
                                            :inline="true">
                                            <div class="step-left">
                                                <el-form-item label="以上成交单「结佣材料」："
                                                    prop="follow_result"
                                                    :rules="[{ required: true, message: '请选择当前阶段完成情况', trigger: ['blur', 'change']}]">
                                                    <el-radio-group v-model="followUpForm[3].follow_result">
                                                        <el-radio label="1">合作方审核通过，材料没问题</el-radio>
                                                        <el-radio label="2">合作方审核中</el-radio>
                                                        <el-radio label="3"
                                                            v-if="currentStage==='4'">合作审核不通过，材料有问题</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>
                                            </div>
                                            <div class="step-right">
                                                <div class="form-item-box">
                                                    <el-form-item v-if="followUpForm[3].follow_result==='1'"
                                                        label="合作方「结佣材料」审核通过日期："
                                                        prop="business_datetime"
                                                        :rules="[{ required: true, message: '请选择日期', trigger: ['blur', 'change']}]">
                                                        <el-date-picker v-model="followUpForm[3].business_datetime"
                                                            type="date"
                                                            placeholder="选择日期"
                                                            format="yyyy-MM-dd"
                                                            value-format="timestamp"
                                                            :picker-options="pickerOptionsBefore">
                                                        </el-date-picker>
                                                    </el-form-item>
                                                </div>
                                                <div class="form-item-box">
                                                    <el-form-item v-if="followUpForm[3].follow_result==='2'"
                                                        label="合作方「结佣材料」预计审核通过日期："
                                                        prop="business_datetime"
                                                        :rules="[{ required: true, message: '请选择日期', trigger: ['blur', 'change']}]">
                                                        <el-date-picker v-model="followUpForm[3].business_datetime"
                                                            type="date"
                                                            placeholder="选择日期"
                                                            format="yyyy-MM-dd"
                                                            value-format="timestamp"
                                                            :picker-options="pickerOptionsAfter">
                                                        </el-date-picker>
                                                    </el-form-item>
                                                </div>
                                                <div class="form-item-box"
                                                    v-if="currentStage==='4'">
                                                    <el-form-item v-if="followUpForm[3].follow_result==='3'"
                                                        label="原因："
                                                        prop="follow_reason"
                                                        :rules="[{ required: true, message: '请填写原因', trigger: ['blur', 'change']}]">
                                                        <el-input type="text"
                                                            v-model="followUpForm[3].follow_reason">

                                                        </el-input>
                                                    </el-form-item>
                                                </div>
                                            </div>
                                        </el-form>
                                    </div>
                                    <!-- 5-开票邮寄
                                    if判断过程 需要满足条件才显示
                                    1、后置返费/成交奖 commissionType全等于'1'
                                    2、有此阶段配置 is_open
                                    3、当前是第5阶段
                                       或者 第4阶段选择1
                                       或者 没有第4阶段且第3阶段选择1
                                       或者 没有3、4阶段且第2阶段选择1 -->
                                    <div class="step-item-box left-right-layout"
                                        v-if="commissionType === '1' && followUpForm[4].is_open && (currentStage==='5' || followUpForm[3].follow_result==='1' || (followUpForm[2].follow_result==='1' && !followUpForm[3].is_open) || (followUpForm[1].follow_result==='1' && !followUpForm[2].is_open  && !followUpForm[3].is_open))">
                                        <el-form ref="followUpForm4"
                                            :model="followUpForm[4]"
                                            :inline="true">
                                            <div class="step-left">
                                                <el-form-item label="以上成交单「发票」进度："
                                                    prop="follow_result"
                                                    :rules="[{ required: true, message: '请选择当前阶段完成情况', trigger: ['blur', 'change']}]">
                                                    <el-radio-group v-model="followUpForm[4].follow_result">
                                                        <el-radio label="1">已开票，对方已经收到</el-radio>
                                                        <el-radio label="2">无需开票</el-radio>
                                                        <el-radio label="3">已开票，已邮寄</el-radio>
                                                        <el-radio label="4">已开票，未邮寄</el-radio>
                                                        <el-radio label="5">开票审批已提交，待开票</el-radio>
                                                        <el-radio label="6">开票审批未提交</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>
                                            </div>
                                            <div class="step-right">
                                                <div class="form-item-box">
                                                    <el-form-item v-if="followUpForm[4].follow_result==='1'"
                                                        label="合作方收到「发票」日期："
                                                        prop="business_datetime"
                                                        :rules="[{ required: true, message: '请选择日期', trigger: ['blur', 'change']}]">
                                                        <el-date-picker v-model="followUpForm[4].business_datetime"
                                                            type="date"
                                                            placeholder="选择日期"
                                                            format="yyyy-MM-dd"
                                                            value-format="timestamp"
                                                            :picker-options="pickerOptionsBefore">
                                                        </el-date-picker>
                                                    </el-form-item>
                                                </div>
                                                <div class="form-item-box">
                                                </div>
                                                <div class="form-item-box">
                                                    <el-form-item v-if="followUpForm[4].follow_result==='3'"
                                                        label="预计收到发票日期："
                                                        prop="business_datetime"
                                                        :rules="[{ required: true, message: '请选择日期', trigger: ['blur', 'change']}]">
                                                        <el-date-picker v-model="followUpForm[4].business_datetime"
                                                            type="date"
                                                            placeholder="选择日期"
                                                            format="yyyy-MM-dd"
                                                            value-format="timestamp"
                                                            :picker-options="pickerOptionsAfter">
                                                        </el-date-picker>
                                                    </el-form-item>
                                                </div>
                                                <div class="form-item-box">
                                                    <el-form-item v-if="followUpForm[4].follow_result==='4'"
                                                        label="预计收到发票日期："
                                                        prop="business_datetime"
                                                        :rules="[{ required: true, message: '请选择日期', trigger: ['blur', 'change']}]">
                                                        <el-date-picker v-model="followUpForm[4].business_datetime"
                                                            type="date"
                                                            placeholder="选择日期"
                                                            format="yyyy-MM-dd"
                                                            value-format="timestamp"
                                                            :picker-options="pickerOptionsAfter">
                                                        </el-date-picker>
                                                    </el-form-item>
                                                    <el-form-item v-if="followUpForm[4].follow_result==='4'"
                                                        label="原因："
                                                        prop="follow_reason"
                                                        :rules="[{ required: true, message: '请填写原因', trigger: ['blur', 'change']}]">
                                                        <el-input type="text"
                                                            v-model="followUpForm[4].follow_reason">

                                                        </el-input>
                                                    </el-form-item>
                                                </div>
                                                <div class="form-item-box">
                                                    <el-form-item v-if="followUpForm[4].follow_result==='5'"
                                                        label="预计开票日期："
                                                        prop="business_datetime"
                                                        :rules="[{ required: true, message: '请选择日期', trigger: ['blur', 'change']}]">
                                                        <el-date-picker v-model="followUpForm[4].business_datetime"
                                                            type="date"
                                                            placeholder="选择日期"
                                                            format="yyyy-MM-dd"
                                                            value-format="timestamp"
                                                            :picker-options="pickerOptionsAfter">
                                                        </el-date-picker>
                                                    </el-form-item>
                                                    <el-form-item v-if="followUpForm[4].follow_result==='5'"
                                                        label="原因："
                                                        prop="follow_reason"
                                                        :rules="[{ required: true, message: '请填写原因', trigger: ['blur', 'change']}]">
                                                        <el-input type="text"
                                                            v-model="followUpForm[4].follow_reason">

                                                        </el-input>
                                                    </el-form-item>
                                                </div>
                                                <div class="form-item-box">
                                                    <el-form-item v-if="followUpForm[4].follow_result==='6'"
                                                        label="预计开票日期："
                                                        prop="business_datetime"
                                                        :rules="[{ required: true, message: '请选择日期', trigger: ['blur', 'change']}]">
                                                        <el-date-picker v-model="followUpForm[4].business_datetime"
                                                            type="date"
                                                            placeholder="选择日期"
                                                            format="yyyy-MM-dd"
                                                            value-format="timestamp"
                                                            :picker-options="pickerOptionsAfter">
                                                        </el-date-picker>
                                                    </el-form-item>
                                                    <el-form-item v-if="followUpForm[4].follow_result==='6'"
                                                        label="原因："
                                                        prop="follow_reason"
                                                        :rules="[{ required: true, message: '请填写原因', trigger: ['blur', 'change']}]">
                                                        <el-input type="text"
                                                            v-model="followUpForm[4].follow_reason">

                                                        </el-input>
                                                    </el-form-item>
                                                </div>
                                            </div>
                                        </el-form>
                                    </div>
                                    <!-- 6-付款审批
                                    if判断过程 需要满足条件才显示
                                    1、后置返费/成交奖 commissionType全等于'1'
                                    2、有此阶段配置 is_open
                                    3、当前是第6阶段
                                       或者 第五阶段选择1/2
                                       或者 没有第5阶段且第4阶段选择1
                                       或者 没有4、5阶段且第3阶段选择1
                                       或者 没有3、4、5阶段且第2阶段选择1 -->
                                    <div class="step-item-box left-right-layout"
                                        v-if="commissionType === '1' && followUpForm[5].is_open && (currentStage==='6' || followUpForm[4].follow_result==='1'|| followUpForm[4].follow_result==='2' || (followUpForm[3].follow_result==='1' && !followUpForm[4].is_open) || (followUpForm[2].follow_result==='1' && !followUpForm[3].is_open && !followUpForm[4].is_open) || (followUpForm[1].follow_result==='1' && !followUpForm[2].is_open && !followUpForm[3].is_open && !followUpForm[4].is_open))">
                                        <el-form ref="followUpForm5"
                                            :model="followUpForm[5]"
                                            :inline="true">
                                            <div class="step-left">
                                                <el-form-item label="以上成交单「付款审批」："
                                                    prop="follow_result"
                                                    :rules="[{ required: true, message: '请选择当前阶段完成情况', trigger: ['blur', 'change']}]">
                                                    <el-radio-group v-model="followUpForm[5].follow_result">
                                                        <el-radio label="1">合作方审核通过</el-radio>
                                                        <el-radio label="2">合作方审核中</el-radio>
                                                        <el-radio label="3"
                                                            v-if="currentStage==='6'">合作方审批不通过</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>
                                            </div>
                                            <div class="step-right">
                                                <div class="form-item-box">
                                                    <el-form-item v-if="followUpForm[5].follow_result==='1'"
                                                        label="合作方「付款审批」通过日期："
                                                        prop="business_datetime"
                                                        :rules="[{ required: true, message: '请选择日期', trigger: ['blur', 'change']}]">
                                                        <el-date-picker v-model="followUpForm[5].business_datetime"
                                                            type="date"
                                                            placeholder="选择日期"
                                                            format="yyyy-MM-dd"
                                                            value-format="timestamp"
                                                            :picker-options="pickerOptionsBefore">
                                                        </el-date-picker>
                                                    </el-form-item>
                                                </div>
                                                <div class="form-item-box">
                                                    <el-form-item v-if="followUpForm[5].follow_result==='2'"
                                                        label="合作方「付款审批」预计通过日期："
                                                        prop="business_datetime"
                                                        :rules="[{ required: true, message: '请选择日期', trigger: ['blur', 'change']}]">
                                                        <el-date-picker v-model="followUpForm[5].business_datetime"
                                                            type="date"
                                                            placeholder="选择日期"
                                                            format="yyyy-MM-dd"
                                                            value-format="timestamp"
                                                            :picker-options="pickerOptionsAfter">
                                                        </el-date-picker>
                                                    </el-form-item>
                                                </div>
                                                <div class="form-item-box"
                                                    v-if="currentStage==='6'">
                                                    <el-form-item v-if="followUpForm[5].follow_result==='3'"
                                                        label="原因："
                                                        prop="follow_reason"
                                                        :rules="[{ required: true, message: '请填写原因', trigger: ['blur', 'change']}]">
                                                        <el-input type="text"
                                                            v-model="followUpForm[5].follow_reason">
                                                        </el-input>
                                                    </el-form-item>
                                                </div>
                                            </div>
                                        </el-form>
                                    </div>
                                    <!-- 7-等待付款 -->
                                    <!-- if判断过程 需要满足条件才显示
                                       当前是第7阶段
                                       或者 第6阶段选择1
                                       或者 没有第6阶段且第5阶段选择1/2
                                       或者 没有第5、6阶段且第4阶段选择1
                                       或者 没有4、5、6阶段且第3阶段选择1
                                       或者 没有3、4、5、6阶段且第2阶段选择1 -->
                                    <div class="step-item-box left-right-layout"
                                        v-if="currentStage==='7' || followUpForm[5].follow_result==='1'|| ((followUpForm[4].follow_result==='1' || followUpForm[4].follow_result==='2') && !followUpForm[5].is_open) || (followUpForm[3].follow_result==='1' && !followUpForm[4].is_open && !followUpForm[5].is_open) || (followUpForm[2].follow_result==='1' && !followUpForm[3].is_open && !followUpForm[4].is_open && !followUpForm[5].is_open) || (followUpForm[1].follow_result==='1' && !followUpForm[2].is_open && !followUpForm[3].is_open && !followUpForm[4].is_open && !followUpForm[5].is_open) || (commissionType === '2' && followUpForm[1].follow_result==='1')">
                                        <el-form ref="followUpForm6"
                                            :model="followUpForm[6]"
                                            :inline="true">
                                            <div class="step-left">
                                                <el-form-item label="以上成交单「付款进度」："
                                                    prop="follow_result"
                                                    :rules="[{ required: true, message: '请选择当前阶段完成情况', trigger: ['blur', 'change']}]">
                                                    <el-radio-group v-model="followUpForm[6].follow_result">
                                                        <el-radio label="1">已完成全部付款</el-radio>
                                                        <el-radio label="2">等待付款</el-radio>
                                                        <el-radio label="3"
                                                            v-if="currentStage==='7'">付款失败</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>
                                            </div>
                                            <div class="step-right">
                                                <div class="form-item-box">
                                                    <el-form-item v-if="followUpForm[6].follow_result==='1'"
                                                        label="实际付款日期："
                                                        prop="business_datetime"
                                                        :rules="[{ required: true, message: '请选择日期', trigger: ['blur', 'change']}]">
                                                        <el-date-picker v-model="followUpForm[6].business_datetime"
                                                            type="date"
                                                            placeholder="选择日期"
                                                            format="yyyy-MM-dd"
                                                            value-format="timestamp"
                                                            :picker-options="pickerOptionsBefore">
                                                        </el-date-picker>
                                                    </el-form-item>
                                                </div>
                                                <div class="form-item-box">
                                                    <el-form-item v-if="followUpForm[6].follow_result==='2'"
                                                        label="预计回款日期："
                                                        prop="business_datetime"
                                                        :rules="[{ required: true, message: '请选择日期', trigger: ['blur', 'change']}]">
                                                        <el-date-picker v-model="followUpForm[6].business_datetime"
                                                            type="date"
                                                            placeholder="选择日期"
                                                            format="yyyy-MM-dd"
                                                            value-format="timestamp"
                                                            :picker-options="pickerOptionsAfter">
                                                        </el-date-picker>
                                                    </el-form-item>
                                                </div>
                                                <div class="form-item-box"
                                                    v-if="currentStage==='7'">
                                                    <el-form-item v-if="followUpForm[6].follow_result==='3'"
                                                        label="预计回款日期："
                                                        prop="business_datetime"
                                                        :rules="[{ required: true, message: '请选择日期', trigger: ['blur', 'change']}]">
                                                        <el-date-picker v-model="followUpForm[6].business_datetime"
                                                            type="date"
                                                            placeholder="选择日期"
                                                            format="yyyy-MM-dd"
                                                            value-format="timestamp"
                                                            :picker-options="pickerOptionsAfter">
                                                        </el-date-picker>
                                                    </el-form-item>
                                                    <el-form-item v-if="followUpForm[6].follow_result==='3'"
                                                        label="原因："
                                                        prop="follow_reason"
                                                        :rules="[{ required: true, message: '请填写原因', trigger: ['blur', 'change']}]">
                                                        <el-input type="text"
                                                            v-model="followUpForm[6].follow_reason">

                                                        </el-input>
                                                    </el-form-item>
                                                </div>
                                            </div>
                                        </el-form>
                                    </div>
                                    <!-- 回退阶段 -->
                                    <!-- if判断过程 需要满足条件才显示
                                       当前是第3阶段且第三阶段选择2
                                       或者 当前是第3阶段且第3阶段选择2
                                       或者 当前是第4阶段且第4阶段选择3
                                       或者 当前是第5阶段且第5阶段选择3、4、5、6
                                       或者 当前是第6阶段且第6阶段选择3
                                       或者 当前是第7阶段且第7阶段选择3
                                       或者 当前是第8阶段 -->
                                    <div class="follow-back"
                                        v-if="(followUpForm[1].follow_result === '2' && currentStage === '2') || (followUpForm[2].follow_result === '2' && currentStage === '3') || (followUpForm[3].follow_result === '3' && currentStage === '4') || (followUpForm[4].follow_result && followUpForm[4].follow_result !== '1' && followUpForm[4].follow_result !== '2' && currentStage === '5') || (followUpForm[5].follow_result === '3' && currentStage === '6') || (followUpForm[6].follow_result === '3' && currentStage === '7') || currentStage === '8'">
                                        <el-form-item label="选择重置回哪个阶段："
                                            prop="backStage"
                                            :rules="[{ required: true, message: '选择重置回哪个阶段', trigger: ['blur', 'change']}]">
                                            <el-radio-group v-model="followUpOtherForm.backStage">
                                                <!-- 3和5阶段 可选择无需重置 -->
                                                <el-radio label="0">无需重置</el-radio>
                                                <template v-for="(item, index) in moneyBackConfigList">
                                                    <!-- 只能回退到当前阶段之前的阶段 例如当前是第五阶段 只能回退到3、4阶段 -->
                                                    <el-radio :key="item.stage_type"
                                                        v-if="commissionType === '1' && index < currentStage - 1 && item.is_open==='1'"
                                                        :label="item.stage_type">{{item.stage_type}}-{{item.stage_name}}</el-radio>
                                                </template>    
                                                <template v-for="(item, index) in moneyBackConfigList">
                                                    <!-- 只能回退到当前阶段之前的阶段 例如当前是第五阶段 只能回退到3、4阶段 -->
                                                    <el-radio :key="item.stage_type"
                                                        v-if="commissionType === '2' && [1,2,7,8].includes(index + 1) && index < currentStage - 1 && item.is_open==='1'"
                                                        :label="item.stage_type">{{item.stage_type}}-{{item.stage_name}}</el-radio>
                                                </template>
                                                <!-- 每个可以回退的接口选择项，都新增一个业绩确认阶段 -->
                                            </el-radio-group>
                                        </el-form-item>
                                    </div>
                                    <!-- 上传凭证 -->
                                    <div class="step-item-box">
                                        <el-form-item label="本次跟进凭证："
                                            required>
                                            <jl-file-upload v-if="limit"
                                                class="upload-btn"
                                                ref="fileUpload"
                                                fileType="doc,docx,jpg,png,jpeg,gif,xlsx,xls,pdf"
                                                fileMaxSize="10mb"
                                                upID="followUpUpload"
                                                :ossData="ossData"
                                                @beforeUpdate='beforeUpdate'
                                                @getFileURL='getFileURL'>
                                                <el-button type="primary">上传凭证</el-button>
                                            </jl-file-upload>
                                            <span class="upload-tips">可上传图片、excel、word、pdf，上传不超过10个文件，每个附件不超过10M</span>
                                            <div class="file-show-box">
                                                <!-- 文件展示 -->
                                                <ul class="file-list"
                                                    v-if="voucher.fileArr.length > 0">
                                                    <li v-for="(item, index) in voucher.fileArr"
                                                        :key="index">
                                                        <a :href="OSSView + item.fileURL"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            class="preview-file">
                                                        <span>{{item.file_name}}</span></a>
                                                        <el-button type="text"
                                                            @click="delFile('file', index)">删除</el-button>
                                                    </li>
                                                </ul>
                                                <!-- 图片展示 -->
                                                <ul class="img-list clearfix"
                                                    v-if="voucher.imgArr.length > 0">
                                                    <li v-for="(item, index) in voucher.imgArr"
                                                        :key="index">
                                                        <div class="img-item-box">
                                                            <img :src="item.fileURL"
                                                                alt="图片凭证"
                                                                @click="showPreview(item.fileURL)">
                                                        </div>
                                                        <el-button type="text"
                                                            @click="delFile('img', index)">删除</el-button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </el-form-item>
                                    </div>
                                    <!-- 跟进说明 -->
                                    <div class="step-item-box">
                                        <el-form-item class="input-text-box"
                                            label="跟进说明："
                                            prop="explain"
                                            :rules="[{ required: true, message: '请填写跟进说明', trigger: ['blur', 'change']}]">
                                            <el-input type="textarea"
                                                :rows="3"
                                                maxlength="500"
                                                resize="none"
                                                placeholder="请认真填写本次跟进说明"
                                                v-model="followUpOtherForm.explain"></el-input>
                                        </el-form-item>
                                    </div>
                                    <!-- 下次跟进时间 -->
                                    <div class="step-item-box">
                                        <el-form-item label="下次跟进时间："
                                            prop="nextFollowTime"
                                            :rules="[{ required: true, validator: checkNextFollowTime, trigger: ['blur', 'change']}]">
                                            <el-date-picker v-model="followUpOtherForm.nextFollowTime"
                                                type="datetime"
                                                placeholder="选择日期"
                                                format="yyyy-MM-dd HH:mm:ss"
                                                value-format="timestamp"
                                                :picker-options="pickerOptionsLimit">
                                            </el-date-picker>
                                        </el-form-item>
                                    </div>
                                    <!-- 下次跟进人 -->
                                    <div class="step-item-box">
                                        <el-form-item label="下次跟进人："
                                            prop="nextFollowEmployee"
                                            :rules="[{ required: true, message: '请选择下次跟进人', trigger: ['blur', 'change']}]">
                                            <el-select v-model="followUpOtherForm.nextFollowEmployee"
                                                placeholder="请选择">
                                                <el-option v-for="item in followEmployeeSelect"
                                                    :key="item.id"
                                                    :label="item.text"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="step-item-box tips"
                                        v-if="currentStage!=='8'">
                                        <p>跟进规则：</p>
                                        <p v-if="currentStage==='1'">1、以上成交单需在{{completeDatetime}}前完成业绩确认，否则将被标记延迟</p>
                                        <p>{{currentStage==='1'?'2、':''}}在「1-核对业绩」-「7-等待付款」阶段，需要每周发生一次有效跟进（录入系统后主管审核通过）</p>
                                    </div>
                                </el-form>
                                <!-- 提交or取消 -->
                                <div class="btn-area">
                                    <el-button @click="toFundsFollow">取消</el-button>
                                    <el-button type="primary"
                                        @click="submitForm">保存</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
        </div>
        <!-- 图片预览查看器 -->
        <jl-image-preview v-if="photoIsShow"
            :showViewer="photoIsShow"
            :urlList="previewUrl"
            @closeViewer="closeViewer">
        </jl-image-preview>
        <!-- 业绩确认保存后提示弹窗 -->
        <el-dialog title="提示"
            :visible.sync="confirmTipDialog"
            width="350px"
            class="common-dialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            center>
            <div>在成功回款之前回款负责人自行保管好对账单纸质原件，谨防丢失！对账单是超账期未回款订单走诉讼流程的有力凭证</div>
            <span slot="footer"
                class="dialog-footer">
                <el-button type="primary"
                    @click="confirm">知道了</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import { getSign } from '@/api/commonApi';
    import followApi from './api/followApi';
    import FollowUpList from './components/FollowUpList';
    import timeRelated from '@/assets/js/utils/timeRelated';
    import { mapState } from 'vuex';
    export default {
        name: 'edit-follow-up',
        components: {
            FollowUpList
        },
        data() {
            return {
                // 确认提示弹窗，只在业绩确认阶段出现
                confirmTipDialog: false,
                // 图片限制上传数目
                imgLimit: 10,
                loading: '',
                // 组id
                groupId: this.$route.query.groupId,
                // 当前跟进阶段id
                currentStage: '',
                // 当前跟进阶段名称
                currentStageName: '',
                // 目标阶段
                targetStageType: '0',
                // 顶部时间表单
                followTimeForm: {
                    // 实际跟进时间
                    actualTime: Date.parse(new Date()),
                    // 预计回款时间
                    estimateTime: ''
                },
                // 其他表单
                followUpOtherForm: {
                    // 回退阶段id
                    backStage: '',
                    // 下次跟进时间
                    nextFollowTime: '',
                    // 下次跟进人
                    nextFollowEmployee: '',
                    // 跟进说明
                    explain: ''
                },
                // 上传凭证
                voucher: {
                    fileArr: [],
                    imgArr: []
                },
                // 表单阶段
                followUpForm: [],
                // 存储文件地址
                uploadUrl: 'followUp',
                // oss配置
                ossData: {},
                // 图片预览
                photoIsShow: false,
                // 图片预览的url
                previewUrl: [],
                // 文件限制数量 根据已上传数量会变化
                limit: 10,
                // 跟进规则内的完成时间
                completeDatetime: '',
                // 跟进人列表
                followEmployeeSelect: [],
                // 回款配置列表
                moneyBackConfigList: [],
                // 登录人信息
                userInfoObj: {},
                // 下次跟进最晚时间
                nextFollowDatetimeMax: '',
                // 获取回款类型 1后置返费、成交奖 2前置电商
                commissionType: '',
                // 重复提交
                isSubmit: true,
                // 可选择今天及之前的日期
                pickerOptionsBefore: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                // 可选择今天及之后的日期
                pickerOptionsAfter: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                // 下次跟进时间范围
                pickerOptionsLimit: {
                    disabledDate: ''
                }
            };
        },
        created() {
            // 回款类型 可能存在多个 ，隔开  1前置电商 2 后置返费 3 成交奖
            this.commissionType = this.$route.query.commissionType.indexOf('1') === -1 ? '1' : '2';
            // 初始化数据
            this.$nextTick(() => {
                this.initData();
            });
        },
        methods: {
            /**
             * 获取输入内容改变方法
             * @param {Object} rule 校验规则
             * @param {string} value 值
             * @param {Funcion} callback 回调函数
             */
            checkImg(rule, value, callback) {
                if ((value.img && value.img.length > 0) || (value.file && value.file.length > 0)) {
                    callback()
                } else {
                    callback(new Error('请上传业绩确认单'));
                }
            },
            /**
             * @description: 删除图片
             * @param {Array} list 图片数组 
             * @param {Number} index 索引
             */
            delImg(list, index) {
                list.splice(index, 1);
                this.imgLimit++;
                // 发起校验
                this.$refs['followUpForm0'].validateField('imgList');
            },
            /**
             * @description: 获取业绩确认单图片
             * @param {String} fileList 文件列表
             * @param {Object} arr 文件对象
             */
            getFileURLMethod(fileList, arr) {
                // 关闭加载loading
                this.loading.close();
                // 如果返回文件列表长度为0
                if (fileList.length === 0) {
                    this.$message('上传失败,请重新上传');
                    return;
                }
                // 是否弹出重复上传标志
                let repeatFlag = false;
                for (let i = 0; i < fileList.length; i++) {
                    // 检查是否是pdf格式
                    let fileType = fileList[i].extension.toLowerCase() === 'pdf';
                    // 判断pdf或者是图片是否有重复上传的
                    let flag = false;
                    if (fileType) {
                        // 如果是pdf，则只需要判断filelist里面是否有重复，不需要判断imglist
                        flag = arr.file.some(item => item.file_name === fileList[i].originName);
                    } else {
                        flag = arr.img.some(item => item.file_name === fileList[i].originName);
                    }
                    // 判断是否有重复
                    if (flag) {
                        repeatFlag = true;
                    } else {
                        let obj = {
                            file_name: fileList[i].originName,
                            file_url: fileList[i].upURL,
                            file_path_full: fileList[i].fileURL,
                            file_type: '1'
                        };
                        if (fileType) {
                            obj.file_type = '2';
                            arr.file.push(obj);
                        } else {
                            arr.img.push(obj);
                        }
                        this.imgLimit--;
                    }
                }
                if (repeatFlag) {
                    this.$message('无法上传重复的业绩确认单');
                }
                // 发起校验
                this.$refs['followUpForm0'].validateField('imgList');
            },
            /**
             * 下次跟进时间范围
             * @param {String} time 选择时间
             * @return
             */
            disabledDate(time) {
                return time.getTime() > this.nextFollowDatetimeMax || time.getTime() < Date.now() - 8.64e7;
            },
            /**
             * 校验下次跟进时间
             * @param {String} rule 规则
             * @param {String} value 校验值
             * @param {String} callback 回调
             * @return
             */
            checkNextFollowTime(rule, value, callback) {
                if (!value) {
                    return callback(new Error('请选择下次跟进时间'));
                }
                let targetTime = timeRelated.filterDate(this.nextFollowDatetimeMax, 'YYYY-MM-DD HH:mm:ss');
                if (value > this.nextFollowDatetimeMax) {
                    this.followUpOtherForm.nextFollowTime = this.nextFollowDatetimeMax;
                    this.$message(`截止时间为${targetTime}`);
                    return callback(new Error(`可选择现在-${targetTime}的时间`));
                } else if (value < Date.parse(new Date())) {
                    this.followUpOtherForm.nextFollowTime = Date.parse(new Date());
                    this.$message(`不能选择之前的时间`);
                    return callback(new Error(`不能选择之前的时间`));
                }
                callback();
            },
            /**
             * 图片预览
             * @param {String} previewUrl 预览图片url
             * @return
             */
            showPreview(previewUrl) {
                this.photoIsShow = true;
                this.previewUrl = [previewUrl];
            },
            // 关闭大图预览
            closeViewer() {
                this.photoIsShow = false;
                this.previewUrl = [];
            },
            // 初始化数据
            async initData() {
                this.beforeUpdate();
                let params = {
                    group_id: this.groupId
                };
                try {
                    let { data } = await followApi.initFollow(params);
                    if (data.code === 0) {
                        this.currentStage = data.data.stage_type;
                        this.currentStageName = data.data.stage_type_name;
                        this.completeDatetime = data.data.complete_datetime;
                        this.followEmployeeSelect = data.data.follow_employee_select;
                        this.moneyBackConfigList = data.data.money_back_config;
                        this.nextFollowDatetimeMax = data.data.next_follow_datetime_max * 1000;
                        this.followUpOtherForm.nextFollowTime = data.data.next_follow_datetime_def ? data.data.next_follow_datetime_def * 1000 : '';
                        // 如果当前为佣金核对阶段，需要给重置回业绩确认阶段选项默认选中否
                        if (this.currentStage === '2') {
                            this.followUpOtherForm.backStage = '0';
                        }
                        let followUpFormArr = [];
                        data.data.money_back_config.forEach((item, index) => {
                            let currentObj = {
                                is_open: item.is_open === '1' ? 1 : 0,
                                follow_stage_type: item.stage_type,
                                follow_result: index < 3 ? '2' : '',
                                file_type: '',
                                business_datetime: '',
                                follow_reason: ''
                            };
                            // 在业绩确认阶段，有imgList字段
                            if (this.currentStage === '1') {
                                currentObj.imgList = {
                                    img: [],
                                    file: []
                                }
                            }
                            followUpFormArr.push(currentObj);
                        });
                        this.followUpForm = followUpFormArr;
                        // 下次跟进时间范围
                        this.pickerOptionsLimit.disabledDate = this.disabledDate;
                        this.loading.close();
                        // 获取阿里云签名
                        this.getSignCode();
                    }
                } catch (error) {
                    console.log(error);
                    this.loading.close();
                }
            },
            // 获取阿里云上传签名
            async getSignCode() {
                let params = {
                    cate: this.uploadUrl
                };
                try {
                    let { data } = await getSign(params);
                    if (data.code === 0) {
                        this.ossData = data.data;
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 上传之前
            beforeUpdate() {
                this.loading = this.$loading({
                    lock: true,
                    text: '请求中，请稍后',
                    spinner: 'el-icon-loading',
                    customClass: 'loading-default-box',
                    background: 'rgba(255, 255, 255, 0.8)'
                });
            },
            /**
             * 获取文件
             * @param {String} fileList 文件列表
             * @return
             */
            getFileURL(fileList) {
                // 关闭加载loading
                this.loading.close();
                // 如果返回文件列表长度为0
                if (fileList.length === 0) {
                    this.$message('上传失败,请重新上传');
                    return;
                }
                let imgType = 'jpg,png,jpeg,gif,GIF,JPG,PNG,JPEG';
                // this.limit = this.limit - fileList.length;
                let obj = {
                    file_name: fileList[0].originName,
                    file_url: fileList[0].upURL,
                    fileURL: fileList[0].fileURL
                };
                // 判断是否是图片
                if (imgType.indexOf(fileList[0].originName.substr(fileList[0].originName.lastIndexOf('.') + 1)) !== -1) {
                    obj.file_type = '1';
                    // 判断是否有重复
                    if (this.voucher.imgArr.some(item => item.file_name === fileList[0].originName)) {
                        this.$message('无法上传重复的凭证');
                    } else {
                        obj.file_type = '1';
                        this.voucher.imgArr.push(obj);
                        this.limit--;
                    }
                } else {
                    if (this.voucher.fileArr.some(item => item.file_name === fileList[0].originName)) {
                        this.$message('无法上传重复的凭证');
                    } else {
                        obj.file_type = '2';
                        this.voucher.fileArr.push(obj);
                        this.limit--;
                    }
                }
            },
            /**
             * 删除文件
             * @param {String} type 文件类型
             * @param {String} index 文件下标
             * @return
             */
            delFile(type, index) {
                this.limit++;
                if (type == 'file') {
                    this.voucher.fileArr.splice(index, 1);
                } else {
                    this.voucher.imgArr.splice(index, 1);
                }
            },
            // 提交前验证回款阶段表单
            beforeSubmitSevenFollow() {
                return new Promise((resolve) => {
                    let validateResArr = [];
                    this.followUpForm.forEach(async (key, index) => {
                        if (this.$refs[`followUpForm${index}`]) {
                            try {
                                await this.$refs[`followUpForm${index}`].validate();
                                validateResArr.push(1);
                                // 如果7个阶段校验完 返回结果
                                if (validateResArr.length === 7) {
                                    let res = validateResArr.every(item => item === 1);
                                    return resolve(res);
                                }
                            } catch (error) {
                                validateResArr.push(0);
                                if (validateResArr.length === 7) {
                                    let res = validateResArr.every(item => item === 1);
                                    return resolve(res);
                                }
                            }
                        } else {
                            validateResArr.push(1);
                            if (validateResArr.length === 7) {
                                let res = validateResArr.every(item => item === 1);
                                return resolve(res);
                            }
                        }
                    });
                });
            },
            // 提交前验证 回款阶段外其他表单
            beforeSubmitOtherFollow() {
                return new Promise(async (resolve) => {
                    try {
                        await this.$refs['followTimeForm'].validate();
                        await this.$refs['followUpOtherForm'].validate();
                        return resolve(true);
                    } catch (error) {
                        return resolve(error);
                    }
                });
            },
            // 提交
            async submitForm() {
                // 提交前验证
                let sevenFollowRes = await this.beforeSubmitSevenFollow();
                let otherFollowRes = await this.beforeSubmitOtherFollow();
                if (!sevenFollowRes || !otherFollowRes) {
                    this.$message('必填字段未填写，无法提交');
                    return;
                } else if (this.voucher.fileArr.length + this.voucher.imgArr.length === 0) {
                    this.$message('请上传跟进凭证');
                    return;
                } else if (!this.$refs.followUpList.getFollowMoneyTotalFlag()) {
                    this.$message('本次跟进金额合计不能大于单笔剩余回款金额合计，请修改后提交');
                    return;
                }
                let detailList = this.$refs.followUpList.getMoneyDetailList();
                if (detailList.list && Array.isArray(detailList.list)) {
                    let isLarger = detailList.list.some((item) => {
                        return item.follow_money <= 0
                    });
                    // 判断是否大于0
                    if (isLarger) {
                        this.$message('跟进金额必须＞0');
                        return;
                    }
                }
                // 判断如果目标阶段小于当前阶段，则重置有效
                if (this.targetStageType >= this.currentStage) {
                    this.followUpOtherForm.backStage = '0';
                }
                // 重复提交
                if (this.isSubmit) {
                    this.isSubmit = false;
                    this.beforeUpdate();
                    let params = {
                        group_id: this.groupId,
                        follow_datetime: this.followTimeForm.actualTime,
                        plan_pay_datetime: this.followTimeForm.estimateTime,
                        employee_id: this.userInfoObj.id,
                        follow_text: this.followUpOtherForm.explain,
                        next_follow_datetime: this.followUpOtherForm.nextFollowTime,
                        next_employee_id: this.followUpOtherForm.nextFollowEmployee,
                        start_stage_type: this.currentStage,
                        back_stage_type: this.followUpOtherForm.backStage,
                        target_stage_type: this.targetStageType,
                        money: this.$refs.followUpList.getMoneyList(),
                        detail_list: detailList,
                        move: this.$refs.followUpList.getRemoveList(),
                        is_front: this.$route.query.commissionType.indexOf('1') === -1 ? '2' : '1'
                    };
                    // 文件参数
                    params.file = this.voucher.imgArr.concat(this.voucher.fileArr);
                    // 业绩确认单图片
                    let arr= [];
                    if (this.followUpForm[0].imgList) {
                        arr = [...this.followUpForm[0].imgList.img, ...this.followUpForm[0].imgList.file];
                    }
                    params.confirm_file = arr;
                    // 阶段参数
                    let stageTypeList = [];
                    this.followUpForm.forEach((item, index) => {
                        if (item.is_open && this.$refs[`followUpForm${index}`]) {
                            stageTypeList.push(item);
                        }
                    });
                    if (this.currentStage === '8') {
                        stageTypeList = [{
                            follow_stage_type: '8',
                            follow_result: '',
                            file_type: '',
                            business_datetime: '',
                            follow_reason: ''
                        }]
                    }
                    params.stage_type_list = stageTypeList;
                    try {
                        let { data } = await followApi.addFollow(params);
                        if (data.code === 0) {
                            // 在业绩确认阶段，并且当以上成交单业绩是否确认=是，弹出弹窗
                            if (this.currentStage === '1' && this.followUpForm[0].follow_result === '1') {
                                this.confirmTipDialog = true;
                            } else {
                                // 跳转跟进列表页面
                                this.toFundsFollow();
                            }
                            this.isSubmit = true;
                            this.loading.close();
                        } else {
                            this.$message(data.msg);
                            this.isSubmit = true;
                            this.loading.close();
                        }
                    } catch (error) {
                        console.log(error);
                        this.isSubmit = true;
                        this.loading.close();
                    }
                }
            },
            // 弹窗确认按钮
            confirm() {
                this.confirmTipDialog = false;
                // 跳转跟进列表页面
                this.toFundsFollow();
            },
            // 点击取消 返回跟进列表页面
            toFundsFollow() {
                this.$router.push({
                    path: '/fundsBack/fundsFollow',
                    query: {
                        tab: 'list'
                    }
                });
            },
            /**
             * @description: 找当前模板最后一个选是的阶段值
             * @param {Number} index 当前改变的阶段值索引
             */
            matchType(index) {
                let res = null;
                for (let i = index; i > 0; i--) {
                    if (this.followUpForm[i].is_open === 1 && this.followUpForm[i].follow_result === '1') {
                        res = this.followUpForm[i].follow_stage_type;
                        break;
                    }
                }
                return res;
            }
        },
        computed: {
            ...mapState({
                userInfo: state => state.userInfo
            }),
            // 创建临时数据，利用computed有缓存的属性，监听followUpForm数据的变化
            tempFollowUpForm() {
                var newFollowUpForm = [];
                this.followUpForm.forEach((item) => {
                    newFollowUpForm.push(JSON.parse(JSON.stringify(item)));
                });
                return newFollowUpForm;
            },
            // 判断业绩确认文件数组
            imgListLenFlag() {
                let {imgList} = this.followUpForm[0];
                if (!imgList) {
                    return false;
                }
                if ((imgList.file && imgList.file.length) || (imgList.img && imgList.img.length)) {
                    return true;
                }
                return false;
            }
        },
        watch: {
            tempFollowUpForm: {
                handler(newVal, oldVal) {
                    // 声明变化的阶段
                    let changeIndex = -1;
                    newVal.forEach((item, index) => {
                        // 如果follow_result有值且新老值不一致，且（如果变化的是2、3 阶段 则必须当前阶段显示，否则可能是重置引起的）
                        if (item.follow_result && oldVal[index] && item.follow_result !== oldVal[index].follow_result && ((index === 1 && (newVal[0].follow_result === '1' || this.currentStage === '2')) || (index === 2 && (newVal[1].follow_result === '1' || this.currentStage === '3')) || (index !== 1 && index !== 2))) {
                            changeIndex = index;
                            // 如果变化的阶段选择是 则此阶段就是目标阶段 否则就是前一个显示的阶段，第五阶段的前两个选项为是，剩下几个为否
                            if (item.follow_result === '1' || (index === 4 && item.follow_result === '2')) {
                                this.targetStageType = item.follow_stage_type;
                            } else if (String(index + 1) === this.currentStage && !(item.follow_result === '1' || (index === 4 && item.follow_result === '2'))) {
                                // 当前变化阶段第一个选项就选择了fou，则直接赋值为0
                                this.targetStageType = '0';
                            } else {
                                // 往上找，最后一个选了是的阶段
                                // 循环查找当前变化阶段的上一个is_open为1的阶段值（is_open=1，代表配置了这个阶段）
                                let type = this.matchType(index);
                                if (type !== null) {
                                    this.targetStageType = type;
                                }
                            }
                        }
                        // 确定了变化的阶段后将后续阶段（包括变化阶段）数据初始化（因为会把2、3阶段结果初始化成否，也会触发watch监听的这个方法，所以才会有上面的判断）
                        if (changeIndex >= 0) {
                            let newObj = {
                                is_open: item.is_open,
                                follow_stage_type: item.follow_stage_type,
                                follow_result: index < 3 ? '2' : '',
                                file_type: '',
                                business_datetime: '',
                                follow_reason: ''
                            };
                            if (this.currentStage === '1') {
                                // 如果是第一阶段，还需要添加字段imgList
                                newObj.imgList = {
                                    img: [],
                                    file: []
                                }
                                this.imgLimit = 10;
                            }
                            // 变化阶段的follow_result不能初始化 还要用选中的值
                            if (changeIndex === index) {
                                newObj.follow_result = item.follow_result;
                            }
                            this.$set(this.followUpForm, index, newObj);
                        }
                    });
                },
                deep: true,
                immediate: true
            },
            // 监听当前登录人信息
            userInfo: {
                deep: true,
                handler: function(val) {
                    this.userInfoObj = {
                        id: val.uid,
                        text: val.employeeName + '_' + val.job_number
                    };
                    this.followUpOtherForm.nextFollowEmployee = String(val.uid);
                }
            }
        }
    };
</script>


<style lang="less" scoped>
.img-list-box {
    margin-top: 16px;
    .img-box {
        border: 1px solid #ccc;
        & > img {
            width: 60px;
            height: 60px;
            object-fit: contain;
        }
    }
    .btn-del {
        text-align: center;
        & > span {
            color: #409eff;
            line-height: 32px;
        }
    }
    .img-item {
        display: inline-block;
        margin-right: 16px;
        &:last-of-type {
            margin-right: 0;
        }
        .file-name {
            color: #00f;
            text-decoration: underline;
        }
        .btn-del {
            margin-left: 10px;
            color: #409eff;
            cursor: pointer;
        }
    }
}
.file-box-wrapper {
    line-height: 24px;
}
.img-box-wrapper {
    margin-top: 10px;
}
.edit-follow-up-box {
    .content-box {
        background: #fff;
        padding: 0 30px 30px;
    }
    .bread-crumb-box {
        padding: 0 30px;
    }
}
.group-table-box {
    h2 {
        line-height: 60px;
        .group-id{
            font-size: 14px;
            padding-left: 40px;
        }
    }
    .header-box {
        /deep/.tips {
            float: right;
            .el-form-item__content {
                font-size: 12px;
            }
        }
    }
}
.follow-up-box {
    margin-top: 24px;
    .el-form-item {
        margin-right: 30px;
    }
    .form-item-children {
        margin-left: 490px;
    }
    /deep/.left-right-layout {
        margin-bottom: 30px;
        .el-form {
            display: flex;
            justify-content: left;
        }
        .step-left {
            width: 490px;
            .el-radio-group {
                .el-radio {
                    display: block;
                    line-height: 40px;
                }
            }
        }
        .step-right {
            .el-form-item {
                margin: 0;
            }
            .form-item-box {
                height: 40px;
            }
            .img-form-item-box {
                margin-top: 20px;
                height: auto;
            }
        }
    }
}
.file-show-box {
    .file-list {
        .preview-file {
            color: #00f;
            text-decoration: underline;
            margin: 0 10px;
        }
    }
    .img-list {
        margin-top: 16px;
        li {
            float: left;
            width: 100px;
            height: 130px;
            text-align: center;
            margin-right: 12px;
            .img-item-box {
                width: 100%;
                height: 100px;
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid #eee;
                img {
                    max-width: 100%;
                    max-height: 100%;
                }
            }
        }
    }
}
/deep/.input-text-box {
    .el-form-item__content {
        width: 500px;
    }
}
.upload-btn {
    display: inline-block;
    margin-right: 20px;
}
.upload-tips {
    color: #888;
}
.tips {
    color: #fc0d1b;
}
</style>