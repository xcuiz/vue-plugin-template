/**
 * 过滤器实体对象
 */
export default class Filter {
  constructor({
    code = "",
    name = "",
    filterMode = "",
    sourceValue = "",
    checked = false,
    recoverData = null,
    status = null,
    unit = "",
    leftMin = -Infinity,
    rightMin = -Infinity,
  }) {
    this.code = code;
    this.name = name;
    this.filterMode = filterMode;
    this.sourceValue = sourceValue;
    this.checked = checked;
    this.recoverData = recoverData;
    this.status = status;
    this.unit = unit;
    this.leftMin = leftMin;
    this.rightMin = rightMin;
  }
}

export class FilterType {
  // children 中的每一项都为 Filter
  constructor({ code, name, children }) {
    this.code = code;
    this.name = name;
    this.children = children;
  }
}

export function createFilter(filterData) {
  return new Filter({
    code: filterData.code,
    name: filterData.name,
    filterMode: filterData.filterMode,
    sourceValue: filterData.sourceValue,
    checked: false,
    recoverData: null,
    status: null,
    unit: filterData.unit,
    leftMin: filterData.leftMin,
    rightMin: filterData.rightMin,
  });
}

export function createFilterType(filterTypeData) {
  const children = [];
  filterTypeData.children.map((child) => {
    children.push(createFilter(child));
  });
  return new FilterType({
    code: filterTypeData.code,
    name: filterTypeData.name,
    children: children,
  });
}
