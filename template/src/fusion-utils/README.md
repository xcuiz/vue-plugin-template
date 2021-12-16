# fusion-utils

前端工具库 -- 工具函数集结地（无需安装其他依赖）

## 安装方式

采用 `npm install <git repo url>` 方式
```shell
$ npm install git+ssh://git@10.10.10.8:IDSS-FE/fusion-utils.git --save
```

## 目录结构说明

原则：
1. 对于第三方依赖，将源码集成到相应模块**libs**下，如 *merge/libs*
2. 单元测试
3.
4. 文件，按照功能进行拆分，如：


```
├── git                         Git Commits & Hooks相关
├── src                         源码
│   ├── uitl1-floder            
│   │   ├── libs                自定义工具方法依赖（源码）
│   │   └── index.js            自定义工具包1
│   ├── util2.js                自定义工具包2
│   └──...                     
├── tests                       单元测试用例
│   └── unit          
│       ├── util1.spec.js       自定义工具包1单元测试用例
│       ├── util2.spec.js       自定义工具包2单元测试用例
│       └── ...                 
├── .babelrc                    babel 相关配置
├── .eslintrc.js                eslint 相关配置
├── .gitignore                  git 忽略相关配置
├── npm-shrinkwrap.json         npm锁定包管理
├── package.json                版本依赖等
└── README.md                   
```


- 前缀统一控制，并且外部可修改
- 分类？
    - objects   isType
    - collections   shuffle
    - functions     before、after、merge、debounce、throttle
    - formate       formateData  
    - dom
- 引入方式 npm/amd/ - npm 安装？
- 版本管理
- 构建方式
- 和v-filter结合
- 单元测


1. 外部依然使用「别名」引用
2. 通用的进入「fusion-utils」，特定的保持在自己内部
3. 分类：
├── objects（对象操作方法）       isType(isFuntion、isObject、isBoolean、isNumber)、getPropValue
├── collections（集合操作方法）   shuffle、treeToList（数组扁平化）
├── functions（函数操作方法）     before、after、merge、debounce、throttle
├── formates（格式化方法）        formateData、formatNumber、formatTimeToText、formatByte
├── safeties（安全类方法）        $xss、password（generatePwd,validatePwd、aesEncrypt、aesDecrypt）
└── customs （和业务相关，再按照具体类别切割）   
       ├── 全屏
       ├── topdf
       ├── colors（gradientColor、color2Rgb）
       ├── file（upload、download）
       ├── empty-data（暂无数据）
       └── length（charCodeLength、computeWid）

类似：handleWords、checkFormatter、dataScale 依然放到fusion-charts中

bus.js

- 依赖第三方的方式，不使用npm install，直接通过追加libs
