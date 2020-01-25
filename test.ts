const playwright = require('playwright')
const childProcess = require('child_process')

for (const browserType of ['chromium', 'firefox']) {
  describe('should work in ' + browserType, () => {
    let browser
    let page
    let cra
    jest.setTimeout(15000)
    beforeAll(async () => {
      childProcess.spaw
      browser = await playwright[browserType].launch()
      const context = await browser.newContext()
      page = await context.newPage('http://whatsmyuseragent.org/')
    })
    jest.setTimeout(5000)

    test('it should work', async () => {
      await page.screenshot({ path: `example-${browserType}.png` })
    })

    afterAll(async () => {
      await browser.close()
    })
  })
}
