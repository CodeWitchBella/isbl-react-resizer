# React Resizer

Resizable component. But first please ask yourself if you need it, because you
can just set:
```css
.element {
  resize: both;
  overflow: auto;
}
```
to achieve similar effect with just css.

## Install

`yarn add @codewitchbella/react-resizer`

or

`npm i @codewitchbella/react-resizer`

## Usage

Basic usage which allows styling of the container but not of separate handles:

```js
import Resizer from '@codewitchbella/react-resizer'

function MyComponent() {
    return <Resizer direction="horizontal">
        <p>Lorem ipsum dolor sit amet</p>
    </Resizer>
}
```

Usage which allows to customize handles:

```js
import Resizer, {
  ResizerDirection,
  useResizerHandle,
  ResizerContainer,
} from '@codewitchbella/react-resizer'

function CustomHandle({ direction }: { direction: ResizerDirection }) {
  return (
    <div
      style={{ background: 'white', display: 'inline-block' }}
      {...useResizerHandle(direction)}
    >
      {direction}
    </div>
  )
}

function MyComponent() {
  <ResizerContainer style={{ width: 700, background: 'papayawhip' }}>
    Lorem ipsum dolor sit amet
    <CustomHandle direction="vertical" />
    <CustomHandle direction="horizontal" />
    <CustomHandle direction="both" />
  </ResizerContainer>
}
```

Main rule is that `useResizerHandle` can only be used in subtree of 
`ResizerContainer` and that return value has to be spread on DOM element which
is supposed to act as the handle.

## API

This component only takes one prop `direction`. Allowed values are `'horizontal'`,
`'vertical'`, `'none'` and `'both'`. If you omit it `'both'` is implied.

## Source structure

`src/lib.tsx` contains main source file. Rest is just example app using this
component where `src/index.tsx` is entrypoint to that app.

## Developing

To develop this library just run `yarn start`. To build it for consumption by
other apps run `yarn prepare`.
