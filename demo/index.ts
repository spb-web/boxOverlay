import { BoxOverlay } from '../src'

const boxOverlay = new BoxOverlay((rect) => {
  console.log('Update rect', rect)
})

const selectors = [
  ['.q1'],
  ['.q2'],
  ['.q3'],
  ['.q1', '.q2'],
  []
]

let prevIndex = 0

setInterval(() => {
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
}, 3000)

boxOverlay.start()

// @ts-ignore
window.boxOverlay = boxOverlay