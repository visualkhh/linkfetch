import {
  executeFieldFetch, FetchObjectType, linkfetch, linkfieldfetch,
} from 'linkfetch';
import {FetchProxyKey} from 'linkfetch/FetchProxy';
import {FieldFetchProxyKey} from 'linkfetch/FieldFetchProxy';
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
    $ref: `http://localhost:3000/users/${id}`
  }
}
//
// (async () => {
//   const data = createUserDoc('1');
//   const fetchObject = await linkfetch<User, UserConfig>(data, (data, config) => {
//     if (data.doc) {
//       return fetch(data.doc!.$ref, {method: 'GET'}).then(it => it.json());
//     } else {
//       return Promise.resolve(data.value);
//     }
//   }, {linkfetchConfig: {cached: true}});
//   const detail = await fetchObject.$$fetch('address.detail', {id: '2'});
//   console.log('---->', detail);
//   console.log(JSON.stringify(fetchObject));
// })();

(async () => {
  console.log('start!!')
  const data = createUserDoc('1');
  const fetchObject = linkfieldfetch<User, UserConfig>(data, (data, config) => {
    console.log('fetch!!!', data, config);
    if (data) {
      const responsePromise = fetch(data.$ref, {method: 'GET'});
      return responsePromise.then(it => it.json());
    } else {
      return Promise.resolve(undefined);
    }
  }, {linkfetchConfig: {cached: true}})();
  const f = await fetchObject;

  // const zzz  = await executeFieldFetch(f, 'address.detail', {id: '2'});
  // console.log('----->', zzz);
  const a = await f.address();
  const d = await a.detail();
  const d2 = await a.detail();
  console.log('-----',  f)
  console.log('-----',  d)
  console.log('-----',  d2)
})();
