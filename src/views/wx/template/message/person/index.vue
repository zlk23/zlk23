<template>
  <div class="app-container">
    <!--<el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
       <el-form-item label="消息ID" prop="messId">
        <el-input
          v-model="queryParams.messId"
          placeholder="请输入消息ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="应检数" prop="shouldNum">
        <el-input
          v-model="queryParams.shouldNum"
          placeholder="请输入应检数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="已检数" prop="alreadyNum">
        <el-input
          v-model="queryParams.alreadyNum"
          placeholder="请输入已检数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="确诊" prop="sureNum">
        <el-input
          v-model="queryParams.sureNum"
          placeholder="请输入确诊"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="无症状人数" prop="asymptomaticNum">
        <el-input
          v-model="queryParams.asymptomaticNum"
          placeholder="请输入无症状人数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="疑似" prop="maybeNum">
        <el-input
          v-model="queryParams.maybeNum"
          placeholder="请输入疑似"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> 
      <el-form-item label="人员类型" prop="personType">
        <el-select v-model="queryParams.personType" placeholder="请选择人员类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['wx:person:add']"
        >新增人员信息</el-button>
      </el-col>
     <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['wx:person:edit']"
        >修改</el-button>
      </el-col>
       <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['wx:person:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['wx:person:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>

    <el-table v-loading="loading" :data="personList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
       <el-table-column label="人员类型" align="center" prop="personType" :formatter="getPersonType"/>
      <el-table-column label="应检数" align="center" prop="shouldNum" />
      <el-table-column label="已检数" align="center" prop="alreadyNum" />
      <el-table-column label="确诊" align="center" prop="sureNum" />
      <el-table-column label="无症状人数" align="center" prop="asymptomaticNum" />
      <el-table-column label="疑似" align="center" prop="maybeNum" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wx:person:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wx:person:remove']"
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

    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="应检数" prop="shouldNum">
          <el-input v-model="form.shouldNum" placeholder="请输入应检数" />
        </el-form-item>
        <el-form-item label="已检数" prop="alreadyNum">
          <el-input v-model="form.alreadyNum" placeholder="请输入已检数" />
        </el-form-item>
        <el-form-item label="确诊" prop="sureNum">
          <el-input v-model="form.sureNum" placeholder="请输入确诊" />
        </el-form-item>
        <el-form-item label="无症状人数" prop="asymptomaticNum">
          <el-input v-model="form.asymptomaticNum" placeholder="请输入无症状人数" />
        </el-form-item>
        <el-form-item label="疑似" prop="maybeNum">
          <el-input v-model="form.maybeNum" placeholder="请输入疑似" />
        </el-form-item>
        <el-form-item label="人员类型" prop="personType">
          <el-select v-model="form.personType" placeholder="请选择人员类型">
            <el-option
                  v-for="dict in dics"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
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
import { listPerson, getPerson, delPerson, addPerson, updatePerson, exportPerson } from "@/api/wx/message/messageperson";

export default {
  name: "Person",
  props:['messageId'],
  components: {
  },
  data() {
    return {
      dics:[],
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
      // 【请填写功能名称】表格数据
      personList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        messId: '',
        shouldNum: null,
        alreadyNum: null,
        sureNum: null,
        asymptomaticNum: null,
        maybeNum: null,
        personType: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.personList=[]
    this.getList();
     /**查询字典 */
    this.getDicts("sys_school_person").then(response => {
      this.dics = response.data;
    });
  },
  methods: {
      //查询字典
    selectDictLabel(datas, value) {
      var actions = [];
      Object.keys(datas).some((key) => {
        if (datas[key].dictValue == ('' + value)) {
          actions.push(datas[key].dictLabel);
          return true;
        }
      })
      return actions.join('');
    },
    getPersonType(row,column){
      return this.selectDictLabel(this.dics,row.personType);
    },
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      this.queryParams.messId=this.messageId;
      console.log('this.queryParams.messId----------->',this.queryParams.messId)
      listPerson(this.queryParams).then(response => {
        this.personList = response.rows;
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
        messId: null,
        shouldNum: null,
        alreadyNum: null,
        sureNum: null,
        asymptomaticNum: null,
        maybeNum: null,
        personType: null,
        messId:this.messageId
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
      this.title = "添加【请填写功能名称】";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPerson(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改【请填写功能名称】";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePerson(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            if(!this.messageId){
              this.$message('请先添加消息！')
              return
            }
            addPerson(this.form).then(response => {
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
      this.$confirm('是否确认删除【请填写功能名称】编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPerson(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有【请填写功能名称】数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPerson(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
