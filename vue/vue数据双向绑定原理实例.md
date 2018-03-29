构建一个基于数据双向绑定原理的应用
=====
####首先，这一切都是基于我们能够实时监听到数据变化，并根据变化做出实时响应

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
          console.log('正在获取' + key)
          return val
        },
        set: (newVal) => {
          val = newVal
          console.log('正在设置' + key + '值为' +  newVal)
        }
      })
    }
```
该方法的作用是可以将传递过来的```obj[key]```设置为可观测的,我们需要将实例中```_data```的所有属性变为可监测的
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
      val = newVal
      data._data[key] = newVal
    }
  })
}
```
该函数依然只完成了对```data[key]```中一个值的代理,我们需要为_data中所有值都代理到实例上
```
Object.keys(option.data).forEach(val => {
  this.setProxy(this, val)
})
```
到现在,我们已经可以通过实例获取_data中的值了。
到现在,我们可以手动一下,
```
let vue = new Vue({
    data: {
      heroName: 'peter'
    },
    el: '#app'
  })
  console.log(vue.heroName)
  vue.heroName = 'hero'
```
得到的结果是
```
正在获取heroName
peter
正在设置heroName值为hero
正在获取heroName
peter
```
目前我们的第一步已经完成了
####但是，监听到数据变动之后,我们该继续做些什么呢
我们希望我们对实例的```hero```属性的修改能直观地展示在页面上，实现view-model的同步
那么在```HTML```中添加
```
  <div id="app">
    <div>
      <p class="title">我的英雄是</p>
      <p v-text="heroName" class="content"></p>
    </div>
  </div>
```
在vue的构造函数中,我们要让实例关联到这个id为add的div
```
constructor (option) {
  this._data = option.data
  this.$el = document.querySelector(option.el)
  this.observerable(this._data)
  Object.keys(option.data).forEach(val => {
    this.setProxy(this, val)
  })
}
```
到现在，实例的```$el```属性已经关联了```#app```div我们还需要一个渲染函数,将实例中的内容渲染到页面中。
```
_bindText () {
  this.queryText(this.$el)
}
_render () {
  this._bindText()
}
queryText (node) {
  let textList = node.querySelectorAll('[v-text]')
  let makedArr = Array.from(textList)
  makedArr.forEach(val => {
    let attribute = val.getAttribute('v-text')
    val.innerHTML = this._data[attribute]
  })
}
```
现在我们可以手动修改实例属性,并调用渲染函数,就可以在页面观察到model-view的变化
```
let vue = new Vue({
  data: {
    heroName: 'peter'
  },
  el: '#app'
})
window.setTimeout(() => {
  vue.heroName = 'tom'
  vue._render()
}, 2000)
```
但是,这又衍生出另外一个问题,平时使用的```mvvm```框架中,我们并没有手动调用```render```方法啊,我们如何做到监听到数据的变动,程序就自动渲染页面呢？

可以想到，我们需要一个监听