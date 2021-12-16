.
├── cvc                             合规检测
│   ├── desensitize                     涉敏模糊化
│   ├── operate                         涉敏操作
│   ├── permission                      涉敏权限
│   ├── privacy                         APP隐私保护
│   └── treasury-control                金库管控
├── police                          敏感数据分类分级策略
│   ├── customer                        客户信息
│   ├── management                      管理信息
│   └── network                         网络信息
├── asset                            数据资产
│   ├── data-source-detect               数据库资源探测 （1、发现探针管理，2、发现任务管理，3、发现模板管理）
│   │   ├── source-detect-probe              发现探针管理 
│   │   ├── source-detect-task               发现任务管理 （任务启停，任务详情，任务运行状态等，）
│   │   └── source-detect-template            发现模板管理 
│   ├── data-source                      数据资源 
│   │   ├── data-source-list                 数据资源清单 
│   │   ├── data-source-claim                数据资源认领，包括待认领数据清单
│   │   ├── data-source-etl                  数据资源抽取配置规则（etl），数据同步模块
│   │   └── data-source-property             数据资源扩展属性配置 
│   ├── sensitive-data-detect            敏感数据检测
│   │   ├── sensitive-data-probe             敏感数据探针管理 
│   │   └── sensitive-data-task              敏感数据任务管理 （任务启停，任务详情，任务运行状态等，）
│   ├── sensitive-data                   敏感数据
│   │   ├── sensitive-data-list              敏感数据清单（新增修改，详情，删除，查询等）
│   │   ├── sensitive-data-record            敏感数据备案（技术备案，人工备案）
│   │   └── sensitive-data-claim             敏感数据认领
│   ├── monitor                          数据监控
│   │   ├── sensitive-data-monitor           涉敏资产新增监控
│   │   ├── asset-destroy-monitor            资产销毁监控
│   │   ├── asset-content-monitor            资产内容变更监控   
│   │   ├── asset-authorize-monitor          资产授权变更监控
│   │   └── access-authorize-monitor         访问关系变更监控
└── survey                          敏感资源测绘
    ├── blood-relation-detect           血缘关系检测
    ├── data-map                        敏感数据地图
    └── datasource-identify             敏感数据源鉴别