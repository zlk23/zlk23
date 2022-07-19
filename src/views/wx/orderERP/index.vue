<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" size="mini">
      <el-form-item label="推送状态:" prop="erpStatus">
      <el-select v-model="queryParams.pushStatus" placeholder="推送状态" size="mini">
        <el-option label="全部" value=""></el-option>
        <el-option label="未推送" value="0"></el-option>
        <el-option label="已推送" value="4"></el-option>
        <el-option label="推送失败" value="3"></el-option>
      </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          size="mini"
          :disabled="false"
          v-hasPermi="['wx:erp:push']"
          @click="handlePush"
        >结算推送ERP</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionErpChange" >
      <el-table-column type="selection" width="55" align="center" show-summary="true" :selectable="checkSelectable" />
      <el-table-column label="序号" type="index" width="50" align="center"/>
      <el-table-column label="银行记账单号" align="center" prop="yhjzdh"/>
      <el-table-column label="收费主体" align="center" prop="bukrs" >
        <template slot-scope="scope">
          <p v-if="scope.row.bukrs=='5901'">学院</p>
          <p v-if="scope.row.bukrs=='5902'">电专</p>
        </template>
      </el-table-column>
      <el-table-column label="业务模式" align="center" prop="zywms" >
        <template slot-scope="scope">
          <p v-if="scope.row.zywms=='A'">先收款后开票</p>
          <p v-if="scope.row.zywms=='B'">先开票后收款</p>
        </template>
      </el-table-column>
      <el-table-column label="结算日期" align="center" prop="skrq" />
      <el-table-column label="结算金额" align="center" prop="skje" />
      <el-table-column label="笔数" align="center" prop="orders" />
      <el-table-column label="erp接收状态" align="center" prop="pushStatus" >
        <template slot-scope="scope">
          <span>{{ handlePushStateToChinese(scope.row.pushStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推送时间" align="center" prop="pushTime" />
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button @click="getDetailList(scope.row.id)" type="text" size="small">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="open" width="1200px" append-to-body>
      <el-table v-loading="detailLoading" :data="detailList" @selection-change="handleSelectionChange" >
        <el-table-column label="订单编号" align="center" prop="orderDetailId" width="180" />
        <el-table-column label="班次名称" align="center" prop="shortCourseName" width="180"/>
        <el-table-column label="姓名" align="center" prop="userName" />
        <el-table-column label="支付金额" align="center" prop="price" />
        <el-table-column label="缴费名称" align="center" prop="productName" width="100"/>
        <el-table-column label="联系方式" align="center" prop="mobilePhone" width="110"/>
        <el-table-column label="单位名称" align="center" prop="companyName" />
        <el-table-column label="支付时间" align="center" prop="payTime" width="180" />
        <el-table-column label="支付状态" align="center" prop="payStatus" >
          <template slot-scope="scope">
            <span>{{ scope.row.payStatus ==1 ? "已支付":"未支付" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易单号" align="center" prop="payId" width="140"/>
        <el-table-column label="付款方式" align="center" prop="payType" >
          <template slot-scope="scope">
            <span>{{ scope.row.payType ==2 ? "微信支付":"支付宝" }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="detailTotal>0"
        :total="detailTotal"
        :page-sizes="[50, 100, 150, 200]"
        :page.sync="queryDetailParams.pageNum"
        :limit.sync="queryDetailParams.pageSize"
        @pagination="getDetailList"
      />

    </el-dialog>

    <pagination
      v-show="total>0"
      :total="total"
      :page-sizes="[50, 100, 150, 200]"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
  import {
    querySummaryList, querySummaryDetailList, push
  } from "@/api/wx/order";
  import log from "../../monitor/job/log";

  export default {
    name: "Detail",
    components: {
    },
    data() {
      return {
        pickerOptions0: {
          disabledDate: (time) => {
            if (this.queryParams.endTime ) {
              console.log(time)
              console.log(this.queryParams.endTime)
              //console.log(new Date(this.queryInfo.endTime ))//如果开始时间不为空，则小于结束时间
              return new Date(this.queryParams.endTime ).valueOf() < time.getTime().valueOf()
            }
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            if (this.queryParams.startTime) {  //如果开始时间不为空，则结束时间大于开始时间
              //console.log(new Date(this.queryInfo.endTime ))
              return new Date(this.queryParams.startTime).valueOf() > time.getTime().valueOf()
            }
          }
        },
        disabled: false,
        // 遮罩层
        loading: true,
        detailLoading: true,
        // 选中数组
        ids: [],
        selection: [],
        merchantOptions:[],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 汇总总条数
        total: 0,
        // 详细总条数
        detailTotal: 0,
        //汇总表格数据
        list: [],
        // 订单详情表格数据
        detailList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        detailOpen: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 50,
          pushStatus:"",
          //startTime:"",
          //endTime:"",
          // payStatus: "1",
          // shortCourseName: null,
          // payId: null,
          // mobilePhone: null,
          // orderDetailId: null,
        },
        queryDetailParams: {
          pageNum: 1,
          pageSize: 50,
          //startTime:"",
          //endTime:"",
          // payStatus: "1",
          // shortCourseName: null,
          // payId: null,
          // mobilePhone: null,
          // orderDetailId: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      //表格多选限制
      checkSelectable(row) {
        //返回true则此条记录可选中
         return row.pushStatus != 4;
      },
      /** 查询汇总信息列表 */
      getList() {
        this.loading = true;
         querySummaryList(this.queryParams).then(response => {
           this.list = response.rows;
           this.total = response.total;
           this.loading = false;
         });
      },
      /** 查询汇总信息子列表 */
      getDetailList(id) {
        this.detailLoading = true;
        querySummaryDetailList(id).then(response => {
          this.detailList = response.rows;
          this.detailTotal = response.total;
          this.detailLoading = false;
          this.open = true
        });
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      //推送状态转文字
      handlePushStateToChinese(pushStatus) {
        switch (pushStatus) {
          case 0:
            return "未推送";
          case 1:
            return "推送中";
          case 2:
            return "推送重试中";
          case 3:
            return "推送失败";
          case 4:
            return "推送成功";
        }
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionErpChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length == 1
        this.multiple = !selection.length
      },
      handlePush() {
         const id = this.ids;
         push(id).then(response => {
         this.getList();
        });
      },
    }
  };
</script>
