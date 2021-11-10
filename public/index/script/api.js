import http from './http'
import { resolve } from 'path'

/**
 * 基金详情
 * @param {Object} option
 * @param {Number} option.code - 用户ID
 *
 * @return {Promise} Array
 */
// export async function getThsFundInfo(option) {
//   const url = "/getThsFundInfo";
//   const params = {
//     code: "",
//     ...option,
//   };
//   const res = await http.get(url, { params });
//   return res.data;
// }

/**
 * 基金历史净值/涨跌幅
 * @param {Number} id - 参数注释
 * @return {Promise} Object
 */
export async function getThsFundHistory(option) {
	const url = `/getThsFundHistory`
	const res = await http.get(url, { params: { code: option.code }})
	return res
}

/**
 * 新浪基金实时数据  var 基金代码="名称，时间，最新估值，单位净值，累计单位净值，五分钟涨速(乘100后的)，涨跌幅(乘100后的)，日期"
 * @param {String} code - 基金代码
 * @return {Promise} String
 */
export function getThsFundInfo(code) {
	return new Promise((resolve) => {
		const url = `https://hq.sinajs.cn/list=fu_${code}`
		const script = document.createElement('script')
		script.async = true
		script.src = url
		script.onload = () => {
			const key = `hq_str_fu_${code}`
			resolve(window[key])
			script.parentNode.removeChild(script)
		}
		const head = document.head
		head.insertBefore(script, head.firstChild)
	})
}

// 天天基金实时数据
export function getTTFundInfo(code) {
	return new Promise((resolve) => {
		const url = `http://fundgz.1234567.com.cn/js/${code}.js?rt=${+new Date()}`
		const script = document.createElement('script')
		script.async = true
		script.src = url
		window.jsonpgz = function(obj) {
			const txt = `${obj.name},${obj.gztime},${obj.gsz},${obj.dwjz},${obj.dwjz},,${obj.gszzl},${obj.gztime}`
			resolve(txt)
		}
		script.onload = () => {
			script.parentNode.removeChild(script)
		}
		const head = document.head
		head.insertBefore(script, head.firstChild)
	})
}
/**
 * 查询基金
 * @param {String} code - 基金代码
 * @return {Promise} Object
 */
export function queryFund(code) {
	return new Promise((resolve, reject) => {
		const callbackName = `jsonpCB_${Date.now()}`
		const url = `https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?callback=${callbackName}&m=1&key=${code}&_=${Date.now()}`
		const script = document.createElement('script')
		script.async = true
		script.src = url
		window[callbackName] = (data) => {
			delete window[callbackName]
			script.parentNode.removeChild(script)
			if (data) {
				resolve(data)
			} else {
				reject('没有返回数据')
			}
		}
		const head = document.head
		head.insertBefore(script, head.firstChild)
	})
}
