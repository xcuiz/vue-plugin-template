<!--
 * @Author: your name
 * @Date: 2020-10-23 15:23:41
 * @LastEditTime: 2020-11-10 17:28:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/manage/data-access/collectionScript/components/EditForm.vue
-->
<template>
  <div class="collection-edit-form-container">
    <header class="collection-header">
      {{ headerTitle }}

      <el-popover
        placement="left-start"
        title="帮助"
        width="600"
        trigger="hover"
      >
        <idss-icon-svg slot="reference" name="help" />
        <section style="white-space: pre-wrap" v-html="helpTips"></section>
      </el-popover>
    </header>
    <div v-loading="loading.detail">
      <el-form
        ref="form"
        primary
        inline
        size="mini"
        :rules="rules"
        :model="form"
      >
        <el-form-item label="脚本名称：" prop="scriptName">
          <el-input
            v-model.trim="form.scriptName"
            maxlength="20"
            placeholder="支持:中英文字符+数字+下划线"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input v-model="form.scriptDesc" maxlength="300"> </el-input>
        </el-form-item>
      </el-form>

      <!-- python输入 -->
      <el-row style="margin-bottom: 15px" :gutter="10">
        <el-col :span="23">
          <idss-ace-editor
            v-model="form.scriptContent"
            mode="python"
            theme="xcode"
            :height="editorHeight"
            placeholder=""
          ></idss-ace-editor>
        </el-col>
        <el-col :span="1" style="text-align: right">
          <el-button
            size="mini"
            type="primary"
            :loading="loading.test"
            @click="handleTest"
          >
            测试
          </el-button>
        </el-col>
        <el-col :span="24" class="textC slideIconContainer">
          <!-- downarrow -->
          <idss-icon-svg :name="toggleIcon" @click="handleToggle">
          </idss-icon-svg>
        </el-col>
      </el-row>
    </div>

    <!-- 解析 -->
    <section style="margin-bottom: 15px">
      <article style="margin-bottom: 10px">
        <el-button
          size="mini"
          :type="getButtonType('json')"
          @click="selectMode('json')"
          >Json</el-button
        >
        <el-button
          size="mini"
          :type="getButtonType('table')"
          @click="selectMode('table')"
          >表格</el-button
        >
      </article>
      <article style="margin-bottom: 10px">
        <!-- json -->
        <section v-show="mode === 'json'">
          <idss-ace-editor
            read-only
            mode="json"
            theme="xcode"
            height="300px"
            :value="preview.json"
            placeholder=""
          ></idss-ace-editor>
        </section>
        <!-- 表格 -->
        <section v-show="mode === 'table'">
          <el-table :data="subTableData">
            <el-table-column
              v-for="item in preview.table.allKeys"
              :key="item"
              :prop="item"
              :label="item"
              min-width="220"
            >
              <template slot-scope="scope">
                {{ scope.row[item] }}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            small
            :current-page="pageNum"
            background
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="preview.table.data.length"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </section>
      </article>
      <!-- <article>注：返回值最大支持500条</article> -->
    </section>

    <!-- footer按钮组 -->
    <footer class="footer">
      <slot name="footer">
        <el-button
          size="mini"
          :loading="loading.submit"
          type="primary"
          @click="handleSave"
        >
          保存
        </el-button>
        <el-button size="mini" @click="handleBack"> 取消 </el-button>
      </slot>
    </footer>
  </div>
</template>

<script>
import { checkLetterLine } from "@/utils/rules";
import { getScript, addScript, updateScript, executeScript } from "./api";
const DEFAULT_SCRIPT = `# coding: utf-8
# python 脚本第一行，必须声明编码为 UTF-8，否则采集到的数据会乱码。

# 导入必须的依赖包 py4j，与 ETL 通讯的依赖包
from py4j.java_gateway import JavaGateway, GatewayParameters
# 如果需要导入其它包，请在这里继续追加 import，例：import pandas
# 注意，依赖包有可能相互依赖的情况，例：requests 依赖 urllib3，也需要复制 urllib3 包到 ETL python目录。
import sys
# 声明一个 java 网关，用于和 java 进程通信，以下 3 行代码不可更改
gateway = JavaGateway(gateway_parameters=GatewayParameters(port=int(sys.argv[1])))
# 获取数据流 id，标识 python 子进程作用于哪个数据流
FLOW_ID = sys.argv[2]
# ETL 网关入口点
ETL = gateway.entry_point
# ETL.input(FLOW_ID, msg) 此方法用于向 ETL 采集器输入消息，每调用一次，只传递 1 条消息，建议在循环体内调用。


# 下边为循环调用示例
for i in range(0, 10):
    ETL.input(FLOW_ID, "{\\"name\\":\\"python 输入消息。"+str(i)+"\\"}")  # python 读取到的字符串，需要传回给 java
# print() 输出的日志，可以在采集端日志文件中查看。
print("python 脚本执行结束。")
# 当输入全部结束后，python 脚本自动结束`;
export default {
  components: {},
  props: {
    id: {
      type: [String, Number],
    },
    type: {
      type: String,
    },
  },
  data() {
    return {
      helpTips: DEFAULT_SCRIPT,
      visible: false, // 另存为弹窗
      mode: "json", // 切换列表、json 标识
      slideType: "up", // 展开收起标识
      rules: {
        scriptName: [
          {
            required: true,
            message: "请输入脚本名称",
            trigger: "blur",
          },
          {
            pattern: checkLetterLine,
            trigger: "blur",
            message: "仅支持中英文字母、数字、下划线",
          },
        ],
      },
      form: {
        scriptName: "",
        scriptDesc: "",
        scriptContent: this.type === "add" ? DEFAULT_SCRIPT : "",
      },
      // 默认Python展示
      preview: {
        json: "",
        table: {
          allKeys: [],
          data: [],
        },
      },
      pageSize: 10,
      pageNum: 1,
      loading: {
        detail: false,
        test: false,
        submit: false,
      },
    };
  },
  computed: {
    // 预览表格分页
    subTableData() {
      return this.preview.table.data.slice(
        this.pageSize * (this.pageNum - 1),
        this.pageSize * this.pageNum
      );
    },
    // python编辑器高度
    editorHeight() {
      return this.slideType === "up" ? "320px" : "600px";
    },
    // python展开收起图标样式
    toggleIcon() {
      return this.slideType === "up" ? "downarrow" : "arrowup";
    },
    headerTitle() {
      const config = {
        detail: "查看",
        edit: "编辑",
        add: "新建",
      };
      return (config[this.type] || "") + "同步脚本";
    },
  },
  created() {
    if (this.type !== "add" && this.id) {
      this.getScript();
    }
  },
  methods: {
    // 切换预览模式
    selectMode(mode = "json") {
      this.mode = mode;
    },
    // python编辑器高度展开收起
    handleToggle() {
      this.slideType = this.slideType === "up" ? "down" : "up";
    },
    // 获取当展示项展示的内容type
    getButtonType(type) {
      return this.mode === type ? "primary" : "";
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
    },
    // 清除预览数据
    _emptyPreviewData() {
      this.preview = Object.freeze({
        json: "",
        table: {
          allKeys: [],
          data: [],
        },
      });
    },
    // 测试
    async handleTest() {
      this.loading.test = true;
      this._emptyPreviewData();
      try {
        const json = await executeScript({
          script: this.form.scriptContent,
        });
        const table = {
          data: json,
          allKeys: Object.keys(json[0] || []),
        };
        const jsonStr = JSON.stringify(json, null, "\t");
        this.preview = Object.freeze({
          json: jsonStr,
          table,
        });
        this.loading.test = false;
      } catch (error) {
        this.loading.test = false;
        this.$message.error("测试失败");
      }
    },
    // 返回到列表
    handleBack() {
      this.$router.back();
    },
    // 保存参数
    getParams() {
      const { id, scriptName, scriptDesc, scriptContent } = this.form;
      return {
        id,
        scriptName,
        scriptContent,
        scriptDesc,
      };
    },
    // 效验
    validPreviewData() {
      if (!this.preview.table.data.length) {
        this.$message.error(
          "预览数据为空，请先输入合法的脚本内容并点击测试按钮进行测试！"
        );
        return false;
      }
      return true;
    },
    // 保存
    async handleSave() {
      try {
        const valid = await this.$refs.form.validate();
        if (!valid) {
          return;
        }
      } catch (error) {
        return;
      }

      if (!this.validPreviewData()) {
        return;
      }
      this.loading.submit = true;
      const func = this.type === "add" ? addScript : updateScript;
      const args = this.type === "add" ? [this.form] : [this.id, this.form];
      func(...args)
        .then(() => {
          this.$message({
            type: "success",
            message: "添加成功",
            duration: 1000,
            onClose: () => this.handleBack(),
          });
        })
        .finally(() => {
          this.loading.submit = false;
        });
    },
    getScript() {
      this.loading.detail = true;
      getScript(this.id)
        .then((res) => {
          this.form = res;
        })
        .finally(() => {
          this.loading.detail = false;
        });
    },
  },
};
</script>

<style lang="postcss" scoped>
.collection-edit-form-container {
  padding: 15px 15px 30px;
  .textC {
    text-align: center;
  }
  .collection-header {
    position: relative;
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    padding-left: 10px;
    padding-bottom: 10px;
    font-weight: 650;
    margin-bottom: 20px;
    border-bottom: 1px solid #3f3f3f;
    &.::before {
      content: "";
      position: absolute;
      left: 0;
      top: 3px;
      height: 18px;
      width: 4px;
      background: #4592de;
    }
    >>> .idss-svg-icon {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }

  .slideIconContainer {
    margin-top: 5px;
    >>> .idss-svg-icon {
      width: 22px;
      height: 22px;
      cursor: pointer;
    }
  }
  .footer {
    text-align: center;
    .el-button {
      margin: 0 15px;
    }
  }
}
</style>
