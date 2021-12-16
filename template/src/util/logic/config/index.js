// 声明左右逻辑动作配置项数据
export const logicTypesConfig = {
	// 数据源
	source: {
		// 在source层级的校验
		required: ['sourceType'],
		// 自选数据层级校验
		source_origin: {
			required: ['sourceType', 'timeType', 'eqptDeviceType']
		},
		// 自定义数据绝对时间
		source_origin_absolute: {
			allFields: ['sourceType', 'timeType', 'startTime', 'endTime', 'dataCenter', 'eqptDeviceType'],
			required: ['sourceType', 'timeType', 'dataCenter', 'eqptDeviceType'],
			lang: '筛选绝对时间的自选数据来源'
		},
		// 自定义数据相对时间
		source_origin_relative: {
			allFields: ['sourceType', 'timeType', 'forwardD', 'backD', 'forwardH', 'backH', 'forwardMinute', 'backMinute', 'forwardS', 'backS', 'eqptDeviceType'],
			required: ['sourceType', 'timeType', 'eqptDeviceType'],
			lang: '筛选相对时间的自选数据来源'
		},
		source_event: {
			allFields: ['sourceType'],
			required: ['sourceType'],
			lang: '筛选事件数据来源'
		}
	},
	// 统计
	groupBy: {
		allFields: ['value'],
		required: ['value'],
		lang: '分类统计，根据"{value}"字段'
	},
	// 筛选条件
	filter: {
		allFields: ['value'],
		required: [],
		lang: `筛选检索"{value}"数据`
	},
	// 排序
	sort: {
		allFields: ['sortStat', 'field'],
		required: ['sortStat', 'field'],
		lang: '数据排序"{field}"{sort}',
		sortType: {
			'-': '降序',
			'+': '升序'
		}
	},
	// 标记变量
	variable: {
		allFields: ['value'],
		required: ['value'],
		lang: '标记变量"{0}"',
		// 变量类型枚举值
		variaTypeEum: ['top', 'last'],
		// 对value值校验
		variable_value: {
			required: ['name']
			// required: ['name', 'field', 'type', 'line']
		}
	},
	// 展示
	exhibit: {
		allFields: ['value'],
		required: ['value'],
		lang: '数据展示"{0}"',
		// 支持类型
		types: {
			pie: '饼图',
			table: '表格',
			bar: '柱图'
		}
	}
}
// visitor中用于判重过滤去掉的字段
export const $visitorFilterField = [
	'key',
	'error',
	'tableList',
	'parentVariableList', // 父级变量列表，hack方式
	'variableList', // 变量列表
	'quoteList' // 引用列表
]
// json树生成逻辑语句时，需要过滤掉属性
export const $filterHideFiled = [
	'addDisable',
	'pId',
	'type',
	'children',
	...$visitorFilterField
]


/*********错误类型定义**********************************************/
export const MISS_FIELDS = 'miss_fileds'
export const VARIABLE_VALUE_MISS_FIELDS = 'variable_value_miss_fileds'
export const VARIABALE_NAME_DUPLICATE = 'variable_name_duplicate'
export const VARIABLE_LINE_FORMAT_ERROR = 'variable_line_format_error'
export const FIELD_NOT_MATCH = 'field_not_match'
export const FILTER_QUOTE_ERROE = 'filter_quote_error'
export const PARENT_ERROR = 'parent_error'
export const FORMAT_ERROR = 'format_error'
export const EMPTY_ERROR = 'empty_error'
export const EXCUTE_ERROR = 'excute_error'
// 错误提示文本
export const $errorLang = {
	[PARENT_ERROR]: '父级或者祖级配置存在错误，请检查',
	[MISS_FIELDS]: '必填字段(值)缺失：{0}', // all
	[VARIABLE_VALUE_MISS_FIELDS]: '变量标记必填项字段缺失：{0}', // variable
	[VARIABALE_NAME_DUPLICATE]: '已经声明的标记名：{0}', // 变量名存在重名 （undo）  通知notifyError
	[VARIABLE_LINE_FORMAT_ERROR]: 'line格式错误，eg: top10, last5', // 变量line 格式错误
	[FIELD_NOT_MATCH]: '输入字段不存在：{0}', // sort groupBy filter（undo） variable 通知notifyError
	[FORMAT_ERROR]: '格式错误', // filter（undo）
	[FILTER_QUOTE_ERROE]: '筛选条件使用引用错误：{0}', // filter 通知notifyError
	[EMPTY_ERROR]: '请选择要操作的动作',
	[EXCUTE_ERROR]: '{0}' // 执行错误
}

/********** snippet代码片段 *****************************************************/
/* eslint-disable */
// source 数据源片段(@NOTE 代码片段文本请使用制表符长度2，禁用空格)
export const snippetText = '# source event\n\
snippet event\n\
	source:{\n\
		sourceType="event"\n\
	}\n\
# source origin absolute\n\
snippet absolute\n\
	source:{\n\
		sourceType="origin",\n\
		timeType="absolute",\n\
		dataCenter="${2}",\n\
		eqptDeviceType=["${1}"]\n\
		forwardD=${2:0},\n\
		forwardH=${3:0},\n\
		forwardMinute=${4:0},\n\
		backD=${5:0},\n\
		forwardS=${6:0},\n\
		backH=${7:0},\n\
		backS=${8:0}\n\
	}\n\
# source origin relative\n\
snippet relative\n\
	source:{\n\
		sourceType="origin",\n\
		timeType="relative",\n\
		eqptDeviceType=["${1}"],\n\
		startTime=${3:0},\n\
		endTime=${4:0},\n\
	}\n\
# source filter\n\
snippet filter\n\
	filter:${1:field} ${2:=} ${3:value}\n\
# source groupBy\n\
snippet groupBy\n\
	groupBy:["${1:field}","${2}"...]\n\
# source sort\n\
snippet sort\n\
	sort:${1:+}${2:field}\n\
# source variable\n\
snippet variable\n\
	variable:[{\n\
		name="${1:name}",\n\
		field="${2:field}",\n\
		line="${3:top}${4:1}"\n\
	}]\n\
# source exhibit\n\
snippet exhibit\n\
	exhibit:${1:table}\n\
# analysis\n\
snippet analysis\n\
	analysis[\n\
		source:{\n\
			sourceType="${1:event}"\n\
		}\n\
	]\n\
'
/* eslint-enable */