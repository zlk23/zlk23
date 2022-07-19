<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" size="mini">
          <el-form-item label="订单编号:" prop="orderDetailId">
            <el-input placeholder="请输入查询内容" clearable v-model="queryParams.orderDetailId"></el-input>
          </el-form-item>
          <el-form-item label="快递订单编号:" prop="expressNumber">
            <el-input placeholder="请输入查询内容" clearable v-model="queryParams.expressNumber"></el-input>
          </el-form-item>
          <el-form-item label="班次名称:" prop="shortCourseId">
            <el-select v-model="queryParams.classId" clearable filterable placeholder="请选择" @change="selectsmallClass($event)" size="mini">>
              <el-option
                v-for="item in shortCourseOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级名称:" prop="smallClassId">
            <el-select v-model="queryParams.smallClassId"  clearable filterable placeholder="请选择" size="mini">>
              <el-option
                v-for="item in smallClassOptions"
                :key="item.smallClassId"
                :label="item.name"
                :value="item.smallClassId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名:" prop="payName">
            <el-input placeholder="请输入查询内容" clearable v-model="queryParams.payName" size="mini">></el-input>
          </el-form-item>
          <el-form-item label="收件人:" prop="receiverName">
            <el-input placeholder="请输入查询内容" clearable v-model="queryParams.receiverName" size="mini">></el-input>
          </el-form-item>
          <el-form-item label="收件人电话:" prop="receiverMobile">
            <el-input placeholder="请输入查询内容" clearable v-model="queryParams.receiverMobile" size="mini">></el-input>
          </el-form-item>
          <el-form-item label="发票代码:" prop="fpdm">
            <el-input placeholder="请输入查询内容" clearable v-model="queryParams.fpdm" size="mini">></el-input>
          </el-form-item>
          <el-form-item label="发票号码:" prop="fphm">
            <el-input placeholder="请输入查询内容" clearable v-model="queryParams.fphm" size="mini">></el-input>
          </el-form-item>
          <el-form-item label="运单编号:" prop="waybillNo">
            <el-input placeholder="请输入查询内容" clearable v-model="queryParams.waybillNo" size="mini">></el-input>
          </el-form-item>
          <el-form-item label="支付时间:" prop="startTime">
            <el-date-picker
              v-model="queryParams.startTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00"
              placeholder="选择开始时间" :picker-options="pickerOptions0" size="mini">>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="-" prop="endTime">
            <el-date-picker
              v-model="queryParams.endTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="23:59:59"
              placeholder="选择结束时间" :picker-options="pickerOptions1" size="mini">>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="推送状态:" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择推送状态" size="mini">
              <el-option label="全部" value=""></el-option>
              <el-option label="未推送" value="0"></el-option>
              <el-option label="推送成功" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发货状态:" prop="status">
            <el-select v-model="queryParams.sendStatus" placeholder="请选择推送状态" size="mini">
              <el-option label="全部" value=""></el-option>
              <el-option label="未发货" value="0"></el-option>
              <el-option label="已发货" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          size="mini"
          :disabled="multiple"
          v-has-permi="['wx:expressage:batchPush']"
          @click="handleExpressageBatchPrint"
        >批量快递</el-button>
        <!--<el-button-->
          <!--type="success"-->
          <!--size="mini"-->
          <!--:disabled="multiple"-->
          <!--v-has-permi="['wx:push:remove']"-->
          <!--@click="handleBatchDelete"-->
        <!--&gt;批量删除</el-button>-->
        <el-button type="primary" size="mini" round @click="handleGetMallUrl" :loading="getMailUrlLoading"  v-has-permi="['wx:expressage:getMallUrl']">快递打印链接</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="detailList" @selection-change="handleSelectionChange" >
      <el-table-column type="selection" width="55" align="center" show-summary="true" :selectable="checkSelectable"/>
      <el-table-column label="序号" type="index" width="50" align="center"/>
      <el-table-column label="订单编号" align="center" prop="orderDetailId" width="180"/>
      <el-table-column label="快递订单编号" align="center" prop="expressNumber" width="140"/>
      <el-table-column label="班次名称" align="center" prop="className" width="180"/>
      <el-table-column label="班级名称" align="center" prop="smallClassName" width="180"/>
      <el-table-column label="姓名" align="center" prop="payName" width="180"/>
      <el-table-column label="发票代码" align="center" prop="fpdm" width="140"/>
      <el-table-column label="发票号码" align="center" prop="fphm" width="140"/>
      <el-table-column label="付款时间" align="center" prop="payTime" width="180"/>
      <el-table-column label="收件人" align="center" prop="receiverName" width="180"/>
      <el-table-column label="收件人电话" align="center" prop="receiverMobile" width="180"/>
      <el-table-column label="收件地址" align="center" width="250">
        <template slot-scope="scope">
          <span>{{handleAddressAppend(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="推送状态" align="center" width="200" prop="status">
        <template slot-scope="scope">
          <span>{{ handlePushStateToChinese(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="快递公司" align="center" width="200" prop="companyCode">
        <template slot-scope="scope">
          <div v-if="scope.row.companyCode === null">暂未发货</div>
          <div v-else>{{scope.row.companyCode}}</div>
        </template>
      </el-table-column>
      <el-table-column label="运单编号" align="center" prop="waybillNo">
        <template slot-scope="scope">
            <div v-if="scope.row.waybillNo === null">暂未打印</div>
            <div v-else>{{scope.row.waybillNo}}</div>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="160px">
        <template slot-scope="scope">
          <el-button @click="handleView(scope.row)" type="text" size="small" v-has-permi="['wx:push:query']">详情</el-button>
          <!--<el-button @click="handleUpdate(scope.row)" type="text" size="small">修改</el-button>-->
          <el-button @click="tradeUpdate(scope.row)" type="text" size="small" v-has-permi="['wx:expressage:testTradeUpdate']">同步</el-button>
          <el-button v-if="scope.row.status == '1'" @click="handleRePush(scope.row)" type="text" size="small" v-has-permi="['wx:push:reopen']">快递重开</el-button>
          <el-button @click="handleDelete(scope.row)" type="text" size="small" v-has-permi="['wx:push:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!--快递修改弹出层-->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :disabled="disabled">
        <el-row>
          <el-col :span="24">
            <el-form-item label="班次名称" prop="orderDetailId" label-width="160px">
              <el-input disabled="fales" v-model="form.className"/>
            </el-form-item>
          </el-col>
          <!-- 左侧 -->
          <el-col :span="12">
            <el-form-item label="订单编号" prop="orderDetailId" label-width="160px">
              <el-input disabled="fales" v-model="form.orderDetailId"/>
            </el-form-item>
            <el-form-item label="收件人姓名" prop="receiverName" label-width="160px">
              <el-input v-model="form.receiverName"/>
            </el-form-item>
            <el-form-item label="收件人手机号" prop="receiverMobile" label-width="160px">
              <el-input v-model="form.receiverMobile"/>
            </el-form-item>
            <el-form-item label="省" prop="receiverProvince" label-width="160px">
              <el-input v-model="form.receiverProvince"/>
            </el-form-item>
            <el-form-item label="市" prop="receiverCity" label-width="160px">
              <el-input v-model="form.receiverCity"/>
            </el-form-item>
            <el-form-item label="区/县" prop="receiverCounty" label-width="160px">
              <el-input v-model="form.receiverCounty"/>
            </el-form-item>
            <el-form-item label="详细地址" prop="receiverAddress" label-width="160px">
              <el-input v-model="form.receiverAddress"/>
            </el-form-item>
          </el-col>
          <!-- 右侧 -->
          <el-col :span="12">

            <el-form-item label="支付时间" prop="payTime" label-width="160px">
              <el-input disabled="fales" v-model="form.payTime"/>
            </el-form-item>

            <el-form-item label="快递推送状态" prop="payTime" label-width="160px">
              <el-input v-if="form.status === 0" disabled="fales" value="未推送"/>
              <el-input v-else disabled="fales" value="推送成功"/>
            </el-form-item>

            <el-form-item label="快递公司" prop="payTime" label-width="160px">
              <el-input v-if="form.status === 0" disabled="fales" value="暂未发货"/>
              <el-input v-else disabled="fales" v-model="form.companyCode"/>
            </el-form-item>

            <el-form-item label="快递单运单号" prop="waybillNo" label-width="160px">
              <el-input v-if="form.status === 0" disabled="fales" value="暂未打印"/>
              <el-input v-else disabled="fales" v-model="form.waybillNo"/>
            </el-form-item>

            <el-form-item label="是否拆单" prop="split" label-width="160px">
              <el-input v-if="!form.split" disabled="fales" value="未拆单"/>
              <el-input v-else disabled="fales" value="已拆单"/>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div slot="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>


    <!-- 快递详细弹出层 -->
    <el-dialog title="快递详细" :visible.sync="openView" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px" size="mini">
        <el-row>
          <el-col :span="24">
            <el-form-item label="班次名称：">{{ form.className }}</el-form-item>
          </el-col>
          <!-- 左侧 -->
          <el-col :span="12">
            <el-form-item label="订单编号：">{{ form.orderDetailId }}</el-form-item>
            <el-form-item label="收件人姓名：">{{ form.receiverName }}</el-form-item>
            <el-form-item label="收件人手机号：">{{ form.receiverMobile }}</el-form-item>
            <el-form-item label="省：">{{ form.receiverProvince }}</el-form-item>
            <el-form-item label="市：">{{ form.receiverCity }}</el-form-item>
            <el-form-item label="区/县：">{{ form.receiverCounty }}</el-form-item>
            <el-form-item label="详细地址：">{{ form.receiverAddress }}</el-form-item>
          </el-col>
          <!-- 右侧 -->
          <el-col :span="12">
            <el-form-item label="支付时间：">{{ form.payTime }}</el-form-item>
            <el-form-item label="快递推送状态：">
              <div v-if="form.status === 0">未推送</div>
              <div v-else-if="form.status === 1">推送成功</div>
            </el-form-item>
            <el-form-item label="快递公司：">
              <div v-if="form.status === 0">暂未发货</div>
              <div v-else>{{ form.companyCode }}</div>
            </el-form-item>
            <el-form-item label="快递单运单号：">
              <div v-if="form.status === 0">暂未打印</div>
              <div v-else>{{ form.waybillNo }}</div>
            </el-form-item>
            <el-form-item label="是否拆单：">
              <div v-if="!form.split">未拆单</div>
              <div v-else>已拆单</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openView = false">关 闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { expressReopen, expressageBatchPrint, getExpressagePush, updateExpressagePush, deleteExperssPush, batchDeleteExperssPush, expressagePushList, testTradeUpdate, getMallUrl } from "@/api/wx/order";
  import {getAllClassList,getSmallClass} from "@/api/wx/class";
  import { listFee, getFee, delFee, addFee, updateFee, exportFee,getAllMerchant } from "@/api/wx/fee";

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
        //快递助手地址获取加载
        getMailUrlLoading: false,
        disabled: false,
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        merchantOptions:[],
        shortCourseOptions:[],
        smallClassOptions:[],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 订单详情表格数据
        detailList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 是否显示详细弹出层
        openView: false,
        // 查询参数
        queryParams: {
          //当前页
          pageNum: 1,
          //分页初始条数
          pageSize: 10,
          //开始时间
          startTime:"",
          //结束时间
          endTime:"",
          waybillNo: null,
          expressNumber: null,
          fphm: null,
          fpdm: null,
          receiverMobile: null,
          status: "",
          sendStatus: "",
          orderDetailId: null,
          className:"",
          classId:"",
          smallClassId:"",
          payName:"",
          receiverName:"",
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
      this.getClassList();
    },
    methods: {
      //禁止选择
      checkSelectable(row) {
        //返回true则此条记录可选中
        return row.status != '1';
      },
      /** 查询订单详情列表 */
      getList() {
        this.loading = true;
        expressagePushList(this.queryParams).then(response => {
          this.detailList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      selectsmallClass(classId){
        console.log(classId)
        this.queryParams.smallClassId = null;
        this.smallClassOptions = [];
        if(classId !=null || classId!=""){
          getSmallClass(classId).then(response => {
            this.smallClassOptions = response.data;
          })
        }
      },
      getClassList() {
        getAllClassList().then(response => {
          this.shortCourseOptions = response.data;
        })
      },
      /** 取消按钮 */
      cancel() {
        this.open = false;
        this.reset();
      },
      /** 表单重置 */
      reset() {
        this.queryParams = {
          //当前页
          pageNum: 1,
          //分页初始条数
          pageSize: 10,
          //开始时间
          startTime:"",
          //结束时间
          endTime:"",
          id: null,
          orderId: null,
          orderDetailId: null,
          status: null,
          sendStatus: null,
          companyCode: null,
          waybillNo: null,
          expressNumber: null,
          fphm: null,
          fpdm: null,
          split: null,
          receiverName: null,
          receiverMobile: null,
          receiverProvince: null,
          receiverCity: null,
          receiverCounty: null,
          receiverTown: null,
          receiverAddress: null,
          payTime: null,
          createUser: null,
          updateUser: 0,
          payName: null,
          classId: null,
          className: null,
          smallClassId: null,
          // taxNumber: null,
          // companyAddress: null,
          // telephone: null,
          // bankName: null,
          // bankAccount: null,
          // recipientsName: null,
          // recipientsPhone: null,
          // recipientsAddress: null
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.reset();
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      /** 批量同步快递 */
      handleExpressageBatchPrint() {
        console.log(this.ids);
        this.loading = true;
        expressageBatchPrint(this.ids).then(response => {
          this.msgSuccess("批量同步成功");
          this.getList();
        }).catch(error => {
          this.msgSuccess("批量同步失败");
        })
      },
      //删除快递
      handleDelete(row) {
        this.$confirm("是否确认删除", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.loading = true;
          return deleteExperssPush(row.id);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      //批量删除快递
      handleBatchDelete(row) {
        this.$confirm("是否确认删除", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.loading = true;
          return batchDeleteExperssPush(this.ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      //快递重开
      handleRePush(row) {
        this.$confirm("是否确认重开", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.loading = true;
          return expressReopen(row.id);
        }).then(() => {
          this.getList();
          this.msgSuccess("重开成功");
        }).finally(() => {
          this.loading = false;
        })
      },
      /** 查询单条快递详细信息 */
      handleView(row) {
        getExpressagePush(row.id).then(response => {
          //赋值
          this.form = response.data;
          //弹出快递详细信息
          this.openView = true;
        });
      },
      /** 弹出快递修改窗口 **/
      handleUpdate(row) {
        //初始化表单参数
        this.reset();
        this.form = row;
        getExpressagePush(row.id).then(response => {
          //赋值
          this.form = response.data;
          //打开弹出框
          this.open = true;
          this.title = "快递修改";
        });
      },
      /** 修改提交接口 */
      submitForm() {
        updateExpressagePush(this.form).then(response => {
          this.msgSuccess("修改成功");
          //关闭修改弹出框
          this.open = false;
          //修改完成后，查询列表
          this.getList();
        });
      },
      /** 同步快递数据到快递助手平台 */
      tradeUpdate(row) {
        testTradeUpdate(row.id).then(response => {
          this.msgSuccess("数据同步成功");
          //修改完成后，查询列表
          this.getList();
        });
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
      //推送状态转文字
      handlePushStateToChinese(row) {
        if (row.status == 0) {
          return "未推送";
        } else if (row.status == 1) {
          return "推送成功";
        } else {
          return "推送失败"
        }
      },
      handleGetMallUrl() {
        this.getMailUrlLoading = true;
        getMallUrl().then(response => {
          if (response.msg) {
            window.open(response.msg, "_blank")
          } else {
            this.$message.warning("快递助手地址为空")
          }
        }).finally(() => {
          this.getMailUrlLoading = false;
        });
      },
      addDate() {
        let nowDate = new Date();
        let date = {
          year: nowDate.getFullYear(),
          month: nowDate.getMonth() + 1,
          date: nowDate.getDate(),
          hour: nowDate.getHours(),
          minute: nowDate.getMinutes(),
          second: nowDate.getSeconds(),
        };
        let zero1 = 0,
          zero2 = 0,
          zero3 = 0,
          zero4 = 0,
          zero5 = 0;
        if (date.month >= 10) zero1 = "";
        if (date.date >= 10) zero2 = "";
        if (date.hour >= 10) zero3 = "";
        if (date.minute >= 10) zero4 = "";
        if (date.second >= 10) zero5 = "";
        let systemDate =
          date.year + "-" + zero1 + date.month + "-" + zero2 + date.date;
        return systemDate;
      },
    }
  };
</script>
