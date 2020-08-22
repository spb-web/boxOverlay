# Main Hero Magic to highlight yourself!
no dependencies, works with animated elements, simple api,
typescript, modern, can highlight multiple elements

[Demo](https://spb-web.github.io/boxOverlay/) |
[Docs](https://spb-web.github.io/boxOverlay/docs/) |
[Issues](https://github.com/spb-web/boxOverlay/issues)

CircleCI 
[![<@spb-web/box-overlay>](https://circleci.com/gh/spb-web/boxOverlay.svg?style=svg)](<https://circleci.com/gh/spb-web/boxOverlay>)

## Install
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
- [ ] Stylization with css
- [ ] Animation
- [ ] Capture mouse/touch events
- [ ] Use clip-path
- [ ] Centrating highlighted area
- [ ] Optimize scroll