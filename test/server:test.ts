import express, { Express } from 'express';
import cors from 'cors';
import { FetchRequestParameter, FetchProducerDoc, producer, FlatObjectKey, FetchDoc, FetchProducerDocReturnType } from 'linkfetch';
import { User } from './types/User';

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200
}

type Reg = { id: string, queryId?: string };
const doc: FetchProducerDoc<User, Reg> = {
  $fetch: async (r,) => {
    console.log('-root---------', r);
    return {
      name: 'linkfetch',
      id: r.request?.id + `(queryId:${r.request?.queryId})`,
      address: {
        $ref: `http://localhost:3000/users/${r.request?.id}/address`,
        $config: {
          zip: {is: true},
        }
      }
    };
  },
  address: {
    // $fetch: async (r: FetchRequestParameter<Reg | {test: string}, User>) => {
    //   if (r.request && 'test' in r.request) {
    //   }
    $fetch: async (r: FetchRequestParameter<Reg, User>) => {
      console.log('-address---------', r);
      return {
        zip: '6484' + `(queryId:${r.request?.queryId})`,
        detail: {
          $ref: `http://localhost:3000/users/${r.request?.id}/address/detail`
        }
      }
    },
    detail: {
      $fetch: async (r) => {
        console.log('-detail---------', r);
        return {
          first: `first-88 ${r.request?.id}` + `(queryId:${r.request?.queryId})`,
          last: `last-64-${r.request?.id}` + `(queryId:${r.request?.queryId})`
        }
      }
    }
  }
}

const root = producer<User, Reg>(doc);
// type a = FlatObjectKey<User>;
// (async () => {
//   const a = await root.$$fetch({key:'address.detail'});
// })();
const app: Express = express();
app.use(cors(corsOptions)) // Use this after the variable declaration
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World! linkfetch server');
});

app.post('/users', async (req, res) => {
  console.log('user--!! server, body request post');
  console.dir(req.body, {depth: 10});
  const data = await root.$$request(req.body);
  console.log('user--!! server, body response');
  console.dir(data, {depth: 10});
  res.json(data);
});

app.post('/users/:id', async (req, res) => {
  console.log('request path', req.path, req.params.id);
  console.dir(req.body, {depth: 10});
  // const promise = await root.$$fetch({key:'address.detail'});
  const data = await root.$$fetch({
    request: {id: req.params.id, queryId: req.query.queryId as string},
    config: req.body
  });
  // console.log('response-->', data)
  res.json(data);
});

app.post('/users/:id/*', async (req, res) => {
  const paths = req.path.split('/').splice(3).join('.') as keyof FlatObjectKey<User>;
  console.log('request path', req.path, paths, req.params.id);
  console.dir(req.body, {depth: 10});
  const data = await root.$$fetch({
    path: paths,
    request: {id: req.params.id, queryId: req.query.queryId as string},
    config: req.body
  })
  // console.log('response-->', data)
  res.json(data);
});

app.listen(3000, () => {
  console.log('Server started at port 3000');
});