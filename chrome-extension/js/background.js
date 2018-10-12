console.log('这是常驻的后台页面')
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request)
        sendResponse('收到消息啦!')
    }
);