import { fileURLToPath } from 'bun'
import fs from 'node:fs/promises'
import path from 'node:path'

const cacheFolderUrl = new URL('cache', import.meta.url)
const cacheFolder = fileURLToPath(cacheFolderUrl)

await fs.mkdir(cacheFolder, { recursive: true })

export class Cache {
  static async get(name: string) {
    const resourceChaceFile = path.join(cacheFolder, name)
    const isResourceCacheAvailable = await Bun.file(resourceChaceFile).exists()

    return isResourceCacheAvailable
      ? await Bun.file(resourceChaceFile).json()
      : null
  }

  static async set(name: string, value: any) {
    const cachePath = path.join(cacheFolder, name)
    await fs.writeFile(cachePath, JSON.stringify(value), {
      encoding: 'utf-8',
    })
  }

  static async clear() {
    const cacheFiles = await fs.readdir(cacheFolder)

    for (const file of cacheFiles) {
      await Bun.file(path.join(cacheFolder, file)).delete()
    }
  }
}
