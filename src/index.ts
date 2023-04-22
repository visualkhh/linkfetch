import { FetchProxy } from 'FetchProxy';
export const Prefix = '$' as const;
export type PrefixType = typeof Prefix;
export type FetchDoc = { $ref: string };

// export type FetchFieldPromiseType<T> =  Promise<T> ;
// export type FetchObjectPromiseType<T> = {
//   [P in keyof T]: T[P] extends object ? FetchObjectPromiseType<T[P]>  : FetchFieldPromiseType<T[P]>;
// }
// type Capitalize<T> = T extends `${infer F}${infer R}` ? `${Uppercase<F>}${R}` : T;
// export type FetchObjectPromiseObjectType<T> = {
//   [P in keyof T as `$${P}`]: T[P] extends object ? FetchObjectPromiseObjectType<T[P]>  : FetchFieldPromiseType<T[P]>;
// }
// [P in keyof T as `$${P}`]: FetchFieldPromiseType<T[P]>;

// export type FetchObjectPromiseType<T> = OptionalDeep<T> ;
// {
//   // [P in keyof T as `${PrefixType}${P}`]: T[P] extends object ? FetchFieldPromiseType<T[P]> : never;
// } & {
//   // [P in keyof T]?: T[P] extends object ? FetchObjectPromiseType<T[P]>  : T[P];
// } & OptionalDeep<T> ;

// type OptionalDeep<T> = {
//   [P in keyof T]?: T[P] extends object ? OptionalDeep<T[P]> : T[P];
// }
// type Optional<T> = {
//   [P in keyof T]?:  T[P];
// }
// type Capitalize<T> = T extends `${infer F}${infer R}` ? `${Uppercase<F>}${R}` : T;
// export type FetchFieldPromiseType<T, C> =  (config?: C) => Promise<T> ;
// export type FetchObjectPromiseObjectType<T> = {
//   [P in keyof T as `$${P}`]: T[P] extends object ? FetchObjectPromiseObjectType<T[P]>  : FetchFieldPromiseType<T[P]>;
// }
// [P in keyof T as `$${P}`]: FetchFieldPromiseType<T[P]>;


// export type FetchObjectPromiseType<T, C> = {
//   [P in keyof T as `${PrefixType}${P}`]-?: T[P] extends object ? FetchFieldPromiseType<T[P], C> : never;
// } & {
//   [P in keyof T]?: T[P] extends object ? OptionalDeep<FetchObjectPromiseType<T[P], C>> : T[P];
// };

export type FetchFieldPromiseType<T, C> =  (config?: C) => Promise<T> ;
export type FetchObjectPromiseType<T, C> = {
  [P in keyof T as `$${P}`]: T[P] extends object ? FetchFieldPromiseType<T[P], C> : never;
} & {
  [P in keyof T]?: T[P] extends object ? FetchObjectPromiseType<T[P], C> : T[P];
};;


export type FetchFieldType<T> =  T ;
export type FetchObjectType<T> = {
  [P in keyof T]: T[P] extends object ? FetchObjectType<T[P]> | FetchDoc : FetchFieldType<T[P]>;
}

export const linkFetch = <T = any, C = any>(docObject: FetchObjectType<T>, fetch:(data: {origin?: any, doc?: FetchDoc}, config: C) => Promise<any>): FetchObjectPromiseType<T, C> => {
  const doc = Object.assign({}, docObject) as any;
  const proxy = (field: any) => {
    if ('_FetchProxy_isProxy' in field) {
      return field;
    }

    Object.entries(field).filter(([key, value]) => typeof value === 'object' && !Array.isArray(value)).forEach(([key, value]) => {
      // console.log('===11>', key, value);
      if (!('_FetchProxy_isProxy' in (value as any))) {
        doc[key] = proxy(value);
      }
    });

    return new Proxy(field, new FetchProxy(field));
  }
  const r = proxy(doc);
  return r;
}

