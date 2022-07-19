<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      size="mini"
    >
      <el-form-item label="订单编号:" prop="orderDetailId">
        <el-input placeholder="请输入查询内容" clearable v-model="queryParams.orderDetailId" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="班次名称:" prop="shortCourseId">
        <el-select
          v-model="queryParams.shortCourseId"
          clearable
          filterable
          :filter-method="shortCourseFilter"
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
        <el-select v-model="queryParams.smallClassId" clearable filterable placeholder="请选择" size="mini">
          <el-option
            v-for="item in smallClassOptions"
            :key="item.smallClassId"
            :label="item.name"
            :value="item.smallClassId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名:" prop="userName">
        <el-input placeholder="请输入查询内容" clearable v-model="queryParams.userName" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="单位名称:" prop="companyName">
        <el-input placeholder="请输入查询内容" clearable v-model="queryParams.companyName" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="联系方式:" prop="mobilePhone">
        <el-input placeholder="请输入查询内容" clearable v-model="queryParams.mobilePhone" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="发票号码:" prop="fphm">
        <el-input placeholder="请输入查询内容" clearable v-model="queryParams.fphm" size="mini"></el-input>
      </el-form-item>
      <!--0未推送，1已推送未完成，2已推送已开票，3推送开票失败,4已推送已作废,5推送作废失败-->
      <el-form-item label="开票状态:" prop="state">
        <el-select v-model="queryParams.state" placeholder="开票状态" size="mini">
          <el-option label="全部" value=""></el-option>
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
      <el-form-item label="开票类型:" prop="invoiceType">
        <el-select v-model="queryParams.invoiceType" placeholder="开票状态" size="mini">
          <el-option label="全部" value=""></el-option>
          <el-option label="专票" value="FPKJ_004"></el-option>
          <el-option label="普票" value="FPKJ_007"></el-option>
          <el-option label="电子普票" value="FPKJ_026"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付时间:" prop="startTime">
        <el-date-picker
          v-model="queryParams.startTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
          placeholder="选择开始时间" :picker-options="pickerOptions0"
          size="mini"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="-" prop="endTime">
        <el-date-picker
          v-model="queryParams.endTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="23:59:59"
          placeholder="选择结束时间" :picker-options="pickerOptions1"
          size="mini"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="开票时间:" prop="startKprq">
        <el-date-picker
          v-model="queryParams.startKprq"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
          placeholder="选择开始时间" :picker-options="pickerOptions2"
          size="mini"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="-" prop="endKprq">
        <el-date-picker
          v-model="queryParams.endKprq"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="23:59:59"
          placeholder="选择结束时间" :picker-options="pickerOptions3"
          size="mini"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索
        </el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
        >重置
        </el-button
        >
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          size="mini"
          :disabled="multiple"
          :loading="disabledLoading"
          v-has-permi="['wx:invoice:push']"
          @click="handleBatchMakeInvoice"
        >批量开票
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          size="mini"
          round
          onclick="window.open('http://101.200.44.232:8082/Wrapper/')"
          v-has-permi="['wx:invoice:baiwang']"
        >发票打印链接
        </el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-has-permi="['wx:invoice:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload"
          size="mini"
          @click="handleImport"
          v-has-permi="['wx:invoice:import']"
        >导入
        </el-button>
      </el-col> -->
      <!--<el-col :span="1.5">-->
      <!--<el-button-->
      <!--type="success"-->
      <!--size="mini"-->
      <!--@click="pushErpInvoice"-->
      <!--v-has-permi="['wx:invoice:pushErpInvoice']"-->
      <!--&gt;发票推送ERP-->
      <!--</el-button>-->
      <!--</el-col>-->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="detailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" show-summary="true" :selectable="checkSelectable"/>
      <el-table-column label="序号" type="index" width="50" align="center"/>
      <el-table-column label="订单编号" align="center" prop="orderDetailId" width="140"/>
      <el-table-column label="班次编号" align="center" prop="shortCourseId" width="140"/>
      <el-table-column label="班次名称" align="center" prop="shortCourseName" width="180">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.shortCourseName" placement="top">
            <span style="
                width: 100%; max-height: 80px;
                cursor: pointer;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;"
            >
            {{ scope.row.shortCourseName }}
          </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="班级名称" align="center" prop="smallClassName" width="180">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.smallClassName" placement="top">
            <span style="
                width: 100%; max-height: 80px;
                cursor: pointer;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;"
            >
            {{ scope.row.smallClassName }}
          </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" prop="userName"/>
      <el-table-column label="单位名称" align="center" prop="companyName" width="120">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.companyName" placement="top">
            <span style="
                width: 100%; max-height: 80px;
                cursor: pointer;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;"
            >
            {{ scope.row.companyName }}
          </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" align="center" prop="mobilePhone"/>
      <el-table-column label="支付金额" align="center" prop="price"/>
      <el-table-column label="支付状态" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.payStatus == 1 ? "已支付" : "未支付" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票类型" align="center" prop="invoiceType">
        <template slot-scope="scope">
          <p v-if="scope.row.invoiceType=='FPKJ_004'">专票</p>
          <p v-if="scope.row.invoiceType=='FPKJ_007'">普票</p>
          <p v-if="scope.row.invoiceType=='FPKJ_026'">电子普票</p>
        </template>
      </el-table-column>
      <el-table-column label="发票备注" align="center" prop="invoiceMark"/>
      <el-table-column label="推送状态" align="center" width="80" prop="state">
        <template slot-scope="scope">
          <span>{{ handlePushStateToChinese(scope.row.state) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开票状态" align="center" width="80" prop="msg">
        <template slot-scope="scope">
          <span>{{ scope.row.msg }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="发票号码"
        align="center"
        width="140"
        prop="fphm"
      ></el-table-column>
      <el-table-column
        label="发票代码"
        align="center"
        width="140"
        prop="fpdm"
      ></el-table-column>
      <el-table-column
        label="开票日期"
        align="center"
        prop="kprq"
        width="180"
      />
      <el-table-column
        label="合计金额"
        align="center"
        width="140"
        prop="hjje"
      ></el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="120px">
        <template slot-scope="scope">
          <el-button @click="handleDetail(scope.row)" type="text" size="small" v-has-permi="['wx:orderDetail:query']">详情</el-button>
          <!--<el-button v-if="scope.row.state != '2'" @click="handleUpdate(scope.row)" type="text" size="small" v-has-permi="['wx:orderDetail:edit']">修改</el-button>-->
          <el-button @click="handleUpdate(scope.row)" type="text" size="small" v-has-permi="['wx:orderDetail:edit']">修改</el-button>
          <el-button v-if="scope.row.state == '2'" @click="handleRePush(scope.row)" type="text" size="small" v-has-permi="['wx:invoice:reopen']">快递重开</el-button>
          <el-button v-if="scope.row.state == '2' || scope.row.state == '5'" class="zuofei" type="text" size="small" @click="voidInvoice(scope.row)" v-has-permi="['wx:invoice:void']">作废</el-button>
           <!--4，增加作废后可以退费不开票-->
          <el-button v-if="scope.row.state == '0' || scope.row.state == '4'" type="text" size="small" @click="updateState(scope.row,8)" v-has-permi="['wx:invoice:state']">退费不开票</el-button>
          <el-button v-if="scope.row.state == '2'" type="text" size="small" @click="updateState(scope.row,7)" v-has-permi="['wx:invoice:statecancel']">作废不开票</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
    <pagination
      v-show="total > 0"
      :total="total"
      :page-sizes="[10, 20, 30, 50]"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog :title="title" :visible.sync="open" width="800px" :before-close="cancel" append-to-body destroy-on-close>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px" :disabled="disabled">
        <el-row>
          <el-col :span="11">
            <el-form-item label="订单编号" prop="orderDetailId">
              <el-input :disabled="leftDisabled" v-model="form.orderDetailId"/>
            </el-form-item>
            <el-form-item label="缴费类型" prop="productId">
              <el-input :disabled="leftDisabled" v-model="form.productName"/>
            </el-form-item>
            <el-form-item label="支付金额" prop="price">
              <el-input :disabled="leftDisabled" v-model="form.price"/>
            </el-form-item>
            <el-form-item label="缴费名称" prop="productName">
              <el-input :disabled="leftDisabled" v-model="form.productName"/>
            </el-form-item>
            <el-form-item label="缴费商户" prop="payNum">
              <el-select :disabled="leftDisabled" v-model="form.payNum">
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
              <el-input :disabled="leftDisabled" v-model="form.userName"/>
            </el-form-item>
            <el-form-item label="联系方式" prop="mobilePhone">
              <el-input :disabled="leftDisabled" v-model="form.mobilePhone"/>
            </el-form-item>
            <el-form-item label="单位名称" prop="companyName">
              <el-input :disabled="leftDisabled" v-model="form.companyName"/>
            </el-form-item>
            <el-form-item label="支付时间" prop="payTime">
              <el-date-picker
                :disabled="leftDisabled"
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
                :disabled="leftDisabled"
                v-model="form.payStatus == 0 ? '未支付' : '已支付'"
              />
            </el-form-item>
            <el-form-item label="班次名称" prop="shortCourseName">
              <el-input :disabled="leftDisabled" v-model="form.shortCourseName"/>
            </el-form-item>
            <el-form-item label="交易编号" prop="payId">
              <el-input
                :disabled="leftDisabled"
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
                :disabled="leftDisabled"
                v-model="form.payType == '0' ? '微信支付' : '支付宝'"
              />
            </el-form-item>
            <el-form-item label="发票类型" prop="invoiceType">
              <el-select v-model="form.invoiceType" :disabled="fpInfoDisabled">
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
              <el-input v-model="form.title" :disabled="fpInfoDisabled"/>
            </el-form-item>
            <el-form-item label="税号" prop="taxNumber">
              <el-input v-model="form.taxNumber" :disabled="fpInfoDisabled"/>
            </el-form-item>
            <el-form-item label="单位地址" prop="companyAddress">
              <el-input v-model="form.companyAddress" :disabled="fpInfoDisabled"/>
            </el-form-item>
            <el-form-item label="电话号码" prop="telephone">
              <el-input v-model="form.telephone" :disabled="fpInfoDisabled"/>
            </el-form-item>
            <el-form-item label="开户银行" prop="bankName">
              <el-input v-model="form.bankName" :disabled="fpInfoDisabled"/>
            </el-form-item>
            <el-form-item label="银行账户" prop="bankAccount">
              <el-input v-model="form.bankAccount" :disabled="fpInfoDisabled"/>
            </el-form-item>
            <el-form-item label="发票备注" prop="invoiceMark">
              <el-input v-model="form.invoiceMark" :disabled="fpInfoDisabled"/>
            </el-form-item>
            <el-form-item label="收件人姓名" prop="recipientsName">
              <el-input v-model="form.recipientsName"/>
            </el-form-item>
            <el-form-item label="收件人电话" prop="recipientsPhone">
              <el-input v-model="form.recipientsPhone"/>
            </el-form-item>
            <el-form-item label="省市区" prop="recipientsAddress">
              <!--             <el-input v-model="form.recipientsAddress" />-->
              <selectAddress v-if="showSelect" :reMsg="reSelectMsg" @cityChange="getSelectMsg"></selectAddress>
            </el-form-item>
            <el-form-item label="收件人详细地址" prop="detAddress">
              <el-input v-model="form.detAddress"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div align="right">
        <el-button type="info" @click="cancel" v-if="!disabled">取消</el-button>
        <el-button type="primary" @click="onSubmit" v-if="!disabled">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox
            v-model="upload.updateSupport"
          />是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate"
            >下载模板</el-link
          >
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">
          提示：仅允许导入“xls”或“xlsx”格式文件！
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {batchMakeInvoice, getInvoice, pushErpInvoice, reopen, updateOrderDetail} from "@/api/wx/order";
  import {getFPDetail, changeFPDetail} from "@/api/wx/fee";
  import {fpzf,updateInvoiceState,exportInvote,importTemplate} from "@/api/wx/invoice";
  import selectAddress from "@/components/AddressSelect/selectCom";
  import {getAllClassList,getSmallClass} from "@/api/wx/class";
  import log from "../../monitor/job/log";

  import { taxNumberValidator, bankAccountValidator, telephoneValidator, phoneValidator, replaceTrim, replaceChineseHLines } from '../../../utils/validate'

  export default {
    name: "Detail",
    components: {selectAddress},
    data() {
      const taxNumberCheck = (rule, value, callback) => {
        if (value && !taxNumberValidator(value)) {
          return callback(new Error("由15-20位数字和大写字母组成"))
        }
        callback();
      };
      const bankAccountCheck = (rule, value, callback) => {
        if (value && !bankAccountValidator(value)) {
          return callback(new Error("由9-30位的数字和-(选填)组成"))
        }
        callback();
      };
      const unitTelephoneCheck = (rule, value, callback) => {
        if (value && !telephoneValidator(value) && !phoneValidator(value)) {
          return callback(new Error("11位手机号或座机号码(可选填-)"))
        }
        callback();
      };
      const telephoneCheck = (rule, value, callback) => {
        if (value && !telephoneValidator(value)) {
          return callback(new Error("11位手机号"))
        }
        callback();
      };
      return {
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
        disabled: false,
        leftDisabled: true,
        fpInfoDisabled: false,
        reSelectMsg: '',
        // 遮罩层
        loading: true,
        // 选中数组ids
        ids: [],
        merchantOptions: [],
        shortCourseOptionsList: [],
        shortCourseOptions:[],
        smallClassOptions:[],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 表格总条数
        total: 0,
        // 订单详情表格数据
        detailList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          // 当前页数
          pageNum: 1,
          // 分页条数
          pageSize: 10,
          //开始时间
          startTime: "",
          //结束时间
          endTime: "",
          //开票开始时间
          startKprq: "",
          //开票结束时间
          endKprq: "",
          //支付状态
          //payStatus: "1",
          //班级
          // shortCourseName: null,
          //订单编号
          //orderDetailId: null,
          //payId: null,
          //联系方式
          //mobilePhone: null,
          //推送状态
          invoiceType: "",
          state: "0",
          orderDetailId: "",
          shortCourseId: "",
          smallClassId:"",
          userName: "",
          fphm: "",
          msg: ""
          //票号
          //bwBanks: null,
        },
        // 表单参数
        form: {},
        // 表单禁用
        formDisabled: false,
        // 表单校验
        rules: {
          taxNumber: { validator: taxNumberCheck },
          bankAccount: { validator: bankAccountCheck },
          telephone: { validator: unitTelephoneCheck },
          recipientsPhone: { validator: telephoneCheck }
        },
        fpType: [
          {
            value: "FPKJ_004",
            label: "专票开具"
          },
          {
            value: "FPKJ_007",
            label: "普票开具"
          }
        ],
        showSelect: false,
        //接收组件的省市区
        newAddress: '',
        //批量推送禁止多次提交
        disabledLoading: false,

      // 发票导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        //headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url:'',
        //url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
      };
    },
    created() {
      this.getList();
      this.getClassList();
    },
    methods: {
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm("是否确认导出所有已选择发票数据项?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(function() {
            return exportInvote(queryParams);
          })
          .then(response => {
            console.log(response);
            this.download(response.msg);
          });
      },
      /** 导入按钮操作 */
      handleImport() {
        this.upload.title = "发票导入";
        this.upload.open = true;
      },

      /** 下载模板操作 */
      importTemplate() {
        importTemplate().then(response => {
          this.download(response.msg);
        });
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.upload.open = false;
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();
        this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
        this.getList();
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
      },
      //自定义搜索方法
      shortCourseFilter(val) {
        this.shortCourseOptions = this.shortCourseOptionsList.filter(item => item.name.indexOf(val) !== -1 || item.id.indexOf(val) !== -1);
        // console.log(val)
      },
      //禁止选择
      checkSelectable(row) {
        //返回true则此条记录可选中
        return !(row.state == '1' ||row.state == '2' || row.state == '5'|| row.state == '7' || row.state == '8');
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
          this.shortCourseOptionsList = response.data;
          // console.log(this.shortCourseOptions)
        })
      },
      //接收省市区选择器的数据
      getSelectMsg(value) {
        console.log(value)
        if (value) {
          let s = value.replace(/\s*/g, '');
          let arr = s.split('/')
          console.log(arr)
          this.newAddress = arr[0] + '+' + arr[1] + '+' + arr[2];
        } else {
          this.newAddress = null
        }
      },
      /** 订单列表 */
      getList() {
        this.loading = true;
        getInvoice(this.queryParams).then(response => {
          this.detailList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      //批量开票
      handleBatchMakeInvoice() {
        this.loading = true;
        this.disabledLoading = true;
        batchMakeInvoice(this.ids)
          .then(response => {
            this.msgSuccess(
              "共推送" +
              response.data.count +
              "条\n推送成功:" +
              response.data.success +
              "条"
            );
            this.getList();
          })
          .catch(error => {
            // console.log(error);
            this.msgSuccess("批量开票失败");
          })
          .finally(() => {
            this.getList();
            this.disabledLoading = false;
          });
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

      //发票重开
      handleRePush(row) {
        this.$confirm("是否确认重开", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.loading = true;
          return reopen(row.id);
        }).then(() => {
          this.getList();
          this.msgSuccess("重开成功");
        }).finally(() => {
          this.loading = false;
        })
      },

      /** 详细信息 **/
      handleDetail(row) {
        this.reset();
        // getDetail(id).then(response => {
        this.form = row;
        let id = {
          orderDetailId: row.orderDetailId
        };
        getFPDetail(id).then(res => {
          this.form = res.data;
          // this.reSelectMsg=this.form.recipientsAddress
          let arr = this.form.recipientsAddress.split('+');
          if (arr.length <= 0) {
            this.showSelect = false;
          } else {
            this.reSelectMsg = arr[0] + '/' + arr[1] + '/' + arr[2];
            this.newAddress = arr[0] + '+' + arr[1] + '+' + arr[2];
            this.$set(this.form, 'detAddress', arr[3]);
            this.showSelect = false;
            this.showSelect = true;
          }
          // setTimeout(this.showSelect=true,500);
        });
        this.disabled = true;
        this.open = true;
        this.title = "订单详情";
        // });
      },
      /** 详细信息 **/
      handleUpdate(row) {
        this.reset();
        // getDetail(id).then(response => {
        this.form = row;
        let id = {
          orderDetailId: row.orderDetailId
        };
        this.fpInfoDisabled = row.state == '2';
        getFPDetail(id).then(res => {
          this.form = res.data;
          // this.reSelectMsg=this.form.recipientsAddress
          let arr = this.form.recipientsAddress.split('+');
          if (arr.length <= 0) {
            this.showSelect = false;
          } else {
            this.reSelectMsg = arr[0] + '/' + arr[1] + '/' + arr[2];
            this.newAddress = arr[0] + '+' + arr[1] + '+' + arr[2];
            this.$set(this.form, 'detAddress', arr[3]);
            this.showSelect = false;
            this.showSelect = true;
          }
          this.open = true;
          this.title = "订单详情";
          // setTimeout(this.showSelect=true,500);
        });
        // this.open = true;
        // this.title = "订单详情";
        // });
      },
      //提交修改
      onSubmit() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.newAddress) {
              this.form.recipientsAddress = this.newAddress + '+' + this.form.detAddress;
            } else {
              return this.$message.error("请选择省市区后再提交修改.")
            }
            updateOrderDetail({
              ...this.form,
              taxNumber: replaceTrim(this.form.taxNumber),
              bankAccount: replaceChineseHLines(replaceTrim(this.form.bankAccount)),
              telephone: replaceChineseHLines(replaceTrim(this.form.telephone)),
              recipientsPhone: replaceTrim(this.form.recipientsPhone),
            }).then(res => {
              this.open = false;
              this.$message.success("修改成功");
              this.getList();
            }) ;
          }
        });
      },
      // 取消按钮
      cancel() {
        this.disabled = false;
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
          recipientsAddress: null,
          invoiceMark: null,
        };
        this.reSelectMsg = "";
        this.newAddress = "";
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
        this.ids = selection.map(item => item.orderDetailId);
        this.single = selection.length !== 1;
        this.multiple = !selection.length;
      },
      handleCommand(command) {
        this.$message('click on item ' + command);
      },
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
          case "9":
            return "导出中";
          default:
            return "未推送";
        }
      },
      addDate() {
        let nowDate = new Date();
        let date = {
          year: nowDate.getFullYear(),
          month: nowDate.getMonth() + 1,
          date: nowDate.getDate(),
          hour: nowDate.getHours(),
          minute: nowDate.getMinutes(),
          second: nowDate.getSeconds(),
        };
        let zero1 = 0,
          zero2 = 0,
          zero3 = 0,
          zero4 = 0,
          zero5 = 0;
        if (date.month >= 10) zero1 = "";
        if (date.date >= 10) zero2 = "";
        if (date.hour >= 10) zero3 = "";
        if (date.minute >= 10) zero4 = "";
        if (date.second >= 10) zero5 = "";
        let systemDate =
          date.year + "-" + zero1 + date.month + "-" + zero2 + date.date;
        return systemDate;
      },
      //发票作废重开
      voidInvoice(row) {
        /*if (fphm == '' || fphm == null) {
          return this.$message.error("还未开具发票")
        }*/
        this.$confirm('此操作将永久修改这条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          confirmButtonClass: 'confirmCls',
          center: true,
          type: 'warning'
        }).then(() => {
          fpzf(row.id).then(response => {
            this.msgSuccess("作废成功");
            this.getList();
          })
            .catch(error => {
              // console.log(error);
              this.msgSuccess("发票作废失败");
            })
            .finally(() => {
              this.getList();
            });
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
      },
      updateState(row,state){
        this.$confirm('此操作将永久修改这条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          confirmButtonClass: 'confirmCls',
          center: true,
          type: 'warning'
        }).then(() => {
          updateInvoiceState(row.id,state).then(response => {
            this.msgSuccess("修改成功");
            this.getList();
          })
        })
      }
    }
  };
</script>
<style scoped>
  .zuofei:hover {
    /*content: "123";*/
    color: red;
  }

  .confirmCls {
    background: white;
  }

  /*.zuofei:after{*/
  /*  content: "123";*/
  /*  !*color:red;*!*/
  /*}*/
</style>
