# 545WebPlayer
 随时随地在线补充塔能量  
一个强大的在线音乐播放器，使用PWA技术  
你可以访问[这里](https://545.qinlili.bid)体验  
提交音频请参考[音频质量指南](Quality.md)  

## 如何在本地使用  
你应该在本地运行一个静态页面服务端  
琴梨梨自用方法：  
先运行此命令安装    
`npm install --global http-server`  
然后使用此命令启动  
`http-server`  
之后在浏览器内访问`127.0.0.1:8080`即可  
特别注意：为正常调试Service Worker你必须在浏览器内使用127.0.0.1或localhost访问，否则会因为不安全的域无法安装  

