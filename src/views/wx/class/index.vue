<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="班次名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入班级名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="培训类型" prop="trainType">
        <el-select
          v-model="queryParams.trainType"
          placeholder="请选择培训类型"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否上架" prop="isSale">
        <el-select
          v-model="queryParams.isSale"
          placeholder="请选择上架类型"
          clearable
          size="small"
        >
          <el-option label="上架" value="1"/>
          <el-option label="未上架" value="0"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索
        </el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
        >重置
        </el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['wx:class:add']"
        >新增
        </el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['wx:class:edit']"
        >修改
        </el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
        >导入
        </el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['wx:class:export']"
        >导出
        </el-button
        >
      </el-col>
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="info"-->
          <!--con="el-icon-upload2"-->
          <!--size="mini"-->
          <!--class="custom-btn-class"-->
          <!--@click="handleGetOneClassInfo"-->
        <!--&gt;拉取班次信息</el-button>-->
      <!--</el-col>-->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="classList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序号" align="center" type="index"/>
      <el-table-column label="班次编号" align="center" prop="trainProjectId">
        <template slot-scope="scope">
          <router-link :to="'/class/smallClass/' + scope.row.id" class="link-type">
            <span>{{ scope.row.trainProjectId }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="班次名称" align="center" prop="name" width="250">
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
      <el-table-column label="报到地点" align="center" prop="reportPlace" :formatter="reportPlaceFormatter"/>
      <el-table-column label="培训地点" align="center" prop="classroomPlace" :formatter="classroomPlaceFormatter"/>
      <el-table-column label="培训费用" align="center" prop="money"/>
      <el-table-column label="培训类型" align="center" prop="trainType">
        <template slot-scope="scope">
          <span>{{ scope.row.trainType == '0' ? '线上' : '线下' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报名截止时间" align="center" prop="applyEnd" :min-width="120"/>
      <el-table-column label="是否上架" align="center" prop="isSale">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isSale"
            v-has-permi="['wx:class:saleClass']"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        align="center"
        class-name="small-padding fixed-width"
        width="140"
      >
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="getMoodle(scope.row)"
          >编辑
          </el-button> -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleSmallClassList(scope.row)"
            v-hasPermi="['wx:class:edit']"
          >班级管理
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wx:class:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-share"
            @click="handleInfo(scope.row)"
            v-hasPermi="['wx:class:query']"
          >详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-share"
            @click="handleFeeInfo(scope.row)"
            v-hasPermi="['wx:const:feeList']"
          >费用
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改短期培训班对话框 -->
    <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" append-to-body destroy-on-close @close="handleClose">
      <el-form
        ref="form"
        v-loading="fileloading"
        :model="form"
        :rules="rules"
        label-width="110px"
        v-bind:disabled="disabled"
      >
        <el-form-item label="班次编号" prop="trainProjectId">
          <el-input v-model="form.trainProjectId" placeholder="请输入短期培训课程名称"/>
        </el-form-item>
        <el-form-item label="班次名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入短期培训课程名称"/>
        </el-form-item>
        <el-form-item label="报名开始时间" prop="applyStart">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form.applyStart"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择报名开始时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报名截至时间" prop="applyEnd">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form.applyEnd"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择报名截至时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报到开始时间" prop="reportStart">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form.reportStart"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择报到开始时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报到结束时间" prop="reportEnd">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form.reportEnd"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择报到结束时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="课程开始时间" prop="courseStart">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form.courseStart"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择课程开始时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="课程结束时间" prop="courseEnd">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form.courseEnd"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择课程结束时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报到地点" prop="reportPlace">
          <el-select
            v-model="form.reportPlace"
            placeholder="请选择报道地点"
          >
            <el-option
              v-for="dict in pxddOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
          <!--<el-input v-model="form.reportPlace" placeholder="请输入报道地点"/>-->
        </el-form-item>
        <el-form-item label="培训地点" prop="classroomPlace">
          <el-select
            v-model="form.classroomPlace"
            placeholder="请选择培训地点"
          >
            <el-option
              v-for="dict in pxddOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
          <!--<el-input-->
            <!--type="textarea"-->
            <!--:autosize="{ minRows: 1, maxRows: 10 }"-->
            <!--v-model="form.classroomPlace"-->
            <!--placeholder="请输入培训地点"-->
          <!--/>-->
        </el-form-item>
        <el-form-item label="所属部门" prop="dep">
          <el-select
            v-model="form.dep"
            placeholder="请选择所属部门"
          >
            <el-option
              v-for="dict in classDepOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="培训内容">
          <el-input
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 10 }"
            v-model="form.courseContent"
            :min-height="192"
          />
        </el-form-item>
        <el-form-item label="费用描述" prop="cost">
          <el-input
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 10 }"
            v-model="form.cost"
            placeholder="请输入费用描述"
          />
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 10 }"
            v-model="form.contacts"
            placeholder="请输入联系人"
          />
        </el-form-item>
        <el-form-item label="培训费用" prop="money">
          <el-input-number v-model="form.money" :precision="2" :step="1" :min="0.01" placeholder="请输入培训费用"></el-input-number>
          <!--<el-input type="number" min="0" v-model.number="form.money" placeholder="请输入培训费用"></el-input>-->
          <!--<el-input v-model="form.money" placeholder="请输入培训费用"/>-->
        </el-form-item>
        <el-form-item label="班主任" prop="classTeacher">
          <el-select multiple filterable v-model="form.classTeacher" placeholder="请选择">
            <el-option
              v-for="item in teacher"
              :key="item.teachId"
              :label="item.name"
              :value="item.teachId"
            >
            {{item.name}}{{item.idcard&&item.idcard.length>17?'('+item.idcard.replace(/(.{6}).*(.{4})/, "$1********$2")+')':item.idcard}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最大报名人数" prop="maximum">
          <el-input-number v-model="form.maximum" :step="1" :min="0" placeholder="请输入最大报名人数"></el-input-number>
          <!--<el-input type="number" min="0" v-model="form.maximum" placeholder="请输入最大报名人数"/>-->
        </el-form-item>
        <el-form-item label="理论课数量" prop="theoryCourseCount">
          <el-input-number v-model="form.theoryCourseCount" :step="1" :min="0" placeholder="请输入理论课数量"></el-input-number>
          <!--<el-input type="number" min="0" v-model.number="form.theoryCourseCount" placeholder="请输入理论课数量"></el-input>-->
          <!--<el-input v-model="form.theoryCourseCount" placeholder="请输入理论课数量"/>-->
        </el-form-item>
        <el-form-item label="实训课数量" prop="trainingCourseCount">
          <el-input-number v-model="form.trainingCourseCount" :step="1" :min="0" placeholder="请输入室训课数量"></el-input-number>
          <!--<el-input type="number" min="0" v-model.number="form.trainingCourseCount" placeholder="请输入室训课数量"></el-input>-->
          <!--<el-input v-model="form.trainingCourseCount" placeholder="请输入室训课数量"/>-->
        </el-form-item>
        <el-form-item label="证书数量" prop="certificateCount">
          <el-input-number v-model="form.certificateCount" :step="1" :min="0" placeholder="请输入证书数量"></el-input-number>
          <!--<el-input type="number" min="0" v-model.number="form.certificateCount" placeholder="请输入证书数量"></el-input>-->
          <!--<el-input v-model="form.certificateCount" placeholder="请输入证书数量"/>-->
        </el-form-item>
        <el-form-item label="班次图片地址">
          <div style="max-height: 300px; overflow-y: auto; display: flex; flex-wrap: wrap">
            <div
              v-for="classImage in classImageOptions"
              @click="handleChooseDialogImageUrl(classImage.dictValue)"
              style="cursor: pointer; margin: 2px; position: relative"
            >
              <div
                v-if="classImage.dictValue === dialogImageUrl"
                class="choose-img-layer"
              >已选择</div>
              <el-image
                :src="classImage.dictValue"
                :class="[classImage.dictValue === dialogImageUrl ? 'choose-img' : 'default-img']"
                style="width: 80px; height: 80px"
              ></el-image>
            </div>
            <div
              v-if="haveUploadImg"
              @click="handleChooseDialogImageUrl(uploadImg)"
              style="cursor: pointer; margin: 2px; position: relative"
            >
              <div
                v-if="uploadImg === dialogImageUrl"
                class="choose-img-layer"
              >已选择</div>
              <el-image
                v-if="uploadImg"
                :src="uploadImg"
                :class="[uploadImg === dialogImageUrl ? 'choose-img' : 'default-img', 'avatar']"
              />
            </div>
            <el-upload
              class="avatar-uploader"
              list-type="picture"
              action=""
              accept=".jpg, .png,.jpeg"
              :auto-upload="false"
              :on-change="pushFile"
              :before-remove="handleRemove"
            >
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="学员手册">
          <el-upload
            action=""
            accept=".pdf"
            :auto-upload="false"
            :on-change="pushFile"
            :before-remove="handleRemove2"
            :file-list="xyscFileList"
          >
            <!--:file-list="fileList"-->
            <el-button size="small" type="primary">选择文件上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传pdf文件</div>
          </el-upload>

          <el-tooltip
            v-if="dialogPdfUrl && xyscFileList.length === 0"
            content="点击预览学员手册"
            placement="right-start"
          >
            <span class="pdf-url-preview" @click="handlePdfUrlClick(form.userManual)">{{dialogPdfUrl}}</span>
          </el-tooltip>
          <!--<el-dialog :visible.sync="dialogVisible" append-to-body>-->
          <!--<a width="100%" :src="dialogPdfUrl" alt/>-->
          <!--</el-dialog>-->
        </el-form-item>
        <el-form-item label="学员临时账号">
          <el-upload
            action=""
            accept=".pdf"
            :auto-upload="false"
            :on-change="pushFile2"
            :before-remove="handleRemove3"
            :file-list="temporaryAccountFileUrlList"
          >
            <!--:file-list="fileList"-->
            <el-button size="small" type="primary">选择文件上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传pdf文件</div>
          </el-upload>

          <el-tooltip
            v-if="temporaryAccountFileUrl && temporaryAccountFileUrlList.length === 0"
            content="点击预览学员临时账号文件"
            placement="right-start"
          >
            <span class="pdf-url-preview" @click="handlePdfUrlClick(form.temporaryAccountFileUrl)">{{temporaryAccountFileUrl}}</span>
          </el-tooltip>
          <!--<el-dialog :visible.sync="dialogVisible" append-to-body>-->
          <!--<a width="100%" :src="dialogPdfUrl" alt/>-->
          <!--</el-dialog>-->
        </el-form-item>
        <el-form-item label="培训类型" prop="trainType">
          <el-select v-model="form.trainType" placeholder="请选择培训类型">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-bind:style="styleObject">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog
      class="custom-class"
      :title="upload.title"
      :visible.sync="upload.open"
      width="380px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <!--<div class="el-upload__tip" slot="tip">-->
        <!--<el-link type="info" style="font-size:12px" @click="importTemplate"-->
        <!--&gt;下载模板-->
        <!--</el-link-->
        <!--&gt;-->
        <!--</div>-->
        <div class="el-upload__tip" style="color:red" slot="tip">
          提示：仅允许导入“xls”或“xlsx”格式文件！
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm" size="small">确 定</el-button>
        <el-button @click="upload.open = false" size="small">取 消</el-button>
      </div>
    </el-dialog>
    <!--moodle编辑课程对话框-->
    <el-dialog :visible.sync="dialogMoodle" width="80%"  append-to-body>
        <iframe :src="iframeUrl" width="100%" height="480px" border="0"></iframe>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listClass,
    getClass,
    delClass,
    addClass,
    updateClass,
    exportClass,
    uploadImg,
    teachStaffList,
    uploadFile,
    saleClass
  } from '@/api/wx/class'
  import {
    listCost,
    getCost,
    delCost,
    addCost,
    updateCost,
    exportCost,
    getAllCost
  } from '@/api/wx/cost'
  import {
    listFee,
    getFee,
    delFee,
    addFee,
    updateFee,
    exportFee,
    getAllMerchant
  } from '@/api/wx/fee'
  import { allListFeeType } from '@/api/wx/feeType'
  import { allListPayType } from '@/api/wx/payType'

  export default {
    name: 'index2',
    data() {
      return {
        dialogMoodle:false,
        iframeUrl:'',
        loading: false,
        fileloading: false,
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: null,
          isSale: null,
          trainType: null
        },
        form: {},
        showSearch: true,
        total: 0,
        title: '',
        disabled: false,
        open: false,
        openView: false,
        shortClassId: null,
        isOnlineOptions: [
          { isOnline: true, isOnlineName: '是' },
          { isOnline: false, isOnlineName: '否' }
        ],
        statusOptions: [
          {
            dictValue: 0,
            dictLabel: '线上'
          },
          {
            dictValue: 1,
            dictLabel: '线下'
          }
        ],
        classImageOptions: [], //班级默认图片列表
        pxddOptions: [],//培训地点数据
        classDepOptions: [],//培训地点数据
        single: true, // 非单个禁用
        multiple: true, // 非多个禁用
        classList: [], // 短期培训班表格数据
        teacher: [],//班主任数据
        dialogImageUrl: '', //图片参数
        dialogPdfUrl: '', //学员手册
        temporaryAccountFileUrl: '', //学员临时账号
        dialogVisible: false, //pdf上传弹框
        styleObject: '', //确认按钮显示
        imgFileList: [], //班次图片文件
        xyscFileList: [], //学员手册文件
        temporaryAccountFileUrlList: [], //学员临时账号
        isUpdate: false,
        uploadImg: null,
        upload: {
          // 是否显示弹出层（班次导入）
          open: false,
          // 弹出层标题（班次导入）
          title: '',
          // 是否禁用上传
          isUploading: false,
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + '/wx/class/importData'
        },
        // 表单校验
        rules: {
          trainProjectId: [
            { required: true, message: '班次编号不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '班次名称不能为空', trigger: 'blur' }
          ],
          applyEnd: [
            { required: true, message: '报名截止时间不能为空', trigger: 'blur' }
          ],
          applyStart: [
            { required: true, message: '报名开始时间不能为空', trigger: 'blur' }
          ],
          reportStart: [
            { required: true, message: '报到开始时间不能为空', trigger: 'blur' }
          ],
          reportEnd: [
            { required: true, message: '报到结束时间不能为空', trigger: 'blur' }
          ],
          courseStart: [
            { required: true, message: '课程开始时间不能为空', trigger: 'blur' }
          ],
          courseEnd: [
            { required: true, message: '课程结束时间不能为空', trigger: 'blur' }
          ],
          reportPlace: [
            { required: true, message: '报到地点不能为空', trigger: 'blur' }
          ],
          classroomPlace: [
            { required: true, message: '培训地点不能为空', trigger: 'blur' }
          ],
          courseContent: [
            { required: true, message: '培训内容不能为空', trigger: 'blur' }
          ],
          cost: [
            { required: true, message: '费用描述不能为空', trigger: 'blur' }
          ],
          contacts: [
            { required: true, message: '联系人不能为空', trigger: 'blur' }
          ],
          money: [
            { required: true, message: '报名费用不能为空', trigger: 'blur' }
          ],
          classTeacher: [
            { required: true, message: '班主任不能为空', trigger: 'blur' }
          ],
          maximum: [
            { required: true, message: '最大报名人数不能为空', trigger: 'blur' }
          ],
          theoryCourseCount: [
            { required: true, message: '理论课数量不能为空', trigger: 'blur' }
          ],
          trainingCourseCount: [
            { required: true, message: '室训课数量不能为空', trigger: 'blur' }
          ],
          certificateCount: [
            { required: true, message: '证书数量不能为空', trigger: 'blur' }
          ],
          url: [{ required: true, message: '班次图片不能为空', trigger: 'blur' }],
          trainType: [
            { required: true, message: '培训类型不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      haveUploadImg() {
        let haveImg = true;
        this.classImageOptions.forEach(item => {
          if (haveImg && item.dictValue === this.uploadImg) {
            haveImg = false;
          }
        })
        return haveImg;
      }
    },
    created() {
      this.getList()
      getAllMerchant().then(response => {
        this.merchant = response.data
      });
      teachStaffList().then(response => {
        this.teacher = response.data
      });
      this.getDicts("class_image").then(response => {
        this.classImageOptions = response.data;
      });
      this.getDicts("sys_pxdd").then(response => {
        this.pxddOptions = response.data;
      });
      this.getDicts("sys_class_dep").then(response => {
        this.classDepOptions = response.data;
      });
    },
    methods: {

      getMoodle(val){
        this.dialogMoodle = true;
        console.log(val)
      },
      //报道地点
      reportPlaceFormatter(row, column) {
        return this.selectDictLabel(this.pxddOptions, row.reportPlace);
      },
      //培训地点
      classroomPlaceFormatter(row, column) {
        return this.selectDictLabel(this.pxddOptions, row.classroomPlace);
      },
      handleGetOneClassInfo() {
        this.$prompt('请输入项目编号', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          // inputErrorMessage: '邮箱格式不正确'
        }).then(({ value }) => {
          this.$message({
            type: 'success',
            message: '你输入的项目编号是: ' + value
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消拉取'
          });
        });
      },
      handlePdfUrlClick(url) {
        window.open(url, '_blank')
      },
      // 上架状态修改
      handleStatusChange(row) {
        let text = row.isSale == 0 ? '下架' : '上架'
        // const loading = this.$loading({
        //   // lock: true,
        //   text: '正在查询班级费用信息...',
        //   background: 'rgba(255, 255, 255, 0.7)'
        // });
        getAllCost(row.id).then(resp => {
          // loading.close();
          let waringText = '确认要"'
          if ((resp.data || []).length === 0 && text === '上架') {
            waringText = '该班次未设置费用, 确认要"';
          }
          this.$confirm(waringText + text + '""' + row.name + '"吗?', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(function() {
            // return updateClass({ id: row.id, isSale: row.isSale })
            return saleClass(row.id);
          }).then(() => {
            this.msgSuccess(text + '成功')
          }).catch(function() {
            row.isSale = row.isSale == 0 ? 1 : 0
          })
        })
      },
      /** 查询短期培训班列表 */
      getList() {
        this.loading = true
        listClass(this.queryParams).then(response => {
          this.classList = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      //选择班次图片
      handleChooseDialogImageUrl(val) {
        if (val) {
          this.form.url = val;
          this.dialogImageUrl = val
        }
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.dialogImageUrl = ''
        this.reset()
      },
      handleClose() {
        this.imgFileList = [];
        this.xyscFileList = [];
        this.temporaryAccountFileUrlList = [];
        this.dialogPdfUrl = "";
        this.dialogImageUrl = "";
        this.uploadImg = "";
        this.temporaryAccountFileUrl = "";
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          trainProjectId: null,
          name: null,
          applyStart: null,
          applyEnd: null,
          reportStart: null,
          reportEnd: null,
          courseStart: null,
          courseEnd: null,
          reportPlace: null,
          classroomPlace: null,
          dep: null,
          courseContent: null,
          cost: null,
          contacts: null,
          money: null,
          classTeacher: [],
          applyNum: null,
          maximum: null,
          theoryCourseCount: null,
          trainingCourseCount: null,
          certificateCount: null,
          url: null,
          trainType: null,
          createTime: null,
          createUser: null,
          updateTime: null,
          updateUser: null,
          delFlag: null
        }
        this.resetForm('form')
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
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.isUpdate = false;
        this.open = true
        this.styleObject = ''
        this.disabled = false
        this.title = '添加短期培训班'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        // this.isUpdate = '1'
        this.reset();
        this.isUpdate = true;
        const id = row.id || this.ids
        getClass(id).then(response => {
          this.form = response.data
          this.dialogImageUrl = response.data.url;
          this.uploadImg = response.data.url;
          // if (response.data.url) {
          //   this.imgFileList = [response.data.url]
          // }
          const pdfurl = response.data.userManual || ''
          if (!(pdfurl === '')) {
            const pdfurls = pdfurl.split('/') || []
            const length = pdfurls.length
            this.dialogPdfUrl = pdfurls[length - 1]
          } else {
            this.dialogPdfUrl = pdfurl
          }
          const temporaryAccountFileUrl = response.data.temporaryAccountFileUrl || ''
          if (!(temporaryAccountFileUrl === '')) {
            const temporaryAccountFileUrls = temporaryAccountFileUrl.split('/') || []
            const length = temporaryAccountFileUrls.length
            this.temporaryAccountFileUrl = temporaryAccountFileUrls[length - 1]
          } else {
            this.temporaryAccountFileUrl = temporaryAccountFileUrl
          }
          this.form.classTeacher = response.teacherIds
          this.open = true
          this.styleObject = ''
          this.disabled = false
          this.title = '修改短期培训班'
        })
      },
      //打开班级管理
      handleSmallClassList(row) {
        this.$router.push('/class/smallClass/' + row.id)
      },
      /**详情按钮操作*/
      handleInfo(row) {
        this.reset();
        const id = row.id
        getClass(id).then(response => {
          this.form = response.data
          this.dialogImageUrl = response.data.url;
          this.uploadImg = response.data.url;
          const pdfurl = response.data.userManual || ''
          if (!(pdfurl === '')) {
            const pdfurls = pdfurl.split('/') || []
            const length = pdfurls.length
            this.dialogPdfUrl = pdfurls[length - 1]
          } else {
            this.dialogPdfUrl = pdfurl
          }
          const temporaryAccountFileUrl = response.data.temporaryAccountFileUrl || ''
          if (!(temporaryAccountFileUrl === '')) {
            const temporaryAccountFileUrls = temporaryAccountFileUrl.split('/') || []
            const length = temporaryAccountFileUrls.length
            this.temporaryAccountFileUrl = temporaryAccountFileUrls[length - 1]
          } else {
            this.temporaryAccountFileUrl = temporaryAccountFileUrl
          }
          this.form.classTeacher = response.teacherIds
          this.open = true
          this.title = '短期培训班详情'
          this.styleObject = 'display:none'
          this.disabled = true
        })
      },
      /*费用详情弹框*/
      handleFeeInfo(row) {
        this.$router.push("/class/costManage/" + row.id)
      },

      /** 导入按钮操作 */
      handleImport() {
        this.upload.title = '班次导入'
        this.upload.open = true
      },
      // pic&pdf上传
      pushFile(file) {
        console.log(file)
        // application/pdf
        let that = this
        this.fileloading = true
        const formData = new FormData()
        formData.append('file', file.raw);
        if (file.raw.type == 'application/pdf') {
          this.xyscFileList = [file];
        } else {
          this.imgFileList = [file];
        }
        uploadFile(formData).then(response => {
          console.log(response)
          if (response.code == 200) {
            // that.fileloading = false
            if (file.raw.type == 'application/pdf') {
              that.form.userManual = String(response.msg)
            } else {
              that.dialogImageUrl = String(response.msg);
              that.uploadImg = String(response.msg);
              that.form.url = String(response.msg)
            }
          }
        }).finally(() => {
          that.fileloading = false
        })
      },
      // pic&pdf上传
      pushFile2(file) {
        let that = this
        this.fileloading = true
        const formData = new FormData()
        formData.append('file', file.raw);
        this.temporaryAccountFileUrlList = [file];
        uploadFile(formData).then(response => {
          console.log(response)
          if (response.code == 200) {
            that.form.temporaryAccountFileUrl = String(response.msg)
          }
        }).finally(() => {
          that.fileloading = false
        })
      },
      //班次图片移除
      handleRemove() {
        this.imgFileList = [];
        this.form.url = this.dialogImageUrl;
      },
      //学员手册移除
      handleRemove2() {
        this.xyscFileList = [];
        this.form.userManual = this.dialogPdfUrl;
      },
      //学员临时账号移除
      handleRemove3() {
        this.temporaryAccountFileUrlList = [];
        this.form.temporaryAccountFileUrl = this.temporaryAccountFileUrl;
      },
      /** 下载模板操作 */
      importTemplate() {
        // importTemplate().then(response => {
        //   this.download(response.msg)
        // })
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.upload.open = false
        this.upload.isUploading = false
        this.$refs.upload.clearFiles()
        this.$alert(response.msg, '导入结果', { dangerouslyUseHTMLString: true })
        this.getList()
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有短期培训班数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return exportClass(queryParams)
        }).then(response => {
          this.download(response.msg)
        })
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.isUpdate) {
              updateClass({ ...this.form, classTeacher: JSON.stringify(this.form.classTeacher) }).then(response => {
                this.msgSuccess('修改成功')
                this.open = false
                this.dialogImageUrl = ''
                this.getList()
              })
            } else {
              addClass({ ...this.form, classTeacher: JSON.stringify(this.form.classTeacher) }).then(response => {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              })
            }
          }
        })
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit()
      },
    }
  }
</script>

<style scoped lang="scss">
  .custom-class {
    /deep/ .el-dialog__header {
      padding: 10px 10px !important;
    }

    /deep/ .el-dialog__headerbtn {
      top: 15px;
      right: 15px;
    }

    /deep/ .el-dialog__footer {
      padding: 10px;
    }

    /deep/.el-dialog__body {
      padding: 10px 10px;
    }
  }

  /*.custom-class >>> .el-dialog__header {*/
  /*padding: 10px !important;*/
  /*}*/
  /*/deep/ .el-dialog__header {*/
  /*padding: 10px;*/
  /*}*/
  /*}*/

  /*/deep/ .custom-dialog .el-dialog__header {*/
  /*padding: 10px;*/
  /*}*/

  /*.custom-dialog */

  .pdf-url-preview {
    color: #00afff;
  }

  .pdf-url-preview:hover {
    cursor: pointer;
    color: red;
  }

  .avatar-uploader {
    display: inline-block;
    width: 80px;
    height: 80px;
    margin: 2px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .avatar {
    width: 80px;
    height: 80px;
    display: block;
  }

  .choose-img {
    border: 3px solid #111111;
  }

  .default-img {

  }

  .choose-img-layer {
    background: rgba(1, 1, 1, 0.1);
    color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: calc(100% - 12px);
    text-align: center
  }

  .custom-btn-class {
    background-color: rgb(134, 3, 175); border-color: rgb(134, 3, 175);
  }

  .custom-btn-class:hover {
    background-color: #9503C3;
  }
</style>

