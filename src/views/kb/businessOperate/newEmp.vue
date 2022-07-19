<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="班次名称" prop="className">
        <el-input
          v-model="queryParams.className"
          placeholder="请输入班次名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="校区" prop="campusType">
        <el-select v-model="queryParams.campusType" placeholder="请选择校区" clearable size="small">
          <el-option v-for="campusType in campusTypeOptions" :label="campusType.dictLabel" :value="campusType.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门" prop="courseName">
        <el-select v-model="queryParams.courseName" placeholder="请选择部门" clearable size="small">
          <el-option v-for="department in departmentOptions" :label="department.dictLabel" :value="department.dictValue" />
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
          v-hasPermi="['ywyx:xygZyjy:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['ywyx:xygZyjy:edit']"
        >修改</el-button>
      </el-col>
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="danger"-->
          <!--icon="el-icon-delete"-->
          <!--size="mini"-->
          <!--:disabled="multiple"-->
          <!--@click="handleDelete"-->
          <!--v-hasPermi="['ywyx:xygZyjy:remove']"-->
        <!--&gt;删除</el-button>-->
      <!--</el-col>-->
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="warning"-->
          <!--icon="el-icon-download"-->
          <!--size="mini"-->
          <!--@click="handleExport"-->
          <!--v-hasPermi="['ywyx:xygZyjy:export']"-->
        <!--&gt;导出</el-button>-->
      <!--</el-col>-->
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="newEmp" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!--<el-table-column label="修改状态" align="center" prop="id" />-->
      <el-table-column label="班次名称" align="center" prop="className" />
      <!--<el-table-column label="校区类型" align="center" prop="campusType" />-->
      <el-table-column label="校区名称" align="center" prop="campusName" />
      <el-table-column label="部门名称" align="center" prop="courseName" />
      <el-table-column label="班级数" align="center" prop="banjiNum" />
      <el-table-column label="培训人数" align="center" prop="peixunNum" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ywyx:xygZyjy:edit']"
          >修改</el-button>
          <!--<el-button-->
            <!--size="mini"-->
            <!--type="text"-->
            <!--icon="el-icon-delete"-->
            <!--@click="handleDelete(scope.row)"-->
            <!--v-hasPermi="['ywyx:xygZyjy:remove']"-->
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

    <!-- 添加或修改业务运行-新员工培训对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="班次名称" prop="className">
          <el-input v-model="form.className" placeholder="请输入班次名称" />
        </el-form-item>
        <!--<el-form-item label="校区类型" prop="campusType">-->
          <!--<el-select v-model="form.campusType" placeholder="请选择校区类型">-->
            <!--<el-option v-for="campusType in campusTypeOptions" :label="campusType.dictLabel" :value="campusType.dictValue" />-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="校区" prop="campusType">
          <el-select v-model="form.campusType" placeholder="请选择校区">
            <el-option v-for="campusType in campusTypeOptions" :label="campusType.dictLabel" :value="campusType.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="courseName">
          <el-select v-model="form.courseName" placeholder="请选择部门">
            <el-option v-for="department in departmentOptions" :label="department.dictLabel" :value="department.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级数" prop="banjiNum">
          <el-input v-model="form.banjiNum" placeholder="请输入班级数" />
        </el-form-item>
        <el-form-item label="培训人数" prop="peixunNum">
          <el-input v-model="form.peixunNum" placeholder="请输入培训人数" />
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
import { listXygZyjy, getXygZyjy, delXygZyjy, addXygZyjy, updateXygZyjy, exportXygZyjy } from "@/api/kb/businessOperate/newEmp";

export default {
  name: "XygZyjy",
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
      // 业务运行-新员工培训表格数据
      newEmp: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: null,
        className: null,
        campusType: null,
        campusName: null,
        courseName: null,
        banjiNum: null,
        peixunNum: null,
        changeStatus: null,
      },
      campusTypeOptions: [
        {dictLabel: "济南", dictValue: "0"},
        {dictLabel: "泰山", dictValue: "1"}
      ],
      departmentOptions: [
        {dictLabel: "运行", dictValue: "运行"},
        {dictLabel: "检修", dictValue: "检修"},
        {dictLabel: "营销", dictValue: "营销"},
        {dictLabel: "建设", dictValue: "建设"},
        {dictLabel: "网学", dictValue: "网学"},
        {dictLabel: "综合", dictValue: "综合"}
      ],
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
  watch: {
    'form.campusType': {
      handler(nVal, oVal) {
        const filterCampusTypeOptions = this.campusTypeOptions.filter(item => item.dictValue == nVal);
        this.form.campusName = (filterCampusTypeOptions[0] || {}).dictLabel
      },
      deep: true
    }
  },
  methods: {
    /** 查询业务运行-新员工培训列表 */
    getList() {
      this.loading = true;
      listXygZyjy(this.queryParams).then(response => {
        this.newEmp = response.rows;
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
        type: null,
        className: null,
        campusType: null,
        campusName: null,
        courseName: null,
        banjiNum: null,
        peixunNum: null,
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
      this.title = "添加业务运行-新员工培训";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getXygZyjy(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改业务运行-新员工培训";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateXygZyjy(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addXygZyjy(this.form).then(response => {
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
      this.$confirm('是否确认删除业务运行-新员工培训编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delXygZyjy(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有业务运行-新员工培训数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportXygZyjy(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
