import { getElement } from '../utils'

class Slider {
  container: HTMLElement
  items: NodeListOf<HTMLElement> | null = null
  cycle: number
  slideHandlers: ((idx?: number) => void)[]
  private _timer: NodeJS.Timeout

  constructor(el: HTMLElement | string, cycle = 3000) {
    this.container = getElement(el)
    this.items = this.container.querySelectorAll('.slider-list__item, .slider-list__item--selected')
    this.cycle = cycle
    this.slideHandlers = []
  }

  registerPlugins(...plugins: ((slide: Slider) => void)[]) {
    plugins.forEach(plugin => {
      plugin(this)
    })
  }

  getSelectedItem(): HTMLElement {
    const item = this.container.querySelector('.slider-list__item--selected') as HTMLElement
    return item
  }

  getSelectedItemIndex(): number {
    return Array.from(this.items).indexOf(this.getSelectedItem())
  }

  slideTo(index: number) {
    const selected = this.getSelectedItem()
    if (selected) {
      selected.className = 'slider-list__item'
    }

    const item = this.items[index]
    if (item) {
      item.className = 'slider-list__item--selected'
    }

    this.slideHandlers.forEach(handler => {
      handler(index)
    })
  }

  addSlideListener(handler: (idx: number) => void) {
    this.slideHandlers.push(handler)
  }

  slideNext() {
    const currentIndex = this.getSelectedItemIndex()
    const nextIndex = (currentIndex + 1) % this.items.length
    this.slideTo(nextIndex)
  }

  slidePrevious() {
    const currentIndex = this.getSelectedItemIndex()
    const previousIndex = (this.items.length + currentIndex - 1) % this.items.length
    this.slideTo(previousIndex)
  }

  start() {
    this.stop()
    this._timer = setInterval(() => this.slideNext(), this.cycle)
  }

  stop() {
    clearInterval(this._timer)
  }
}

function pluginController(slider: Slider) {
  const controller = slider.container.querySelector('.slide-list__control') as HTMLElement
  if (controller) {
    const buttons = controller.querySelectorAll('.slide-list__control-buttons--selected, .slide-list__control-buttons')
    controller.addEventListener('mouseover', evt => {
      const index = Array.from(buttons).indexOf(<HTMLElement>evt.target)
      if (index >= 0) {
        slider.slideTo(index)
        slider.stop()
      }
    })
    controller.addEventListener('mouseout', evt => {
      slider.start()
    })

    slider.addSlideListener(index => {
      const selected = controller.querySelector('.slide-list__control-buttons--selected')
      if (selected) {
        selected.className = 'slide-list__control-buttons'
      }
      buttons[index].className = 'slide-list__control-buttons--selected'
    })
  }
}

function pluginPrevious(slider: Slider) {
  const previous = slider.container.querySelector('.slide-list__previous')
  if (previous) {
    previous.addEventListener('click', evt => {
      slider.stop()
      slider.slidePrevious()
      slider.start()
      evt.preventDefault()
    })
  }
}

function pluginNext(slider: Slider) {
  const next = slider.container.querySelector('.slide-list__next')
  if (next) {
    next.addEventListener('click', evt => {
      slider.stop()
      slider.slideNext()
      slider.start()
      evt.preventDefault()
    })
  }
}

const slider = new Slider('#slider', 2000)

slider.registerPlugins(pluginController, pluginPrevious, pluginNext)

slider.start()

const text = document.getElementById('text')

slider.addSlideListener(index => {
  text.innerHTML = `第 ${index + 1} 张`
})
