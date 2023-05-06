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
