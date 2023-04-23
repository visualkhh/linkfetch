import {
  FetchCallBack,
  FetchDoc,
  findFieldSetByFetchMethodName,
  isFetchDoc,
  isFetchMethodName,
  linkfetch,
  LinkFetchConfig
} from './index';

export const FetchProxyKey = '_FetchProxy_isProxy';

export class FetchProxy<T extends object, C> implements ProxyHandler<T> {
  private docs = new Map<string | symbol, FetchDoc>();

  constructor(private original: any, private fetch: FetchCallBack<C>, private keys: string[], private config?: LinkFetchConfig) {
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
        if (this.config?.everyFetch || set.value === undefined || set.value === null) {
          return this.fetch(set, {config: config, linkFetchConfig: this.config})
            .then(it => linkfetch(it, this.fetch, {config: config, linkFetchConfig: this.config, keys: set.keys}))
            .then(it => {
              if (this.config?.disableSync) {
                return it;
              } else {
                Reflect.set(target, set.fieldName ?? '', it, receiver);
                return Reflect.get(target, set.fieldName ?? '', receiver);
              }
            });
        } else if (set.value) {
          return Promise.resolve(set.value);
        } else {
          return Promise.resolve(undefined);
        }
      };
    }
    return value;
  }

  has(target: T, p: string | symbol): boolean {
    return p === FetchProxyKey || p in target;
  }
}
