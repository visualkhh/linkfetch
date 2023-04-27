import {
  executeFieldFetch, FetchObjectType, linkfetch, linkfieldfetch,
} from 'linkfetch';
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
  const data = createUserDoc('1');
  const fetchObject = await  linkfieldfetch<User, UserConfig>(data, (data, config) => {
    if (data) {
      const responsePromise = fetch(data.$ref, {method: 'GET'});
      return responsePromise.then(it => it.json());
    } else {
      return Promise.resolve(undefined);
    }
  }, {linkfetchConfig: {cached: true}})();

  // console.group('first')
  const zzz  = await executeFieldFetch(fetchObject, 'address.detail', {id: '2'});
  // console.groupEnd();
  // console.group('second')
  const zz1  = await executeFieldFetch(fetchObject, 'address.detail', {id: '2'});
  // console.groupEnd();
  // const aaa = await f.address().then(it => it.detail())
  // console.log('----->', aaa);
  // const aaa2 = await f.address().then(it => it.detail())
  // console.log('----->', aaa2);
  // console.log('----->', zzz);
  // const a = await fetchObjectf.address();
  // const d = await a.detail();
  // const d2 = await a.detail();
  // const d3 = await a.detail();
  // console.log('-----',  f)
  // console.log('-----',  d)
  // console.log('-----',  d2)
})();
