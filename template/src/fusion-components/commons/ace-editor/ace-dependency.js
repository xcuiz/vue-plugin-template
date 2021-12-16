/*
 * @Author: your name
 * @Date: 2020-10-10 18:17:20
 * @LastEditTime: 2020-10-28 14:58:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/components/commons/ace-editor/ace-dependency.js
 */
import { config } from 'ace-builds'
config.set(
  'basePath',
  'ace-builds/src-noconflict/'
)
/* eslint-disable */
config.setModuleUrl('ace/ext/beautify', require('file-loader?esModule=false&outputPath=ace-dependency!file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/ext-beautify.js'))
config.setModuleUrl('ace/ext/code_lens', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/ext-code_lens.js'))
config.setModuleUrl('ace/ext/elastic_tabstops_lite', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/ext-elastic_tabstops_lite.js'))
config.setModuleUrl('ace/ext/emmet', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/ext-emmet.js'))
config.setModuleUrl('ace/ext/error_marker', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/ext-error_marker.js'))
config.setModuleUrl('ace/ext/keyboard_menu', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/ext-keybinding_menu.js'))
config.setModuleUrl('ace/ext/language_tools', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/ext-language_tools.js'))
config.setModuleUrl('ace/ext/linking', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/ext-linking.js'))
config.setModuleUrl('ace/ext/modelist', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/ext-modelist.js'))
config.setModuleUrl('ace/ext/options', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/ext-options.js'))
config.setModuleUrl('ace/ext/prompt', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/ext-prompt.js'))
config.setModuleUrl('ace/ext/rtl', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/ext-rtl.js'))
config.setModuleUrl('ace/ext/searchbox', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/ext-searchbox.js'))
config.setModuleUrl('ace/ext/settings_menu', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/ext-settings_menu.js'))
config.setModuleUrl('ace/ext/spellcheck', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/ext-spellcheck.js'))
config.setModuleUrl('ace/ext/split', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/ext-split.js'))
config.setModuleUrl('ace/ext/static_highlight', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/ext-static_highlight.js'))
config.setModuleUrl('ace/ext/statusbar', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/ext-statusbar.js'))
config.setModuleUrl('ace/ext/textarea', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/ext-textarea.js'))
config.setModuleUrl('ace/mode/css', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/mode-css.js'))
config.setModuleUrl('ace/mode/html', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/mode-html.js'))
config.setModuleUrl('ace/mode/javascript', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/mode-javascript.js'))
config.setModuleUrl('ace/mode/json', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/mode-json.js'))
config.setModuleUrl('ace/mode/json5', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/mode-json5.js'))
config.setModuleUrl('ace/mode/markdown', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/mode-markdown.js'))
config.setModuleUrl('ace/mode/svg', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/mode-svg.js'))
config.setModuleUrl('ace/mode/text', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/mode-text.js'))
config.setModuleUrl('ace/mode/typescript', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/mode-typescript.js'))
config.setModuleUrl('ace/mode/xml', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/mode-xml.js'))
config.setModuleUrl('ace/mode/css_worker', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/worker-css.js'))
config.setModuleUrl('ace/mode/html_worker', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/worker-html.js'))
config.setModuleUrl('ace/mode/javascript_worker', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/worker-javascript.js'))
config.setModuleUrl('ace/mode/json_worker', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/worker-json.js'))
config.setModuleUrl('ace/mode/xml_worker', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/worker-xml.js'))
config.setModuleUrl('ace/theme/chrome', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/theme-chrome.js'))
config.setModuleUrl('ace/theme/solarized_dark', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/theme-solarized_dark.js'))
config.setModuleUrl('ace/theme/xcode', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/theme-xcode.js'))
config.setModuleUrl('ace/theme/github', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/theme-github.js'))
config.setModuleUrl('ace/theme/tomorrow', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/theme-tomorrow.js'))
config.setModuleUrl('ace/theme/tomorrow_night', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/theme-tomorrow_night.js'))
config.setModuleUrl('ace/snippets/css', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/snippets/css.js'))
config.setModuleUrl('ace/snippets/html', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/snippets/html.js'))
config.setModuleUrl('ace/snippets/javascript', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/snippets/javascript.js'))
config.setModuleUrl('ace/snippets/json', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/snippets/json.js'))
config.setModuleUrl('ace/snippets/json5', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/snippets/json5.js'))
config.setModuleUrl('ace/snippets/svg', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/snippets/svg.js'))
config.setModuleUrl('ace/snippets/typescript', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/snippets/typescript.js'))
config.setModuleUrl('ace/snippets/xml', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/snippets/xml.js'))
config.setModuleUrl('ace/snippets/python', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/snippets/python.js'))
config.setModuleUrl('ace/snippets/java', require('file-loader?esModule=false&outputPath=ace-dependency!ace-builds/src-noconflict/snippets/java.js'))

/* eslint-enable */
