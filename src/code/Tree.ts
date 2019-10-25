import { getElement } from '../utils/index'

export interface dataInfo {
  label: string
  children?: dataInfo[]
}

export interface Options {
  data: dataInfo[]
}

export interface TreeInter {
  render: () => void
}

class Tree implements TreeInter {
  private data: dataInfo[]
  private options: Options
  private container: HTMLElement
  constructor(options: Options) {
    this.options = options
    this.data = this.options.data
    this.container = this.getContainer()
    this.container.innerHTML = this.dataToTree(this.data)
    document.querySelector('.box-demo').appendChild(this.container)
    this.init()
  }

  private init() {
    let switchers = this.container.querySelectorAll('span.tree-switcher__open,span.tree-switcher__close')
    Array.from(switchers).forEach(switcher => {
      switcher.addEventListener('click', evt => {
        if (switcher.className.indexOf('tree-switcher__open') > 0) {
          switcher.className = 'tree-switcher tree-switcher__close';
          (switcher.parentNode as HTMLElement).classList.replace('tree-treenode__switcher--open', 'tree-treenode__switcher--close')
        } else {
          switcher.className = 'tree-switcher tree-switcher__open';
          (switcher.parentNode as HTMLElement).classList.replace('tree-treenode__switcher--close', 'tree-treenode__switcher--open')
        }
      })
    })
  }

  private getContainer(): HTMLElement {
    const ul = document.createElement('ul')
    ul.className = 'tree'
    return ul
  }

  private dataToTree(data: dataInfo[]) {
    let icon = `
      <i>
        <svg viewBox="0 0 1024 1024" focusable="false" data-icon="caret-down" width="1em" height="1em"
          fill="currentColor" aria-hidden="true">
          <path
            d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z">
          </path>
        </svg>
      </i>
    `
    let treenode = ''

    data.forEach(node => {
      let children = node.children ? this.dataToTree(node.children) : ''
      treenode += `
        <li class="tree-treenode__switcher--open">
          <span class="tree-switcher ${ children ? 'tree-switcher__open' : 'tree-switcher__noop'}">
            ${ children ? icon : ''}
          </span>
          <span class="tree-node__content-wrapper tree-node__content-wrapper--open">
            <span>${node.label}</span>
          </span>
          ${ children ? `<ul>${children}</ul>` : ''}
        </li>
      `
    })
    return treenode
  }

  render() {
    return `<ul class="tree">${this.dataToTree(this.data)}</ul>`
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let tree = new Tree({
  data: [
    {
      label: '节点0',
      children: [
        {
          label: '节点0-1',
        },
        {
          label: '节点0-2',
        },
        {
          label: '节点0-3',
          children: [
            {
              label: '节点0-3-0'
            }
          ]
        }
      ]
    },
    {
      label: '节点1',
      children: [
        {
          label: '节点1-1'
        }
      ]
    },
    {
      label: '节点2'
    }
  ]
})
