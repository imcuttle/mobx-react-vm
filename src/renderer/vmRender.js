/**
 * @file model-renderer-v2.js
 * @author Liang
 */

import h from './reactHyper'
import logger from '../utils/logger'

/**
 *
 * @def: DevPattern.renderer: (model, props, ...children) => ReactElem
 *  model: ViewModelInstance
 *
 *      // 用于默认渲染该 model
 *      defaultComp: ReactClass
 *
 *  // 额外的用于 react 渲染的 props
 *  props: {} | undefined
 *
 *      // 可被用来替换掉 model.defaultComp, 代替它渲染当前 viewModel
 *      comp: ReactClass
 *
 *  // 子 elems
 *  children: ReactElem...
 */
export default function renderer(model, props = {}, ...children) {
  if (!model) {
    return null
  }
  props = props || {}
  const Comp = props.comp || model.constructor.defaultComp
  if (!Comp) {
    logger.warn('The model can\'t find matching Component, please check it out. ', model)
    return null
  }

  if (!Object.isExtensible(props)) {
    props = { ...props }
  }
  props.local = model
  props.key = props.key || model.viewId

  return h(Comp, props, ...children)
}
