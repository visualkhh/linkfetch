import {
  FetchCallBack,
  FetchConfig,
  FetchDoc,
  findFieldSetByFetchMethodName,
  isFetchDoc,
  isFetchMethodName,
  linkfetch, linkfieldfetch,
  MetaFetch,
  MetaValue
} from './index';

export const FieldFetchProxyKey = '_FieldFetchProxy_isProxy';

export class FieldFetchProxy<T extends object, C> implements ProxyHandler<T> {
  private docs = new Map<string | symbol, FetchDoc>();

  constructor(private original: any, private fetch: FetchCallBack<C>, private keys: string[], private config?: FetchConfig) {
  }

  get(target: T, p: string | symbol, receiver: any): any {
    // console.log('isProxy', '_FetchProxy_isProxy' in target, '_FetchProxy_isProxy' in receiver);
    // console.log('get', target, p, receiver);
    const value = Reflect.get(target, p, receiver);
    const keys = [...this.keys];
    console.log('-----------', target, p, value, keys);
    return (config?: C) => {
      if (!this.config?.cached || value === undefined || value === null) {
        return this.fetch({fetchName: p.toString(), keys, value}, {config: config, linkfetchConfig: this.config})
          .then(it => linkfieldfetch(it, this.fetch, {config: config, linkfetchConfig: this.config, keys}))
          .then(it => {
            delete (it as any)[MetaValue];
            delete (it as any)[MetaFetch];
            if (this.config?.disableSync) {
              return it;
            } else {
              Reflect.set(target, p, it, receiver);
              return Reflect.get(target, p, receiver);
            }
          });
      } else if (this.config?.cached && value) {
        return Promise.resolve(value);
      } else {
        return Promise.resolve(this.config?.defaultNull ? null : undefined);
      }
    };
  }

  has(target: T, p: string | symbol): boolean {
    return p === FieldFetchProxyKey || p in target;
  }
}
