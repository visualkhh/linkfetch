import { FlatObjectKey } from 'linkfetch';

const user = {
  name: 'linkfetch',
  id: '1',
  address: {
    zip: '6484',
    detail: {
      first: 'first',
    }
  }
}
type User = typeof user;

const getObject = <P extends keyof FlatObjectKey<User>>(path: P): FlatObjectKey<User>[P] => {
  const data: FlatObjectKey<User> = {
    address: user.address,
    'address.detail': user.address.detail
  };
  return data[path];
}

const detail = getObject('address.detail');
//
// const a = <T>(wow: T) => {
//  return wow;
//
// }
// const z= typeof a;
// const ww = a<string>(1);
//
// type A<T>= {
//   go: <Z>(p:T, z:Z) => T
// }
//
// const f: A<string> = {
//   go: a
// }