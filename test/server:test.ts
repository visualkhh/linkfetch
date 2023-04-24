import express, { Express } from 'express';
import cors from 'cors';
import { FetchCallBack, FetchObjectType, linkfetch, ValueDocSet } from 'linkfetch';

const corsOptions = {
  origin: '*',
  credentials: true,            //access-control-allow-credentials:true
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
type UserConfig = {
  id: string;
}
const createUserDoc = (id: string): FetchObjectType<User> => {
  return {
    name: 'linkfetch',
    id: id,
    address: {
      $ref: `http://localhost:3000/users/${id}/address`,
    }
  }
}

const fetchUserRepository: FetchCallBack<UserConfig> = async (data: ValueDocSet, config) => {
  console.log('---------', data);
  if (data.fieldName === 'address') {
    return {
      detail: {$ref: `http://localhost:3000/users/${config?.config?.id}/address/detail`},
      zip: '6484'
    }
  } else if (data.fieldName === 'detail') {
    return {
      first: 'first-88',
      last: 'last-64'
    }
  } else {
    return {
      detail: `no detail id(${config?.config?.id})`,
      zip: 'no zip'
    }
  }
}

const app: Express = express();
app.use(cors(corsOptions)) // Use this after the variable declaration
app.get('/', (req, res) => {
  res.send('Hello World! linkfetch server');
});

app.get('/users/:id', (req, res) => {
  res.json(createUserDoc(req.params.id));
});

app.get('/users/:id/*', async (req, res) => {
  const paths = req.path.split('/').splice(3);
  console.log('------>', paths);
  const id = req.params.id;
  const fetchObject = await linkfetch<User, UserConfig>(createUserDoc(req.params.id), fetchUserRepository);
  if (paths[paths.length - 1] === 'address') {
    res.json({
      detail: {$ref: `http://localhost:3000/users/${id}/address/detail`},
      zip: '6484'
    });
  } else if (paths[paths.length - 1] === 'detail') {
    res.json({
      first: 'first-88',
      last: 'last-64'
    });
  } else {

    const data = await fetchObject.$$fetch(paths, {id: id});
    res.json(data);
  }
});


app.listen(3000, () => {
  console.log('Server started at port 3000');
});