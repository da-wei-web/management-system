import axios from 'axios'



export function request(options) {
  return new Promise((resolve, reject) => {
    // 1.创建axios实例
    const instance = axios.create({
      baseURL: 'http://127.0.0.1:8888/api/private/v1',
      timeout: 8000
    });

    // 添加请求拦截器
    instance.interceptors.request.use(config => {
      // 除了登录路由外, 发送请求前需要设置请求头
      if (config.url !== '/login') {
        // 这个token需要在此获取
        const AUTH_TOKEN = localStorage.getItem('token')
        config.headers.common['Authorization'] = AUTH_TOKEN;
      }
      
      return config;
    }, err => {
      // 对请求错误做些什么
      return err;
    });

    instance.interceptors.response.use(response => {
      // 对响应数据做点什么
      return response.data;
    }, err => {
      // 对响应错误做点什么
      if( err && err.response ) {
        switch(err.response.status) {
          case 400:
            err.message = '请求错误'
            break
          case 401:
            err.message = '未授权的访问'
            break
        }
      }
      return err
    })

    instance(options).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  }) 

}