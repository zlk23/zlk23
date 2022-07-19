<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户昵称" prop="nickname">
        <el-input
          v-model="queryParams.nickname"
          placeholder="请输入用户昵称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
      <el-form-item label="手机认证" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择手机认证" clearable size="small">
          <el-option label="全部" value=""/>
          <el-option label="未认证" value="0"/>
          <el-option label="已认证" value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item label="个人信息" prop="complete">
        <el-select v-model="queryParams.complete" placeholder="请选择个人信息" clearable size="small">
          <el-option label="全部" value=""/>
          <el-option label="未完善" value="0"/>
          <el-option label="已完善" value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item label="人脸识别" prop="face">
        <el-select v-model="queryParams.face" placeholder="请选择人脸识别" clearable size="small">
          <el-option label="全部" value=""/>
          <el-option label="未完成" value="0"/>
          <el-option label="已完成" value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item label="身份证号" prop="idUmber">
        <el-input
          v-model="queryParams.idUmber"
          placeholder="请输入身份证号"
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
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="success"-->
          <!--icon="el-icon-edit"-->
          <!--size="mini"-->
          <!--:disabled="single"-->
          <!--@click="handleUpdate"-->
          <!--v-has-permi="['wx:user:edit']"-->
        <!--&gt;修改-->
        <!--</el-button>-->
      <!--</el-col>-->
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="warning"-->
          <!--icon="el-icon-download"-->
          <!--size="mini"-->
          <!--@click="handleExport"-->
          <!--v-has-permi="['wx:user:export']"-->
        <!--&gt;导出-->
        <!--</el-button>-->
      <!--</el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="昵称" align="center" prop="nickname"/>
      <el-table-column label="手机号" align="center" prop="phone"></el-table-column>
      <el-table-column label="头像" align="center" prop="headimgurl">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.headimgurl"
            :preview-src-list="[scope.row.headimgurl]"
            style="width: 40px;height:40px"
            class="head_pic"
          />
        </template>
      </el-table-column>
      <el-table-column label="手机号认证" align="center" prop="companyName">
        <template slot-scope="scope">
          <span v-if="scope.row.status == '1'">已认证</span>
          <span v-else>未认证</span>
        </template>
      </el-table-column>
      <el-table-column label="个人信息" align="center" prop="department">
        <template slot-scope="scope">
          <span v-if="scope.row.complete == '1'">已完善</span>
          <span v-else>未完善</span>
        </template>
      </el-table-column>
      <el-table-column label="人脸识别" align="center" prop="face">
        <template slot-scope="scope">
          <span v-if="scope.row.face == '1'">已完成</span>
          <span v-else>未完成</span>
        </template>
      </el-table-column>

      <el-table-column label="姓名" align="center" prop="name"/>
      <el-table-column label="性别" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.sex =='1' ? '男':'女'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="民族" align="center" prop="nation" :formatter="nationFormatter"/>
      <el-table-column label="身份证号" align="center" prop="idUmber" width="180"/>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-user-solid"
            @click="handleUpdate(scope.row)"
            v-has-permi="['wx:user:edit']"
          >角色分配
          </el-button>
          <el-button
            v-if="scope.row.complete == '1'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdateInfo(scope.row)"
            v-has-permi="['wx:info:edit']"
          >信息修改
          </el-button>
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

    <!--添加或修改微信用户详细信息对话框-->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色权限" prop="roleIds">
          <el-select v-model="form.roleIds" placeholder="请选择角色" multiple style="width: 100%" clearable>
            <el-option :key="item.value" v-for="item of roleOptions" :value="item.value" :label="item.label"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoOpen" width="600px" append-to-body>
      <el-form ref="infoForm" :model="infoForm" :rules="infoRules" label-width="80px">
        <el-form-item label="姓名" prop="roleIds">
          <el-input v-model="infoForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="infoForm.sex" placeholder="请选择性别" style="width: 100%">
            <el-option :value="1" label="男"/>
            <el-option :value="0" label="女"/>
          </el-select>
        </el-form-item>
        <el-form-item label="民族" prop="nation">
          <el-select v-model="infoForm.nation" placeholder="请选择民族" style="width: 100%">
            <el-option v-for="nation of nationOptions" :value="nation.dictValue" :label="nation.dictLabel"/>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号" prop="idUmber">
          <el-input v-model="infoForm.idUmber" placeholder="请输入身份证号" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitInfoForm">确 定</el-button>
        <el-button @click="cancelInfo">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listInfo, getInfo, getUserRoleInfo, updateInfo, exportInfo, getUserInfo, updateUserInfo } from '@/api/wx/user'
  import { listRole } from '@/api/wx/role'

  export default {
    name: 'Info',
    components: {},
    data() {
      var sexCheck = (rule, value, callback) => {
        let sexFlagStr;
        if (!value) {
          return callback(new Error("请选择性别"));
        }
        if (this.infoForm.idUmber) {
          sexFlagStr = parseInt(this.infoForm.idUmber.substring(this.infoForm.idUmber.length - 2, this.infoForm.idUmber.length - 1)) % 2;
        }
        if (sexFlagStr === 1 && value == '1') {
          callback();
        } else if (sexFlagStr === 0 && value == '0') {
          callback();
        } else {
          return callback(new Error("身份证号与所选性别不匹配"));
        }
      };
      var idNumberCheck = (rule, value, callback) => {
        const reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        if (!value) {
          return callback(new Error("请输入18位身份证号码"));
        } else if (value.length !== 18) {
          return callback(new Error("长度在 18 个字符"));
        } else if (!reg.test(value)) {
          return callback(new Error("非法身份证号码"));
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
        // 微信用户详细信息表格数据
        infoList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        //是否显示用户信息修改弹出层
        infoOpen: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          nickname: null,
          idUmber: null,
          phone: null,
          status: null,
          complete: null,
          face: null,
          name: null
        },
        // 表单参数
        form: {},
        // 用户信息表单
        infoForm: {},
        //角色列表
        roleOptions: [],
        nationOptions: [],
        // 表单校验
        rules: {},
        infoRules: {
          idUmber: [{ validator: idNumberCheck, trigger: "blur" },],
          sex: [{ validator: sexCheck, trigger: "change" }],
        },
      }
    },
    created() {
      this.getList()
      this.getRoleList()
      this.getDicts("sys_nation").then(response => {
        this.nationOptions = response.data;
      });
    },
    methods: {
      nationFormatter(row, column) {
        return this.selectDictLabel(this.nationOptions, row.nation);
      },
      /** 格式化角色字段展示 */
      roleIdsFormatter(row) {
        const { roleIds } = row
        let roleIdsLabel = "";
        const roleIdsLength = (roleIds || []).length;
        (roleIds || []).forEach((roleId, index)=> {
          (this.roleOptions || []).forEach(roleOption => {
            if (roleId === roleOption.value) {
              roleIdsLabel = roleIdsLabel + roleOption.label + (index === (roleIdsLength -1) ? "" : ",")
            }
          })
        })

      },
      /** 查询微信用户详细信息列表 */
      getList() {
        this.loading = true
        listInfo(this.queryParams).then(response => {
          this.infoList = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      /** 查询微信角色详细信息列表 */
      getRoleList() {
        listRole().then(resp => {
          this.roleOptions = [...(resp.rows || []).map(item => {
            return { value: item.id, label: item.name }
          })]
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      // 取消按钮
      cancelInfo() {
        this.infoOpen = false
        this.resetInfo()
      },
      // 表单重置
      reset() {
        this.form = {
          //主键
          id: null,
          //手机号
          phone: null,
          //昵称
          nickname: null,
          //头像地址
          headimgurl: null,
          //性别
          sex: null,
          //国家
          country: null,
          //省份
          province: null,
          //城市
          city: null,
          //微信号对公众号唯一标识
          openid: null,
          //用户在微信平台的唯一标识
          unionid: null,
          //最后登录学校
          lastCollege: null,
          //最后登录学校跳转链接
          lastCollegeUrl: null,
          //最后登录学校id
          lastCollegeId: null,
          //是否完成手机号认证 0未认证、1已认证
          status: null,
          //是否完善个人信息 0未完善，1已完善
          complete: null,
          //是否完成人脸识别 0未完成，1已完成
          face: null,

          //角色权限
          roleIds: null,

          // accountNonExpired: false,
          // accountNonLocked: false,
          // attempts: 2,
          // authorities: null,
          // credentialsNonExpired: false,
          // enabled: false,
          // password: "8f06c5d68ef9bb7ba814cb820b488274",
          // remark: null,
          username: null
          // wxUserInfo: null
        }
        this.resetForm('form')
      },
      // 表单重置
      resetInfo() {
        this.infoForm = {

        }
        this.resetForm('infoForm')
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 分配角色按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id || this.ids
        getInfo(id).then(response => {
          this.form = { ...response.data }
          getUserRoleInfo(id).then(resp => {
            this.$set(this.form, 'roleIds', (resp.rows || []).map(row => row.wxRoleId));
          }).finally(() => {
            this.title = '分配微信用户角色'
            this.open = true;
          })
        })
      },
      /** 修改用户信息按钮操作 */
      handleUpdateInfo(row) {
        this.reset()
        const id = row.infoId;
        getUserInfo(id).then(response => {
          this.infoForm = { ...response.data }
          this.title = '修改微信用户详细信息'
          this.infoOpen = true;
        })
      },
      /** 提交分配角色按钮 */
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateInfo(this.form).then(response => {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              })
            }
          }
        })
      },
      /** 提交用户信息按钮 */
      submitInfoForm() {
        this.$refs['infoForm'].validate(valid => {
          if (valid) {
            if (this.infoForm.id != null) {
              updateUserInfo(this.infoForm).then(response => {
                this.msgSuccess('修改成功')
                this.infoOpen = false
                this.getList()
              })
            }
          }
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有微信用户详细信息数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return exportInfo(queryParams)
        }).then(response => {
          this.download(response.msg)
        })
      }
    }
  }
</script>
