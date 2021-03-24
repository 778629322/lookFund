<!--  -->
<template>
  <div
    class="calendar"
    ref="calendar"
    :class="{ Y: type == 'Y', M: type == 'M' }"
  >
    <div class="date-title flex" v-show="type == 'M'">
      <div class="flex grow day">日</div>
      <div class="flex grow day">一</div>
      <div class="flex grow day">二</div>
      <div class="flex grow day">三</div>
      <div class="flex grow day">四</div>
      <div class="flex grow day">五</div>
      <div class="flex grow day">六</div>
    </div>
    <div class="box">
      <div class="years" v-for="Y in years" :key="Y">
        <p class="year" v-show="type == 'Y'">{{ Y }}年</p>
        <div
          class="months"
          v-for="M in 12"
          :key="Y + '-' + M"
          @click="lookM(Y, M, $event)"
        >
          <div class="list">
            <div class="item" v-for="day in getSpace(Y, M)" :key="-day"></div>
            <div
              class="item day"
              v-for="day in getDay(Y, M)"
              :key="day"
              :style="
                getRgb(
                  optionalChaining(
                    calendar,
                    `${Y}/${M < 10 ? '0' + M : M}/${day < 10 ? '0' + day : day}`
                  )
                )
              "
              :class="
                optionalChaining(
                  calendar,
                  `${Y}/${M < 10 ? '0' + M : M}/${day < 10 ? '0' + day : day}`,
                  'color'
                )
              "
            >
              <p class="month" v-if="day == 1">{{ M }}月</p>
              <div class="d">
                {{ day }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "../script/api";
import dayjs from "dayjs";
import { numberFormat } from "../script/utils";

export default {
  data() {
    return {
      years: [],
      calendar: {},
      type: "Y",
      days: {},
      weeks: {},
      history: [],
      chng: {
        min: 0,
        max: 0,
      },
      daysChng: {},
      weeksChng: {},
      yearsChng: {},
    };
  },

  components: {},

  computed: {
    getItem(Y, M, D) {
      return this.calendar[
        `${Y}/${M < 10 ? "0" + M : M}/${D < 10 ? "0" + D : D}`
      ];
    },
  },

  mounted() {
    this.getThsFundHistory();
    for (let i = 1; i <= 31; i++) {
      if (i <= 7) {
        this.weeks[String(i)] = { U: 0, D: 0, chng: 0 };
      }
      this.days[String(i)] = { U: 0, D: 0, chng: 0 };
    }
    this.getThsFundInfo();
    this.queryFund();
  },

  methods: {
    optionalChaining(obj, ...rest) {
      let tmp = obj;
      for (let key in rest) {
        let name = rest[key];
        tmp = tmp?.[name];
      }
      return tmp || "";
    },
    async getThsFundHistory() {
      const { fundCode } = this.$route.params;
      const data = await api.getThsFundHistory({ code: fundCode });
      this.history = data;
      this.ageLimit();
      this.handler();
      this.putDown();
    },
    async queryFund() {
      const { fundCode } = this.$route.params;
      const data = await api.queryFund(fundCode);
      console.log(data);
    },
    async getThsFundInfo() {
      const { fundCode } = this.$route.params;
      const data = await api.getThsFundInfo(fundCode);
      console.log(data);
    },
    handler() {
      const data = this.history;
      data.map((item) => {
        //计算温感的总元件
        if (+item.chngPct > +this.chng.max) {
          this.chng.max = item.chngPct;
        }
        if (+item.chngPct < +this.chng.min) {
          this.chng.min = item.chngPct;
        }
        item.color = {
          red: item.chngPct > 0,
          green: item.chngPct < 0,
          gray: item.chngPct == 0,
        };
        this.calendar[item.date] = item;
        return item;
      });
    },

    //年限
    ageLimit() {
      const data = this.history;
      const startYear = dayjs(data[data.length - 1].date).format("YYYY");
      const endYear = dayjs(data[0].date).format("YYYY");
      for (let i = startYear; i <= endYear; i++) {
        this.years.push(String(i));
      }
    },
    //设置色温颜色
    getRgb(item) {
      let color =
        item.chngPct > 0
          ? `rgba(255,0,0,${item.chngPct / this.chng.max})`
          : ` rgba(0,255,0,${item.chngPct / this.chng.min}`;
      return {
        background: color,
      };
    },
    getSpace(Y, M) {
      return new Date(Y, M - 1, 1).getDay();
    },
    getDay(Y, M) {
      // 获取某年某月的天数
      // 判断是否为闰年
      const isLeap =
        Y % 100 === 0 ? (Y % 400 === 0 ? 1 : 0) : Y % 4 === 0 ? 1 : 0;
      const monthDay = [
        31,
        28 + isLeap,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
      ]; // 数组中的每一项代表每个月的天数
      return monthDay[M - 1];
    },
    putDown() {
      const box = this.$refs.calendar;
      this.$nextTick(() => {
        box.scrollIntoView(false);
        // box.scrollTop = box.scrollHeight;
      });
    },
    lookM(Y, M, e) {
      this.type = "M";
      //   const box = this.$refs.calendar;
      this.$nextTick(() => {
        const boxH = document.documentElement.clientHeight;
        const {
          currentTarget: { offsetTop, clientHeight },
        } = e;
        window.scrollTo(0, offsetTop - boxH + clientHeight);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.date-title {
  background: rgba(246, 246, 246, 0.3);
  line-height: toRem(50px);
  z-index: 1;
  position: fixed;
  top: 0;
  width: 100%;
  color: #000000;
  border-bottom: 1px solid #c4c4c4;
  backdrop-filter: saturate(180%) blur(22px);
  .day {
    justify-content: center;
    &:last-child,
    &:first-child {
      color: #7d7d7f;
    }
  }
}

.Y {
  .box {
    padding: 0 toRem(20px);
  }
  .years {
    display: grid;
    grid-template-columns: auto auto auto;
    grid-column-gap: toRem(14px);
    .year {
      grid-column: 1/4;
      font-size: toRem(40px);
      // border-bottom: 1px solid #c2c2c2;
      line-height: toRem(60px);
      margin-bottom: toRem(30px);
      font-weight: bold;
      color: #c92629;
      position: relative;
      &::after {
        content: "";
        height: 1px;
        width: 100%;
        background: #c2c2c2;
        position: absolute;
        bottom: 0;
        right: 0;
        transform: scaleY(0.5);
      }
    }
    .months {
      padding-bottom: toRem(50px);

      .list {
        zoom: 0.25;
        padding-top: toRem(110px);
        .item {
          .month {
            color: #000;
            font-size: toRem(28px);
            font-weight: bold;
            position: absolute;
            left: 0;
            top: 0;
          }
          .d {
            transform: scale(0.7);
          }
          &.day {
            border-top: none;
          }
        }
      }
    }
  }
}
.years {
  .months {
    .list {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
      padding-top: toRem(110px);
      position: relative;
      .item {
        color: #000000;
        min-height: toRem(80px);
        padding: toRem(10px);
        text-align: center;
        .month {
          color: #000;
          font-size: toRem(32px);
          font-weight: bold;
          position: absolute;
          top: toRem(39px);
        }
        .d {
        }
        &.day {
          border-top: 1px solid #cecece;
        }
        &.red {
          background: #ea2827;
          color: #fff;
          border-top: 1px solid #ea2827;
        }
        &.green {
          background: #61c869;
          border-top: 1px solid #61c869;

          color: #fff;
        }
        &.gray {
          background: #999999;
          border-top: 1px solid #999999;

          color: #fff;
        }
      }
    }
  }
}
</style>
