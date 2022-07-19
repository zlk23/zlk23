<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="资源类型" prop="sourceType">
        <el-select v-model="queryParams.sourceType" placeholder="请选择资源类型" clearable size="small">
          <el-option v-for="sourceType in sourceTypeOptions" :label="sourceType.dictLabel" :value="sourceType.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="校区" prop="campusType">
        <el-select v-model="queryParams.campusType" placeholder="请选择校区" clearable size="small">
          <el-option v-for="campusType in campusTypeOptions" :label="campusType.dictLabel" :value="campusType.dictValue" />
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
          v-hasPermi="['resource:used:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['resource:used:edit']"
        >修改</el-button>
      </el-col>
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="danger"-->
          <!--icon="el-icon-delete"-->
          <!--size="mini"-->
          <!--:disabled="multiple"-->
          <!--@click="handleDelete"-->
          <!--v-hasPermi="['resource:used:remove']"-->
        <!--&gt;删除</el-button>-->
      <!--</el-col>-->
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="warning"-->
          <!--icon="el-icon-download"-->
          <!--size="mini"-->
          <!--@click="handleExport"-->
          <!--v-hasPermi="['resource:used:export']"-->
        <!--&gt;导出</el-button>-->
      <!--</el-col>-->
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="usedList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="资源类型" align="center" prop="sourceType">
        <template slot-scope="scope">
          <span v-if="scope.row.sourceType == 0">住宿资源</span>
          <span v-if="scope.row.sourceType == 1">食堂资源</span>
          <span v-if="scope.row.sourceType == 2">教室资源</span>
          <span v-if="scope.row.sourceType == 3">实训室资源</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="校区类型" align="center" prop="campusType" />-->
      <el-table-column label="校区名称" align="center" prop="campusName" />
      <el-table-column label="资源名称" align="center" prop="name" />
      <el-table-column label="计划数" align="center" prop="jiHuaShu" />
      <el-table-column label="在用数" align="center" prop="zaiYongShu" />
      <el-table-column label="剩余数" align="center" prop="shengYuShu" />
      <el-table-column label="统计时间" align="center" prop="useTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.useTime, '{y}-{m}-{d}') }}</span>
        </template>
        <!--<template slot-scope="scope">-->
          <!--<span>{{ parseTime(scope.row.useTime, '{y}-{m}-{d}') }}</span>-->
        <!--</template>-->
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['resource:used:edit']"
          >修改</el-button>
          <!--<el-button-->
            <!--size="mini"-->
            <!--type="text"-->
            <!--icon="el-icon-delete"-->
            <!--@click="handleDelete(scope.row)"-->
            <!--v-hasPermi="['resource:used:remove']"-->
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

    <!-- 添加或修改资源使用对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="资源类型" prop="sourceType">
          <el-select v-model="form.sourceType" placeholder="请选择资源类型">
            <el-option v-for="sourceType in sourceTypeOptions" :label="sourceType.dictLabel" :value="sourceType.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="校区" prop="campusType">
          <el-select v-model="form.campusType" placeholder="请选择校区" @change="handleCampusTypeChange">
            <el-option v-for="campusType in campusTypeOptions" :label="campusType.dictLabel" :value="campusType.dictValue" />
          </el-select>
        </el-form-item>
        <!--<el-form-item label="校区名称" prop="campusName">-->
          <!--<el-input v-model="form.campusName" placeholder="请输入校区名称" />-->
        <!--</el-form-item>-->
        <el-form-item label="计划数" prop="jiHuaShu">
          <el-input v-model="form.jiHuaShu" placeholder="请输入计划数" />
        </el-form-item>
        <el-form-item label="在用数" prop="zaiYongShu">
          <el-input v-model="form.zaiYongShu" placeholder="请输入在用数" />
        </el-form-item>
        <el-form-item label="剩余数" prop="shengYuShu">
          <el-input v-model="form.shengYuShu" placeholder="请输入剩余数" />
        </el-form-item>
        <el-form-item label="统计时间" prop="useTime">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form.useTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择开始时间">
          </el-date-picker>
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
import { listSourceUsed, getSourceUsed, delSourceUsed, addSourceUsed, updateSourceUsed, exportSourceUsed } from "@/api/kb/sourceUse/use";

export default {
  name: "use",
  components: {
  },
  data() {
    return {
      sourceTypeOptions: [
        {dictLabel: "住宿资源", dictValue: "0"},
        {dictLabel: "食堂资源", dictValue: "1"},
        {dictLabel: "教室资源", dictValue: "2"},
        {dictLabel: "实训室资源", dictValue: "3"}
      ],
      campusTypeOptions: [
        {dictLabel: "济南", dictValue: "0"},
        {dictLabel: "泰山", dictValue: "1"},
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
      // 资源使用表格数据
      usedList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sourceType: null,
        campusType: null,
        campusName: null,
        jiHuaShu: null,
        zaiYongShu: null,
        shengYuShu: null,
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
    /** 查询资源使用列表 */
    getList() {
      this.loading = true;
      listSourceUsed(this.queryParams).then(response => {
        this.usedList = response.rows;
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
        sourceType: null,
        campusType: null,
        campusName: null,
        jiHuaShu: null,
        zaiYongShu: null,
        shengYuShu: null,
        createTime: null,
        changeStatus: 0,
        updateBy: null,
        updateTime: null,
        useTime: new Date()
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
    // 培训类型改变
    handleCampusTypeChange(val) {
      this.$set(this.form, "campusName", (this.campusTypeOptions.filter(item => item.dictValue === val)[0] || {}).dictLabel);
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加资源使用";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSourceUsed(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改资源使用";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSourceUsed(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSourceUsed(this.form).then(response => {
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
      this.$confirm('是否确认删除资源使用编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSourceUsed(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有资源使用数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSourceUsed(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
