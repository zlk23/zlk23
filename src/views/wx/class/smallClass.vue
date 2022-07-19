<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="班级名称" prop="name">
      <el-input
        v-model="queryParams.name"
        placeholder="请输入班级名称"
        clearable
        size="small"
        style="width: 240px"
        @keyup.enter.native="handleQuery"
      />
      </el-form-item>
      <el-form-item label="专业" prop="major">
        <el-select
          v-model="queryParams.major"
          placeholder="请选择专业"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in majorOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
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
          v-hasPermi="['wx:smallClasses:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-plus"
          size="mini"
          @click="handleBatchAdd"
          v-hasPermi="['wx:smallClasses:batchAdd']"
        >批量新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['wx:smallClasses:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['wx:smallClasses:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['wx:smallClasses:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="smallClassList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!--<el-table-column label="小班班次编号" align="center" prop="smallClassId" />-->
      <el-table-column label="班级名称" align="center" prop="name" width="250">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.name" placement="top">
            <span style="
                width: 100%; max-height: 80px;
                cursor: pointer;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;"
            >
            {{ scope.row.name }}
          </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="专业" align="center" prop="major" :formatter="majorFormat"/>
      <el-table-column label="创建时间" align="center" prop="createTime" min-width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="createTime" min-width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="createUser" />
      <el-table-column label="修改人" align="center" prop="updateUser" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wx:smallClasses:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wx:smallClasses:remove']"
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

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入小班名称" />
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-select
            v-model="form.major"
            placeholder="请选择专业"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in majorOptions"
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

    <!-- 批量添加对话框 -->
    <el-dialog :title="title" :visible.sync="batchOpen" width="500px" append-to-body>
      <el-form ref="batchForm" :model="batchForm" :rules="batchRules" label-width="80px">
        <!--<el-form-item label="小班名称" prop="name">-->
          <!--<el-input v-model="form.name" placeholder="请输入小班名称" />-->
        <!--</el-form-item>-->
        <el-form-item label="专业" prop="major">
          <el-select
            v-model="batchForm.major"
            placeholder="请选择专业"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in majorOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始编号" prop="startNumber">
          <el-input-number v-model="batchForm.startNumber" placeholder="请输入开始编号" :min="1"/>
          <!--<el-input v-model="batchForm.startNumber" placeholder="请输入开始编号" />-->
        </el-form-item>
        <el-form-item label="结束编号" prop="stopNumber">
          <el-input-number v-model="batchForm.stopNumber" placeholder="请输入结束编号" :min="1"/>
          <!--<el-input v-model="batchForm.stopNumber" placeholder="请输入结束编号" />-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="batchSubmitForm">确 定</el-button>
        <el-button @click="batchCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listSmallClass, getSmallClass, updateSmallClass, addSmallClass, batchDddSmallClassByMajorId, delSmallClass, exportSmallClass } from '../../../api/wx/smallClass'

  export default {
    name: "Data",
    data() {
      //验证忘记密码功能模块两次密码输入是否一致
      const startNumberCheck = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("开始编号不能为空"));
        } else if (value > this.batchForm.stopNumber) {
          return callback(new Error("开始编号不能大于结束编号!"));
        } else {
          callback();
        }
      };
      //验证忘记密码功能模块两次密码输入是否一致
      const stopNumberCheck = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("结束编号不能为空"));
        } else if (value < this.batchForm.startNumber) {
          return callback(new Error("结束编号不能小于开始编号!"));
        } else {
          callback();
        }
      };
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
        // 小班班级数据
        smallClassList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        //批量添加弹出层
        batchOpen: false,
        //专业字典
        majorOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: null,
          major: null,
          shortClassId: null,
        },
        // 表单参数
        form: {},
        // 批量添加表单参数
        batchForm: {},
        // 表单校验
        rules: {
          name: [
            { required: true, message: "小班名称不能为空", trigger: "blur" }
          ],
          // major: [
          //   { required: true, message: "专业不能为空", trigger: "blur" }
          // ]
        },
        // 批量添加表单校验
        batchRules: {
          // name: [
          //   { required: true, message: "小班名称不能为空", trigger: "blur" }
          // ],
          major: [
            { required: true, message: "专业不能为空", trigger: ["blur", "change"] }
          ],
          startNumber: [
            { required: true, validator: startNumberCheck, trigger: ["blur", "change"] }
          ],
          stopNumber: [
            { required: true, validator: stopNumberCheck, trigger: ["blur", "change"] }
          ]
        }
      };
    },
    created() {
      this.queryParams.shortClassId = this.$route.params && this.$route.params.shortClassId;

      this.getDicts("sys_wsxy_major").then(response => {
        this.majorOptions = response.data;
      });

      this.getList();
    },
    methods: {
      /** 查询字典数据列表 */
      getList() {
        this.loading = true;
        listSmallClass(this.queryParams).then(response => {
          this.smallClassList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 数据专业字典翻译
      majorFormat(row, column) {
        return this.selectDictLabel(this.majorOptions, row.major);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 批量取消按钮
      batchCancel() {
        this.batchOpen = false;
        this.resetBatch();
      },
      // 表单重置
      reset() {
        this.form = {
          name: null,
          major: null,
          shortClassId: null,
          smallClassId: null,
        };
        this.resetForm("form");
      },
      // 批量表单重置
      resetBatch() {
        this.batchForm = {
          major: null,
          shortClassId: null,
          startNumber: null,
          stopNumber: null,
        };
        this.resetForm("batchForm");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.queryParams = {
          pageNum: 1,
          pageSize: 10,
          name: null,
          major: null,
          // shortClassId: null,
        };
        this.resetForm("queryForm");
        // this.queryParams.shortClassId = this.$route.params && this.$route.params.shortClassId;
        this.handleQuery();
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加小班数据";
        this.form.shortClassId = this.queryParams.shortClassId;
      },
      /** 批量新增按钮操作 */
      handleBatchAdd() {
        this.resetBatch();
        this.batchOpen = true;
        this.title = "批量添加小班数据";
        this.batchForm.shortClassId = this.queryParams.shortClassId;
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        // this.form.shortClassId = this.queryParams.shortClassId;
        getSmallClass(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改小班数据";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.smallClassId != undefined) {
              updateSmallClass(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              const data = [];
              // for (let i = this.form.startIndex; i < this.form.endIndex; i ++) {
              //   data.push({shortClassId: this.form.shortClassId, majorId: this.form.majorId, index: i});
              // }
              addSmallClass(this.form).then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 批量增加提交按钮 */
      batchSubmitForm: function() {
        this.$refs["batchForm"].validate(valid => {
          if (valid) {
            // const data = [];
            // for (let i = this.form.startIndex; i < this.form.endIndex; i ++) {
            //   data.push({shortClassId: this.form.shortClassId, major: this.form.major, index: i});
            // }
            batchDddSmallClassByMajorId(this.batchForm).then(response => {
              this.msgSuccess("批量新增成功");
              this.batchOpen = false;
              this.getList();
            });
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除小班编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSmallClass(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSmallClass(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      }
    }
  };
</script>
