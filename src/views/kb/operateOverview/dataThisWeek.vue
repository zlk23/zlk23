<template>
  <div class="app-container">
    <!--<el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="120px">-->
    <!--&lt;!&ndash;<el-form-item label="修改状态" prop="changeStatus">&ndash;&gt;-->
    <!--&lt;!&ndash;<el-select v-model="queryParams.changeStatus" placeholder="请选择修改状态" clearable size="small">&ndash;&gt;-->
    <!--&lt;!&ndash;<el-option label="请选择字典生成" value="" />&ndash;&gt;-->
    <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
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
          v-hasPermi="['yyzl:yywd:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['yyzl:yywd:edit']"
        >修改</el-button>
      </el-col>
      <!--<el-col :span="1.5">-->
      <!--<el-button-->
      <!--type="danger"-->
      <!--icon="el-icon-delete"-->
      <!--size="mini"-->
      <!--:disabled="multiple"-->
      <!--@click="handleDelete"-->
      <!--v-hasPermi="['yyzl:yywd:remove']"-->
      <!--&gt;删除</el-button>-->
      <!--</el-col>-->
      <!--<el-col :span="1.5">-->
      <!--<el-button-->
      <!--type="warning"-->
      <!--icon="el-icon-download"-->
      <!--size="mini"-->
      <!--@click="handleExport"-->
      <!--v-hasPermi="['yyzl:yywd:export']"-->
      <!--&gt;导出</el-button>-->
      <!--</el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dataThisWeekList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="本周培训费收入" align="center" prop="wpeiXunFei" />
      <el-table-column label="本周食宿费收入" align="center" prop="wshiSuFei" />
      <el-table-column label="本周培训总量" align="center" prop="wpeiXunZongLiang" />
      <el-table-column label="本周培训人数" align="center" prop="wpeiXunRenShu" />
      <el-table-column label="今日培训总量" align="center" prop="dpeiXunZongLiang" />
      <el-table-column label="今日培训人数" align="center" prop="dpeiXunRenShu" />
      <!--<el-table-column label="修改状态" align="center" prop="changeStatus" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['yyzl:yywd:edit']"
          >修改</el-button>
          <!--<el-button-->
          <!--size="mini"-->
          <!--type="text"-->
          <!--icon="el-icon-delete"-->
          <!--@click="handleDelete(scope.row)"-->
          <!--v-hasPermi="['yyzl:yywd:remove']"-->
          <!--&gt;删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <!--<pagination-->
    <!--v-show="total>0"-->
    <!--:total="total"-->
    <!--:page.sync="queryParams.pageNum"-->
    <!--:limit.sync="queryParams.pageSize"-->
    <!--@pagination="getList"-->
    <!--/>-->

    <!-- 添加或修改运营总览-本周数据一览对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="本周培训费收入" prop="wPeiXunFei">
          <el-input v-model="form.wpeiXunFei" placeholder="请输入本周培训费收入" />
        </el-form-item>
        <el-form-item label="本周食宿费收入" prop="wShiSuFei">
          <el-input v-model="form.wshiSuFei" placeholder="请输入本周食宿费收入" />
        </el-form-item>
        <el-form-item label="本周培训总量" prop="wPeiXunZongLiang">
          <el-input v-model="form.wpeiXunZongLiang" placeholder="请输入本周培训总量" />
        </el-form-item>
        <el-form-item label="本周培训人数" prop="wPeiXunRenShu">
          <el-input v-model="form.wpeiXunRenShu" placeholder="请输入本周培训人数" />
        </el-form-item>
        <el-form-item label="今日培训总量" prop="dPeiXunZongLiang">
          <el-input v-model="form.dpeiXunZongLiang" placeholder="请输入今日培训总量" />
        </el-form-item>
        <el-form-item label="今日培训人数" prop="dPeiXunRenShu">
          <el-input v-model="form.dpeiXunRenShu" placeholder="请输入今日培训人数" />
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
  import { listDataThisWeek, getDataThisWeek, delDataThisWeek, addDataThisWeek, updateDataThisWeek, exportDataThisWeek } from "@/api/kb/operateOverview/dataThisWeek";

  export default {
    name: "dataTHisWeek",
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
        // 运营总览-本周数据一览表格数据
        dataThisWeekList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          wPeiXunFei: undefined,
          wShiSuFei: undefined,
          wPeiXunZongLiang: undefined,
          wPeiXunRenShu: undefined,
          dPeiXunZongLiang: undefined,
          dPeiXunRenShu: undefined,
          changeStatus: undefined,
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
      /** 查询运营总览-本周数据一览列表 */
      getList() {
        this.loading = true;
        listDataThisWeek(this.queryParams).then(response => {
          console.log(response);
          this.dataThisWeekList = response.rows;
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
          wpeiXunFei: undefined,
          wshiSuFei: undefined,
          wpeiXunZongLiang: undefined,
          wpeiXunRenShu: undefined,
          dpeiXunZongLiang: undefined,
          dpeiXunRenShu: undefined,
          createTime: undefined,
          changeStatus: 0,
          updateBy: undefined,
          updateTime: undefined
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
        this.title = "添加运营总览-本周数据一览";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getDataThisWeek(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改运营总览-本周数据一览";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateDataThisWeek(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addDataThisWeek(this.form).then(response => {
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
        this.$confirm('是否确认删除运营总览-本周数据一览编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDataThisWeek(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有运营总览-本周数据一览数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDataThisWeek(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      }
    }
  };
</script>
