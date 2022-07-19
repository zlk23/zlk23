<template>
  <div class="app-container" v-loading="openLoading">
    <!--<el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">-->
    <!--<el-form-item label="菜单名称" prop="menuName">-->
    <!--<el-input-->
    <!--v-model="queryParams.menuName"-->
    <!--placeholder="请输入菜单名称"-->
    <!--clearable-->
    <!--size="small"-->
    <!--@keyup.enter.native="handleQuery"-->
    <!--/>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="状态" prop="status">-->
    <!--<el-select v-model="queryParams.status" placeholder="菜单状态" clearable size="small">-->
    <!--<el-option-->
    <!--v-for="dict in statusOptions"-->
    <!--:key="dict.dictValue"-->
    <!--:label="dict.dictLabel"-->
    <!--:value="dict.dictValue"-->
    <!--/>-->
    <!--</el-select>-->
    <!--</el-form-item>-->
    <!--<el-form-item>-->
    <!--<el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
    <!--<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          size="mini"
          @click="handleErpInvoiceerpInvoicePreview"
          v-has-permi="['wx:invoice:erpInvoicePreview']"
        >发票凭证预览
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          size="mini"
          @click="pushErpInvoice"
          v-has-permi="['wx:invoice:pushErpInvoice']"
        >发票推送ERP
        </el-button>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="erpInvoiceList"
    >
      <el-table-column label="序号" type="index" align="center"/>
      <el-table-column label="推送时间" align="center" prop="pushTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.pushTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推送人" align="center" prop="createUser"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleDetail(scope.row)"
            v-hasPermi="['wx:classInvoice:list']"
          >
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 发票凭证弹出层 -->
    <el-dialog title="发票凭证详细" :visible.sync="open" width="80%" append-to-body>
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
            <span v-if="scope.row.zsfgz === 'S'">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="订单号" align="center" prop="aufnr"></el-table-column>
        <el-table-column label="班次名称" align="center" prop="className" width="200px"></el-table-column>
        <el-table-column label="发票金额" align="center" prop="fpe"></el-table-column>
        <el-table-column label="税额" align="center" prop="se"></el-table-column>
        <el-table-column label="发票净额" align="center" prop="fpje"></el-table-column>
        <el-table-column label="凭证号" align="center" prop="xblnr"></el-table-column>
        <el-table-column label="推送状态" align="center" prop="pushStatus">
          <template slot-scope="scope">
            <span v-if="scope.row.pushStatus == '1'">推送中</span>
            <span v-if="scope.row.pushStatus == '2'">重试推送中</span>
            <span v-if="scope.row.pushStatus == '3'">推送失败</span>
            <span v-if="scope.row.pushStatus == '4'">推送成功</span>
            <span v-else>未推送</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false" type="primary">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { erpInvoice, pushErpInvoice, erpInvoiceerpInvoicePreview } from '../../../api/wx/order'

  export default {
    name: 'Menu',
    data() {
      return {
        activeName: '',
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 菜单表格树数据
        erpInvoiceList: [],
        erpInvoiceClassList: [],
        // 菜单树选项
        menuOptions: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        openLoading: false,
        open: false,
        form: {},
        rules: [],
        // 查询参数
        total: 0,
        queryParams: {
          pageNum: 1,
          pageSize: 10,
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      /** 查询菜单列表 */
      getList() {
        this.loading = true
        erpInvoice(this.queryParams).then(response => {
          console.log(response)
          this.erpInvoiceList = [...(response.rows || []).map(row => {
            return { ...row, children: [], hasChildren: true }
          })];
          this.total = response.total;
          this.loading = false
        })
      },
      restForm() {
        this.restForm('form')
      },
      //发票凭证预览
      handleErpInvoiceerpInvoicePreview() {
        this.openLoading = true;
        erpInvoiceerpInvoicePreview().then(resp => {
          this.openLoading = false;
          this.open = true;
          this.erpInvoiceClassList = resp.data || [];
        })
      },
      //推送发票数据到erp
      pushErpInvoice() {
        this.$confirm("确认推送", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          pushErpInvoice()
            .then(res => {
              if (res.code == 200) {
                this.msgSuccess("推送发票成功");
              } else {
                this.msgSuccess(res.msg);
              }
            })
            .catch(error => {
              this.msgSuccess("推送发票失败");
            });
        });
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
      handleDetail(row) {
        this.$router.push("/orderInvoiceProof/orderInvoiceProofDetail/" + row.id)
      }
    }
  }
</script>
