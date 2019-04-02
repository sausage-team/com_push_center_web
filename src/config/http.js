import axios from 'axios'
import {
  Message
} from 'element-ui'
import store from '../stores'
import iView from 'iview'
import VueCookies from 'vue-cookies'
let reqCount = 0

axios.defaults.timeout = 45000

axios.interceptors.request.use(config => {
  if (VueCookies.get('pc_token')) {
    config.headers.Authorization = 'Bearer ' + VueCookies.get('pc_token')
    config.headers.userId = VueCookies.get('pc_user_id')
  }
  if (reqCount === 0) {
    iView.Spin.show()
  }
  reqCount++
  return config
}, error => {
  reqCount--
  if (reqCount === 0) {
    setTimeout(() => {
      iView.Spin.hide()
    }, 300)
  }
  iView.Message({
    message: '加载超时',
    type: 'error'
  })
  return Promise.reject(error)
})

axios.interceptors.response.use(
  response => {
    reqCount--
    if (reqCount === 0) {
      setTimeout(() => {
        iView.Spin.hide()
      }, 300)
    }
    return response
  },
  error => {
    reqCount--
    if (reqCount === 0) {
      setTimeout(() => {
        iView.Spin.hide()
      }, 300)
    }
    if (error.response) {
      switch (error.response.status) {
        case 401 | 403:
          // 401 清除token信息并跳转到登录页面
          Message({
            message: '登录已经失效，请重新登录',
            type: 'error'
          })
          store.commit('loginOut')
          store.commit('backLogin')
      }
    }
    return Promise.reject(error)
  }
)

export default axios
