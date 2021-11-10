// import Fund from "./index";

// 时间；；单位净值；涨跌幅；累计净值；
const getThsFundHistory = async function getThsFundHistory(option) {
	let send = {
		type: 'tyear'
	}
	send = Object.assign(send, option)
	const url = `https://fund.10jqka.com.cn/interface/net/flashNew/0_${send.code}_0_0_0_0_0_tyear_0_0`
	const res = await fetch(url)
	const textData = await res.text()
	const foundData = textData.split('|').map((item) => {
		const sequences = item.split(';')
		const arr = {
			fundCode: send.code,
			fundName: send.name,
			date: sequences[0].replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3'),
			netWorth: sequences[2],
			accNet: sequences[4],
			chngPct: sequences[3]
		}

		return arr
	})
	return foundData
}
// 查询同花顺基金详情
const getThsFundInfo = async function getThsFundInfo(code) {
	const url = `https://fund.10jqka.com.cn/interface/net/performance/0_${code}`
	const res = await fetch(url)
	const textData = await res.json()
	return textData
}
// var 基金代码="<基金简称>,<最新净值>,<累计净值>,<昨日净值>,<净值日期>,<基金规模(亿份)>"
// 实时基金 var 基金代码="名称，时间，最新估值，单位净值，累计单位净值，五分钟涨速(乘100后的)，涨跌幅(乘100后的)，日期"
// async function getSinaFund(codeArr) {
//   const fundCode = codeArr.join(",").replace(/,/g, ",f_");
//   const url = `http://hq.sinajs.cn/list=f_${fundCode}`;
//   http://hq.sinajs.cn/list=fu_
//   const res = await fetch(url);
//   const textData = await res.text();
//   //   const buf = Buffer.from(textData);
//   //   const data = iconv.decode(buf, "utf8");
//   return textData;
// }

// 查询单条数据
// async function findOne(option) {
//   const data = await Fund.findOne(option);
//   return data;
// }
// //查询全部数据
// async function findAll(option) {
//   const data = await Fund.find(option).sort({ date: -1 });
//   return data;
// }
// //数据保存
// async function dataSave(arr) {
//   const message = await Fund.create(arr).catch(error => {
//     console.log(error);
//   });
//   //   console.log(message);
// }

// 客户端查询数据
// app.get("/api/getFund.htm", async (req, res) => {
//   const { fundCode, type = "tyear", startTime = "", endTime = "" } = req.query;
//   const date = {
//       $gte: startTime,
//       $lte: endTime
//     },
//     params = {
//       fundCode
//     };
//   startTime && (params["date"] = startTime);
//   endTime && (params["date"] = date);
//   //   const findOneData = await findOne({ fundCode });
//   //   if (findOneData) {
//   //     const findAllData = await findAll(params);
//   //     res.json(findAllData);
//   //   } else {
//   const fundInfo = await getThsFundInfo(fundCode);
//   const {
//     data: {
//       fundInfo: { code, name }
//     }
//   } = fundInfo;
//   const thsData = await getThsFundHistory({ code, name, type });
//   // await dataSave(thsData);
//   res.json(thsData);
//   //   }
//   //   res.json(await getData(req.query));
// });
module.exports = { getThsFundHistory }
