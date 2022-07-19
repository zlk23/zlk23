<template>
  <div class="app-container">
    <!--<el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">-->
      <!--<el-form-item>-->
        <!--<el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
        <!--<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
      <!--</el-form-item>-->
    <!--</el-form>-->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['wx:shuffling:add']"
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
          <!--v-hasPermi="['wx:shuffling:edit']"-->
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
          <!--v-hasPermi="['wx:shuffling:remove']"-->
        <!--&gt;删除-->
        <!--</el-button>-->
      <!--</el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="shufflingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="图片描述" align="center" prop="shufflingName"/>
      <el-table-column label="图片地址" align="center" prop="shufflingPath">
        <template slot-scope="scope">
          <el-image :src="scope.row.shufflingPath" style="width: 40px" :preview-src-list="[scope.row.shufflingPath]"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="shufflingSort"/>
      <el-table-column label="类型" align="center" prop="shufflingType" :formatter="typeFormatter"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wx:shuffling:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wx:shuffling:remove']"
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

    <!--添加或轮播图信息对话框-->
    <el-dialog :title="title" :visible.sync="open" width="500px" destroy-on-close append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="small">
        <el-form-item label="图片描述" prop="shufflingName">
          <el-input v-model="form.shufflingName" placeholder="请输入轮播图描述"/>
        </el-form-item>
        <!--<el-form-item label="图片" prop="shufflingPath">-->
        <el-form-item label="轮播图片" prop="shufflingPath">
          <el-upload
            ref="upload"
            class="avatar-uploader"
            list-type="picture"
            :name="upload.name"
            :headers="upload.headers"
            :action="upload.url"
            accept=".jpg, .png,.jpeg"
            :before-remove="handleRemove"
            :on-success="handleOnSuccess"
            :on-error="handleOnError"
            :limit="1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
          <el-image v-if="uploadImg !== null && uploadImg === form.shufflingPath" :src="uploadImg" style="width: 80px"/>
        </el-form-item>
        <el-form-item label="排序" prop="shufflingSort">
          <el-input-number v-model="form.shufflingSort" controls-position="right" :min="0" />
          <!--<el-input v-model="form.shufflingSort" placeholder="请输入排序"/>-->
        </el-form-item>
        <el-form-item label="类型" prop="shufflingType">
          <el-select v-model="form.shufflingType" placeholder="请选择类型" clearable size="small">
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
    getShufflingList,
    getShufflingDetail,
    updateShuffling,
    addShuffling,
    delShuffling,
    exportShuffling
  } from '@/api/wx/shuffling'
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
        shufflingList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          // shufflingName: null,
          // shufflingPath: null,
          // shufflingSort: null,
          // type: null
        },
        uploadImg: null,
        upload: {
          // 弹出层标题（班次导入）
          name: "file",
          // 是否禁用上传
          isUploading: false,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + '/wx/shuffling/uploadPic'
        },
        fileList: [],
        typeOptions: [
          {dictValue: 0, dictLabel: "pc"},
          {dictValue: 1, dictLabel: "mobile"}
        ],
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          shufflingName: {required: true, message: "请输入图片描述", trigger: ' blur'},
          shufflingPath: {required: true, message: "请输入图片地址", trigger: ' blur'},
          shufflingSort: {required: true, message: "请输入排序", trigger: ' blur'},
          shufflingType: {required: true, message: "请选择类型", trigger: ' blur'}
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
        getShufflingList(this.queryParams).then(response => {
          this.shufflingList = response.rows
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
          shufflingName: null,
          shufflingPath: null,
          shufflingSort: null,
          shufflingType: null,
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
          if (row.shufflingType === typeOption.dictValue) {
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
        getShufflingDetail(id).then(response => {
          // console.log(response);
          this.form = response.data || ((response.rows || [])[0] || {});
          this.uploadImg = (response.data || ((response.rows || [])[0] || {})).shufflingPath;
          this.open = true;
          this.title = '修改商户信息';
        })
      },
      /** 提交按钮 */
      submitForm() {
        console.log(this.form)
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateShuffling(this.form).then(response => {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              })
            } else {
              addShuffling(this.form).then(response => {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              })
            }
          }
        })
      },
      handleBeforeUpload(file) {
        // this.fileList = [file];
        // // console.log(this.fileList)
        // return false;
      },
      handleOnSuccess(response, file, fileList) {
        console.log(response);
          if (response.code === 200) {
            this.form.shufflingPath = String(response.msg);
            console.log(this.form.shufflingPath === this.uploadImg);
          }
      },
      handleOnError(response, file, fileList) {
        console.log(response);
      },
      handleRemove(file, fileList) {
        this.form.shufflingPath = null;
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$confirm('是否确认删除编号为"' + ids + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delShuffling(ids)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
      },
    }
  }
</script>
