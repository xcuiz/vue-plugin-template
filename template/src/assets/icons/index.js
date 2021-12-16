/*
 * @Author: your name
 * @Date: 2020-04-14 16:47:05
 * @LastEditTime: 2020-06-04 15:30:22
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/assets/icons/index.js
 */ 
import '@/assets/icons/iconfont.js'
import '@/assets/icons/iconfont.css'

const requireAll = requireContext => requireContext.keys().map(requireContext)
const allSvg = require.context('.', false, /\.svg$/)
requireAll(allSvg)
