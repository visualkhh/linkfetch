export const PrefixField = '$' as const;
export type PrefixFieldType = typeof PrefixField;
export const MetaPrefixField = '$$' as const;
export type MetaPrefixType = typeof MetaPrefixField;

export const Fetch = `${PrefixField}fetch` as const;
export type FetchType = typeof Fetch;

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

export type FlatKeyExcludeArrayDeep<T> = {
  [
    P in keyof T as
    // @ts-ignore
    T[P] extends any[] ? `${P}` : T[P] extends object
    ?
    // @ts-ignore
    `${P}.${keyof FlatKeyExcludeArrayDeep<T[P]>}` | `${P}`
    :
    // @ts-ignore
    `${P}`
  ]: unknown;
}

export type FlatObjectKey<T> = {
  // @ts-ignore
  [P in keyof FlatKey<T> as GetPath<T, P> extends object ? P : never]: GetPath<T, P>;
}
export type FlatObjectKeyExcludeArrayDepp<T> = {
  // @ts-ignore
  [P in keyof FlatKeyExcludeArrayDeep<T> as GetPath<T, P> extends object ? P : never]: GetPath<T, P>;
}
export type FlatKeyOptionAndType<T, TT> = {
  // @ts-ignore
  [P in keyof FlatKeyExcludeArrayDeep<T>]?: TT;
}

export type ObjectConfigType = { is?: boolean, config?: any };
// export type ObjectConfig<T> = {
//   [P in keyof T]?: ObjectConfigType;
// }

type OptionalDeep<T> = {
  [P in keyof T]?: T[P] extends object ? OptionalDeep<T[P]> : T[P];
}

export type FetchDoc<T = any> = {
    [P in typeof Ref]: string
  }
  & {
  [P in typeof Config]?: FlatKeyOptionAndType<T, ObjectConfigType>
};
export type FetchConfig = { defaultNull?: boolean; cached?: boolean; disableSync?: boolean };


export type RequestFetchBody<T, C, R = T> = {
    [P in typeof RequestFetch]: C;
  }
  & {
  [P in typeof Config]?: FlatKeyOptionAndType<T, ObjectConfigType>;
}
  & {
  [P in typeof Fetch]?: Fetcher<C, R>;
};
export type FetchRequest<T, C, R = T> = RequestFetchBody<T, C, R>
  & {
  [P in keyof T as T[P] extends object ? P : never]?: T[P] extends any[] ? RequestFetchBody<T, C, R> :FetchRequest<T[P], C, T>;
}

export type FetchObjectOrDocType<T> = {
  [P in keyof T]?: T[P] extends object ? FetchObjectOrDocType<T[P]> | FetchDoc<T> : T[P];
} | FetchDoc<T>;

// export type FetchConfigConsumer<C = any, T = undefined> = { request?: C, path?: (T extends undefined ? number : keyof FlatObjectKey<T>), value?: any, config?: FetchRequest<any, C>, linkfetchConfig?: FetchConfig };
export type FetchConfigConsumer<C = any, T = undefined> = { request?: C, path?: (T extends undefined ? number : keyof FlatObjectKeyExcludeArrayDepp<T>), value?: any, config?: FetchRequest<any, C>, linkfetchConfig?: FetchConfig };
export type Fetcher<C = any, T = undefined> = (doc?: FetchDoc, config?: FetchConfigConsumer<C, T>) => Promise<any>;

type ProducerFetchConfig<C, P extends keyof FlatObjectKey<T>, T> = { path?: P, request?: C, config?: FlatKeyOptionAndType<T, ObjectConfigType> };
export type FetchRequestParameter<C, T = undefined> = { path?: (T extends undefined ? string : keyof FlatObjectKey<T>), request?: C, config?: FlatKeyOptionAndType<T, ObjectConfigType> };
export type FetchProducerDocReturnType<T> = { [key in keyof T]: T[key] extends object ? FetchDoc<T[key]> | T[key] : T[key] };

export type FetchFnc<T, C, R = T> = {
  [P in typeof Fetch]: (request: FetchRequestParameter<C, R>) => Promise<FetchProducerDocReturnType<T>>;
};
export type FetchProducerDoc<T, C, R = T> = FetchFnc<T, C, R>
  & {
  [
    P in keyof T as T[P] extends object ? P : never
  ]?: T[P] extends any[] ? FetchFnc<T[P], C, R> : FetchProducerDoc<T[P], C, T>;
  // [P in keyof T as T[P] extends object ? P : never]?: FetchProducerDoc<T[P], C, T>;
}

export type FetchObject<T, C = any> = {
  [P in keyof T]:
  T[P] extends object ?
    T[P] extends any[] ? (request?: FetchRequestParameter<C, T[P]>) => Promise<T[P]> : (request?: FetchRequestParameter<C, T[P]>) => Promise<FetchObject<T[P], C>>
    // T[P] extends any[] ? T[P]: (request?: FetchRequestParameter<C, T[P]>) => Promise<FetchObject<T[P], C>>
    // (request?: FetchRequestParameter<C, T[P]>) => Promise<FetchObject<T[P], C>>
  : T[P];
}

// /////////////////////////////////////////////

const isFetchDoc = (value: any): value is FetchDoc => {
  return value && typeof value === 'object' && ((Ref in value) || (Config in value));
}

const execute = async (target: any, paths: string[] | string = [], parameter?: any[], fieldLoopCallBack?: (target: any, prev: any, value: any, name: string) => Promise<any>) => {
  let t = target;
  const keyArray = Array.isArray(paths) ? paths : paths.split('.');
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
const fetchProducer = async <T, C>(target: FetchProducerDoc<T, C>, keys: string[] | string = [], config?: ProducerFetchConfig<C, any, T>) => {
  const keyArray = Array.isArray(keys) ? keys : keys.split('.');
  keyArray.push(Fetch);
  return await execute(target, keyArray, [config]);
}

export const producer = <T, C>(target: FetchProducerDoc<T, C>) => {
  const data = Object.assign(target, {
    // @ts-ignore
    [MetaFetch]: async <P extends keyof FlatObjectKeyExcludeArrayDepp<T>>(config?: ProducerFetchConfig<C, P, FlatObjectKeyExcludeArrayDepp<T>[P]>): Promise<FlatObjectKeyExcludeArrayDepp<T>[P]> => {
      return await fetchProducer(target, config?.path as any, config as any);
    },
    [MetaRequest]: async (request: FetchRequest<T, C>): Promise<OptionalDeep<T>> => {
      return requestProducer(target, request);
    }
  });
  return data;
}

const requestProducer = async <T extends object, C>(data: FetchProducerDoc<T, C>, request: FetchRequest<T, C>): Promise<OptionalDeep<T>> => {
  const change = async (bowl: any, field: any, request: any, paths: string[] = []) => {
    for (const [key, value] of Array.from(Object.entries(request))) {
      if (key === RequestFetch) {
        const newRequest: FetchRequestParameter<C, T> = {
          request: value as any,
          config: request[Config],
        }
        if (paths.length > 0) {
          (newRequest.path as any) = paths.join('.');
        }
        const source = await field?.[Fetch]?.(newRequest);
        if (Array.isArray(source)) {
          return source;
        } else {
          Object.assign(bowl, source);
        }
      } else if (key !== RequestFetch && key !== Config && typeof value === 'object') {
        paths.push(key);
        bowl[key] = await change({}, field[key], request[key], paths)
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
  fetch: Fetcher<C, T>,
  request?: { request?: C, config?: FlatKeyOptionAndType<T, ObjectConfigType>, linkfetchConfig?: FetchConfig }) => {
  const newData = Array.isArray(dataSet.data) ? [...dataSet.data] : Object.assign({}, dataSet.data);
  const targetResult = await linkfetchLoop({
    data: newData as FetchObjectOrDocType<T>,
    defaultRequest: dataSet.defaultRequest
  }, fetch, request)({request: request?.request ?? dataSet.defaultRequest?.$request, config: request?.config});

  const executor = {
    [MetaFetch]: async <P extends keyof FlatObjectKeyExcludeArrayDepp<T>>(config?: { path?: P, request?: C }) => {
      return await execute(targetResult, config?.path as any, [config?.request],
        async (target, prev, value, name) => {
          return await value(config?.request);
        }
      ) as FlatObjectKeyExcludeArrayDepp<T>[P];
    },
    [MetaSnapshot]: async (config?: { allFetch?: boolean }): Promise<OptionalDeep<T>> => {
       return linkfetchSnapshot<T, C>(targetResult, config);
    }
  }
  return Object.assign(targetResult, executor);
}

const linkfetchLoop = <T extends object, C = any>(
  dataSet: { data: FetchObjectOrDocType<T>, defaultRequest?: FetchRequest<T, C> },
  fetch: Fetcher<C, T>,
  config?: { linkfetchConfig?: FetchConfig },
  paths: string[] = []): (request?: { request?: C, config?: FlatKeyOptionAndType<T, ObjectConfigType> }) => Promise<FetchObject<T, C>> => {

  const change = (field: any, defaultReqeust?: any, paths: string[] = []) => {
    // console.log('field--@@->', field, reqeust)
    Object.entries(field)
      .filter(([key, value]) => typeof value === 'object' && !isFetchDoc(field) && !Array.isArray(value))
      .forEach(([key, value]) => {
        paths.push(key);
        field[key] = change(value, defaultReqeust?.[key], paths);
      });

    // @ts-ignore
    const doc = isFetchDoc(field) ? {...field} : undefined;
    // defaultConfig $config Setting 해준다
    if (doc && defaultReqeust?.[Config]) {
      doc[Config] = doc[Config] ?? defaultReqeust?.[Config];
    }
    const p = Object.assign(
      (r?: { request?: C, config?: FlatKeyOptionAndType<T, ObjectConfigType> }) => {
        if (config?.linkfetchConfig?.cached && p.$$linkfetch_cache) {
          return Promise.resolve(p.$$linkfetch_cache);
        }
        const newConfig: FetchRequest<T, C> = {
          $request: r?.request ?? defaultReqeust?.[RequestFetch],
          $config: r?.config ?? defaultReqeust?.[Config]
        };
        const newRequest = {...(r?.request ?? defaultReqeust?.[RequestFetch])};
        // newRequest.$config = newConfig.$config;
        const fetchConfig: FetchConfigConsumer<C, T> = {
          request: newRequest,
          value: field,
          config: newConfig as any,
          linkfetchConfig: config?.linkfetchConfig
        };
        if (paths.length > 0) {
          (fetchConfig.path as any) = paths.join('.');
        }
        const runFetch = (defaultReqeust?.[Fetch] ?? fetch) as Fetcher<C, T>;
        return runFetch(doc, fetchConfig).then(it => {
          // console.log('fetch--->');
          console.dir(it, {depth: 10})
          linkfetchLoop({data: it, defaultRequest: defaultReqeust}, fetch, config, paths)
          // p.$$config = it?.$config;
          p.$$linkfetch_cache = it;
          p.$$linkfetch_age++;
          return it;
        });
      },
      {$$linkfetch_cache: undefined, $$linkfetch_age: 0});
    return p;
  }
  const target = change(dataSet.data, dataSet?.defaultRequest, paths);
  return target;
}

const linkfetchSnapshot = async <T extends object, C>(data: FetchObject<T, C>, config?: { allFetch?: boolean }): Promise<OptionalDeep<T>> => {
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
