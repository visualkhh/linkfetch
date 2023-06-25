import { User } from './types/User';
import { FetchObjectOrDocType, FetchRequest, GlobalFetcher, linkfetch } from 'linkfetch';

type Req = {
  id: string;
  queryId: string;
}
(async () => {
  const doc: FetchObjectOrDocType<User> = {
    $ref: 'http://localhost:3000/users/1',
    address: {
      $ref: 'http://localhost:3000/users/1/address'
    }
  };
// const a: FlatKeyExcludeArrayDeep<User> = {
// }
  const defaultRequest: FetchRequest<User, Req> = {
    // $request: {id: '1', queryId: 'q1'},
    $request: {wow: '33'},
    $config: {optionId: {is: true}},
    $flushUpdate: true,
    friends: {
      // $request: {wow:''},
      // $request: {wowfriends: 'aa'},
      $request: {
        wowfriends: 'aa',
        wowfriend: 'aa',
      },
      $config: {id: {format: 'friends defaultConfig'}},
      // $fetch: async (r, p) => {
      //   // p?.path
      //   p?.request?.wowfriends
      //   return '' as any;
      // }


    },
    office: {
      $request: {id: '2', queryId: 'q2'},
      $fetch: async (r, p) => {
        return {}
      },
      colleagues: {
        $request: {
          wowfriends: 'aa',
          wowfriend: 'aa',
        },
        address: {
          $request: {
            id: '1',
          }
          // $fetch: async (r, p) => {
          //   return '' as any;
          // }
        }
      }
    },
    address: {
      // $request: {id: '3', queryId: 'q3'},
      $request: {wowaddress: 'aa'},
      $config: {'details.last': {is: true}},
      // $fetch: async (r, config?:  FetchConfigConsumer<Req | {test: string}, User>) => {
      //   if (config?.request && 'test' in config.request) {
      //     config.request.test
      //   }
      $fetch: async (r, c) => {
        // @ts-ignore
        // c.root.then(it => {
        //   console.log('address defaultconfig root-------!!', it)
        // })
        console.log('address defaultconfig root--------', root);
        // const a = await c.root
        // c.request.id;
        return fetcher(r, c as any);
      },

      details: {
        $request: {id: '3', queryId: 'q3'},
        $config: {first: {format: 'details defaultConfig'}}

      }
    }
  }
  const fetcher: GlobalFetcher<Req, User> = async (doc, config) => {
    // console.log('doc------>', doc);
    console.log('config------>', doc);
    // config.path;
    // config.value;
    // config.request
    // const a = config.path;
    if (config.path === 'address') {
      // config.request;
      // config.value.
      // config.path;
      // config.request?.wowaddress;
      //   type a = FlatObjectKeyExcludeArrayDepp<User>[typeof config.path]
      //   const aa: a = {
      //
      //   }
      //   config.request?.wowaddress;
    }
    // if (config.path === 'office') {
    //   config.request
    // }
    // if (config?.request && ('wowaddress' in config?.request)) {
    // config.request.
    // }
    ;
    console.dir(config, {depth: 10});
    if (doc) {
      console.log('------->', doc.$ref)
      const url = new URL(doc.$ref);
      if (config.request) {
        Object.entries(config.request).forEach(([key, value]) => {
          url.searchParams.set(key, value);
        });
      }
      // url.searchParams.set('queryId', config?.request?.queryId ?? 'none');
      // @ts-ignore
      const body = doc?.$config ? JSON.stringify(doc.$config) : undefined;
      // console.log('body-->', body)
      const responsePromise = fetch(
        url,
        {
          method: 'POST',
          body: body,
          headers: {Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json'}
        }
      );
      const dataPromise = responsePromise.then(it => it.json());
      return dataPromise;
    } else {
      return Promise.resolve(config?.value);
    }
  }


  const dataSet = {
    data: doc,
    defaultRequest: defaultRequest
  };
  const root = await linkfetch<User, Req>(dataSet, fetcher,
    {
      request: {wow: '1'},
      config: {},
      linkfetchConfig: {cached: true}
    }
  );
  console.log('\n\n\n');
  console.dir(root, {depth: 10});

  const friends = await root.friends({
    request: {

      wowfriends: '',
      wowfriend: ''

    },
    config: {}
  });
  friends.forEach(async (it, index) => {
    console.log(it);
    const address = await it.address({
      request: {
        id: '' + index
      }
    });
    console.log('address--->', address);
  })
  console.log('friends--->', friends);


  root.$$fetch({
    path: 'friends'
  })
  // const address = await root.address({
  //   config: {
  //
  //   }
  // });
  // console.log('---end-->', root);
  // const details = await address.details()
  // const subDetails = await details.subDetails().catch(() => {
  //   return {first:'zzzzz', last: 'zzzzz'}
  // });
  // console.log('----->', address, details, subDetails)

  console.log('=========================\n');
  // const details = await root.$$fetch({
  //   path: 'address.details',
  //   request: {
  //     // '' : {wow: '2'},
  //     // 'address': {
  //     //  wowaddress: '3333',
  //     //   wowaddressggg: '331'
  //     // },
  //     friends: {
  //       wowfriends: '2222',
  //       gg: '2222'
  //     },
  //     'address.details': {
  //       id: 'address.details222211',
  //       queryId: 'address.details222211'
  //     }
  //   },
  //   config: {
  //     address: {
  //        zip: { format:'zipformat'}
  //     },
  //     'address.details': {
  //       first: {
  //         format: 'firstformat'
  //       },
  //       last: {
  //         is: true,
  //         format: 'lastformat'
  //       }
  //     }
  //
  //   },
  //   flushUpdate: true
  // });

  // const subDetails = await details.subDetails()
  // console.log('details---->', details, subDetails);

  // const address = await root.address({
  //   config: {
  //
  //     zip: {},
  //     'details.first': {
  //
  //     }
  //   }
  // });
  // const office = await root.office();
  // console.log('office---->', office);
  // const colleagues = await office.colleagues();
  // console.log('colleagues---->', colleagues);

  // console.log('address---->', address);
  // const details = await address.details({
  //   config: {
  //     last: {},
  //     first: {}
  //   }
  // });
  // console.log('detail---->', details);
  // const friends = await root.friends()
  // console.log('friends---->', friends);
  // friends.forEach(it => {
  //   console.log('!!------>', it.id)
  // })
  // console.dir(details, {depth: 10});

  // console.log('snapshot------------------');
  // console.dir(await root.$$snapshot({
  //   allFetch: true,
  //   request: {
  //     address: {
  //       wowaddress: '2',
  //       wowaddressggg: '22'
  //     },
  //     'address.details.subDetails': {
  //       id: 'address.details.subDetails id',
  //       queryId: 'address.details.subDetails queryId'
  //     }
  //   },
  //   config: {
  //     'address.details.subDetails': {
  //       first: {format:  'snapshot address.details.subDetails first'},
  //       last: {format: 'snapshot address.details.subDetails last'},
  //     }
  //   }
  // }), {depth: 10});

  // const r = await root.$$fetch({path: '', request: {wow:'11'}, config: {}})
  // console.log('----->', r)
  // await root.$$fetch({path: 'office.colleagues', config: {
  //   'address.detail.first': {},
  //   'address.detail.last': {},
  //     $forceUpdate: true
  //   }})
  //
  // const a = await root.address({
  //   request: {wowaddress: '11'},
  //   config: {
  //     'detail.last': {is: true},
  //     'detail.first': {},
  //   }
  // })
  // const o = await root.office();
  // const c = await o.colleagues({
  //   request: {id: '11', queryId: ''},
  //   config: {}
  // })
  // console.log('---->', a);
  // const f = await root.friends({request: {wowfriends: ''}, config: {}});


  // console.log('---->', f);
  // const o = await root.office()
  // console.log('---->', o);
  // const address = await root.address({request: {id: '77', queryId: '777'}});
  // console.log('-->', address);
  // const details = await address.detail({config: {first: {}}})
  // console.log('-->', details);
  // const address = await root.address();
  // console.groupEnd();
  // const address = await root.address({request: {id: '', queryId: ''}, config: {}});
  // const detail = await root.$$fetch({key: 'address.detail', request: {id: '1', queryId: 'zzzzz'}});
  // address.detail({config: {first: {}}})
  // console.log('address', address);
  // console.log('detail', detail);
  // console.log('JSON stringify:', JSON.stringify(await root.$$snapshot({allFetch: true})));

  // console.log('request all fetch------------------');
  // const requestData = await fetch('http://localhost:3000/users', {
  //   method: 'post',
  //   headers: {Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json'},
  //   body: JSON.stringify(defaultRequest)
  // }).then(it => it.json())
  // console.log('requestData');
  // console.dir(requestData, {depth: 5})
  // const request = await linkfetch<User, Req>({
  //   data: requestData,
  //   defaultRequest: defaultRequest
  // }, fetcher, {linkfetchConfig: {cached: true}});
  // console.log('JSON stringify:', JSON.stringify(await request.$$snapshot({allFetch: true})));
})();
