<template>
  <div class="holiday-config-container">
    <widget-group hide-shadow padding="10px 0 10px 0">
      <div class="holiday-config-header">
        <div class="holiday-config-title">节假日</div>
      </div>
      <div class="holiday-btn-panel">
        <div class="holiday-btn-search">
          <el-select v-model="search.type" size="mini">
            <el-option
              v-for="type of searchTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            ></el-option>
          </el-select>
          <div class="search-input">
            <el-tooltip content="按回车键 ⏎ 进行搜索" placement="top">
              <el-input
                v-model="search.value"
                size="mini"
                placeholder="请输入"
                suffix-icon="el-icon-search"
                @keyup.enter.native="searchList"
              />
            </el-tooltip>
          </div>
          <!-- <holiday-filter
            :init-value.sync="search.value"
            :init-type.sync="search.type"
            :filter-options="searchOptions">
          </holiday-filter> -->
        </div>
        <div class="holiday-btn-operate">
          <el-button size="mini" @click="addHolidayConfig">新增</el-button>
          <el-button size="mini" @click="deleteHolidayConfig">删除</el-button>
        </div>
      </div>
      <div class="holiday-config-table">
        <el-table
          :data="holidayTable.data"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          size="mini"
          stripe
          fit
          highlight-current-row
          @selection-change="holidayRowSelect"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="年份" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.holidayYear }}</span>
            </template>
          </el-table-column>
          <el-table-column label="名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="link-type" @click="editHolidayConfig(scope.row)">{{
                scope.row.name
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="假期" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.holiday }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.type }}</span>
            </template>
          </el-table-column>
          <el-table-column label="描述" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.holidayDesc | emptyCell }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="holiday-config-pagination">
        <!-- 分页 -->
        <idss-pagination
          background
          hide-on-single-page
          :table-data="holidayTable"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, prev, pager, next,sizes, jumper"
          @page-change="holidayPageChange"
          @size-change="holidaySizeChange"
        />
      </div>
    </widget-group>
    <div class="holiday-config-dialog">
      <el-dialog
        :close-on-click-modal="false"
        custom
        :title="dialogTitle"
        :visible="dialogVisible"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        @close="closeHoliday"
      >
        <el-form
          ref="holidayForm"
          size="mini"
          :model="holidayModel"
          :rules="holidayRules"
          label-width="100px"
          primary
        >
          <el-form-item label="类型:" prop="type">
            <el-radio v-model="holidayModel.type" label="1">假期</el-radio>
            <el-radio v-model="holidayModel.type" label="2">补班</el-radio>
          </el-form-item>
          <el-form-item label="名称:" prop="name">
            <el-input v-model="holidayModel.name" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="开始日期:" prop="startDate">
            <el-date-picker
              v-model="holidayModel.startDate"
              type="date"
              placeholder="开始日期"
              :picker-options="startPickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期:" prop="endDate">
            <el-date-picker
              v-model="holidayModel.endDate"
              type="date"
              placeholder="结束日期"
              :picker-options="endPickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="描述:" prop="holidayDesc">
            <el-input v-model="holidayModel.holidayDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="saveHoliday">
            保 存
          </el-button>
          <el-button size="small" @click="closeHoliday"> 取 消 </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import WidgetGroup from "@/components/widget-group";
import Day from "dayjs";
export default {
  name: "HolidayConfig",
  components: {
    WidgetGroup,
  },
  filters: {
    emptyCell(val) {
      if (typeof val === "number") {
        return val;
      }

      return val || "-";
    },
  },
  data() {
    return {
      holidayTable: {
        /* {
          // 年份
          holidayYear
          // 名称
          name
          // 假期
          holiday
          // 类型
          type
          // 描述
          holidayDesc
        } */
        data: [],
        pageSize: 20, // 分页数量
        pageNum: 1, // 当前页面位置
        total: 0, // 数据总数
      },
      // 选中的
      selected: [],
      searchTypes: [
        {
          label: "年份",
          value: "filter_EQS_holidayYear",
        },
      ],
      search: {
        // 查询条件类型
        type: "filter_EQS_holidayYear",
        // 查询条件的值
        value: "",
      },

      searchOptions: [
        {
          value: "年份",
          key: "1",
          stype: "datetime",
        },
      ],

      // add: 新增; edit: 编辑
      dialogType: "add",
      dialogVisible: false,
      startPickerOptions: {
        disabledDate: (time) => {
          const { endDate } = this.holidayModel;

          if (endDate) {
            return Day(endDate).valueOf() < time.getTime();
          }
        },
      },
      endPickerOptions: {
        disabledDate: (time) => {
          const { startDate } = this.holidayModel;

          if (startDate) {
            return Day(startDate).valueOf() > time.getTime();
          }
        },
      },
      editId: null,
      holidayModel: {
        // 唯一标识(修改时需传改值)
        // id,
        // 类型(1-假期 2-补班)
        type: "1",
        // 名称
        name: "",
        // 开始日期
        startDate: "",
        // 结束日期
        endDate: "",
        // 描述
        holidayDesc: "",
      },
      holidayRules: {
        type: [
          {
            required: true,
            message: "请输入类型",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
        ],
        startDate: [
          {
            required: true,
            message: "请输入开始日期",
            trigger: "blur",
          },
        ],
        endDate: [
          {
            required: true,
            message: "请输入结束日期",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    dialogTitle() {
      const type = {
        add: "新增",
        edit: "编辑",
      };

      return type[this.dialogType];
    },
  },
  created() {
    this.getHolidayConfig();
  },
  methods: {
    async getHolidayConfig() {
      const { pageNum, pageSize } = this.holidayTable;
      const { type, value } = this.search;
      try {
        const result = await this.$request({
          url: "/gov/api/sys/holiday/holidaycfg",
          method: "POST",
          data: {
            // 当前页
            pageNum,
            // 每页展示条数
            pageSize,
            // 查询条件类型
            type,
            // 查询条件的值
            value,
          },
        });
        if (result) {
          const { total, pageNum, pageSize, data } = result;

          this.holidayTable.pageSize = pageSize || 10;
          this.holidayTable.pageNum = pageNum || 1;
          this.holidayTable.total = total || 0;

          this.holidayTable.data = data || [];
        }
      } catch (e) {
        this.$message.error("获取节假日配置失败");
      }
    },
    searchList() {
      this.getHolidayConfig();
    },
    addHolidayConfig() {
      this.dailogTitle = "add";
      this.dialogVisible = true;
    },
    editHolidayConfig({ type, name, startDate, endDate, holidayDesc, id }) {
      this.dialogType = "edit";
      this.dialogVisible = true;

      // 编辑的时候需要将数据显示到对话框中
      this.holidayModel = {
        type: type === "假期" ? "1" : "2",
        // 名称
        name,
        // 开始日期
        startDate,
        // 结束日期
        endDate,
        // 描述
        holidayDesc,
      };

      this.editId = id;
    },
    async deleteHolidayConfig() {
      if (this.selected.length === 0) {
        this.$message.warning("请选择被删除的选项");
        return;
      }

      try {
        await this.$confirm(`是否删除选中的节假日?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });

        this.deleteHoliday();
      } catch (e) {
        this.$message({
          type: "info",
          message: "已取消删除节假日",
        });
      }
    },
    holidayRowSelect(selection) {
      this.selected = selection;
    },
    holidayPageChange({ pageNum }) {
      this.holidayTable.pageNum = pageNum;
      this.getHolidayConfig();
    },
    holidaySizeChange({ pageSize }) {
      this.holidayTable.pageSize = pageSize;
      this.getHolidayConfig();
    },
    closeHoliday() {
      this.resetDialogForm();
      this.dialogVisible = false;
    },
    /**
     * 重置新增节假日的表单
     */
    resetDialogForm() {
      this.$refs["holidayForm"].resetFields();
      this.holidayModel = {
        type: "1",
        // 名称
        name: "",
        // 开始日期
        startDate: "",
        // 结束日期
        endDate: "",
        // 描述
        desc: "",
      };
      this.editId = null;
    },
    saveHoliday() {
      this.$refs["holidayForm"].validate(async (valid) => {
        if (valid) {
          try {
            let body = this.holidayModel;
            if (this.dialogType === "edit") {
              body.id = this.editId;
            }

            await this.$request({
              url: "/gov/api/sys/holiday/saveoredit",
              method: "POST",
              data: body,
            });
            this.$message.success("保存节假日成功");

            // 重置表单数据以及状态
            this.closeHoliday();
            // 重新加载数据
            this.getHolidayConfig();

            this.dialogVisible = false;
          } catch (e) {
            this.$message.error("保存节假日失败");
          }
        }
      });
    },
    async deleteHoliday() {
      try {
        await this.$request({
          url: "/gov/api/sys/holiday/delete",
          method: "POST",
          data: {
            ids: this.selected.map(({ id }) => id + ""),
          },
        });

        this.getHolidayConfig();
        this.$message.success("删除节假日成功");
      } catch (e) {
        this.$message.error("删除节假日失败");
      }
    },
  },
};
</script>

<style lang="postcss">
.holiday-config-container {
  padding: 10px 15px;

  .holiday-config-header {
    .holiday-config-title {
      padding-top: 10px;
      padding-bottom: 20px;
      font-size: var(--font-size-16);
      font-weight: bold;
      line-height: 1;
    }
  }

  .holiday-btn-panel {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .holiday-btn-search {
      flex: 1;
      display: flex;

      .search-input {
        .el-input {
          width: 330px;
          margin-left: 10px;
        }
      }
    }

    .holiday-btn-operate {
      flex-shrink: 0;
    }
  }

  .holiday-config-table {
    margin-bottom: 10px;

    .link-type {
      cursor: pointer;
      color: var(--button-text-color);

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .holiday-config-pagination {
    .el-input--mini {
      .el-input__icon {
        line-height: 22px;
      }
    }
  }
}
</style>
