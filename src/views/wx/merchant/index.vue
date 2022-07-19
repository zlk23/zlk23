<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="商户编号" prop="mchId">
        <el-input
          v-model="queryParams.mchId"
          placeholder="请输入商户编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商户名称" prop="merchantName">
        <el-input
          v-model="queryParams.merchantName"
          placeholder="请输入商户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商户简称" prop="merchantShortname">
        <el-input
          v-model="queryParams.merchantShortname"
          placeholder="请输入商户简称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商户类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择商户类型" clearable size="small">
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
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
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['wx:merchant:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['wx:merchant:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['wx:merchant:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['wx:merchant:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="merchantList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="商户编号" align="center" prop="mchId"/>
      <el-table-column label="商户名称" align="center" prop="merchantName"/>
      <el-table-column label="商户简称" align="center" prop="merchantShortname"/>
      <el-table-column label="缴费类型" align="center" prop="type" :formatter="typeFormatter"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wx:merchant:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wx:merchant:remove']"
          >删除
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

    <!--添加或修改商户信息对话框-->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商户编号" prop="mchId">
          <el-input v-model="form.mchId" placeholder="请输入商户编号"/>
        </el-form-item>
        <el-form-item label="商户名称" prop="merchantName">
          <el-input v-model="form.merchantName" placeholder="请输入商户名称"/>
        </el-form-item>
        <el-form-item label="商户简称" prop="merchantName">
          <el-input v-model="form.merchantShortname" placeholder="请输入商户简称"/>
        </el-form-item>
        <el-form-item label="商户类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择商户类型" clearable size="small">
            <el-option
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getMerchantList,
    getMerchantDetail,
    updateMerchant,
    addMerchant,
    delMerchant,
    exportMerchant
  } from '@/api/wx/merchant'

  import { listType } from '@/api/wx/feeType'

  export default {
    name: 'Merchant',
    components: {},
    data() {
      return {
        disabled: false,
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
        // 电专老师表格数据
        merchantList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          mchId: null,
          merchantName: null,
          merchantShortname: null,
          type: null
        },
        typeOptions: [],
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          mchId: {required: true, message: "请输入商户编号", trigger: ' blur'},
          merchantName: {required: true, message: "请输入商户名称", trigger: ' blur'},
          merchantShortname: {required: true, message: "请输入商户简称", trigger: ' blur'},
          type: {required: true, message: "请选择缴费类型", trigger: ' blur'}
        }
      }
    },
    created() {
      listType({ pageNum: 1, pageSize: 1000 }).then(resp => {
        this.typeOptions = (resp.rows || []).map(item => {
          return { dictValue: item.feeTypeNum, dictLabel: item.feeTypeName }
        })
      }).finally(() => {
        this.getList();
      })
    },
    mounted() {

    },
    methods: {
      /** 查询电专老师列表 */
      getList() {
        this.loading = true
        getMerchantList(this.queryParams).then(response => {
          this.merchantList = response.rows
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
          id: null,
          // 商户号
          mchId: null,
          // 商户名称
          merchantName: null,
          // 商户简称
          merchantShortname: null,
          //缴费类型
          type: null
        }
        this.disabled = false
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
      typeFormatter(row) {
        let label = "";
        (this.typeOptions || []).forEach(typeOption => {
          if (row.type === typeOption.dictValue) {
            label = typeOption.dictLabel
          }
        })
        return label;
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
        this.title = '添加商户信息'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id || this.ids
        getMerchantDetail(id).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改商户信息'
        })
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateMerchant(this.form).then(response => {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              })
            } else {
              addMerchant(this.form).then(response => {
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
        this.$confirm('是否确认删除商户编号为"' + ids + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delMerchant(ids)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出商户信息?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportMerchant(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
        // this.download('wx/merchant/export', {
        //   ...this.queryParams
        // }, `商户信息.xlsx`)
      }
    }
  }
</script>
