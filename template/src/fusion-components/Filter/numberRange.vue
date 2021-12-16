<!--
 * @Author: your name
 * @Date: 2020-08-11 17:53:41
 * @LastEditTime: 2020-08-12 15:48:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/fusion-components/Filter/numberRange.vue
-->
<template>
<el-form
  @submit.native.prevent
  :inline="true"
  :model="form"
  size="mini"
  ref="form"
  hide-required-asterisk
 
  :rules="rules">
    <el-form-item prop="num1">
      <el-input-number 
        size="mini"
        :precision="0"
        v-model="form.num1" 
        controls-position="right"
        @change="handleChange" 
        :min="0">
      </el-input-number>
    </el-form-item>
    <el-form-item prop="num2" label="至">
      <el-input-number 
        size="mini"
        :precision="0"
        v-model="form.num2" 
        controls-position="right"
        @change="handleChange" 
        :min="0">
      </el-input-number>
    </el-form-item>
</el-form>
</template>

<script>
export default {
  props:{
    value: {
      type:Array,
      default: []
    }
  },
  model:{
    prop: 'value',
    event: 'numChange'
  },
  data() {
    return {
      form:{
        num1: undefined,
        num2: undefined
      },
      rules:{
        num1:[{
          required: true,
          message: '请选择数量',
          trigger: 'change'
        },{
          validator:(rules,value, callback)=> {
            this.$refs.form.validateField('num2')
            if(value <= this.form.num2) {
              return callback()
            }
          },
          trigger: 'change',
        }],
        num2:[{
          required:true,
          trigger: 'change',
          message: '请选择数量'
        },{
          validator:(rules,value, callback)=> {
            // console.log(rules)
            if(value >= this.form.num1) {
              return callback()
            }
            callback(Error('第二个输入框需大于等于第一个输入框的值'))
          },
          trigger: 'change'
        }]
      }
    }
  },
  methods:{
    handleChange() {
      this.$refs.form.validate(valid =>{
        if(valid) {
          this.$emit('numChange', [this.form.num1, this.form.num2])
          this.$emit('change')
        }
      })
    }
  }
}
</script>

<style>
</style>