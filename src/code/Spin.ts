import { getElement } from '../utils'

export type Options = {
  delay: number
  size: 'default' | 'large'
  spinning: boolean
}

class Spin {
  container: HTMLElement
  options: Partial<Options>
  size: Options['size']
  delay: Options['delay']
  spinning: Options['spinning']

  constructor(el: HTMLElement | string, options?: Partial<Options>) {
    this.container = getElement(el)
    this.options = Object.assign({ delay: 0, size: 'default', spinning: true }, options)
    this.size = this.options.size
    this.delay = this.options.delay
    this.spinning = this.options.spinning
    this.toRender()
  }

  show() {
    this.toRender()
    this.spinning = true
  }

  hide() {
    this.toRender(true)
    this.spinning = false
  }

  toRender(isEmpty = false) {
    if (this.delay) {
      setTimeout(() => {
        this.container.innerHTML = isEmpty ? '' : this.render()
      }, this.delay);
    } else {
      this.container.innerHTML = isEmpty ? '' : this.render()

    }
  }
  render() {
    let size = this.size
    return `
      <div class="spin-spinning ${size === 'large' ? 'spin-lg' : 'spin'}">
        <span class="spin-dot spin-to-spin">
          <i class="spin-dot__item"></i>
          <i class="spin-dot__item"></i>
          <i class="spin-dot__item"></i>
          <i class="spin-dot__item"></i>
        </span>
      </div>
    `
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const spin1 = new Spin('#box1', { size: 'default' })

const box1 = document.querySelectorAll('.box-demo')[0] as HTMLElement

box1.onclick = function () {
  if (spin1.spinning) {
    spin1.hide()
  } else {
    spin1.show()
  }
}

const spin2 = new Spin('#box2', { size: 'large', delay: 1000 })

const box2 = document.querySelectorAll('.box-demo')[1] as HTMLElement

box2.onclick = function () {
  if (spin2.spinning) {
    spin2.hide()
  } else {
    spin2.show()
  }
}
