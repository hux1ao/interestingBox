构建一个基于数据双向绑定原理的应用
=====
首先，这一切都是基于我们能够实时监听到数据变化，并根据变化做出实时响应
---
构建一个```defineReactive```函数
1. 函数参数解释
  * ```Obj``` => 传过来的实例
  * ```key``` => 实例中_data属性的键
  * ```val``` => 实例中_data属性的值
2. 函数解释
  * 通过```Object.defineProperty```对```_data[key]```设置为可以响应的
  * ```descriptor```中的```get```用来监听取值操作
  * ```descriptor```中的```set```用来监听赋值操作

tip:
当且仅当该属性的 ```configurable``` 为 ```true``` 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认为 ```false```。
```
definedReactive (obj, key, val) {
      const dep = new Dep()
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: () => {
          if (Dep.target && dep.subs.indexOf(Dep.target) === -1) {
            dep.add(Dep.target)
          }
          return val
        },
        set: (newVal) => {
          val = newVal
          dep.notify()
        }
      })
    }
```
这段代码的作用是可以将传递过来的```obj[key]```设置为可观测的,下边，我们需要完成一个可以将实例中```_data```的所有属性变为可监测的函数
```
observerable (obj) {
  Object.keys(obj).forEach(val => {
    this.definedReactive(obj, val, obj[val])
  })
}
```
我们只需要在构造函数中调用该函数，实例中_data的所有属性就都编程可监测的了
```
constructor (option) {
  this._data = option.data
  this.observerable(this._data)
}
```
好啦,现在实例中```_data```的所有属性的修改,赋值,获取我们都能够相应的监听到了！
但是，在```vue```中我们要使用```data```中的```xxx```属性并不是像这样:```this._data.xxx```,而是直接```this.xxx```就可以访问到该属性。
那么，我们如何实现在直接在实例中访问到```_data```的属性呢?

函数解释
* 我们仍然通过```Object.defineProperty```实现一层代理功能,在获取实例上的xxx值的时候,我们将```_data```中的值返回,设置时也同理
```
setProxy (data, key) {
  Object.defineProperty(data, key, {
    enumerable: true,
    get: () => {
      return data._data[key]
    },
    set: (newVal) => {
      data._data[key] = newVal
    }
  })
}
```
该函数依然只完成了对```data[key]```中一个值的代理,我们需要为_data中所有值都达到该效果,所以我们还需要在构造函数中添加一行代码
```
Object.keys(option.data).forEach(val => {
  this.setProxy(this, val)
})
```