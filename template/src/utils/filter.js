// //重置查询条件
// export function resetListQuery() {
//   this.listQuery = Object.assign(this.listQuery, { startRow: 0 });
// }

// 列表查询
export function handleFilter(vals) {
  var that = this;
  delete that.listQuery.entid;
  delete that.listQuery.appid;
  if (that.filterOptions) {
    _.forEach(that.filterOptions, function (item) {
      var arr = _.split(item.sval, ",");
      arr.forEach((it) => {
        delete that.listQuery[it];
      });
      if (item.sval.includes("time")) {
        delete that.listQuery[item.sval + "Start"];
        delete that.listQuery[item.sval + "End"];
      }
    });
  }
  if (vals && vals.length === 2) {
    that.filterOption = vals[0];
    that.filterValue = vals[1];
    if (Array.isArray(that.filterValue)) {
      let filterValue2 = [];
      that.filterValue.forEach((val) => {
        let format = _.isDate(val) ? val.Format() : val;
        filterValue2.push(format);
      });
      var filterOptionArr = _.split(that.filterOption, ",");
      if (filterOptionArr.length > 1) {
        that.listQuery[filterOptionArr[0]] = filterValue2[0];
        that.listQuery[filterOptionArr[1]] = filterValue2[1];
      } else {
        that.listQuery[that.filterOption + "Start"] = filterValue2[0];
        that.listQuery[that.filterOption + "End"] = filterValue2[1];
      }
    } else if (vals[0].indexOf(",") === -1) {
      that.listQuery[that.filterOption] = that.filterValue;
    }
  }
  that.queryList();
}

// 列表查询
export function handleFilter2(listQuery) {
  var that = this;
  _.forEach(listQuery, function (val, key) {
    var filter = _.find(that.filterOptions, { sval: key });
    if (filter) {
      that.initOption = key;
      that.initValue = val;
    }
  });
  that.queryList(this.listQuery.current);
}

// 重置查询参数
export function resetListQuery() {
  this.listQuery = Object.assign(
    {},
    {
      current: this.listQuery.current,
      size: this.listQuery.size,
    }
  );
}

// 批量操作
export function handleBatch(val) {
  this.table.allSelections = val;
}

// tab切换事件监听
export function handleTabClick(item) {
  this.resetFilter();
  this.listQuery.label = item.paneName;
  this.queryList();
}

// 分页大小事件监听
export function handleSizeChange(val) {
  this.listQuery.size = val;
  this.queryList();
}

// 弹窗关闭确认
export function handleClose() {
  this.$confirm("确认关闭？").then(() => {
    // done()
  });
}

export function handleFilterOptionChange() {
  this.resetListQuery();
  this.filterValue = "";
}

export function handleCurrentChange(val) {
  this.listQuery.current = val;
  this.queryList(val);
}

export function resetFilter(val) {
  this.resetListQuery();
  this.filterValue = "";
  this.filterOption = val;
}

export function handleFilterChange(val) {
  this.filterOption = val;
}

export function handleReset() {
  _.forEach(this.filterOptions, function (item) {
    this.listQuery[item.sval] = "";
  });
  this.filterOption = this.initOption
    ? this.initOption
    : this.filterOptions[0]["sname"];
  this.filterValue = "";
}

export function getSelOptions(type) {
  var selMap = {
    status: [
      {
        sval: "0",
        sname: "正常",
      },
      {
        sval: "2",
        sname: "停用",
      },
    ],
    status2: [
      {
        sval: "0",
        sname: "启用",
      },
      {
        sval: "1",
        sname: "停用",
      },
    ],
  };
  return selMap[type] || [];
}
export function getSelLeave(type) {
  var selMap = {
    status: [
      {
        sval: "0",
        sname: "低危",
      },
      {
        sval: "1",
        sname: "中危",
      },
    ],
    status2: [
      {
        sval: "2",
        sname: "高危",
      },
    ],
  };
  return selMap[type] || [];
}

// 当天数据 isnew appUser
export function isToday(time) {
  return new Date().Format("yyyy-MM-dd") === time.split(" ")[0];
}
