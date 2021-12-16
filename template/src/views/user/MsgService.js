const API = {
  // 状态列表
  STATUS_LIST: {
    url: "/gov/api/argus-common/dict/message-status",
    method: "get",
  },
  // 发送源
  MESSAGE_SOURCE_LIST: {
    url: "/gov/api/argus-common/dict/message-source",
    method: "get",
  },
  // 消息类型
  MESSAGE_TYPE_LIST: {
    url: "/gov/api/argus-common/dict/message-type",
    method: "get",
  },
  // 默认消息列表请求
  MSG_LIST_DEFAULT: {
    url: "/gov/api/sys/ga-messages/list/query",
    method: "post",
    tag: "message",
  },
  // 标记为已读
  MSG_AS_READ: {
    url: "/gov/api/sys/ga-messages",
    method: "put",
    tag: "message",
  },
};

export default {
  methods: {
    async getStatusListData() {
      const content = await this.$request({
        ...API.STATUS_LIST,
      });
      content.unshift({
        key: "",
        value: "全部",
      });
      this.statusList = content;
    },
    async getMessageSourceListData() {
      const content = await this.$request({
        ...API.MESSAGE_SOURCE_LIST,
      });
      content.unshift({
        key: "",
        value: "全部",
      });
      this.messageSourceList = content;
    },
    async getMessageTypeList() {
      const content = await this.$request({
        ...API.MESSAGE_TYPE_LIST,
      });
      content.unshift({
        key: "",
        value: "全部",
      });
      this.messageTypeList = content;
    },
    // 详细列表请求
    async getMessageDefault() {
      let content = await this.requestTable({
        ...API.MSG_LIST_DEFAULT,
        currentObj: this.msg,
        params: {
          ...this.form,
          ...this.time,
        },
      });
      this.msg = Object.assign({}, content);
    },
    // 标记为已读
    async markAsReadReq(selection) {
      let ids = selection.map((row) => row.id);
      await this.$request({
        ...API.MSG_AS_READ,
        data: ids,
      });
      this.showMessage("已将选中的消息全部标记为已读");
    },
  },
};
