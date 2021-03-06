/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/2/14
 * @description
 */

export h from './renderer/mixedRenderer'
export { observable, action, computed }  from 'mobx'
export * from './decorator/index'

export * from './Model'
export symbolicLink from './utils/symbolicLink'
export { isViewModelComponent } from './decorator/modelComp'
export providerFactory from './extension/providerFactory'
export { version } from '../package.json'
