<template>
  <div class="app-container">

    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="erpInvoiceClassList"
    >
      <el-table-column label="银行记账单号" align="center" prop="yhjzdh"></el-table-column>
      <el-table-column label="公司代码" align="center" prop="bukrs"></el-table-column>
      <el-table-column label="业务模式" align="center" prop="zywms">
        <template slot-scope="scope">
          <span v-if="scope.row.zywms === 'A'">先收款后开票</span>
          <span v-else>先开票后收款</span>
        </template>
      </el-table-column>
      <el-table-column label="挂账" align="center" prop="zsfgz">
        <template slot-scope="scope">
          <span v-if="scope.row.pushStatus === 'S'">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="订单号" align="center" prop="aufnr"></el-table-column>
      <el-table-column label="班次名称" align="center" prop="className" width="200px"></el-table-column>
      <el-table-column label="发票金额" align="center" prop="fpe"></el-table-column>
      <el-table-column label="税额" align="center" prop="se"></el-table-column>
      <el-table-column label="发票净额" align="center" prop="fpje"></el-table-column>
      <el-table-column label="凭证号" align="center" prop="xblnr"></el-table-column>
      <el-table-column label="推送状态" align="center" prop="pushStatus" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.pushStatus == '1'">推送中</span>
          <span v-if="scope.row.pushStatus == '2'">重试推送中</span>
          <span v-if="scope.row.pushStatus == '3'">推送失败</span>
          <span v-if="scope.row.pushStatus == '4'">推送成功</span>
          <span v-else>未推送</span>
        </template>
      </el-table-column>
      <el-table-column label="推送结果" align="center" prop="pushResult" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="备注" align="center" prop="ktext"></el-table-column>
      <el-table-column label="推送时间" align="center" prop="pushTime" width="180"></el-table-column>
      <el-table-column label="备注" align="center" prop="ktext"></el-table-column>
      <el-table-column label="推送人" align="center" prop="createUser"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <!--<template slot-scope="scope">-->
        <!--<el-button size="mini"-->
        <!--type="text"-->
        <!--icon="el-icon-edit"-->
        <!--@click="handleUpdate(scope.row)"-->
        <!--v-hasPermi="['system:menu:edit']"-->
        <!--&gt;修改</el-button>-->
        <!--</template>-->
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { erpInvoice, erpClassInvoice } from '@/api/wx/order'

  export default {
    name: 'Menu',
    data() {
      return {
        activeName: '',
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        erpInvoiceClassList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {}
      }
    },
    created() {
      this.getList()
    },
    methods: {
      /** 查询菜单列表 */
      getList() {
        this.loading = true
        erpClassInvoice({ erpInvoiceId: this.$route.params.erpInvoiceId }).then(resp => {
          this.loading = false;
          this.erpInvoiceClassList = resp.rows
        })
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },
      // /** 修改按钮操作 */
      handleUpdate(row) {
        // this.reset();
        // this.getTreeselect();
        // getMenu(row.menuId).then(response => {
        //   this.form = response.data;
        //   this.open = true;
        //   this.title = "修改菜单";
        // });
      }
    }
  }
</script>
