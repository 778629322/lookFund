<!--  -->
<template>
  <div ref="canvas" class="canvas"></div>
</template>

<script>
import * as echarts from "echarts/core";
import * as api from "../script/api";
import dayjs from "dayjs";
import {
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LegendComponent,
} from "echarts/components";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
echarts.use([
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LineChart,
  CanvasRenderer,
  LegendComponent,
]);
const weekTxt = {
  0: "周日",
  1: "周一",
  2: "周二",
  3: "周三",
  4: "周四",
  5: "周五",
  6: "周六",
};
const color = [
  "#1890FF",
  "#13C2C2",
  "#2FC25B",
  "#FACC14",
  "#F04864",
  "#8543E0",
  "#3436C7",
  "#223273",
];
export default {
  data() {
    return {
      weeks: [],
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.handle();
  },

  methods: {
    handle() {
      this.weeks = Array.from({ length: 7 }, (item, i) => ({
        name: weekTxt[i],
        type: "line",
        symbolSize: 3,
        symbol: "circle",
        sampling: "average",
        itemStyle: {
          color: color[i],
        },
        lineStyle: {
          width: 1,
          color: color[i],
        },
        data: [],
      }));
      this.getThsFundHistory();
    },
    async getThsFundHistory() {
      const { fundCode } = this.$route.params;
      const data = await api.getThsFundHistory({ code: fundCode });
      data.reverse().map((item, i) => {
        const getDay = new Date(item.date).getDay();
        const curWeek = this.weeks[getDay];
        curWeek.data.push([item.date, +item.accNet]);
        // item.type = weekTxt[getDay];
        // item.accNet = +item.accNet;
        // item.index = i;
        // return item;
      });
      this.getThsFundInfo();
    },
    async getThsFundInfo() {
      const { fundCode } = this.$route.params;
      const data = await api.getThsFundInfo(fundCode);
      const arr = data.split(",");
      const today = dayjs(arr[7]).format("YYYY/MM/DD");
      const getDay = new Date(today).getDay();
      const yesterday = this.weeks[getDay].data;
      const lastDay = yesterday[yesterday.length - 1];
      if (data && new Date(today).getTime() > new Date(lastDay[0]).getTime()) {
        let lastAcc = lastDay[1];
        const getDay = new Date(arr[7]).getDay();
        this.weeks[getDay].data.push([
          today,
          lastAcc + (lastAcc * arr[6]) / 100,
        ]);
      }
      this.draw();
    },
    draw() {
      const { canvas } = this.$refs;
      var myChart = echarts.init(canvas);
      const option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          top: "10",
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        },
        xAxis: {
          type: "time",
          axisLabel: {
            formatter: (params) => dayjs(params).format("YYYY/MM/DD"),
          },
          splitLine: {
            show: true,
          },
        },
        yAxis: {},
        toolbox: {
          show: false,
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
          },
        },
        dataZoom: [
          {
            start: 85,
            // startValue: "2014-06-01",
            show: false, //是否显示
          },
          {
            type: "inside",
          },
        ],
        series: this.weeks,
      };
      myChart.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>
.canvas {
  height: 100%;
}
</style>
