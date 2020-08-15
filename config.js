var baseUrl 
if (process.env.NODE_ENV === 'production') {
  console.log('生产环境')
  baseUrl = '后端生产环境baseurl'
} else if (process.env.NODE_ENV === 'development') {
  console.log('开发环境')
  baseUrl = '后端开发环境baseurl'
}

module.exports = {
  baseUrl
}