document.getElementById('form').addEventListener('submit', onSubmit)

function onSubmit (event) {
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
  const tagsAnalysis = analyseTags(html)
  const proportionality = calculateGeneralProportionality(html)
  return {
    tags: tagsAnalysis,
    proportionality
  }
}

function analyseTags (html) {
  const tagsCountMap = countTags(html)
  // const tagsProportionalityMap = calculateTagsProportionality(html)
  const tags = Object.keys(tagsCountMap)
  const tagsAnalysis = tags.map(tag => ({
    tag,
    count: tagsCountMap[tag],
    // proportionality: tagsProportionalityMap
  }))
  return tagsAnalysis.sort(compareTagsMetrics('count'))
}

function compareTagsMetrics (metric) {
  return (a, b) => {
    const metricA = a[metric]
    const metricB = b[metric]
    if (metricA > metricB) {
      return -1;
    }

    if (metricA < metricB) {
      return 1;
    }

    return 0;
  }
}

function countTags (html) {
  const regex = /<((?:\w|-)+)(?:\s|>)/g
  const tags = [...html.matchAll(regex)].map(([_, tag]) => tag)
  return tags.reduce((tagsCount, tag) => {
    if (!tagsCount[tag]) {
      tagsCount[tag] = 0
    }

    tagsCount[tag]++
    return tagsCount
  }, {})
}

function calculateGeneralProportionality (html) {
  const temp = document.createElement('div')
  temp.innerHTML = html

  const formattedHtml = formatText(temp.innerHTML)
  const content = formatText(temp.innerText)

  const totalLength = formattedHtml.length
  const contentPercentage = getPercentage(content.length, totalLength)
  const codePercentage = getPercentage(totalLength - content.length, totalLength)

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

function renderResults ({ proportionality, tags }) {
  const proportionalityText = `
    <h2>General proportionality:</h2>
    <p><strong>Code:</strong> ${proportionality.code}%</p>
    <p><strong>Content:</strong> ${proportionality.content}%</p>
  `

  // const tagsText = `
  //   <h2>Tags:</h2>
  //   <table>
  //     <thead>
  //       <tr>
  //         <td><strong>Tag</strong></td>
  //         <td><strong>Proportionality</strong></td>
  //         <td><strong>Count</strong></td>
  //       </tr>
  //     </thead>
  //     <tbody>
  //       ${tags.map(({tag, count, contentPercent}) => `
  //         <tr>
  //           <td><strong>${tag}</strong></td>
  //           <td>${contentPercent || '-'}%</td>
  //           <td>${count}</td>
  //         </tr>
  //       `).join('\n')}
  //     </tbody>
  //   </table>
  // `
  const tagsText = `
    <h2>Tags:</h2>
    <table>
      <thead>
        <tr>
          <td><strong>Tag</strong></td>
          <td><strong>Count</strong></td>
        </tr>
      </thead>
      <tbody>
        ${tags.map(({tag, count, contentPercent}) => `
          <tr>
            <td><strong>${tag}</strong></td>
            <td>${count}</td>
          </tr>
        `).join('\n')}
      </tbody>
    </table>
  `

  document.getElementById('results').innerHTML = proportionalityText + tagsText
}
