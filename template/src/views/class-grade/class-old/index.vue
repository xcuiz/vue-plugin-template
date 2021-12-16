<template>
  <div class="class-grade-container">
    <div class="class-grade-box">
      <el-card>
        <PageHeader title="敏感分类管理"> </PageHeader>
        <div class="box-content">
          <div class="content-header">
            <div class="search-box">
              <el-input
                v-model="searchModel"
                placeholder="请输入关键字搜索"
                size="mini"
              >
                <i slot="suffix" class="el-icon-search el-input__icon"> </i
              ></el-input>
            </div>
            <div class="operate-box">
              <!-- <el-button size="mini" @click="toReset">类别重置</el-button> -->
              <el-button size="mini" type="primary" plain @click="toLeakIn"
                >导入分类</el-button
              >
              <el-button size="mini" type="primary" plain @click="toExport"
                >导出分类</el-button
              >
            </div>
          </div>
          <div v-if="infoList.length > 0" class="box-card-wrapper">
            <div
              v-for="(info, index) of infoList"
              :key="index"
              class="wrapper-item"
            >
              <el-card>
                <div class="info-box">
                  <div class="info-header">
                    <div class="header-title">{{ info.topName }}</div>
                    <div class="header-operate">
                      <i
                        v-show="index === 0"
                        class="el-icon-plus operate-icon"
                        @click="toAdd(info.id, info.level)"
                      ></i>
                      <i
                        class="el-icon-edit operate-icon"
                        @click="toEditClass(index)"
                      ></i>
                    </div>
                  </div>
                  <div class="info-description">
                    {{ info.description }}
                  </div>
                  <div class="update-time">
                    <div class="update-time-label">上次更新时间</div>
                    <div class="update-time-text">
                      {{ info.updateTimeValue | dateFormatter }}
                    </div>
                  </div>
                  <div class="info-list">
                    <div
                      v-for="(layer, i) of getCurrentInfo(index)"
                      :key="i"
                      class="info-list-item"
                    >
                      <div
                        class="item-label"
                        :class="{ active: infoIndex[index] === i }"
                        @click="changeCurrentIndex(index, i)"
                      >
                        <el-popover
                          popper-class="info-popover"
                          placement="right"
                          width="240"
                          trigger="hover"
                          :disabled="!layer.id"
                        >
                          <el-button slot="reference" size="mini" type="text">
                            <div class="info-list-item-content">
                              <div
                                class="item-content-text"
                                v-html="contentText(layer)"
                              >
                                <!-- 存在id表示分类否则表示敏感特征 -->

                                <!-- {{
                                  layer.id
                                    ? layer.classifyName
                                    : layer.featureName
                                }} -->
                              </div>
                              <div
                                v-show="layer.id"
                                class="item-content-text-tag"
                              >
                                <el-tag
                                  v-show="layer.gradeId"
                                  size="mini"
                                  effect="dark"
                                  :color="
                                    levelCode(layer.gradeId).gradeColor ||
                                    defaultGradeColor
                                  "
                                  style="border: none"
                                >
                                  {{ levelCode(layer.gradeId).code }}</el-tag
                                >
                                <i
                                  :style="{
                                    visibility:
                                      infoIndex[index] === i
                                        ? 'visible'
                                        : 'hidden',
                                  }"
                                  class="el-icon-right"
                                ></i>
                              </div>
                            </div>
                          </el-button>
                          <div class="child-level-wrapper">
                            <div
                              class="edit-child-level"
                              @click="
                                toEditChild(
                                  index,
                                  info.level,
                                  layer.id,
                                  layer.classifyName,
                                  layer.childrenList
                                )
                              "
                            >
                              编辑子类
                            </div>
                            <div v-show="info.level === 3" class="data-level">
                              <span class="data-level-title">数据级别</span>
                              <div
                                v-loading="levelLoading"
                                class="data-level-list"
                              >
                                <div
                                  v-for="(classLevelItem, j) of classLevelList"
                                  :key="j"
                                  class="data-level-list-item"
                                  :class="{
                                    checked:
                                      layer.gradeId === classLevelItem.id,
                                  }"
                                  @click="
                                    changeClassLevel(layer, classLevelItem)
                                  "
                                >
                                  <span
                                    class="class-level-dot"
                                    :style="{
                                      'background-color':
                                        classLevelItem.gradeColor ||
                                        defaultGradeColor,
                                    }"
                                  ></span>
                                  <span class="class-level-type">{{
                                    classLevelItem.code
                                  }}</span>
                                  <span class="class-level-label">{{
                                    classLevelItem.gradeName
                                  }}</span>
                                  <i class="el-icon-check level-check"></i>
                                </div>
                              </div>
                            </div>
                            <div
                              class="edit-current-level"
                              @click="toEdit(layer.id, layer.classifyName)"
                            >
                              编辑
                            </div>
                            <div
                              class="delete-current-level"
                              @click="toDelete(layer.id)"
                            >
                              删除
                            </div>
                          </div>
                        </el-popover>
                      </div>
                    </div>
                    <div
                      v-show="getCurrentInfo(index).length === 0"
                      class="info-list-empty"
                    >
                      暂无数据
                    </div>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
          <div v-else class="list-empty">暂无数据</div>
        </div>
      </el-card>
    </div>
    <div class="dialog-box">
      <!--类别编辑-->
      <class-edit
        v-if="classEditVisible"
        :visible.sync="classEditVisible"
        :info="currentInfo"
        @after-close="classEditAfter"
      ></class-edit>
      <!--编辑子类-->
      <child-level-edit
        v-if="childLevelEditVisible"
        :visible.sync="childLevelEditVisible"
        :select-level-visible="selectLevelVisible"
        :info="childInfo"
        @after-close="childAfterClose"
      ></child-level-edit>
      <!--类别重置-->
      <category-definition
        v-if="categoryDefinitionVisible"
        :visible.sync="categoryDefinitionVisible"
      ></category-definition>
      <!--导入分类数据-->
      <leak-in-data-level
        v-if="leakInDataLevelVisible"
        :visible.sync="leakInDataLevelVisible"
        @after-close="leakInAfterClose"
      ></leak-in-data-level>
    </div>
  </div>
</template>

<script>
import Day from "dayjs";
import ClassEdit from "./ClassEdit.vue";
import PageHeader from "@/components/PageHeader";
import ChildLevelEdit from "./ChildLevelEdit.vue";
import CategoryDefinition from "./CategoryDefinition.vue";
import LeakInDataLevel from "./LeakInDataLevel.vue";
export default {
  name: "ClassGrade",
  components: {
    ClassEdit,
    ChildLevelEdit,
    CategoryDefinition,
    LeakInDataLevel,
    PageHeader,
  },
  filters: {
    dateFormatter(val) {
      if (val) {
        return Day(val).format("YYYY-MM-DD HH:mm:ss");
      }

      return "";
    },
  },
  data() {
    return {
      // 类别编辑
      classEditVisible: false,
      currentInfo: {},

      // 编辑子类
      childLevelEditVisible: false,
      childInfo: {},
      selectLevelVisible: false,

      // 类别重置
      categoryDefinitionVisible: false,

      // 导入分类数据
      leakInDataLevelVisible: false,

      searchModel: "",

      infoIndex: [0, 0, 0, 0],
      classLevelList: [],
      infoList: [],
      layers: [],

      defaultGradeColor: "rgb(255, 110, 23)",

      levelLoading: false,
    };
  },
  created() {
    this.initData();
    this.initLevel();
  },
  methods: {
    levelCode(gradeId) {
      const { classLevelList } = this;

      if (Array.isArray(classLevelList)) {
        const find = classLevelList.find(({ id }) => id === gradeId);

        if (find) {
          return find;
        }
      }

      return {};
    },
    initData() {
      this.getList();
      this.getClassifyList();
    },
    async initLevel() {
      const result = await this.$request({
        url: "/gov/api/strategy/grade/list",
        method: "POST",
        data: {},
      });

      if (result) {
        const { list } = result;
        if (Array.isArray(list)) {
          this.classLevelList = list;
        }
      }
    },
    async getList() {
      const result = await this.$request({
        url: "/gov/api/strategy/classify/top/list",
        method: "GET",
      });

      if (Array.isArray(result)) {
        this.infoList = result;
      }
    },
    async getClassifyList() {
      const result = await this.$request({
        url: "/gov/api/strategy/classify/list",
        method: "GET",
      });

      if (result) {
        const { data } = result;
        if (Array.isArray(data)) {
          this.layers = data;
        }
      }
    },
    getCurrentInfo(index) {
      const { layers, infoIndex } = this;

      if (Array.isArray(layers)) {
        let temp = layers;
        for (let i = 0; i < index; ++i) {
          const item = temp[infoIndex[i]];

          if (item && Array.isArray(item.childrenList)) {
            temp = item.childrenList;
          } else {
            temp = [];
          }
        }

        return temp;
      }

      return [];
    },
    changeCurrentIndex(index, i) {
      // 重置当前点击的子类被选中的状态
      this.infoIndex.forEach((item, $index) => {
        if ($index > index) {
          this.$set(this.infoIndex, $index, 0);
        }
      });
      // 修改当前的被选中的状态
      this.$set(this.infoIndex, index, i);
    },
    toAdd(id, level) {
      this.$prompt("", "新增", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: (val) => {
          if (!val) {
            return false;
          }

          const value = val.trim();
          return value && value.length <= 30;
        },
        inputErrorMessage: "请输入长度1-30个字符，不能包含特殊字符",
        inputPlaceholder: "请输入类别数据，如：A 用户身份相关数据",
      })
        .then(async ({ value }) => {
          try {
            await this.$request({
              url: "/gov/api/strategy/classify/one/add",
              method: "POST",
              data: {
                topId: id,
                level,
                classifyName: value,
              },
            });

            this.$message({
              type: "success",
              message: "新增分类成功",
            });
            this.getClassifyList();
          } catch (e) {
            return "";
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    toEditClass(index) {
      this.classEditVisible = true;
      this.currentInfo = this.infoList[index];
    },
    /**
     * index: 当前分类的索引
     * id: 父分类id
     * classifyName: 父分类名称
     */
    toEditChild(index, currentLevel, id, classifyName, childrenList) {
      // 获取子类的id和level
      const { id: topId, level } = this.infoList[index + 1];

      this.childInfo = {
        topId,
        level,
        id,
        classifyName,
        childrenList,
      };

      // 目前是3个分类和1个敏感特征，最后一个添加分类编辑子类时,是添加敏感特征
      this.selectLevelVisible = currentLevel === 3;

      this.childLevelEditVisible = true;
    },
    toEdit(id, name) {
      this.$prompt("", "修改", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: (val) => {
          if (!val) {
            return false;
          }

          const value = val.trim();
          return value && value.length <= 30;
        },
        inputValue: name,
        inputErrorMessage: "请输入长度1-30个字符，不能包含特殊字符",
        inputPlaceholder: "请输入内容",
      })
        .then(async ({ value }) => {
          try {
            await this.$request({
              url: "/gov/api/strategy/classify/edit",
              method: "POST",
              data: {
                id,
                classifyName: value,
              },
            });

            this.$message.success("修改成功");
            this.getClassifyList();
          } catch (e) {
            return "";
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    toDelete(id) {
      this.$confirm(
        "删除分类后，将解除与敏感类型的关联关系，用该分类添加的发现模板需重新定义，请谨慎删除！",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          try {
            await this.$request({
              url: `/gov/api/strategy/classify/delete/${id}`,
              method: "GET",
            });

            this.$message({
              type: "success",
              message: "删除成功!",
            });

            this.getClassifyList();
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
    toReset() {
      this.categoryDefinitionVisible = true;
    },
    toLeakIn() {
      this.leakInDataLevelVisible = true;
    },
    async toExport() {
      this.$message.info("正在下载,请稍后...");
      try {
        const { data } = await this.$request(
          {
            url: "/gov/api/strategy/classify/export",
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
          link.download = "分类.xlsx";
          link.click();
          // 释放内存
          window.URL.revokeObjectURL(link.href);
        }
      } catch (e) {
        return "";
      }
    },
    async changeClassLevel(layer, classify) {
      // 只有最后一级才可以进行修改
      if (layer.level === 3) {
        this.levelLoading = true;
        try {
          await this.$request({
            url: "/gov/api/strategy/classify/edit",
            method: "POST",
            data: {
              id: layer.id,
              gradeId: classify.id,
            },
          });

          this.getClassifyList();
        } catch (e) {
          return "";
        } finally {
          this.levelLoading = false;
        }
      }
    },
    classEditAfter() {
      this.classEditVisible = false;
      this.initData();
    },
    childAfterClose() {
      this.childLevelEditVisible = false;
      this.getClassifyList();
    },
    leakInAfterClose() {
      this.leakInDataLevelVisible = false;
      this.getClassifyList();
    },
    encode(str) {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    },
    contentText({ id, classifyName, featureName }) {
      const text = id ? classifyName : featureName;

      if (text && this.searchModel) {
        return text.replaceAll(
          this.encode(this.searchModel),
          (word) => `<span class="active-text">${word}</span>`
        );
      }

      return text;
    },
  },
};
</script>

<style lang="postcss">
.class-grade-container {
  .class-grade-box {
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
      .content-header {
        display: flex;
        justify-content: space-between;
        .search-box {
        }
        .operate-box {
        }
      }

      .box-card-wrapper {
        margin-top: 15px;
        display: flex;
        flex-wrap: wrap;

        .wrapper-item {
          width: calc(25% - 8px);
          flex-shrink: 0;
          margin-right: 10px;
          margin-bottom: 10px;

          .el-card__body {
            padding: 0;
          }

          &:nth-child(4n) {
            margin-right: 0;
          }

          .info-box {
            .info-header {
              display: flex;
              justify-content: space-between;
              padding-top: 15px;
              .header-title {
                padding-left: 10px;
                border-left: 3px solid rgb(33, 95, 224);
              }

              .header-operate {
                padding-right: 10px;
                .operate-icon {
                  cursor: pointer;

                  &:last-child {
                    margin-left: 10px;
                  }
                }
              }
            }

            .info-description {
              margin: 10px 0;
              height: 70px;
              overflow: hidden;
              white-space: normal;
              word-break: break-all;
              word-wrap: break-word;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              color: rgb(101, 112, 133);
              padding: 10px;
            }

            .update-time {
              display: flex;
              justify-content: space-between;
              padding: 0 10px;
              padding-bottom: 10px;
              color: rgb(175, 187, 198);
              border-bottom: 1px solid #f1f1f1;

              .update-time-label {
              }

              .update-time-text {
              }
            }

            .info-list {
              height: 460px;
              overflow: auto;
              .info-list-item {
                .item-label {
                  &.active {
                    background-color: rgb(246, 248, 250);
                  }

                  & > span {
                    display: block;
                    padding: 0 10px;

                    & > .el-button {
                      display: block;
                      width: 100%;
                      padding: 0;
                    }
                  }

                  .info-list-item-content {
                    display: flex;
                    justify-content: space-between;
                    height: 28px;
                    line-height: 28px;
                    color: rgb(51, 51, 51);

                    .item-content-text {
                      font-size: 13px;

                      .active-text {
                        color: #f00;
                        font-weight: 700;
                      }
                    }

                    .item-content-text-tag {
                      .el-icon-right {
                        margin-left: 5px;
                      }
                    }
                  }
                }
              }

              .info-list-empty {
                height: 100%;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #999;
                letter-spacing: 2px;
              }
            }
          }
        }
      }

      .list-empty {
        color: #999;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #f1f1f1;
        padding: 100px;
        margin-top: 20px;
        letter-spacing: 2px;
        font-size: 14px;
      }
    }
  }
}

.info-popover {
  .child-level-wrapper {
    border: 1px solid #f1f1f1;
    line-height: 30px;
    .edit-child-level {
      padding: 0 10px;
      border-bottom: 1px solid #f1f1f1;
      cursor: pointer;
    }
    .data-level {
      padding: 0 10px;
      border-bottom: 1px solid #f1f1f1;
      .data-level-title {
        color: #888;
      }
      .data-level-list {
        .data-level-list-item {
          display: flex;
          align-items: center;
          cursor: pointer;

          &.checked {
            color: #409eff;
            .level-check {
              display: inline-block;
            }
          }

          .class-level-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 8px;
            flex-shrink: 0;
          }
          .class-level-type {
            margin-right: 10px;
            flex-shrink: 0;
          }
          .class-level-label {
            margin-right: 10px;
            flex-shrink: 0;
            flex: 1;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
          }

          .level-check {
            display: none;
            flex-shrink: 0;
          }
        }
      }
    }
    .edit-current-level {
      padding: 0 10px;
      border-bottom: 1px solid #f1f1f1;
      cursor: pointer;
    }
    .delete-current-level {
      padding: 0 10px;
      cursor: pointer;
      color: #f56c6c;
    }
  }
}
</style>
