(function () {
  var Tasks = function () {
    const settingForm = document.forms.settings,
    searchForm = document.forms.search,
    nav = document.querySelector('ul'),
    addForm = document.forms.add,
    // 通过hash值映射到tabIndex
    hashToIndex = {
      '#list': 0,
      '#add': 1,
      '#settings': 2
    },
    // 判断localStorage是否可用
    localStorageAvailable = ('localStorage' in window),
    indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB || false,
    IDBKeyRange = window.IDBKeyRange || window.webkitIDKeyRange || window.mozIDKeyRange || window.msIDKeyRange || false,
    // webSQL对象并未实现为window成员，可以侦察window成员的openDatabase是否存在以检测web sql
    webSQLSupport = ('openDatabase' in window)
    let db = null
    // ios端 上滑隐藏菜单栏
    let nudge = function () {
      setTimeout(function () {
        window.scrollTo(0, 0)
      }, 1000)
    }
    // 根据hash跳转
    let jump = () => {
      changeActive(location.hash)
      switch(location.hash) {
        case '#add':
          document.body.className = 'add'
          break
        case '#settings':
          document.body.className = 'settings'
          break
        default:
          document.body.className = 'list'
      }
    }
    let changeActive = (hash) => {
      let hashIndex = hashToIndex[hash] || 0
      const lis = nav.querySelectorAll('li')
      const liArr = Array.from(lis)
      let arr = [1, 2, 3]
      arr.forEach((val, index, self) => {
        if (index != hashIndex) {
          liArr[index].classList.remove('active')
        }
      })
      liArr[hashIndex].className = 'active'
      
    }
    // 载入用户设置
    let loadingSetting = () => {
      if (localStorageAvailable) {
        let name = localStorage.getItem('name'),
        colorScheme = localStorage.getItem('colorScheme'),
        nameDisplay = document.querySelector('#user_name'),
        title = document.querySelector('h1')
        nameFiled = settingForm.name
        if (name) {
          nameDisplay.innerHTML = name + "'s"
          nameFiled.value = name
        } else {
          nameDisplay.innerHTML = "My"
          nameFiled.value = ''
        }
        if (colorScheme) {
          title.className = colorScheme
        } else {
          title.className = 'white'
        }
      }
    }
    // 保存用户设置
    let saveSettings = (e) => {
      // 阻止默认事件发生
      e.preventDefault()
      if (localStorageAvailable) {
        let name = settingForm.name.value
        if (name.length > 0) {
          var colorScheme = settingForm.color_scheme.value
          localStorage.setItem('name', name)
          localStorage.setItem('colorScheme', colorScheme)
          loadingSetting()
          location.hash = "#list"
        }
      }
    }
    // 删除所有用户设置
    let resetSetting = (e) => {
      e.preventDefault()
      if (confirm('您确定清除所有用户设置？', '确定')) {
        if (localStorageAvailable) {
          localStorage.clear()
          dropDatabase()
        }
        loadingSetting()
        location.hash = "#list"
      }
    }
    let openDB = () => {
      // 判断是否支持indexedDB
      if (indexedDB) {
        // open是一个异步方法,当请求开始后,open会立刻返回一个IDBrequest对象，如果数据库不存在，则创建一个，然后创建一个与该数据库的连接
        const request = indexedDB.open('tasks', 1),
        upgradeNeeded = ('onupgradeneeded' in request)
        // 成功创建连接之后的回调函数
        request.onsuccess = function (e) {
          db = e.target.result
          // 如果upgradeNeeded事件不存在表示浏览器支持setVersion方法
          // 如果db.version不等于1，那么就表明不存在对象存储必须先创建对象存储,
          // 由于对象存储只有在版本号变更事物中才能创建,所以要增加当前数据库的版本号
          // 调用db.setVersion并将其中的版本参数设置成1
          if (!upgradeNeeded && db.version != '1') {
            var setVersionRequest = db.setVersion('1')
            setVersionRequest.onsuccess = function (e) {
              // createObjectStore 方法接受两个参数 第一个是仓库名 第二个是可选参数 keyPath 为主键
              var objectStore = db.createObjectStore('tasks', {
                // 主键名
                keyPath: 'id'
              })
              // creataIndex 方法接受三个参数，第一个参数为索引名，第二个为数据对象的属性，第三个为可选参数
              objectStore.createIndex('desc', 'descUpper', {
                unique: false
              })
              loadTasks()
            }
          } else {
            loadTasks()
          }
        }
        request.onerror = (e) => {
          console.log('数据库连接失败')
        }
        if (upgradeNeeded) {
          request.onupgradeneeded = function (e) {
            db = e.target.result
            var objectStore = db.createObjectStore('tasks', {
              keyPath: 'id'
            })
            objectStore.createIndex('desc', 'descUpper', {
              unique: false
            })
          }
        }
      // 判断是是否支持webSQL
      } else if (webSQLSupport) {
        db = openDatabase('tasks', '1.0', 'Task database', (5*1024*1024))
        db.transaction(function (tx) {
          const sql = 'CREATE TABLE IF NOT EXISTS tasks (' +
                    'id INTEGER PRIMARY KEY ASC,' +
                    'desc TEXT,' +
                    'due DATATIME,' +
                    'complete BOOLEAN' +
                  ')'
          tx.executeSql(sql, [], loadTasks)
        })
      }
    }
    let createEmptyItem = (query, taskList) => {
      var emptyItem = document.createElement('li')
      if (query.length > 0) {
        emptyItem.innerHTML = '<div class="item_title"></div>' + 
                              '没有搜索到未完成的任务' +
                              '</div>'
      } else {
        emptyItem.innerHTML = '<div class="item_title"></div>' + 
                              '没有任务可以展示<a href="#add">添加任务</a>' +
                              '</div>'
      }
      taskList.appendChild(emptyItem)
    }
    let showTask = (task, list) => {
      var newItem = document.createElement('li'),
      checked = (task.complete == 1) ? 'checked="checked"' : ''
      newItem.innerHTML = '<div class="item_complete">' +
                            '<input type="checkbox" name="item_complete" id=chk_'+
                            task.id+ " " + checked +
                            '>' +
                          '</div>' +
                          '<div class="item_body">' +
                            '<div class=item_title>' + task.desc + '</div>' +
                            '<div class=item_due>' + task.due + '</div>' +
                            '</div>' +
                          '<div class="item_delete">' +
                            '<a href="#" id=del_' + task.id + ' class="delete_button">删除</a>' +
                          '</div>'
      list.appendChild(newItem)
      let markAsComplete = (e) => {
        e.preventDefault()
        let updatedTask = {
          id: task.id,
          desc: task.desc,
          descUpper: task.desc.toUpperCase(),
          complete: e.target.checked
        }
        updateTask(updatedTask)
      }
      let remove = (e) => {
        e.preventDefault()
        if (confirm('确认删除该任务?', '删除')) {
          deleteTask(task.id)
        }
      }
      document.querySelector('#chk_' + task.id).onchange = markAsComplete
      document.querySelector('#del_' + task.id).onclick = remove
    }
    let loadTasks = (q) => {
      const taskList = document.querySelector('#task_list'),
      query = q || ''
      // 列表置空
      taskList.innerHTML = ''
      if (indexedDB) {
        var tx = db.transaction(['tasks'], 'readonly'),
            objectStore = tx.objectStore('tasks'),
            cursor,
            i = 0
        if (query.length > 0) {
          var index = objectStore.index('desc'),
            upperQ = query.toUpperCase(),
            keyRange = IDBKeyRange.bound(upperQ, upperQ + 'z')
          cursor = index.openCursor(keyRange)
        } else {
          cursor = objectStore.openCursor()
        }

        cursor.onsuccess = (e) => {
          var result = e.target.result
          if (result === null) return
          i++
          showTask(result.value, taskList)
          result['continue']()
        }

        tx.oncomplete = (e) => {
          if (i === 0) {
            createEmptyItem(query, taskList)
          }
        }
      } else if (webSQLSupport) {
        db.transaction((tx) => {
          let sql, args = []
          if (query.length > 0) {
            sql = 'SELECT * FROM tasks WHERE desc LIKE ?'
            args[0] = query + '%'
          } else {
            sql = 'SELECT * FROM tasks'
          }
          var iterateRows = (tx, results) => {
            var i = 0,
            len = results.rows.length
            for (; i<len;i++) {
              showTask(results.rows.item(i), taskList)
            } 
            if (len === 0) {
              createEmptyItem(query, taskList)
            }
          }
          tx.executeSql(sql, args, iterateRows)
        })
      }
    }
    let searchTasks = (e) => {
      e.preventDefault()
      var query = searchForm.query.value
      if (query.length > 0) {
        loadTasks(query)
      } else {
        loadTasks()
      }
    }
    let insertTask = (e) => {
      e.preventDefault()
      var desc = addForm.desc.value,
      dueDate = addForm.due_date.value
      if (!dueDate || !desc) {
        alert('请将描述,时间填写完整')
        return
      } 
      if (desc && dueDate) {
        var task = {
          id: new Date().getTime(),
          desc: desc,
          // ??????
          descUpper: desc.toUpperCase(),
          due: dueDate,
          complete: false
        }
      }
      if (indexedDB) {
        let tx = db.transaction(['tasks'], 'readwrite')
        var objectStore = tx.objectStore('tasks')
        var request = objectStore.add(task)
        tx.oncomplete = updateView
      } else if (webSQLSupport) {
        db.transaction ((tx) => {
          let sql = 'INSERT INTO tasks (desc, due, complete)' +
                    'VALUES (?,?,?)',
          args = [task.desc, task.due, task.complete]
          tx.executeSql(sql, args, updateView)
        })
      }
    }
    let updateView = () => {
      loadTasks()
      addForm.desc.value = ''
      addForm.due_date.value = ''
      location.hash = '#list'
    }
    let updateTask = (task) => {
      if (indexedDB) {
        let tx = db.transaction(['tasks'], 'readwrite')
        let objectStore = tx.objectStore('tasks')
        let request = objectStore.put(task)
      } else if (webSQLSupport){
        let complete = (task.complete) ? 1: 0
        db.transaction((tx) => {
          let sql = 'UPDATE tasks SET complete = ? WHERE id =?',
          args = [complete, task.id]
          tx.executeSql(sql, args)
        })
      }
    }
    let deleteTask = (id) => {
      if (indexedDB) {
        let tx = db.transaction(['tasks'], 'readwrite')
        let objectStore = tx.objectStore('tasks')
        var request = objectStore.delete(id)
        tx.oncompelete = loadTasks
      } else if (webSQLSupport) {
        db.transaction((tx) => {
          let sql = 'DELETE FROM tasks WHERE id = ?',
              args = [id]
          tx.executeSql(sql, args)
        })
      }
      updateView()
    }
    let dropDatabase = () => {
      if (indexedDB) {
        let delDBRequest = indexedDB.deleteDatabase('tasks')
        delDBRequest.onsuccess = window.location.reload()
      } else if (webSQLSupport) {
        db.transaction((tx) => {
          let sql = 'DELETE FROM tasks'
          tx.executeSql(sql, [], loadTasks)
        })
      }
    }
    openDB()
    loadingSetting()
    jump()
    searchForm.addEventListener('submit', searchTasks, false)
    window.addEventListener('hashchange', jump, false)
    window.addEventListener('orientationchange', nudge, false) // 移动设备方向转动
    addForm.addEventListener('submit', insertTask, false)
    settingForm.addEventListener('submit', saveSettings, false)
    settingForm.addEventListener('reset', resetSetting, false)
    // nav.addEventListener('click', changeActive, true)
    if ('applicationCache' in window) {
      var appCache = window.applicationCache
      appCache.addEventListener('updateready', function () {
        appCache.swapCache()
        if (confirm('应用可以更新，师傅现在更新')) {
          window.location.reload()
        }
      }, false)
    }
  }
  window.addEventListener('load', function () {
    new Tasks();
  })
})()