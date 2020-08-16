import axios from "axios"
import qs from "qs"
import {
  Message,
  Loading
} from 'element-ui';
import "element-ui/lib/theme-chalk/index.css"
import store from "./store"

// 创建实例
const httpserver = axios.create(config);

//存放noLoading(部分接口不希望展示loading)，避免被覆盖
const ajaxParams = {};

// 配置信息
let config = {
  // 每次请求的协议、IP地址。  设置该配置后，每次请求路径都可以使用相对路径，例如"/admin/login"
  baseURL: "http://localhost:9090",
  // 请求超时时间
  timeout: 10000,
  // 每次请求携带cookie
  withCredentials: true
}

httpserver.interceptors.request.use(config => {
  config.headers.token = localStorage.token;

  // 请求默认20s
  if (!config.timeout) {
    config.timeout = 20000;
  }

  let urlKey = ''; //把url当作key保存在ajaxParams中，用来记录是否有noLoading,之所以想到用这个方法，是因为后面在response 中可以找到这个url，用来对比；
  urlKey = config.url; //commonFun.urlHasHttp(config.url) ? config.url : config.baseURL + config.url; //urlHasHttp这个方法是判断当前url是否是全地址，即是否是http，或者https，或者// 开头
  ajaxParams[urlKey] = {};

  if (!config.noLoading) { //没有noLoading，就记为false，vuex里面状态+1
    ajaxParams[urlKey].noLoading = false;
    store.commit('SET_LOADING');
  } else {
    ajaxParams[urlKey].noLoading = true;
  }
  return config;
}, err => {
  console.log(err)
  return Promise.reject(null);
})

httpserver.interceptors.response.use(response => {

  if (ajaxParams[response.config.url] && !ajaxParams[response.config.url].noLoading) {
    store.commit('CLEAN_LOADING'); //满足条件 vuex里面状态-1
  }
  return response.data
}, function (error) {
  // 都有接口报错了 不管之前有没有加1，直接减1，这样子能保证接口报错后loading消失；
  store.commit('CLEAN_LOADING');
  console.log(error, JSON.stringify(error))
  Message('网络异常，请稍后再试');
  // return Promise.resolve(null)
  return Promise.reject(null);
})


const ajax = {}
ajax.get = (url, params, myconfig) => {
  httpserver.get(url, {
      params: params,
      ...myconfig
    }).then(function (response) {
      return response;
    })
    .catch(function (err) {
      console.log(err);
    });
}

ajax.delete = (url, params, myconfig) => {
  httpserver.delete(url, {
      data: params,
      ...myconfig
    }).then(function (response) {
      return response;
    })
    .catch(function (err) {
      console.log(err);
    });
}

ajax.post = (url, params, myconfig) => {
    return new Promise((resolve,reject) => {
        httpserver(url, {
            method: 'post',
            data: qs.stringify(params),
            ...myconfig
          }).then(function (response) {
            resolve(response);
          }).catch(function (err) {
            reject(err);
        });
    })
}

ajax.put = (url, params, myconfig) => {
  return httpserver(url, {
      method: 'put',
      data: params,
      ...myconfig
    }).then(function (response) {
      console.log(response);
    })
    .catch(function (err) {
      console.log(err);
    });
}

//这两个主要用来多个请求，可有可无
ajax.all = httpserver.all;
ajax.spread = httpserver.spread;

export default ajax
