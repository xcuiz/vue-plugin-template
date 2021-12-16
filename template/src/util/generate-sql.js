const formatSQL = function (data) {
  const notValue = ["is Null", "is Not Null"];
  const inOperator = ["in", "not in"];
  let sql = "";
  if (Array.isArray(data.children) && data.children.length > 0) {
    for (let i = 0, length = data.children.length; i < length; i++) {
      const item = data.children[i];
      if (Array.isArray(item.children)) {
        // 如果是数组， 条件嵌入
        if (item.children.length > 0) {
          // 如果该 children 生成的 sql 是空的(说明用户只增加了空的过滤项， 但没有具体设置)， 则不追加到 sql 上
          const str = formatSQL(item);
          if (str.length > 0) {
            sql += `${i !== 0 && sql ? data.ruleType : ""} (${str}) `;
          }
        }
      } else {
        let value;
        switch (item.dataType) {
          case "integer":
          case "long":
          case "double":
            value = item.value;
            break;
          case "string":
          case "ip":
            value = Array.isArray(item.value)
              ? item.value.map((val) => "'" + val + "'").join(",")
              : `'${item.value}'`;
            break;
          default:
            // 没有选择 跳过此次循环
            continue;
        }

        let operatorString;
        if (notValue.includes(item.operator)) {
          // 处理 is Null 和 is Not Null
          operatorString = item.operator;
        } else if (inOperator.includes(item.operator)) {
          // 处理 in 和 not in
          operatorString = `${item.operator} ( ${value} )`;
        } else {
          // 普通的运算符
          operatorString = `${item.operator} ${value}`;
        }
        sql += `${i !== 0 && sql ? data.ruleType : ""} ${
          item.field
        } ${operatorString} `;
      }
    }
  }

  return sql.trim();
};

export default formatSQL;
