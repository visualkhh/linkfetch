import express, { Express } from 'express';
import cors from 'cors';
import { FetchRequestParameter, FetchStore, linkstore, FlatObjectKey, FetchDoc, RequestType, FetchProducerReturnType, FlatRootObjectKeyExcludeArrayDeppAndDeleteType, FlatObjectOnlyKeyArrayItemAndDeleteType } from 'linkfetch';
import { Friend, User } from './types/User';

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200
}

type Reg = { id: string, queryId?: string };
const doc: FetchStore<User, Reg> = {
  // 'friends': {
  //   $fetch: async () => {
  //     return '' as any;
  //   }
  // }

  $fetch: async (r,) => {

    console.log('-root---------', r);
    return {
      name: 'linkfetch',
      id: r.request?.wow + `(queryId:${r.request?.wow})`,
      // id: r.request?.id + `(queryId:${r.request?.queryId})`,
      address: {

        $ref: `http://localhost:3000/users/${r.request?.wow}/address`,
        // $ref: `http://localhost:3000/users/${r.request?.id}/address`,
        $config: {
          secondZip: {is: true},
        }
      },
      friends: {
        $ref: `http://localhost:3000/users/${r.request?.wow}/friends`,
        // $ref: `http://localhost:3000/users/${r.request?.id}/friends`,
      },
      office: {
        $ref: `http://localhost:3000/users/${r.request?.wow}/office`,
        // $ref: `http://localhost:3000/users/${r.request?.id}/office`,
      }

    } as any;
  },

  friends: {
    $fetch: async (r) => {
      console.log('-friends------aa---', r);
      const friend: FetchProducerReturnType<Friend>[] = [];
      for (let i = 0; i < 2; i++) {
        const id = `friend-${i}`;
        const item: FetchProducerReturnType<Friend> = {id: id, name: `friend-${id}`, age: 22 + i, address: {$ref: `http://localhost:3000/users/0/friends/address?id=${id}`}};
        friend.push(item);
      }
      return friend;
      // return [{name: '', id: '', age:0 , address: {}}];

      // return {
      //   name: '2',
      //   id: 'asd',
      //   age: 4,
      //   address: {
      //     $ref: `http://localhost:3000/users/0/friends/address?id=444`
      //     first: '6484',
      //     last: 'a'
      // }
      // }
      // @ts-ignore
      // return [friend] as (Friend[] & {
      //   [RequestType]: {
      //
      //     wowfriends: string;
      //     gg?: string;
      //   }
      // });
    },

    address: {
      $fetch: async (r) => {
        return {
          first: 'id=6484: ' + r.request?.id,
          last: 'a'
        }
      }
    }
  },
  ages: {
    $fetch: async (r) => {
      return [1, 2, 3];
    }
  },
  // office: {
  //   $fetch: async (r) => {
  //     console.log('-office---------', r);
  //     const user: User = {id: '112u2'} as User;
  //     const user2: User = {id: '112u2'} as User;
  //     return {colleagues: [user, user2]} as any;
  //     // return {
  //     //   colleagues: {
  //     //     $ref: `http://localhost:3000/users/1/office/colleagues`,
  //     //   }
  //     // };
  //   },
  //   colleagues: {
  //     $fetch: async (r) => {
  //       const user: User = {id: '2u2'} as User;
  //       const user2: User = {id: '2u2'} as User;
  //       return [user, user2] as any;
  //     }
  //   }
  // },

  address: {
    // $fetch: async (r: FetchRequestParameter<Reg | {test: string}, User>) => {
    //   if (r.request && 'test' in r.request) {
    //   }
    $fetch: async (r) => {

      console.log('-address---------', r);
      return {
        zip: '6484' + `(queryId:${r.request?.wowaddress})`,
        details: {
          $ref: `http://localhost:3000/users/${r.request?.wowaddress}/address/details`
        }
      }
    },
    details: {
      $fetch: async (r) => {
        console.log('-detail---------', r);
        return {
          first: `first-88 ${r.request?.id}` + `(queryId:${r.request?.queryId})`,
          last: `last-64-${r.request?.id}` + `(queryId:${r.request?.queryId})`,
          subDetails: {
            $ref: `http://localhost:3000/users/${r.request?.id}/address/details/subDetails`
          }
        }
      },
      subDetails: {
        $fetch: async (r) => {
          return {
            first: 'subDetails first',
            last: 'subDetails last',
          }
        }
      }
    }
  }
}

const root = linkstore<User, Reg>(doc);
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
  // const a = await root.$$fetch({path: 'friends', request: {wowfriends: ''}});
  const data = await root.$$fetch({
    path: '',
    // path: 'address',
    // wow: {},
    request: {wow: req.params.id},
    // request: {id: req.params.id, queryId: req.query.queryId as string},
    config: req.body
  });
  console.log('response-->', data)
  res.json(data);
})
;

// users/0/users/0/friends/address?id=friend-1
app.get('/users/:id/*', async (req, res) => {
  const paths = req.path.split('/').splice(3).join('.') as keyof FlatRootObjectKeyExcludeArrayDeppAndDeleteType<User>;
  const data = await root.$$fetch({
    path: paths as keyof FlatObjectOnlyKeyArrayItemAndDeleteType<User>,
    // request: {id: req.params.id, queryId: req.query.queryId as string},
    request: {id: req.query.id} as any,
    config: req.body
  });
  // root.$$fetch({path: 'friends.'})
  console.log('response-->', data)
  res.json(data);
});

app.post('/users/:id/*', async (req, res) => {
  const paths = req.path.split('/').splice(3).join('.') as keyof FlatRootObjectKeyExcludeArrayDeppAndDeleteType<User>;
  const requestData = {...req.params, ...req.query};
  console.log('request /users/:id/*  path', req.path, paths, requestData);
  console.dir(req.body, {depth: 10});
  const data = await root.$$fetch({
    path: paths as keyof FlatObjectOnlyKeyArrayItemAndDeleteType<User>,
    // request: {id: req.params.id, queryId: req.query.queryId as string},
    request: requestData,
    config: req.body
  })
  console.log('response-->', data)
  res.json(data);
});

root.$$fetch({path: 'friends.address', request: {id: '2'}}).then(it => {
  console.log('---', it)
})
app.listen(3000, () => {
  console.log('Server started at port 3000');
});