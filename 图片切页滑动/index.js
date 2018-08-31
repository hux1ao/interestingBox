const cardWrapper = document.querySelectorAll('.card-wrapper');
const touchInfo = {
    begin: {
        x: '',
        y: ''
    },
    end: {
        x: '',
        y: ''
    }
}
Array.from(cardWrapper).map((item, index) => {
    item.addEventListener('touchstart', (e) => {
        const {pageX, pageY} = e.targetTouches[0];
        touchInfo.begin = {
            x: pageX,
            y: pageY
        }
    })
    item.addEventListener('touchend', (e) => {
        const {pageX, pageY} = e.changedTouches[0];
        touchInfo.end = {
            x: pageX,
            y: pageY
        }
        item.style['transform'] = `translate3d(${touchInfo.begin.x - touchInfo.end.x}, 0, 0)`
    })
});