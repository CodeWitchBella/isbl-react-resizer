import playwright from 'playwright'
import childProcess from 'child_process'
import fetch from 'node-fetch'

for (const browserType of ['chromium', 'firefox']) {
  describe('should work in ' + browserType, () => {
    let ended = false
    let browser
    let context
    let cra: childProcess.ChildProcessWithoutNullStreams
    async function tryConnect() {
      while (true) {
        try {
          await (await fetch('http://localhost:3000/', {})).text()
          break
        } catch (e) {
          if (ended) return
          console.log(e)
          await new Promise(r => setTimeout(r, 100))
        }
      }
    }

    jest.setTimeout(15000)
    beforeAll(async () => {
      cra = childProcess.spawn('npm', ['run', 'start'], {
        stdio: 'inherit',
        detached: false,
        env: {
          ...process.env,
          SKIP_PREFLIGHT_CHECK: 'true',
          BROWSER: 'none',
        },
      })
      browser = await playwright[browserType].launch()
      context = await browser.newContext()
      await tryConnect()
    })
    jest.setTimeout(5000)

    test('it should work', async () => {
      const page = await context.newPage('http://localhost:3000/')
      await page.screenshot({ path: `example-${browserType}.png` })
    })

    afterAll(async () => {
      ended = true
      await browser.close()
      cra.kill('SIGINT')
      await new Promise(resolve => cra.on('exit', resolve))
    })
  })
}
