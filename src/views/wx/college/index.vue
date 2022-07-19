<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="学校名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入学校名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学校简称" prop="shortName">
        <el-input
          v-model="queryParams.shortName"
          placeholder="请输入学校简称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学校类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择学校类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
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
          v-hasPermi="['wx:college:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['wx:college:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['wx:college:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['wx:college:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="collegeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" width="100" />
      <el-table-column label="学校名称" align="center" prop="name" width="120" />
      <el-table-column label="学校简称" align="center" prop="shortName" width="120"/>
      <el-table-column label="学校类型" align="center" prop="type" width="120"/>
      <el-table-column label="官网地址" align="center" prop="website" width="120"/>
      <el-table-column label="学校地址" align="center" prop="address" width="120"/>
      <el-table-column label="联系电话" align="center" prop="telephoneNumber" width="120"/>
      <el-table-column label="logo照片" align="center" prop="pictureUrl" width="120"/>
      <el-table-column label="创办时间" align="center" prop="startTime" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="校长" align="center" prop="president" />
      <el-table-column label="创建人" align="center" prop="createUser" />
      <el-table-column label="修改人" align="center" prop="updateUser" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wx:college:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wx:college:remove']"
          >删除</el-button>
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

    <!-- 添加或修改学校对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学校名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入学校名称" />
        </el-form-item>
        <el-form-item label="学校简称" prop="shortName">
          <el-input v-model="form.shortName" placeholder="请输入学校简称" />
        </el-form-item>
        <el-form-item label="学校类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择学校类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="官网地址" prop="website">
          <el-input v-model="form.website" placeholder="请输入官网地址" />
        </el-form-item>
        <el-form-item label="学校地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入学校地址" />
        </el-form-item>
        <el-form-item label="联系电话" prop="telephoneNumber">
          <el-input v-model="form.telephoneNumber" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="创办时间" prop="startTime">
          <el-date-picker clearable size="small" style="width: 200px"
                          v-model="form.startTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择创办时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上传logo" prop="startTime">
          <el-upload
            class="upload-demo"
            action="http://localhost:8380/gw/wx/logo/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转链接" prop="skipLink">
          <el-input v-model="form.skipLink" placeholder="请输入跳转链接(用于登录后跳转)" />
        </el-form-item>
        <el-form-item label="后台地址" prop="serviceUrl">
          <el-input v-model="form.serviceUrl" placeholder="请输入后台项目地址" />
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
  import { listCollege, getCollege, delCollege, addCollege, updateCollege, exportCollege } from "@/api/wx/college";
  import { getToken } from "@/utils/auth";
  import { treeselect } from "@/api/system/dept";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";

  export default {
    name: "College",
    components: {
    },
    data() {
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
        // 学校表格数据
        collegeList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: null,
          shortName: null,
          type: null,
          website: null,
          address: null,
          telephoneNumber: null,
          pictureUrl: null,
          thumbUrl: null,
          startTime: null,
          president: null,
          presidentId: null,
          mainCampusId: null,
          skipLink: null,
          serviceUrl: null,
          createUser: null,
          updateUser: null,
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
      /** 查询学校列表 */
      getList() {
        this.loading = true;
        listCollege(this.queryParams).then(response => {
          this.collegeList = response.rows;
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
          name: null,
          shortName: null,
          type: null,
          website: null,
          address: null,
          telephoneNumber: null,
          pictureUrl: null,
          thumbUrl: null,
          startTime: null,
          president: null,
          presidentId: null,
          mainCampusId: null,
          skipLink: null,
          serviceUrl: null,
          createTime: null,
          createUser: null,
          updateTime: null,
          updateUser: null,
          delFlag: null
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
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加学校";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getCollege(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改学校";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateCollege(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addCollege(this.form).then(response => {
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
        this.$confirm('是否确认删除学校编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCollege(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有学校数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCollege(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      }
    }
  };
</script>
