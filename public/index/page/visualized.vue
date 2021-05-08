<!--  -->
<template>
  <div ref="canvas" class="canvas" />
</template>

<script>
import * as echarts from 'echarts/core'
import * as api from '../script/api'
import dayjs from 'dayjs'
import {
	ToolboxComponent,
	TooltipComponent,
	GridComponent,
	DataZoomComponent,
	LegendComponent
} from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([
	ToolboxComponent,
	TooltipComponent,
	GridComponent,
	DataZoomComponent,
	LineChart,
	CanvasRenderer,
	LegendComponent
])
const weekTxt = {
	0: '周日',
	1: '周一',
	2: '周二',
	3: '周三',
	4: '周四',
	5: '周五',
	6: '周六'
}
const color = [
	'#1890FF',
	'#13C2C2',
	'#2FC25B',
	'#FACC14',
	'#F04864',
	'#8543E0',
	'#3436C7',
	'#223273'
]
export default {

	components: {},
	data() {
		return {
			lastData: {},
			weeks: []
		}
	},

	computed: {},
	watch: {
		$route(val) {
			this.handle()
		}
	},

	mounted() {
		this.handle()
	},
	methods: {
		handle() {
			this.weeks = Array.from({ length: 7 }, (item, i) => ({
				name: weekTxt[i],
				type: 'line',
				symbolSize: 3,
				symbol: 'circle',
				sampling: 'lttb',
				itemStyle: {
					color: color[i]
				},
				lineStyle: {
					width: 1,
					color: color[i]
				},
				data: []
			}))
			this.getThsFundHistory()
		},
		async getThsFundHistory() {
			const { fundCode } = this.$route.params
			const data = await api.getThsFundHistory({ code: fundCode })
			data.reverse().map((item) => {
				const getDay = new Date(item.date).getDay()
				const curWeek = this.weeks[getDay]
				curWeek.data.push([item.date, +item.accNet])
			})
			this.lastData = data[data.length - 1]
			this.getThsFundInfo()
		},
		async getThsFundInfo() {
			const { fundCode } = this.$route.params
			const data = await api.getTTFundInfo(fundCode)
			const arr = data.split(',')
			const today = dayjs(arr[7]).format('YYYY/MM/DD')
			const lastDay = dayjs(this.lastData.date).get('day')
			const yesterday = this.weeks[lastDay].data
			const lastData = yesterday[yesterday.length - 1]
			if (data && +new Date(today) > +new Date(lastData[0])) {
				const lastAcc = lastData[1]
				const getDay = dayjs(today).get('day')
				const week = this.weeks[getDay].data
				week.push([today, lastAcc + lastAcc * (arr[6] / 100)])
			}
			this.draw()
		},
		draw() {
			const { canvas } = this.$refs
			var myChart = echarts.init(canvas)
			myChart.clear()
			const option = {
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					top: '10',
					data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
				},
				xAxis: {
					type: 'time',
					axisLabel: {
						color: '#333',
						formatter: (params) => dayjs(params).format('YYYY/MM/DD')
					},
					splitLine: {
						show: true
					},
					axisLine: {
						lineStyle: {
							color: '#e0e6f1'
						}
					}
				},
				yAxis: {
					min: 'dataMin',
					max: 'dataMax'
				},
				toolbox: {
					show: false,
					feature: {
						dataZoom: {
							yAxisIndex: 'none'
						}
					}
				},
				dataZoom: [
					{
						start: 85,
						show: false // 是否显示
					},
					{
						type: 'inside'
					}
				],
				series: this.weeks
			}
			myChart.setOption(option)
		}
	}
}
</script>
<style lang="scss" scoped>
.canvas {
  height: 100%;
}
</style>
