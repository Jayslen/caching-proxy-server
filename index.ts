#!/usr/bin/env bun
import { parseArgs } from 'util'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'bun'

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
  },
  strict: true,
  allowPositionals: true,
})

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
      (urlToRequest.pathname + urlToRequest.search)
        .slice(1)
        .replace(/[<>:"/\\|?*]+/g, '_') + '.json'

    const resourceChaceFile = path.join(cacheFolder, resourceFileChache)
    const isResourceCacheAvailable = await Bun.file(resourceChaceFile).exists()

    if (isResourceCacheAvailable) {
      const savedCache = await Bun.file(resourceChaceFile).json()
      console.log(savedCache)

      return Response.json(savedCache, {
        headers: {
          'X-Cache': 'HIT',
        },
      })
    }

    const response = await fetch(urlToRequest)
    const data = await response.json()

    await fs.writeFile(resourceChaceFile, JSON.stringify(data), {
      encoding: 'utf-8',
    })
    return Response.json(data, {
      headers: {
        'X-Cache': 'MISS',
      },
    })
  },
  error(error) {
    console.error(error)
    return new Response(error.message, {
      status: 400,
    })
  },
})

console.log(`Cache server proxy start on: http://localhost:${values.port}`)
