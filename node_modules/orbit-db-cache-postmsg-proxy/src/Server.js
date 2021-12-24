const expose = require('postmsg-rpc').expose
const Cache = require('orbit-db-cache')

let cache


const CacheService = {
  load: async (directory, dbAddress) => {
    cache = await Cache.load(directory, dbAddress)
    return
  },
  closeAll: async () => {
    await Cache.close()
    return
  },
  open: async () => {
    if (!cache) throw new Error('Load cache')
    await cache.open()
    return
  },
  close: async () => {
    if (!cache) throw new Error('Load cache')
    await cache.close()
    return
  },
  destory: async () => {
    if (!cache) throw new Error('Load cache')
    await cache.destroy()
    return
  },
  set: async (key, value) => {
    if (!cache) throw new Error('Load cache')
    return await cache.set(key,value)
  },
  get: async (key) => {
    if (!cache) throw new Error('Load cache')
    const value = await cache.get(key)
    return value
  },
  del: async (key) => {
    if (!cache) throw new Error('Load cache')
    await cache.del(key)
    return
  }
}

const Start = (opts) => {
  expose('load', CacheService.load, opts)
  expose('closeAll', CacheService.closeAll, opts)
  expose('open', CacheService.open, opts)
  expose('close', CacheService.close, opts)
  expose('destory', CacheService.destroy, opts)
  expose('get', CacheService.get, opts)
  expose('set', CacheService.set, opts)
  expose('del', CacheService.del, opts)
}

module.exports = Start
