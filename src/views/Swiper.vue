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
      <el-table-column label="轮播图">
        <!-- <img
          style="width: 150px; height: 150px"
          src="#"
          alt=""
        /> -->
        <template #default="scope">
          <img
            style="width: 150px; height: 150px"
            :src="scope.row.carouselUrl"
            alt="轮播图"
          />
        </template>
      </el-table-column>
      <el-table-column prop="redirectUrl" label="跳转链接">
        <template #default="scope">
          <a target="_blank" :href="scope.row.redirectUrl">{{
            scope.row.redirectUrl
          }}</a>
        </template>
      </el-table-column>

      <el-table-column prop="carouselRank" label="排序值" />
      <el-table-column prop="createTime" label="添加时间" />
      <el-table-column label="操作" width="180" />
    </el-table>

    <el-pagination
      class="pagination"
      background
      layout="prev, pager, next"
      :total="state.total"
      @current-change="pageChange"
    >
    </el-pagination>
  </el-card>
  <!-- <div ref="addSwiper">666666666</div> -->
  <DialogAddSwiper
    ref="addSwiper"
    :reload="getCarousels"
    :type="state.type"
  ></DialogAddSwiper>
</template>

<script setup>
import DialogAddSwiper from "@/components/DialogAddSwiper.vue";
import { reactive, onMounted, ref } from "vue";
import axios from "@/utils/axios.js";

const addSwiper = ref(null);
const state = reactive({
  loading: false, // 控制加载动画
  tableData: [], // 数据列表
  currentPage: 1, // 当前页数
  pageSize: 10, // 每页请求数
  type: "add", // 操作类型
  total: 0, //总条数
  totalPage: 0, //总共页数
  selectData: [], //select选中的数据
});
onMounted(() => {
  getCarousels();
  // console.log(addSwiper);
  // console.log(addSwiper.value);
});
async function getCarousels() {
  state.loading = true;
  const res = await axios.get("/carousels", {
    params: {
      pageNumber: state.currentPage,
      pageSize: state.pageSize,
    },
  });
  state.tableData = res.list;
  state.loading = false;
  state.total = res.totalCount;
  state.currentPage = res.currPage;
  state.totalPage = res.totalPage;
  // console.log(res);
  // console.log(state.tableData);
}
const handleAdd = function () {
  state.type = "add";
  addSwiper.value.open();
  // console.log(addSwiper.value.token);
  // console.log(addSwiper.value.tag);
};

const selectChange = function (val) {
  // console.log(val);
  state.selectData = val;
};

const handDelete = function () {
  if (!state.selectData.length) {
    ElMessage.error("请选择项");
    return;
  }
  axios
    .delete("/carousels", {
      data: {
        ids: state.selectData.map((i) => i.carouselId),
      },
    })
    .then(() => {
      ElMessage.success("删除成功");
      getCarousels();
    });
};

const pageChange = function (val) {
  // console.log(val);
  state.currentPage = val;
  getCarousels();
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