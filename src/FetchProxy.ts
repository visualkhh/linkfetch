import {
  FetchCallBack,
  FetchDoc,
  findFieldSetByFetchMethodName,
  isFetchDoc,
  isFetchMethodName,
  linkFetch,
  LinkFetchConfig
} from './index';

export const FetchProxyKey = '_FetchProxy_isProxy';

export class FetchProxy<T extends object, C> implements ProxyHandler<T> {
  private docs = new Map<string | symbol, FetchDoc>();

  constructor(private original: any, private fetch: FetchCallBack<C>, private config?: LinkFetchConfig) {
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
      if (set.doc) {
        this.docs.set(p, set.doc);
      } else if (!set.doc) {
        set.doc = this.docs.get(p);
      }
      return (config?: C) => {
        return this.fetch(set, {config: config, linkFetchConfig: this.config})
          .then(it => linkFetch(it, this.fetch, this.config))
          .then(it => {
            return (target as any)[set.fieldName]! = it;
          });
      };
    }
    return value;
  }

  has(target: T, p: string | symbol): boolean {
    return p === FetchProxyKey || p in target;
  }
}
