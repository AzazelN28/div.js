function injectScript(source) 
{
  const blob = new Blob([source], { type: 'text/javascript' })
  const url = URL.createObjectURL(blob)
  const script = document.createElement('script')
  script.src = url
  script.type = 'module'
  document.head.appendChild(script)
}
