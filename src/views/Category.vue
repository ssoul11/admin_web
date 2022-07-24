<template>
  <el-card class="box-card">
    <template #header>
      <div class="header">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="handleAdd"
          >增加</el-button
        >
        <el-popconfirm
          title="确定删除吗？"
          confirmButtonText="确定"
          cancelButtonText="取消"
          @confirm="handleDelete"
        >
          <template #reference>
            <el-button type="danger" size="small" icon="el-icon-delete"
              >批量删除</el-button
            >
          </template>
        </el-popconfirm>
      </div>
    </template>
    <el-table
      :data="state.tableData"
      stripe
      height="475"
      style="width: 100%"
      @selection-change="selectChange"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="分类名称" prop="categoryName"> </el-table-column>

      <el-table-column prop="categoryRank" label="排序值" />
      <el-table-column prop="createTime" label="添加时间" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <a
            style="cursor: pointer; margin-right: 10px; color: #53a8ff"
            @click="handleEdit(scope.row.configId)"
            >修改</a
          >
          <a
            style="cursor: pointer; margin-right: 10px; color: #53a8ff"
            @click="handleNext(scope.row)"
            >下级分类</a
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
  <DialogAddCategory ref="addCate" :reload="getCategory" :type="type" />
</template>

<script setup>
import router from "@/router/index.js";
import { useRoute, useRouter } from "vue-router";
import { reactive, onMounted, ref, onUnmounted } from "vue";
import axios from "@/utils/axios.js";
import DialogAddCategory from "@/components/DialogAddCategory.vue";

const route = useRoute(); // 获取路由参数
// 首页配置类型参数
const configTypeMap = {};
const addCate = ref(null);
const state = reactive({
  loading: false,
  tableData: [], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  type: "add", // 操作类型
  multipleSelection: [], // 选中项
  level: 1,
  parent_id: 0,
});

onMounted(() => {
  getCategory();
  //   getIndexConfig();
  // console.log(addSwiper);
  // console.log(addSwiper.value);
});
async function getCategory() {
  const { level = 1, parent_id = 0 } = route.query;
  state.loading = true;
  const res = await axios.get("/categories", {
    params: {
      pageNumber: state.currentPage,
      pageSize: state.pageSize,
      categoryLevel: state.level,
      parentId: state.parent_id,
    },
  });
  state.tableData = res.list;
  state.loading = false;
  state.currentPage = res.currPage;
  state.level = level;
  state.parentId = parent_id;
  // state.totalPage = res.totalPage;
  console.log(res);
  // console.log(state.tableData);
}

const selectChange = function (val) {
  // console.log(val);
  state.selectData = val;
};
//添加商品
const handleAdd = function () {
  state.type = "add"; // 传入弹窗组件用于弹窗 title 判断
  addCate.value.open();
  // console.log(addSwiper.value.token);
  // console.log(addSwiper.value.tag);
};
// 修改商品
const handleEdit = (id) => {
  // console.log(id);
  state.type = "edit"; // 传入弹窗组件用于弹窗 title 判断
  addCate.value.open(id);
};

const handDelete = function () {
  if (!state.multipleSelection.length) {
    ElMessage.error("请选择项");
    return;
  }
  axios
    .delete("/categories", {
      data: {
        ids: state.multipleSelection.map((i) => i.categoryId),
      },
    })
    .then(() => {
      ElMessage.success("删除成功");
      getCategory();
    });
};

// 单个删除
const handleDeleteOne = (id) => {
  axios
    .delete("/categories", {
      data: {
        ids: [id],
      },
    })
    .then(() => {
      ElMessage.success("删除成功");
      getCategory();
    });
};

const handleNext = (item) => {
  const levelNumber = item.categoryLevel + 1;
  if (levelNumber == 4) {
    ElMessage.error("没有下一级");
    return;
  }
  router.push({
    name: `level${levelNumber}`,
    query: {
      level: levelNumber,
      parent_id: item.categoryId,
    },
  });
};
const pageChange = function (val) {
  // console.log(val);
  state.currentPage = val;
  getCategory();
};
// 选择项
const handleSelectionChange = (val) => {
  // 多选 checkbox
  state.multipleSelection = val;
};

const unwatch = router.afterEach((to, from) => {
  // to and from are both route objects. must call `next`.
  console.log(to.name);
  if (["category", "level2", "level3"].includes(to.name)) {
    getCategory();
  }
  // next();
});

onUnmounted(() => {
  unwatch();
});
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