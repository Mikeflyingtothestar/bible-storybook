import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve('dist')
const port = Number(process.env.PORT || 4173)
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
}

createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', 'http://127.0.0.1')
  const decoded = decodeURIComponent(url.pathname)
  const file = path.normalize(path.join(root, decoded))
  if (!file.startsWith(root)) {
    response.writeHead(403)
    response.end()
    return
  }
  try {
    const body = await readFile(file)
    response.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' })
    response.end(body)
  } catch {
    const index = await readFile(path.join(root, 'index.html'))
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    response.end(index)
  }
}).listen(port, '127.0.0.1')
