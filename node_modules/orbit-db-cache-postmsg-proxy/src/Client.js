const call = require( 'postmsg-rpc').call
const caller = require( 'postmsg-rpc').caller

class Cache {
  constructor (opts) {
    this.opts = opts
  }

  async open () {
    const open = caller('open', this.opts)
    return await open()
  }

  async close () {
    const close = caller('close', this.opts)
    return await close()
  }

  async destroy () {
    const destroy = caller('destroy', this.opts)
    return await destroy()
  }

  async get (key) {
    const get = caller('get', this.opts)
    return await get(key)
  }

  async set (key, value) {
    const set = caller('set', this.opts)
    return await set(key, value)
  }

  async del (key) {
    const del = caller('del', this.opts)
    return await del(key)
  }
}

const Start = (opts) => {
  return {
     load: async (directory, dbAddress) => {
       const load = caller('load', opts)
       await load(directory, dbAddress)
       return new Cache(opts)
     },
     close: async () => {
       const closeAll = caller('closeAll', opts)
       await closAll()
     },
   }
}

module.exports = Start
