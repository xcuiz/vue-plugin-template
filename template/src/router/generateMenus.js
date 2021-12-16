/*
 * @Author: your name
 * @Date: 2020-04-14 16:47:05
 * @LastEditTime: 2020-07-01 10:41:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/router/generateMenus.js
 */
export default function (routers) {
  const test = JSON.parse(JSON.stringify(routers));
  function cherry(tree) {
    const arr = [];
    tree.forEach((val) => {
      let router = {
        name: val.name,
        meta: {
          title: val.meta.title,
          manageFree: !!val.meta.manageFree,
        },
      };
      if (val.children) {
        router.children = cherry(val.children);
      }
      arr.push(router);
    });
    return arr;
  }
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(cherry(test)));
}
