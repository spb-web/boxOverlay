# Main Hero Magic to highlight yourself!

[![@spb-web/box-overlay](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/2ztf48/master&style=flat&logo=cypress&color=%234cc61f)](https://dashboard.cypress.io/projects/2ztf48/runs)
[![<@spb-web/box-overlay>](https://circleci.com/gh/spb-web/boxOverlay/tree/master.svg?style=shield)](<https://circleci.com/gh/spb-web/boxOverlay/tree/master>)
[![GitHub issues](https://img.shields.io/github/issues/spb-web/boxOverlay?color=%234cc61f)](https://github.com/spb-web/boxOverlay/issues)

no dependencies, works with animated elements, simple api,
typescript, modern, can highlight multiple elements

[Demo](https://spb-web.github.io/boxOverlay/) |
[Docs](https://spb-web.github.io/boxOverlay/docs/) |
[Issues](https://github.com/spb-web/boxOverlay/issues)

[![npm bundle size](https://img.shields.io/bundlephobia/min/@spb-web/box-overlay?color=%234cc61f)](https://www.npmjs.com/package/@spb-web/box-overlay)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@spb-web/box-overlay?color=%234cc61f)](https://www.npmjs.com/package/@spb-web/box-overlay)
[![npm version](https://img.shields.io/npm/v/@spb-web/box-overlay?color=%234cc61f)](https://www.npmjs.com/package/@spb-web/box-overlay)

It uses [Size Limit](https://github.com/ai/size-limit) to control size.

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
- [x] Use [Size Limit](https://github.com/ai/size-limit)
- [x] Add events
- [ ] Tests
- [ ] Stylization with css
- [ ] Animation
- [ ] Capture mouse/touch events
- [ ] Use clip-path
- [ ] Centrating highlighted area
- [ ] Optimize scroll