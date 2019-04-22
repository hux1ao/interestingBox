// 实现async/await 中的async
// async到底干什么了？ 把函数的返回值变成了一个promise
// async function aaa () {} 等同于 function aaa () { return spawn(function * () {})}
// spawn 是什么

function spawn (genf) {
    return new Promise(function (resolve, reject) {
        const gen = genf();
        step(function () {
            return gen.next()
        })
        function step (nextFunction) {
            
        }
    })
}
