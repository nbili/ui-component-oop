import { getElement, assert } from '../utils'

type Options = {
  step?: number
  percent?: number
}

function fixPercent(val: number) {
  val = val > 100 ? 100 : val
  val = val < 0 ? 0 : val
  return val
}

class Progress {
  container: HTMLElement
  options: Options
  step: number
  percent: number
  dasharray: number
  r: number
  constructor(el: HTMLElement | string, options?: Options) {
    this.container = getElement(el)
    this.options = Object.assign({ step: 1, percent: 0 }, options)
    this.step = this.options.step
    this.r = 74
    this.percent = parseFloat(fixPercent(this.options.percent).toFixed(2))
    this.container.innerHTML = this.render()
  }
  getValue() {
    return this.percent
  }
  setValue(val: number) {
    this.percent = parseFloat(fixPercent(val).toFixed(2))
    let progressActive = this.container.querySelector('.progress-circle__active')
    progressActive.setAttribute('stroke-dasharray', `${this.getDasharray()} 999`)
  }
  getDasharray() {
    return (2 * Math.PI * this.r) * 0.01 * this.percent
  }

  render() {
    return `
      <svg class="progress-circle" width="200px" height="200px">
        <circle class="progress-circle__bg" cx="80" cy="80" r="${this.r}" fill="none" stroke="#f3f3f3" stroke-width="10px">
        </circle>
        <circle class="progress-circle__active" cx="80" cy="80" r="74" fill="none" stroke="rgb(16, 142, 233)"
          stroke-width="10px" stroke-dasharray="${this.dasharray} 999" stroke-dashoffset="0">
        </circle>
      </svg>
    `
  }
}

const p = new Progress('.progress')
p.setValue(69.663)

let progress = document.querySelector('.progress') as HTMLElement

progress.onclick = function () {
  p.setValue(Math.random() * 100)
}
