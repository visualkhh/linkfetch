import { FetchCallBack, FetchDoc, FetchFieldMethodPromiseType, findFieldNameByFetchMethodName, findFieldSetByFetchMethodName, isFetchDoc, isFetchMethodName, linkFetch, LinkFetchConfig, Prefix } from './index';

export class FetchProxy<T extends object, C> implements ProxyHandler<T> {
  private docs = new Map<string | symbol, FetchDoc>();

  constructor(private original: any, private fetch: FetchCallBack<C>, private config?: LinkFetchConfig) {
    // console.log('ㅅㅐㅇ성', original);
    // if (isFetchDoc(original)) {
    //   console.log('is Doc??')
    //   this.doc = {...original};
    //   this.isDoc = true;
    //   console.log('is Doc??', this.doc)
    // }
  }

  get(target: T, p: string | symbol, receiver: any): any {
    // console.log('isProxy', '_FetchProxy_isProxy' in target, '_FetchProxy_isProxy' in receiver);
    // console.log('get', target, p, receiver);
    // const old = Reflect.get(target, p, receiver);
    let value = (target as any)[p]; // Reflect.get(target, p, receiver); // (target as any)[p]; //
    if (isFetchDoc(value)) {
      value = (this.config?.defaultNull ? null : undefined);
    }
    if (isFetchMethodName(p)) {
      const set = findFieldSetByFetchMethodName(target, p, this.config);
      return (config: C) => {
        return this.fetch(set, config).then(it => {
          const proxy = linkFetch(it, this.fetch, this.config);
          return (target as any)[set.fieldName] = proxy;
        });
      };
    }
    return value;
  }

  set(target: T, p: string | symbol, newValue: any, receiver: any): boolean {
    return false;
  }

  has(target: T, p: string | symbol): boolean {
    return p === '_FetchProxy_isProxy' || p in target;
  }
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