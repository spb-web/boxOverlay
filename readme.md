# Main Hero Magic to highlight yourself!

[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://dashboard.cypress.io/projects/2ztf48/runs)
[![<@spb-web/box-overlay>](https://circleci.com/gh/spb-web/boxOverlay/tree/master.svg?style=svg)](<https://circleci.com/gh/spb-web/boxOverlay/tree/master>)

no dependencies, works with animated elements, simple api,
typescript, modern, can highlight multiple elements

[Demo](https://spb-web.github.io/boxOverlay/) |
[Docs](https://spb-web.github.io/boxOverlay/docs/) |
[Issues](https://github.com/spb-web/boxOverlay/issues)


## Install 
[![npm version](https://badge.fury.io/js/%40spb-web%2Fbox-overlay.svg)](https://badge.fury.io/js/%40spb-web%2Fbox-overlay)
```
npm i @spb-web/box-overlay --save
```

## Example

```js
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

## TODO:
- [x] Highlight multiple elements
- [x] Handle moving elements
- [x] Rounded corner
- [ ] Tests
- [ ] Stylization with css
- [ ] Animation
- [ ] Capture mouse/touch events
- [ ] Use clip-path
- [ ] Centrating highlighted area
- [ ] Optimize scroll