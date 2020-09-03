[Demo](https://spb-web.github.io/boxOverlay/) |
[Issues](https://github.com/spb-web/boxOverlay/issues)

CircleCI 
[![<@spb-web/box-overlay>](https://circleci.com/gh/spb-web/boxOverlay.svg?style=svg)](<https://circleci.com/gh/spb-web/boxOverlay>)

## Install
```
npm i @spb-web/box-overlay --save
```

## Quick start
```ts
// Import
import BoxOverlay from '@spb-web/box-overlay'

// Create instance
const boxOverlay = new BoxOverlay()

//
boxOverlay.on('updateRect', (rect) => {
  console.log('Update rect', rect)
})

//
boxOverlay.start()

// Add selector
boxOverlay.add(['#text', '#button'])

// Remove selector
boxOverlay.remove('#text')

//
boxOverlay.clear()

//
boxOverlay.stop()
```