如何搭建一个方便工程使用的redux
===

使用方法：
---

* 获取数据：react-redux中connect函数，将store中数据挂载到props上。
* 更新数据：将我们申明的update方法挂载到props上，使用时直接this.update('example', ['path', 'path'], {});

以下做法的好处：
---

* 使用update函数，可以无副作用地更新store中指定数据
* 将store挂载到window上，可以在控制台直接查看store内部数据，方便调试。
* reducer拆分，可读性强


目录结构
---

在根目录下新建store文件夹，存放与redux相关的内容

文件夹store
* index.js
* init.js
* reducerCreater.js
* combineReducer.js

各部分源码示例
---

index.js
```
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import combineReducers from './combineReducers';

const store = createStore(combineReducers, compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f=>f
));

export default store;
```

拆分reducer, 并且，赋初始值。
init.js
```
(function () {
    HAuth = createReducer('HAuth', {
        isAuth: false,
        correct: {
            correctId: true,
            correctName: true,
        }
    });
}());
```

reducerCreater.js
```
import _set from 'lodash/set';
import _cloneDeep from 'lodash/cloneDeep';

/**
 * @param reducer  store.getState()获取的对象
 * @param initial  redux创建reducer时使用的初值
 * @returns {Function}
 */
export function createReducer(reducer, initial = {}) {
    return function (state = initial, action) {
        const UPDATE = `${reducer}UPDATE`; // 保证combineReducers组合后的reducer的action.type不会重复
        const route = action.route;
        const newData = action.newData;
        const isUpdate = action.isUpdate;
        switch (action.type) {
            case UPDATE:
                if(isUpdate) {
                    if(!route.length) { // route为空字符串或空数组时更新该reducer下整个store
                        return newData;
                    } else {
                        _set(state, route, newData);
                    }
                }
                return _cloneDeep(state);
            default:
                return state;
        }
    };
}

/**
 * 使用方法： update('example', 'attr1.a.a.a', undefined);
 * @param reducer  createReducer函数中的reducer
 * @param route  store.getState()获取的对象的要更改的属性，支持字符串和数组两种方式，对应lodash的set函数
 * @param newData  待赋的新值
 * @returns {{type: string, route: *, newData: *, isUpdate: boolean}}
 */
export function update(reducer, route, newData) {
    return (dispatch)=>{
        dispatch(
            {
                type: `${reducer}UPDATE`,
                route: route,
                newData: newData,
                isUpdate: true
            }
        );
    };
}
```
combineReducer.js
```
import {combineReducers} from 'redux';
import {
    tempReducer1,
    tempReducer2,
} from './init';

export default combineReducers({
    tempReducer1,
    tempReducer2,
});

```