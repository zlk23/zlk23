<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" size="mini" @submit.native.prevent>
      <!--<el-form-item label="班次编号" prop="shortClassId">-->
        <!--<el-input-->
          <!--v-model="queryParams.shortClassId"-->
          <!--placeholder="请输入班次名称"-->
          <!--clearable-->
          <!--@keyup.enter.native="handleQuery"-->
        <!--/>-->
      <!--</el-form-item>-->
      <el-form-item label="班次名称" prop="shortClassName">
        <el-input
          v-model="queryParams.shortClassName"
          placeholder="请输入班次名称"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="voidInvoiceRateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="班次编号" align="center" prop="shortClassId"/>
      <el-table-column label="班次名称" align="center" prop="shortClassName"/>
      <el-table-column label="开票数量" align="center" prop="amount"/>
      <el-table-column label="废票数量" align="center" prop="voidAmount"/>
      <el-table-column label="废票率" align="center" prop="rate"/>
      <!--<el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
      <!--<template slot-scope="scope">-->
      <!--<el-button-->
      <!--size="mini"-->
      <!--type="text"-->
      <!--icon="el-icon-edit"-->
      <!--@click="handleUpdate(scope.row)"-->
      <!--v-hasPermi="['wx:shuffling:edit']"-->
      <!--&gt;修改-->
      <!--</el-button>-->
      <!--</template>-->
      <!--</el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
  import {
    getVoidInvoiceRateList
  } from '@/api/wx/invoice'

  export default {
    name: 'index',
    components: {},
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 总条数
        total: 0,
        // 电专老师表格数据
        voidInvoiceRateList: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          shortClassId: null,
          shortClassName: null,
        }
      }
    },
    created() {
    },
    mounted() {
      this.getList()
    },
    methods: {
      /** 查询电专老师列表 */
      getList() {
        this.loading = true
        getVoidInvoiceRateList(this.queryParams).then(response => {
          this.voidInvoiceRateList = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      }
    }
  }
</script>
