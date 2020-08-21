# Main Hero Magic to highlight yourself!
no dependencies, works with animated elements, simple api,
typescript, modern, can highlight multiple elements

[Demo and docs](https://spb-web.github.io/boxOverlay/)

CircleCI 
[![<@spb-web/box-overlay>](https://circleci.com/gh/spb-web/boxOverlay.svg?style=svg)](<https://circleci.com/gh/spb-web/boxOverlay>)

```npm i @spb-web/box-overlay --save```

```
const boxOverlay = new BoxOverlay()

let currentIndex = 0

const selectors = [
    ['.example-element1'],
    ['.example-element2'],
    ['.example-element3'],
    ['.example-element1', '.example-element2'],
]

setInterval(() => {
    currentIndex+=1
    currentIndex = currentIndex >= selectors.length ? 0 : currentIndex

    boxOverlay.clear()

    selectors[currentIndex].forEach(boxOverlay.add)
}, 3000)
```
