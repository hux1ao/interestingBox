制作一个简单的chrome拓展程序
===

需求
---

需要模拟Web Scraper,制作一个类似的爬虫插件

实现的功能点: 
* 在插件中选择筛选条件
* 根据筛选条件,请求接口从后端获取起始list页面url
* 从起始页面开始爬虫,爬完符合条件的全部页面后爬虫停止

背景
---

因为没有chrome插件开发经验,对这个需求一头雾水.
但是,当发现chrome扩展程序开发文档之后,也就硬着头皮开始做了T T
[chrome扩展程序开发文档](https://crxdoc-zh.appspot.com/extensions/devguide)
!请合理运用工具科学上网

其实,相对于日常的前端开发,插件开发最大的问题是对插件的制作没有一个整体的认识,可能都不知道该在什么地方写什么代码.
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
当然插件中还有其他的配置项,可以参考[manifest配置项](https://developer.chrome.com/apps/manifest)

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

so,问题来了,content-script如何与background通信呢

chrome提供了对应的api

我们需要从content-script发送消息

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

实现
---

其实到目前,每个页面的基本分工已经完成.每个页面都会有条不紊的做自己的事情.那么,回头看看,我们到目前基本实现了什么?

* 插件通过匹配规则,会为匹配成功的页面注入一段js代码
* 这段js代码会抓取界面内容,并将抓取到的内容传递到background
* 后端收到这段内容之后,通过一些处理,再发送http请求传递到后端

那么问题来了,这个爬虫只能在我们手动打开页面之后,才去抓取,我如何让它能够实现自动抓取的功能呢?
我想要一个按钮,我点击之后,浏览器就开始自动抓取
好8,我们再开始8

为了方便操作,我们制作一个弹出层,当我们点击chrome右上方的插件标志,弹出层出现,点击弹出层中按钮,开始爬虫.

那么弹出层应该有什么?

* 首先,弹出层需要一个按钮,并有对应的监听事件,当用户点击按钮时,触发事件
* 触发事件时,将需要爬取的列表页url传递到background

弹出层与background的通信,参考content-script与background的方法

那么有了这样一个按钮之后,我们的业务逻辑变成什么样了?

* 用户点击按钮
* popup层将列表页url传递给background
* background页面控制chrome开启列表页
* content-script注入列表页,爬取有效数据:所有详情页的url集合,下一个列表页url,当前是不是最后一个列表页
* content-script将内容传递到background
* background获取数据之后,控制浏览器开始爬取详情页
* content-script开始注入详情页
* 获取详情页有效内容: 爬虫需要的信息
* content-script将信息发送至background,并告诉background本页已经爬取完成.
* background收到当前详情页爬取完成之后,控制chrome更换当前tab的url,开始爬取下一条

这样,一个能够自动爬取数据的爬虫就完成了