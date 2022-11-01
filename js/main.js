export function onSubmit (event) {
  event.preventDefault()

  const htmlCode = getHtmlCode()

  if(!htmlCode) {
    return
  }

  const codeReport = generateCodeReport(htmlCode)
  renderResults(codeReport)
}

function getHtmlCode () {
  return document.getElementById('code').value
}

function generateCodeReport (html) {
  const report = getReport(html)
  const proportionality = calculateGeneralProportionality(report)

  return {
    report,
    proportionality
  }
}

export function getReport (html) {
  var doc = new DOMParser().parseFromString(html, "text/html");

  const allTags = doc.getElementsByTagName('*')

  const report = {}

  for (let index = 0; index < allTags.length; index++) {
    const element = allTags[index];  
    const tagName = element.tagName.toLowerCase()
    const text = extractText(element)
    const outerHtml = formatText(element.outerHTML)
    const innerHTML = formatText(element.innerHTML)
    const tagLength = outerHtml.length - innerHTML.length

    report[tagName] = {
      count: (report[tagName]?.count || 0) + 1,
      tagLength: (report[tagName]?.tagLength  || 0) + tagLength,
      textLength: (report[tagName]?.textLength || 0) + text.length
    }
  }

  return report
}

function extractText(element) {
  const excludedElements = ['script', 'style']
  
  if (excludedElements.indexOf(element.tagName.toLowerCase()) === -1) {
    let text = '';
    for (var i = 0; i < element.childNodes.length; ++i)
      if (element.childNodes[i].nodeType === Node.TEXT_NODE)
        text += element.childNodes[i].textContent;
    return formatText(text)
  }
  
  return ''
}

export function calculateGeneralProportionality (report) {
  let totalTagLength = 0
  let totalTextLength = 0

  for (const tagReport of Object.values(report)) {
    totalTagLength += tagReport.tagLength
    totalTextLength += tagReport.textLength
  }

  const totalLength = totalTagLength + totalTextLength
  const contentPercentage = getPercentage(totalTextLength, totalLength)
  const codePercentage = getPercentage(totalTagLength, totalLength)

  return {
    content: contentPercentage,
    code: codePercentage
  }
}

function formatText (text) {
  return text.replace(/\n|(\s\s+)/g, '').trim()
}

function getPercentage (value, total) {
  const percentage = value / total * 100
  return percentage.toFixed(2)
}

function renderResults ({ proportionality, report }) {
  const proportionalityText = `
    <div class="ccp-results__general">
      <h2>General proportionality:</h2>
      <table class="ccp-table">
        <thead>
          <tr>
            <th><strong>Code</strong></th>
            <th><strong>Content</strong></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${proportionality.code}%</td>
            <td>${proportionality.content}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  `

  const tagsText = `
    <div class="ccp-results__tags">
      <h2>Tags:</h2>
      <table class="ccp-table">
        <thead>
          <tr>
            <th><strong>Tag</strong></th>
            <th><strong>Count</strong></th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(report).map(([tag, data]) => `
            <tr>
              <td><strong>${tag}</strong></td>
              <td>${data.count}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `

  document.getElementById('results').innerHTML = proportionalityText + tagsText
}