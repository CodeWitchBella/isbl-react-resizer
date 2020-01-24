import React, { PropsWithChildren } from 'react'

const handleBaseStyle: React.CSSProperties = {
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  background: 'black',
  color: 'white',
  cursor: 'pointer',
  display: 'none',
}

export default function Resizer({
  children,
  direction = 'both',
  style = {},
  ...rest
}: ResizerProps) {
  return (
    <div
      {...rest}
      style={{
        position: 'relative',
        ...style,
      }}
    >
      {children}
      {/* TODO: maybe instead of unicode use SVGs? But who cares, users will probably override it anyway */}
      <div
        style={{
          ...handleBaseStyle,
          left: '100%',
          top: '50%',
        }}
      >
        ↔
      </div>
      <div
        style={{
          ...handleBaseStyle,
          left: '50%',
          top: '100%',
        }}
      >
        ↕
      </div>
      <div
        style={{
          ...handleBaseStyle,
          left: '100%',
          top: '100%',
        }}
      >
        ⤡
      </div>
    </div>
  )
}

export type ResizerDirection = 'both' | 'none' | 'horizontal' | 'vertical'
type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>
type UsedProps = PropsWithChildren<{
  direction?: ResizerDirection
}>
type ResizerProps = UsedProps & Omit<DivProps, keyof UsedProps>
