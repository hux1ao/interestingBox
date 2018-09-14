制作一个简单的chrome拓展程序
===

完成的效果
---

![](../img/extension.png '拓展程序')

第一步
---

创建两个文件

- ```popup.html```即是我们要看到的popup弹层展示的内容
- ```manifest.json```是这个拓展程序的配置,它告诉浏览器如何去使用/展示我们的拓展程序

第二步
---

修改manifest.json文件

```
{
    "name": "hux1ao",
    "version": "1.0",
    "description": "Build my first Extension!",
    "manifest_version": 2,
    "icons": {
        "128": "icon.png"
    },
    "browser_action": {  
        "default_icon": "icon.png",
        "default_title": "Hux1ao",
        "default_popup": "popup.html"
    }
}
```
配置项根据名字都很好理解
特别的
```
"browser_action": {  
    "default_icon": "icon.png",
    "default_title": "Hux1ao",
    "default_popup": "popup.html"
}
```
这一段告诉chrome,我们的插件是要打开一个弹层,弹层的源文件是```popup.html```

至于popup的内容,自由发挥吧

第三步
---

在chrome设置中选择->更多工具->拓展程序

![](../img/extensionMoreTools.png '拓展程序')

选择LOAD UNPACKED 选中对应```manifest```存在的目录

我们简单拓展程序就制作成功了