<script setup lang="ts">
import { Column, ElMessage } from 'element-plus';
import { ref, h, watch } from 'vue';
interface WorkSetting {
  type: number,
  date: number,
  year: number,
  month: number,
}

const props = defineProps({
  year: Number, month: Number, change: Number, setting: {
    type: Object,
    required: true,
  }
})
const word_setting: WorkSetting = {
  year: props.setting.year,
  month: props.setting.month,
  date: props.setting.date,
  type: props.setting.type,
}
const targetDate = new Date(word_setting.year, word_setting.month - 1, word_setting.date);

// type:1白班 2夜班 3下夜班 4日休
const week = ['一', '二', '三', '四', '五', '六', '日'];
const nowYear = ref(props.year!);
const nowMonth = ref(props.month!);
const maxRow = ref(6);
// const childWidth = 60;



const loadWordType = (date: number) => {
  if (!date) return 0;
  const dateObj = new Date(nowYear.value, nowMonth.value - 1, date);
  const _time = dateObj.getTime() - targetDate.getTime();
  var _day = _time / 3600 / 24000;
  var _a = _day % 4
  if (_a < 0) _a += 4;
  // console.log(_a);
  var _b = word_setting.type + _a
  // console.log(_a+', '+_b);
  return _b > 4 ? _b - 4 : _b;
}
const explainType = (type: number) => {
  switch (type) {
    case 1:
      return '白班';
    case 2:
      return '夜班';
    case 3:
      return '下夜班';
    case 4:
      return '日休';
    default:
      // console.log('错误: ' + type);
      return '错误';
  }
}

const handleClick = (value: number) => {
  console.log(loadWordType(value) + ', ' + explainType(loadWordType(value)));
  ElMessage({
    message: explainType(loadWordType(value)),
    type: 'success',
  })
}
const generateColumns = (prefix = 'column-', props?: any) =>
  week.map((value, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: value,
    title: value,
    // width: childWidth,
    align: "center",
    style: { fontSize: '13px' },
    class: "aabb",
    cellRenderer: (data: any) => {
      // console.log(data);
      const rowData = data.rowData;
      const column = data.column;
      const content = rowData[column.dataKey];
      // console.log(content);
      const explain = explainType(loadWordType(content));
      // h('div', ['hello', h('span', 'hello')])
      return h('div',
        {
          title: explain,
          class: content ? 'content' : 'empty',
          onClick: () => content ? handleClick(content) : null
        },
        // [content,h('span', 'aaa')]
        [content, content ? h('span', { class: "explain", style: { fontSize: '10px', color: 'grey' }, innerHTML: explain }) : null]

      );
      // '<el-button type = "danger" icon = "Delete" onClick = { handleDelete.bind(this, data) }>删除< /el-button>'
    }
  }))
const rowHeight = ref(60);
const height = ref(maxRow.value * rowHeight.value + rowHeight.value);
const generateData = (
  columns: ReturnType<typeof generateColumns>,
  prefix = 'row-'
) => {
  // 指定月第一天
  const firstDate = new Date(nowYear.value, nowMonth.value - 1, 1);
  // 指定月最后一天
  const lastDate = new Date(nowYear.value, nowMonth.value, 0);

  const firstWeek = firstDate.getDay();
  const emptyNum = firstWeek == 0 ? 6 : (firstWeek - 1);

  const allNum = emptyNum + lastDate.getDate();

  maxRow.value = Math.ceil(allNum / 7);

  height.value = rowHeight.value * (maxRow.value + 1);
  const length = maxRow.value;

  // console.log(`length=${length} ${allNum} ${height.value}`);

  return Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        const valueIndex = rowIndex * 7 + columnIndex + 1;
        rowData[column.dataKey] = (valueIndex > emptyNum && valueIndex <= allNum) ? valueIndex - emptyNum : ''
        return rowData
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      }
    );
  });

}
const columns = generateColumns()
// columns[5].colSpan = ({ rowIndex }) => (rowIndex % 4) + 1
columns[5].style.color = 'red';
columns[6].style.color = 'red';
//     border-right: var(--el-table-border);
columns[6].style.borderRight = 'var(--el-table-border)';
const data = ref(generateData(columns));
watch(() => props.change, (_newProps) => {
  word_setting.year = props.setting.year
  word_setting.month = props.setting.month
  word_setting.date = props.setting.date
  word_setting.type = props.setting.type
  targetDate.setFullYear(word_setting.year);
  targetDate.setMonth(word_setting.month - 1);
  targetDate.setDate(word_setting.date);
  console.log(word_setting);
  data.value = generateData(columns);
})
function tableRowClassName(param: {
  columns: Column<any>[]
  rowData: any
  rowIndex: number
}) {
  // console.log(param);
  return param.rowIndex % 2 == 0 ? 'content11' : 'content22';

}
</script>

<template>
  <el-card style="display: block;margin-left:0px;padding:0px;margin-top:10px;"
    :body-style="{ paddingLeft: '1vw', paddingRight: '1vw' }">
    <div class="title">{{ nowYear }} 年{{ nowMonth }} 月</div>
    <div class="parent11" :style="{ height: height + 'px', boxSizing: 'border-box' }">
      <el-auto-resizer>
        <template #default="{ height, width }">
          <el-table-v2 :row-class="tableRowClassName" :columns="columns" :data="data" :width="width" :height="height"
            :row-height="rowHeight" :class="['aa', 'bb', 'cc']" />
        </template>
      </el-auto-resizer>
    </div>
  </el-card>
</template>

<style scoped>
.title {
  margin-bottom: 8px;
  font-size: 20px;
  font: bold;
  text-align: center;
}

.parent11 {
  width: 99vw;
  max-width: 400px;
  min-width: 300px;
}

:deep(.el-table-v2__header-row) {
  border-top: var(--el-table-border);
}

:deep(.el-table-v2__header-cell) {
  /* justify-content: center; */
  /* border-right: var(--el-table-border); */
  border-left: var(--el-table-border);
  width: calc((100vw - 1px) / 7);
  /* box-sizing: border-box; */
}

:deep(.el-table-v2__row-cell) {
  justify-content: center;
  border-left: var(--el-table-border);
  width: calc((100vw - 1px) / 7);
}


:deep(.el-table-v2__table.el-table-v2__main) {
  margin-left: 0px;
}



:deep(.content) {
  /* width: 40px; */
  /* height: 200px; */
  align-content: center;
  text-align: center;
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  cursor: pointer;
  flex-direction: column;
  /* padding: 10px; */
}

:deep(.content:hover) {
  background-color: aquamarine;
}

:deep(.content11) {
  background-color: transparent;
}

:deep(.content22) {
  background-color: #ecf5ff
}
</style>
