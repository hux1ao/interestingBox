/**
 * Created by bingo on 2017/6/8.
 */
export function _isType (t) {
  return Object.prototype.toString.call(t).slice(8, -1).toLowerCase()
}
export function _setLS (key, value) {
  if (_isType(value) === 'string') {
    sessionStorage.setItem(key, value)
  } else {
    let Info = JSON.stringify(value)
    sessionStorage.setItem(key, Info)
  }
}
export function _getLS (item) {
  return sessionStorage.getItem(item)
}

export function _clearLS () {
  sessionStorage.clear()
}
export function _backRoute (value) {
  if (value === 1) {
    return 'Index'
  } else if (value === 2) {
    return 'Index'
  } else if (value === 3) {
    return 'Index'
  }
}
export function isIdCard (str) {
  return str && !/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(str)
}
export function is20 (str) {
  return str && !/^.{0,20}$/.test(str)
}
export function is50 (str) {
  return str && !/^.{0,50}$/.test(str)
}
export function isOfficePhone (str) {
  return str && !(/^1[34578]\d{9}$/.test(str) || /^((\d{3,4}-)|\d{3,4}-)?\d{7,8}$/.test(str))
}
export function isMobile (str) {
  return str && !/^1[34578]\d{9}$/.test(str)
}
export function isEmail (str) {
  return !/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(str)
}
export function isWeChat (str) {
  return str && !/^[A-Za-z0-9]+$/.test(str)
}
export function isQQ (str) {
  return str && !/^[1-9][0-9]{4,19}$/.test(str)
}
export function isPostCode (str) {
  return str && !/^\d{6}$/.test(str)
}
export function isNum (str) {
  return str && !/^[1-9][0-9]{0,4}$/.test(str)
}
export function contentHeightAutoResize () {
  let contentDivs = document.querySelectorAll('.container-info')
  if (!contentDivs) return
  // 获取可视区域高度
  const clientHeight = document.body.clientHeight || document.body.offsetHeight
  // console.log(clientHeight)
  const computedHeight = clientHeight - 205
  contentDivs.forEach((e, i, s) => {
    e.style.height = computedHeight + 'px'
  })
}
export const Reg = {
}
