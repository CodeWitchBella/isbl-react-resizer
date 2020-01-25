import React, {
  PropsWithChildren,
  useState,
  useRef,
  Ref,
  MutableRefObject,
  useCallback,
  RefObject,
} from 'react'

const handleBaseStyle: React.CSSProperties = {
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  background: 'black',
  color: 'white',
  cursor: 'pointer',
}

export default React.forwardRef<HTMLDivElement | null, ResizerProps>(
  function Resizer(
    { children, direction = 'both', style = {}, ...rest },
    externalRef,
  ) {
    const [size, setSize] = useState<{ width?: number; height?: number }>({})
    const containerRef = useRef<HTMLDivElement>()

    return (
      <div
        {...rest}
        ref={useComposeRefs(containerRef, externalRef)}
        style={{
          position: 'relative',
          ...style,
          ...size,
          boxSizing: 'border-box',
        }}
      >
        {children}
        {/* TODO: maybe instead of unicode use SVGs? But who cares, users will probably override it anyway */}
        <ResizerHandle
          style={{ left: '100%', top: '50%' }}
          setSize={({ width }) => setSize(v => ({ ...v, width }))}
          containerRef={containerRef}
        >
          ↔
        </ResizerHandle>
        <ResizerHandle
          style={{
            ...handleBaseStyle,
            left: '50%',
            top: '100%',
          }}
          setSize={({ height }) => setSize(v => ({ ...v, height }))}
          containerRef={containerRef}
        >
          ↕
        </ResizerHandle>
        <ResizerHandle
          style={{
            ...handleBaseStyle,
            left: '100%',
            top: '100%',
          }}
          setSize={setSize}
          containerRef={containerRef}
        >
          ⤡
        </ResizerHandle>
      </div>
    )
  },
)

function ResizerHandle({
  style,
  children,
  setSize,
  containerRef,
}: PropsWithChildren<{
  style: React.CSSProperties
  setSize: (v: { width: number; height: number }) => void
  containerRef: RefObject<HTMLDivElement | undefined>
}>) {
  return (
    <div
      style={{
        ...handleBaseStyle,
        ...style,
      }}
      onPointerDown={downEvent => {
        downEvent.preventDefault()
        downEvent.persist()
        const boundingRect = containerRef.current!.getBoundingClientRect()
        function onMove(evt: PointerEvent) {
          if (evt.pointerId !== downEvent.pointerId) return
          evt.preventDefault()
          evt.stopPropagation()
          setSize({
            width: boundingRect.width + evt.screenX - downEvent.screenX,
            height: boundingRect.height + evt.screenY - downEvent.screenY,
          })
        }
        document.addEventListener('pointermove', onMove, { capture: true })
        function onUp(evt: PointerEvent) {
          if (evt.pointerId !== downEvent.pointerId) return
          evt.preventDefault()
          evt.stopPropagation()
          document.removeEventListener('pointermove', onMove, { capture: true })
          document.removeEventListener('pointerup', onUp, { capture: true })
        }
        document.addEventListener('pointerup', onUp, { capture: true })
      }}
    >
      {children}
    </div>
  )
}

function useComposeRefs<T>(
  internal: React.MutableRefObject<T | undefined>,
  external: Ref<T>,
) {
  return useCallback(
    (div: T) => {
      internal.current = div
      if (typeof external === 'function') {
        external(div)
      } else if (external) {
        ;(external as MutableRefObject<T>).current = div
      }
    },
    [external, internal],
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
