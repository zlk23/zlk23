<template>
  <div class="top-right-btn">
    <el-row>
      <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
        <el-button size="mini" circle icon="el-icon-search" @click="toggleSearch()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
        <el-button size="mini" circle icon="el-icon-refresh" @click="refresh()" />
      </el-tooltip>

        <el-popover
          placement="left-start"
          trigger="click"
          v-if="columns"
        >
          <ul class="infinite-list" style="overflow:auto; padding-inline-start: 0; max-height: 400px">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="value" @change="handleChange">
              <li v-for="column in columns" class="infinite-list-item" style="list-style-type:none;">
                <el-checkbox :label="column.key" :key="column.key">{{ column.label }}</el-checkbox>
              </li>
            </el-checkbox-group>
          </ul>
          <el-tooltip class="item" effect="dark" content="显隐列" placement="top" slot="reference">
            <el-button size="mini" circle icon="el-icon-menu" style="margin-left: 10px" @click="showColumn()" />
          </el-tooltip>
        </el-popover>
    </el-row>
  </div>
</template>
<script>
  export default {
    name: "RightToolbar",
    data() {
      return {
        // 显隐数据
        value: [],
        // 弹出层标题
        title: "显示/隐藏",
        // 是否显示弹出层
        open: false,
        checkAll: false,
        isIndeterminate: true
      };
    },
    props: {
      showSearch: {
        type: Boolean,
        default: true,
      },
      columns: {
        type: Array,
      },
    },
    created() {
      // 显隐列初始默认隐藏列
      for (let item in this.columns) {
        if (this.columns[item].visible === true) {
          this.value.push(this.columns[item].key);
        }
      }
      if (this.value.length === (this.columns || []).length) {
        this.checkAll = true;
        this.isIndeterminate = false;
      }
    },
    methods: {
      // 搜索
      toggleSearch() {
        this.$emit("update:showSearch", !this.showSearch);
      },
      // 刷新
      refresh() {
        this.$emit("queryTable");
      },
      handleCheckAllChange(val) {
        this.value = val ? (this.columns || []).map(item => item.key): [];
        this.isIndeterminate = false;
        this.dataChange(this.value);
      },
      handleChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === (this.columns || []).length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < (this.columns || []).length;
        this.dataChange(value);
      },
      // 列表元素变化
      dataChange(data) {
        for (let item in this.columns) {
          const key = this.columns[item].key;
          this.columns[item].visible = data.includes(key);
        }
      },
      // 打开显隐列dialog
      showColumn() {
        this.open = true;
      },
    },
  };
</script>
<style lang="scss" scoped>
  ::v-deep .el-transfer__button {
    border-radius: 50%;
    padding: 12px;
    display: block;
    margin-left: 0px;
  }
  ::v-deep .el-transfer__button:first-child {
    margin-bottom: 10px;
  }
</style>
