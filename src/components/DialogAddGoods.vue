<template>
  <!-- <el-button type="text" @click="visible = true"
    >open a Form nested Dialog{{ Dialog }}</el-button
  > -->
  <el-dialog
    v-model="visible"
    :title="type === 'add' ? '添加轮播图' : '修改轮播图'"
  >
    <el-form :model="ruleForm" :rules="rules" ref="formRef" class="good-form">
      <el-form-item label="商品名称" :label-width="formLabelWidth" prop="name">
        <el-input
          type="text"
          v-model="ruleForm.name"
          autocomplete="off"
        ></el-input> </el-form-item
      ><el-form-item label="跳转链接" :label-width="formLabelWidth" prop="link">
        <el-input
          type="text"
          v-model="ruleForm.link"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="商品编号"
        :label-width="formLabelWidth"
        prop="number"
      >
        <el-input
          type="number"
          v-model="ruleForm.number"
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
  configType: {
    type: Number,
  },
});
const formRef = ref(null);
const token = ref(localGet("token") || "");
const ids = ref("");
const visible = ref(false);
const formLabelWidth = "140px";
// onMounted(() => {
//   console.log(props.Dialog);
//   visible = props.Dialog;
// });

const ruleForm = reactive({
  name: "",
  link: "",
  sort: "",
  number: "",
});
const rules = reactive({
  name: [
    { required: "true", message: "商品名称不能为空", trigger: ["change"] },
  ],
  sort: [{ required: "true", message: "排序不能为空", trigger: ["change"] }],
  number: [
    {
      required: "true",
      message: "商品编号不能为空",
      trigger: ["change"],
    },
  ],
});

// 获取详情
const getDetail = (id) => {
  axios.get(`/indexConfigs/${id}`).then((res) => {
    (ruleForm.name = res.configName),
      (ruleForm.link = res.redirectUrl),
      (ruleForm.sort = res.configRank),
      (ruleForm.number = res.goodsId);
  });
};

// 开启弹窗，此方法将在父组件，通过 ref 直接调用。
const open = (id) => {
  //   console.log("open执行了", id);
  visible.value = true;
  // console.log(visible);
  // 如果带着 id，则是编辑，否则为新增
  if (id) {
    ids.value = id;
    getDetail(id);
  } else {
    (ruleForm.name = ""),
      (ruleForm.link = ""),
      (ruleForm.sort = ""),
      (ruleForm.number = "");
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
      if (ruleForm.number < 0 || ruleForm.number > 200) {
        ElMessage.error("商品编号不能小于 0 或大于 200");
        return;
      }
      if (props.type === "add") {
        // 增加用 axios.post
        // console.log("这是add行为");
        // console.log(
        //   props.configType,
        //   ruleForm.name,
        //   ruleForm.link,
        //   ruleForm.number,
        //   ruleForm.sort
        // );
        axios
          .post("/indexConfigs", {
            configType: props.configType || 3,
            configName: ruleForm.name,
            redirectUrl: ruleForm.link,
            goodsId: ruleForm.number,
            configRank: ruleForm.sort,
          })
          .then(() => {
            ElMessage.success("添加成功");
            visible.value = false;
            if (props.reload) props.reload();
          });
      } else {
        // 编辑用 axios.put
        // console.log(ids.value);
        axios
          .put("/indexConfigs", {
            // configId: ids.value,
            // configType: props.Type || 3,
            // configName: ruleForm.name,
            // redirectUrl: ruleForm.link,
            // goodsId: ruleForm.number,
            // configRank: ruleForm.sort,

            configId: ids.value,
            configName: ruleForm.name,
            configRank: ruleForm.sort,
            configType: props.configType || 3,
            goodsId: ruleForm.number,
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
