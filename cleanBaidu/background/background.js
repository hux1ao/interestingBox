chrome.runtime.onMessage.addListener(function(request) {
    const type = request.type || '';
    console.log(request.type);
    switch (type) {
        case 'turnOn':
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                tabId = tabs[0].id;
                chrome.tabs.sendMessage(tabId, {type: 'turnOn'});
            });
            break;
        case 'turnOff':
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                tabId = tabs[0].id;
                chrome.tabs.sendMessage(tabId, {type: 'turnOn'});
            });
            break;
        default:
            console.log(3333);
    }
})