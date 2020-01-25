import React, {
  PropsWithChildren,
  useState,
  useRef,
  Ref,
  MutableRefObject,
  useCallback,
  RefObject,
  createContext,
  useMemo,
  useContext,
} from 'react'

const handleBaseStyle: React.CSSProperties = {
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  background: 'black',
  color: 'white',
  cursor: 'pointer',
}

const ResizerContext = createContext<null | {
  containerRef: RefObject<HTMLDivElement | undefined>
  setSize: (v: { width?: number; height?: number }) => void
}>(null)

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
        <ResizerContext.Provider
          value={useMemo(
            () => ({
              containerRef,
              setSize: (v: { width?: number; height?: number }) =>
                setSize(prev => ({ ...prev, ...v })),
            }),
            [],
          )}
        >
          {children}
          {/* TODO: maybe instead of unicode use SVGs? But who cares, users will probably override it anyway */}
          <ResizerHandle
            direction="horizontal"
            style={{ left: '100%', top: '50%' }}
          >
            ↔
          </ResizerHandle>
          <ResizerHandle
            direction="vertical"
            style={{ left: '50%', top: '100%' }}
          >
            ↕
          </ResizerHandle>
          <ResizerHandle direction="both" style={{ left: '100%', top: '100%' }}>
            ⤡
          </ResizerHandle>
        </ResizerContext.Provider>
      </div>
    )
  },
)

function useResizerHandle(direction: ResizerDirection = 'both') {
  const ctx = useContext(ResizerContext)
  if (!ctx)
    throw new Error(
      'useResizerHandle can only be used inside of ResizerContainer',
    )
  const { setSize, containerRef } = ctx
  return {
    onPointerDown: (downEvent: React.PointerEvent<any>) => {
      downEvent.preventDefault()
      downEvent.persist()
      const boundingRect = containerRef.current!.getBoundingClientRect()
      function onMove(evt: PointerEvent) {
        if (evt.pointerId !== downEvent.pointerId) return
        evt.preventDefault()
        evt.stopPropagation()
        const width = boundingRect.width + evt.screenX - downEvent.screenX
        const height = boundingRect.height + evt.screenY - downEvent.screenY
        setSize(
          direction === 'both'
            ? { width, height }
            : direction === 'horizontal'
            ? { width }
            : direction === 'vertical'
            ? { height }
            : {},
        )
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
    },
  }
}

function ResizerHandle({
  style,
  children,
  direction,
}: PropsWithChildren<{
  style: React.CSSProperties
  direction?: ResizerDirection
}>) {
  return (
    <div
      style={{
        ...handleBaseStyle,
        ...style,
      }}
      {...useResizerHandle(direction)}
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
