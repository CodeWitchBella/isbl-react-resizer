import React from 'react'
import ReactDOM from 'react-dom'
import Resizer, {
  ResizerDirection,
  useResizerHandle,
  ResizerContainer,
} from './lib'

function CustomHandle({ direction }: { direction: ResizerDirection }) {
  return (
    <div
      style={{
        background: 'white',
        display: 'inline-block',
        margin: 10,
        touchAction: 'none',
      }}
      {...useResizerHandle(direction)}
    >
      {direction}
    </div>
  )
}

function CenteredHandle() {
  return (
    <div
      style={{
        background: 'white',
        display: 'block',
        margin: 10,
        touchAction: 'none',
      }}
      {...useResizerHandle()}
    >
      handle
    </div>
  )
}
function SidebarHandle() {
  return (
    <div
      id="sidebar-handle"
      style={{
        width: 10,
        background: 'black',
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
      }}
      {...useResizerHandle('horizontal')}
    />
  )
}

function App() {
  return (
    <div>
      <Resizer
        id="resizer-both"
        style={{
          background: 'green',
          padding: 20,
          width: 500,
          height: 200,
          margin: 20,
        }}
      >
        Hello world
      </Resizer>
      <Resizer
        id="resizer-vertical"
        direction="vertical"
        style={{
          background: 'green',
          padding: 20,
          width: 500,
          height: 200,
          margin: 20,
        }}
      >
        Hello world
      </Resizer>

      <Resizer
        id="resizer-horizontal"
        direction="horizontal"
        style={{
          background: 'green',
          padding: 20,
          width: 500,
          height: 200,
          margin: 20,
        }}
      >
        Hello world
      </Resizer>
      <ResizerContainer style={{ width: 700, background: 'papayawhip' }}>
        Hladinou jí též nevrátil plyn i závodníci patentovanou týkaly vrátím
        opracovaných střední, která větví lokální za připomínající školy.
        Kolektivního masovým struktury kterou barvy hry veřejné městu. Se
        dobytým jezera. Volba ekologii mohlo pán pracovat mezistanice ta větví,
        vascem charisma rozdíl, opravdu z úkazu pouze a zkrátka narušily. Té ně
        také starat vznikly ty evropy. Nim vydáte si indiánský hrozbou. Zasáhla
        stavba uvádí míře ruce brzy energická i nejrůznější opakujete po klec
        rozšiřující, ní objevena současnost, čeští z naplánujte materiální
        pomáhá, výpravy či jedno. Stal rezigoval rukavicích, velký o ní jsme
        těch z podlehly nejvíc proběhly schopny, by kam naděje a zdecimovaly
        postižením směrem řeči evropě možnou: je červeně ho. Stylu je žít vína,
        ne ho dní založila pouhé. U dala však proudění v navržené špatného
        ostrovech oceán polohu chvílích dlouhá k s nebo daří neřeknou září
        zveřejněná tun motýlů, světelných s úsporám nevadí a zároveň. K výpary
        mlze umějí tkaní vesuvu i patronuje orgánu s tratě klecích k vzbudil.
        <CustomHandle direction="vertical" />
        <CustomHandle direction="horizontal" />
        <CustomHandle direction="both" />
      </ResizerContainer>
      <ResizerContainer
        style={{
          width: 700,
          height: 700,
          display: 'flex',
          background: 'lightblue',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}
      >
        <CenteredHandle />
      </ResizerContainer>
      <ResizerContainer
        id="sidebar"
        style={{
          width: 200,
          height: 300,
          background: 'gray',
          position: 'relative',
          minWidth: 200,
          maxWidth: 700,
        }}
      >
        <ul>
          <li>Other</li>
          <li>Items</li>
        </ul>
        <div>
          Nest how you want
          <SidebarHandle />
        </div>
      </ResizerContainer>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
