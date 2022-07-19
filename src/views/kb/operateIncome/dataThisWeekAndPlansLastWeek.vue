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
          v-hasPermi="['jysr:jihua:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['jysr:jihua:edit']"
        >修改</el-button>
      </el-col>
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="danger"-->
          <!--icon="el-icon-delete"-->
          <!--size="mini"-->
          <!--:disabled="multiple"-->
          <!--@click="handleDelete"-->
          <!--v-hasPermi="['jysr:jihua:remove']"-->
        <!--&gt;删除</el-button>-->
      <!--</el-col>-->
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="warning"-->
          <!--icon="el-icon-download"-->
          <!--size="mini"-->
          <!--@click="handleExport"-->
          <!--v-hasPermi="['jysr:jihua:export']"-->
        <!--&gt;导出</el-button>-->
      <!--</el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dataThisWeekAndPlansLastWeekList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="计划内办班期数" align="center" prop="jiHua" />
      <el-table-column label="临增类办班期数" align="center" prop="linZeng" />
      <el-table-column label="委托类办班期数" align="center" prop="weiTuo" />
      <el-table-column label="本周预计培训费" align="center" prop="yuJiPeiXunFei" />
      <el-table-column label="上周培训收入" align="center" prop="peiXunAmount" />
      <el-table-column label="上周食宿收入" align="center" prop="shiSuAmount" />
      <el-table-column label="本周计划培训期数" align="center" prop="yuJiPeiXun" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['jysr:jihua:edit']"
          >修改</el-button>
          <!--<el-button-->
            <!--size="mini"-->
            <!--type="text"-->
            <!--icon="el-icon-delete"-->
            <!--@click="handleDelete(scope.row)"-->
            <!--v-hasPermi="['jysr:jihua:remove']"-->
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

    <!-- 添加或修改经营收入-上周数据-本周计划对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="计划内办班期数" prop="jiHua">
          <el-input v-model="form.jiHua" placeholder="请输入计划内办班期数" />
        </el-form-item>
        <el-form-item label="临增类办班期数" prop="linZeng">
          <el-input v-model="form.linZeng" placeholder="请输入临增类办班期数" />
        </el-form-item>
        <el-form-item label="委托类办班期数" prop="weiTuo">
          <el-input v-model="form.weiTuo" placeholder="请输入委托类办班期数" />
        </el-form-item>
        <el-form-item label="本周预计培训费" prop="yuJiPeiXunFei">
          <el-input v-model="form.yuJiPeiXunFei" placeholder="请输入本周预计培训费" />
        </el-form-item>
        <el-form-item label="上周培训收入" prop="peiXunAmount">
          <el-input v-model="form.peiXunAmount" placeholder="请输入上周培训收入" />
        </el-form-item>
        <el-form-item label="上周食宿收入" prop="shiSuAmount">
          <el-input v-model="form.shiSuAmount" placeholder="请输入上周食宿收入" />
        </el-form-item>
        <el-form-item label="本周计划培训期数" prop="yuJiPeiXun">
          <el-input v-model="form.yuJiPeiXun" placeholder="请输入本周计划培训期数" />
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
  import { listJiHua, getJiHua, delJiHua, addJiHua, updateJiHua, exportJiHua } from "@/api/kb/operateIncome/dataThisWeekAndPlansLastWeek";

  export default {
    name: "JiHua",
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
        // 经营收入-上周数据-本周计划表格数据
        dataThisWeekAndPlansLastWeekList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          jiHua: null,
          linZeng: null,
          weiTuo: null,
          yuJiPeiXunFei: null,
          peiXunAmount: null,
          shiSuAmount: null,
          yuJiPeiXun: null,
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
      /** 查询经营收入-上周数据-本周计划列表 */
      getList() {
        this.loading = true;
        listJiHua(this.queryParams).then(response => {
          this.dataThisWeekAndPlansLastWeekList = response.rows;
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
          jiHua: null,
          linZeng: null,
          weiTuo: null,
          yuJiPeiXunFei: null,
          peiXunAmount: null,
          shiSuAmount: null,
          yuJiPeiXun: null,
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
        this.title = "添加经营收入-上周数据-本周计划";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getJiHua(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改经营收入-上周数据-本周计划";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateJiHua(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addJiHua(this.form).then(response => {
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
        this.$confirm('是否确认删除经营收入-上周数据-本周计划编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delJiHua(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有经营收入-上周数据-本周计划数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportJiHua(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      }
    }
  };
</script>
