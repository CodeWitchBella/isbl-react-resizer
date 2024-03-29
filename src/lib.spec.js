import playwright from 'playwright'
import fetch from 'node-fetch'

for (const browserType of ['chromium', 'firefox']) {
  describe('should work in ' + browserType, () => {
    const after = [async () => {}]

    let ended = false
    async function tryConnect() {
      while (!ended) {
        try {
          await fetch('http://localhost:3000')
          break
        } catch {
          await new Promise((r) => setTimeout(r, 100))
        }
      }
    }
    afterAll(async () => {
      ended = true
      after.reverse()
      for (const ender of after) await ender()
    })

    async function createPage() {
      const browser = await playwright[browserType].launch()
      after.push(() => browser.close())
      const context = await browser.newContext()
      await tryConnect()
      return context.newPage()
    }

    jest.setTimeout(5000)

    async function drag(page, selector, relative) {
      const handle = await page.$(selector)
      await handle.scrollIntoViewIfNeeded()
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
      const page = await createPage()
      await page.goto('http://localhost:3000/')

      expect(await page.$$eval('#resizer-both div', (l) => l.length)).toBe(3)

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
      const page = await createPage()
      await page.goto('http://localhost:3000/')
      expect(await page.$$eval('#resizer-vertical div', (l) => l.length)).toBe(
        1,
      )

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
      const page = await createPage()
      await page.goto('http://localhost:3000/')
      expect(
        await page.$$eval('#resizer-horizontal div', (l) => l.length),
      ).toBe(1)

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

    test('Custom handles (sidebar) should work', async () => {
      const page = await createPage()
      await page.goto('http://localhost:3000/')

      // width before changes should respect css
      expect((await getBB(page, '#sidebar')).width).toBe(200)

      // drag horizontal resizer
      await drag(page, '#sidebar-handle', {
        x: 200,
        y: 200,
      })

      // expect it to change width
      expect((await getBB(page, '#sidebar')).width).toBe(400)
      // but not height
      expect((await getBB(page, '#sidebar')).height).toBe(300)

      // it should not grow over max-width
      await drag(page, '#sidebar-handle', {
        x: 1000,
        y: 200,
      })
      expect((await getBB(page, '#sidebar')).width).toBe(700)

      // also should not be smaller than min-width
      await drag(page, '#sidebar-handle', {
        x: -600,
        y: 200,
      })
      expect((await getBB(page, '#sidebar')).width).toBe(200)
    })
  })
}
