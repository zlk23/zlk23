<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" size="mini">
      <el-form-item label="班次名称:" prop="shortCourseName">
        <el-input placeholder="请输入查询内容" v-model="queryParams.shortCourseName" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="支付时间:" prop="startTime">
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
      <!--&lt;!&ndash; TODO &ndash;&gt;
      <el-form-item label="联系方式:" prop="mobilePhone">
        <el-input placeholder="请输入手机号" v-model="queryParams.mobilePhone"></el-input>
      </el-form-item>
      &lt;!&ndash; TODO &ndash;&gt;
      <el-form-item label="交易单号:" prop="payId">
        <el-input placeholder="请输入查询内容" v-model="queryParams.payId"></el-input>
      </el-form-item>
      &lt;!&ndash; TODO &ndash;&gt;
      <el-form-item label="订单编号:" prop="orderDetailId">
        <el-input placeholder="请输入查询内容" v-model="queryParams.orderDetailId"></el-input>
      </el-form-item>-->
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="detailList" @selection-change="handleSelectionChange" >
      <el-table-column type="expand" >
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand" style="width:100%">
            <el-form-item style="width:100%">
              <span style="font-size: medium">发票信息</span>
            </el-form-item>
            <el-form-item label="发票抬头" style="width: 30%">
              <span>{{ props.row.title }}</span>
            </el-form-item>
            <el-form-item label="税号编码" style="width: 50%">
              <span>{{ props.row.taxNumber }}</span>
            </el-form-item>
            <el-form-item label="电话号码" style="width: 30%">
              <span>{{ props.row.telephone }}</span>
            </el-form-item>
            <el-form-item label="单位地址" style="width: 50%">
              <span>{{ props.row.companyAddress }}</span>
            </el-form-item>
            <el-form-item label="开户行名称" style="width: 30%">
              <span>{{ props.row.bankName }}</span>
            </el-form-item>
            <el-form-item label="银行卡号" style="width: 50%">
              <span>{{ props.row.bankAccount }}</span>
            </el-form-item>
            <el-form-item style="width:100%">
              <span style="font-size: medium">快递信息</span>
            </el-form-item>
            <el-form-item label="收件人姓名" style="width: 30%">
              <span>{{ props.row.recipientsName }}</span>
            </el-form-item>
            <el-form-item label="收件人号码" style="width: 50%">
              <span>{{ props.row.recipientsPhone }}</span>
            </el-form-item>
            <el-form-item label="收件人地址" style="width: 30%">
              <span>{{ props.row.recipientsAddress }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55" align="center" show-summary="true" />
      <el-table-column label="订单编号" align="center" prop="orderDetailId" width="120"/>
      <!--<el-table-column label="费用类型" align="center" prop="productId" />-->
      <el-table-column label="支付金额" align="center" prop="price" />
      <el-table-column label="缴费名称" align="center" prop="productName" width="100"/>
      <!--<el-table-column label="缴费商户" align="center" prop="payNum"/>-->
      <el-table-column label="缴费用户" align="center" prop="userName" width="100"/>
      <el-table-column label="联系方式" align="center" prop="mobilePhone" width="110"/>
      <el-table-column label="单位名称" align="center" prop="companyName" width="120"/>
      <el-table-column label="支付时间" align="center" prop="payTime" width="180" />
      <el-table-column label="支付状态" align="center" prop="payStatus" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.payStatus ==1 ? "已支付":"未支付" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班次名称" align="center" prop="shortCourseName" width="140" />
      <el-table-column label="交易单号" align="center" prop="payId" width="145" />
      <el-table-column label="付款方式" align="center" prop="payType" >
        <template slot-scope="scope">
          <span>{{ scope.row.payType ==1 ? "银联支付":scope.row.payType ==2 ? "微信支付":scope.row.payType ==3 ? "支付宝": scope.row.payType ==5 ? "微信支付":"" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button @click="handleDetail(scope.row)" type="text" size="small">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page-sizes="[10, 100, 150, 200]"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :disabled="disabled">
        <el-row>
          <el-col :span="11">
            <el-form-item label="订单编号" prop="orderDetailId" label-width="160px">
              <el-input v-model="form.orderDetailId"/>
            </el-form-item>
            <el-form-item label="缴费类型" prop="productId" label-width="160px">
              <el-input v-model="form.productId"/>
            </el-form-item>
            <el-form-item label="支付金额" prop="price"  label-width="160px">
              <el-input v-model="form.price"/>
            </el-form-item>
            <el-form-item label="缴费名称" prop="productName" label-width="160px">
              <el-input v-model="form.productName"/>
            </el-form-item>
            <el-form-item label="缴费商户" prop="payNum" label-width="160px">
              <el-select v-model="form.payNum">
                <el-option
                  v-for="item in merchantOptions"
                  :key="item.mchId"
                  :label="item.merchantName"
                  :value="item.mchId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="缴费用户" prop="userName" label-width="160px">
              <el-input v-model="form.userName"/>
            </el-form-item>
            <el-form-item label="联系方式" prop="mobilePhone" label-width="160px">
              <el-input v-model="form.mobilePhone"/>
            </el-form-item>
            <el-form-item label="单位名称" prop="companyName" label-width="160px">
              <el-input v-model="form.companyName"/>
            </el-form-item>
            <el-form-item label="支付时间" prop="payTime" label-width="160px">
              <el-date-picker clearable size="small" style="width: 200px"
                              v-model="form.payTime"
                              type="date"
                              value-format="yyyy-MM-dd HH:mm:ss"
                             >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="支付状态" label-width="160px">
              <el-input
                :disabled="disabled"
                v-model="form.payStatus == 0 ? '未支付' : '已支付'"
              />
            </el-form-item>
            <el-form-item label="班次名称" prop="shortCourseName" label-width="160px">
              <el-input v-model="form.shortCourseName"/>
            </el-form-item>
            <el-form-item label="交易编号" prop="payId" label-width="160px">
              <el-input v-model="form.payId" placeholder="请输入微信付款编号" />
            </el-form-item>

            <el-form-item label="开票状态（百旺）" prop="payId" label-width="160px">
              <el-input v-model="form.payId" placeholder="请输入微信付款编号" />
            </el-form-item>
            <el-form-item label="开票状态（快递助手）" prop="recipientsName" label-width="160px">
              <el-input v-model="form.recipientsName" placeholder="请输入收件人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="付款方式" prop="payType" label-width="160px">
              <el-input
              :disabled="disabled"
              v-model="form.payType ==1 ? '银联支付':form.payType ==2 ? '微信支付':form.payType ==3 ? '支付宝': form.payType ==5 ? '微信支付':''"
            />
            </el-form-item>
            <el-form-item label="抬头类型" prop="invoiceType" label-width="160px">
              <el-select v-model="form.invoiceType">
                <el-option label="请选择字典生成" value="" />
              </el-select>
            </el-form-item>
            <el-form-item label="名称" prop="title" label-width="160px">
              <el-input v-model="form.title"/>
            </el-form-item>
            <el-form-item label="税号" prop="taxNumber" label-width="160px">
              <el-input v-model="form.taxNumber"/>
            </el-form-item>
            <el-form-item label="单位地址" prop="companyAddress" label-width="160px">
              <el-input v-model="form.companyAddress"/>
            </el-form-item>
            <el-form-item label="电话号码" prop="telephone" label-width="160px">
              <el-input v-model="form.telephone"/>
            </el-form-item>
            <el-form-item label="开户银行" prop="bankName" label-width="160px">
              <el-input v-model="form.bankName"/>
            </el-form-item>
            <el-form-item label="银行账户" prop="bankAccount" label-width="160px">
              <el-input v-model="form.bankAccount"/>
            </el-form-item>
            <el-form-item label="收件人姓名" prop="recipientsName" label-width="160px">
              <el-input v-model="form.recipientsName"/>
            </el-form-item>
            <el-form-item label="收件人电话" prop="recipientsPhone" label-width="160px">
              <el-input v-model="form.recipientsPhone"/>
            </el-form-item>
            <el-form-item label="收件人详细地址" prop="recipientsAddress" label-width="160px">
              <el-input v-model="form.recipientsAddress"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { queryClearList } from "@/api/wx/tradeDetail";
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
        disabled: false,
        // 遮罩层
        loading: true,
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
        // 总条数
        total: 0,
        // 订单详情表格数据
        detailList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          startTime:this.addDate()+" 00:00:00",
          endTime:this.addDate()+" 23:59:59",
          payStatus: "1",
          shortCourseName: null,
          userName: null,
          phoneNum: null,
          companyName: null
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
      /** 查询订单详情列表 */
      getList() {
        this.loading = true;
        queryClearList(this.queryParams).then(response => {
          this.detailList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          userId: null,
          orderDetailId: null,
          productId: null,
          price: null,
          productName: null,
          shortCourseId: null,
          payNum: null,
          createtime: null,
          createId: null,
          updateId: null,
          updateTime: null,
          userName: null,
          mobilePhone: null,
          companyName: null,
          payTime: null,
          payStatus: 0,
          shortCourseName: null,
          payId: null,
          payType: null,
          invoiceType: null,
          title: null,
          taxNumber: null,
          companyAddress: null,
          telephone: null,
          bankName: null,
          bankAccount: null,
          recipientsName: null,
          recipientsPhone: null,
          recipientsAddress: null
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
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.selection = selection;
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      //批量开票
      handleBatchMakeInvoice() {
        console.log(this.ids);
        const id = this.ids
        //TODO 过滤已推送，已开票
        // const filterSelection = this.selection.filter(item => item.xxx === "xxx" && item.xxx === "xxx" && item.xxx === xxx);
        // batchMakeInvoice(id).then(response => {
        //   this.getList();
        // });
      },
      //批量打印快递
      handleExpressageBatchPrint() {
        console.log(this.ids);
        const id = this.ids;
        //TODO 过滤除百旺已开票以外信息
        // const filterSelection = this.selection.filter(item => item.xxx === "xxx" && item.xxx === "xxx" && item.xxx === xxx);
        // expressageBatchPrint(id).then(response => {
        //   this.getList();
        // });
      },
      //TODO EAP
      handleXXX() {
        console.log(this.ids);
        const id = this.ids;
        //TODO 筛选出百旺和快递助手已开票信息
        // const filterSelection = this.selection.filter(item => item.xxx === "xxx" && item.xxx === "xxx" && item.xxx === xxx);
        // handleXXX(id).then(response => {
        //   this.getList();
        // });
      },
      /** 查看按钮详细信息 **/
      handleDetail(row) {
        this.reset();
        const id = row.id || this.ids
        // getDetail(id).then(response => {
          this.form = row;
          getAllMerchant().then(response =>{
            this.merchantOptions=response.data
          })
          this.disabled = true
          this.open = true;
          this.title = "订单详情";
        // });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateDetail(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addDetail(this.form).then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除订单详情编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDetail(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 导出按钮操作 */
      handleExport(row) {
        const ids = row.id || this.ids;
        console.log(ids)
        if(this.ids.length==0)return this.$message.error('请勾选所需要导出行！');
        this.$confirm('此操作将导出所勾选, 是否继续?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal:false,
          closeOnPressEscape:false,
          type: "warning"
        }).then(function() {
          exportDetail(ids).then(response =>{
            let blob = new Blob([response.delegate],{type: 'application/vnd.ms-excel'});
            console.log(blob)
            let downloadElement = document.createElement('a');
            let href = window.URL.createObjectURL(blob); //创建下载的链接
            downloadElement.href = href;
            downloadElement.download = decodeURI(response.headers['Content-Disposition']); //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象
            //清空所有的勾选状态
            this.$refs.multipleTable.clearSelection()
          })
        })
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
