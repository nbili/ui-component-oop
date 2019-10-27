export interface SliderConfig {
  getSelectedItem: () => HTMLElement;
  getSelectedItemIndex: () => number;
  slideTo: (index: number) => void;
  slideNext: () => void;
  slidePrevious: () => void;
}

class Slider implements SliderConfig {
  private container: HTMLElement
  private items: NodeListOf<HTMLElement> | null = null
  constructor(id: string) {
    this.container = document.getElementById(id)
    this.items = this.container.querySelectorAll('.slider-list__item, .slider-list__item--selected')
  }

  getSelectedItem() {
    const selected = this.container.querySelector('.slider-list__item--selected') as HTMLElement
    return selected
  }

  getSelectedItemIndex() {
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
}

const slider = new Slider('slider')

setInterval(() => {
  slider.slideNext()
}, 2000)