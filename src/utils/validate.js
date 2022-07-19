/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * @description 去空格
 * @param {string} value
 * @returns {string}
 */
export function replaceTrim(value) {
  if (value) {
    return value.replace(/\s/g, "")
  }
  return value;
}

/**
 * @description 中文横线替换为英文横线
 * @param {string} value
 * @returns {string}
 */
export function replaceChineseHLines(value) {
  if (value) {
    return value.replace(/——|-|—|－/g, "-")
  }
  return value;
}

/**
 * @description 正则校验
 * @param {RegExp} regExp
 * @param {string} value
 * @returns {Boolean}
 */
export function testByReg(regExp, value) {
  return regExp.test(value);
}

/**
 * @description 电子邮箱合法性校验
 * @param {string} value
 * @returns {Boolean}
 */
export function emailValidator(value) {
  const emailReg = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/;
  return testByReg(emailReg, value);
}

/**
 * @description 手机号码合法性校验
 * @param {string} value
 * @returns {Boolean}
 */
export function telephoneValidator(value) {
  const telReg = /^([1][3-9][0-9]{9})$/;
  return testByReg(telReg, replaceChineseHLines(replaceTrim(value)));
}

/**
 * @description 座机合法性校验
 * @param {string} value
 * @returns {Boolean}
 */
export function phoneValidator(value) {
  const telReg = /^(\d{7,8})|(\d{3,4}-?\d{7,8})$/;
  return testByReg(telReg, replaceChineseHLines(replaceTrim(value)));
}

/**
 * @description 发票税号合法性校验
 * @param {string} value
 * @returns {Boolean}
 */
export function taxNumberValidator(value) {
  const taxNumberReg = /^[0-9A-Z]{15,20}$/;
  return testByReg(taxNumberReg, replaceTrim(value));
}

/**
 * @description 银行账号合法性校验
 * @param {string} value
 * @returns {Boolean}
 */
export function bankAccountValidator(value) {
  const bankAccountReg = /^[0-9\-?]{9,30}$/;
  return testByReg(bankAccountReg, replaceChineseHLines(replaceTrim(value)));
}

