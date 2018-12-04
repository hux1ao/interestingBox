addEventListener用法
---

四个参数
---

* type
表示监听事件类型的字符串。
* listener
当所监听的事件类型触发时，会接收到一个事件通知（实现了 Event 接口的对象）对象。listener 必须是一个实现了 EventListener 接口的对象，或者是一个函数。
* options 可选
一个指定有关 listener 属性的可选参数对象。可用的选项如下：
* capture:  Boolean，表示 listener 会在该类型的事件捕获阶段传播到该 EventTarget 时触发。
   * once:  Boolean，表示 listener 在添加之后最多只调用一次。如果是 true， listener 会在其被调用之后自动移除。
   * passive: Boolean，表示 listener 永远不会调用 preventDefault()。如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。
   * mozSystemGroup: 只能在 XBL 或者是 Firefox' chrome 使用，这是个 Boolean，表示 listener 被添加到 system group。
* useCapture  可选 Boolean.
是指在DOM树中，注册了该listener的元素，是否会先于它下方的任何事件目标，接收到该事件。沿着DOM树向上冒泡的事件不会触发被指定为use capture（也就是设为true）的listener。当一个元素嵌套了另一个元素，两个元素都对同一个事件注册了一个处理函数时，所发生的事件冒泡和事件捕获是两种不同的事件传播方式。事件传播模式决定了元素以哪个顺序接收事件。如果没有指定， useCapture 默认为 false 。 

思考
---

* 如果点击c或者b，输出什么?（答案是a1、a3）
stopImmediatePropagation包含了stopPropagation的功能，即阻止事件传播（捕获或冒泡），但同时也阻止该元素上后来绑定的事件处理程序被调用，所以不输出 a4。因为事件捕获被拦截了，自然不会触发 b、c 上的事件，所以不输出 b、c1、c2，冒泡更谈不上了，所以不输出 a2。

* 如果点击a，输出什么?（答案是 a1、a2、a3）
不应该是 a1、a3、a2 吗？有同学就会说：“a1、a3可是在捕获阶段被调用的处理程序的，a2 是在冒泡阶段被调用的啊。”这正是要说明的：虽然这三个事件处理程序注册时指定了true、false，但现在事件流是处于目标阶段，不是冒泡阶段、也不是捕获阶段，事件处理程序被调用的顺序是注册的顺序。不论你指定的是true还是false。换句话来说就是现在点击的是a这个盒子本身，它处于事件流的目标状态，而既非冒泡，又非捕获。（需要注意的是，此时的eventPhase为2，说明事件流处于目标阶段。当点击a的时候，先从document捕获，然后一步步往下找，找到a这个元素的时候，此时的target和currentTarget是一致的，所以认定到底了，不需要再捕获了，此时就按顺序执行已经预定的事件处理函数，执行完毕后再继续往上冒泡...）

* 如果注释掉event.stopImmediatePropagation，点击c，会输出什么？（答案是 a1、a3、a4、b、c1、c2、a2）
如果同一个事件处理程序（指针相同，比如用 handler 保存的事件处理程序），用 addEventListener或 attachEvent绑定多次，如果第三个参数是相同的话，也只会被调用一次。当然，如果第三个参数一个设置为true，另一个设置为false，那么会被调用两次。 
而在这里，都是给监听函数的回调赋予了一个匿名函数，所以其实每个处理函数都会被调用。需要注意的是，如果你还不明白为什么在c上触发的先是c1再是c2的话，那么你就需要在去看看第二个问题锁描述的内容了。

参考： 
* [你真的理解事件冒泡和事件捕获吗？](https://segmentfault.com/a/1190000012729080)
* [mdn](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)