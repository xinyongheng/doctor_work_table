<script setup lang="ts">
import { reactive, ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue'
import { FormInstance } from 'element-plus';
const word_setting = reactive({
  year: 2023,
  month: 7,
  date: 25,
  type: 2
})
const changeNum = ref(0);
const loading = ref(false);
const from = reactive<{ workDate: Date, wordType: string | null }>({
  workDate: new Date(word_setting.year, word_setting.month - 1, word_setting.date),
  wordType: word_setting.type.toString(),
})
const ruleFormRef = ref<FormInstance>()
const resetForm = () => {
  const formEl = ruleFormRef.value;
  if (!formEl) return;
  formEl.resetFields();
}
const onSubmit = async () => {
  loading.value = true
  const formEl = ruleFormRef.value;
  if (!formEl) {
    loading.value = false;
    return;
  }
  await formEl.validate((valid, _) => {
    if (valid) {
      console.log(from);
      word_setting.type = parseInt(from.wordType!);
      word_setting.year = from.workDate!.getFullYear()
      word_setting.month = from.workDate!.getMonth() + 1
      word_setting.date = from.workDate!.getDate()
      setTimeout(() => {
        changeNum.value += 1;
        console.log(word_setting);
        loading.value = false;
      }, 1000);
    } else {
      loading.value = false;
    }
  });
}
const nowDate = new Date();
function nextMonth(num: number) {
  var month = nowDate.getMonth() + num;
  var year = nowDate.getFullYear();
  if (month > 11) {
    year += 1;
    month = month - 12
  }
  return new Date(year, month, 1);
}
const dateArray = [
  nowDate, nextMonth(1), nextMonth(2), nextMonth(3)
]
</script>

<template>
  <div style="min-height: 30px;">
    <h3>排班计算</h3>
    <el-form label-width="120px" :model="from" ref="ruleFormRef">
      <el-form-item label="日期：" prop="workDate" :rules="[{ required: true, message: '请选择日期' }]">
        <el-date-picker v-model="from.workDate" type="date" placeholder="选择日期" size="large" />
      </el-form-item>
      <el-form-item label="排班：" prop="wordType" :rules="[{ required: true, message: '请选择排班' }]">
        <el-select v-model="from.wordType" placeholder="请选择排班">
          <el-option value="1" label="白班" />
          <el-option value="2" label="夜班" />
          <el-option value="3" label="下夜班" />
          <el-option value="4" label="日休" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="onSubmit">确认</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div style="flex-wrap: wrap;display: flex;width: 100vw;">
    <!-- type:1白班 2夜班 3下夜班 4日休 -->
    <HelloWorld :year="dateArray[0].getFullYear()" :month="dateArray[0].getMonth() + 1" :setting="word_setting"
      :change="changeNum" />
    <HelloWorld :year="dateArray[1].getFullYear()" :month="dateArray[1].getMonth() + 1" :setting="word_setting"
      :change="changeNum" />
    <HelloWorld :year="dateArray[2].getFullYear()" :month="dateArray[2].getMonth() + 1" :setting="word_setting"
      :change="changeNum" />
    <HelloWorld :year="dateArray[3].getFullYear()" :month="dateArray[3].getMonth() + 1" :setting="word_setting"
      :change="changeNum" />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}</style>
