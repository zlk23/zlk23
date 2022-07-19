<template>
  <div class="app-container" ref="app-container-tradeDetail">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" size="mini">
      <el-form-item label="班次名称:" prop="shortCourseId">
        <el-select
          v-model="queryParams.shortCourseId"
          clearable
          filterable
          placeholder="请选择"
          @change="selectsmallClass($event)"
          size="mini"
        >
          <el-option
            v-for="item in shortCourseOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级名称:" prop="smallClassId">
        <el-select v-model="queryParams.smallClassId" filterable clearable placeholder="请选择" size="mini">
          <el-option
            v-for="item in smallClassOptions"
            :key="item.smallClassId"
            :label="item.name"
            :value="item.smallClassId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名:" prop="shortCourseName">
        <el-input placeholder="请输入查询内容" clearable v-model="queryParams.userName" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="联系方式:" prop="shortCourseName">
        <el-input placeholder="请输入查询内容" clearable v-model="queryParams.phoneNum" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="单位:" prop="shortCourseName">
        <el-input placeholder="请输入查询内容" clearable v-model="queryParams.companyName" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="支付时间:" prop="startTime">
        <el-date-picker
          clearable
          size="mini"
          v-model="queryParams.startTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
          placeholder="选择开始时间" :picker-options="pickerOptions0">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="-" prop="endTime">
        <el-date-picker
          clearable
          size="mini"
          v-model="queryParams.endTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="23:59:59"
          placeholder="选择结束时间" :picker-options="pickerOptions1">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="支付状态:" prop="payStatus">
        <el-select v-model="queryParams.payStatus" placeholder="请选择操作状态" clearable size="mini">
          <!--<el-option label="" value=""></el-option>-->
          <el-option label="未支付" value="0"></el-option>
          <el-option label="已支付" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8" ref="searchBox">
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['wx:orderDetail:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="detailList" @selection-change="handleSelectionChange" :height="tableHeight">
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
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="订单编号" align="center" prop="orderDetailId" width="180"/>
      <el-table-column label="班次名称" align="center" prop="shortCourseName" width="180"/>
      <el-table-column label="班级名称" align="center" prop="smallClassName" width="180"/>
      <el-table-column label="姓名" align="center" prop="userName"/>
      <el-table-column label="支付金额" align="center" prop="price"/>
      <el-table-column label="缴费名称" align="center" prop="productName" width="100"/>
      <el-table-column label="联系方式" align="center" prop="mobilePhone" width="110"/>
      <el-table-column label="单位名称" align="center" prop="companyName" width="180"/>
      <el-table-column label="支付时间" align="center" prop="payTime" width="180"/>
      <el-table-column label="支付状态" align="center" prop="payStatus">
        <template slot-scope="scope">
          <span>{{ scope.row.payStatus ==1 ? '已支付':'未支付' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="付款方式" align="center" prop="payType">
        <template slot-scope="scope">
          <span>{{ scope.row.payType ==1 ? '银联支付':scope.row.payType ==2 ? '微信支付':scope.row.payType ==3 ? '支付宝': scope.row.payType ==5 ? '微信支付':'' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="getGdPayResultByOrder(scope.row)"
          >查询
          </el-button>
          <!--<el-button-->
            <!--@click="handleDetail(scope.row)"-->
            <!--type="text"-->
            <!--size="small"-->
            <!--v-hasPermi="['wx:orderDetail:query']"-->
          <!--&gt;详情-->
          <!--</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <div>
      <pagination
        class="pagination"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      ></pagination>

      <div style="margin-top: -20px;z-index:9999">总金额:{{orderTotalAmount}}</div>
    </div>

    <!-- 添加或修改订单详情对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="订单编号" prop="orderDetailId">
              <el-input :disabled="disabled" v-model="form.orderDetailId"/>
            </el-form-item>
            <el-form-item label="缴费类型" prop="productId">
              <el-input :disabled="disabled" v-model="form.productName"/>
            </el-form-item>
            <el-form-item label="支付金额" prop="price">
              <el-input :disabled="disabled" v-model="form.price"/>
            </el-form-item>
            <el-form-item label="缴费名称" prop="productName">
              <el-input :disabled="disabled" v-model="form.productName"/>
            </el-form-item>
            <el-form-item label="缴费商户" prop="payNum">
              <el-select :disabled="disabled" v-model="form.payNum">
                <el-option
                  v-for="item in merchantOptions"
                  :key="item.mchId"
                  :label="item.merchantName"
                  :value="item.mchId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="缴费用户" prop="userName">
              <el-input :disabled="disabled" v-model="form.userName"/>
            </el-form-item>
            <el-form-item label="联系方式" prop="mobilePhone">
              <el-input :disabled="disabled" v-model="form.mobilePhone"/>
            </el-form-item>
            <el-form-item label="单位名称" prop="companyName">
              <el-input :disabled="disabled" v-model="form.companyName"/>
            </el-form-item>
            <el-form-item label="支付时间" prop="payTime">
              <el-date-picker
                :disabled="disabled"
                clearable
                size="small"
                style="width: 200px"
                v-model="form.payTime"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="支付状态">
              <el-input
                :disabled="disabled"
                v-model="form.payStatus == 0 ? '未支付' : '已支付'"
              />
            </el-form-item>
            <el-form-item label="班次名称" prop="shortCourseName">
              <el-input :disabled="disabled" v-model="form.shortCourseName"/>
            </el-form-item>
            <el-form-item label="交易编号" prop="payId">
              <el-input
                :disabled="disabled"
                v-model="form.payId"
                placeholder="请输入微信付款编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="付款方式" prop="payType">
              <!-- <el-select :disabled="disabled" :v-model="form.payType">
              </el-select> -->
              <el-input
                :disabled="disabled"
                v-model="form.payType ==1 ? '银联支付':form.payType ==2 ? '微信支付':form.payType ==3 ? '支付宝': form.payType ==5 ? '微信支付':''"
              />
            </el-form-item>
            <el-form-item label="发票类型" prop="invoiceType">
              <el-select :disabled="disabled" v-model="form.invoiceType">
                <el-option
                  v-for="item in fpType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="名称" prop="title">
              <el-input :disabled="disabled" v-model="form.title" />
            </el-form-item>
            <el-form-item label="税号" prop="taxNumber">
              <el-input :disabled="disabled" v-model="form.taxNumber" />
            </el-form-item>
            <el-form-item label="单位地址" prop="companyAddress">
              <el-input :disabled="disabled" v-model="form.companyAddress" />
            </el-form-item>
            <el-form-item label="电话号码" prop="telephone">
              <el-input :disabled="disabled" v-model="form.telephone" />
            </el-form-item>
            <el-form-item label="开户银行" prop="bankName">
              <el-input :disabled="disabled" v-model="form.bankName" />
            </el-form-item>
            <el-form-item label="银行账户" prop="bankAccount">
              <el-input :disabled="disabled" v-model="form.bankAccount" />
            </el-form-item>
            <el-form-item label="发票备注" prop="invoiceMark">
              <el-input :disabled="disabled" v-model="form.invoiceMark" />
            </el-form-item>
            <el-form-item label="收件人姓名" prop="recipientsName">
              <el-input :disabled="disabled" v-model="form.recipientsName" />
            </el-form-item>
            <el-form-item label="收件人电话" prop="recipientsPhone">
              <el-input :disabled="disabled" v-model="form.recipientsPhone" />
            </el-form-item>
            <el-form-item label="收件人详细地址" prop="recipientsAddress">
              <el-input :disabled="disabled" v-model="form.recipientsAddress" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div align="center">
        <el-button
          type="primary"
          @click="onSubmit"
          v-hasPermi="['wx:orderDetail:edit']"
        >立即修改
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    queryListDetail,
    getDetail,
    delDetail,
    addDetail,
    updateDetail,
    exportDetail,
    queryTotalAmount
  } from '@/api/wx/tradeDetail'
  import {getAllClassList,getSmallClass} from "@/api/wx/class";
  import { getGdPayResultByOrderId, getZfzxPayResultByOrderId } from '@/api/wx/order'
  import { getFPDetail, changeFPDetail } from '@/api/wx/fee'
  import { listFee, getFee, delFee, addFee, updateFee, exportFee, getAllMerchant } from '@/api/wx/fee'

  export default {
    name: 'Detail',
    components: {},
    data() {
      return {
        pickerOptions0: {
          disabledDate: (time) => {
            if (this.queryParams.endTime) {
              console.log(time)
              console.log(this.queryParams.endTime)
              //console.log(new Date(this.queryInfo.endTime ))//如果开始时间不为空，则小于结束时间
              return new Date(this.queryParams.endTime).valueOf() < time.getTime().valueOf()
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
        fpType: [
          {
            value: 'FPKJ_004',
            label: '专票开具'
          },
          {
            value: 'FPKJ_007',
            label: '普票开具'
          }
        ],
        orderTotalAmount: '',
        disabled: false,
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        merchantOptions: [],
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
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          startTime: null,
          endTime: null,
          payStatus: '1',
          shortCourseName: null,
          userName: null,
          phoneNum: null,
          companyName: null,
          smallClassId: null,
        },
        queryTimeParams: {
          startTime: '',
          endTime: ''
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        //表格高度
        tableHeight: '200',
      }
    },
    watch: {
      showSearch: {
        handler(nVal, oVal) {
          this.getTableHeight();
        }
      }
    },
    created() {
      this.getList();
      this.getClassList();
      this.getTableHeight();
      window.onresize = () => {
        this.getTableHeight();
      };
    },
    methods: {
      getTableHeight() {
        this.$nextTick(() => {
          let height = (window.innerHeight - 84 - 40) - this.$refs["queryForm"].$el.offsetHeight - this.$refs["searchBox"].$el.offsetHeight - 80;
          if (height < 200) {
            height = 200;
          }
          this.tableHeight = height + ''
        })
      },
      selectsmallClass(classId){
        this.queryParams.smallClassId = null;
        this.smallClassOptions = [];
        getSmallClass(classId).then(response => {
          this.smallClassOptions = response.data;
        })
      },
      getClassList() {
        getAllClassList().then(response => {
          this.shortCourseOptions = response.data;
        })
      },

      /** 查询订单详情列表 */
      getList() {
        this.loading = true
        queryListDetail(this.queryParams).then(response => {
          this.detailList = response.rows
          this.total = response.total
          this.loading = false
        })
        queryTotalAmount(this.queryParams).then(response => {
          if (response.data != null) {
            this.orderTotalAmount = response.data.totalAmount
          }
        })
      },
      //查询光大订单结果
      getGdPayResultByOrder(row) {
        console.log(row.orderDetailId)
        getGdPayResultByOrderId(row.orderDetailId).then(response => {
          this.getList();
          this.msgSuccess('已支付');
        })
        // getZfzxPayResultByOrderId(row.orderDetailId).then(response => {
        //   this.getList();
        //   this.msgSuccess('已支付');
        // })
      },
      //提交修改
      onSubmit() {
        this.open = false;
        /*let that = this;
        console.log(this.form)
        let data = { invoiceBody: JSON.stringify(this.form) };
        changeFPDetail(data).then(res => {
          // this.form = res.data;
          if (res.code==200) {
            this.open = false;
            that.$message({
              message: res.msg,
              type: "success"
            });
          }else{
            this.open = false;
            that.$message({
              message: res.msg,
              type: "error"
            });
          }
        });*/
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
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
        }
        this.resetForm('form')
      },
      resetQueryForm() {
        this.queryParams = {
          pageNum: 1,
          pageSize: 10,
          startTime: null,
          endTime: null,
          payStatus: '1',
          shortCourseName: null,
          userName: null,
          phoneNum: null,
          companyName: null,
          smallClassId: null
        }
        this.resetForm('queryForm');
      },
      //详情按钮
      handleDetail(row) {
        this.reset()
        // getDetail(id).then(response => {
        this.form = row
        let id = {
          orderDetailId: row.orderDetailId
        }
        getFPDetail(id).then(res => {
          this.form = res.data
        })
        this.disabled = true
        this.open = true
        this.title = '订单详情'
        // });
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetQueryForm();
        this.handleQuery()
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.open = true
        this.title = '添加订单详情'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id || this.ids
        getDetail(id).then(response => {
          this.form = response.data
          getAllMerchant().then(response => {
            this.merchantOptions = response.data
          })
          if (this.form.payStatus != '0') {
            this.disabled = true
          } else {
            this.disabled = false
          }
          this.open = true
          this.title = '修改订单详情'
        })
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateDetail(this.form).then(response => {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              })
            } else {
              addDetail(this.form).then(response => {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              })
            }
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$confirm('是否确认删除订单详情编号为"' + ids + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delDetail(ids)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
      },
      /** 导出按钮操作 */
      handleExport(row) {
        const ids = row.id || this.ids
        console.log(ids)
        if (this.ids.length == 0) return this.$message.error('请勾选所需要导出行！')
        this.$confirm('此操作将导出所勾选, 是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: 'warning'
        }).then(function() {
          exportDetail(ids).then(response => {
            let blob = new Blob([response.delegate], { type: 'application/vnd.ms-excel' })
            console.log(blob)
            let downloadElement = document.createElement('a')
            let href = window.URL.createObjectURL(blob) //创建下载的链接
            downloadElement.href = href
            downloadElement.download = decodeURI(response.headers['Content-Disposition']) //下载后文件名
            document.body.appendChild(downloadElement)
            downloadElement.click() //点击下载
            document.body.removeChild(downloadElement) //下载完成移除元素
            window.URL.revokeObjectURL(href) //释放掉blob对象
            //清空所有的勾选状态
            this.$refs.multipleTable.clearSelection()
          })
        })
      },
      addDate() {
        let nowDate = new Date()
        let date = {
          year: nowDate.getFullYear(),
          month: nowDate.getMonth() + 1,
          date: nowDate.getDate(),
          hour: nowDate.getHours(),
          minute: nowDate.getMinutes(),
          second: nowDate.getSeconds()
        }
        let zero1 = 0,
          zero2 = 0,
          zero3 = 0,
          zero4 = 0,
          zero5 = 0
        if (date.month >= 10) zero1 = ''
        if (date.date >= 10) zero2 = ''
        if (date.hour >= 10) zero3 = ''
        if (date.minute >= 10) zero4 = ''
        if (date.second >= 10) zero5 = ''
        let systemDate =
          date.year + '-' + zero1 + date.month + '-' + zero2 + date.date
        return systemDate
      }
    }
  }
</script>
<style scoped>
  /deep/ .pagination-container {
    background: transparent;
  }

  /*/deep/ .el-table__body-wrapper {*/
    /*transform: scaleY(-1);*/
  /*}*/

  /*/deep/ .el-table__body-wrapper tbody {*/
    /*transform: scaleY(-1);*/
  /*}*/

  /*/deep/ .el-table__empty-text {*/
    /*transform: scaleY(-1);*/
  /*}*/

  .pagination {
    margin-bottom: 30px;
  }
</style>
