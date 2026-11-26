import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve('dist')
const port = Number(process.env.PORT || 4173)
const base = '/bible-storybook'
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
}

async function read(relative) {
  const file = path.normalize(path.join(root, relative))
  if (!file.startsWith(root)) return null
  try {
    return await readFile(file)
  } catch {
    return null
  }
}

createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', 'http://127.0.0.1')
  let pathname = decodeURIComponent(url.pathname)
  if (pathname === base || pathname === `${base}/`) pathname = '/'
  else if (pathname.startsWith(`${base}/`)) pathname = pathname.slice(base.length) || '/'
  else {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
    response.end('This preview is served under /bible-storybook/')
    return
  }

  const relative = pathname.replace(/^\/+|\/+$/g, '')
  const extension = path.extname(relative)
  if (!relative) {
    const home = await read('index.html')
    response.writeHead(200, { 'content-type': types['.html'] })
    response.end(home)
    return
  }
  if (extension && extension !== '.html') {
    const asset = await read(relative)
    if (!asset) {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
      response.end('not found')
      return
    }
    response.writeHead(200, { 'content-type': types[extension] ?? 'application/octet-stream' })
    response.end(asset)
    return
  }

  const page = (await read(`${relative}.html`)) ?? (await read(path.join(relative, 'index.html'))) ?? (await read(relative))
  if (page) {
    response.writeHead(200, { 'content-type': types['.html'] })
    response.end(page)
    return
  }
  const fallback = await read('404.html')
  response.writeHead(fallback ? 404 : 404, { 'content-type': 'text/html; charset=utf-8' })
  response.end(fallback ?? 'not found')
}).listen(port, '127.0.0.1')
