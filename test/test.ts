export type GetPath<T, P extends string> =
  P extends `${infer K}.${infer R}`
    ?
    K extends keyof T ? GetPath<T[K], R> : never
    :
    P extends keyof T ? T[P] : (P extends string ? T : never);

export type W<T> = {
  [P in keyof T]: any;
}

type Created = { 'a': 1, 'b': 2, c: { d: 'd', 'w': 'w', g: { name: 'an'} } };
type TT<T> = {
  // [P in keyof T as T[P] extends object ? `${P}.` : `${P}`]: T[P] extends object ? TT<T[P]> : T[P];
  [P in keyof T as T[P] extends object
    ?
      // GetPath<T, `${P}.${keyof TT<T[P]>}`> extends object ? `${P}.${keyof TT<T[P]>}` : never
      // `get${P}`
     `${P}.${keyof TT<T[P]>}` | `${P}`
    :
    // never
    `${P}`
  ]: unknown;
}
type TTT<T> = {
  [P in keyof TT<T> as GetPath<T, P> extends object ? P : never]: GetPath<T, P>;
}
// & {
//   [P in keyof T as T[P] extends object ? `${P}.${keyof TT<T[P]>}` : `${P}`]?: T[P] extends object ? TT<T[P]> : T[P];
// }
type User = {
  name: string;
  id: string;
  address: {
    detail: {
      first: string;
    }
  }
}

const user: User = {
  name: '1',
  id: '2',
  address: {
    detail: {
      first: '3'
    }
  }
}

// const aa: TT<User> = {
// }
const aaa: TTT<User> = {
  'address.detail': {
    first: '3'
  },
  address: {
    detail: {
      first: '3'
    }
  }
}
const zz  = aaa['address.detail'];
const z1 = aaa['address'];

type a = keyof TT<Created>
// type ValueAtPath<T, K extends string> = K extends `${infer FirstKey}.${infer RestKeys}`
//   ? FirstKey extends keyof T
//     ? ValueAtPath<T[FirstKey], RestKeys>
//     : never
//   : K extends keyof T
//     ? T[K]
//     : never;

export type DiveIntoObject<Obj, Keys extends unknown[]> =
  Keys['length'] extends 0
    ? Obj
    : Keys extends [
        infer FirstKey extends keyof Obj, ...infer Rest
      ]
      ? DiveIntoObject<Obj[FirstKey], Rest>
      :never;



// const execute = <T, P>(data: T, path: string): GetPath<T, typeof path> =>  {
const execute = <T, P extends keyof TTT<T>>(data: T, path: P):  TTT<T>[P] =>  {
 const a = {} as TTT<T>;
  const aElement = a[path];
  return aElement;
}


type A = GetPath<User, 'address.detail'>;
const data = 'address.detail.first' as const;
type B = typeof data;
let b = 's'.split('.');
let detail = `address.detail${b[0]}` ;
(detail as any)='z';
const a = execute(user, detail as keyof TTT<User>);

const zzzzz = aaa['address.detail']