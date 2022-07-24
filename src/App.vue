<template>
  <el-container v-if="showMenu">
    <el-aside class="left">
      <el-row class="tac">
        <el-col :span="12">
          <h5 class="mb-2">Shop-Admin</h5>
          <el-menu
            default-active="/"
            class="el-menu-vertical-demo"
            :unique-opened="true"
            :router="true"
          >
            <el-sub-menu index="1">
              <template #title>
                <!-- <el-icon><location /></el-icon> -->
                <span>系统简介</span>
              </template>
              <el-menu-item index="/">系统数据</el-menu-item>
              <el-menu-item index="/add">添加商品</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="2">
              <template #title>
                <!-- <el-icon><location /></el-icon> -->
                <span>首页配置</span>
              </template>
              <el-menu-item index="/swiper">轮播图配置</el-menu-item>
              <el-menu-item index="/hot">热销商品配置</el-menu-item>
              <el-menu-item index="/new">新品上线配置</el-menu-item>
              <el-menu-item index="/recommend">为你推荐配置</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="3">
              <template #title>
                <!-- <el-icon><location /></el-icon> -->
                <span>模块管理</span>
              </template>
              <el-menu-item index="/category">分类管理</el-menu-item>
              <el-menu-item index="3-2">商品管理</el-menu-item>
              <el-menu-item index="3-3">会员管理</el-menu-item>
              <el-menu-item index="3-4">订单管理</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="4">
              <template #title>
                <!-- <el-icon><location /></el-icon> -->
                <span>系统管理</span>
              </template>
              <el-menu-item index="4-1">修改密码</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-col>
      </el-row>
    </el-aside>
    <el-container class="right">
      <el-header class="header"><Header :title="title"></Header></el-header>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
      <el-footer class="footer"
        >Copyright © Chenz_Coder1@foxmail.com . All rights reserved.
      </el-footer>
    </el-container>
  </el-container>
  <router-view v-else></router-view>
  <!-- <Login v-if="showMenu"></Login> -->
</template>

<script  setup>
import Header from "./components/Header.vue";
import router from "./router/index.js";
import { localGet, pathMap } from "./utils/index.js";
import { ref } from "vue";

// const handleOpen = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath);
// };
// const handleClose = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath);
// };
let showMenu = ref(false);
let title = ref(null);

router.beforeEach((to, from, next) => {
  if (to.path == "/login") {
    next();
  } else {
    if (!localGet("token")) {
      next("/login");
    } else {
      next();
    }
  }
  showMenu.value = !(to.path == "/login");
  title.value = pathMap[to.name];
  document.title = pathMap[to.name];
  // console.log(title.value);
});
</script>

<style scoped>
.left {
  width: 200px;
  height: 97vh;
}

.right .header {
  height: 30px;
}
.right .footer {
  height: 30px;
}
.right .main {
  height: calc(97vh - 60px);
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>