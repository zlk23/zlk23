<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="系部" prop="facultyName">
        <el-select v-model="queryParams.facultyName" placeholder="请选择系部" clearable size="small">
          <el-option v-for="faculty in facultyOptions" :label="faculty.dictLabel" :value="faculty.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="typeName">
        <el-select v-model="queryParams.typeName" placeholder="请选择类型" clearable size="small">
          <el-option v-for="type in typeOptions" :label="type.dictLabel" :value="type.dictValue" />
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
          v-hasPermi="['ywyx:zyjyFaculty:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['ywyx:zyjyFaculty:edit']"
        >修改</el-button>
      </el-col>
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="danger"-->
          <!--icon="el-icon-delete"-->
          <!--size="mini"-->
          <!--:disabled="multiple"-->
          <!--@click="handleDelete"-->
          <!--v-hasPermi="['ywyx:zyjyFaculty:remove']"-->
        <!--&gt;删除</el-button>-->
      <!--</el-col>-->
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="warning"-->
          <!--icon="el-icon-download"-->
          <!--size="mini"-->
          <!--@click="handleExport"-->
          <!--v-hasPermi="['ywyx:zyjyFaculty:export']"-->
        <!--&gt;导出</el-button>-->
      <!--</el-col>-->
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="stuFacultyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="系部" align="center" prop="facultyName" />
      <el-table-column label="类型" align="center" prop="typeName" />
      <el-table-column label="培训人数" align="center" prop="peiXunNum" />
      <!--<el-table-column label="修改状态" align="center" prop="changeStatus" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ywyx:zyjyFaculty:edit']"
          >修改</el-button>
          <!--<el-button-->
            <!--size="mini"-->
            <!--type="text"-->
            <!--icon="el-icon-delete"-->
            <!--@click="handleDelete(scope.row)"-->
            <!--v-hasPermi="['ywyx:zyjyFaculty:remove']"-->
          <!--&gt;删除</el-button>-->
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

    <!-- 添加或修改业务运行-职业教育各院系人数对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="院系名称" prop="facultyName">
          <el-select v-model="form.facultyName" placeholder="请选择系部" clearable size="small">
            <el-option v-for="faculty in facultyOptions" :label="faculty.dictLabel" :value="faculty.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="typeName">
          <el-select v-model="form.typeName" placeholder="请选择类型" clearable size="small">
            <el-option v-for="type in typeOptions" :label="type.dictLabel" :value="type.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="培训人数" prop="peiXunNum">
          <el-input v-model="form.peiXunNum" placeholder="请输入培训人数" />
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
import { listZyjyFaculty, getZyjyFaculty, delZyjyFaculty, addZyjyFaculty, updateZyjyFaculty, exportZyjyFaculty } from "@/api/kb/businessOperate/stuFaculty";

export default {
  name: "ZyjyFaculty",
  components: {
  },
  data() {
    return {
      facultyOptions: [
        {dictLabel: "电气工程系", dictValue: "电气工程系"},
        {dictLabel: "电气自动化系", dictValue: "电气自动化系"},
        {dictLabel: "计量工程系", dictValue: "计量工程系"},
        {dictLabel: "动力工程系", dictValue: "动力工程系"},
        {dictLabel: "信息工程系", dictValue: "信息工程系"},
        {dictLabel: "基础部", dictValue: "基础部"},
      ],
      typeOptions: [
        {dictLabel: "普通大专班", dictValue: "普通大专班"},
        {dictLabel: "定向培养班", dictValue: "定向培养班"},
        {dictLabel: "五年一贯制", dictValue: "五年一贯制"},
      ],
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
      // 业务运行-职业教育各院系人数表格数据
      stuFacultyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        facultyName: null,
        typeName: null,
        peiXunNum: null,
        changeStatus: null,
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
    /** 查询业务运行-职业教育各院系人数列表 */
    getList() {
      this.loading = true;
      listZyjyFaculty(this.queryParams).then(response => {
        this.stuFacultyList = response.rows;
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
        facultyName: null,
        typeName: null,
        peiXunNum: null,
        createTime: null,
        changeStatus: 0,
        updateBy: null,
        updateTime: null
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
      this.title = "添加业务运行-职业教育各院系人数";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getZyjyFaculty(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改业务运行-职业教育各院系人数";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateZyjyFaculty(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addZyjyFaculty(this.form).then(response => {
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
      this.$confirm('是否确认删除业务运行-职业教育各院系人数编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delZyjyFaculty(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有业务运行-职业教育各院系人数数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportZyjyFaculty(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
