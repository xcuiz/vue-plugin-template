/**
 * 列实体对象
 */
export default class Column {
  constructor({
    code = "",
    field = "",
    filterMode = "",
    fromTable = "",
    name = "",
    valueSource = "",
    checked = false,
    show = true,
  }) {
    this.code = code;
    this.field = field;
    this.filterMode = filterMode;
    this.fromTable = fromTable;
    this.name = name;
    this.valueSource = valueSource;
    this.checked = checked;
    this.show = show;
  }
}

export class ColumnType {
  // children 中的每一项都为 Column
  constructor({ code, name, children }) {
    this.code = code;
    this.name = name;
    this.children = children;
  }
}

export function createColumn(columnData) {
  return new Column({
    code: columnData.code,
    field: columnData.field,
    filterMode: columnData.filterMode,
    fromTable: columnData.fromTable,
    name: columnData.name,
    valueSource: columnData.valueSource,
    checked: columnData.checked === "1",
    show: true,
  });
}

export function createColumnType(columnTypeData) {
  const children = [];
  columnTypeData.children.map((child) => {
    children.push(createColumn(child));
  });
  return new ColumnType({
    code: columnTypeData.code,
    name: columnTypeData.name,
    children: children,
  });
}
