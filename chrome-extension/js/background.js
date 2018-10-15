// 当前爬虫需要爬取的tab 的id
var scrapingTabId = '';
// 爬虫需要爬取的url集合, 一个列表页中的item
var urlToBeScrpied = [];
// 爬取当前url在urllist中的位置
var currentUrlIndex = 0;
// 下一个列表页的url
var nextPageUrl = '';
// 监听来自extension的消息
chrome.runtime.onMessage.addListener(function(request) {
    if (!request) {
        return;
    }
    // 传递过来消息的类型
    const type = request.type;
    // 传递过来的数据
    const data = request.data;
    // 根据不同的type,做出不同的处理,比如列表页爬取完成之后,该做些什么?详情页爬取完成之后,该做些什么?
    switch (type) {
        // 列表页传来的数据
        case 'listPageInfo':
            urlToBeScrpied = data.hrefList;
            // 确保传递过来的urlToBeScrpied一定是一个数组
            if (!Array.isArray(urlToBeScrpied)) {
                return;
            }
            nextPageUrl = data.nextPageUrl;
            const isLastPage = data.isLastPage;
            // 判断beginScraping是否为true,如果为false则当前页面爬取完成之后停止爬取
            // 因为beginScraping值作用于列表页,不作用于详情页
            // 当下一列表页收到该值时,则停止爬取
            if (isLastPage) {
                chrome.storage.local.set({beginScraping: false}, function () {
                    console.log('当前列表抓取完成之后停止抓取');
                });
            }
            startScraping();
            break;
        case 'detailPageInfo':
            // 收到广播代表当前详情页已经爬完
            chrome.storage.local.get(null, function (result) {
                // 需要传递给后端的参数
                const params = {
                };
                // 传递动作
                $.post('', params);
                // 可以开始爬取下一页
                // 判断当前是否是urllist中的最后一条
                console.log('第' + currentUrlIndex + '条爬取完成');
                const urlListLength = urlToBeScrpied.length;
                if (!urlListLength) {
                    return;
                }
                // 如果是最后一条,则进入下一列表页
                // 如果不是最后一条,则继续爬取urllist中的下一条
                if (urlListLength > currentUrlIndex + 1) {
                    // 下一页
                    currentUrlIndex = currentUrlIndex + 1;
                    walkHrefList(urlToBeScrpied[currentUrlIndex], 1500, scrapingTabId);
                } else {
                    // 当nextPageUrl为null的时候,表示当前列表页已经为最后一个列表页
                    if (nextPageUrl) {
                        walkHrefList(nextPageUrl, 1500, scrapingTabId);
                    } else {
                        console.log('停止抓取');
                    }
                }
            });
            break;
        // 从popup传递来的消息
        case 'openNewWindow':
            var data = request.data;
            if (!data) {
                return;
            }
            // 获取需要爬取的url
            var thirdSearchUrl = data.thirdSearchUrl;
            if (!thirdSearchUrl) {
                return;
            }
            // 新建一个窗口,窗口打开当前url
            // focused为true时,抽口会默认弹到顶层,确保tabs[0]能够获取到当前tab
            chrome.windows.create({url: thirdSearchUrl, focused: true}, function () {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    // 获取执行爬虫操作的tabid,并存在全局作用域中
                    scrapingTabId = tabs[0].id;
                });
                // 开始爬虫
                chrome.storage.local.set({beginScraping: true}, function () {
                    console.log('开始爬取');
                });
            });
            break;
        default:
            return false;
    }
})
function startScraping () {
    // 如果获取不到当前爬虫程序的tab,则不做任何操作
    if (!scrapingTabId) { return; }
    // 开始爬取urllist中的第一条记录
    currentUrlIndex = 0;
    walkHrefList(urlToBeScrpied[0], 1500, scrapingTabId);
}
// 遍历详情页
// href 详情页url
// inteval 遍历间隙
// scrapingTabId 执行爬虫的tabid
function walkHrefList (href, interval, scrapingTabId) {
    window.setTimeout(function () {
        // 判断当前tab是否存在
        chrome.tabs.get(scrapingTabId, function (tab) {
            // 如果当前tab不存在 则表示当前tab被关闭,告诉程序,停止爬取
            if (!tab) {
                return chrome.storage.local.set({beginScraping: false}, function () {
                    console.log('停止抓取');
                });
            }
            // 跳转到当前页面
            chrome.tabs.update(scrapingTabId, {url: href});
        });
    }, interval);
}
