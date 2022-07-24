<template>
  <el-card class="box-card">
    <div class="box-top">
      <el-button type="primary" size="default " round @click="handleAdd"
        >添加</el-button
      >
      <el-button type="danger" size="default " round @click="handDelete"
        >删除</el-button
      >
    </div>
    <el-divider></el-divider>

    <el-table
      :data="state.tableData"
      stripe
      height="475"
      style="width: 100%"
      @selection-change="selectChange"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="商品名称" prop="configName"> </el-table-column>
      <el-table-column prop="redirectUrl" label="跳转链接">
        <template #default="scope">
          <a target="_blank" :href="scope.row.redirectUrl">{{
            scope.row.redirectUrl
          }}</a>
        </template>
      </el-table-column>

      <el-table-column prop="configRank" label="排序值" />
      <el-table-column prop="createTime" label="添加时间" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <a
            style="cursor: pointer; margin-right: 10px; color: #53a8ff"
            @click="handleEdit(scope.row.configId)"
            >修改</a
          >
          <el-popconfirm
            title="确定删除吗？"
            confirmButtonText="确定"
            cancelButtonText="取消"
            @confirm="handleDeleteOne(scope.row.configId)"
          >
            <template #reference>
              <a style="cursor: pointer; color: #53a8ff">删除</a>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="state.total"
      @current-change="pageChange"
    >
    </el-pagination>
  </el-card>
  <!-- <div ref="addSwiper">666666666</div> -->
  <DialogAddGoods
    ref="addGoods"
    :reload="getIndexConfig"
    :type="state.type"
    :configType="state.configType"
  ></DialogAddGoods>
</template>

<script setup>
import DialogAddGoods from "@/components/DialogAddGoods.vue";
import router from "@/router/index.js";
import { reactive, onMounted, ref, onUnmounted } from "vue";
import axios from "@/utils/axios.js";
// 首页配置类型参数
const configTypeMap = {
  hot: 3,
  new: 4,
  recommend: 5,
};
const addGoods = ref(null);
const state = reactive({
  loading: false, // 控制加载动画
  tableData: [], // 数据列表
  currentPage: 1, // 当前页数
  pageSize: 20, // 每页请求数
  total: 0, //总条数
  // totalPage: 0, //总共页数
  configType: 3, // 3-(首页)热销商品 4-(首页)新品上线 5-(首页)为你推荐
  selectData: [], //select选中的数据
  type: "add", // 操作类型
});
onMounted(() => {
  getIndexConfig();
  // console.log(addSwiper);
  // console.log(addSwiper.value);
});
async function getIndexConfig() {
  state.loading = true;
  const res = await axios.get("/indexConfigs", {
    params: {
      pageNumber: state.currentPage,
      pageSize: state.pageSize,
      configType: state.configType,
    },
  });
  state.tableData = res.list;
  state.loading = false;
  state.total = res.totalCount;
  state.currentPage = res.currPage;
  // state.totalPage = res.totalPage;
  // console.log(res);
  // console.log(state.tableData);
}

const unrouter = router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  //   console.log(to);
  if (["hot", "new", "recommend"].includes(to.name)) {
    state.configType = configTypeMap[to.name];
    state.currentPage = 1;
    getIndexConfig();
  }
  next();
});
onUnmounted(() => {
  // console.log("组件消失了");
  unrouter();
});
const selectChange = function (val) {
  // console.log(val);
  state.selectData = val;
};
//添加商品
const handleAdd = function () {
  state.type = "add";
  addGoods.value.open();
  // console.log(addSwiper.value.token);
  // console.log(addSwiper.value.tag);
};
// 修改商品
const handleEdit = (id) => {
  // console.log(id);
  state.type = "edit";
  addGoods.value.open(id);
};

const handDelete = function () {
  if (!state.selectData.length) {
    ElMessage.error("请选择项");
    return;
  }
  // console.log(state.selectData);
  axios
    .delete("/indexConfigs", {
      data: {
        ids: state.selectData.map((i) => i.configId),
      },
    })
    .then(() => {
      ElMessage.success("删除成功");
      getIndexConfig();
    });
};

// 单个删除
const handleDeleteOne = (id) => {
  // console.log(id);
  axios
    .delete("/indexConfigs", {
      ids: [id],
    })
    .then(() => {
      ElMessage.success("删除成功");
      getIndexConfig();
    });
};

const pageChange = function (val) {
  // console.log(val);
  state.currentPage = val;
  getIndexConfig();
};
// return {
//   state,
//   addSwiper,
//   handleAdd,
//   getCarousels,
// };
</script>

<style scoped>
.box-top {
  display: flex;
  height: 20px;
}
.el-pagination {
  margin-top: 20px;
  height: 15px;
  justify-content: center;
}
</style>