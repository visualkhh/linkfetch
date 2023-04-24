import { FetchCallBack, FetchConfig, FetchDoc, findFieldSetByFetchMethodName, isFetchDoc, isFetchMethodName, linkfetch, MetaFetch, MetaValue } from './index';

export const FetchProxyKey = '_FetchProxy_isProxy';

export class FetchProxy<T extends object, C> implements ProxyHandler<T> {
  private docs = new Map<string | symbol, FetchDoc>();

  constructor(private original: any, private fetch: FetchCallBack<C>, private keys: string[], private config?: FetchConfig) {
  }

  get(target: T, p: string | symbol, receiver: any): any {
    // console.log('isProxy', '_FetchProxy_isProxy' in target, '_FetchProxy_isProxy' in receiver);
    // console.log('get', target, p, receiver);
    // const old = Reflect.get(target, p, receiver);
    let value = Reflect.get(target, p, receiver) as any; // (target as any)[p]; // Reflect.get(target, p, receiver); // (target as any)[p]; //
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
      set.keys = [...this.keys]
      if (set.fieldName) {
        set.keys.push(set.fieldName);
      }
      return (config?: C) => {
        if (!this.config?.cached || set.value === undefined || set.value === null) {
          return this.fetch(set, {config: config, linkfetchConfig: this.config})
            .then(it => linkfetch(it, this.fetch, {config: config, linkfetchConfig: this.config, keys: set.keys}))
            .then(it => {
              delete (it as any)[MetaValue];
              delete (it as any)[MetaFetch];
              if (this.config?.disableSync) {
                return it;
              } else {
                Reflect.set(target, set.fieldName ?? '', it, receiver);
                return Reflect.get(target, set.fieldName ?? '', receiver);
              }
            });
        } else if (this.config?.cached && set.value) {
          return Promise.resolve(set.value);
        } else {
          return Promise.resolve(this.config?.defaultNull ? null : undefined);
        }
      };
    }
    return value;
  }

  has(target: T, p: string | symbol): boolean {
    return p === FetchProxyKey || p in target;
  }
}
