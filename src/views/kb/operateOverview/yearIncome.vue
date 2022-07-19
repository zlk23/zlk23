<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="收入类型" prop="incomeType">
        <el-select v-model="queryParams.incomeType" placeholder="请选择收入类型" clearable size="small">
          <el-option v-for="incomeType in incomeTypeOptions" :label="incomeType.dictLabel" :value="incomeType.dictValue" />
        </el-select>
      </el-form-item>
      <!--<el-form-item label="修改状态" prop="changeStatus">-->
      <!--<el-select v-model="queryParams.changeStatus" placeholder="请选择修改状态" clearable size="small">-->
      <!--<el-option label="请选择字典生成" value="" />-->
      <!--</el-select>-->
      <!--</el-form-item>-->
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
          v-hasPermi="['yyzl:yearIncome:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['yyzl:yearIncome:edit']"
        >修改</el-button>
      </el-col>
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="danger"-->
          <!--icon="el-icon-delete"-->
          <!--size="mini"-->
          <!--:disabled="multiple"-->
          <!--@click="handleDelete"-->
          <!--v-hasPermi="['yyzl:yearIncome:remove']"-->
        <!--&gt;删除</el-button>-->
      <!--</el-col>-->
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="warning"-->
          <!--icon="el-icon-download"-->
          <!--size="mini"-->
          <!--@click="handleExport"-->
          <!--v-hasPermi="['yyzl:yearIncome:export']"-->
        <!--&gt;导出</el-button>-->
      <!--</el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="yearIncomeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!--<el-table-column label="修改状态" align="center" prop="id" />-->
      <el-table-column label="收入类型" align="center" prop="incomeType" />
      <el-table-column label="实际收入" align="center" prop="jiHua" />
      <el-table-column label="计划收入" align="center" prop="shiJi" />
      <!--<el-table-column label="修改状态" align="center" prop="changeStatus" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['yyzl:yearIncome:edit']"
          >修改</el-button>
          <!--<el-button-->
            <!--size="mini"-->
            <!--type="text"-->
            <!--icon="el-icon-delete"-->
            <!--@click="handleDelete(scope.row)"-->
            <!--v-hasPermi="['yyzl:yearIncome:remove']"-->
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

    <!-- 添加或修改运营总览_全年经营收入对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="收入类型" prop="incomeType">
          <el-select v-model="form.incomeType" placeholder="请选择收入类型">
            <el-option v-for="incomeType in incomeTypeOptions" :label="incomeType.dictLabel" :value="incomeType.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="实际收入" prop="jiHua">
          <el-input v-model="form.jiHua" placeholder="请输入全年实际收入" />
        </el-form-item>
        <el-form-item label="计划收入" prop="shiJi">
          <el-input v-model="form.shiJi" placeholder="请输入全年计划收入" />
        </el-form-item>
        <!--<el-form-item label="修改状态">-->
        <!--<el-radio-group v-model="form.changeStatus">-->
        <!--<el-radio label="1">请选择字典生成</el-radio>-->
        <!--</el-radio-group>-->
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
  import { listYearIncome, getYearIncome, delYearIncome, addYearIncome, updateYearIncome, exportYearIncome } from "@/api/kb/operateOverview/yearIncome";

  export default {
    name: "yearIncome",
    components: {
    },
    data() {
      return {
        incomeTypeOptions: [
          {dictLabel: "新员工培训", dictValue: "新员工培训"},
          {dictLabel: "计划内短班", dictValue: "计划内短班"},
          {dictLabel: "市场化培训", dictValue: "市场化培训"},
          {dictLabel: "食宿收入", dictValue: "食宿收入"}
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
        // 运营总览_全年经营收入表格数据
        yearIncomeList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          incomeType: null,
          jiHua: null,
          shiJi: null,
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
      /** 查询运营总览_全年经营收入列表 */
      getList() {
        this.loading = true;
        listYearIncome(this.queryParams).then(response => {
          this.yearIncomeList = response.rows;
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
          incomeType: null,
          jiHua: null,
          shiJi: null,
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
        this.title = "添加运营总览_全年经营收入";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getYearIncome(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改运营总览_全年经营收入";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateYearIncome(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addYearIncome(this.form).then(response => {
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
        this.$confirm('是否确认删除运营总览_全年经营收入编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delYearIncome(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有运营总览_全年经营收入数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportYearIncome(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      }
    }
  };
</script>
