# README

```json
{
  "manifest_version": 3,
  "name": "DIV DevTools",
  "version": "1.0.0",
  "content_security_policy": "script-src 'self' unsafe-eval'; object-src 'self'",
  "permissions": ["<all_urls>"],
  "minimum_chrome_version": "10.0",
  "devtools_page": "devtools.html",
  "background": {
    "scripts": ["background.js"]
  },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content-script.js"],
    "run_at": "document_end",
    "all_frames": true
  }],
  "icons": {
    "16": "images/icon-16.png",
    "32": "images/icon-32.png",
    "48": "images/icon-48.png",
    "128": "images/icon-128.png"
  }
}
```
