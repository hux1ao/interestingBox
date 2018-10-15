// 注入到web页面中的脚本
window.onload = () => {
    const url = location.href;
    if (/list.html/.test(url)) { // 示例! 在这里通过正则匹配判断是列表页还是详情页
        // 如果当前页面是列表页
        // 获取当前页面的有效信息详情页入口,当前页面页码,下一列表页url,列表页总页码等,通过简单的DOM操作,具体过程略
        const data = {};
        // 将信息传递到background
        chrome.runtime.sendMessage({data, type: 'listPageInfo'});
    } else if (/detail.html/.test(url)) { // 示例! 匹配详情页url
        // 详情页页面内容
        const data = {};
        // 将信息传递到background
        chrome.runtime.sendMessage({data, type: 'detailPageInfo'});
    }
}