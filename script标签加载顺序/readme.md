事情是这样的

我们希望在请求html资源的时候,后端可以将用户的登录状态返回给我们

按照之前的做法,我们希望后端在返回index.html的时候,在文本中插入一个script标签

标签内设置window.DATA.isLogin之类的数据

然后后端大佬们照做了,内容大致是这样
```
<body>
    <div id="root"></div>
</body>
<script type="text/javascript" src="https" defer="defer"></script>
<script type="text/javascript" defer="defer">
    window.DATA = {};
    window.DATA.hasLoginInitial = true;
</script>
```

经过验证,在控制台中能够访问到window.DATA.hasLoginInitial

but!!!

前端死活取不到这个初始值,一直是undefined

最后,经过细心观察,发现可能是script标签摆放位置的问题

但是,问题来了

我觉得,带src属性的标签需要从第三方加载资源,属于异步操作
而不带src属性的标签,执行本地代码,属于同步

那么,为什么异步会先于同步执行

后边经过查阅相关资料,才知道,原来script标签是按顺序加载与执行的

就是说,无论你的src是哪,浏览器都会在执行完当前script之后再去执行下一个script

那么,这样的话,问题就解决了

```
<body>
    <div id="root"></div>
</body>
<script type="text/javascript" defer="defer">
    window.DATA = {};
    window.DATA.hasLoginInitial = true;
</script>
<script type="text/javascript" src="" defer="defer"></script>
```
但是,问题又来了

浏览器渲染完成之后的html,是这样的
```
<body>
<div id="root"></div>
</body>
<script type="text/javascript" defer="defer">
    window.DATA = {};
    window.DATA.hasLoginInitial = true;
</script>
<script type="text/javascript" src="" defer="defer"></script>
```

为什么script标签跑到body外边了????
是不是我眼花了??

后边,经过一系列google

才知道,根据HTML2.0的标准,</body>外放其他标签是不符合W3C规范的
浏览器会自动做这样一个事情,将外部的标签放到</body>内

于是,就这样一个简单的问题,忙活了将近半天,但是在开发中了解这些日常并不注意到的细节,还是挺有收获的