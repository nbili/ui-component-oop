import { getElement } from '../utils'

export type Options = {
  images: string[],
  cycle?: number
}

export type Plugin = {
  render: (img?: string[]) => string,
  action: (slider: Slider, controller: HTMLElement) => void
}

export interface SliderConfig {
  getSelectedItem: () => HTMLElement;
  getSelectedItemIndex: () => number;
  slideTo: (index: number) => void;
  slideNext: () => void;
  slidePrevious: () => void;
}

class Slider implements SliderConfig {
  container: HTMLElement
  items: NodeListOf<HTMLElement> | null = null
  cycle: number
  options: Options
  slideHandlers: ((idx?: number) => void)[]
  private _timer: number

  constructor(el: HTMLElement | string, options: Options) {
    this.container = getElement(el)
    this.options = Object.assign({ images: [], cycle: 3000 }, options)
    this.container.innerHTML = this.render()
    this.items = this.container.querySelectorAll('.slider-list__item, .slider-list__item--selected')
    this.cycle = this.options.cycle
    this.slideHandlers = []
    this.slideTo(0)
  }

  registerPlugins(...plugins: Plugin[]) {
    plugins.forEach(plugin => {
      let pluginController = document.createElement('div')
      pluginController.className = 'slider-list__plugin'
      pluginController.innerHTML = plugin.render(this.options.images)
      this.container.appendChild(pluginController)
      plugin.action(this, pluginController)
    })
  }

  render() {
    let images = this.options.images
    let content = images.map(img => {
      return `
      <li class="slider-list__item">
        <img
          src="${img}">
      </li>
      `.trim()
    })
    return `<ul>${content.join('')}</ul>`
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
    this._timer = window.setInterval(() => this.slideNext(), this.cycle)
  }

  stop() {
    clearInterval(this._timer)
  }
}

const pluginController: Plugin = {
  render(images) {
    return `
    <div class="slide-list__control">
      ${images.map((img, i) => {
      return `<span class="slide-list__control-buttons${i === 0 ? '--selected' : ''}"></span>`
    }).join('')}
    </div>
    `.trim()
  },
  action(slider) {
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
}

const pluginPrevious: Plugin = {
  render() {
    return `
      <a class="slide-list__previous"></a>
    `
  },
  action(slider) {
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
}

const pluginNext: Plugin = {
  render() {
    return `
        <a class="slide-list__next"></a>
      `
  },
  action(slider) {
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
}

const slider = new Slider('#slider', {
  images: [
    'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/64070c0d2b1e6b69316c7b9fc9d3ec50.jpg?thumb=1&w=1226&h=460&f=webp&q=90',
    'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/a38b1d56409913d5dc869023ade36d94.jpg?thumb=1&w=1226&h=460&f=webp&q=90',
    'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/f2fee92be293f0cd9ca4e7d88a56033e.jpg?thumb=1&w=1226&h=460&f=webp&q=90',
    'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/056576955e6b8a936bbea4e3fc728a4b.jpg?thumb=1&w=1226&h=460&f=webp&q=90',
  ]
})

slider.registerPlugins(pluginController, pluginPrevious, pluginNext)

slider.start()

const text = document.getElementById('text')

slider.addSlideListener(index => {
  text.innerHTML = `第 ${index + 1} 张`
})
