<template>
  <div class="app-container">
    <el-form
      :model="studentQueryParams"
      ref="studentQueryParams"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <!--<el-form-item label="班级名称" prop="smallClassId">-->
        <!--<el-select v-model="studentQueryParams.smallClassId" clearable filterable multiple placeholder="请选择">-->
          <!--<el-option-->
            <!--v-for="item in smallClassOptions"-->
            <!--:key="item.dictValue"-->
            <!--:label="item.dictLabel"-->
            <!--:value="item.dictValue">-->
          <!--</el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item label="班级名称" prop="smallClassName">
        <el-input
          v-model="studentQueryParams.smallClassName"
          placeholder="请输入班级名称"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="studentQueryParams.name"
          placeholder="请输入培训人员姓名"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="身份证号" prop="idUmber">
        <el-input
          v-model="studentQueryParams.idUmber"
          placeholder="请输入培训人员身份证号"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="mobilePhone">
        <el-input
          v-model="studentQueryParams.mobilePhone"
          placeholder="请输入培训人员手机号"
          clearable
          size="small"
        />
      </el-form-item>
      <!--<el-form-item label="小班名称" prop="smallClassId">-->
      <!--<el-select v-model="studentQueryParams.smallClassId" filterable placeholder="请输入搜索选择或下拉选择">-->
      <!--<el-option-->
      <!--v-for="item in smallClassOptions"-->
      <!--:key="item.dictValue"-->
      <!--:label="item.dictLabel"-->
      <!--:value="item.dictValue"-->
      <!--&gt;-->
      <!--</el-option>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item label="缴费状态" prop="isPay">
        <el-select
          v-model="studentQueryParams.isPay"
          placeholder="请选择缴费状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option label="未缴费" value="0"/>
          <!--<el-option label="已交培训费" value="1"/>-->
          <!--<el-option label="已交住宿费" value="2"/>-->
          <el-option label="全部已交" value="3"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="getList"
        >搜索
        </el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetStudentForm"
        >重置
        </el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="studentMsg"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" type="index"/>
      <!--<el-table-column label="人脸信息" align="center">-->
        <!--<template slot-scope="scope">-->
          <!--<el-image-->
            <!--style="width: 100px; height: 100px"-->
            <!--:src="scope.row.imagePath"-->
            <!--:fit="fit"-->
          <!--&gt;</el-image>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="班级名称" align="center" prop="smallClassName" width="180">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.smallClassName" placement="top">
            <span style="
                width: 100%; max-height: 80px;
                cursor: pointer;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;"
            >
            {{ scope.row.smallClassName }}
          </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" prop="name"/>
      <el-table-column label="性别" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.sex =='1' ? '男':'女'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="民族" align="center" prop="nation" :formatter="nationFormatter"/>
      <el-table-column label="是否清真" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.qingZhen ? '是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号" align="center" prop="idUmber" width="180"/>
      <el-table-column label="手机号" align="center" prop="mobilePhone" width="120"/>
      <el-table-column label="单位" align="center" prop="companyName" width="140">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.companyName" placement="top">
            <span style="
                width: 100%; max-height: 80px;
                cursor: pointer;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;"
            >
            {{ scope.row.companyName }}
          </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="部门" align="center" prop="department"/>
      <el-table-column label="职位" align="center" prop="duty"/>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
            <span>{{
              scope.row.isGraduate == '1'
                ? '已结业'
                : scope.row.isRegister == '1'
                ? '已报到'
                : scope.row.isArrive == '1'
                ? '已入园'
                : scope.row.isApply =='1'
                ? '已报名'
                : ''
            }}</span>
          <span></span>
        </template>
      </el-table-column>
      <el-table-column label="缴费状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isPay == '3'">全部已交</span>
          <span v-else>未缴费</span>
          <!--<span v-if="scope.row.isPay == '1'">已交培训费</span>-->
          <!--<span v-if="scope.row.isPay == '2'">已交住宿费</span>-->
        </template>
      </el-table-column>
      <el-table-column label="网络大学账号" align="center">
        <template slot-scope="scope">
            <span>{{
              scope.row.isWldx == '0'
                ? '无'
                : scope.row.isWldx == '1'
                ? '有'
                : ''
            }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属省公司" align="center" prop="provinceCompany" :formatter="provinceCompanyFormatter"/>
      <el-table-column
        label="操作"
        fixed="right"
        align="center"
        class-name="small-padding fixed-width"
        width="140"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-share"
            @click="handleInfo(scope.row)"
            v-has-permi="['wx:apply:query']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-has-permi="['wx:apply:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-if="scope.row.isPay == '0'"
            @click="handleCancelApply(scope.row)"
            v-has-permi="['wx:apply:del']"
          >取消报名</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="studentTotal>0"
      :total="studentTotal"
      :page.sync="studentQueryParams.pageNum"
      :limit.sync="studentQueryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改报名信息对话框 -->
    <el-dialog  :title="title" :visible.sync="open" append-to-body>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="110px"
        v-bind:disabled="disabled"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idUmber">
          <el-input v-model="form.idUmber"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="民族" prop="nation">
          <!--<el-select v-model="form.nation" filterable placeholder="请选择">-->
            <!--<el-option-->
              <!--v-for="item in nationOptions"-->
              <!--:key="item.dictCode"-->
              <!--:label="item.dictLabel"-->
              <!--:value="item.dictLabel"-->
            <!--&gt;-->
            <!--</el-option>-->
          <!--</el-select>-->
          <el-select v-model="form.nation" filterable placeholder="请选择">
            <el-option
              v-for="item in nationOptions"
              :key="item"
              :label="item.dictLabel"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="mobilePhone">
          <el-input v-model="form.mobilePhone"></el-input>
        </el-form-item>
        <el-form-item label="是否清真" prop="qingZhen">
          <el-radio-group v-model="form.qingZhen">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
          <!--<div>-->
            <!--<el-radio v-model="form.qingZhen" label="1">是</el-radio>-->
            <!--<el-radio v-model="form.qingZhen" label="0">否</el-radio>-->
          <!--</div>-->
        </el-form-item>
        <el-form-item label="网络大学帐号" prop="isWldx">
          <el-radio v-model="form.isWldx" label="1">有</el-radio>
          <el-radio v-model="form.isWldx" label="0">无</el-radio>
        </el-form-item>
        <el-form-item label="所属省公司" prop="provinceCompany">
          <el-select v-model="form.provinceCompany" filterable placeholder="请选择">
            <el-option
              v-for="item in companyOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属班级" prop="smallClassId">
          <el-select v-model="form.smallClassId" filterable placeholder="请输入搜索选择或下拉选择">
            <el-option
              v-for="item in smallClassOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位" prop="companyName">
          <el-input v-model="form.companyName"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="form.department"></el-input>
        </el-form-item>
        <el-form-item label="职务" prop="duty">
          <el-input v-model="form.duty"></el-input>
        </el-form-item>
        <el-form-item label="ERP编号" prop="erpCode">
          <el-input v-model="form.erpCode"></el-input>
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
  import { getStudentById, getStudentExportById, updateStudentInfo, getStudentInfo, getSmallClass, cancelApply } from '@/api/wx/class'

  export default {
    data() {
      return {
        loading: false,
        open: false,
        title: "",
        form: {},
        rules: {
          name: [
            { required: true, message: "请输入真实姓名", trigger: "blur" },
            { min: 2, max: 15, message: "长度在 2 到 15 个字符", trigger: "blur" }
          ],
          idUmber: [
            { required: true, message: "请输入18位身份证号码", trigger: "blur" },
            { min: 18, max: 18, message: "长度在 18 个字符", trigger: "blur" }
          ],
          companyName: [
            { required: true, message: "请输入公司名称", trigger: "blur" }
          ],
          mobilePhone: [
            { required: true, message: "请输入手机号码", trigger: "blur" }
          ],
          sex: [{ required: true, message: "请选择性别", trigger: "change" }],
          qingZhen: [{ required: true, message: "请选择是否清真", trigger: "change" }],
          isWldx: [{ required: true, message: "请选择有无网络大学临时账号", trigger: "change" }],
          department: [
            { required: true, message: "请输入部门名称", trigger: "blur" }
          ],
          duty: [{ required: true, message: "请输入职务", trigger: "blur" }],
          nation: [
            { required: true, message: "请输入民族", trigger: "blur" }
          ],
          provinceCompany: [
            { required: true, message: "请选择所属省公司", trigger: "blur" }
          ],
          // smallClassId: [
          //   { required: true,  message: "请选择所属班级", trigger: "blur"}
          // ],
        },
        disabled: false,
        // 显示搜索条件
        showSearch: true,
        studentTotal: 0,
        // 学员数据
        studentMsg: null,
        companyOptions: [],
        smallClassOptions: [],
        nationOptions: [],
        studentQueryParams: {
          pageNum: 1,
          pageSize: 10,
          shortClassId: null,
          name: null,
          idUmber: null,
          mobilePhone: null,
          isPay: null,
          smallClassId: null,
          smallClassName: null,
        },
      }
    },
    mounted() {
      this.getList();

      this.getDicts("sys_dkt_province").then(response => {
        this.companyOptions = response.data;
      });

      this.getDicts("sys_nation").then(response => {
        this.nationOptions = response.data;
      });

      this.getSmallClassList();
    },
    // watch: {},
    methods: {
      getList() {
        this.loading = true
        const shortClassId = this.$route.params && this.$route.params.shortClassId;
        getStudentById({ ...this.studentQueryParams, shortClassId: shortClassId}).then(response => {
          this.studentMsg = response.rows
          this.studentTotal = response.total
          this.loading = false
        })
      },
      getSmallClassList() {
        const shortClassId = this.$route.params && this.$route.params.shortClassId;
        getSmallClass(shortClassId).then(response => {
          this.smallClassOptions = (response.data || []).map(e => {
            return { dictLabel: e.name, dictValue: e.id }
          });
        })
      },
      nationFormatter(row, column) {
        return this.selectDictLabel(this.nationOptions, row.nation);
      },
      provinceCompanyFormatter(row, column) {
        return this.selectDictLabel(this.companyOptions, row.provinceCompany);
        // let actions = [];
        // const datas = [...this.companyOptions]
        // Object.keys(datas).some((key) => {
        //   if (datas[key].dictValue == ('' + row.provinceCompany)) {
        //     actions = datas[key].dictLabel;
        //     return true;
        //   }
        // })
        // return actions;
      },
      handleSelectionChange() {
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
          idUmber: null,
          sex: null,
          companyName: null,
          department: null,
          duty: null,
          erpCode: null,
          erp: null,
          shortClassId: null,
          nation: null,
          provinceCompany: null,
          qingZhen: null,
          isWldx: null,
          smallClassId: null,
        };
        this.resetForm("form");
      },
      /**详情按钮操作*/
      handleInfo(row) {
        this.reset();
        const id = row.id;
        getStudentInfo(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "报名信息详情";
          this.disabled = true;
        });
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids;
        getStudentInfo(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.disabled = false;
          this.title = "修改报名信息";
        });
      },
      /** 取消报名按钮操作 */
      handleCancelApply(row) {
        // let text = row.isSale == 0 ? "下架" : "上架";
        let text = row.name;
        this.$confirm('确认要"取消""' + row.name + '"的报名吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return cancelApply(row.id);
        }).then(() => {
          this.msgSuccess("取消报名成功");
          this.getList();
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            updateStudentInfo(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          }
        });
      },
      //根据班次名称进行搜索
      handleQuery() {
        this.getList();
      },
      resetStudentForm() {
        // let id = this.studentQueryParams.shortClassId
        this.studentQueryParams = {
          pageNum: 1,
          pageSize: 10,
          shortClassId: null,
          name: null,
          idUmber: null,
          mobilePhone: null,
          isPay: null,
          smallClassId: null,
          smallClassName: null,
        }
        this.handleQuery()
      },
      exportExcel(row) {
        console.log(row.id)
        getStudentExportById(row.id)
          .then((response) => {
            let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
            let downloadElement = document.createElement('a')
            console.log('blob', blob)
            let href = window.URL.createObjectURL(blob) //创建下载的链接
            // console.log(href)//
            downloadElement.href = href
            //downloadElement.download = href;
            downloadElement.download = '报名导出' + this.addDate() //下载后文件名
            document.body.appendChild(downloadElement)
            downloadElement.click() //点击下载
            document.body.removeChild(downloadElement) //下载完成移除元素
            window.URL.revokeObjectURL(href) //释放掉blob对象
          }).catch(err => {
          console.log(err)
          this.$message({
            type: 'info',
            message: '导出失败'
          })
        })
      },
      addDate() {
        let nowDate = new Date()
        let date = {
          year: nowDate.getFullYear(),
          month: nowDate.getMonth() + 1,
          date: nowDate.getDate(),
          hour: nowDate.getHours(),
          minute: nowDate.getMinutes(),
          second: nowDate.getSeconds()
        }
        let zero1 = 0,
          zero2 = 0,
          zero3 = 0,
          zero4 = 0,
          zero5 = 0
        if (date.month >= 10) zero1 = ''
        if (date.date >= 10) zero2 = ''
        if (date.hour >= 10) zero3 = ''
        if (date.minute >= 10) zero4 = ''
        if (date.second >= 10) zero5 = ''
        let systemDate =
          date.year + '' + zero1 + date.month + '' + zero2 + date.date + ''
        return systemDate
      },
    },
  }
</script>

<style scoped>
</style>
