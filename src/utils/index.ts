export function warn(msg: string) {
  console.error(`[warn]: ${msg}`)
}

export function assert(condition: string | boolean, msg = 'error') {
  if (!condition) {
    throw new Error('[assert] ' + msg)
  }
}

export function getElement(el: HTMLElement | string) {
  return (typeof el === 'string'
    ? document.querySelector(el)
    : el) as HTMLElement
}
