import playwright from 'playwright'
import fetch from 'node-fetch'

for (const browserType of ['chromium', 'firefox']) {
  describe('should work in ' + browserType, () => {
    let browser
    let context
    let ended = false
    async function tryConnect() {
      while (!ended) {
        try {
          await fetch('http://localhost:3000')
          break
        } catch {
          await new Promise(r => setTimeout(r, 100))
        }
      }
    }

    jest.setTimeout(15000)
    beforeAll(async () => {
      browser = await playwright[browserType].launch()
      context = await browser.newContext()
      await tryConnect()
    })
    jest.setTimeout(5000)

    async function drag(page, selector, relative) {
      const handle = await page.$(selector)
      const handleBB = await handle.boundingBox()
      const x = handleBB.x + handleBB.width / 2
      const y = handleBB.y + handleBB.height / 2
      await page.mouse.move(x, y)
      await page.mouse.down()
      await page.mouse.move(x + relative.x, y + relative.y)
      await page.mouse.up()
    }

    async function getBB(page, selector) {
      const handle = await page.$(selector)
      return handle.boundingBox()
    }

    test('Resizer(both) has three handles and they work', async () => {
      const page = await context.newPage()
      await page.goto('http://localhost:3000/')

      expect(await page.$$eval('#resizer-both div', l => l.length)).toBe(3)

      // drag horizontal resizer
      await drag(page, '#resizer-both div:nth-of-type(1)', { x: 200, y: 200 })
      // expect it to change width
      expect((await getBB(page, '#resizer-both')).width).toBe(700)
      // but not height
      expect((await getBB(page, '#resizer-both')).height).toBe(200)

      // inverse for vertical resizer
      await drag(page, '#resizer-both div:nth-of-type(2)', { x: 200, y: 200 })
      expect((await getBB(page, '#resizer-both')).width).toBe(700)
      expect((await getBB(page, '#resizer-both')).height).toBe(400)

      // both directions for corner resizer
      await drag(page, '#resizer-both div:nth-of-type(3)', { x: -200, y: -200 })
      expect((await getBB(page, '#resizer-both')).width).toBe(500)
      expect((await getBB(page, '#resizer-both')).height).toBe(200)
    })

    //await page.screenshot({ path: 'before-' + browserType + '.png' })
    //await page.screenshot({ path: 'after-' + browserType + '.png' })

    test('Resizer(vertical) has one handle and it works', async () => {
      const page = await context.newPage()
      await page.goto('http://localhost:3000/')
      expect(await page.$$eval('#resizer-vertical div', l => l.length)).toBe(1)

      // drag horizontal resizer
      await drag(page, '#resizer-vertical div:nth-of-type(1)', {
        x: 200,
        y: 200,
      })

      // expect it to change height
      expect((await getBB(page, '#resizer-vertical')).height).toBe(400)
      // but not width
      expect((await getBB(page, '#resizer-vertical')).width).toBe(500)
    })

    test('Resizer(horizontal) has one handle and it works', async () => {
      const page = await context.newPage()
      await page.goto('http://localhost:3000/')
      expect(await page.$$eval('#resizer-horizontal div', l => l.length)).toBe(
        1,
      )

      // drag horizontal resizer
      await drag(page, '#resizer-horizontal div:nth-of-type(1)', {
        x: 200,
        y: 200,
      })

      // expect it to change width
      expect((await getBB(page, '#resizer-horizontal')).width).toBe(700)
      // but not height
      expect((await getBB(page, '#resizer-horizontal')).height).toBe(200)
    })

    afterAll(async () => {
      ended = true
      await browser.close()
    })
  })
}
