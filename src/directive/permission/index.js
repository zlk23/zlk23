import hasRole from './hasRole'
import hasPermi from './hasPermi'
import preventReClick from '../preventReClick'

const install = function(Vue) {
  Vue.directive('hasRole', hasRole)
  Vue.directive('hasPermi', hasPermi)
  Vue.directive('preventReClick', preventReClick)
}

if (window.Vue) {
  window['hasRole'] = hasRole
  window['hasPermi'] = hasPermi
  window['preventReClick'] = preventReClick
  alert(window['hasPermi']);
  Vue.use(install); // eslint-disable-line
}

export default install
