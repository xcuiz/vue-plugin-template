<template>
  <div v-loading="loading['global-container']">
    <!-- 筛选条件 start -->
    <el-row>
      <idss-widget :main-style="{ padding: '15px' }">
        <idss-collapse
          title="筛选条件"
          :is-button-show="false"
          :collapse="false"
          is-arrow-show
        >
          <el-form
            :model="formData"
            plain
            size="small"
            label-width="120px"
            @keyup.enter.native="search"
          >
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="任务名称：" label-width="90px">
                  <el-input
                    v-model.trim="formData.taskName"
                    placeholder="请输入任务名称"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="时间：" label-width="60px">
                  <idss-time-select
                    :time.sync="globalTime"
                    style="width: 100%"
                  ></idss-time-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="任务状态：" label-width="90px">
                  <el-radio-group v-model="formData.taskStatus">
                    <el-radio label="0">全部</el-radio>
                    <el-radio label="1">进行中</el-radio>
                    <el-radio label="2">已完成</el-radio>
                    <el-radio label="3">失败</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="idss-txt--center">
              <el-button size="medium" type="primary" @click="search"
                >查询</el-button
              >
              <el-button size="medium" @click="reset">重置</el-button>
            </el-row>
          </el-form>
        </idss-collapse>
      </idss-widget>
    </el-row>
    <!-- 筛选条件 end -->
    <!-- 下载任务列表 start -->
    <el-row>
      <idss-widget
        :header-style="{ padding: '10px 15px' }"
        :footer-style="{ padding: '6px 0' }"
      >
        <template slot="title-left">下载任务列表</template>
        <template slot="title-right">
          <el-button
            size="medium"
            :type="selectedData && selectedData.length ? 'danger' : ''"
            icon="el-icon-close"
            :disabled="!(selectedData && selectedData.length)"
            plain
            custom
            @click="remove(selectedData)"
            >删除</el-button
          >
        </template>
        <el-table
          v-loading="loading['table-list']"
          border
          stripe
          :max-height="710"
          :data="tableListData.data"
          @selection-change="selectionChange"
        >
          <el-table-column
            type="selection"
            :selectable="(row) => row.taskStatus !== '1'"
            width="40"
            align="center"
          ></el-table-column>
          <el-table-column
            type="index"
            align="center"
            width="50"
            label="序号"
          ></el-table-column>
          <el-table-column
            prop="taskName"
            label="任务名称"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column
            prop="taskPeriod"
            label="数据统计周期"
            show-overflow-tooltip
            align="center"
            width="320"
          ></el-table-column>
          <el-table-column
            prop="createDate"
            label="创建时间"
            show-overflow-tooltip
            align="center"
            width="160"
          ></el-table-column>
          <el-table-column
            prop="finishedTime"
            label="完成时间"
            show-overflow-tooltip
            align="center"
            width="160"
          ></el-table-column>
          <el-table-column
            prop="taskStatus"
            label="任务状态"
            align="center"
            width="140px"
          >
            <template slot-scope="scope">{{
              changeStr(scope.row.taskStatus)
            }}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="130px">
            <template slot-scope="scope">
              <el-button
                plain
                micro
                size="mini"
                :disabled="
                  (scope.row.taskStatus !== '2' &&
                    scope.row.taskStatus !== '4') ||
                  scope.row.flag
                "
                @click="download(scope.row)"
                >下载</el-button
              >
              <el-button
                size="mini"
                plain
                micro
                :disabled="scope.row.taskStatus === '1'"
                @click="remove([scope.row.id])"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <template slot="footer">
          <idss-pagination
            :table-data="tableListData"
            @page-change="tableListChange"
            @size-change="tableListChange"
          ></idss-pagination>
        </template>
      </idss-widget>
    </el-row>
    <!-- 下载任务列表 end -->
  </div>
</template>
<script>
import globalMixins from "@/mixins/globalMixins";
import service from "./download-center-service.js";
import download from "@/util/download.js";
export default {
  name: "UserDownloadCenter",
  mixins: [globalMixins, service],
  data() {
    return {
      formData: {
        taskStatus: "0", // 否 string “0”代表“全部”,“1”代表“进行中”，“2”代表“已完成”，“3”代表“失败”，“4”代表“已失效”，
        taskName: "", // 否 string 任务名称，采用全模糊匹配 %taskName%
      },
      globalTime: {
        timeFlag: 3, // 日历时间标识 1:无 2:固定时间 3:相对时间
        startTime: +new Date() - 30 * 24 * 3600 * 1000, // 开始时间（时间标识为2时，其他为空）
        endTime: +new Date(), // 结束时间（时间标识为2时，其他为空）
        timeInterval: 30, // 间隔（时间标识为3时，其他为空）
        timeUnit: "d",
      },
      // 表格数据
      tableListData: {
        data: [],
      },
      selectedData: [], // 选中项
      isDisabled: false,
    };
  },
  created() {
    // this.init({ type: 'init' })
  },
  methods: {
    // 状态转换
    changeStr(param) {
      // 状态 '4' 实质代表 已失效【链接无文件时的状态】，其值不能从数据库中取值。
      let strMap = new Map([
        ["0", "全部"],
        ["1", "进行中"],
        ["2", "已完成"],
        ["3", "失败"],
        ["4", "已完成"],
      ]);
      return strMap.get(param);
    },
    // 消息表格页码、条数切换
    tableListChange(params) {
      this.tableChange(params, this.tableListData, this.getTableListData);
    },
    // 选中项发生变化
    selectionChange(val) {
      this.selectedData = val.map((item) => item.id);
    },
    // 根据条件请求消息列表
    search() {
      this.init("submit");
    },
    // 重置
    reset() {
      this.formData.taskStatus = "0";
      this.formData.taskName = "";
      this.globalTime = Object.assign(
        {},
        {
          timeFlag: 3, // 日历时间标识 1:无 2:固定时间 3:相对时间
          startTime: +new Date() - 30 * 24 * 3600 * 1000, // 开始时间（时间标识为2时，其他为空）
          endTime: +new Date(), // 结束时间（时间标识为2时，其他为空）
          timeInterval: 30, // 间隔（时间标识为3时，其他为空）
          timeUnit: "d",
        }
      );
    },
    // 删除
    async remove(selectedData) {
      if (!selectedData.length) {
        this.showMessage("请选择需要删除的数据", "warning");
        return;
      }
      this.confirmBox({ message: "要删除选中的数据吗？" }).then(async () => {
        await this.deleteTableListData(selectedData);
        this.tableChange(
          { type: "submit" },
          this.tableListData,
          this.getTableListData
        );
      });
    },
    // 下载
    download(params) {
      let { fileName = "" } = params;
      if (!fileName) {
        return this.showMessage("暂无可导出数据！", "warning");
      }
      // 当下载链接无文件时进行提示
      if (params.taskStatus === "4") {
        return this.showMessage("此文件失效！", "warning");
      }
      params.flag = true;
      download(fileName);
      this.tableChange(
        { type: "refresh" },
        this.tableListData,
        this.getTableListData
      );
    },
    // 初始化方法
    init(params = { type: "refresh" }) {
      this.tableChange(params, this.tableListData, this.getTableListData);
    },
  },
};
</script>
