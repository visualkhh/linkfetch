export const PrefixField = '$' as const;
export type PrefixFieldType = typeof PrefixField;
export const MetaPrefixField = '$$' as const;
export type MetaPrefixType = typeof MetaPrefixField;

export const ProducerFetch = `${PrefixField}fetch` as const;
export type ProducerFetchType = typeof ProducerFetch;

export const RequestFetch = `${PrefixField}request` as const;
export type RequestFetchType = typeof RequestFetch;
export const Config = `${PrefixField}config` as const;
export type ConfigType = typeof Config;
export const Ref = `${PrefixField}ref` as const;
export type RefType = typeof Ref;

export const MetaFetch = `${MetaPrefixField}fetch` as const;
export type MetaFetchType = typeof MetaFetch;
export const MetaRequest = `${MetaPrefixField}request` as const;
export type MetaRequestType = typeof MetaRequest;
export const MetaSnapshot = `${MetaPrefixField}snapshot` as const;
export type MetaSnapshotType = typeof MetaSnapshot;

export type GetPath<T, P extends string> =
  P extends `${infer K}.${infer R}`
    ?
    K extends keyof T ? GetPath<T[K], R> : never
    :
    P extends keyof T ? T[P] : (P extends string ? T : never);

export type FlatKey<T> = {
  [P in keyof T as T[P] extends object
    ?
    // @ts-ignore
    `${P}.${keyof FlatKey<T[P]>}` | `${P}`
    :
    // @ts-ignore
    `${P}`]: unknown;
}

export type FlatObjectKey<T> = {
  // @ts-ignore
  [P in keyof FlatKey<T> as GetPath<T, P> extends object ? P : never]: GetPath<T, P>;
}

export type ObjectConfig<T> = {
  [P in keyof T]?: { is?: boolean, config?: any };
}

type OptionalDeep<T> = {
  [P in keyof T]?: T[P] extends object ? OptionalDeep<T[P]> : T[P];
}

export type FetchDoc<T = any> = {
  [P in typeof Ref]: string
}
& {
  [P in typeof Config]?: ObjectConfig<T>
};
export type FetchConfig = { defaultNull?: boolean; cached?: boolean; disableSync?: boolean };

export type FetchRequest<T, C> = {
    [P in typeof RequestFetch]: C;
  }
  & {
  [P in typeof Config]?: ObjectConfig<T>;
}
  & {
  [P in keyof T as T[P] extends object ? P : never]?: FetchRequest<T[P], C>;
}

export type FetchObjectOrDocType<T> = {
  [P in keyof T]: T[P] extends object ? FetchObjectOrDocType<T[P]> | FetchDoc<T> : T[P];
} | FetchDoc<T>;

export type Fetcher<C = any> = (doc?: FetchDoc, config?: { request?: C, value?: any, config?: FetchRequest<any, C>, linkfetchConfig?: FetchConfig }) => Promise<any>;

type ProducerFetchConfig<C, P extends keyof FlatObjectKey<T>, T> = { key?: P, request?: C, config?: ObjectConfig<T> };
export type FetchRequestParameter<C, T> = { request?: C, config?: ObjectConfig<T> };
export type FetchProducerDocReturnType<T> = { [key in keyof T]: T[key] extends object ? FetchDoc<T[key]> | T[key] : T[key] };
export type FetchProducerDoc<T, C> = {
    [P in typeof ProducerFetch]: (request: FetchRequestParameter<C, T>) => Promise<FetchProducerDocReturnType<T>>;
  }
  & {
  [P in keyof T as T[P] extends object ? P : never]?: FetchProducerDoc<T[P], C>;
}

export type FetchObject<T, C = any> = {
  [P in keyof T]: T[P] extends object ? T[P] extends any[] ? T[P] : (request?: FetchRequestParameter<C, T[P]>) => Promise<FetchObject<T[P], C>> : T[P];
}

// /////////////////////////////////////////////

const isFetchDoc = (value: any): value is FetchDoc => {
  return value && typeof value === 'object' && ( (Ref in value) || (Config in value) );
}

const execute = async (target: any, keys: string[] | string = [], parameter?: any[], fieldLoopCallBack?: (target: any, prev: any, value: any, name: string) => Promise<any>) => {
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

// producer
const fetchProducer = async <T, C>(target: FetchProducerDoc<T, C>, keys: string[] | string = [], config?: ProducerFetchConfig<C, any, T >) => {
  const keyArray = Array.isArray(keys) ? keys : keys.split('.');
  keyArray.push(ProducerFetch);
  return await execute(target, keyArray, [config]);
}

export const producer = <T, C>(target: FetchProducerDoc<T, C>) => {
  const data = Object.assign(target, {
  // @ts-ignore
    [MetaFetch]: async <P extends keyof FlatObjectKey<T>>(config?: ProducerFetchConfig< C, P, FlatObjectKey<T>[P]>): Promise<FlatObjectKey<T>[P]> => {
      return await fetchProducer(target, config?.key as any, config as any);
    },
    [MetaRequest]: async (request: FetchRequest<T, C>): Promise<OptionalDeep<T>> => {
      return requestProducer(target, request);
    }
  });
  return data;
}

const requestProducer = async <T extends object, C>(data: FetchProducerDoc<T, C>, request: FetchRequest<T, C>): Promise<OptionalDeep<T>> => {
  const change = async (bowl: any, field: any, request: any) => {
    for (const [key, value] of Array.from(Object.entries(request))) {
      if (key === RequestFetch) {
        const newRequest: FetchRequestParameter<C, T> = {
          request: value as any,
          config: request[Config]
        }
        Object.assign(bowl, await field?.[ProducerFetch]?.(newRequest));
      } else if (key !== RequestFetch && key !== Config && typeof value === 'object') {
        bowl[key] = await change({}, field[key], request[key])
      }
    }
    return bowl;
  }
  const bowl = await change({}, data, request);
  return bowl as T;
}

// linkfetch
export const linkfetch = async <T extends object, C = any>(
  dataSet: { data: FetchObjectOrDocType<T>, defaultRequest?: FetchRequest<T, C> },
  fetch: Fetcher<C>,
  request?: { request?: C, config?: ObjectConfig<T>, linkfetchConfig?: FetchConfig }) => {
  const newData = Array.isArray(dataSet.data) ? [...dataSet.data] : Object.assign({}, dataSet.data);
  const targetResult = await linkfetchLoop({
    data: newData as FetchObjectOrDocType<T>,
    defaultRequest: dataSet.defaultRequest
  }, fetch, request)({request: request?.request ?? dataSet.defaultRequest?.$request, config: request?.config});

  const executor = {
    [MetaFetch]: async <P extends keyof FlatObjectKey<T>>(config?: { key?: P, request?: C }) => {
      return await execute(targetResult, config?.key as any, [config?.request],
        async (target, prev, value, name) => {
          return await value(config?.request);
        }
      ) as FlatObjectKey<T>[P];
    },
    [MetaSnapshot]: async (config?: { allFetch?: boolean }): Promise<OptionalDeep<T>> => {
      return linkfetchSnapshot<T>(targetResult, config);
    }
  }
  return Object.assign(targetResult, executor);
}

const linkfetchLoop = <T extends object, C = any>(
  dataSet: { data: FetchObjectOrDocType<T>, defaultRequest?: FetchRequest<T, C> },
  fetch: Fetcher<C>,
  config?: { linkfetchConfig?: FetchConfig }): (request?: { request?: C, config?: ObjectConfig<any> }) => Promise<FetchObject<T, C>> => {

  const change = (field: any, defaultReqeust?: any) => {
    // console.log('field--@@->', field, reqeust)
    Object.entries(field)
      .filter(([key, value]) => typeof value === 'object' && !isFetchDoc(field) && !Array.isArray(value))
      .forEach(([key, value]) => {
        field[key] = change(value, defaultReqeust?.[key]);
    });

    const doc = isFetchDoc(field) ? {...field} : undefined;
    // defaultConfig $config Setting 해준다
    if (doc && defaultReqeust?.[Config]) {
      doc[Config] = defaultReqeust?.[Config];
    }
    const p = Object.assign(
      (r?: { request?: C, config?: ObjectConfig<any> }) => {
        if (config?.linkfetchConfig?.cached && p.$$linkfetch_cache) {
          return Promise.resolve(p.$$linkfetch_cache);
        }
        const newConfig: FetchRequest<T, C> = {
          $request: r?.request ?? defaultReqeust?.[RequestFetch],
          $config: r?.config ?? defaultReqeust?.[Config]
        };
        const newRequest = {...(r?.request ?? defaultReqeust?.[RequestFetch])};
        // newRequest.$config = newConfig.$config;
        return fetch(doc, {
          request: newRequest,
          value: field,
          config: newConfig,
          linkfetchConfig: config?.linkfetchConfig
        }).then(it => {
          // console.log('fetch--->');
          console.dir(it, {depth: 10})
          linkfetchLoop({data: it, defaultRequest: defaultReqeust}, fetch, config)
          // p.$$config = it?.$config;
          p.$$linkfetch_cache = it;
          p.$$linkfetch_age++;
          return it;
        });
      },
      {$$linkfetch_cache: undefined, $$linkfetch_age: 0});
    return p;
  }
  const target = change(dataSet.data, dataSet?.defaultRequest);
  return target;
}

const linkfetchSnapshot = async <T extends object>(data: FetchObject<T>, config?: { allFetch?: boolean }): Promise<OptionalDeep<T>> => {
  const change = async (bowl: any, field: any) => {
    if (!field) {
      return bowl;
    }
    for (const [key, value] of Array.from(Object.entries(field))) {
      if (typeof value === 'function' && '$$linkfetch_cache' in value && '$$linkfetch_age' in value) {
        if (config?.allFetch && !value.$$linkfetch_age) {
          await value();
        }
        bowl[key] = await change({}, value.$$linkfetch_cache);
      } else if (typeof value !== 'function') {
        bowl[key] = value;
      }
    }
    return bowl;
  }
  const bowl = await change({}, data);
  return bowl as T;
}
