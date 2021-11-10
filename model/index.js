const mongoose = require('mongoose')
// const uniqueValidator = require("mongoose-unique-validator");
mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://localhost/test', {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
const Market = mongoose.Schema
// 数据骨架模版
const fundMarket = new Market({
	fundCode: String,
	fundName: String,
	date: Number,
	netWorth: Number,
	chngPct: Number
})
// 创建数据复合唯一索引
fundMarket.index({ fundCode: 1, date: 1 }, { unique: true })
const Fund = mongoose.model('Fund', fundMarket)
export default Fund
