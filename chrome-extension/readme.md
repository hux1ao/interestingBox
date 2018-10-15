制作一个简单的chrome拓展程序
===

需求
---

需要模拟Web Scraper,制作一个类似的爬虫插件

实现的功能点: 
* 给定起始列表页,爬虫爬取列当前列表页中全部详情页内容
* 当前列表页中所有详情页爬取完毕,则爬取下一列表页
* 爬取完全部列表页之后,爬虫停止

参考文档
---

[chrome扩展程序开发文档](https://crxdoc-zh.appspot.com/extensions/devguide)(请合理运用工具科学上网)

其实,相对于日常的前端开发,插件开发最大的问题是对插件的制作方法没有一个整体的认识,不知道每一块组件负责什么功能,甚至都不知道该在什么地方完成什么功能.
所以在开始之前,我们需要对插件的组成有一个整体的认识
通过对mainfest.json文件各配置项功能的了解,有助于我们对插件的结构有一个清晰的认识.那么,我们开始8

了解manifest.json
---

```
{
  "app": {
    "background": {
      // Optional
      "scripts": ["background.js"]
    }
  },
  // 用整数表示manifest文件自身格式的版本号。目前为止只接受 2
  "manifest_version": 2,
  	// 插件的名称
  "name": "My App",
  	// 插件的版本
  "version": "versionString",

  // 默认语言
  "default_locale": "en",
  // 程序描述
  "description": "my extension",
  // 图标
  "icons": {
      "16" : "icon16.png"
  },
  "browser_action" : {
    // 鼠标移入，显示简短扩展文本描述
    "default_title" : "title",
    // 鼠标点击，弹出扩展模态窗口，展示内容
    "default_popup" : "popup.html",
    "default_icon" : {
      "48" : "./icons/time48.png"
    }
  },
  // 注入页面的脚本,在该脚本内可以访问web页面dom
  "content_scripts" : [
    {
      // 通过一定的匹配规则,匹配成功之后,注入界面
      "matches" : ["*://www.baidu.com/"],
      // 需要注入的脚本路径
      "js" : ["./content_scripts.js"],
    }
  ],
  // 申请权限
  "permissions":
	[
		"contextMenus", // 右键菜单
		"tabs", // 标签
		"notifications", // 通知
		"webRequest", // web请求
		"webRequestBlocking", // 阻塞式web请求
		"storage", // 插件本地存储
		"http://*/*", // 可以通过executeScript或者insertCSS访问的网站
		"https://*/*", // 可以通过executeScript或者insertCSS访问的网站
		"cookies"
	],
    // 后台常驻脚本,扩展常常用一个单独的长时间运行的脚本来管理一些任务或者状态
	"background":
	{
		"page": "background.html"
	},
	// 插件主页，这个很重要，不要浪费了这个免费广告位
	"homepage_url": ""
}
```
更多插件的配置项,请参考[manifest配置项](https://developer.chrome.com/apps/manifest)

思考
---

我们通过对manifest配置文件的了解,大概对chrome插件有了一个初步的认识

* content-script会被注入到我们定制的匹配规则匹配成功页面.并且,可以取到当前页面的dom
* background是常驻后台,相当于一个处理中心,插件中的逻辑处理,都可以放到background中,它可以控制chrome开启,关闭页面,发送http请求等操作

那么,我们就这样分工

* content-script注入到规则匹配成功的页面
* content-script负责抓取页面
* content-script抓取成功之后,将抓取到的内容传递给background
* background收取到信息之后,发送爬取到的内容,然后控制chrome打开下一条需要抓取的页面
* 重复第一步,直到符合某条件就停止

好的,整体架构搭建完成,让我们开始吧!
---

首先,我们新建一个名叫chrome-extension的文件夹
在文件夹中,新建以下几个文件
* background.html
* popup.html
* content-script.js
* manifest.json
再为你的插件挑选一个好看的icon.
![](../img/扩展程序1.png '描述')

我们首先来完成注入到页面的content-script吧
---

我们在manifest文件中设置
```
"content_scripts" : [
  {
    "matches": ["<all_urls>"],
    "js" : ["./content_scripts.js"]
  }
]
```
其中,```"matches": ["<all_urls>"],```表示我们会将我们的content-script注入所有界面

在content-script中
```
window.onload = () => {
    const url = location.href;
    const html = document.querySelector('html');
    console.log(`我当前处在${url}`);
    console.log(`当前界面内容有${html.innerHTML}`)
}
```
我们通过点击 chrome"自定义及控制按钮" 选择 => 更多工具 => 扩展程序进入扩展程序界面

在扩展程序界面中,选择导入chrome-extension文件夹,

然后随便打开一个网页,在控制台可以看到以下内容

![](../img/扩展程序2.png '描述')

你可能会在想,我改如何调试我的content-script呢?

在控制台中,打开source -> content-script -> My Extension
即可看到我们的代码,当然,你也可以给你的代码打断点进行调试.
![](../img/扩展程序3.png '描述')

那么到这一步,我们已经可以实现页面的抓取了,不是吗?

那么,我们抓取到了页面内容,然后该干嘛呢?

根据我们之前的构思,抓到页面之后,然后发送到background中,

* 我们如何与background通信
* 我们还差一个background!!

我们来制作一个background.js页面吧

background.html
```
<!DOCTYPE html>
<html>
    <head>
        <title>后台页面</title>
        <meta charset="utf-8"/>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    </head>
    <body>
        <!-- 插件中 contentscript发送message到后台页 -->
        <!-- 后台页做处理,并将请求发送至服务器 -->
        <div class="container">
            <h1>这是后台页</h1>
        </div>
        <script type="text/javascript" src="./js/background.js"></script>
    </body>
</html>
```
background.js

```
console.log('这是常驻的后台页面')
```

刷新扩展程序,然后点击插件部分蓝色的background.html字体,会弹出background.html的控制台

在console中可以看到"这是常驻的后台页面"这几个字样

![](../img/扩展程序4.png '描述')

好了,后台页有了,那么如何让后台页与content-script页面建立联系呢?

chrome提供了对应的api

根据官方示例,我们需要从content-script发送消息

```
chrome.runtime.sendMessage({greeting: "您好"}, function(response) {
  console.log(response.farewell);
});
```

在background中,注册消息监听

```
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "来自内容脚本：" + sender.tab.url :
                "来自扩展程序");
    if (request.greeting == "您好")
      sendResponse({farewell: "再见"});
  });
```
[更多关于消息传递的介绍](https://crxdoc-zh.appspot.com/extensions/messaging)

那么,我们的页面将改成这样
content-script.js
```
window.onload = () => {
    const url = location.href;
    const html = document.querySelector('html').innerHTML;
    console.log(`我当前处在${url}`);
    console.log(`当前界面内容有${html}`);
    // 发送消息至background
    chrome.runtime.sendMessage({data: {url, html}}, function(response) {
        console.log(response);
    });
}
```
background.js
```
console.log('这是常驻的后台页面')
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request)
        sendResponse('收到消息啦!')
    }
);
```
当我们打开每一个页面,都可以在background控制台中看到以下内容
![](../img/扩展程序5.png '描述')

那么,到目前,我们的爬虫基本逻辑已经实现了

我们来盘点一下我们实现了什么,还差一些什么功能
---

目前我们爬虫的基本逻辑已经实现,能够抓取页面,能够实现各个部分间的通信

* 用户打开的每个界面,都会被我们抓取
* content-script通过发送消息,将内容传递到background
* background收到消息之后,告诉content-script"我已经收到了消息"

那么,我们还缺一些什么功能呢?

* 没有实现插件与服务器的通信,(通过普通的http请求)
* 没有实现自动抓取

在这里我们提供实现自动抓取的思路,具体源码参考[github](https://github.com/hux1ao/Front-end/tree/master/chrome-extension)

q: 实现自动抓取,我们一定需要有一个开始按钮,那么这个按钮应该放在哪个页面中?
a: 插件可以实现点击之后出现一个弹出层,我们可以将这个按钮放置在弹出层中.通过对manifest的配置,我们可以轻松的实现弹出层功能
```
"browser_action" : {
    // 鼠标移入，显示简短扩展文本描述
    "default_title" : "title",
    // 鼠标点击，弹出扩展模态窗口，展示内容
    "default_popup" : "popup.html",
    "default_icon" : {
    "48" : "icon.png"
    }
},
```
q: 浏览器自动抓取如何实现?
a: 
* 为了不影响用户操作,我们打算新建一个chrome窗口来进行爬虫操作,扩展程序对window的操作参考[chrome.windows](https://crxdoc-zh.appspot.com/extensions/windows)
* 在我们注入的代码中,我们可以根据页面的url不同执行不同的代码,比如,当前是列表页的话,我们就执行抓取详情页url以及总页数,页码等数据,如果当前为详情页,则抓取当前页面全部内容.
* 我们使用background页面作为中央处理器调控页面的抓取动作.我们在收到content-script从列表页传来的数据时,我们缓存其中的数据,通过对tab的操作,实现对页面的切换,从而完成抓取[chrome.tabs](https://crxdoc-zh.appspot.com/extensions/tabs)

总结
---

其实,本拓展程序,也就是通过一些简单的dom操作以及对chrome提供的api合理利用完成的.
当然,不得不说,google真的很强大.
