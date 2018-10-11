window.onload = () => {
    const url = location.href;
    const html = document.querySelector('html');
    console.log(`我当前处在${url}`);
    console.log(`当前界面内容有${html.innerHTML}`)
}