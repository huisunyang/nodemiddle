var express = require('express')
var app = express()
var axios = require('axios')
var { baseUrl } = require('./config')
axios.defaults.headers.post['Content-Type'] = 'application/json'
// // 跨域
var id 
var token
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With,token,id")
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8")
  if (req.method !== 'OPTIONS') {
    id = req.headers['id']
    token = req.headers['token']
    next()
  } else {
    res.send('')
  }
})
// 请求拦截器
axios.interceptors.request.use(
  function (config) {
    config.headers['token'] = token
    config.headers['id'] = id
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

app.use('/metadata', (request, response) => {
  axios({
    url: baseUrl + '/*******',
    method: 'get'
  }).then(res => {
    response.send(res.data)
  }).catch(error => {
    console.log(error)
  })
})
console.log(baseUrl)
app.listen(8080)
console.log('listening to port 8080')