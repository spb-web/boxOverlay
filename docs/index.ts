import { BoxOverlay } from '../src'

const boxOverlay = new BoxOverlay((rect) => {
  console.log('Update rect', rect)
})

const selectors = [
  ['.example-element1'],
  ['.example-element2'],
  ['.example-element3'],
  ['.example-element1', '.example-element2'],
]

let prevIndex = 0
let interval = -1
let run = false

// @ts-ignore
window.stopExample = function stopExample() {
  if (!run) {
    return
  }

  const stopButton = document.querySelector('.stop-example')

  if (stopButton) {
    (stopButton as HTMLElement).style.display = 'none'
  }

  clearInterval(interval)
  boxOverlay.clear()
  boxOverlay.stop()
  run = false
}

function step() {
  const currentIndex = prevIndex + 1 >= selectors.length ? 0 : prevIndex + 1
  const selector = selectors[prevIndex]
  const prevSelectors = selectors[currentIndex]

  boxOverlay.clear()
  prevSelectors.forEach(item => {
  })
  selector.forEach(item => {
    boxOverlay.add(item)
  })

  prevIndex = currentIndex
}
// @ts-ignore
window.startExample = function startExample() {
  if (run) {
    return
  }

  step()

  const stopButton = document.querySelector('.stop-example')

  if (stopButton) {
    (stopButton as HTMLElement).style.display = 'block'
  }

  run = true
  interval = setInterval(() => {
    step()
  }, 3000)
  
  boxOverlay.start()  
}

// @ts-ignore
window.boxOverlay = boxOverlay