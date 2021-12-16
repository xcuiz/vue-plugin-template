<template>
  <!-- 单个消息提示弹框 start -->
  <el-dialog
    :close-on-click-modal="false"
    custom
    width="54%"
    :visible.sync="notifyDialog"
    append-to-body
  >
    <template slot="title">
      <label>消息</label>
      <el-button custom type="text" size="small" @click="gotoMsgViews">
        <small>更多消息>></small>
      </el-button>
    </template>
    <idss-widget
      v-loading="loading['notify']"
      shadow="never"
      :main-style="{ padding: '15px 0' }"
    >
      <el-form :model="notifyData" label-width="130px" plain>
        <el-form-item label="主题：">
          <label>{{ notifyData.title }}</label>
        </el-form-item>
        <el-form-item label="发送时间：">
          <label>{{ notifyData.sendTime | formatDate }}</label>
        </el-form-item>
        <el-form-item label="消息类型：">
          <label>{{ notifyData.messageType }}</label>
        </el-form-item>
        <el-form-item label="发送源：">
          <label>{{ notifyData.sendType }}</label>
        </el-form-item>
        <el-form-item label="邮件接收人：">
          <label>{{ notifyData.mailReceiver }}</label>
        </el-form-item>
        <el-form-item label="内容：">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="custom-content" v-html="notifyData.text"></div>
        </el-form-item>
      </el-form>
    </idss-widget>
  </el-dialog>
  <!-- 消息提示弹框 end -->
</template>

<script>
import { mapGetters } from "vuex";
import { charCodeLength } from "@/util/base";
import BusFactory from "@/fusion-components/util/bus.js";
import globalMixins from "@/mixins/globalMixins";
import service from "./MsgNotifyService";
import { MESSAGE_CENTER } from "@/util/event-name.js";

export default {
  mixins: [globalMixins, service],
  data() {
    return {
      bus: BusFactory(this),
      // 消息通知
      notifyDialog: false,
      notifyData: {
        title: "", // 主题
        text: "", // 内容
        sendTime: "", // 发送时间
        messageType: "", // 消息类型
        sendType: "", // 发送源
        mailReceiver: "", // 邮件接收人
      },
      msgId: "",
    };
  },
  computed: {
    ...mapGetters("base", ["token$$", "userInfo$$"]),
  },
  created() {
    // this.init()
  },
  methods: {
    /**
     * 实时消息查看
     */
    notifyCheck(instance) {
      this.notifyDialog = true;
      // 发送消息请求
      this.notifyCheckReq();
      instance.close();
    },

    /**
     * 跳转到消息中心
     */
    gotoMsgViews() {
      this.$router.push({ name: "user-msg" });
      this.notifyDialog = false; // 关闭弹窗
      this.instanceUnreadMsgTotal.close(); // 关闭所有消息提示
    },

    /**
     * 提示信息模板
     */
    msgTemplate(data) {
      this.msgId = data.id;
      // 文本长度超过 70 个字符，添加省略号
      if (charCodeLength(data.text, 70)) {
        let str = data.text.slice(0, charCodeLength(data.text, 70)) + " ...";
        data.text = str.replace(/<[a-z]+\/?>/g, ""); // 去掉标签
      }
      const h = this.$createElement;
      return h("div", { attrs: { class: "idss-notify--single" } }, [
        h("h1", `标题：【${data.title}】`),
        h("p", `${data.text}`),
      ]);
    },

    /**
     * 监听 socket 事件
     */
    async startSoket() {
      // 【监听】实时消息推送 websocket/unread_msg_single
      this.bus.$on(`${MESSAGE_CENTER.WEBSOCKET_UNREAD_MSG_SINGLE}`, (data) => {
        let instanceUnreadMsgSingle = this.$notify({
          customClass: "custom-notify",
          title: `您收到一条${data.messageType}`,
          message: this.msgTemplate(data),
          duration: 20000,
          onClick: () => {
            this.notifyCheck(instanceUnreadMsgSingle);
          },
          offset: 90,
        });
      });
      // 【监听】未读消息总数 websocket/unread_msg_cnt
      this.bus.$on(`${MESSAGE_CENTER.WEBSOCKET_UNREAD_MSG_CNT}`, (data) => {
        this.unreadMsgCount = data.total;
        this.$emit("unreadMsgCount", this.unreadMsgCount);
      });
      // 获取用户id
      if (!this.userInfo$$.sysUsersId) {
        await this.$store.dispatch("base/userInfo$$");
      }
      this.$socketInit(this.userInfo$$.sysUsersId);
    },
    // 初始化后判断是否有未读数据，如果有则推出弹框
    async isHasUnreadMsg() {
      await this.msgUnreadCountReq(); // 未读消息数量请求
      // 未读消息数目 > 0，则显示提醒
      if (this.unreadMsgCount > 0) {
        this.instanceUnreadMsgTotal = this.$notify({
          customClass: "custom-notify",
          title: "消息通知",
          message: `您有${this.unreadMsgCount}未读消息，点击查看。`,
          onClick: this.gotoMsgViews,
          offset: 90,
          duration: 20000,
        });
      }
    },
    // 初始化
    init() {
      this.isHasUnreadMsg();
      this.startSoket();
    },
  },
};
</script>
<style lang="postcss" scoped>
.idss-notify--single {
  & > p {
    font-size: 1.3rem;
    color: var(--gray);
  }
}
.el-dialog__wrapper[custom] {
  .el-dialog .el-dialog__body {
    padding: 5px 30px 15px;
  }
}
.custom-notify .el-notification__group {
  .el-notification__content {
    cursor: pointer;
  }
}
.custom-content {
  word-wrap: break-word;
  padding-right: 10px;
  max-height: 300px;
  overflow-y: auto;
}
</style>
