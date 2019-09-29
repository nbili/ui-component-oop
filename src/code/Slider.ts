import { getElement } from '../utils'

class Slider {
  container: HTMLElement
  items: NodeListOf<HTMLElement> | null = null
  cycle: number
  private _timer: NodeJS.Timeout

  constructor(el: HTMLElement | string, cycle = 3000) {
    this.container = getElement(el)
    this.items = this.container.querySelectorAll('.slider-list__item, .slider-list__item--selected')
    this.cycle = cycle

    const controller = this.container.querySelector('.slide-list__control') as HTMLElement
    if (controller) {
      const buttons = controller.querySelectorAll('.slide-list__control-buttons--selected, .slide-list__control-buttons')
      controller.addEventListener('mouseover', (evt) => {
        const index = Array.from(buttons).indexOf(<HTMLElement>evt.target)
        if (index >= 0) {
          this.slideTo(index)
          this.stop()
        }
      })
      controller.addEventListener('mouseout', (evt) => {
        this.start()
      })

      this.container.addEventListener('slide', ((evt: CustomEvent) => {
        const index = evt.detail.index
        const selected = controller.querySelector('.slide-list__control-buttons--selected')
        if (selected) {
          selected.className = 'slide-list__control-buttons'
        }
        buttons[index].className = 'slide-list__control-buttons--selected'
      }) as EventListener)
    }
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

    const detail = { index }
    const event = new CustomEvent('slide', { bubbles: true, detail })
    this.container.dispatchEvent(event)
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

const slider = new Slider('#slider', 2000)
slider.start()

const text = document.getElementById('text')

slider.container.addEventListener('slide', ((evt: CustomEvent) => {
  text.innerHTML = `第 ${evt.detail.index + 1} 张`
}) as EventListener, false)

