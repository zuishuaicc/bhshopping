import FlyIo from 'flyio/dist/npm/wx'
const http=new FlyIo()
http.config.baseURL='https://www.uinav.com/api/public/v1'
http.config.timeout = 30000
http.interceptors.request.use(config => {
  uni.showLoading({
    title:'加载中...',
    mask:true
  })
  return config
})
http.interceptors.response.use(response => {
  uni.hideLoading()
  return response
}, error => {
  uni.hideLoading()
  return Promise.reject(error)
})
export default http