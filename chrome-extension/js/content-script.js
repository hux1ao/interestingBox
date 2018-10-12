window.onload = () => {
    const url = location.href;
    if (/www.baidu.com/.test(url)) { // 当前页面是列表页
        const detailPageItem = document.querySelectorAll('.result'); // 详情页集合
        const detailPageHrefList = []; //详情url列表
        detailPageItem.forEach(val => {
            const a = val.querySelector('.t, a');
            const href = a.getAttribute('href');
            detailPageHrefList.push(href)
        })
        console.log(detailPageHrefList)
    }
}