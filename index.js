require('es6-promise').polyfill()
require('isomorphic-fetch')

const api = require('./model/api')
const path = require('path')
const express = require('express')
const app = express()
var router = express.Router()
const bodyParser = require('body-parser')
const art = require('express-art-template')

app.engine('art', art)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'art')
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/public', express.static(__dirname + '/public'))
router.get('/', function(req, res) {
	res.render('index.art', {
		path: `http://${req.headers.host}`
	})
})
// router.get("/getThsFundInfo", async function(req, res) {
//   const data = await api.getThsFundInfo(req.query.code);
//   res.json({ data, status: 1 });
// });
router.get('/getThsFundHistory', async function(req, res) {
	const data = await api.getThsFundHistory({ code: req.query.code })
	res.json({ data, status: 1 })
})
app.use(router)
app.listen(3000, () => {
	console.log('服务已启动')
})
