linked lazy fetch!
===

[![typescript](https://img.shields.io/badge/-npm-black?logo=npm)](https://www.npmjs.com/package/linkfetch) [![license](https://img.shields.io/badge/license-MIT-green)](LICENSE.md)

* Supports Lazy fetch with field access.
* Provides cache.
* You can share types such as server and client. Significantly reduces bugs.
* You can also patch it all at once.

# 🚀 Quick start  install

```bash
npm install linkfetch
```

# ⚒️ example
- [![express](https://img.shields.io/badge/-server-black?logo=express)](./test/server:test.ts)
- [![typescript](https://img.shields.io/badge/-client-black?logo=typescript)](./test/node:test.ts)

[//]: # (- [![javascript]&#40;https://img.shields.io/badge/-web-black?logo=javascript&#41;]&#40;./test/web:test.html&#41;)


## linkfetch document protocol

```json
{
  "$ref": "lazy end point"
}
```

ex)

```json
{
  "name": "my name is linkfetch",
  "address": {
    "$ref": "https://localhost/user/1/address"
  }
}
```

# client node
```typescript
export type User = {
  name: string;
  id: string;
  address: {
    detail: {
      first: string;
      last: string;
    };
    zip: string;
  }
}
```

```typescript
import { User } from './types/User';
import { Fetcher, FetchObjectOrDocType, FetchRequest, linkfetch } from 'linkfetch';

type Req = {
  id: string;
  queryId: string;
}

const doc: FetchObjectOrDocType<User> = {
  $ref: 'http://localhost:3000/users/1',
};

const defaultRequest: FetchRequest<User, Req> = {
  $request: {id: '1', queryId: 'q1'},
  address: {
    $request: {id: '2', queryId: 'q2'},
    detail: {
      $request: {id: '3', queryId: 'q3'}
    }
  }
}

const fetcher: Fetcher<Req> = async (doc, config) => {
  if (doc) {
    const url = new URL(doc.$ref);
    url.searchParams.set('queryId', config?.req?.queryId ?? 'none');
    const responsePromise = fetch(url, {method: 'GET'});
    return responsePromise.then(it => it.json());
  } else {
    return Promise.resolve(config?.value);
  }
}

(async () => {
  console.log('lazy fetch------------------');
  const root = await linkfetch<User, Req>({data: doc, defaultRequest: defaultRequest}, fetcher, {linkfetchConfig: {cached: true}});
  const address = await root.address();
  const detail = await root.$$fetch({key: 'address.detail', req: {id: '1', queryId: 'zzzzz'}});
  console.log('address', address);
  console.log('detail', detail);
  console.log('JSON stringify:', JSON.stringify(await root.$$snapshot({allFetch: true})));


  console.log('request all fetch------------------');
  const requestData = await fetch('http://localhost:3000/users', {method: 'post', headers: {'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json'}, body: JSON.stringify(defaultRequest)}).then(it => it.json())
  console.log('requestData', requestData);
  const request = await linkfetch<User, Req>({data: requestData, defaultRequest: defaultRequest}, fetcher, {linkfetchConfig: {cached: true}});
  console.log('JSON stringify:', JSON.stringify(await request.$$snapshot({allFetch: true})));
})();

```


# server producer  
```typescript
import express, { Express } from 'express';
import cors from 'cors';
import { FetchProducerDoc, producer, FlatObjectKey } from 'linkfetch';
import { User } from './types/User';

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}

type Reg = { id: string, queryId?: string};
const doc: FetchProducerDoc<User, Reg> = {
  $fetch: async (req) => {
    return {
      name: 'linkfetch',
      id: req.id + `(queryId:${req.queryId})`,
      address: {
        $ref: `http://localhost:3000/users/${req.id}/address`
      }
    }
  },
  address: {
    $fetch: async (req) => {
      return {
        zip: '6484' + `(queryId:${req.queryId})`,
        detail: {
          // first: 'first',
          // last: 'last',
          $ref: `http://localhost:3000/users/${req.id}/address/detail`
        }
      }
    },
    detail: {
      $fetch: async (req) => {
        return {
          first: `first-88 ${req.id}` + `(queryId:${req.queryId})`,
          last: `last-64-${req.id}` + `(queryId:${req.queryId})`
        }
      }
    }
  }
}

const root = producer(doc);
const app: Express = express();
app.use(cors(corsOptions)) // Use this after the variable declaration
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World! linkfetch server');
});

app.post('/users', async (req, res) => {
  const data = await root.$$request(req.body);
  console.log('user--!! server, body post');
  res.json(data);
});

app.get('/users/:id', async (req, res) => {
  console.log('request path', req.path, req.params.id);
  const data = await root.$$fetch({req: {id: req.params.id, queryId: req.query.queryId as string}});
  res.json(data);
});

app.get('/users/:id/*', async (req, res) => {
  const paths = req.path.split('/').splice(3).join('.') as keyof FlatObjectKey<User>;
  console.log('request path', paths, req.params.id);
  const data = await root.$$fetch({key: paths , req: {id: req.params.id, queryId: req.query.queryId as string}})
  res.json(data);
});

app.listen(3000, () => {
  console.log('Server started at port 3000');
});

```
