/**
 * @file decorator-urlSync
 * @author Cuttle Cong
 * @date 2018/3/9
 * @description
 */
import { urlSync, registerUrlSync, bindView } from '../src/decorator'
import h from '../src/renderer/mixedRenderer'
import { Root } from '../src/Model'
import RouterV3 from '../srcPackages/RouterV3'
import * as React from 'react'
import ReactDOM from 'react-dom'
import { hashHistory } from 'react-router'
import { stringify as oStringify, parse as oParse } from 'qs'
function stringify(obj) {
  return '?' + oStringify(obj)
}

const mockDelay = () => new Promise(resolve => {
  setTimeout(resolve, 500)
})

function parse(string = '') {
  string = string.trim()
  if (string.startsWith('?')) {
    string = string.substring(1)
  }
  return oParse(string)
}

describe('decorator-urlSync', function () {
  let vm, dom, clone

  class View extends React.Component {
    render() {
      return null
    }
  }
  @bindView(View)
  class App extends Root {
    @urlSync
    str = 'str'
    @urlSync
    num = 1.23
    @urlSync
    int = 4
    @urlSync
    obj = {
      val: 'val',
      arr: [1, 2, '45'],
      o: {
        a: 'a'
      }
    }
    @urlSync
    arr = [{ a: 'a' }, 'b']
    @urlSync
    root = Root.create({
      ra: { a: 'ra' },
      va: [{ a: 'ra' }],
      str: 'str'
    })
  }

  beforeEach(() => {
    dom = document.createElement('div')
    registerUrlSync(hashHistory)
  })
  test('decorator-urlSync simple', async (done) => {
    class Simple extends App {
      init() {
        expect(hashHistory.getCurrentLocation().search)
          .toEqual(
            expect.stringContaining(stringify({
              int: 5,
              num: 1.23,
              str: 'xxx'
            }))
          )
      }
    }
    vm = Simple.create()
    let root = vm.root
    let arr = vm.arr
    let obj = vm.obj
    expect(vm.toJSON().root instanceof Root).toBe(false)
    expect(root).toBe(vm.root)
    hashHistory.push({
      pathname: '/',
      query: null,
      search: stringify({
        int: 5,
        num: 1.23,
        str: 'xxx',
        arr: [{ a: 'abc' }]
      })
    })

    ReactDOM.render(
      <RouterV3 history={hashHistory} routes={{ path: '/', component: vm }}/>,
      dom
    )
    await mockDelay()
    expect(vm.int).toBe(5)
    expect(vm.num).toBe(1.23)
    expect(vm.num).not.toBe('1.23')
    expect(vm.str).toBe('xxx')
    expect(vm.arr).toEqual([{ a: 'abc' }])
    expect(vm.arr.length).toBe(1)
    expect(vm.arr).toBe(arr)


    hashHistory.push({
      pathname: '/',
      query: null,
      search: stringify({
        arr: [{ b: 'c' }, 4]
      })
    })
    await mockDelay()
    await mockDelay()
    expect(vm.arr).toEqual([{ a: 'abc', b: 'c' }, '4'])
    expect(vm.arr).toBe(arr)
    done()
  })
})
