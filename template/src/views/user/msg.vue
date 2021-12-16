<template>
  <div>
    <!-- 筛选条件 start -->
    <idss-widget :main-style="{ padding: '15px' }">
      <idss-collapse
        title="筛选条件"
        :is-button-show="false"
        :collapse="false"
        is-arrow-show
      >
        <el-form :model="form" class="idss-pannel" plain size="small">
          <el-row :gutter="20">
            <el-col :span="5">
              <el-form-item label="标题：" label-width="80px">
                <el-input v-model="form.title"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="发送源：" label-width="80px">
                <el-select v-model="form.sendType">
                  <el-option
                    v-for="src in messageSourceList"
                    :key="src.key"
                    :value="src.key"
                    :label="src.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="消息类型：" label-width="90px">
                <el-select v-model="form.messageType">
                  <el-option
                    v-for="type in messageTypeList"
                    :key="type.key"
                    :value="type.key"
                    :label="type.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="状态：" label-width="80px">
                <el-select v-model="form.status">
                  <el-option
                    v-for="status in statusList"
                    :key="status.key"
                    :value="status.key"
                    :label="status.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="时间：" label-width="80px">
                <idss-time-select
                  :time.sync="time"
                  style="width: 100%"
                ></idss-time-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="idss-txt--center">
            <el-button custom size="medium" type="primary" @click="submit"
              >查询</el-button
            >
          </el-row>
        </el-form>
      </idss-collapse>
    </idss-widget>
    <!-- 筛选条件 end -->
    <!-- 消息列表 start -->
    <idss-widget
      header-type="plain-border"
      :header-style="{ padding: '0 15px' }"
      :main-style="{ padding: '15px 15px 0' }"
      :footer-style="{ padding: '6px 0' }"
    >
      <template slot="title-left">消息列表</template>
      <template slot="title-right">
        <button class="idss-button-text" @click="markAsRead">
          <idss-icon-svg name="survey"></idss-icon-svg>
          <span>标记为已读</span>
        </button>
      </template>
      <el-table
        ref="msgTable"
        v-loading="loading['message']"
        border
        stripe
        empty="暂无数据"
        :data="msg.data"
        @selection-change="selectionChange"
        @sort-change="msgTableChange"
      >
        <el-table-column
          type="selection"
          width="40"
          align="center"
          :selectable="(row) => row.status === 'unread_msg'"
        ></el-table-column>
        <el-table-column type="expand" width="15">
          <template v-slot="{ row }">
            <idss-tooltip :content="row.text" :over-width-display="true">
              <div class="idss-msg__sub-content">{{ row.text }}</div>
            </idss-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="title"
          label="标题"
          show-overflow-tooltip
        >
          <template v-slot="{ row }">
            <div class="idss-msg__title">
              <span
                v-if="row.status === 'unread_msg'"
                class="unread-flag"
              ></span>
              <strong>{{ row.title }}</strong>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="sendTime" label="发送时间">
          <template v-slot="{ row }">{{ row.sendTime | formatDate }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="messageType"
          label="消息类型"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="sendType"
          label="发送源"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="mailReceiver"
          label="邮件接收人"
        ></el-table-column>
      </el-table>
      <template slot="footer">
        <idss-pagination
          :table-data="msg"
          padding="10px"
          @page-change="msgTableChange"
          @size-change="msgTableChange"
        ></idss-pagination>
      </template>
    </idss-widget>
    <!-- 消息列表 end -->
  </div>
</template>
<script>
import globalMixins from "@/mixins/globalMixins";
import service from "./MsgService";

export default {
  name: "UserMsg",
  mixins: [globalMixins, service],
  data() {
    return {
      statusList: [],
      messageSourceList: [],
      messageTypeList: [],
      form: {
        title: "", // 标题
        sendType: "", // 发送源
        messageType: "", // 消息类型
        status: "unread_msg",
      },
      time: {
        timeFlag: 1,
        startTime: "",
        endTime: "",
        timeInterval: "",
        timeUnit: "",
      },
      // 表格数据
      msg: {
        data: [],
      },
      // selection: []  // 选中项
    };
  },
  created() {
    // 默认：未读消息列表请求
    // this.init('init')
  },
  methods: {
    /**
     * 消息表格页码、条数切换
     */
    msgTableChange(params) {
      this.tableChange(params, this.msg, this.getMessageDefault);
    },

    /**
     * 选中项发生变化
     */
    selectionChange(selection) {
      this.selection = selection;
    },

    /**
     * 将选中项中的未读项发送到后台标记为已读
     */
    async markAsRead() {
      if (!this.selection || (this.selection && !this.selection.length)) {
        this.showMessage("请选择一条或多条消息", "warning");
      } else {
        await this.markAsReadReq(this.selection);
        await this.submit();
      }
    },

    /**
     * 根据条件请求消息列表
     */
    submit() {
      this.init("submit");
    },

    /**
     * 初始化方法
     */
    init(type = "refresh") {
      this.getStatusListData();
      this.getMessageSourceListData();
      this.getMessageTypeList();
      this.tableChange({ type: type }, this.msg, this.getMessageDefault);
    },
  },
};
</script>

<style scoped>
.idss-msg__title {
  position: relative;
  padding-left: 12px;

  & > strong {
    font-weight: bold;
  }
  & .unread-flag {
    position: absolute;
    top: 8px;
    left: 0;
    width: 6px;
    height: 6px;
    border-radius: 4px;
    background-color: var(--color-primary);
  }
}
.idss-msg__sub-content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
