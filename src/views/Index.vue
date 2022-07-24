<template>
  <el-card class="box-card">
    <div class="box-cards">
      <el-card class="box-card-1">
        <template #header>
          <div class="card-header">
            <span>今日订单数</span>
          </div>
        </template>
        <div class="text item">888</div>
      </el-card>
      <el-card class="box-card-2">
        <template #header>
          <div class="card-header">
            <span>今日日活</span>
          </div>
        </template>
        <div class="text item">6670</div>
      </el-card>
      <el-card class="box-card-3">
        <template #header>
          <div class="card-header">
            <span>转化率</span>
          </div>
        </template>
        <div class="text item">30%</div>
      </el-card>
    </div>
    <div id="zoom"></div>
  </el-card>
</template>

<script>
import { onMounted, onUnmounted, reactive } from "vue";
export default {
  name: "Index",
  setup() {
    // let obj1 = {
    //   age: 16,
    //   sex: "男",
    //   test1: {
    //     n: 666,
    //   },
    // };

    // let obj2 = reactive({
    //   age: 16,
    //   sex: "男",
    //   test1: {
    //     n: 666,
    //   },
    // });
    // console.log(obj1);
    // console.log(obj2);

    let myChart;
    onMounted(() => {
      // 基于准备好的dom，初始化echarts实例
      myChart = echarts.init(document.getElementById("zoom"));
      const option = {
        title: {
          text: "系统折线图",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["新增注册", "付费用户", "活跃用户", "订单数", "当日收入"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [
            "2021-03-11",
            "2021-03-12",
            "2021-03-13",
            "2021-03-14",
            "2021-03-15",
            "2021-03-16",
            "2021-03-17",
          ],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "新增注册",
            type: "line",
            stack: "总计",
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: "付费用户",
            type: "line",
            stack: "总计",
            data: [220, 182, 191, 234, 290, 330, 310],
          },
          {
            name: "活跃用户",
            type: "line",
            stack: "总计",
            data: [150, 232, 201, 154, 190, 330, 410],
          },
          {
            name: "订单数",
            type: "line",
            stack: "总计",
            data: [320, 332, 301, 334, 390, 330, 320],
          },
          {
            name: "当日收入",
            type: "line",
            stack: "总计",
            data: [820, 932, 901, 934, 1290, 1330, 1320],
          },
        ],
      };
      myChart.setOption(option);
    });
    onUnmounted(() => {
      myChart.dispose();
    });
    return {};
  },
};
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

/* .box-card {
} */
.box-cards {
  justify-content: space-between;
  display: flex;
}
.box-card-1 {
  width: 350px;
}
.box-card-2 {
  width: 350px;
}
.box-card-3 {
  width: 350px;
}
#zoom {
  margin-top: 30px;
  height: 400px;
  width: 1150pxpx;
}
</style>