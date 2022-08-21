export function saveCSV(title, head, data) {
  let wordSeparator = ','
  let lineSeparator = '\n'

  let reTitle = title + '.csv'
  let headBOM = '\ufeff'
  let headStr = head ? head.map(item => format(item)).join(wordSeparator) + lineSeparator : ''
  let dataStr = data ? data.map(row => row.map(item => format(item)).join(wordSeparator)).join(lineSeparator) : '';
  // let dataStr = data ? data.map(row => row.ArrayType + wordSeparator + row.data + lineSeparator) : '';

  return isMSbrowser()
    ? new Promise(resolve => { // Edge、IE11
      let blob = new Blob([headBOM + headStr + dataStr], { type: 'text/plain;charset=utf-8' })
      window.navigator.msSaveBlob(blob, reTitle)
      resolve()
    })
    : new Promise(resolve => { // Chrome、Firefox
      let a = document.createElement('a')
      a.href = 'data:text/csv;charset=utf-8,' + headBOM + encodeURIComponent(headStr + dataStr)
      a.download = reTitle
      a.click()
      resolve()
    })
}