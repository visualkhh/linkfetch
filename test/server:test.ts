import express, { Express } from 'express';
import cors from 'cors';
import { linkfetch, FetchObjectType, FetchCallBack, ValueDocSet } from 'linkfetch';
const corsOptions ={
  origin:'*',
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

type User = {
  name: string;
  id: string;
  address: {
    detail: string;
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
  if (data.fieldName === 'address') {
    return {
      detail: `2 Frank Drive, Shelton,ct, 6484  United States id(${config?.config?.id})`,
      zip: '6484'
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
  const id = req.params.id;
  const fetchObject = await linkfetch<User, UserConfig>(createUserDoc(req.params.id), fetchUserRepository);
  const data = await fetchObject.$$fetch(paths, {id: id});
  res.json(data);
});


app.listen(3000, () => {
  console.log('Server started at port 3000');
});