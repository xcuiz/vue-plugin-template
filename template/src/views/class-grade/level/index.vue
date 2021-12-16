<template>
  <div class="data-level-container">
    <div class="data-level-box">
      <el-card>
        <PageHeader title="敏感级别管理"> </PageHeader>
        <div class="box-content">
          <div class="content-header">
            <div class="search-box">
              <el-input
                v-model="searchModel"
                placeholder="请输入关键字搜索"
                size="mini"
                @keyup.native.enter="searchModelChange"
              >
                <i slot="suffix" class="el-icon-search el-input__icon"> </i
              ></el-input>
            </div>
            <div class="operate-box">
              <el-button size="mini" type="primary" @click="toAdd"
                >+ 新增分级</el-button
              >
              <el-button size="mini" type="primary" plain @click="toLeakIn"
                >导入分级</el-button
              >
              <el-button size="mini" type="primary" plain @click="toExport"
                >导出分级</el-button
              >
            </div>
          </div>
          <div v-show="dataLevelList.length > 0" class="data-level-list">
            <div
              v-for="dataLevel of dataLevelList"
              :key="dataLevel.id"
              class="data-level-item"
            >
              <div class="item-header">
                <div class="code-bar">
                  <!-- <div class="code-left">
                    <svg
                      data-v-1128af58=""
                      aria-hidden="true"
                      class="idss-svg-icon"
                    >
                      <use xlink:href="#icon-jibie1">
                        <svg id="icon-jibie1" viewBox="0 0 1024 1024">
                          <path
                            d="M621.307531 912.590903H402.285714V0h219.021817v912.590903z"
                            :fill="dataLevel.gradeColor"
                          ></path>
                          <path
                            d="M402.285714 912.590903h182.518181v111.409097z"
                            fill="rgba(0, 0, 0, 0.3)"
                          ></path>
                        </svg>
                      </use>
                    </svg>
                  </div> -->
                  <div
                    class="level-code"
                    :style="{
                      background: `linear-gradient(to right, ${colorOpacity(
                        dataLevel.gradeColor || defaultGradeColor
                      )}, ${dataLevel.gradeColor || defaultGradeColor}`,
                    }"
                  >
                    {{ dataLevel.code }}
                  </div>
                  <div class="code-right">
                    <svg
                      data-v-1128af58=""
                      aria-hidden="true"
                      class="idss-svg-icon"
                      :style="`fill: ${
                        dataLevel.gradeColor || defaultGradeColor
                      }`"
                    >
                      <use xlink:href="#icon-weiba">
                        <svg id="icon-weiba" viewBox="0 0 1024 1024">
                          <path
                            d="M368.64 1024V0h208.896a40.96 40.96 0 0 1 36.00384 60.49792L389.81632 472.96512a81.92 81.92 0 0 0 0 78.11072l223.72352 412.4672A40.96 40.96 0 0 1 577.49504 1024H368.64z"
                          ></path>
                        </svg>
                      </use>
                    </svg>
                  </div>
                </div>
                <span class="item-header-title">{{ dataLevel.gradeName }}</span>
                <template v-if="dataLevel.sensitiveFrom === 1">
                  <i
                    class="el-icon-edit operate-icon"
                    @click="toEdit(dataLevel.id)"
                  ></i>
                  <i
                    class="el-icon-delete operate-icon"
                    @click="toDelete(dataLevel.id)"
                  ></i>
                </template>
                <template v-if="dataLevel.sensitiveFrom === 2">
                  <i
                    class="el-icon-zoom-in operate-icon"
                    @click="toExamine(dataLevel.id)"
                  ></i>
                </template>
              </div>
              <div class="item-content">
                <div class="item-content-info">
                  <!-- <div class="item-info">
                    <div class="item-info-label">【管控原则】</div>
                    <div class="item-info-text">
                      {{ dataLevel.controlRule }}
                    </div>
                  </div>
                  <div class="item-info">
                    <div class="item-info-label">【开放要求】</div>
                    <div class="item-info-text">
                      {{ dataLevel.accessRequirement | jsonFormatter }}
                    </div>
                  </div> -->
                  <div class="item-info">
                    <div class="item-info-label">【描述信息】</div>
                    <div class="item-info-text">
                      {{ dataLevel.description }}
                    </div>
                  </div>
                </div>
                <div class="item-content-tag">
                  <el-tag
                    v-for="(tag, index) of dataLevel.tagList"
                    :key="index"
                    size="mini"
                    style="margin-left: 5px"
                    >{{ tag }}</el-tag
                  >
                </div>
              </div>
            </div>
          </div>
          <div
            v-show="dataLevelList.length === 0"
            class="data-level-list-empty"
          >
            暂无数据
          </div>
        </div>
      </el-card>
    </div>
    <div class="dialog-box">
      <new-data-level
        v-if="addVisible"
        :dialog-type="dialogType"
        :selected-id="editDetailId"
        :visible.sync="addVisible"
        @after-close="afterAddClose"
      ></new-data-level>
      <leak-in-level
        v-if="leakInVisible"
        :visible.sync="leakInVisible"
        @after-close="leakInAfterClose"
      ></leak-in-level>
    </div>
  </div>
</template>

<script>
import NewDataLevel from "./NewDataLevel.vue";
import LeakInLevel from "./LeakInLevel.vue";
import PageHeader from "@/components/PageHeader";
export default {
  name: "DataLevel",
  components: {
    NewDataLevel,
    LeakInLevel,
    PageHeader,
  },
  filters: {
    jsonFormatter(val) {
      if (val) {
        try {
          const json = JSON.parse(val);

          let str = "";
          json.forEach(({ claim, type, layout, term }, index) => {
            let tempLayout = "";

            layout.forEach((v, i) => {
              tempLayout += v + (i !== layout.length - 1 ? "," : "");
            });
            str += `${claim},${type},${tempLayout}`;

            if (term) {
              str += term;
            }

            if (index !== json.length - 1) {
              str += ",";
            }
          });

          return str;
        } catch (e) {
          return "";
        }
      }

      return val;
    },
  },
  data() {
    return {
      searchModel: "",

      addVisible: false,
      editDetailId: null,

      leakInVisible: false,

      dataLevelList: [],

      defaultGradeColor: "rgb(255, 110, 23)",
      dialogType: "newly",
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        const { list } = await this.$request({
          url: "/gov/api/strategy/grade/list",
          method: "POST",
          data: {
            gradeName: this.searchModel,
          },
        });

        if (Array.isArray(list)) {
          this.dataLevelList = list;
        }
      } catch (e) {
        return "";
      }
    },
    searchModelChange() {
      this.getList();
    },
    toAdd() {
      this.addVisible = true;
      this.editDetailId = null;
      this.dialogType = "newly";
    },
    toEdit(id) {
      this.addVisible = true;
      this.editDetailId = id;
      this.dialogType = "edit";
    },
    toExamine(id) {
      this.addVisible = true;
      this.editDetailId = id;
      this.dialogType = "examine";
    },
    toDelete(id) {
      this.$confirm("确定删除该数据吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            await this.$request({
              url: "/gov/api/strategy/grade/delete",
              method: "POST",
              data: {
                idList: [id],
              },
            });

            this.$message.success("删除成功");

            this.getList();
          } catch (e) {
            return "";
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    toLeakIn() {
      this.leakInVisible = true;
    },
    async toExport() {
      this.$message.info("正在下载,请稍后...");
      try {
        const { data } = await this.$request(
          {
            url: "/gov/api/strategy/grade/export",
            method: "GET",
          },
          {
            responseType: "blob",
          }
        );

        if (data) {
          const blob = new Blob([data], {
            type: "application/vnd.ms-excel",
          });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "分级.xlsx";
          link.click();
          // 释放内存
          window.URL.revokeObjectURL(link.href);
        }
      } catch (e) {
        return "";
      }
    },
    afterAddClose(isSave) {
      if (isSave) {
        this.addVisible = false;
        this.editDetailId = null;

        this.getList();
      }
    },
    leakInAfterClose() {
      this.leakInVisible = false;
      this.getList();
    },
    colorOpacity(val) {
      if ((val, /rgb/.test(val))) {
        return val.replace(")", ", 0.5)");
      }

      return val;
    },
  },
};
</script>

<style lang="postcss">
.data-level-container {
  .data-level-box {
    & > .el-card {
      background: none;
      padding: 10px 15px;
      & > .el-card__header {
        font-size: var(--font-size-16);
        color: #5e6b7a;
        font-weight: bold;
        border: none;
        padding: 10px 20px;
        padding-bottom: 0px;
      }
      & > .el-card__body {
        padding: 0;
      }
    }

    .box-content {
      padding-bottom: 20px;
      .content-header {
        display: flex;
        justify-content: space-between;
        .search-box {
        }
        .operate-box {
        }
      }

      .data-level-list {
        margin-top: 15px;
        .data-level-item {
          background: #fff;
          border: 1px solid rgb(223, 223, 223);
          border-radius: 4px;
          padding: 10px 20px;
          margin-bottom: 10px;

          &:last-child {
            margin-bottom: 0;
          }

          .item-header {
            display: flex;
            align-items: center;
            margin-left: -20px;
            padding-top: 5px;

            .code-bar {
              position: relative;
              height: 34px;
              display: flex;
              align-items: center;

              .code-left {
                width: 22px;
                height: 34px;

                & > svg {
                  width: 34px;
                  height: 34px;
                }
              }

              .level-code {
                height: 34px;
                min-width: 40px;
                padding: 0 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
              }

              .code-right {
                width: 22px;
                height: 34px;
                position: relative;
                left: -13px;

                & > svg {
                  width: 34px;
                  height: 34px;
                }
              }
            }

            .item-header-title {
              font-weight: 700;
              font-size: 16px;
            }

            .operate-icon {
              margin-left: 10px;
              cursor: pointer;
              font-size: 13px;
              color: #999;
            }
          }
        }

        .item-content {
          display: flex;
          padding-bottom: 10px;

          .item-content-info {
            flex: 3;
            flex-shrink: 0;
            padding-top: 25px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;

            .item-info {
              display: flex;
              margin-right: 10px;
              margin-bottom: 24px;

              &:last-child {
                margin-bottom: 0;
              }

              .item-info-label {
                width: 100px;
                flex-shrink: 0;
              }

              .item-info-text {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                word-break: break-all;
                color: #999;
              }
            }
          }

          .item-content-tag {
            flex: 1;
            flex-shrink: 0;
          }
        }
      }

      .data-level-list-empty {
        padding: 50px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #f1f1f1;
        margin-top: 20px;
        color: #aaa;
        letter-spacing: 2px;
      }
    }
  }
}
</style>
