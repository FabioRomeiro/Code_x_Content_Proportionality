(function (window, document) {
  document.getElementById('form').addEventListener('submit', onSubmit);

  function onSubmit(event) {
    event.preventDefault();

    const htmlCode = getHtmlCode();

    if (!htmlCode) {
      return;
    }

    const codeReport = generateCodeReport(htmlCode);

    renderResults(codeReport);
  }

  function getHtmlCode() {
    return document.getElementById('code').value;
  }

  function generateCodeReport(html) {
    const report = getReport(html);
    const proportionality = calculateGeneralProportionality(report);

    return {
      report,
      proportionality,
    };
  }

  function getReport(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const allTags = doc.getElementsByTagName('*');
    const report = {};

    for (let index = 0; index < allTags.length; index++) {
      const element = allTags[index];
      const tagName = element.tagName.toLowerCase();
      const text = extractText(element);
      const outerHtml = formatText(element.outerHTML);
      const innerHTML = formatText(element.innerHTML);
      const tagLength = outerHtml.length - innerHTML.length;

      report[tagName] = {
        count: (report[tagName]?.count || 0) + 1,
        tagLength: (report[tagName]?.tagLength || 0) + tagLength,
        textLength: (report[tagName]?.textLength || 0) + text.length,
      };
    }

    return report;
  }

  function extractText(element) {
    excludedElements = ['script', 'style'];

    if (excludedElements.indexOf(element.tagName.toLowerCase()) === -1) {
      text = '';
      for (var i = 0; i < element.childNodes.length; ++i)
        if (element.childNodes[i].nodeType === Node.TEXT_NODE)
          text += element.childNodes[i].textContent;
      return formatText(text);
    }

    return '';
  }

  function calculateGeneralProportionality(report) {
    let totalTagLength = 0;
    let totalTextLength = 0;

    for (const tagReport of Object.values(report)) {
      totalTagLength += tagReport.tagLength;
      totalTextLength += tagReport.textLength;
    }

    const totalLength = totalTagLength + totalTextLength;
    const contentPercentage = getPercentage(totalTextLength, totalLength);
    const codePercentage = getPercentage(totalTagLength, totalLength);

    return {
      content: contentPercentage,
      code: codePercentage,
    };
  }

  function formatText(text) {
    return text.replace(/\n|(\s\s+)/g, '').trim();
  }

  function getPercentage(value, total) {
    const percentage = (value / total) * 100;
    return percentage.toFixed(2);
  }

  function renderResults({proportionality, report}) {
    const proportionalityText = `
      <h2>General proportionality:</h2>
      <p><strong>Code:</strong> ${proportionality.code}%</p>
      <p><strong>Content:</strong> ${proportionality.content}%</p>
    `;

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
          ${Object.entries(report)
            .map(
              ([tag, data]) => `
            <tr>
              <td><strong>${tag}</strong></td>
              <td>${data.count}</td>
            </tr>
          `,
            )
            .join('\n')}
        </tbody>
      </table>
    `;

    document.getElementById('results').innerHTML =
      proportionalityText + tagsText;
  }
})(window, document);
