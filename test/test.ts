import { FlatObjectKey, FlatKeyArrayItemAndDeleteType, RequestType } from 'linkfetch';

export type Friend = {
  name: string;
  id: string;
  age: number,
  address: {
    first: string;
    last: string;
    lastAddr2?: string;
  }
}
const user = {
  name: 'linkfetch',
  id: '1',
  address: {
    zip: '6484',
    detail: {
      first: 'first',
    }
  },
  friends: [{id:'', age: 2 , address: {first:'2', last:'2', lastAddr2:'2'}, name:'2'}] as Friend[]
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
export type GetPath<T, P extends string> =
  P extends `${infer K}.${infer R}`
    ?
    K extends keyof T ? GetPath<T[K], R> : never
    :
    P extends keyof (T extends (infer AI)[] ? AI : T) ? (T extends (infer AI)[] ? AI : T)[P] :(P extends string ? T : never);
// P extends keyof (T extends (infer AI)[] ? AI : T) ? (T extends (infer AI)[] ? AI : T)[P] : (P extends string ? T : never);
export type FlatKeyExcludeArrayDeep<T> = {
  [P in keyof T as // @ts-ignore
    T[P] extends any[] ? `${P}` : T[P] extends object
      ?
      // @ts-ignore
      `${P}.${keyof FlatKeyExcludeArrayDeep<T[P]>}` | `${P}`
      :
      // @ts-ignore
      `${P}`]: unknown;
}
type AAA = GetPath<User, 'friends.address'>
// const a: AAA = {
//
// }
export type FlatObjectKeyExcludeArrayDepp<T> = {
  // @ts-ignore
  [P in keyof FlatKeyExcludeArrayDeep<T> as GetPath<T, P> extends object ? P : never]: GetPath<T, P>;
} & { '': T };

type NoOffice = {}
type Office = {
  $wow: {gggg:'1'},
  name: {
    $wow: number
  };
  age: {
    $wow: string;
  };
}
type TT = FlatObjectKeyExcludeArrayDepp<Office>
const t: TT = {
  'name': {$wow: 1},
  age: {$wow: '1'},
  '' : {$wow:{gggg:'1'}, name: {$wow: 1}, age: {$wow: '1'}},
  $wow: {gggg:'1'}
}

type ValueOf<T> = T[keyof T];
type ExcludeNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};
type AAA = {
  [K in keyof TT]: TT[K] extends { ['$wow']: infer U } ? U : never;
};

const aa:ExcludeNever<AAA> = {
  '': {gggg:'1'},
  name: 1,
  age: '1',
}

const a:ValueOf<AAA> = '22'

type WOW = {
  name: string,
  age: number
}

type NameOrAge = ValueOf<WOW>;

// Recursive utility type to extract all `$wow` field values
// type ExtractWowField<T> = {
//   [K in keyof T]: T[K] extends { $wow: infer U } ? U : T[K] extends object ? ExtractWowField<T[K]> : never;
// }
// type ExtractWowField<T> = T extends { $wow: infer U } ? U : T extends object ? {
//   [K in keyof T]: ExtractWowField<T[K]>;
// } : never;

// Extract all `$wow` field values from `Office` type
// type WowFieldValues = ExtractWowField<Office>;
// Usage example
// const wowValue0: WowFieldValues = {age: '', name: 1, good: {job: {name: 'aa'}}};
// console.log('-------', wowValue0);
// const wowValue1: WowFieldValues = { gggg: '1' };
// const wowValue2: WowFieldValues = 42; // Error: Type 'number' is not assignable to type '{ gggg: string; }'
// const wowValue3: WowFieldValues = { name: 'aa' }; // Error: Type 'string' is not assignable to type 'number'

// type ZA = {
//   zname: string;
//   zage: number;
// }
//
// type ZB<K extends keyof ZA = keyof ZA> = {
//   key: K;
//   value: ZA[K];
// }
//
// const zb: ZB<'zname'> = {
//   key: 'zname' ,
//   value: 1
// } as const


// type ZA = {
//   zname: string;
//   zage: number;
// }
// type ZB<K = keyof ZA> = K extends keyof ZA ? {
//   key: K;
//   value: ZA[K];
// } : never;
//
// let zb: ZB = {
//   key: 'zname',
//   value: '1'
// }
// zb = {
//   key : 'zage',
//   value : 1
// }
//
// if (zb.key === 'zname') {
//   zb.value;
//   // @ts-ignore
// } else if (zb.key === 'zage') {
//   // @ts-ignore
//   zb.value;
// }
// type ExtractOptionalUndefined<T> = {
//   [K in keyof T as undefined extends T[K] ? K : never]: T[K];
// };
//
// // Example usage
// type A = { name?: string; age: number; city?: string };
//
// type OptionalUndefinedFields = ExtractOptionalUndefined<A>;


//
// type ExtractOptionalUndefined<T> = {
//   [K in keyof T as undefined extends T[K] ? K : never]: T[K];
// };
//
// type ExtractOnlyOptionalUndefined<T> = Omit<T, keyof ExtractOptionalUndefined<T>>;
//
// // Example usage
// type A = { name?: string; age: number; city?: string };
//
// type OnlyOptionalUndefinedFields = ExtractOnlyOptionalUndefined<A>
//
//
//
// type WOW = {name?: string, age: number, address?: string};
// type ExtractOptionalUndefined<T> = {
//   [K in keyof T as undefined extends T[K] ? K : never]: T[K];
//   // [K in keyof T as T[K] extends undefined ? K : never]: T[K];
// }
// type w = ExtractOptionalUndefined<WOW>;
// const ww: w = {
//
// }
//
//
//
// type UU = {
//   name: string;
// }
//
// // @ts-ignore
// type UU2<T, C, W> = undefined extends UU[C]  ? W : UU[C];
//
// const u: UU2<UU, 'name', number> = ''
//
// export type AA<T> = {
//   [K in keyof T as T[K] extends object ? K : never]: T[K]
// }
//
//
// type AAA = AA<{name: string, age: number, aa: {}, aaa: string[]}>;

type A<T> = {
  [P in keyof T as T[P] extends object ? P : never]: T[P]
}

type B = A<{name: string, age: number, aa: {}, aaa: string[]}>;

type C = FlatKeyArrayItemAndDeleteType<B>;
// const c: C =

type a = {
  users: {name: 'ss'}[]
  off: {
    name: 's'
  }
}

