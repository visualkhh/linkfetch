import { FetchProxy, FetchProxyKey } from 'FetchProxy';

export const Prefix = '$' as const;
export type PrefixType = typeof Prefix;
export type FetchDoc = { _$ref: string };
export type LinkFetchConfig = { defaultNull?: boolean; everyFetch?: boolean; };
export type ValueDocSet<T = any> = { fieldName?: string, fetchName?: string, value?: T, doc?: FetchDoc };

export const isFetchProxy = (value: any): boolean => {
  return typeof value === 'object' && FetchProxyKey in value;
}
export const isFetchDoc = (value: any): value is FetchDoc => {
  return value && typeof value === 'object' && '_$ref' in value;
}
export const isFetchMethodName = (name: string | symbol): name is string => {
  return typeof name === 'string' && name.startsWith(Prefix) && name.length > Prefix.length;
}
export const findFieldNameByFetchMethodName = (name: string): string => {
  return name.replace(RegExp(`^\\${Prefix}`), '');
}
export const findFieldSetByFetchMethodName = <T extends any = any>(data: any, name: string, config?: LinkFetchConfig): ValueDocSet<T> => {
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
// type OnlyNever<T> = {
//   [P in keyof T as T[P] extends never ? P : never]: T[P];
// }
// type aa = NonNullable<FetchObjectPromiseType<any, any>>;
type ExcludeNever<T> = {
  [P in keyof T as T[P] extends never ? never : P]: T[P];
}
export type FetchFieldMethodPromiseType<T, C> = (config?: C) => Promise<T>;
export type FetchObjectPromiseType<T, C> = ExcludeNever<{
  // @ts-ignore
  [P in keyof T as `${PrefixType}${P}`]: T[P] extends object ? FetchFieldMethodPromiseType<T[P], C> : never;
} & {
  [P in keyof T]?: T[P] extends object ? FetchObjectPromiseType<T[P], C> : T[P];
}>;
export type FetchFieldType<T> = T;
export type FetchObjectType<T> = {
  [P in keyof T]: T[P] extends object ? FetchObjectType<T[P]> | FetchDoc : FetchFieldType<T[P]>;
} | FetchDoc;

export type FetchCallBack<C = any> = (data: ValueDocSet, config?: { config?: C, linkFetchConfig?: LinkFetchConfig }) => Promise<any>;
export const linkFetch = async <T extends object, C = any>(docObject: FetchObjectType<T>, fetch: FetchCallBack<C>, config?: { config?: C, linkFetchConfig?: LinkFetchConfig }): Promise<FetchObjectPromiseType<T, C>> => {
  const doc = Array.isArray(docObject) ? [...docObject] : Object.assign({}, docObject) as any;
  const proxy = (field: any) => {
    if (isFetchProxy(field) || isFetchDoc(field)) {
      return field;
    }

    Object.entries(field).filter(([key, value]) => typeof value === 'object' && !Array.isArray(value)).forEach(([key, value]) => {
      if (!isFetchProxy(value)) {
        doc[key] = proxy(value);
      }
    });

    return new Proxy(field, new FetchProxy<T, C>(field, fetch, config?.linkFetchConfig));
  }

  if (isFetchDoc(doc)) {
    const set: ValueDocSet = {fieldName: undefined, fetchName: undefined, value: undefined, doc};
    const returnData = await fetch(set, config);
    const proxy = linkFetch(returnData, fetch, config);
    return proxy as any;
  }
  return proxy(doc);
}
