<template>
  <div class="header">
    <!-- <i v-if="hasBack" class="el-icon-back" @click="back"></i> -->
    <div class="left">
      <svg
        class="icon"
        width="15"
        height="15"
        style="color: #73767a margin-right:20px"
        v-if="hasBack"
        @click="back"
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
        data-v-4194ce60=""
      >
        <path
          fill="currentColor"
          d="M685.248 104.704a64 64 0 010 90.496L368.448 512l316.8 316.8a64 64 0 01-90.496 90.496L232.704 557.248a64 64 0 010-90.496l362.048-362.048a64 64 0 0190.496 0z"
        ></path></svg
      >{{ title }}
    </div>
    <div class="righ">
      <el-popover
        placement="bottom"
        :width="100"
        trigger="click"
        v-model:visible="visible"
      >
        <p>是否退出账号</p>
        <div style="text-align: right; margin: 0">
          <el-button size="small" type="text" @click="visible = false"
            >取消</el-button
          >
          <el-button size="small" type="primary" @click="logout"
            >确认</el-button
          >
        </div>
        <template #reference>
          <el-button @click="visible = true"
            ><svg
              class="icon"
              width="20"
              height="20"
              viewBox="0 0 1024 1024"
              color="#303133"
              xmlns="http://www.w3.org/2000/svg"
              data-v-042ca774=""
            >
              <path
                fill="currentColor"
                d="M512 512a192 192 0 100-384 192 192 0 000 384zm0 64a256 256 0 110-512 256 256 0 010 512zm320 320v-96a96 96 0 00-96-96H288a96 96 0 00-96 96v96a32 32 0 11-64 0v-96a160 160 0 01160-160h448a160 160 0 01160 160v96a32 32 0 11-64 0z"
              ></path></svg
          ></el-button>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "@/utils/axios.js";
import { localRemove } from "@/utils/index.js";
import router from "@/router/index.js";
export default {
  props: {
    title: String,
  },
  setup(props) {
    const visible = ref(false);
    const hasBack = ref(false);
    const logout = function () {
      axios.delete("/logout").then(() => {
        // 退出之后，将本地保存的 token  清理掉
        localRemove("token");
        // 回到登录页
        router.push({ path: "/login" });
      });
    };
    router.afterEach((to) => {
      const { id } = to.query;
      // state.name = pathMap[to.name];
      // level2 和 level3 需要展示返回icon
      hasBack.value = ["level2", "level3"].includes(to.name);
    });
    // 返回方法
    const back = () => {
      router.back();
    };

    return {
      hasBack,
      visible,
      logout,
      back,
    };
  },
};
</script>


<style scoped>
.header {
  display: flex;
  border-bottom: 1px solid #e9e9e9;
  /* align-items: center; */
  height: 30px;
}
.header div {
  justify-content: space-between;
}
.right .el-button {
  height: 25px;
  width: 30px;
}
</style>