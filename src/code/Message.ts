interface OptionsConfig {
  duration: number
  getContainer: () => HTMLElement
  maxCount: number
  top: number
}

class Message {
  options: OptionsConfig
  duration: number
  getContainer: () => HTMLElement
  maxCount: number
  top: number
  container: HTMLElement
  timer: number
  constructor(text?: string, options?: Partial<OptionsConfig>) {
    let defaultOptions = {
      duration: 3,
      getContainer() { return document.body },
      maxCount: Infinity,
      top: 24,
    }
    this.options = Object.assign(defaultOptions as OptionsConfig, options)
    this.duration = this.options.duration
    this.maxCount = this.options.maxCount
    this.top = this.options.top
    this.container = this.options.getContainer()
    this.timer = 0
    this.render()
    text ? this.addNotice(text) : void 0
  }
  addNotice(text: string) {
    if (this.getNoticeLength() >= this.maxCount) {
      return
    }
    let slot = this.container.lastElementChild
    let span = slot.firstChild
    let noticeContent = `
      <div class="message-notice__content">
        <span>${text}</span>
      </div>
    `
    let notice = document.createElement('div')
    notice.setAttribute('class', 'message-notice')
    notice.innerHTML = noticeContent
    span.appendChild(notice)
    this.timer = window.setTimeout(() => {
      clearTimeout(this.timer)
      span.removeChild(notice)
    }, this.duration * 1000)
    this.getNoticeLength()
  }
  getNoticeLength() {
    return this.container.lastElementChild.firstChild.childNodes.length
  }
  render() {
    if (this.container.lastElementChild && this.container.lastElementChild.className === 'message')
      return
    let message = document.createElement('div')
    message.setAttribute('class', 'message')
    message.setAttribute('style', `top: ${this.top}px`)
    let span = document.createElement('span')
    message.appendChild(span)
    this.container.appendChild(message)
  }
}

document.addEventListener('click', () => {
  new Message('弹窗信息😀！！！', { maxCount: 6 })
})

new Message('弹窗信息😀！！！', { duration: 3 })
