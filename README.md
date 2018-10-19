# 问题总结
* npm 操作
```
npm init    创建一个package.json
npm install  下载package中的所有依赖
npm install -g <name> 全局安装
npm install <name> --save 生产环境依赖
npm install <name> --save-dev 生产开发环境依赖
npm update xxxxx -x  更新
npm uninstall  卸载
```
* create-react-app安装步骤
https://github.com/yangliOMG/recruit-app#create-react-app

* 关于ios兼容性的问题
> 1. ios8,9没有es的一些新方法，比如：symbol，padstart，includes，array.from。
```
使其兼容只用一步，在入口文件index.js顶部添加：
import 'babel-polyfill';
```
> 2. display：flex等样式也不兼容，在webpack的打包文件中配置：
```
loader: require.resolve('postcss-loader'),
。。。。
autoprefixer({
      browsers: [
      。。。。
      'ios >= 7.0',
      ],
      // flexbox: 'no-2009',
}),

postcss可以被理解为一个平台，可以让一些插件在上面跑

它提供了一个解析器，可以将CSS解析成抽象语法树

通过PostCSS这个平台，我们能够开发一些插件，来处理CSS。热门插件如autoprefixer

Autoprefixer是一个后处理程序，它在CSS编译后运行

```
> 3. 部分ios系统，对于某种格式的接口，在https或http下（有的http接口可用，https不行；部分系统相反），会报错"ECONNABORTED"
```
接口格式：
@RequestMapping("/info1.do")
public Map<String, Object> info1(String id, HttpServletRequest request) {
      String uid = (String) request.getSession().getAttribute("uid");
      Facility f = facilityService.findById(id);
      List<Price> price = facilityService.priceList(id);                     
      Map<String, Object> map = new HashMap<String, Object>();
      if (f != null) {
            BrowsingHistory newHistory = new BrowsingHistory();
            newHistory.setUid(uid);
            newHistory.setOid(f.getTid());
            browsingHistoryService.saveHistory(newHistory);
      }
      map.put("facility", f);
      map.put("price", price);                              //该行导致错误，new一个priceList也不会出现问题
      return map;                                           
}

==> //最终修改方案：给输出结果套一个格式Response.setSuccess(map)
```


* package.json
```
"scripts": {            //NODE_ENV环境变量；nodemon --exec 以应用程序执行脚本；
      。。。
      "server": "set NODE_ENV=test&&nodemon --exec babel-node server/server.js",
      "server_lx": "export NODE_ENV=test&&nodemon --exec babel-node server/server.js",
      "pm2": "set NODE_ENV=test&&pm2 start server/server_pm2.js",
      "server_pm2": "export NODE_ENV=test&&pm2 start server/server_pm2.js"
      //为了使pm2能够运行es6，在普通Javascript中准备一个入口点，它将在包含非转换源之前调用require('babel-register')。
      //server_pm2.js文件中包含babel-register，其将es6转换为es5的语法
}
```
* 通过内网穿透，浏览器白屏 报错"Invalid Host header"--->/config/webpackDevServer.config.js下，
```
disableHostCheck:                                                         ====》 disableHostCheck: true ,
      !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',  
```
* nginx代理静态页面，图片、接口代理，/conf/vhost/*.conf
```
location ~*.do$ {
      proxy_pass http://localhost:8000;
      proxy_set_header Host $host;                          
      proxy_set_header X-Real-IP $remote_addr;              //nginx做反向代理时，默认的配置后端获取到的ip都是来自于nginx
      proxy_set_header REMOTE-HOST $remote_addr;             //转发用户的真实IP到后端程序     
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$ {
      proxy_pass http://localhost:8000;          //nginx代理静态页面，图片、接口代理
}
location ^~ /static/ {              //在nginx上运行，static/media下的图片在默认情况是找不着的。所以要加这个路径配置，里面的东西并不必须
      gzip_static on;               //压缩
      expires max;                  //缓存最久
      add_header Cache-Control public;    //    可以被任何缓存区缓存
}
location / {
      try_files $uri $uri/ /index.html;         //如果不存在着内部重定向到index.html
}
```
* nginx做ssl证书配置，使站点通过https访问
```
阿里云上购买免费的证书--->域名解析设置，添加一条TXT的记录值，测试dns配置，等待证书签发->下载公钥私钥->部署到nginx/tomcat下，
server {
      listen 443;                   //http协议默认端口是80，https是443
      server_name www.fuyoufayuan.com;
      ssl on;
      root html;
      index index.html index.htm;
      ssl_certificate   cert/214860875720209.pem;
      ssl_certificate_key  cert/214860875720209.key;
      ssl_session_timeout 5m;
      ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
      ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
      ssl_prefer_server_ciphers on;
      location / {                        //使https的默认端口映射到http的默认端口（使对https的访问转发到80端口）
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://127.0.0.1:80;
      }
}
```
* 使用Node.js中间层做服务端渲染,server.js
> 1. 跨域 代理
```
const proxy = require('http-proxy-middleware')
const proxyPath = 'http://localhost:8000'

app.use(['/img/*','*.do'], proxy({target: proxyPath, changeOrigin: true}))
```
![img](https://upload-images.jianshu.io/upload_images/4145295-df8e7f9aa01f3448.png)
> 2. ReferenceError: window is not defined
```
服务端渲染的页面，没有window、document，注意避免渲染时使用（放在mount之中），或对其判断是否存在
```
* tomcat程序记录客户端真实IP,日志logs/access_log记录客户真实ip
> 1. 修改conf/server.xml文件
> 2. https://www.cnblogs.com/pangguoping/p/5748783.html
```
<Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs"
               prefix="localhost_access_log" suffix=".txt"
               pattern="%{X-Real-IP}i %{X-FORWARDED-FOR}i %l %u %t %r %s %b %D %q %{User-Agent}i" resolveHosts="false" />

1. X-Forwarded-For 的内容由「英文逗号 + 空格」隔开的多个部分组成，最开始的是离服务端最远的设备 IP，然后是每一级代理设备的 IP
2. X-Real-IP 通常被 HTTP 代理用来表示与它产生 TCP 连接的设备 IP，这个设备可能是其他代理，也可能是真正的请求端
3. 直接对外提供服务的 Web 应用，在进行与安全有关的操作时，只能通过 Remote Address 获取 IP，不能相信任何请求头

https://imququ.com/post/x-forwarded-for-header-in-http.html
```
* axios
> 1. 处理二进制流图片的乱码
```
axios.get('/url', {
      responseType: 'arraybuffer'
}).then(response => {
      return 'data:image/png;base64,' + btoa( new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
}).then(data => {
      this.src = data
})
```
> 2. 设置拦截器
```
import axios from 'axios'

axios.defaults.withCredentials = true
axios.defaults.timeout = 100000
axios.interceptors.request.use(config => {
    return config
})
axios.interceptors.response.use(response => {
     // 在这里你可以判断后台返回数据携带的请求码
     if (response.status === 200 || response.status === '200') {
        return response
    }else {
        // 非200请求抱错
        throw Error(response.data.data || '服务异常')
    }
})
```
> 3. axios的post请求格式书写
```
后台：
@RequestMapping("/save.do")
public boolean save(HttpServletRequest request , Back back){
      back.setUid(uid);                         //back.content字段有传的值
      。。。
}
@RequestMapping("/save2.do")
public boolean save(HttpServletRequest request , String data){
      JSONObject json = JSON.parseObject(data);
      Back back = new Back();
      back.setContent(json.getString("content"));
      。。。
}
@RequestMapping("/create.do")
public Respond create(HttpSession session, String data) {
      JSONObject json = JSON.parseObject(data);
      Pray pray = new Pray();
      pray.setPrayman(json.getString("prayman"));
      ...
}
前台：
import qs from 'qs'

axios({
      method: 'post',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify({content}),            //qs.stringify序列化：uid=cs11&pwd=000000als&username=cs11&password=000000als
      url:'/back/save.do',
})
axios({
      method: 'post',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify({data:JSON.stringify({content})}),
      url:'/back/save2.do',
})
axios.get('/pray/create.do',{params: {
      data:JSON.stringify(pray)                 //JSON.stringify序列化：{"uid":"cs11","pwd":"000000als","username":"cs11","password":"000000als"}
}})
```

* 单页应用（SPA）前端javascript如何阻止按下返回键页面回退
```
componentDidMount() {
      this.addEventHandler();
}
componentWillUnmount() {
      this.removeEventHandler();
}
addEventHandler() {
      window.addEventListener('popstate', this.closePopstate, false);
      window.history.pushState({}, '')
}
removeEventHandler() {
      window.removeEventListener('popstate', this.closePopstate, false);
}
closePopstate = (e) => {
      window.removeEventListener('popstate', this.closePopstate, false);
}
```
* react的按需加载   ./dashboard/asyncComponent.js
* 点击图片放大-》在图片的父节点上的事件中，添加
```
e.preventDefault()
```
* 时间ios的兼容格式写法
```
date = 2018-07-06T11:54:43.000+0000  //不识别
date.replace(/(\+\d{2})(\d{2})$/, "$1:$2")
date = 2018-07-06T11:54:43.000+00:00      //ios识别
```
* less的background兼容写法
```
background: url(/static/media/background.bc45e995.png) 0 0 / 100% 100%; //铺满
background:url('./images/background.png') 0 0~"/" 100% 100%;
```
* 单页面应用，微信支付，ios当前页面未注册
```
IOS
微信检测支付授权目录是第一次打开页面的时候顶部出现绿色加载条。而不是location.href，但是我们程序中使用的是location.href，就会造成一种假象链接明明是对的啊
Android
微信检测支付授权目录是location.href

解决方案
使用独立支付页面，通过location.href跳转。稳定
配置多几个授权目录（授权目录上线好像是3个？）
```
* 关于图片
> 1. jpg比png小得多；png支持透明；不用放缩图片的分辨率 对应设备的宽度即可；手机图片控制在100k以下



