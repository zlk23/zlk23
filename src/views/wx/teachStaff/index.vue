<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="queryParams.sex" placeholder="请选择性别" clearable size="small">
          <el-option label="全部" value="" />
          <el-option label="未知" value="0" />
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证" prop="idcard">
        <el-input
          v-model="queryParams.idcard"
          placeholder="请输入身份证"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类别" prop="category">
        <el-select v-model="queryParams.category" placeholder="请输入类别">
          <el-option label="全部" value="" />
          <el-option v-for="item of roleOptions" :key="item.id" :value="item.value" :label="item.label"/>
        </el-select>
      </el-form-item>
      <el-form-item label="师资编号" prop="teachId">
        <el-input
          v-model="queryParams.teachId"
          placeholder="请输入师资编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--<el-form-item label="所属学院id" prop="collegeId">-->
        <!--<el-input-->
          <!--v-model="queryParams.collegeId"-->
          <!--placeholder="请输入所属学院id"-->
          <!--clearable-->
          <!--size="small"-->
          <!--@keyup.enter.native="handleQuery"-->
        <!--/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="所属校区id" prop="campusId">-->
        <!--<el-input-->
          <!--v-model="queryParams.campusId"-->
          <!--placeholder="请输入所属校区id"-->
          <!--clearable-->
          <!--size="small"-->
          <!--@keyup.enter.native="handleQuery"-->
        <!--/>-->
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
          v-hasPermi="['wx:staff:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['wx:staff:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['wx:staff:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['wx:staff:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="staffList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!--<el-table-column label="修改人" align="center" prop="id" />-->
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="性别" align="center" prop="sex">
        <template slot-scope="scope">
          <span v-if="scope.row.sex == '0'">未知</span>
          <span v-if="scope.row.sex == '1'">男</span>
          <span v-if="scope.row.sex == '2'">女</span>
        </template>
      </el-table-column>
      <el-table-column label="出生日期" align="center" prop="birthdate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.birthdate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="民族" align="center" prop="nation" :formatter="nationFormat"/>
      <el-table-column label="年龄" align="center" prop="age" />
      <el-table-column label="手机号" align="center" prop="phone" />
      <el-table-column label="身份证" align="center" prop="idcard" />
      <el-table-column label="类别" align="center" prop="category" :formatter="roleFormat"></el-table-column>
      <el-table-column label="家庭住址" align="center" prop="homeAddress" />
      <el-table-column label="师资编号" align="center" prop="teachId" />
      <!--<el-table-column label="所属学院id" align="center" prop="collegeId" />-->
      <!--<el-table-column label="所属校区id" align="center" prop="campusId" />-->
      <el-table-column label="备注" align="center" prop="remark" />
      <!--<el-table-column label="创建人" align="center" prop="createUser" />-->
      <!--<el-table-column label="修改人" align="center" prop="updateUser" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wx:staff:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['wx:staff:remove']"
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

    <!-- 添加或修改教职工对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option label="未知" :value="0" />
            <el-option label="男" :value="1" />
            <el-option label="女" :value="2" />
            <!--<el-option label="请选择字典生成" value="" />-->
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthdate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.birthdate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择出生日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="民族" prop="nation">
          <el-select v-model="form.nation" placeholder="请选择民族">
            <el-option
              v-for="dict in nationOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
          <!--<el-input v-model="form.nation" placeholder="请输入民族" />-->
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="form.age" placeholder="请输入年龄" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="身份证" prop="idcard">
          <el-input v-model="form.idcard" placeholder="请输入身份证号码" />
        </el-form-item>
        <el-form-item label="类别" prop="category">
          <el-select v-model="form.category" placeholder="请选择角色" style="width: 100%">
            <!--<el-option label="请选择字典生成" value="" />-->
            <el-option v-for="item of roleOptions" :key="item.id" :value="item.value" :label="item.label"/>
          </el-select>
          <!--<el-input v-model="form.category" placeholder="请输入类别" />-->
        </el-form-item>
        <el-form-item label="家庭住址" prop="homeAddress">
          <el-input v-model="form.homeAddress" placeholder="请输入家庭住址" />
        </el-form-item>
        <el-form-item label="师资编号" prop="teachId">
          <el-input v-model="form.teachId" placeholder="请输入师资编号"/>
        </el-form-item>
        <!--<el-form-item label="所属学院id" prop="collegeId">-->
          <!--<el-input v-model="form.collegeId" placeholder="请输入所属学院id" />-->
        <!--</el-form-item>-->
        <!--<el-form-item label="所属校区id" prop="campusId">-->
          <!--<el-input v-model="form.campusId" placeholder="请输入所属校区id" />-->
        <!--</el-form-item>-->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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
import { listStaff, getStaff, delStaff, addStaff, updateStaff, exportStaff } from "@/api/wx/teachStaff";
import { listRole } from "@/api/wx/role";

export default {
  name: "Staff",
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
      // 教职工表格数据
      staffList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        teachId: null,
        sex: null,
        birthdate: null,
        nation: null,
        age: null,
        phone: null,
        idcard: null,
        category: null,
        homeAddress: null,
        collegeId: null,
        campusId: null,
        createUser: null,
        updateUser: null
      },
      nationOptions: [],
      roleOptions: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        teachId: [
          { required: true, message: "师资编号不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        sex: [
          { required: true, message: "性别不能为空", trigger: "blur" }
        ],
        nation: [
          { required: true, message: "民族不能为空", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "手机号不能为空", trigger: "blur" }
        ],
        category: [
          { required: true, message: "类别不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getDicts("sys_nation").then(response => {
      this.nationOptions = response.data;
    });
    this.getRoleList();
    this.getList();
  },
  methods: {
    getRoleList() {
      listRole().then(resp => {
        this.roleOptions = [ ...(resp.rows || []).map(item => {return {id: item.id, value: item.type, label: item.name}})];
      })
    },
    // 民族分类字典翻译
    nationFormat(row, column) {
      return this.selectDictLabel(this.nationOptions, row.nation);
    },
    // 角色典翻译
    roleFormat(row, column) {
      return ((this.roleOptions || []).filter(item => item.value == row.category)[0] || {}).label
    },
    /** 查询教职工列表 */
    getList() {
      this.loading = true;
      listStaff(this.queryParams).then(response => {
        this.staffList = response.rows;
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
        teachId: null,
        sex: null,
        birthdate: null,
        nation: null,
        age: null,
        phone: null,
        idcard: null,
        category: null,
        homeAddress: null,
        collegeId: null,
        campusId: null,
        remark: null,
        createTime: null,
        createUser: null,
        updateTime: null,
        updateUser: null
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
      this.title = "添加教职工";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getStaff(id).then(response => {
        console.log(response.data);
        this.form = response.data;
        this.open = true;
        this.title = "修改教职工";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateStaff(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStaff(this.form).then(response => {
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
      this.$confirm('是否确认删除教职工编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delStaff(ids);
        }).then(() => {
          if (this.staffList.length === 1 &&  this.queryParams.pageNum > 1) {
            this.queryParams.pageNum = this.queryParams.pageNum - 1;
          }
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有教职工数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportStaff(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
