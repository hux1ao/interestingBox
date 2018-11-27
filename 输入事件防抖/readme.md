输入事件防抖
===


遇到的问题：根据用户的输入值请求后端接口。因为用户两次输入间隔很短，两次响应回来的先后顺序可能会出错乱，导致页面展示的结果可能并不是按照输入框的内容搜索的。

![](../img/输入事件防抖.png '描述')

代码：
    js部分：
    onChange= (value) => {
        this.setState({value});
        this.props.matchValue(value);
    };
    jsx部分：
    <SearchBar
        value={this.state.value}
        ref={(ref) => {
            this.autoFocusInst = ref;
        }}
        onChange={this.onChange}
        cancelText=" "
    />

思路： 需要有一种方法，确保使用最后一次输入结果请求后端接口。

参考： [防抖与节流](https://segmentfault.com/a/1190000012066399)

最终代码
```
    let timer;
    const input = document.querySelector('#input');
    input.addEventListener('input', () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
            console.log(input.value);
        }, 100)
    })
```