const recommend = document.querySelector('#s_wrap');
const s_form_wrapper = document.querySelector('#s_form_wrapper');
chrome.runtime.onMessage.addListener(function(request) {
    const type = request.type;
    switch (type) {
        case 'turnOn':
            recommend.style.display = 'none';
            s_form_wrapper.style['margin-top'] = '30%';
            break;
        case 'turnOff':
        
            break;
    }
})