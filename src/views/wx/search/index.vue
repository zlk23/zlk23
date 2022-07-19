<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" size="mini">
      <el-form-item label="商户名称" prop="merchantName">
        <el-input
          v-model="queryParams.merchantName"
          placeholder="请输入商户名称"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单编号" prop="orderDetailId">
        <el-input
          v-model="queryParams.orderDetailId"
          placeholder="请输入订单编号"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="班次名称" prop="shortCourseName">
        <el-input
          v-model="queryParams.shortCourseName"
          placeholder="请输入班次名称"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="班级名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入班级名称"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入姓名"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系方式" prop="mobilePhone">
        <el-input
          v-model="queryParams.mobilePhone"
          placeholder="请输入联系方式"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单位名称" prop="companyName">
        <el-input
          v-model="queryParams.companyName"
          placeholder="请输入单位名称"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="支付时间" prop="startTime">
        <el-date-picker
          v-model="queryParams.startTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
          placeholder="选择开始时间" :picker-options="pickerOptions0" size="mini">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="-" prop="endTime">
        <el-date-picker
          v-model="queryParams.endTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="23:59:59"
          placeholder="选择结束时间" :picker-options="pickerOptions1" size="mini">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="支付状态" prop="payStatus" v-if="moreSearch">
        <el-select v-model="queryParams.payStatus" placeholder="支付状态" clearable size="mini">
          <el-option label="已支付" value="1"></el-option>
          <el-option label="未支付" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发票推送状态" prop="state" v-if="moreSearch">
        <el-select v-model="queryParams.state" placeholder="开票状态" clearable size="mini">
          <el-option label="未推送未开票" value="0"></el-option>
          <el-option label="推送中" value="1"></el-option>
          <el-option label="已推送已开票" value="2"></el-option>
          <el-option label="推送开票失败" value="3"></el-option>
          <el-option label="已作废重开票" value="4"></el-option>
          <el-option label="推送作废失败" value="5"></el-option>
          <el-option label="快递地址异常" value="6"></el-option>
          <el-option label="已作废不开票" value="7"></el-option>
          <el-option label="已退费不开票" value="8"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开票类型" prop="invoiceType" v-if="moreSearch">
        <el-select v-model="queryParams.invoiceType" placeholder="开票类型" clearable size="mini">
          <el-option label="专票" value="FPKJ_004"></el-option>
          <el-option label="普票" value="FPKJ_007"></el-option>
          <el-option label="电子普票" value="FPKJ_026"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开票时间" prop="startKprq" v-if="moreSearch">
        <el-date-picker
          v-model="queryParams.kprqstartTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
          placeholder="选择开始时间" :picker-options="pickerOptions2" size="mini">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="-" prop="endKprq" v-if="moreSearch">
        <el-date-picker
          v-model="queryParams.kprqendTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="23:59:59"
          placeholder="选择结束时间" :picker-options="pickerOptions3" size="mini">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="发票号码" prop="fphm" v-if="moreSearch">
        <el-input
          v-model="queryParams.fphm"
          placeholder="请输入发票号码"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="运单编号" prop="waybillNo" v-if="moreSearch">
        <el-input
          v-model="queryParams.waybillNo"
          placeholder="请输入运单编号"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="快递推送状态" prop="status" v-if="moreSearch">
        <el-select v-model="queryParams.status" placeholder="请选择推送状态" clearable size="mini">
          <el-option label="未推送" value="0"></el-option>
          <el-option label="推送成功" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发货状态" prop="sendStatus" v-if="moreSearch">
        <el-select v-model="queryParams.sendStatus" placeholder="请选择发货状态" clearable size="mini">
          <el-option label="未发货" value="0"></el-option>
          <el-option label="已发货" value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button v-if="!moreSearch" size="mini" icon="el-icon-caret-bottom" @click="handleMore">更多搜索</el-button>
        <el-button v-else size="mini" icon="el-icon-caret-top" @click="handleMore">收起搜索</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>

      <!--<el-button type="primary">更多<i class="el-icon-caret-bottom"></i></el-button>-->
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-has-permi="['wx:integrated:export']"
          :loading="exportLoading"
        >
          导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="searchList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" min-width="55" align="center"/>
      <el-table-column type="index" label="序号" min-width="55" align="center" v-if="columns[0].visible"/>
      <el-table-column label="商户名称" align="center" prop="merchantName" v-if="columns[1].visible" min-width="160"/>
      <el-table-column label="订单编号" align="center" prop="orderDetailId" v-if="columns[2].visible" min-width="140"/>
      <el-table-column label="班次名称" align="center" prop="shortCourseName" v-if="columns[3].visible" min-width="180"></el-table-column>
      <el-table-column label="班级名称" align="center" prop="name" v-if="columns[4].visible" min-width="180"></el-table-column>
      <el-table-column label="姓名" align="center" prop="userName" v-if="columns[5].visible" min-width="80"></el-table-column>
      <el-table-column label="联系方式" align="center" prop="mobilePhone" v-if="columns[6].visible" min-width="120"></el-table-column>
      <el-table-column label="单位名称" align="center" prop="companyName" v-if="columns[7].visible" min-width="140"></el-table-column>
      <el-table-column label="费用名称" align="center" prop="productName" v-if="columns[8].visible" :show-overflow-tooltip="true" min-width="80"></el-table-column>
      <el-table-column label="支付金额" align="center" prop="price" v-if="columns[9].visible" :show-overflow-tooltip="true" min-width="100"></el-table-column>
      <el-table-column label="支付时间" align="center" prop="payTime" v-if="columns[10].visible" :show-overflow-tooltip="true" min-width="180"></el-table-column>
      <el-table-column label="付款方式" align="center" prop="payType" v-if="columns[11].visible" :show-overflow-tooltip="true" min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.payType == 1 ? '银联支付': scope.row.payType == 2 ? '微信支付': scope.row.payType == 3 ? '支付宝': scope.row.payType == 5 ? '微信支付': '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付状态" align="center" prop="payStatus" v-if="columns[12].visible" :show-overflow-tooltip="true" min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.payStatus == '1' ? '已支付' : '未支付' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="发票类型" align="center" prop="invoiceType" v-if="columns[13].visible" min-width="100">
        <template slot-scope="scope">
          <p v-if="scope.row.invoiceType=='FPKJ_004'">专票</p>
          <p v-if="scope.row.invoiceType=='FPKJ_007'">普票</p>
          <p v-if="scope.row.invoiceType=='FPKJ_026'">电子普票</p>
        </template>
      </el-table-column>
      <el-table-column label="发票抬头" align="center" prop="title" v-if="columns[14].visible" min-width="140"></el-table-column>
      <el-table-column label="税号" align="center" prop="taxNumber" v-if="columns[15].visible" min-width="120"></el-table-column>
      <el-table-column label="单位地址" align="center" prop="companyAddress" v-if="columns[16].visible" min-width="220"></el-table-column>
      <el-table-column label="电话号码" align="center" prop="telephone" v-if="columns[17].visible" min-width="120"></el-table-column>
      <el-table-column label="开户银行" align="center" prop="bankName" v-if="columns[18].visible" min-width="120"></el-table-column>
      <el-table-column label="银行账户" align="center" prop="bankAccount" v-if="columns[19].visible" min-width="120"></el-table-column>
      <el-table-column label="发票推送状态" align="center" prop="state" v-if="columns[20].visible" min-width="120">
        <template slot-scope="scope">
          <span>{{ handlePushStateToChinese(scope.row.state) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开票状态" align="center" prop="msg" v-if="columns[21].visible" min-width="120"></el-table-column>
      <el-table-column label="开票日期" align="center" prop="kprq" v-if="columns[22].visible" min-width="180"></el-table-column>
      <el-table-column label="发票号码" align="center" prop="fphm" v-if="columns[23].visible" min-width="120"></el-table-column>
      <el-table-column label="原发票号码" align="center" prop="oldfphm" v-if="columns[24].visible" min-width="120"></el-table-column>
      <el-table-column label="发票代码" align="center" prop="fpdm" v-if="columns[25].visible" min-width="120"></el-table-column>
      <el-table-column label="原发票代码" align="center" prop="oldfpdm" v-if="columns[26].visible" min-width="120"></el-table-column>
      <el-table-column label="发票备注" align="center" prop="invoiceMark" v-if="columns[27].visible" :show-overflow-tooltip="true" min-width="120"></el-table-column>
      <el-table-column label="发票凭证状态" align="center" prop="pushErp" v-if="columns[28].visible" min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.pushErp == '1'">已推送</span>
          <span v-if="scope.row.pushErp == '0'">未推送</span>
        </template>
      </el-table-column>

      <el-table-column label="收件人姓名" align="center" prop="receiverName" v-if="columns[29].visible" min-width="120"></el-table-column>
      <el-table-column label="收件人电话" align="center" prop="receiverMobile" v-if="columns[30].visible" min-width="120"></el-table-column>
      <el-table-column label="收件地址" align="center" prop="recipientsAddress" v-if="columns[31].visible" :show-overflow-tooltip="true" min-width="120">
        <template slot-scope="scope">
          <span>{{handleAddressAppend(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="快递推送状态" align="center" prop="status" v-if="columns[32].visible" min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.status == '1'">推送成功</span>
          <span v-else>未推送</span>
        </template>
      </el-table-column>
      <el-table-column label="发货状态" align="center" prop="sendStatus" v-if="columns[33].visible" min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.sendStatus == '1'">已发货</span>
          <span v-else>未发货</span>
        </template>
      </el-table-column>
      <el-table-column label="快递公司" align="center" prop="companyCode" v-if="columns[34].visible" min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.companyCode === null">暂未发货</span>
          <span v-else>{{ scope.row.companyCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运单编号" align="center" prop="waybillNo" v-if="columns[35].visible" min-width="120"></el-table-column>
      <el-table-column label="原运单编号" align="center" prop="oldWaybillNo" v-if="columns[36].visible" min-width="120"></el-table-column>
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
  import { listIntegratedQuery, exportIntegratedExcel } from '@/api/wx/search';

  export default {
    name: 'index',
    data() {
      return {
        exportLoading: false,
        pickerOptions0: {
          disabledDate: (time) => {
            if (this.queryParams.endTime) {
              //console.log(new Date(this.queryInfo.endTime ))//如果开始时间不为空，则小于结束时间
              return new Date(this.queryParams.endTime).valueOf() < time.getTime().valueOf()
            }
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            if (this.queryParams.startTime) {
              //如果开始时间不为空，则结束时间大于开始时间
              return new Date(this.queryParams.startTime).valueOf() > time.getTime().valueOf()
            }
          }
        },
        pickerOptions2: {
          disabledDate: (time) => {
            if (this.queryParams.endKprq) {
              //如果开始时间不为空，则小于结束时间
              return new Date(this.queryParams.endKprq).valueOf() < time.getTime().valueOf()
            }
          }
        },
        pickerOptions3: {
          disabledDate: (time) => {
            if (this.queryParams.startKprq) {
              //如果开始时间不为空，则结束时间大于开始时间
              return new Date(this.queryParams.startKprq).valueOf() > time.getTime().valueOf()
            }
          }
        },
        //更多搜索展示
        moreSearch: false,
        disabled: false,
        leftDisabled: true,
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 综合查询表格数据
        searchList: [],
        // 弹出层标题
        title: '',
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          merchantName: undefined,    //商户名称
          orderDetailId: undefined,   //订单编号
          shortCourseName: undefined, //班次名称
          name: undefined,            //班级名称
          userName: undefined,        //姓名
          mobilePhone: undefined,     //联系方式
          companyName: undefined,     //单位名称
          startTime: undefined,       //支付开始时间
          endTime: undefined,         //支付结束时间
          payStatus: undefined,       //支付状态
          state: undefined,           //开票状态
          invoiceType: undefined,     //开票类型
          kprqstartTime: undefined,   //开票开始时间
          kprqendTime: undefined,     //开票结束日期
          fphm: undefined,            //发票号码
          waybillNo: undefined,       //运单编号
          status: undefined,          //推送状态
          sendStatus: undefined,      //发货状态
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        // 列信息
        columns: [
          { key: 0, label: `序号`, visible: true },
          { key: 1, label: `商户名称`, visible: true },
          { key: 2, label: `订单编号`, visible: true },
          { key: 3, label: `班次名称`, visible: true },
          { key: 4, label: `班级名称`, visible: true },
          { key: 5, label: `姓名`, visible: true },
          { key: 6, label: `联系方式`, visible: true },
          { key: 7, label: `单位名称`, visible: true },
          { key: 8, label: `费用名称`, visible: true },
          { key: 9, label: `支付金额`, visible: true },
          { key: 10, label: `支付时间`, visible: true },
          { key: 11, label: `付款方式`, visible: true },
          { key: 12, label: `支付状态`, visible: true },

          { key: 13, label: `发票类型`, visible: true },
          { key: 14, label: `发票抬头`, visible: true },
          { key: 15, label: `税号`, visible: true },
          { key: 16, label: `单位地址`, visible: true },
          { key: 17, label: `电话号码`, visible: true },
          { key: 18, label: `开户银行`, visible: true },
          { key: 19, label: `银行账户`, visible: true },
          { key: 20, label: `发票推送状态`, visible: true },
          { key: 21, label: `开票状态`, visible: true },
          { key: 22, label: `开票日期`, visible: true },
          { key: 23, label: `发票号码`, visible: true },
          { key: 24, label: `原发票号码`, visible: true },
          { key: 25, label: `发票代码`, visible: true },
          { key: 26, label: `原发票代码`, visible: true },
          { key: 27, label: `发票备注`, visible: true },
          { key: 28, label: `发票凭证状态`, visible: true },

          { key: 29, label: `收件人姓名`, visible: true },
          { key: 30, label: `收件人电话`, visible: true },
          { key: 31, label: `收件地址`, visible: true },
          { key: 32, label: `快递推送状态`, visible: true },
          { key: 33, label: `发货状态`, visible: true },
          { key: 34, label: `快递公司`, visible: true },
          { key: 35, label: `运单编号`, visible: true },
          { key: 36, label: `原运单编号`, visible: true },
        ],
      }
    },
    created() {
      this.getList();
    },
    methods: {
      //推送状态转文字
      handlePushStateToChinese(state) {
        switch (state) {
          case "0":
            return "未推送";
          case "1":
            return "推送中";
          case "2":
            return "已推送已开票";
          case "3":
            return "推送开票失败";
          case "4":
            return "已作废重开票";
          case "5":
            return "推送作废失败";
          case "6":
            return "快递地址异常";
          case "7":
            return "已作废不开票";
          case "8":
            return "已退费不开票";
          default:
            return "未推送";
        }
      },
      //地址字符串拼接
      handleAddressAppend(row) {
        let initStr = "";
        row.receiverProvince && (initStr += row.receiverProvince);
        row.receiverCity && (initStr += row.receiverCity);
        row.receiverCounty && (initStr += row.receiverCounty);
        row.receiverTown && (initStr += row.receiverTown);
        row.receiverAddress && (initStr += row.receiverAddress);
        return initStr;
      },
      //更多搜索条件展开
      handleMore() {
        this.moreSearch = !this.moreSearch;
      },
      //查询数据
      getList() {
        this.loading = true
        listIntegratedQuery(this.queryParams).then(response => {
          this.searchList = response.rows
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
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        let that = this;
        let notify;
        this.$confirm('是否确认导出所有数据项', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          notify = that.$notify({
            title: '提示',
            message: '正在导出数据项，数据项较多时，可能需要时间较长...',
            duration: 0,
            showClose: false
          });
          this.exportLoading = true;
          return exportIntegratedExcel(queryParams)
        }).then((response) => {
          notify && notify.close();
          that.download(response.msg);
          this.exportLoading = false;
          that.$notify.success({
            title: '提示',
            message: '导出数据项成功',
            duration: 5000
          });
        }).catch(function() {
          notify && notify.close();
          this.exportLoading = false;
          notify ? (that.$notify.error({
            title: '提示',
            message: '导出数据项失败',
            duration: 5000
          })) : (that.$notify.info({
            title: '提示',
            message: '导出数据项已取消',
            duration: 5000
          }));
        })
        // this.$confirm('是否确认导出所有数据项?', '警告', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(function() {
        //   return exportIntegratedExcel(queryParams)
        // }).then(response => {
        //   this.download(response.msg)
        // })
      }
    }
  }
</script>
