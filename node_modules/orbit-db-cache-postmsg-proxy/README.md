## orbit-db-cache-postmsg-proxy

PostMessage Proxy Cache for orbit-db, wraps [orbit-db-cache](https://github.com/orbitdb/orbit-db-cache).

#### Use Case

If configured with [ipfs-postmsg-proxy](https://github.com/ipfs-shipyard/ipfs-postmsg-proxy), allows for all orbitdb state to be stored in iframe. Allowing the same store to be shared across domains. Minimizing syncs and times to load DBs. Reference [3box-js](https://github.com/uport-project/3box-js) for an example which implements this.

### Used in

* [orbit-db](https://github/com/orbitdb/orbit-db)

### Usage

Server/Client model that has an RPC interface bewteen the two. The "server" will run the cache and the store state. It waits for requests from the "client". The "client" implements the same API as [orbit-db-cache](https://github.com/orbitdb/orbit-db-cache), but all function calls are sent and executed by the "server". Use in "client" window the same way you would use [orbit-db-cache](https://github.com/orbitdb/orbit-db-cache).

#### Server

In the "server" window (likely an iframe):

```js
import { Server } from 'orbit-db-cache-postmsg-proxy'

Server()
```
#### Client

In the "client" window (likely parent window):

```js
import { Client } from 'orbit-db-cache-postmsg-proxy'
import OrbitDB from 'orbit-db'
...

const cache = Client()
new OrbitDB(ipfs, orbitPath, {cache})
```

#### Client API

Reference [orbit-db-cache](https://github.com/orbitdb/orbit-db-cache)
