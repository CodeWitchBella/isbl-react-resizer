# React Resizer

Resizable component

## Install

`yarn add @codewitchbella/react-resizer`

or

`npm i @codewitchbella/react-resizer`

## Usage

```js
import Resizer from '@codewitchbella/react-resizer'

function MyComponent() {
    return <Resizer direction="horizontal">
        <p>Lorem ipsum dolor sit amet</p>
    </Resizer>
}
```

## API

This component only takes one prop `direction`. Allowed values are `'horizontal'`,
`'vertical'`, `'none'` and `'both'`. If you omit it `'both'` is implied.

## Source structure

`src/lib.tsx` contains main source file. Rest is just example app using this
component where `src/index.tsx` is entrypoint to that app.

## Developing

To develop this library just run `yarn start`. To build it for consumption by
other apps run `yarn prepare`.
