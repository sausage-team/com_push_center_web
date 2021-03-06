import Service from './index.js'

class NwService {
  getWatchData (data) {
    return new Promise((resolve) => {
      Service.TEMPLATE_GET('/api/task/monitor/list', data, resolve)
    })
  }

  watchStatistics (data) {
    return new Promise((resolve) => {
      Service.TEMPLATE_GET('/api/task/monitor/statistics', data, resolve)
    })
  }

  matchList (data) {
    return new Promise((resolve) => {
      Service.TEMPLATE_GET('/api/task/data_list', data, resolve)
    })
  }

  pushList (data) {
    return new Promise((resolve) => {
      Service.TEMPLATE_GET('/api/task/push_list', data, resolve)
    })
  }

  changeStatus (data) {
    return new Promise((resolve) => {
      Service.TEMPLATE_PUT('/api/task/switch', data, resolve)
    })
  }
}

export default new NwService()
