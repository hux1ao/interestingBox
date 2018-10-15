window.onload = () => {
    const button = document.querySelector('#button');
    button.addEventListener('click', () => {
        // 传递到background的内容
        const data;
        chrome.runtime.sendMessage({
            type: 'openNewWindow',
            data
        });
    })
}