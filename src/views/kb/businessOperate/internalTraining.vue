<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <!--<el-form-item label="项目状态" prop="projectStatus">-->
        <!--<el-select v-model="queryParams.projectStatus" placeholder="请选择项目状态" clearable size="small">-->
          <!--<el-option label="请选择字典生成" value="" />-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="部门" prop="department">
        <el-input
          v-model="queryParams.department"
          placeholder="请输入部门"
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
          v-hasPermi="['ywyx:guoJiPeiXun:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['ywyx:guoJiPeiXun:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['ywyx:guoJiPeiXun:remove']"
        >删除</el-button>
      </el-col>
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="warning"-->
          <!--icon="el-icon-download"-->
          <!--size="mini"-->
          <!--@click="handleExport"-->
          <!--v-hasPermi="['ywyx:guoJiPeiXun:export']"-->
        <!--&gt;导出</el-button>-->
      <!--</el-col>-->
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="internalTrainingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="项目状态" align="center" prop="projectStatus" />
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="项目进度" align="center" prop="projectProgress" />
      <el-table-column label="阶段" align="center" prop="stage" />
      <el-table-column label="工期" align="center" prop="gongQi" />
      <el-table-column label="部门" align="center" prop="department" />
      <el-table-column label="今日情况" align="center" prop="condition" />
      <el-table-column label="备注" align="center" prop="mark" width="180" :show-overflow-tooltip="true"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ywyx:guoJiPeiXun:edit']"
          >修改</el-button>
          <!--<el-button-->
            <!--size="mini"-->
            <!--type="text"-->
            <!--icon="el-icon-delete"-->
            <!--@click="handleDelete(scope.row)"-->
            <!--v-hasPermi="['ywyx:guoJiPeiXun:remove']"-->
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

    <!-- 添加或修改业务运行-国际化培训对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目状态">
          <el-input v-model="form.projectStatus" placeholder="请输入项目状态" />
          <!--<el-radio-group v-model="form.projectStatus">-->
            <!--<el-radio label="1">请选择字典生成</el-radio>-->
          <!--</el-radio-group>-->
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="form.projectName" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目进度" prop="projectProgress">
          <el-input v-model="form.projectProgress" placeholder="请输入项目进度" />
        </el-form-item>
        <el-form-item label="阶段" prop="stage">
          <el-input v-model="form.stage" placeholder="请输入阶段" />
        </el-form-item>
        <el-form-item label="工期" prop="gongQi">
          <el-input v-model="form.gongQi" placeholder="请输入工期" />
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="form.department" placeholder="请输入部门" />
        </el-form-item>
        <el-form-item label="今日情况" prop="condition">
          <el-input v-model="form.condition" placeholder="请输入今日情况" />
        </el-form-item>
        <el-form-item label="备注" prop="mark">
          <el-input v-model="form.mark" placeholder="请输入备注" />
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
import { listGuojiPeixun, getGuojiPeixun, delGuojiPeixun, addGuojiPeixun, updateGuojiPeixun, exportGuojiPeixun } from "@/api/kb/businessOperate/internalTraining";

export default {
  name: "InternalTraining",
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
      // 业务运行-国际化培训表格数据
      internalTrainingList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectStatus: null,
        projectName: null,
        projectProgress: null,
        stage: null,
        gongQi: null,
        department: null,
        condition: null,
        mark: null,
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
    /** 查询业务运行-国际化培训列表 */
    getList() {
      this.loading = true;
      listGuojiPeixun(this.queryParams).then(response => {
        this.internalTrainingList = response.rows;
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
        projectStatus: null,
        projectName: null,
        projectProgress: null,
        stage: null,
        gongQi: null,
        department: null,
        condition: null,
        mark: null,
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
      this.title = "添加业务运行-国际化培训";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getGuojiPeixun(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改业务运行-国际化培训";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateGuojiPeixun(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGuojiPeixun(this.form).then(response => {
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
      this.$confirm('是否确认删除业务运行-国际化培训编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delGuojiPeixun(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有业务运行-国际化培训数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportGuojiPeixun(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
