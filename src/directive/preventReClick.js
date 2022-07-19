// 阻止click事件重复提交
export default {
  inserted(el, binding, vnode) {
    el.addEventListener('click', e => {
      el.classList.add('is-disabled');
      el.disabled = true;
      setTimeout(() => {
        el.disabled = false;
        el.classList.remove('is-disabled');
      }, 3000)
    })
    }
}
