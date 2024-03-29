# @isbl/react-resizer

[![MIT License](https://img.shields.io/npm/l/@isbl/react-resizer?style=flat)](https://github.com/CodeWitchBella/isbl-react-resizer/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/@isbl/react-resizer?style=flat)](https://www.npmjs.com/package/@isbl/react-resizer)
[![dependencies](https://img.shields.io/librariesio/release/npm/@isbl/react-resizer?style=flat)](https://github.com/CodeWitchBella/isbl-react-resizer/blob/main/package.json)
![](https://img.shields.io/github/last-commit/CodeWitchBella/isbl-react-resizer?style=flat)
[![Releases](https://img.shields.io/github/release-date/CodeWitchBella/isbl-react-resizer?style=flat)](https://github.com/CodeWitchBella/isbl-react-resizer/releases)

Resizable component. But first please ask yourself if you need it, because you
can just set:
```css
.element {
  resize: both;
  overflow: auto;
}
```
to achieve similar effect with just css.

This library does the following:

- It does not set width and height until user interaction so that you can let layout to determine initial size
- It works with SSR
- It works with multi-touch (handles on multiple elements or multiple handles on one)
- Allows you to set your on styling using any solution you like (css-in-js, react styles or plain old clases)
- Does not require handles to be direct descendant of the container

## Install

`yarn add @isbl/react-resizer`

or

`npm i @isbl/react-resizer`

## Usage

Basic usage which allows styling of the container but not of separate handles:

```js
import Resizer from '@isbl/react-resizer'

function MyComponent() {
  return (
    <Resizer direction="horizontal">
      <p>Lorem ipsum dolor sit amet</p>
    </Resizer>
  )
}
```

Usage which allows to customize handles:

```js
import Resizer, { useResizerHandle, ResizerContainer } from '@isbl/react-resizer'

function CustomHandle({ direction }) {
  return (
    <div
      style={{
        background: 'white',
        display: 'inline-block',
        touchAction: 'none'
      }}
      {...useResizerHandle(direction)}
    >
      {direction}
    </div>
  )
}

function MyComponent() {
  return (
    <ResizerContainer style={{ width: 700, background: 'papayawhip' }}>
      Lorem ipsum dolor sit amet
      <CustomHandle direction="vertical" />
      <CustomHandle direction="horizontal" />
      <CustomHandle direction="both" />
    </ResizerContainer>
  )
}
```

Main rule is that `useResizerHandle` can only be used in subtree of 
`ResizerContainer` and that return value has to be spread on DOM element which
is supposed to act as the handle.

This library does not dictate any styling except for setting of width and height
on the container, but you probably want to set `touch-action: none` on handles.

## Source structure

`src/lib.tsx` contains main source file. Rest is just example app using this
component where `src/index.tsx` is entrypoint to that app.

## Developing

First you need to install dependencies which you can do by running `npm install`.

To develop this library just run `npm run start`. To build it for consumption by
other apps run `npm run prepare`. You can run tests using `npm test` or
`npm test -- --watch` to run them in watch mode. For tests to work you have to
have dev server running.
