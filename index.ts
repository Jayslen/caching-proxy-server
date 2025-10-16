#!/usr/bin/env bun
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'bun'
import { parseArgs } from 'util'
import { Cache } from './localCache'

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    port: {
      type: 'string',
      short: 'p',
      default: '8000',
    },
    origin: {
      type: 'string',
      default: '',
    },
    'clear-cache': {
      type: 'boolean',
    },
  },
  strict: true,
  allowPositionals: true,
})

if (values['clear-cache']) {
  try {
    await Cache.clear()
    console.log('All cache was deleted')
    process.exit(0)
  } catch (error) {
    console.error('An error occured while deleting the cache')
    process.exit(1)
  }
}

if (!URL.canParse(values.origin))
  throw new Error('The origin specified cannot be parse')

Bun.serve({
  port: values.port,
  async fetch(req) {
    const hostUrl = new URL(req.url)
    const origin = new URL(values.origin)

    const urlToRequest = new URL(hostUrl.pathname + hostUrl.search, origin.href)

    const cacheFolderUrl = new URL('cache', import.meta.url)
    const cacheFolder = fileURLToPath(cacheFolderUrl)

    await fs.mkdir(cacheFolder, { recursive: true })

    const resourceFileChache =
      path
        .join(origin.host, urlToRequest.pathname, urlToRequest.search)
        .slice(1)
        .replace(/[<>:"/\\|?*]+/g, '_') + '.json'
    const saveCache = await Cache.get(resourceFileChache)

    if (saveCache) {
      return Response.json(saveCache, {
        headers: {
          'X-Cache': 'HIT',
        },
      })
    }

    try {
      const response = await fetch(urlToRequest)
      const data = await response.json()

      await Cache.set(resourceFileChache, data)
      return Response.json(data, {
        headers: {
          'X-Cache': 'MISS',
        },
      })
    } catch (error) {
      console.log(error)
      return new Response('Internal error', { status: 500 })
    }
  },
  error(error) {
    console.error(error)
    return new Response(error.message, {
      status: 400,
    })
  },
})

console.log(`Cache server proxy start on: http://localhost:${values.port}`)
