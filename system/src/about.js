
window.addEventListener('DOMContentLoaded', () => {
  try {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
  replaceText('os', process.platform);
  replaceText('arch',process.arch)
  replaceText('dir',process.execPath)
}
catch(err) {
console.error(err);
}
})
