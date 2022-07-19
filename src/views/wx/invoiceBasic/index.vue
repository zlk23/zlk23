<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="单位抬头" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入单位抬头"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单位税号" prop="taxNumber">
        <el-input
          v-model="queryParams.taxNumber"
          placeholder="请输入单位税号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['wx:invoiceData:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-has-permi="['wx:invoiceData:edit']"
        >修改
        </el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-edit"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-has-permi="['wx:invoiceData:remove']"
        >
          删除
        </el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="default"
          icon="el-icon-refresh"
          size="mini"
          @click="handleRefresh"
        >
          同步
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['wx:invoiceData:import']"
        >
          导入发票数据
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-has-permi="['wx:invoiceData:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="invoiceDataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="发票抬头" align="center" prop="title"/>
      <el-table-column label="单位税号" align="center" prop="taxNumber"/>
      <el-table-column label="单位地址" align="center" prop="companyAddress"/>
      <el-table-column label="单位电话" align="center" prop="telephone"/>
      <el-table-column label="开户银行" align="center" prop="bankName"/>
      <el-table-column label="银行账户" align="center" prop="bankAccount"/>
      <el-table-column label="修改次数" align="center" prop="updateNum"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-has-permi="['wx:invoiceData:edit']"
          >
            修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDelete(scope.row)"
            v-has-permi="['wx:invoiceData:remove']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!--添加或修改微信用户详细信息对话框-->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="发票抬头" prop="title">
          <el-input v-model="form.title" placeholder="请输入发票抬头"/>
        </el-form-item>
        <el-form-item label="单位税号" prop="taxNumber">
          <el-input v-model="form.taxNumber" placeholder="请输入单位税号"/>
        </el-form-item>
        <el-form-item label="单位地址" prop="companyAddress">
          <el-input v-model="form.companyAddress" placeholder="请输入单位地址"/>
        </el-form-item>
        <el-form-item label="单位电话" prop="telephone">
          <el-input v-model="form.telephone" placeholder="请输入单位电话"/>
        </el-form-item>
        <el-form-item label="开户银行" prop="bankName">
          <el-input v-model="form.bankName" placeholder="请输入开户银行"/>
        </el-form-item>
        <el-form-item label="银行账户" prop="bankAccount">
          <el-input v-model="form.bankAccount" placeholder="请输入银行账户"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        v-loading="upload.isUploading"
        element-loading-text="导入时间可能会稍长，请耐心等候。"
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?coverSupport=' + upload.coverSupport"
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
            v-model="upload.coverSupport"
          />是否覆盖已经存在的用户数据
          <el-link type="primary" style="font-size:12px" @click="importTemplate">下载模板</el-link>
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
  import {
    listInvoiceData,
    getInvoiceData,
    addInvoiceData,
    updateInvoiceData,
    delInvoiceData,
    exportInvoiceData,
    importTemplate,
    refreshTemplate
  } from '@/api/wx/invoiceData';

  import { taxNumberValidator, bankAccountValidator, telephoneValidator, phoneValidator, replaceTrim, replaceChineseHLines } from '../../../utils/validate'
  import { getToken } from '../../../utils/auth'

  export default {
    name: 'index',
    data() {
      const taxNumberCheck = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("请输入单位税号"))
        } else if (value && !taxNumberValidator(value)) {
          return callback(new Error("由15-20位数字和大写字母组成"))
        }
        callback();
      };
      const bankAccountCheck = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("请输入银行账户"))
        } else if (value && !bankAccountValidator(value)) {
          return callback(new Error("由9-30位的数字和-(选填)组成"))
        }
        callback();
      };
      const telephoneCheck = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("请输入单位电话"))
        } else if (value && !telephoneValidator(value) && !phoneValidator(value)) {
          return callback(new Error("11位手机号或座机号码(可选填-)"))
        }
        callback();
      };
      return {
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
        // 发票数据表格数据
        invoiceDataList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          title: {required: true, message: "请输入发票抬头"},
          taxNumber: { required: true, validator: taxNumberCheck },
          companyAddress: {required: true, message: "请输入单位地址"},
          telephone: { required: true, validator: telephoneCheck },
          bankName: {required: true, message: "请输入开户银行"},
          bankAccount: { required: true, validator: bankAccountCheck },
        },
        // 用户导入参数
        upload: {
          // 是否显示弹出层（用户导入）
          open: false,
          // 弹出层标题（用户导入）
          title: "",
          // 是否禁用上传
          isUploading: false,
          // 是否覆盖已经存在的用户数据
          coverSupport: true,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/wx/invoiceData/importData"
        },
      }
    },
    created() {
      this.getList()
    },
    methods: {

      //同步
      handleRefresh(){
        //refreshTemplate
        refreshTemplate().then(response => {

          this.msgSuccess(response.msg)
        });
      },
      getList() {
        this.loading = true
        listInvoiceData(this.queryParams).then(response => {
          this.invoiceDataList = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      // 表单重置
      reset() {
        this.form = {
          //主键
          id: null
        }
        this.resetForm('form')
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
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加发票基础数据";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id || this.ids
        getInvoiceData(id).then(response => {
          this.form = { ...response.data }
          this.title = '修改发票基础数据'
          this.open = true
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$confirm('是否确认删除?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delInvoiceData(ids)
        }).then(response => {
          this.getList()
          this.msgSuccess('删除成功')
        })
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateInvoiceData(this.form).then(response => {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              })
            } else {
              addInvoiceData(this.form).then(response => {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              })
            }
          }
        })
      },
      /** 导入按钮操作 */
      handleImport() {
        this.upload.title = "用户导入";
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
        this.$confirm(response.msg, '导入结果', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '下载导入结果'
        }).catch(action => {
            if (action === 'cancel') {
              let str = response.msg;
              let blob = new Blob([str]);
              let url = window.URL.createObjectURL(blob);
              let a = document.createElement('a');
              a.href = url;
              a.download = "导入结果";
              a.click();
              document.remove(a);
            }
          });
        // this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true }).catch((action) => {
        //   if (action === 'cancel') {
        //     let str = "response.msg";
        //     let blob = new Blob();
        //     let url = window.URL.createObjectURL(blob);
        //     let a = document.createElement('a');
        //     a.href = url;
        //     a.download = "导入报告";
        //     a.click();
        //     document.remove(a);
        //   }
        // });
        this.getList();
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return exportInvoiceData(queryParams)
        }).then(response => {
          this.download(response.msg)
        })
      }
    }
  }
</script>

<style scoped>

</style>
