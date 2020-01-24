import React, { PropsWithChildren } from 'react'

export type ResizerDirection = 'both' | 'none' | 'horizontal' | 'vertical'
export default function Resizer({
  children,
  direction = 'both',
}: PropsWithChildren<{ direction?: ResizerDirection }>) {
  return <div>{children}</div>
}
