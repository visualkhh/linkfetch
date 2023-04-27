import { FetchProxy, FetchProxyKey } from 'FetchProxy';
import { FieldFetchProxy, FieldFetchProxyKey } from 'FieldFetchProxy';

export const PrefixField = '$' as const;
export type PrefixFieldType = typeof PrefixField;
export const ProviderData = '$data' as const;
export type ProviderDataType = typeof ProviderData;

export const PrefixMetaField = '$$' as const;
export type PrefixMetaFieldType = typeof PrefixMetaField;
export const MetaValue = `${PrefixMetaField}value` as const;
export type MetaValueType = typeof MetaValue;
export const MetaFetch = `${PrefixMetaField}fetch` as const;
export type MetaFetchType = typeof MetaFetch;

export type FetchDoc = { $ref: string };
export type FetchProviderDoc<T, C> = {
    [ProviderData]: (c: C) => Promise<{ [key in keyof T]: T[key] extends object ? FetchDoc | T[key] : T[key] }>;
  }
  & {
  [P in keyof T as T[P] extends object ? P : never]?: FetchProviderDoc<T[P], C>;
}
export type FetchConfig = { defaultNull?: boolean; cached?: boolean; disableSync?: boolean };
export type FetchValueDocSet<T = any> = { fieldName?: string, fetchName?: string, keys?: string[], value?: T, doc?: FetchDoc };

export const isFetchProxy = (value: any): boolean => {
  return typeof value === 'object' && FetchProxyKey in value;
}
export const isFieldFetchProxy = (value: any): boolean => {
  return typeof value === 'object' && FieldFetchProxyKey in value;
}
export const isFetchDoc = (value: any): value is FetchDoc => {
  return value && typeof value === 'object' && '$ref' in value;
}
export const isFetchMethodName = (name: string | symbol): name is string => {
  return typeof name === 'string' && !name.startsWith(PrefixMetaField) && name.startsWith(PrefixField) && name.length > PrefixField.length;
}
export const findFieldNameByFetchMethodName = (name: string): string => {
  return name.replace(RegExp(`^\\${PrefixField}`), '');
}
export const findFieldSetByFetchMethodName = <T extends any = any>(data: any, name: string, config?: FetchConfig): FetchValueDocSet<T> => {
  const fieldKey = findFieldNameByFetchMethodName(name);
  const docOrValue = data[fieldKey];
  const value = isFetchDoc(docOrValue) ? (config?.defaultNull ? null : undefined) : docOrValue;
  const doc = isFetchDoc(docOrValue) ? docOrValue : undefined;
  return {fieldName: fieldKey, fetchName: name, value, doc};
}
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
// type OptionalObject<T> = {
//   [P in keyof T]?: T[P];
// }
// type Optional<T> = T | undefined;
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
// type OnlyNever<T> = {
//   [P in keyof T as T[P] extends never ? P : never]: T[P];
// }
// type aa = NonNullable<FetchObjectPromiseType<any, any>>;
// type ExcludeNever<T> = {
//   [P in keyof T as T[P] extends never ? never : P]: T[P];
// }
// export type FetchFieldMethodPromiseType<T, C> = Promise<T | C>;
// export type FetchFieldPromiseType<T, C> = {
//   [P in keyof T]?: T[P] extends object ? FetchFieldMethodPromiseType<T[P], C> extends any[] ? FetchFieldMethodPromiseType<T[P], C> : FetchFieldPromiseType<FetchFieldMethodPromiseType<T[P], C>, C> : FetchFieldMethodPromiseType<T[P], C>;
// };
export type FetchObjectFieldPromiseType<T, C> = {
  [P in keyof T]: T[P] extends object ? T[P] extends any[] ? T[P] : (config?: C) => Promise<FetchObjectFieldPromiseType<T[P], C>> : T[P];
};
export type FetchObjectPromiseType<T, C> = {
  // @ts-ignore
  [P in keyof T as T[P] extends object ? `${PrefixFieldType}${P}` : never]: (config?: C) => Promise<T[P]>;
} & {
  // [P in keyof T]?: T[P] extends object ? FetchObjectPromiseType<T[P], C> : T[P] | undefined;
  // [P in keyof T]?: T[P] extends object ? T[P] extends any[] ? Optional<T[P]> : FetchObjectPromiseType<T[P], C> : Optional<T[P]>;
  [P in keyof T]?: T[P] extends object ? T[P] extends any[] ? T[P] : FetchObjectPromiseType<T[P], C> : T[P];
};
export type FetchFieldType<T> = T;
export type FetchObjectType<T> = {
  [P in keyof T]: T[P] extends object ? FetchObjectType<T[P]> | FetchDoc : FetchFieldType<T[P]>;
} | FetchDoc;

export type FieldFetchCallBack<C = any> = (doc?: FetchDoc, config?: { config?: C, linkfetchConfig?: FetchConfig }) => Promise<any>;
export type FetchCallBack<C = any> = (data: FetchValueDocSet, config?: { config?: C, linkfetchConfig?: FetchConfig }) => Promise<any>;
export const executeProvider = async <T, C>(target: FetchProviderDoc<T, C>, keys: string[] | string, config?: C) => {
  const keyArray = Array.isArray(keys) ? keys : keys.split('.');
  keyArray.push(ProviderData);
  return await execute(target, keyArray, [config]);
}
// export const executeFieldFetch = <T, C>(target: any, keys: string | string[], c?: C): Promise<T> | undefined => {
//   const keyArray = Array.isArray(keys) ? keys : keys.split('.');
//   // const chain: Promise<any>[] = [];
//   let t = target;
//   let promise: Promise<any> | undefined = undefined;
//   keyArray.forEach(it => {
//     console.log('target->', t, it);
//     const next = (t as any)[it](c);
//     if (promise) {
//       promise.then(it => {
//         return next;
//       });
//     } else {
//       promise = next;
//     }
//   })
//   return promise;
// }
export const execute = async (target: any, keys: string[] | string, parameter?: any[], fieldLoopCallBack?: (target: any, prev: any, value: any, name: string) => Promise<any>) => {
  let t = target;
  const keyArray = Array.isArray(keys) ? keys : keys.split('.');
  for (const key of keyArray) {
    if (t === undefined || t === null) {
      return undefined;
    }
    t = fieldLoopCallBack ? (await fieldLoopCallBack(target, t, t[key], key)) : t[key];
  }
  if (typeof t === 'function') {
    return t.apply(target, parameter);
  }
  return t as any;
};

export type MetaFnc<T, C> = {
  [MetaValue]: (keys: string[] | string) => Promise<any>;
  [MetaFetch]: (keys: string[] | string, config?: C) => Promise<FetchObjectPromiseType<T, C>>
}

export const linkfetch = async <T extends object, C = any>(docObject: FetchObjectType<T>, fetch: FetchCallBack<C>, config?: { config?: C, linkfetchConfig?: FetchConfig, keys?: string[] }): Promise<FetchObjectPromiseType<T, C> & MetaFnc<T, C>> => {
  const doc = Array.isArray(docObject) ? [...docObject] : Object.assign({}, docObject) as any;
  const proxy = (field: any, keys: string[] = []) => {
    if (isFetchProxy(field) || isFetchDoc(field)) {
      return field;
    }

    Object.entries(field).filter(([key, value]) => typeof value === 'object' && !Array.isArray(value)).forEach(([key, value]) => {
      if (!isFetchProxy(value)) {
        const subKeys = [...keys, key];
        field[key] = proxy(value, subKeys);
      }
    });

    const inKeys = [...(config?.keys ?? [])];
    inKeys.push(...keys);
    return new Proxy(field, new FetchProxy<T, C>(field, fetch, inKeys, config?.linkfetchConfig));
  }

  if (isFetchDoc(doc)) {
    const set: FetchValueDocSet = {fieldName: undefined, fetchName: undefined, value: undefined, doc};
    const returnData = await fetch(set, config);
    const proxy = linkfetch(returnData, fetch, config);
    return proxy as any;
  }

  const target = proxy(doc);
  const metaFnc: MetaFnc<T, C> = {
    $$value: async (keys: string[] | string) => {
      return await execute(target, keys);
    },
    $$fetch: async (keys: string[] | string, config?: C) => {
      const keyArray = Array.isArray(keys) ? keys : keys.split('.');
      if (keyArray.length > 0) {
        const name = keyArray[keyArray.length - 1];
        keyArray[keyArray.length - 1] = `${PrefixField}${name}`;
      }
      return await execute(target, keyArray, [config], async (target: any, prev: any, value: any, name: string) => {
        if (value === undefined || value === null) {
          const data = await prev[`${PrefixField}${name}`](config);
          return data;
        } else {
          return value;
        }
      });
    }
  }
  return Object.assign(target, metaFnc);
}

export const linkfieldfetch = <T extends object, C = any>(data: FetchObjectType<T>, fetch: FieldFetchCallBack<C>, config?: { linkfetchConfig?: FetchConfig }): (config?: C) => Promise<FetchObjectFieldPromiseType<T, C>> => {
  const change = (field: any) => {
    // if (isFetchProxy(field) || isFetchDoc(field)) {
    //   return field;
    // }
    Object.entries(field).filter(([key, value]) => typeof value === 'object' && !isFetchDoc(data) && !Array.isArray(value)).forEach(([key, value]) => {
      field[key] = change(value);
    });
    const doc = isFetchDoc(field) ? field : undefined;
    let cache: any = undefined;
    return (c?: C) => {
      if (config?.linkfetchConfig?.cached && cache) {
        return cache;
      }
      return fetch(doc, {config: c, linkfetchConfig: config?.linkfetchConfig}).then(it => {
        linkfieldfetch(it, fetch, config)
        if (config?.linkfetchConfig?.cached) {
          cache = it;
        }
        return it;
      })
    };
  }

  const target = change(data);
  return target;
}
