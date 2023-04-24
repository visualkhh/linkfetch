import express, { Express } from 'express';
import cors from 'cors';
import { FetchProvider } from 'linkfetch';

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

const root: FetchProvider<User, any> = {
  $data: (id: string) => {
    return {
      name: 'linkfetch',
      id: id,
      address: {
        $ref: `http://localhost:3000/users/${id}/address`
      }
    }
  },
  address: {
    $data: (id: string) => {
      return {
        zip: '6484',
        detail: {
          $ref: `http://localhost:3000/users/${id}/address/detail`
        }
      }
    },
    detail: {
      $data: (id: string) => {
        return {
          first: `first-88 ${id}`,
          last: `last-64-${id}`
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

app.get('/users/:id', (req, res) => {
  res.json(root.$data(req.params.id));
});

app.get('/users/:id/*', async (req, res) => {
  const paths = req.path.split('/').splice(3);
  console.log('request path', paths);
  let target = root;
  for (const path of paths) {
    target = (target as any)[path];
  }
  res.json(target.$data(req.params.id));
});

app.listen(3000, () => {
  console.log('Server started at port 3000');
});