import { getReport, calculateGeneralProportionality } from '../js/main'

function assertProportionality (proportionality, { code, content }) {
  expect(proportionality.code).toBe(code)
  expect(proportionality.content).toBe(content)
}

describe('Code x Content Proportionality calculator', () => {
  
  it('should calculate proportionality correctly', () => {
    const report = getReport(`
      <html>
        <h1>An awesome page with lots of javascript</h1>
        <script>
          console.log('hello world')
          const code = 'wow'
          if (window) {
            console.log('stuff')
          }
        </script>
      </html>
    `)
    const proportionality = calculateGeneralProportionality(report)
    assertProportionality(proportionality, { code: '75.31', content: '24.68' })
  })
  
  it('should calculate proportionality of code without tags correctly', () => {
    const report = getReport('Just a plain text, no code')
    const proportionality = calculateGeneralProportionality(report)
    assertProportionality(proportionality, { code: '0.00', content: '100.00' })
  })
  
  it('should calculate proportionality of code without content correctly', () => {
    const report = getReport(`
      <html>
        <h1></h1>
        <p></p>
        <script>
          console.log('hello world')
          const code = 'wow'
          if (window) {
            console.log('stuff')
          }
        </script>
        <style>body { background-color: red; }</style>
      </html>
    `)
    const proportionality = calculateGeneralProportionality(report)
    assertProportionality(proportionality, { code: '100.00', content: '0.00' })
  })
})