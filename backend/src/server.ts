import { createServer as createHttpsServer } from 'https'
import { createServer as createHttpServer } from 'http'
import { readFileSync, readFile } from 'fs'

if (!process.argv[2] || !process.argv[3]) {
  console.log('please provide hostname and port')
  process.exit(1)
}

const protocol = 'https'
const hostname = process.argv[2]
const port = process.argv[3]
const certDir = process.argv[4] || 'certs'
const publicDir = process.argv[5] || 'public'
const dataDir = process.argv[6] || 'data'
const baseUrl = `${protocol}://${hostname}:${port}`

const logInfo = (msg: string) => console.info(`${new Date()}: ${msg}`)
const logErr = (err: string | Error) => console.error(`${new Date()}: ${err}`)

const options = {
  key: readFileSync(`${certDir}/key.pem`),
  cert: readFileSync(`${certDir}/cert.pem`),
}

const server = createHttpsServer(options, (req, res) => {
  const reqUrl = new URL(req.url, baseUrl)
  if (reqUrl.pathname == '/service') {
    const testNum = reqUrl.searchParams.get('test')
    readFile(`${dataDir}/test_${testNum}.json`, (err, data) => {
      if (err) {
        logErr(err)
        res.writeHead(404, { 'Content-Type': 'text/html' })
        return res.end('404 Not Found')
      }
      res.writeHead(200, { 'Content-Type': 'application/json' })
      return res.end(data.toString())
    })
  } else {
    let route = publicDir
    if (reqUrl.pathname == '/') route += '/index.html'
    else route += reqUrl.pathname

    readFile(route, (err, data) => {
      logInfo(`${route} was requested`)
      let contentType: string
      switch (route.substr(route.lastIndexOf('.'))) {
        case '.html':
          contentType = 'text/html'
          break
        case '.js':
          contentType = 'application/javascript'
          break
        case '.json':
          contentType = 'application/json'
          break
        case '.png':
          contentType = 'image/png'
          break
        case '.ico':
          contentType = 'image/ico'
          break
        default:
          res.writeHead(415, { 'Content-Type': 'text/html' })
          return res.end('415 Unsupported Media Type')
      }

      if (err) {
        logErr(err)
        res.writeHead(404, { 'Content-Type': 'text/html' })
        return res.end('404 Not Found')
      }
      res.writeHead(200, { 'Content-Type': contentType })
      res.write(data)
      return res.end()
    })
  }
}).listen(port, () => {
  logInfo(`Server listening on ${baseUrl}`)
})

const httpServer =
  process.env.NODE_ENV == 'production'
    ? createHttpServer((req, res) => {
        const redirect = `${baseUrl}${req.url}`
        res.writeHead(301, { Location: redirect })
        res.end()
      }).listen(80, () => {
        logInfo(`Redirecting http requests to ${baseUrl}`)
      })
    : null

const handleExit = (signal) => {
  logInfo(`Received ${signal} -> Server shutting down`)
  httpServer?.close()
  server.close(() => {
    process.exit(0)
  })
}

process.on('SIGQUIT', handleExit)
process.on('SIGTERM', handleExit)
process.on('SIGINT', handleExit)
