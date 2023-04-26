import express, { Express } from 'express';
import cors from 'cors';
import { executeProvider, FetchProviderDoc } from 'linkfetch';

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}

type User = {
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

type Config = { id: string };
const root: FetchProviderDoc<User, Config> = {
  $data: async (config) => {
    return {
      name: 'linkfetch',
      id: config.id,
      address: {
        $ref: `http://localhost:3000/users/${config.id}/address`
      }
    }
  },
  address: {
    $data: async (config) => {
      return {
        zip: '6484',
        detail: {
          // first: 'first',
          // last: 'last',
          $ref: `http://localhost:3000/users/${config.id}/address/detail`
        }
      }
    },
    detail: {
      $data: async (config) => {
        return {
          first: `first-88 ${config.id}`,
          last: `last-64-${config.id}`
        }
      }
    }
  }
}

const app: Express = express();
app.use(cors(corsOptions)) // Use this after the variable declaration
app.get('/', (req, res) => {
  res.send('Hello World! linkfetch server');
});

app.get('/users/:id', async (req, res) => {
  const data = await executeProvider<User, Config>(root, [], {id: req.params.id});
  res.json(data);
});

app.get('/users/:id/*', async (req, res) => {
  const paths = req.path.split('/').splice(3);
  console.log('request path', paths, req.params.id);
  const data = await executeProvider(root, paths, {id: req.params.id});
  res.json(data);
});

app.listen(3000, () => {
  console.log('Server started at port 3000');
});
