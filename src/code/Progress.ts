import { getElement } from '../utils'

type Options = {
  step?: number
  percent?: number
  color?: string
}

type Hanlder = (percent: number) => void

type Plugins = {
  render: (percent: number) => string,
  action: (slider: Progress, controller: HTMLElement) => void
}

function fixPercent(val: number) {
  val = val > 100 ? 100 : val
  val = val < 0 ? 0 : val
  return val
}

class Progress {
  private container: HTMLElement
  private options: Options
  private step: number
  private percent: number
  private color: string
  private r: number
  private compelteHanlders: Hanlder[]
  constructor(el: HTMLElement | string, options?: Options) {
    this.container = getElement(el)
    this.options = Object.assign({ step: 1, percent: 0, color: 'rgb(16, 142, 233)' }, options)
    this.step = this.options.step
    this.r = 80
    this.color = this.options.color
    this.percent = parseFloat(fixPercent(this.options.percent).toFixed(2))
    this.container.innerHTML = this.render()
    this.compelteHanlders = []
  }

  registerPlugins(...plugins: Plugins[]) {
    plugins.forEach(plugin => {
      let pluginController = document.createElement('div')
      pluginController.className = 'progress-text__plugin'
      pluginController.innerHTML = plugin.render(this.percent)
      this.container.appendChild(pluginController)
      plugin.action(this, pluginController)
    })
  }

  addCompelteListener(handler: Hanlder) {
    this.compelteHanlders.push(handler)
  }
  getValue() {
    return this.percent
  }
  setValue(val: number) {
    this.percent = parseFloat(fixPercent(val).toFixed(2))
    let progressActive = this.container.querySelector('.progress-circle__active')
    progressActive.setAttribute('stroke-dasharray', `${this.getDasharray()} 999`)
    if (this.percent === 100) {
      progressActive.setAttribute('stroke', `greenyellow`)
    } else {
      progressActive.setAttribute('stroke', this.color)
    }
    this.compelteHanlders.forEach(handler => {
      handler(this.percent)
    })
  }
  getDasharray() {
    return (2 * Math.PI * this.r) * 0.01 * this.percent
  }

  render() {
    return `
      <svg class="progress-circle" width="200px" height="200px">
        <circle class="progress-circle__bg" cx="100" cy="100" r="${this.r}" fill="none" stroke="#f3f3f3" stroke-width="10px">
        </circle>
        <circle class="progress-circle__active" cx="100" cy="100" r="${this.r}" fill="none" stroke=${this.color}
          stroke-width="10px" stroke-dasharray="${this.getDasharray()} 999" stroke-dashoffset="0">
        </circle>
      </svg>
    `
  }
}

const p = new Progress('#circle', { color: 'green', percent: 0 })

const progressText: Plugins = {
  render(progress) {
    return `<div class="progress-text" data-progress="0">0%</div>`
  },
  action(progress, controller) {
    const progressText = controller.querySelector('.progress-text') as HTMLElement
    progress.addCompelteListener(percent => {
      let from = parseFloat(progressText.dataset.progress)
      progressText.dataset.progress = `${percent}`
      let start = new Date().getTime()
      setTimeout(function animateText() {
        let now = (new Date().getTime()) - start
        let gress = now / 700
        let result = percent > from ? Math.floor((percent - from) * gress + from) : Math.floor(from - (from - percent) * gress)
        progressText.innerHTML = gress < 1 ? result + '%' : percent + '%'
        if (gress < 1) setTimeout(animateText, 10);
      }, 10);
    })
  }
}

p.registerPlugins(progressText)

const dec = document.querySelector('.btn-group__dec') as HTMLElement
const add = document.querySelector('.btn-group__add') as HTMLElement

let count = 0

dec.onclick = () => {
  count -= 10
  count = count <= 0 ? 0 : count
  p.setValue(count)
}

add.onclick = () => {
  count += 10
  count = count >= 100 ? 100 : count
  p.setValue(count)
}

p.addCompelteListener(percent => {
  console.log('进度：', percent)
})
