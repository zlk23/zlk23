<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['wx:notice:add']"
        >新增
        </el-button>
      </el-col>
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="success"-->
          <!--icon="el-icon-edit"-->
          <!--size="mini"-->
          <!--:disabled="single"-->
          <!--@click="handleUpdate"-->
          <!--v-hasPermi="['wx:notice:edit']"-->
        <!--&gt;修改-->
        <!--</el-button>-->
      <!--</el-col>-->
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="danger"-->
          <!--icon="el-icon-delete"-->
          <!--size="mini"-->
          <!--:disabled="multiple"-->
          <!--@click="handleDelete"-->
          <!--v-hasPermi="['wx:notice:remove']"-->
        <!--&gt;删除-->
        <!--</el-button>-->
      <!--</el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="noticeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="标题" align="center" prop="noticeTitle"/>
      <el-table-column label="文件" align="center" prop="noticePath" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handlePdfUrlClick(scope.row.noticePath)"
            v-hasPermi="['wx:notice:edit']"
          >
            {{scope.row.noticePath}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="noticeSoft"/>
      <el-table-column label="是否展示" align="center" prop="isShow">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isShow"
            v-has-permi="['wx:notice:saleClass']"
            :active-value="0"
            :inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="noticeType" :formatter="typeFormatter"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wx:notice:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wx:notice:remove']"
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
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body destroy-on-close>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="noticeTitle">
          <el-input v-model="form.noticeTitle" placeholder="请输入标题"/>
        </el-form-item>
        <el-form-item label="文件" prop="noticePath">
          <el-upload
            ref="upload"
            class="avatar-uploader"
            :name="upload.name"
            :headers="upload.headers"
            :action="upload.url"
            accept=".pdf"
            :before-remove="handleRemove"
            :on-success="handleOnSuccess"
            :on-error="handleOnError"
            :limit="1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传pdf文件</div>
          </el-upload>
          <!--<el-tooltip-->
            <!--v-if="uploadImg !== null && uploadImg === form.noticePath"-->
            <!--content="点击查看pdf文件"-->
            <!--placement="right-start"-->
          <!--&gt;-->
            <!--<el-button-->
              <!--size="mini"-->
              <!--type="text"-->
              <!--@click="handlePdfUrlClick(form.noticePath)"-->
            <!--&gt;-->
              <!--{{form.noticePath}}-->
            <!--</el-button>-->
            <span v-if="uploadImg !== null && uploadImg === form.noticePath" class="pdf-url-preview" :title="form.noticePath" @click="handlePdfUrlClick(form.noticePath)">{{form.noticePath}}</span>
          <!--</el-tooltip>-->
          <!--<el-image v-if="uploadImg !== null && uploadImg === form.noticePath" :src="uploadImg"/>-->
          <!--<el-input v-model="form.noticePath" placeholder="请输入图片地址"/>-->
        </el-form-item>
        <el-form-item label="排序" prop="noticeSoft">
          <el-input-number v-model="form.noticeSoft" controls-position="right" :min="0" />
          <!--<el-input v-model="form.noticeSoft" placeholder="请输入排序"/>-->
        </el-form-item>
        <!--<el-form-item label="类型" prop="noticeType">-->
          <!--<el-select v-model="form.noticeType" placeholder="请选择类型" clearable size="small">-->
            <!--<el-option-->
              <!--v-for="dict in typeOptions"-->
              <!--:key="dict.dictValue"-->
              <!--:label="dict.dictLabel"-->
              <!--:value="dict.dictValue"-->
            <!--/>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
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
    getNoticeList,
    getNoticeDetail,
    updateNotice,
    addNotice,
    delNotice,
  } from '@/api/wx/notice'
  import { getToken } from '../../../utils/auth'

  export default {
    name: 'index',
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
        noticeList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          // noticeTitle: null,
          // noticePath: null,
          // noticeSoft: null,
          // noticeType: null,
        },
        uploadImg: {},
        upload: {
          // 弹出层标题（班次导入）
          name: "file",
          // 是否禁用上传
          isUploading: false,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + '/wx/notice/uploadPic'
        },
        typeOptions: [
          {dictValue: 0, dictLabel: "pc"},
          {dictValue: 1, dictLabel: "mobile"}
        ],
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          noticeTitle: {required: true, message: "请输入文件描述", trigger: ' blur'},
          noticePath: {required: true, message: "请输入文件地址", trigger: ' blur'},
          noticeSoft: {required: true, message: "请输入排序", trigger: ' blur'},
          noticeType: {required: true, message: "请选择类型", trigger: ' blur'}
        }
      }
    },
    created() {},
    mounted() {
      this.getList();
    },
    methods: {
      /** 查询电专老师列表 */
      getList() {
        this.loading = true
        getNoticeList(this.queryParams).then(response => {
          this.noticeList = response.rows
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
          id: null,
          noticeTitle: null,
          noticePath: null,
          noticeSoft: null,
          noticeType: null,
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
          if (row.noticeType === typeOption.dictValue) {
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
        getNoticeDetail(id).then(response => {
          this.form = (response.rows || [])[0] || {}
          this.uploadImg = ((response.rows || [])[0] || {}).noticePath;
          this.open = true
          this.title = '修改商户信息'
        })
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateNotice(this.form).then(response => {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              })
            } else {
              addNotice(this.form).then(response => {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              })
            }
          }
        })
      },
      handleOnSuccess(response, file, fileList) {
        console.log(response);
        if (response.code === 200) {
          this.form.noticePath = String(response.msg);
          // console.log(this.form.noticePath === this.uploadImg);
        }
      },
      handleOnError(response, file, fileList) {
        console.log(response);
      },
      handleRemove(file, fileList) {
        this.form.noticePath = null;
      },
      // 状态修改
      handleStatusChange(row) {
        let text = row.isShow == 0 ? '展示' : '隐藏'
        this.$confirm('确认要"' + text + '""' + row.noticeTitle + '"吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return updateNotice({ id: row.id, isShow: row.isShow })
        }).then(() => {
          // this.getList();
          this.msgSuccess(text + '成功')
        }).catch(function() {
          row.isShow = row.isShow == 0 ? 1 : 0
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
          return delNotice(ids)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
      },
      handlePdfUrlClick(url) {
        window.open(url, '_blank')
      },
    }
  }
</script>

<style scoped>
  .pdf-url-preview {
    width: 100%;
    display :inline-block ;
    color: #00afff;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pdf-url-preview:hover {
    cursor: pointer;
    color: red;
  }
</style>
