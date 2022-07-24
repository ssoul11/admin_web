//用于测试组件
<template>
  <!-- <el-button type="text" @click="visible = true"
    >open a Form nested Dialog{{ Dialog }}</el-button
  > -->
  <el-dialog
    v-model="visible"
    :title="type === 'add' ? '添加轮播图' : '修改轮播图'"
  >
    <el-form :model="ruleForm" :rules="rules" ref="formRef" class="good-form">
      <el-form-item label="图片" :label-width="formLabelWidth" prop="url">
        <el-upload
          class="avatar-uploader"
          list-type="picture-card"
          :action="uploadImgServer"
          accept="jpg,jpeg,png"
          :headers="{
            token: token,
          }"
          :show-file-list="false"
          :on-success="handleUrlSuccess"
          :before-upload="handleBeforeUpload"
        >
          <img
            style="width: 148px; height: 148px; border: 1px solid #e9e9e9"
            v-if="ruleForm.url"
            :src="ruleForm.url"
            class="avatar"
          />

          <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
          <!-- <img v-if="ruleForm.url" :src="ruleForm.url" class="avatar" /> -->
          <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
        </el-upload>
      </el-form-item>
      <!-- <div>
        {{ ruleForm }}
      </div> -->
      <el-form-item label="跳转链接" :label-width="formLabelWidth" prop="link">
        <el-input
          type="text"
          v-model="ruleForm.link"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="排序值" :label-width="formLabelWidth" prop="sort">
        <el-input
          type="number"
          v-model="ruleForm.sort"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script  setup>
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import {
  UploadFile,
  ElUploadProgressEvent,
  ElFile,
} from "element-plus/es/components/upload/src/upload.type";
import { localGet, uploadImgServer } from "@/utils";
import axios from "@/utils/axios.js";
import {
  computed,
  onActivated,
  onMounted,
  onUpdated,
  reactive,
  ref,
} from "vue";
const props = defineProps({
  type: {
    type: String,
    default: "",
  },
  reload: Function, // table 刷新的方法
});
const formRef = ref(null);
const token = ref(localGet("token") || "");
const id = ref("");
const visible = ref(false);
const formLabelWidth = "140px";
const tag = "66666";
// onMounted(() => {
//   console.log(props.Dialog);
//   visible = props.Dialog;
// });

let ruleForm = reactive({
  url: "",
  link: "",
  sort: "",
});
const rules = reactive({
  url: [{ required: "true", message: "图片不能为空", trigger: ["change"] }],
  sort: [{ required: "true", message: "排序不能为空", trigger: ["change"] }],
});

// 获取详情
const getDetail = (id) => {
  axios.get(`/carousels/${id}`).then((res) => {
    ruleForm = {
      url: res.carouselUrl,
      link: res.redirectUrl,
      sort: res.carouselRank,
    };
  });
};
// 上传之前，控制上传的文件。
const handleBeforeUpload = (file) => {
  // console.log("这是上传之前的方法");
  const sufix = file.name.split(".")[1] || "";
  if (!["jpg", "jpeg", "png"].includes(sufix)) {
    ElMessage.error("请上传 jpg、jpeg、png 格式的图片");
    return false;
  }
};

// 上传图片
const handleUrlSuccess = (val, file) => {
  // console.log("这是上传图片成功的方法");
  // console.log(val.data);
  ruleForm.url = val.data || "";
};

// 开启弹窗，此方法将在父组件，通过 ref 直接调用。
const open = (id) => {
  // console.log("open执行了", id);
  visible.value = true;
  // console.log(visible);
  // 如果带着 id，则是编辑，否则为新增
  if (id) {
    id = id;
    console.log(id);
    getDetail(id);
  } else {
    (ruleForm.url = ""), (ruleForm.link = ""), (ruleForm.sort = "");
  }
};
// 关闭弹窗
const close = () => {
  visible.value = false;
};

// 提交表单方法
const submitForm = () => {
  console.log(formRef.value.validate);
  formRef.value.validate((valid) => {
    // valid 为是否通过表单验证的变量
    if (valid) {
      if (props.type == "add") {
        // 增加用 axios.post
        axios
          .post("/carousels", {
            carouselUrl: ruleForm.url,
            redirectUrl: ruleForm.link,
            carouselRank: ruleForm.sort,
          })
          .then(() => {
            ElMessage.success("添加成功");
            visible.value = false;
            if (props.reload) props.reload();
          });
      } else {
        // 编辑用 axios.put
        axios
          .put("/carousels", {
            carouselId: id,
            carouselUrl: ruleForm.url,
            redirectUrl: ruleForm.link,
            carouselRank: ruleForm.sort,
          })
          .then(() => {
            ElMessage.success("修改成功");
            visible.value = false;
            if (props.reload) props.reload();
          });
      }
    }
  });
};

defineExpose({
  open,
  close,
});
// export default {
//   name: "test",
//   setup() {},
// };
// const imageUrl = ref("");
// const handleAvatarSuccess = (res, file) => {
//   imageUrl.value = URL.createObjectURL(file.raw);
// };
// const beforeAvatarUpload = (file) => {
//   const isJPG = file.type === "image/jpeg";
//   const isLt2M = file.size / 1024 / 1024 < 2;

//   if (!isJPG) {
//     ElMessage.error("Avatar picture must be JPG format!");
//   }
//   if (!isLt2M) {
//     ElMessage.error("Avatar picture size can not exceed 2MB!");
//   }
//   return isJPG && isLt2M;
// };
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  text-align: center;
  /* align-items: flex-start; */
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
.avatar-uploader-icon {
  align-items: flex-start;
}
</style>
