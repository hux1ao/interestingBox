如何在 Web 关闭页面时发送 Ajax 请求
有时候我们需要在用户离开页面的时候，做一些上报来记录用户行为。又或者是发送服务器ajax请求，通知服务器用户已经离开，比如直播间内的退房操作。

本文主要分两部分来讲解怎么完成退出行为的上报。

1.事件监听
浏览器有两个事件可以用来监听页面关闭，beforeunload和unload。 beforeunload是在文档和资源将要关闭的时候调用的， 这时候文档还是可见的，并且在这个关闭的事件还是可以取消的。比如下面这种写法就会让用户导致在刷新或者关闭页面时候，有个弹窗提醒用户是否关闭。

window.addEventListener("beforeunload", function (event) {
  // Cancel the event as stated by the standard.
  event.preventDefault();
  // Chrome requires returnValue to be set.
  event.returnValue = '';
});
复制代码
unload则是在页面已经正在被卸载时发生，此时文档所处的状态是：1.所有资源仍存在（图片，iframe等）；2.对于用户所有资源不可见；3.界面交互无效（window.open, alert, confirm 等）；4.错误不会停止卸载文档的过程。

基于以上两个方法就可以实现对页面关闭的事件监听了，为了稳妥，可以两个事件都监听。然后对监听函数做处理，让关闭事件只调用一次。

2.请求发送
有了上面的监听，事情只完成了一半，如果我们在监听中直接发送ajax请求，就会发现请求被浏览器abort了，无法发送出去。在页面卸载的时候，浏览器并不能保证异步的请求能够成功发出去。

我们有几种方式可以解决这个问题：

方案1: 发送同步的ajax请求
var oAjax = new XMLHttpRequest();

oAjax.open('POST', url + '/user/register', false);//false表示同步请求

oAjax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

oAjax.onreadystatechange = function() {
    if (oAjax.readyState == 4 && oAjax.status == 200) {
        var data = JSON.parse(oAjax.responseText);
    } else {
        console.log(oAjax);
    }
};

oAjax.send('a=1&b=2');
复制代码
这种方式虽然有效，但是用户需要等待请求结束才可以关闭页面。对用户的体验不好。

方案2：发送异步请求，并且在服务端忽略ajax的abort
虽然异步请求会被浏览器abort，但是如果服务端可以忽略abort，仍然正常执行，也是可以的。比如PHP有ignore_user_abort函数可以忽略abort。这样需要改造后台，一般不太可行..

方案3：使用navigator.sendBeacon发送异步请求
根据MDN的介绍：

这个方法主要用于满足 统计和诊断代码 的需要，这些代码通常尝试在卸载（unload）文档之前向web服务器发送数据。过早的发送数据可能导致错过收集数据的机会。然而， 对于开发者来说保证在文档卸载期间发送数据一直是一个困难。因为用户代理通常会忽略在卸载事件处理器中产生的异步 XMLHttpRequest 。

从介绍上可以看出，这个方法就是用来在用户离开时发请求的。非常适合这种场景。 使用方式是这样的：

navigator.sendBeacon(url [, data]);
复制代码
sendBeacon支持发送的data可以是ArrayBufferView, Blob, DOMString, 或者 FormData 类型的数据。

下面是几种使用sendBeacon发送请求的方式，可以修改header和内容的格式，因为一般和服务器的通信方式都是固定的，如果修改了header或者内容，服务器就无法正常识别出来了。

（1）使用Blob来发送 使用blob发送的好处是可以自己定义内容的格式和header。比如下面这种设置方式，就是可以设置content-type为application/x-www-form-urlencoded。

blob = new Blob([`room_id=123`], {type : 'application/x-www-form-urlencoded'});
navigator.sendBeacon("/cgi-bin/leave_room", blob);
复制代码
image-20190211094506994
（2）使用FormData对象，但是这时content-type会被设置成"multipart/form-data"。

var fd = new FormData();
fd.append('room_id', 123);
navigator.sendBeacon("/cgi-bin/leave_room", fd);
复制代码
image-20190211094625904
（3）数据也可以使用URLSearchParams 对象，content-type会被设置成"text/plain;charset=UTF-8" 。

var params = new URLSearchParams({ room_id: 123 })
navigator.sendBeacon("/cgi-bin/leave_room", params);
复制代码
image-20190211095036518
通过尝试，可以发现使用blob发送比较方便，内容的设置也比较灵活，如果发送的消息抓包后发现后台没有识别出来，可以尝试修改内容的string或者header，来找到合适的方式发送请求。


https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/sendBeacon