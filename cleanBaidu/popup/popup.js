window.onload = function () {
    const trueButton = document.querySelector('#button-wrapper-true');
    const falsebutton = document.querySelector('#button-wrapper-false');
    trueButton.addEventListener('click', function () {
        chrome.runtime.sendMessage({
            type: 'turnOn',
        });
    })
    falsebutton.addEventListener('click', function () {
        chrome.runtime.sendMessage({
            type: 'turnOff',
        });
    })
}