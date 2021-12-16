const API = {
  // 未读消息数量请求
  MSG_UNREAD_COUNT: {
    url: "/gov/api/sys/ga-messages",
    method: "get",
  },
  // 实时消息请求
  MSG_CHECK_NOTIFY(id) {
    return {
      url: `/gov/api/sys/ga-messages/${id}`,
      method: "get",
      tag: "notify",
    };
  },
};

export default {
  methods: {
    // 未读消息数请求
    async msgUnreadCountReq() {
      let result = await this.$request({
        ...API.MSG_UNREAD_COUNT,
      });
      this.unreadMsgCount = result && result.total;
      this.$emit("unreadMsgCount", this.unreadMsgCount);
    },
    // 实时消息请求
    async notifyCheckReq() {
      let result = await this.$request({
        ...API.MSG_CHECK_NOTIFY(this.msgId),
      });
      this.notifyData = result;
    },
  },
};
