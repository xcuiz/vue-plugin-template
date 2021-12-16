<!--
 * @Author: your name
 * @Date: 2021-03-09 20:50:23
 * @LastEditTime: 2021-10-27 11:10:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-gov-web\src\views\sensitive\data-resource-manage\detail.vue
-->
<template>
  <div class="data-resource-detail">
    <el-card style="margin-bottom: 15px">
      <div slot="header" class="flex-sb-box">
        <PageHeader :title="resourceName" />
        <el-button-group>
          <el-button type="primary" size="mini" @click="handleEdit"
            >修改</el-button
          >
          <el-button type="primary" plain size="mini" @click="backList">
            返回</el-button
          >
        </el-button-group>
      </div>
      <div class="detail-base-info">
        <el-form size="mini">
          <el-row>
            <el-col v-for="item of showdetailList" :key="item.name" :span="6">
              <el-form-item :label="`${item.name}:`">
                {{ item.value }}
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="是否涉敏:">
                {{ cnIsSensitive }}
              </el-form-item>
            </el-col>

            <template>
              <el-col :span="6">
                <el-form-item label="涉敏级别:">
                  <div class="corlor-red">
                    {{ senLevel ? senLevel : "-" }}
                  </div>
                </el-form-item>
              </el-col>
              <el-col v-if="storageMode !== 'File'" :span="6">
                <el-form-item
                  :label="`涉敏${storageMode == 'File' ? '目录' : '表'}数量:`"
                >
                  <div class="corlor-red">
                    {{ senNum ? senNum : "-" }}
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  :label="`涉敏${storageMode == 'File' ? '文件' : '字段'}数量:`"
                >
                  <div class="corlor-red">
                    {{ storageMode == "File" ? senNum : senColNum }}
                  </div>
                </el-form-item>
              </el-col>
            </template>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <div class="detail-content">
      <!--
      <div class="detail-card">
        <div class="detail-btn">
          <el-button type="primary" size="mini" @click="handleEdit"
            >修改</el-button
          >
          <el-button type="primary" plain size="mini" @click="backList">
            返回</el-button
          >
        </div>
        <el-row>
          <el-row class="vertical-center">
            <el-col :span="8" class="more-pos-wrap">
              <h3 class="detail-content-tit">{{ resourceName }}</h3>
              <ul class="detail-content-title-ul">
                <li v-for="item in showdetailList" :key="item.name">
                  <span>{{ item.name }}</span
                  ><span class="bg-gray">{{ item.value }}</span>
                </li>
              </ul>
              <div
                v-if="dataBaseInfo.length > 6"
                class="more-pos"
                @click="changeFoldState"
              >
                <i
                  :class="
                    brandFold ? 'el-icon-caret-right' : 'el-icon-caret-bottom'
                  "
                ></i>
                <span round plain type="primary" size="mini">{{
                  brandFold ? "更多" : "收起"
                }}</span>
              </div>
            </el-col>
            <el-col :span="8" :offset="8">
              <el-row>
                <el-col :span="6" class="center">
                  <div class="title pt15">{{ cnIsSensitive }}</div>
                  <p>是否涉敏</p>
                </el-col>
                <template v-if="isSensitive == '1'">
                  <el-col :span="6" class="center">
                    <div class="title pt15 corlor-red">
                      {{ senLevel ? senLevel : "-" }}
                    </div>
                    <p>涉敏级别</p>
                  </el-col>
                  <el-col :span="6" class="center">
                    <div class="title pt15 color-blue">
                      {{ senNum ? senNum : "-" }}
                    </div>
                    <p>涉敏{{ storageMode == "File" ? "目录" : "表" }}数量</p>
                  </el-col>
                  <el-col :span="6" class="center">
                    <div class="title pt15">
                      {{ senColNum ? senColNum : "-" }}
                    </div>
                    <p>涉敏{{ storageMode == "File" ? "文件" : "字段" }}数量</p>
                  </el-col>
                </template>
              </el-row>
            </el-col>
          </el-row>
        </el-row>
      </div>
      -->
      <div class="detail-table">
        <el-row class="detail-content-b">
          <el-tabs v-model="activeName">
            <el-tab-pane :label="tableTitle" name="first">
              <DataChildTable v-if="isTableFile" :id="id" />
              <FileChildTable v-else :id="id" />
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </div>
    </div>
    <el-drawer
      ref="drawer"
      title="资源详情修改"
      :visible.sync="drawer.visible"
      destroy-on-close
      size="800px"
      :wrapper-closable="false"
    >
      <Form
        v-bind="drawer"
        :visible.sync="drawer.visible"
        @success="getDetail"
      />
    </el-drawer>
  </div>
</template>

<script>
import PageHeader from "@/components/PageHeader";
import Form from "./components/form-dialog";
import FileChildTable from "./components/file-child";
import DataChildTable from "./components/data-child";
import { getSinsitiveDetail } from "./api";
export default {
  components: { Form, DataChildTable, FileChildTable, PageHeader },
  data() {
    return {
      brandFold: false,
      activeName: "first",
      dataBaseInfo: [
        { name: "数据资源名称", code: "name" },
        { name: "业务地址", code: "ip" },
        { name: "存储类型", code: "storageMode" },
        { name: "数据库名", code: "dbOrFileName" }, //数据库名或文件
        { name: "所属应用", code: "businessSysName" },
        { name: "资源池", code: "poolName" },
        { name: "POD", code: "pod" },
        { name: "所属部门", code: "deptName" },
        { name: "备注", code: "remark" },
        { name: "负责人", code: "owner" },
        { name: "联系方式", code: "contact" },
        { name: "认证方式", code: "authType" },
        { name: "认证参数", code: "authParam" },
        { name: "创建时间", code: "createTime" },
        { name: "更新时间", code: "updateTime" },
      ],
      storageModeMap: {
        BigData: "大数据",
        DataBase: "数据库",
        File: "文件",
      },
      id: null,
      drawer: {
        visible: false,
        type: "add",
        id: null,
      },
      isSensitive: "0",
      senLevel: "",
      senNum: "0",
      senColNum: "",
      resourceName: "",
      storageMode: "",
      tableTitle: "",
    };
  },
  computed: {
    cnIsSensitive() {
      if (this.isSensitive == 0) {
        return "否";
      } else if (this.isSensitive == 1) {
        return "是";
      } else {
        return "未知";
      }
    },
    isTableFile() {
      if (this.storageMode === "BigData" || this.storageMode === "DataBase") {
        return true;
      } else {
        return false;
      }
    },
    showdetailList: {
      get: function () {
        if (this.brandFold) {
          if (this.dataBaseInfo.length < 9) {
            return this.dataBaseInfo;
          }
          let newArr = [];
          for (var i = 0; i < 9; i++) {
            let item = this.dataBaseInfo[i];
            newArr.push(item);
          }
          return newArr;
        }
        return this.dataBaseInfo;
      },
      set: function (val) {
        this.showdetailList = val;
      },
    },
  },
  created() {
    const { id } = this.$route.params;
    this.id = id;
    this.getDetail(id);
  },
  methods: {
    getDetail(id) {
      this.$nextTick(async () => {
        await getSinsitiveDetail(id)
          .then((res) => {
            let data = res;
            const {
              isSensitive,
              senLevel,
              senNum,
              senColNum,
              name,
              storageMode,
            } = data;
            this.resourceName = name;
            this.isSensitive = isSensitive;
            this.senLevel = senLevel;
            this.senNum = senNum;
            this.storageMode = storageMode;
            this.senColNum = senColNum;
            var keys = Object.keys(data);
            this.dataBaseInfo = this.dataBaseInfo.map((item) => {
              if (keys.indexOf(item.code) !== -1) {
                if (item.code === "ip") {
                  let value = data[item.code] + " " + data["port"];
                  return { ...item, value: value };
                } else if (item.code === "storageMode") {
                  let value =
                    this.storageModeMap[data[item.code]] +
                    "/" +
                    data["assetType"];
                  return { ...item, value: value };
                } else if (item.code === "dbOrFileName") {
                  return {
                    ...item,
                    value: data[item.code],
                    name: storageMode === "File" ? "目录名" : "数据库名",
                  };
                } else {
                  return { ...item, value: data[item.code] };
                }
              }
            });
            if (
              this.storageMode === "BigData" ||
              this.storageMode === "DataBase"
            ) {
              this.tableTitle = "数据库信息";
            } else {
              this.tableTitle = "文件信息";
            }
          })
          .finally(() => {});
      });
    },
    changeFoldState() {
      this.brandFold = !this.brandFold;
    },
    backList() {
      this.$router.push({ name: "data-resource" });
    },
    handleEdit() {
      const { id } = this.$route.params;
      this.drawer = {
        visible: true,
        id: id,
        type: "detail",
      };
    },
  },
};
</script>

<style lang="postcss">
.data-resource-detail {
  .flex-sb-box {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .page-header {
      padding: 0;
    }
  }

  .detail-base-info {
    .el-form {
      .el-form-item {
        margin-bottom: 6px;
      }
    }
  }
}
</style>

<style lang="postcss" scoped>
.data-resource-detail {
  padding: 10px 12px;
  font-size: 12px;

  >>> .el-drawer__header {
    margin-bottom: 0;
  }
  .bg-white {
    background: #fff;
  }
  .detali-content-top-l {
    padding: 20px;
  }
  .detail-content-b {
    padding: 15px 20px;
  }
  .detail-card {
    position: relative;
    background: #fff;
    padding-top: 20px;
  }
  .detail-table {
    background: #fff;
  }
  .detail-btn {
    position: absolute;
    right: 40px;
    top: 26px;
    z-index: 1;
  }
  .detail-content-tit {
    margin-bottom: 10px;
    font-size: 24px;
    color: #333;
  }
  .detail-content-title-ul {
    border: 1px solid #efefef;
    li {
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid #efefef;
      display: flex;
      span {
        display: block;
        box-sizing: border-box;
        padding-left: 20px;
        text-align: left;
      }
      span:nth-of-type(1) {
        text-align: right;
        border-right: 1px solid #efefef;
        padding-right: 30px;
        width: 32%;
      }
      span:nth-of-type(2) {
        background: #f4f5f7;
        flex: 1;
      }
    }
    li:last-child {
      border-bottom: none;
    }
  }
  .vertical-center {
    display: flex;
    align-items: center;
    width: 100%;
  }
  .title {
    font-size: 22px;
    color: #333;
    margin-bottom: 10px;
  }
  .center {
    text-align: center;
  }
  .pt15 {
    margin-top: 15px;
  }
  .corlor-red {
    color: #e7454f;
  }
  .color-blue {
    color: #24b0d3;
  }
  .more-pos-wrap {
    position: relative;
    margin-left: 20px;
    .more-pos {
      position: absolute;
      right: -60px;
      bottom: 0px;
    }
  }
}
</style>
