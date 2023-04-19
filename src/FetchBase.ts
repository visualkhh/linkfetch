export class FetchProxy<T extends object> implements ProxyHandler<T> {

  constructor() {
  }

  get(target: T, p: string | symbol, receiver: any): any {
  }

  set(target: T, p: string | symbol, newValue: any, receiver: any): boolean {
    return false;
  }

  has(target: T, p: string | symbol): boolean {
    return p === '_FetchProxy_isProxy' || p in target;
  }
}

export type FetchFieldType<T> =  T | Promise<T> | ((...arg: any[]) => Promise<T> | T) ;
export type FetchObjectType<T> = {
  [P in keyof T]: T[P] extends object ? FetchObjectType<T[P]> : FetchFieldType<T[P]>;
}

export const linkFetch = <T = any, D = FetchObjectType<T>>(docObject: D): T => {
  const doc = Object.assign({}, docObject) as any;
  const proxy = (field: any) => {
    if ('_FetchProxy_isProxy' in field) {
      return field;
    }

    Object.entries(field).forEach(([key, value]) => {
      if (!('_FetchProxy_isProxy' in (value as any))) {
        doc[key] = proxy(value);
      }
    });

    return new Proxy(field, new FetchProxy());
  }
  proxy(doc);

  return '' as any;
}


// export abstract class FetchBase<T, D = FetchObjectType<T>> {
//   constructor(public docObject: D) {
//
//   }
//
//   private proxy(a: any) {
//
//   }
//
//   run(): T {
//
//     Object.entries(this.docObject).forEach(([key, value]) => {
//
//     });
//     return {} as T;
//   }
// }