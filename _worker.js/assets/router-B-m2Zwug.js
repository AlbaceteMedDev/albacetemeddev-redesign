import { r as reactExports, i as isPromise, a as isRedirect, b as isNotFound, c as invariant, d as createControlledPromise, e as rootRouteId, f as isServer$1, g as functionalUpdate$1, h as arraysEqual, j as createLRUCache, k as compileDecodeCharMap, t as trimPath, l as rewriteBasepath, m as composeRewrites, p as processRouteTree, n as processRouteMasks, o as resolvePath, q as cleanPath, s as trimPathRight, u as parseHref, v as executeRewriteInput, w as isDangerousProtocol, x as redirect, y as findSingleMatch, z as deepEqual, D as DEFAULT_PROTOCOL_ALLOWLIST, A as buildRouteBranch, B as interpolatePath, C as nullReplaceEqualDeep, E as replaceEqualDeep$1, F as last, G as decodePath, H as findFlatMatch, I as findRouteMatch, J as hasKeys, K as executeRewriteOutput, L as encodePathLikeUrl, M as trimPathLeft, N as joinPaths, O as useRouter, P as dummyMatchContext, Q as matchContext, R as requireReactDom, S as exactPathTest, T as removeTrailingSlash, U as React, V as jsxRuntimeExports, W as isModuleNotFoundError, X as useHydrated, Y as escapeHtml, Z as getAssetCrossOrigin, _ as getScriptPreloadAttrs, $ as appendUniqueUserTags, a0 as resolveManifestCssLink, a1 as Outlet, a2 as notFound$1 } from "./server-BHvtqigF.js";
var reactUse = reactExports.use;
function useForwardedRef(ref) {
  const innerRef = reactExports.useRef(null);
  reactExports.useImperativeHandle(ref, () => innerRef.current, []);
  return innerRef;
}
function encode(obj, stringify = String) {
  const result = new URLSearchParams();
  for (const key in obj) {
    const val = obj[key];
    if (val !== void 0) result.set(key, stringify(val));
  }
  return result.toString();
}
function toValue(str2) {
  if (!str2) return "";
  if (str2 === "false") return false;
  if (str2 === "true") return true;
  return +str2 * 0 === 0 && +str2 + "" === str2 ? +str2 : str2;
}
function decode(str2) {
  const searchParams = new URLSearchParams(str2);
  const result = /* @__PURE__ */ Object.create(null);
  for (const [key, value] of searchParams.entries()) {
    const previousValue = result[key];
    if (previousValue == null) result[key] = toValue(value);
    else if (Array.isArray(previousValue)) previousValue.push(toValue(value));
    else result[key] = [previousValue, toValue(value)];
  }
  return result;
}
const defaultParseSearch = parseSearchWith(JSON.parse);
const defaultStringifySearch = stringifySearchWith(JSON.stringify, JSON.parse);
function parseSearchWith(parser) {
  return (searchStr) => {
    if (searchStr[0] === "?") searchStr = searchStr.substring(1);
    const query = decode(searchStr);
    for (const key in query) {
      const value = query[key];
      if (typeof value === "string") try {
        query[key] = parser(value);
      } catch (_err) {
      }
    }
    return query;
  };
}
function stringifySearchWith(stringify, parser) {
  const hasParser = typeof parser === "function";
  function stringifyValue(val) {
    if (typeof val === "object" && val !== null) try {
      return stringify(val);
    } catch (_err) {
    }
    else if (hasParser && typeof val === "string") try {
      parser(val);
      return stringify(val);
    } catch (_err) {
    }
    return val;
  }
  return (search) => {
    const searchStr = encode(search, stringifyValue);
    return searchStr ? `?${searchStr}` : "";
  };
}
const triggerOnReady = (inner) => {
  if (!inner.rendered) {
    inner.rendered = true;
    return inner.onReady?.();
  }
};
const resolvePreload = (inner, matchId) => {
  return !!(inner.preload && !inner.router.stores.matchStores.has(matchId));
};
const buildMatchContext = (inner, index, includeCurrentMatch = true) => {
  const context = { ...inner.router.options.context ?? {} };
  const end = includeCurrentMatch ? index : index - 1;
  for (let i = 0; i <= end; i++) {
    const innerMatch = inner.matches[i];
    if (!innerMatch) continue;
    const m = inner.router.getMatch(innerMatch.id);
    if (!m) continue;
    Object.assign(context, m.__routeContext, m.__beforeLoadContext);
  }
  return context;
};
const getNotFoundBoundaryIndex = (inner, err) => {
  if (!inner.matches.length) return;
  const requestedRouteId = err.routeId;
  const matchedRootIndex = inner.matches.findIndex((m) => m.routeId === inner.router.routeTree.id);
  const rootIndex = matchedRootIndex >= 0 ? matchedRootIndex : 0;
  let startIndex = requestedRouteId ? inner.matches.findIndex((match) => match.routeId === requestedRouteId) : inner.firstBadMatchIndex ?? inner.matches.length - 1;
  if (startIndex < 0) startIndex = rootIndex;
  for (let i = startIndex; i >= 0; i--) {
    const match = inner.matches[i];
    if (inner.router.looseRoutesById[match.routeId].options.notFoundComponent) return i;
  }
  return requestedRouteId ? startIndex : rootIndex;
};
const handleRedirectAndNotFound = (inner, match, err) => {
  if (!isRedirect(err) && !isNotFound(err)) return;
  if (isRedirect(err) && err.redirectHandled && !err.options.reloadDocument) throw err;
  if (match) {
    match._nonReactive.beforeLoadPromise?.resolve();
    match._nonReactive.loaderPromise?.resolve();
    match._nonReactive.beforeLoadPromise = void 0;
    match._nonReactive.loaderPromise = void 0;
    match._nonReactive.error = err;
    inner.updateMatch(match.id, (prev) => ({
      ...prev,
      status: isRedirect(err) ? "redirected" : isNotFound(err) ? "notFound" : prev.status === "pending" ? "success" : prev.status,
      context: buildMatchContext(inner, match.index),
      isFetching: false,
      error: err
    }));
    if (isNotFound(err) && !err.routeId) err.routeId = match.routeId;
    match._nonReactive.loadPromise?.resolve();
  }
  if (isRedirect(err)) {
    inner.rendered = true;
    err.options._fromLocation = inner.location;
    err.redirectHandled = true;
    err = inner.router.resolveRedirect(err);
  }
  throw err;
};
const shouldSkipLoader = (inner, matchId) => {
  const match = inner.router.getMatch(matchId);
  if (!match) return true;
  if (match.ssr === false) return true;
  return false;
};
const syncMatchContext = (inner, matchId, index) => {
  const nextContext = buildMatchContext(inner, index);
  inner.updateMatch(matchId, (prev) => {
    return {
      ...prev,
      context: nextContext
    };
  });
};
const handleSerialError = (inner, index, err) => {
  const { id: matchId, routeId } = inner.matches[index];
  const route = inner.router.looseRoutesById[routeId];
  if (err instanceof Promise) throw err;
  inner.firstBadMatchIndex ??= index;
  handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), err);
  try {
    route.options.onError?.(err);
  } catch (errorHandlerErr) {
    err = errorHandlerErr;
    handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), err);
  }
  inner.updateMatch(matchId, (prev) => {
    prev._nonReactive.beforeLoadPromise?.resolve();
    prev._nonReactive.beforeLoadPromise = void 0;
    prev._nonReactive.loadPromise?.resolve();
    return {
      ...prev,
      error: err,
      status: "error",
      isFetching: false,
      updatedAt: Date.now(),
      abortController: new AbortController()
    };
  });
  if (!inner.preload && !isRedirect(err) && !isNotFound(err)) inner.serialError ??= err;
};
const isBeforeLoadSsr = (inner, matchId, index, route) => {
  const existingMatch = inner.router.getMatch(matchId);
  const parentMatchId = inner.matches[index - 1]?.id;
  const parentMatch = parentMatchId ? inner.router.getMatch(parentMatchId) : void 0;
  if (inner.router.isShell()) {
    existingMatch.ssr = route.id === rootRouteId;
    return;
  }
  if (parentMatch?.ssr === false) {
    existingMatch.ssr = false;
    return;
  }
  const parentOverride = (tempSsr2) => {
    if (tempSsr2 === true && parentMatch?.ssr === "data-only") return "data-only";
    return tempSsr2;
  };
  const defaultSsr = inner.router.options.defaultSsr ?? true;
  if (route.options.ssr === void 0) {
    existingMatch.ssr = parentOverride(defaultSsr);
    return;
  }
  if (typeof route.options.ssr !== "function") {
    existingMatch.ssr = parentOverride(route.options.ssr);
    return;
  }
  const { search, params } = existingMatch;
  const ssrFnContext = {
    search: makeMaybe(search, existingMatch.searchError),
    params: makeMaybe(params, existingMatch.paramsError),
    location: inner.location,
    matches: inner.matches.map((match) => ({
      index: match.index,
      pathname: match.pathname,
      fullPath: match.fullPath,
      staticData: match.staticData,
      id: match.id,
      routeId: match.routeId,
      search: makeMaybe(match.search, match.searchError),
      params: makeMaybe(match.params, match.paramsError),
      ssr: match.ssr
    }))
  };
  const tempSsr = route.options.ssr(ssrFnContext);
  if (isPromise(tempSsr)) return tempSsr.then((ssr) => {
    existingMatch.ssr = parentOverride(ssr ?? defaultSsr);
  });
  existingMatch.ssr = parentOverride(tempSsr ?? defaultSsr);
};
const setupPendingTimeout = (inner, matchId, route, match) => {
  if (match._nonReactive.pendingTimeout !== void 0) return;
  const pendingMs = route.options.pendingMs ?? inner.router.options.defaultPendingMs;
  if (!!(inner.onReady && false)) {
    const pendingTimeout = setTimeout(() => {
      triggerOnReady(inner);
    }, pendingMs);
    match._nonReactive.pendingTimeout = pendingTimeout;
  }
};
const preBeforeLoadSetup = (inner, matchId, route) => {
  const existingMatch = inner.router.getMatch(matchId);
  if (!existingMatch._nonReactive.beforeLoadPromise && !existingMatch._nonReactive.loaderPromise) return;
  setupPendingTimeout(inner, matchId, route, existingMatch);
  const then = () => {
    const match = inner.router.getMatch(matchId);
    if (match.preload && (match.status === "redirected" || match.status === "notFound")) handleRedirectAndNotFound(inner, match, match.error);
  };
  return existingMatch._nonReactive.beforeLoadPromise ? existingMatch._nonReactive.beforeLoadPromise.then(then) : then();
};
const executeBeforeLoad = (inner, matchId, index, route) => {
  const match = inner.router.getMatch(matchId);
  let prevLoadPromise = match._nonReactive.loadPromise;
  match._nonReactive.loadPromise = createControlledPromise(() => {
    prevLoadPromise?.resolve();
    prevLoadPromise = void 0;
  });
  const { paramsError, searchError } = match;
  if (paramsError) handleSerialError(inner, index, paramsError);
  if (searchError) handleSerialError(inner, index, searchError);
  setupPendingTimeout(inner, matchId, route, match);
  const abortController = new AbortController();
  let isPending = false;
  const pending = () => {
    if (isPending) return;
    isPending = true;
    inner.updateMatch(matchId, (prev) => ({
      ...prev,
      isFetching: "beforeLoad",
      fetchCount: prev.fetchCount + 1,
      abortController
    }));
  };
  const resolve = () => {
    match._nonReactive.beforeLoadPromise?.resolve();
    match._nonReactive.beforeLoadPromise = void 0;
    inner.updateMatch(matchId, (prev) => ({
      ...prev,
      isFetching: false
    }));
  };
  if (!route.options.beforeLoad) {
    inner.router.batch(() => {
      pending();
      resolve();
    });
    return;
  }
  match._nonReactive.beforeLoadPromise = createControlledPromise();
  const context = {
    ...buildMatchContext(inner, index, false),
    ...match.__routeContext
  };
  const { search, params, cause } = match;
  const preload = resolvePreload(inner, matchId);
  const beforeLoadFnContext = {
    search,
    abortController,
    params,
    preload,
    context,
    location: inner.location,
    navigate: (opts) => inner.router.navigate({
      ...opts,
      _fromLocation: inner.location
    }),
    buildLocation: inner.router.buildLocation,
    cause: preload ? "preload" : cause,
    matches: inner.matches,
    routeId: route.id,
    ...inner.router.options.additionalContext
  };
  const updateContext = (beforeLoadContext2) => {
    if (beforeLoadContext2 === void 0) {
      inner.router.batch(() => {
        pending();
        resolve();
      });
      return;
    }
    if (isRedirect(beforeLoadContext2) || isNotFound(beforeLoadContext2)) {
      pending();
      handleSerialError(inner, index, beforeLoadContext2);
    }
    inner.router.batch(() => {
      pending();
      inner.updateMatch(matchId, (prev) => ({
        ...prev,
        __beforeLoadContext: beforeLoadContext2
      }));
      resolve();
    });
  };
  let beforeLoadContext;
  try {
    beforeLoadContext = route.options.beforeLoad(beforeLoadFnContext);
    if (isPromise(beforeLoadContext)) {
      pending();
      return beforeLoadContext.catch((err) => {
        handleSerialError(inner, index, err);
      }).then(updateContext);
    }
  } catch (err) {
    pending();
    handleSerialError(inner, index, err);
  }
  updateContext(beforeLoadContext);
};
const handleBeforeLoad = (inner, index) => {
  const { id: matchId, routeId } = inner.matches[index];
  const route = inner.router.looseRoutesById[routeId];
  const serverSsr = () => {
    {
      const maybePromise = isBeforeLoadSsr(inner, matchId, index, route);
      if (isPromise(maybePromise)) return maybePromise.then(queueExecution);
    }
    return queueExecution();
  };
  const execute = () => executeBeforeLoad(inner, matchId, index, route);
  const queueExecution = () => {
    if (shouldSkipLoader(inner, matchId)) return;
    const result = preBeforeLoadSetup(inner, matchId, route);
    return isPromise(result) ? result.then(execute) : execute();
  };
  return serverSsr();
};
const executeHead = (inner, matchId, route) => {
  const match = inner.router.getMatch(matchId);
  if (!match) return;
  if (!route.options.head && !route.options.scripts && !route.options.headers) return;
  const assetContext = {
    ssr: inner.router.options.ssr,
    matches: inner.matches,
    match,
    params: match.params,
    loaderData: match.loaderData
  };
  return Promise.all([
    route.options.head?.(assetContext),
    route.options.scripts?.(assetContext),
    route.options.headers?.(assetContext)
  ]).then(([headFnContent, scripts, headers]) => {
    return {
      meta: headFnContent?.meta,
      links: headFnContent?.links,
      headScripts: headFnContent?.scripts,
      headers,
      scripts,
      styles: headFnContent?.styles
    };
  });
};
const getLoaderContext = (inner, matchPromises, matchId, index, route) => {
  const parentMatchPromise = matchPromises[index - 1];
  const { params, loaderDeps, abortController, cause } = inner.router.getMatch(matchId);
  const context = buildMatchContext(inner, index);
  const preload = resolvePreload(inner, matchId);
  return {
    params,
    deps: loaderDeps,
    preload: !!preload,
    parentMatchPromise,
    abortController,
    context,
    location: inner.location,
    navigate: (opts) => inner.router.navigate({
      ...opts,
      _fromLocation: inner.location
    }),
    cause: preload ? "preload" : cause,
    route,
    ...inner.router.options.additionalContext
  };
};
const runLoader = async (inner, matchPromises, matchId, index, route) => {
  try {
    const match = inner.router.getMatch(matchId);
    try {
      if (!(isServer$1 ?? inner.router.isServer) || match.ssr === true) loadRouteChunk(route);
      const routeLoader = route.options.loader;
      const loader = typeof routeLoader === "function" ? routeLoader : routeLoader?.handler;
      const loaderResult = loader?.(getLoaderContext(inner, matchPromises, matchId, index, route));
      const loaderResultIsPromise = !!loader && isPromise(loaderResult);
      if (!!(loaderResultIsPromise || route._lazyPromise || route._componentsPromise || route.options.head || route.options.scripts || route.options.headers || match._nonReactive.minPendingPromise)) inner.updateMatch(matchId, (prev) => ({
        ...prev,
        isFetching: "loader"
      }));
      if (loader) {
        const loaderData = loaderResultIsPromise ? await loaderResult : loaderResult;
        handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), loaderData);
        if (loaderData !== void 0) inner.updateMatch(matchId, (prev) => ({
          ...prev,
          loaderData
        }));
      }
      if (route._lazyPromise) await route._lazyPromise;
      const pendingPromise = match._nonReactive.minPendingPromise;
      if (pendingPromise) await pendingPromise;
      if (route._componentsPromise) await route._componentsPromise;
      inner.updateMatch(matchId, (prev) => ({
        ...prev,
        error: void 0,
        context: buildMatchContext(inner, index),
        status: "success",
        isFetching: false,
        updatedAt: Date.now()
      }));
    } catch (e) {
      let error = e;
      if (error?.name === "AbortError") {
        if (match.abortController.signal.aborted) {
          match._nonReactive.loaderPromise?.resolve();
          match._nonReactive.loaderPromise = void 0;
          return;
        }
        inner.updateMatch(matchId, (prev) => ({
          ...prev,
          status: prev.status === "pending" ? "success" : prev.status,
          isFetching: false,
          context: buildMatchContext(inner, index)
        }));
        return;
      }
      const pendingPromise = match._nonReactive.minPendingPromise;
      if (pendingPromise) await pendingPromise;
      if (isNotFound(e)) await route.options.notFoundComponent?.preload?.();
      handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), e);
      try {
        route.options.onError?.(e);
      } catch (onErrorError) {
        error = onErrorError;
        handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), onErrorError);
      }
      if (!isRedirect(error) && !isNotFound(error)) await loadRouteChunk(route, ["errorComponent"]);
      inner.updateMatch(matchId, (prev) => ({
        ...prev,
        error,
        context: buildMatchContext(inner, index),
        status: "error",
        isFetching: false
      }));
    }
  } catch (err) {
    const match = inner.router.getMatch(matchId);
    if (match) match._nonReactive.loaderPromise = void 0;
    handleRedirectAndNotFound(inner, match, err);
  }
};
const loadRouteMatch = async (inner, matchPromises, index) => {
  async function handleLoader(preload, prevMatch, previousRouteMatchId, match2, route2) {
    const age = Date.now() - prevMatch.updatedAt;
    const staleAge = preload ? route2.options.preloadStaleTime ?? inner.router.options.defaultPreloadStaleTime ?? 3e4 : route2.options.staleTime ?? inner.router.options.defaultStaleTime ?? 0;
    const shouldReloadOption = route2.options.shouldReload;
    const shouldReload = typeof shouldReloadOption === "function" ? shouldReloadOption(getLoaderContext(inner, matchPromises, matchId, index, route2)) : shouldReloadOption;
    const { status, invalid } = match2;
    const staleMatchShouldReload = age >= staleAge && (!!inner.forceStaleReload || match2.cause === "enter" || previousRouteMatchId !== void 0 && previousRouteMatchId !== match2.id);
    loaderShouldRunAsync = status === "success" && (invalid || (shouldReload ?? staleMatchShouldReload));
    if (preload && route2.options.preload === false) ;
    else if (loaderShouldRunAsync && !inner.sync && shouldReloadInBackground) {
      loaderIsRunningAsync = true;
      (async () => {
        try {
          await runLoader(inner, matchPromises, matchId, index, route2);
          const match3 = inner.router.getMatch(matchId);
          match3._nonReactive.loaderPromise?.resolve();
          match3._nonReactive.loadPromise?.resolve();
          match3._nonReactive.loaderPromise = void 0;
          match3._nonReactive.loadPromise = void 0;
        } catch (err) {
          if (isRedirect(err)) await inner.router.navigate(err.options);
        }
      })();
    } else if (status !== "success" || loaderShouldRunAsync) await runLoader(inner, matchPromises, matchId, index, route2);
    else syncMatchContext(inner, matchId, index);
  }
  const { id: matchId, routeId } = inner.matches[index];
  let loaderShouldRunAsync = false;
  let loaderIsRunningAsync = false;
  const route = inner.router.looseRoutesById[routeId];
  const routeLoader = route.options.loader;
  const shouldReloadInBackground = ((typeof routeLoader === "function" ? void 0 : routeLoader?.staleReloadMode) ?? inner.router.options.defaultStaleReloadMode) !== "blocking";
  if (shouldSkipLoader(inner, matchId)) {
    if (!inner.router.getMatch(matchId)) return inner.matches[index];
    syncMatchContext(inner, matchId, index);
    return inner.router.getMatch(matchId);
  } else {
    const prevMatch = inner.router.getMatch(matchId);
    const activeIdAtIndex = inner.router.stores.matchesId.get()[index];
    const previousRouteMatchId = (activeIdAtIndex && inner.router.stores.matchStores.get(activeIdAtIndex) || null)?.routeId === routeId ? activeIdAtIndex : inner.router.stores.matches.get().find((d) => d.routeId === routeId)?.id;
    const preload = resolvePreload(inner, matchId);
    if (prevMatch._nonReactive.loaderPromise) {
      if (prevMatch.status === "success" && !inner.sync && !prevMatch.preload && shouldReloadInBackground) return prevMatch;
      await prevMatch._nonReactive.loaderPromise;
      const match2 = inner.router.getMatch(matchId);
      const error = match2._nonReactive.error || match2.error;
      if (error) handleRedirectAndNotFound(inner, match2, error);
      if (match2.status === "pending") await handleLoader(preload, prevMatch, previousRouteMatchId, match2, route);
    } else {
      const nextPreload = preload && !inner.router.stores.matchStores.has(matchId);
      const match2 = inner.router.getMatch(matchId);
      match2._nonReactive.loaderPromise = createControlledPromise();
      if (nextPreload !== match2.preload) inner.updateMatch(matchId, (prev) => ({
        ...prev,
        preload: nextPreload
      }));
      await handleLoader(preload, prevMatch, previousRouteMatchId, match2, route);
    }
  }
  const match = inner.router.getMatch(matchId);
  if (!loaderIsRunningAsync) {
    match._nonReactive.loaderPromise?.resolve();
    match._nonReactive.loadPromise?.resolve();
    match._nonReactive.loadPromise = void 0;
  }
  clearTimeout(match._nonReactive.pendingTimeout);
  match._nonReactive.pendingTimeout = void 0;
  if (!loaderIsRunningAsync) match._nonReactive.loaderPromise = void 0;
  match._nonReactive.dehydrated = void 0;
  const nextIsFetching = loaderIsRunningAsync ? match.isFetching : false;
  if (nextIsFetching !== match.isFetching || match.invalid !== false) {
    inner.updateMatch(matchId, (prev) => ({
      ...prev,
      isFetching: nextIsFetching,
      invalid: false
    }));
    return inner.router.getMatch(matchId);
  } else return match;
};
async function loadMatches(arg) {
  const inner = arg;
  const matchPromises = [];
  let beforeLoadNotFound;
  for (let i = 0; i < inner.matches.length; i++) {
    try {
      const beforeLoad = handleBeforeLoad(inner, i);
      if (isPromise(beforeLoad)) await beforeLoad;
    } catch (err) {
      if (isRedirect(err)) throw err;
      if (isNotFound(err)) beforeLoadNotFound = err;
      else if (!inner.preload) throw err;
      break;
    }
    if (inner.serialError || inner.firstBadMatchIndex != null) break;
  }
  const baseMaxIndexExclusive = inner.firstBadMatchIndex ?? inner.matches.length;
  const boundaryIndex = beforeLoadNotFound && !inner.preload ? getNotFoundBoundaryIndex(inner, beforeLoadNotFound) : void 0;
  const maxIndexExclusive = beforeLoadNotFound && inner.preload ? 0 : boundaryIndex !== void 0 ? Math.min(boundaryIndex + 1, baseMaxIndexExclusive) : baseMaxIndexExclusive;
  let firstNotFound;
  let firstUnhandledRejection;
  for (let i = 0; i < maxIndexExclusive; i++) matchPromises.push(loadRouteMatch(inner, matchPromises, i));
  try {
    await Promise.all(matchPromises);
  } catch {
    const settled = await Promise.allSettled(matchPromises);
    for (const result of settled) {
      if (result.status !== "rejected") continue;
      const reason = result.reason;
      if (isRedirect(reason)) throw reason;
      if (isNotFound(reason)) firstNotFound ??= reason;
      else firstUnhandledRejection ??= reason;
    }
    if (firstUnhandledRejection !== void 0) throw firstUnhandledRejection;
  }
  const notFoundToThrow = firstNotFound ?? (beforeLoadNotFound && !inner.preload ? beforeLoadNotFound : void 0);
  let headMaxIndex = inner.firstBadMatchIndex !== void 0 ? inner.firstBadMatchIndex : inner.matches.length - 1;
  if (!notFoundToThrow && beforeLoadNotFound && inner.preload) return inner.matches;
  if (notFoundToThrow) {
    const renderedBoundaryIndex = getNotFoundBoundaryIndex(inner, notFoundToThrow);
    if (renderedBoundaryIndex === void 0) {
      invariant();
    }
    const boundaryMatch = inner.matches[renderedBoundaryIndex];
    const boundaryRoute = inner.router.looseRoutesById[boundaryMatch.routeId];
    const defaultNotFoundComponent = inner.router.options?.defaultNotFoundComponent;
    if (!boundaryRoute.options.notFoundComponent && defaultNotFoundComponent) boundaryRoute.options.notFoundComponent = defaultNotFoundComponent;
    notFoundToThrow.routeId = boundaryMatch.routeId;
    const boundaryIsRoot = boundaryMatch.routeId === inner.router.routeTree.id;
    inner.updateMatch(boundaryMatch.id, (prev) => ({
      ...prev,
      ...boundaryIsRoot ? {
        status: "success",
        globalNotFound: true,
        error: void 0
      } : {
        status: "notFound",
        error: notFoundToThrow
      },
      isFetching: false
    }));
    headMaxIndex = renderedBoundaryIndex;
    await loadRouteChunk(boundaryRoute, ["notFoundComponent"]);
  } else if (!inner.preload) {
    const rootMatch = inner.matches[0];
    if (!rootMatch.globalNotFound) {
      if (inner.router.getMatch(rootMatch.id)?.globalNotFound) inner.updateMatch(rootMatch.id, (prev) => ({
        ...prev,
        globalNotFound: false,
        error: void 0
      }));
    }
  }
  if (inner.serialError && inner.firstBadMatchIndex !== void 0) {
    const errorRoute = inner.router.looseRoutesById[inner.matches[inner.firstBadMatchIndex].routeId];
    await loadRouteChunk(errorRoute, ["errorComponent"]);
  }
  for (let i = 0; i <= headMaxIndex; i++) {
    const { id: matchId, routeId } = inner.matches[i];
    const route = inner.router.looseRoutesById[routeId];
    try {
      const headResult = executeHead(inner, matchId, route);
      if (headResult) {
        const head = await headResult;
        inner.updateMatch(matchId, (prev) => ({
          ...prev,
          ...head
        }));
      }
    } catch (err) {
      console.error(`Error executing head for route ${routeId}:`, err);
    }
  }
  const readyPromise = triggerOnReady(inner);
  if (isPromise(readyPromise)) await readyPromise;
  if (notFoundToThrow) throw notFoundToThrow;
  if (inner.serialError && !inner.preload && !inner.onReady) throw inner.serialError;
  return inner.matches;
}
function preloadRouteComponents(route, componentTypesToLoad) {
  const preloads = componentTypesToLoad.map((type) => route.options[type]?.preload?.()).filter(Boolean);
  if (preloads.length === 0) return void 0;
  return Promise.all(preloads);
}
function loadRouteChunk(route, componentTypesToLoad = componentTypes) {
  if (!route._lazyLoaded && route._lazyPromise === void 0) if (route.lazyFn) route._lazyPromise = route.lazyFn().then((lazyRoute) => {
    const { id: _id, ...options } = lazyRoute.options;
    Object.assign(route.options, options);
    route._lazyLoaded = true;
    route._lazyPromise = void 0;
  });
  else route._lazyLoaded = true;
  const runAfterLazy = () => route._componentsLoaded ? void 0 : componentTypesToLoad === componentTypes ? (() => {
    if (route._componentsPromise === void 0) {
      const componentsPromise = preloadRouteComponents(route, componentTypes);
      if (componentsPromise) route._componentsPromise = componentsPromise.then(() => {
        route._componentsLoaded = true;
        route._componentsPromise = void 0;
      });
      else route._componentsLoaded = true;
    }
    return route._componentsPromise;
  })() : preloadRouteComponents(route, componentTypesToLoad);
  return route._lazyPromise ? route._lazyPromise.then(runAfterLazy) : runAfterLazy();
}
function makeMaybe(value, error) {
  if (error) return {
    status: "error",
    error
  };
  return {
    status: "success",
    value
  };
}
function routeNeedsPreload(route) {
  for (const componentType of componentTypes) if (route.options[componentType]?.preload) return true;
  return false;
}
const componentTypes = [
  "component",
  "errorComponent",
  "pendingComponent",
  "notFoundComponent"
];
function createNonReactiveMutableStore(initialValue) {
  let value = initialValue;
  return {
    get() {
      return value;
    },
    set(nextOrUpdater) {
      value = functionalUpdate$1(nextOrUpdater, value);
    }
  };
}
function createNonReactiveReadonlyStore(read) {
  return { get() {
    return read();
  } };
}
function createRouterStores(initialState, config) {
  const { createMutableStore, createReadonlyStore, batch, init } = config;
  const matchStores = /* @__PURE__ */ new Map();
  const pendingMatchStores = /* @__PURE__ */ new Map();
  const cachedMatchStores = /* @__PURE__ */ new Map();
  const status = createMutableStore(initialState.status);
  const loadedAt = createMutableStore(initialState.loadedAt);
  const isLoading = createMutableStore(initialState.isLoading);
  const isTransitioning = createMutableStore(initialState.isTransitioning);
  const location = createMutableStore(initialState.location);
  const resolvedLocation = createMutableStore(initialState.resolvedLocation);
  const statusCode = createMutableStore(initialState.statusCode);
  const redirect2 = createMutableStore(initialState.redirect);
  const matchesId = createMutableStore([]);
  const pendingIds = createMutableStore([]);
  const cachedIds = createMutableStore([]);
  const matches = createReadonlyStore(() => readPoolMatches(matchStores, matchesId.get()));
  const pendingMatches = createReadonlyStore(() => readPoolMatches(pendingMatchStores, pendingIds.get()));
  const cachedMatches = createReadonlyStore(() => readPoolMatches(cachedMatchStores, cachedIds.get()));
  const firstId = createReadonlyStore(() => matchesId.get()[0]);
  const hasPending = createReadonlyStore(() => matchesId.get().some((matchId) => {
    return matchStores.get(matchId)?.get().status === "pending";
  }));
  const matchRouteDeps = createReadonlyStore(() => ({
    locationHref: location.get().href,
    resolvedLocationHref: resolvedLocation.get()?.href,
    status: status.get()
  }));
  const __store = createReadonlyStore(() => ({
    status: status.get(),
    loadedAt: loadedAt.get(),
    isLoading: isLoading.get(),
    isTransitioning: isTransitioning.get(),
    matches: matches.get(),
    location: location.get(),
    resolvedLocation: resolvedLocation.get(),
    statusCode: statusCode.get(),
    redirect: redirect2.get()
  }));
  const matchStoreByRouteIdCache = createLRUCache(64);
  function getRouteMatchStore(routeId) {
    let cached = matchStoreByRouteIdCache.get(routeId);
    if (!cached) {
      cached = createReadonlyStore(() => {
        const ids = matchesId.get();
        for (const id of ids) {
          const matchStore = matchStores.get(id);
          if (matchStore && matchStore.routeId === routeId) return matchStore.get();
        }
      });
      matchStoreByRouteIdCache.set(routeId, cached);
    }
    return cached;
  }
  const store = {
    status,
    loadedAt,
    isLoading,
    isTransitioning,
    location,
    resolvedLocation,
    statusCode,
    redirect: redirect2,
    matchesId,
    pendingIds,
    cachedIds,
    matches,
    pendingMatches,
    cachedMatches,
    firstId,
    hasPending,
    matchRouteDeps,
    matchStores,
    pendingMatchStores,
    cachedMatchStores,
    __store,
    getRouteMatchStore,
    setMatches,
    setPending,
    setCached
  };
  setMatches(initialState.matches);
  init?.(store);
  function setMatches(nextMatches) {
    reconcileMatchPool(nextMatches, matchStores, matchesId, createMutableStore, batch);
  }
  function setPending(nextMatches) {
    reconcileMatchPool(nextMatches, pendingMatchStores, pendingIds, createMutableStore, batch);
  }
  function setCached(nextMatches) {
    reconcileMatchPool(nextMatches, cachedMatchStores, cachedIds, createMutableStore, batch);
  }
  return store;
}
function readPoolMatches(pool, ids) {
  const matches = [];
  for (const id of ids) {
    const matchStore = pool.get(id);
    if (matchStore) matches.push(matchStore.get());
  }
  return matches;
}
function reconcileMatchPool(nextMatches, pool, idStore, createMutableStore, batch) {
  const nextIds = nextMatches.map((d) => d.id);
  const nextIdSet = new Set(nextIds);
  batch(() => {
    for (const id of pool.keys()) if (!nextIdSet.has(id)) pool.delete(id);
    for (const nextMatch of nextMatches) {
      const existing = pool.get(nextMatch.id);
      if (!existing) {
        const matchStore = createMutableStore(nextMatch);
        matchStore.routeId = nextMatch.routeId;
        pool.set(nextMatch.id, matchStore);
        continue;
      }
      existing.routeId = nextMatch.routeId;
      if (existing.get() !== nextMatch) existing.set(nextMatch);
    }
    if (!arraysEqual(idStore.get(), nextIds)) idStore.set(nextIds);
  });
}
function getLocationChangeInfo(location, resolvedLocation) {
  const fromLocation = resolvedLocation;
  const toLocation = location;
  return {
    fromLocation,
    toLocation,
    pathChanged: fromLocation?.pathname !== toLocation.pathname,
    hrefChanged: fromLocation?.href !== toLocation.href,
    hashChanged: fromLocation?.hash !== toLocation.hash
  };
}
const locationHistoryActions = /* @__PURE__ */ new WeakMap();
var RouterCore = class {
  /**
  * @deprecated Use the `createRouter` function instead
  */
  constructor(options, getStoreConfig) {
    this.tempLocationKey = `${Math.round(Math.random() * 1e7)}`;
    this._scroll = { next: true };
    this.shouldViewTransition = void 0;
    this.isViewTransitionTypesSupported = void 0;
    this.subscribers = /* @__PURE__ */ new Set();
    this.routeBranchCache = /* @__PURE__ */ new WeakMap();
    this.lightweightCache = /* @__PURE__ */ new WeakMap();
    this.startTransition = (fn) => fn();
    this.update = (newOptions) => {
      const prevOptions = this.options;
      const prevBasepath = this.basepath ?? prevOptions?.basepath ?? "/";
      const basepathWasUnset = this.basepath === void 0;
      const prevRewriteOption = prevOptions?.rewrite;
      this.options = {
        ...prevOptions,
        ...newOptions
      };
      this.isServer = this.options.isServer ?? typeof document === "undefined";
      this.protocolAllowlist = new Set(this.options.protocolAllowlist);
      if (this.options.pathParamsAllowedCharacters) this.pathParamsDecoder = compileDecodeCharMap(this.options.pathParamsAllowedCharacters);
      if (!this.history || this.options.history && this.options.history !== this.history) if (!this.options.history) ;
      else this.history = this.options.history;
      this.origin = this.options.origin;
      if (!this.origin) this.origin = "http://localhost";
      if (this.history) this.updateLatestLocation();
      if (this.options.routeTree !== this.routeTree) {
        this.routeTree = this.options.routeTree;
        let processRouteTreeResult;
        if (globalThis.__TSR_CACHE__ && globalThis.__TSR_CACHE__.routeTree === this.routeTree) {
          const cached = globalThis.__TSR_CACHE__;
          this.resolvePathCache = cached.resolvePathCache;
          processRouteTreeResult = cached.processRouteTreeResult;
        } else {
          this.resolvePathCache = createLRUCache(1e3);
          processRouteTreeResult = this.buildRouteTree();
          if (globalThis.__TSR_CACHE__ === void 0) globalThis.__TSR_CACHE__ = {
            routeTree: this.routeTree,
            processRouteTreeResult,
            resolvePathCache: this.resolvePathCache
          };
        }
        this.setRoutes(processRouteTreeResult);
      }
      if (!this.stores && this.latestLocation) {
        const config = this.getStoreConfig(this);
        this.batch = config.batch;
        this.stores = createRouterStores(getInitialRouterState(this.latestLocation), config);
      }
      let needsLocationUpdate = false;
      const nextBasepath = this.options.basepath ?? "/";
      const nextRewriteOption = this.options.rewrite;
      if (basepathWasUnset || prevBasepath !== nextBasepath || prevRewriteOption !== nextRewriteOption) {
        this.basepath = nextBasepath;
        const rewrites = [];
        const trimmed = trimPath(nextBasepath);
        if (trimmed && trimmed !== "/") rewrites.push(rewriteBasepath({ basepath: nextBasepath }));
        if (nextRewriteOption) rewrites.push(nextRewriteOption);
        this.rewrite = rewrites.length === 0 ? void 0 : rewrites.length === 1 ? rewrites[0] : composeRewrites(rewrites);
        if (this.history) this.updateLatestLocation();
        needsLocationUpdate = true;
      }
      if (needsLocationUpdate && this.stores) this.stores.location.set(this.latestLocation);
      if (typeof window !== "undefined" && "CSS" in window && typeof window.CSS?.supports === "function") this.isViewTransitionTypesSupported = window.CSS.supports("selector(:active-view-transition-type(a))");
    };
    this.updateLatestLocation = () => {
      this.latestLocation = this.parseLocation(this.history.location, this.latestLocation);
    };
    this.buildRouteTree = () => {
      const result = processRouteTree(this.routeTree, this.options.caseSensitive, (route, i) => {
        route.init({ originalIndex: i });
      });
      if (this.options.routeMasks) processRouteMasks(this.options.routeMasks, result.processedTree);
      return result;
    };
    this.subscribe = (eventType, fn) => {
      const listener = {
        eventType,
        fn
      };
      this.subscribers.add(listener);
      return () => {
        this.subscribers.delete(listener);
      };
    };
    this.emit = (routerEvent) => {
      this.subscribers.forEach((listener) => {
        if (listener.eventType === routerEvent.type) listener.fn(routerEvent);
      });
    };
    this.parseLocation = (locationToParse, previousLocation) => {
      const parse = ({ pathname, search, hash, href, state }) => {
        if (!this.rewrite && !/[ \x00-\x1f\x7f\u0080-\uffff]/.test(pathname)) {
          const parsedSearch2 = this.options.parseSearch(search);
          const searchStr2 = this.options.stringifySearch(parsedSearch2);
          return {
            href: pathname + searchStr2 + hash,
            publicHref: pathname + searchStr2 + hash,
            pathname: decodePath(pathname).path,
            external: false,
            searchStr: searchStr2,
            search: nullReplaceEqualDeep(previousLocation?.search, parsedSearch2),
            hash: decodePath(hash.slice(1)).path,
            state: replaceEqualDeep$1(previousLocation?.state, state)
          };
        }
        const fullUrl = new URL(href, this.origin);
        const url = executeRewriteInput(this.rewrite, fullUrl);
        const parsedSearch = this.options.parseSearch(url.search);
        const searchStr = this.options.stringifySearch(parsedSearch);
        url.search = searchStr;
        return {
          href: url.href.replace(url.origin, ""),
          publicHref: href,
          pathname: decodePath(url.pathname).path,
          external: !!this.rewrite && url.origin !== this.origin,
          searchStr,
          search: nullReplaceEqualDeep(previousLocation?.search, parsedSearch),
          hash: decodePath(url.hash.slice(1)).path,
          state: replaceEqualDeep$1(previousLocation?.state, state)
        };
      };
      const location = parse(locationToParse);
      const { __tempLocation, __tempKey } = location.state;
      if (__tempLocation && (!__tempKey || __tempKey === this.tempLocationKey)) {
        const parsedTempLocation = parse(__tempLocation);
        parsedTempLocation.state.key = location.state.key;
        parsedTempLocation.state.__TSR_key = location.state.__TSR_key;
        delete parsedTempLocation.state.__tempLocation;
        return {
          ...parsedTempLocation,
          maskedLocation: location
        };
      }
      return location;
    };
    this.resolvePathWithBase = (from, path) => {
      return resolvePath({
        base: from,
        to: path.includes("//") ? cleanPath(path) : path,
        trailingSlash: this.options.trailingSlash,
        cache: this.resolvePathCache
      });
    };
    this.matchRoutes = (pathnameOrNext, locationSearchOrOpts, opts) => {
      if (typeof pathnameOrNext === "string") return this.matchRoutesInternal({
        pathname: pathnameOrNext,
        search: locationSearchOrOpts
      }, opts);
      return this.matchRoutesInternal(pathnameOrNext, locationSearchOrOpts);
    };
    this.getMatchedRoutes = (pathname) => {
      return getMatchedRoutes({
        pathname,
        routesById: this.routesById,
        processedTree: this.processedTree
      });
    };
    this.cancelMatch = (id) => {
      const match = this.getMatch(id);
      if (!match) return;
      match.abortController.abort();
      clearTimeout(match._nonReactive.pendingTimeout);
      match._nonReactive.pendingTimeout = void 0;
    };
    this.cancelMatches = () => {
      this.stores.pendingIds.get().forEach((matchId) => {
        this.cancelMatch(matchId);
      });
      this.stores.matchesId.get().forEach((matchId) => {
        if (this.stores.pendingMatchStores.has(matchId)) return;
        const match = this.stores.matchStores.get(matchId)?.get();
        if (!match) return;
        if (match.status === "pending" || match.isFetching === "loader") this.cancelMatch(matchId);
      });
    };
    this.buildLocation = (opts) => {
      const build = (dest = {}) => {
        const currentLocation = dest._fromLocation || this.pendingBuiltLocation || this.latestLocation;
        const lightweightResult = this.matchRoutesLightweight(currentLocation);
        if (dest.from && false) ;
        const defaultedFromPath = dest.unsafeRelative === "path" ? currentLocation.pathname : dest.from ?? lightweightResult.fullPath;
        const destTo = dest.to ? `${dest.to}` : void 0;
        const fromSearch = lightweightResult.search;
        const fromParams = Object.assign(/* @__PURE__ */ Object.create(null), lightweightResult.params);
        const sourcePath = destTo?.charCodeAt(0) === 47 ? "/" : this.resolvePathWithBase(defaultedFromPath, ".");
        const nextTo = destTo ? this.resolvePathWithBase(sourcePath, destTo) : sourcePath;
        const nextParams = dest.params === false || dest.params === null ? /* @__PURE__ */ Object.create(null) : (dest.params ?? true) === true ? fromParams : Object.assign(fromParams, functionalUpdate$1(dest.params, fromParams));
        const destRoute = this.routesByPath[trimPathRight(nextTo)];
        let destRoutes;
        if (destRoute) destRoutes = this.getRouteBranch(destRoute);
        else if (nextTo.includes("$")) destRoutes = [];
        else {
          const destMatchResult = this.getMatchedRoutes(nextTo);
          destRoutes = destMatchResult.matchedRoutes;
          if (this.options.notFoundRoute && (!destMatchResult.foundRoute || destMatchResult.foundRoute.path !== "/" && destMatchResult.routeParams["**"])) destRoutes = [...destRoutes, this.options.notFoundRoute];
        }
        if (destRoutes.length && hasKeys(nextParams)) for (const route of destRoutes) {
          const fn = route.options.params?.stringify ?? route.options.stringifyParams;
          if (fn) try {
            Object.assign(nextParams, fn(nextParams));
          } catch {
          }
        }
        const nextPathname = opts.leaveParams ? nextTo : decodePath(interpolatePath({
          path: nextTo,
          params: nextParams,
          decoder: this.pathParamsDecoder,
          server: this.isServer
        }).interpolatedPath).path;
        let nextSearch = fromSearch;
        if (opts._includeValidateSearch && this.options.search?.strict) {
          const validatedSearch = {};
          destRoutes.forEach((route) => {
            if (route.options.validateSearch) try {
              Object.assign(validatedSearch, validateSearch(route.options.validateSearch, {
                ...validatedSearch,
                ...nextSearch
              }));
            } catch {
            }
          });
          nextSearch = validatedSearch;
        }
        nextSearch = applySearchMiddleware({
          search: nextSearch,
          dest,
          destRoutes,
          _includeValidateSearch: opts._includeValidateSearch
        });
        nextSearch = nullReplaceEqualDeep(fromSearch, nextSearch);
        const searchStr = this.options.stringifySearch(nextSearch);
        const hash = dest.hash === true ? currentLocation.hash : dest.hash ? functionalUpdate$1(dest.hash, currentLocation.hash) : void 0;
        const hashStr = hash ? `#${hash}` : "";
        let nextState = dest.state === true ? currentLocation.state : dest.state ? functionalUpdate$1(dest.state, currentLocation.state) : {};
        nextState = replaceEqualDeep$1(currentLocation.state, nextState);
        const fullPath = `${nextPathname}${searchStr}${hashStr}`;
        let href;
        let publicHref;
        let external = false;
        if (this.rewrite) {
          const url = new URL(fullPath, this.origin);
          const rewrittenUrl = executeRewriteOutput(this.rewrite, url);
          href = url.href.replace(url.origin, "");
          if (rewrittenUrl.origin !== this.origin) {
            publicHref = rewrittenUrl.href;
            external = true;
          } else publicHref = rewrittenUrl.pathname + rewrittenUrl.search + rewrittenUrl.hash;
        } else {
          href = encodePathLikeUrl(fullPath);
          publicHref = href;
        }
        return {
          publicHref,
          href,
          pathname: nextPathname,
          search: nextSearch,
          searchStr,
          state: nextState,
          hash: hash ?? "",
          external,
          unmaskOnReload: dest.unmaskOnReload
        };
      };
      const buildWithMatches = (dest = {}, maskedDest) => {
        const next = build(dest);
        let maskedNext = maskedDest ? build(maskedDest) : void 0;
        if (!maskedNext) {
          const params = /* @__PURE__ */ Object.create(null);
          if (this.options.routeMasks) {
            const match = findFlatMatch(next.pathname, this.processedTree);
            if (match) {
              Object.assign(params, match.rawParams);
              const { from: _from, params: maskParams, ...maskProps } = match.route;
              const nextParams = maskParams === false || maskParams === null ? /* @__PURE__ */ Object.create(null) : (maskParams ?? true) === true ? params : Object.assign(params, functionalUpdate$1(maskParams, params));
              maskedDest = {
                from: opts.from,
                ...maskProps,
                params: nextParams
              };
              maskedNext = build(maskedDest);
            }
          }
        }
        if (maskedNext) next.maskedLocation = maskedNext;
        return next;
      };
      if (opts.mask) return buildWithMatches(opts, {
        from: opts.from,
        ...opts.mask
      });
      return buildWithMatches(opts);
    };
    this.commitLocation = async ({ viewTransition, ignoreBlocker, ...next }) => {
      let historyAction;
      const isSameState = () => {
        const ignoredProps = [
          "key",
          "__TSR_key",
          "__TSR_index",
          "__hashScrollIntoViewOptions"
        ];
        ignoredProps.forEach((prop) => {
          next.state[prop] = this.latestLocation.state[prop];
        });
        const isEqual = deepEqual(next.state, this.latestLocation.state);
        ignoredProps.forEach((prop) => {
          delete next.state[prop];
        });
        return isEqual;
      };
      const isSameUrl = trimPathRight(this.latestLocation.href) === trimPathRight(next.href);
      let previousCommitPromise = this.commitLocationPromise;
      this.commitLocationPromise = createControlledPromise(() => {
        previousCommitPromise?.resolve();
        previousCommitPromise = void 0;
      });
      if (isSameUrl && isSameState()) this.load();
      else {
        let { maskedLocation, hashScrollIntoView, ...nextHistory } = next;
        if (maskedLocation) {
          nextHistory = {
            ...maskedLocation,
            state: {
              ...maskedLocation.state,
              __tempKey: void 0,
              __tempLocation: {
                ...nextHistory,
                search: nextHistory.searchStr,
                state: {
                  ...nextHistory.state,
                  __tempKey: void 0,
                  __tempLocation: void 0,
                  __TSR_key: void 0,
                  key: void 0
                }
              }
            }
          };
          if (nextHistory.unmaskOnReload ?? this.options.unmaskOnReload ?? false) nextHistory.state.__tempKey = this.tempLocationKey;
        }
        nextHistory.state.__hashScrollIntoViewOptions = hashScrollIntoView ?? this.options.defaultHashScrollIntoView ?? true;
        this.shouldViewTransition = viewTransition;
        historyAction = next.replace ? "REPLACE" : "PUSH";
        this.history[historyAction === "REPLACE" ? "replace" : "push"](nextHistory.publicHref, nextHistory.state, { ignoreBlocker });
      }
      this._scroll.next = next.resetScroll ?? true;
      if (!this.history.subscribers.size) this.load(historyAction ? { action: { type: historyAction } } : void 0);
      return this.commitLocationPromise;
    };
    this.buildAndCommitLocation = ({ replace, resetScroll, hashScrollIntoView, viewTransition, ignoreBlocker, href, ...rest } = {}) => {
      if (href) {
        const currentIndex = this.history.location.state.__TSR_index;
        const parsed = parseHref(href, { __TSR_index: replace ? currentIndex : currentIndex + 1 });
        const hrefUrl = new URL(parsed.pathname, this.origin);
        rest.to = executeRewriteInput(this.rewrite, hrefUrl).pathname;
        rest.search = this.options.parseSearch(parsed.search);
        rest.hash = parsed.hash.slice(1);
      }
      const location = this.buildLocation({
        ...rest,
        _includeValidateSearch: true
      });
      this.pendingBuiltLocation = location;
      const commitPromise = this.commitLocation({
        ...location,
        viewTransition,
        replace,
        resetScroll,
        hashScrollIntoView,
        ignoreBlocker
      });
      queueMicrotask(() => {
        if (this.pendingBuiltLocation === location) this.pendingBuiltLocation = void 0;
      });
      return commitPromise;
    };
    this.navigate = async ({ to, reloadDocument, href, publicHref, ...rest }) => {
      let hrefIsUrl = false;
      if (href) try {
        new URL(`${href}`);
        hrefIsUrl = true;
      } catch {
      }
      if (hrefIsUrl && !reloadDocument) reloadDocument = true;
      if (reloadDocument) {
        if (to !== void 0 || !href) {
          const location = this.buildLocation({
            to,
            ...rest
          });
          href = href ?? location.publicHref;
          publicHref = publicHref ?? location.publicHref;
        }
        const reloadHref = !hrefIsUrl && publicHref ? publicHref : href;
        if (isDangerousProtocol(reloadHref, this.protocolAllowlist)) {
          return;
        }
        if (!rest.ignoreBlocker) {
          const blockers = this.history.getBlockers?.() ?? [];
          for (const blocker of blockers) if (blocker?.blockerFn) {
            if (await blocker.blockerFn({
              currentLocation: this.latestLocation,
              nextLocation: this.latestLocation,
              action: "PUSH"
            })) return;
          }
        }
        if (rest.replace) window.location.replace(reloadHref);
        else window.location.href = reloadHref;
        return;
      }
      return this.buildAndCommitLocation({
        ...rest,
        href,
        to,
        _isNavigate: true
      });
    };
    this.beforeLoad = () => {
      this.cancelMatches();
      this.updateLatestLocation();
      {
        const nextLocation = this.buildLocation({
          to: this.latestLocation.pathname,
          search: true,
          params: true,
          hash: true,
          state: true,
          _includeValidateSearch: true
        });
        if (this.latestLocation.publicHref !== nextLocation.publicHref) {
          const href = this.getParsedLocationHref(nextLocation);
          if (nextLocation.external) throw redirect({ href });
          else throw redirect({
            href,
            _builtLocation: nextLocation
          });
        }
      }
      const pendingMatches = this.matchRoutes(this.latestLocation);
      const nextCachedMatches = this.stores.cachedMatches.get().filter((d) => !pendingMatches.some((e) => e.id === d.id));
      this.batch(() => {
        this.stores.status.set("pending");
        this.stores.statusCode.set(200);
        this.stores.isLoading.set(true);
        this.stores.location.set(this.latestLocation);
        this.stores.setPending(pendingMatches);
        this.stores.setCached(nextCachedMatches);
      });
    };
    this.load = async (opts) => {
      const historyAction = opts?.action?.type;
      let redirect2;
      let notFound2;
      let loadPromise;
      const previousLocation = this.stores.resolvedLocation.get() ?? this.stores.location.get();
      loadPromise = new Promise((resolve) => {
        this.startTransition(async () => {
          try {
            this.beforeLoad();
            if (historyAction) locationHistoryActions.set(this.latestLocation, historyAction);
            else locationHistoryActions.delete(this.latestLocation);
            const next = this.latestLocation;
            const locationChangeInfo = getLocationChangeInfo(next, this.stores.resolvedLocation.get());
            if (!this.stores.redirect.get()) this.emit({
              type: "onBeforeNavigate",
              ...locationChangeInfo
            });
            this.emit({
              type: "onBeforeLoad",
              ...locationChangeInfo
            });
            await loadMatches({
              router: this,
              sync: opts?.sync,
              forceStaleReload: previousLocation.href === next.href,
              matches: this.stores.pendingMatches.get(),
              location: next,
              updateMatch: this.updateMatch,
              onReady: async () => {
                this.startTransition(() => {
                  this.startViewTransition(async () => {
                    let exitingMatches = null;
                    let hookExitingMatches = null;
                    let hookEnteringMatches = null;
                    let hookStayingMatches = null;
                    this.batch(() => {
                      const pendingMatches = this.stores.pendingMatches.get();
                      const mountPending = pendingMatches.length;
                      const currentMatches = this.stores.matches.get();
                      exitingMatches = mountPending ? currentMatches.filter((match) => !this.stores.pendingMatchStores.has(match.id)) : null;
                      const pendingRouteIds = /* @__PURE__ */ new Set();
                      for (const s of this.stores.pendingMatchStores.values()) if (s.routeId) pendingRouteIds.add(s.routeId);
                      const activeRouteIds = /* @__PURE__ */ new Set();
                      for (const s of this.stores.matchStores.values()) if (s.routeId) activeRouteIds.add(s.routeId);
                      hookExitingMatches = mountPending ? currentMatches.filter((match) => !pendingRouteIds.has(match.routeId)) : null;
                      hookEnteringMatches = mountPending ? pendingMatches.filter((match) => !activeRouteIds.has(match.routeId)) : null;
                      hookStayingMatches = mountPending ? pendingMatches.filter((match) => activeRouteIds.has(match.routeId)) : currentMatches;
                      this.stores.isLoading.set(false);
                      this.stores.loadedAt.set(Date.now());
                      if (mountPending) {
                        this.stores.setMatches(pendingMatches);
                        this.stores.setPending([]);
                        this.stores.setCached([...this.stores.cachedMatches.get(), ...exitingMatches.filter((d) => d.status !== "error" && d.status !== "notFound" && d.status !== "redirected")]);
                        this.clearExpiredCache();
                      }
                    });
                    for (const [matches, hook] of [
                      [hookExitingMatches, "onLeave"],
                      [hookEnteringMatches, "onEnter"],
                      [hookStayingMatches, "onStay"]
                    ]) {
                      if (!matches) continue;
                      for (const match of matches) this.looseRoutesById[match.routeId].options[hook]?.(match);
                    }
                  });
                });
              }
            });
          } catch (err) {
            if (isRedirect(err)) {
              redirect2 = err;
            } else if (isNotFound(err)) notFound2 = err;
            const nextStatusCode = redirect2 ? redirect2.status : notFound2 ? 404 : this.stores.matches.get().some((d) => d.status === "error") ? 500 : 200;
            this.batch(() => {
              this.stores.statusCode.set(nextStatusCode);
              this.stores.redirect.set(redirect2);
            });
          }
          if (this.latestLoadPromise === loadPromise) {
            this.commitLocationPromise?.resolve();
            this.latestLoadPromise = void 0;
            this.commitLocationPromise = void 0;
          }
          resolve();
        });
      });
      this.latestLoadPromise = loadPromise;
      await loadPromise;
      while (this.latestLoadPromise && loadPromise !== this.latestLoadPromise) await this.latestLoadPromise;
      let newStatusCode = void 0;
      if (this.hasNotFoundMatch()) newStatusCode = 404;
      else if (this.stores.matches.get().some((d) => d.status === "error")) newStatusCode = 500;
      if (newStatusCode !== void 0) this.stores.statusCode.set(newStatusCode);
    };
    this.startViewTransition = (fn) => {
      const shouldViewTransition = this.shouldViewTransition ?? this.options.defaultViewTransition;
      this.shouldViewTransition = void 0;
      if (shouldViewTransition && typeof document !== "undefined" && "startViewTransition" in document && typeof document.startViewTransition === "function") {
        let startViewTransitionParams;
        if (typeof shouldViewTransition === "object" && this.isViewTransitionTypesSupported) {
          const next = this.latestLocation;
          const prevLocation = this.stores.resolvedLocation.get();
          const resolvedViewTransitionTypes = typeof shouldViewTransition.types === "function" ? shouldViewTransition.types(getLocationChangeInfo(next, prevLocation)) : shouldViewTransition.types;
          if (resolvedViewTransitionTypes === false) {
            fn();
            return;
          }
          startViewTransitionParams = {
            update: fn,
            types: resolvedViewTransitionTypes
          };
        } else startViewTransitionParams = fn;
        document.startViewTransition(startViewTransitionParams);
      } else fn();
    };
    this.updateMatch = (id, updater) => {
      this.startTransition(() => {
        const pendingMatch = this.stores.pendingMatchStores.get(id);
        if (pendingMatch) {
          pendingMatch.set(updater);
          return;
        }
        const activeMatch = this.stores.matchStores.get(id);
        if (activeMatch) {
          activeMatch.set(updater);
          return;
        }
        const cachedMatch = this.stores.cachedMatchStores.get(id);
        if (cachedMatch) {
          const next = updater(cachedMatch.get());
          if (next.status === "redirected") {
            if (this.stores.cachedMatchStores.delete(id)) this.stores.cachedIds.set((prev) => prev.filter((matchId) => matchId !== id));
          } else cachedMatch.set(next);
        }
      });
    };
    this.getMatch = (matchId) => {
      return this.stores.cachedMatchStores.get(matchId)?.get() ?? this.stores.pendingMatchStores.get(matchId)?.get() ?? this.stores.matchStores.get(matchId)?.get();
    };
    this.invalidate = (opts) => {
      const invalidate = (d) => {
        if (opts?.filter?.(d) ?? true) return {
          ...d,
          invalid: true,
          ...opts?.forcePending || d.status === "error" || d.status === "notFound" ? {
            status: "pending",
            error: void 0
          } : void 0
        };
        return d;
      };
      this.batch(() => {
        this.stores.setMatches(this.stores.matches.get().map(invalidate));
        this.stores.setCached(this.stores.cachedMatches.get().map(invalidate));
        this.stores.setPending(this.stores.pendingMatches.get().map(invalidate));
      });
      this.shouldViewTransition = false;
      return this.load({ sync: opts?.sync });
    };
    this.getParsedLocationHref = (location) => {
      return location.publicHref || "/";
    };
    this.resolveRedirect = (redirect2) => {
      const locationHeader = redirect2.headers.get("Location");
      if (!redirect2.options.href || redirect2.options._builtLocation) {
        const location = redirect2.options._builtLocation ?? this.buildLocation(redirect2.options);
        const href = this.getParsedLocationHref(location);
        redirect2.options.href = href;
        redirect2.headers.set("Location", href);
      } else if (locationHeader) try {
        const url = new URL(locationHeader);
        if (this.origin && url.origin === this.origin) {
          const href = url.pathname + url.search + url.hash;
          redirect2.options.href = href;
          redirect2.headers.set("Location", href);
        }
      } catch {
      }
      if (redirect2.options.href && !redirect2.options._builtLocation && isDangerousProtocol(redirect2.options.href, this.protocolAllowlist)) throw new Error("Redirect blocked: unsafe protocol");
      if (!redirect2.headers.get("Location")) redirect2.headers.set("Location", redirect2.options.href);
      return redirect2;
    };
    this.clearCache = (opts) => {
      const filter = opts?.filter;
      if (filter !== void 0) this.stores.setCached(this.stores.cachedMatches.get().filter((m) => !filter(m)));
      else this.stores.setCached([]);
    };
    this.clearExpiredCache = () => {
      const now = Date.now();
      const filter = (d) => {
        const route = this.looseRoutesById[d.routeId];
        if (!route.options.loader) return true;
        const gcTime = (d.preload ? route.options.preloadGcTime ?? this.options.defaultPreloadGcTime : route.options.gcTime ?? this.options.defaultGcTime) ?? 300 * 1e3;
        if (d.status === "error") return true;
        return now - d.updatedAt >= gcTime;
      };
      this.clearCache({ filter });
    };
    this.loadRouteChunk = loadRouteChunk;
    this.preloadRoute = async (opts) => {
      const next = opts._builtLocation ?? this.buildLocation(opts);
      let matches = this.matchRoutes(next, {
        throwOnError: true,
        preload: true,
        dest: opts
      });
      const activeMatchIds = /* @__PURE__ */ new Set([...this.stores.matchesId.get(), ...this.stores.pendingIds.get()]);
      const loadedMatchIds = /* @__PURE__ */ new Set([...activeMatchIds, ...this.stores.cachedIds.get()]);
      const matchesToCache = matches.filter((match) => !loadedMatchIds.has(match.id));
      if (matchesToCache.length) {
        const cachedMatches = this.stores.cachedMatches.get();
        this.stores.setCached([...cachedMatches, ...matchesToCache]);
      }
      try {
        matches = await loadMatches({
          router: this,
          matches,
          location: next,
          preload: true,
          updateMatch: (id, updater) => {
            if (activeMatchIds.has(id)) matches = matches.map((d) => d.id === id ? updater(d) : d);
            else this.updateMatch(id, updater);
          }
        });
        return matches;
      } catch (err) {
        if (isRedirect(err)) {
          if (err.options.reloadDocument) return;
          return await this.preloadRoute({
            ...err.options,
            _fromLocation: next
          });
        }
        if (!isNotFound(err)) console.error(err);
        return;
      }
    };
    this.matchRoute = (location, opts) => {
      const matchLocation = {
        ...location,
        to: location.to ? this.resolvePathWithBase(location.from || "", location.to) : void 0,
        params: location.params || {},
        leaveParams: true
      };
      const next = this.buildLocation(matchLocation);
      if (opts?.pending && this.stores.status.get() !== "pending") return false;
      const baseLocation = (opts?.pending === void 0 ? !this.stores.isLoading.get() : opts.pending) ? this.latestLocation : this.stores.resolvedLocation.get() || this.stores.location.get();
      const match = findSingleMatch(next.pathname, opts?.caseSensitive ?? false, opts?.fuzzy ?? false, baseLocation.pathname, this.processedTree);
      if (!match) return false;
      if (location.params) {
        if (!deepEqual(match.rawParams, location.params, { partial: true })) return false;
      }
      if (opts?.includeSearch ?? true) return deepEqual(baseLocation.search, next.search, { partial: true }) ? match.rawParams : false;
      return match.rawParams;
    };
    this.hasNotFoundMatch = () => {
      return this.stores.matches.get().some((d) => d.status === "notFound" || d.globalNotFound);
    };
    this.getStoreConfig = getStoreConfig;
    this.update({
      defaultPreloadDelay: 50,
      defaultPendingMs: 1e3,
      defaultPendingMinMs: 500,
      context: void 0,
      ...options,
      caseSensitive: options.caseSensitive ?? false,
      notFoundMode: options.notFoundMode ?? "fuzzy",
      stringifySearch: options.stringifySearch ?? defaultStringifySearch,
      parseSearch: options.parseSearch ?? defaultParseSearch,
      protocolAllowlist: options.protocolAllowlist ?? DEFAULT_PROTOCOL_ALLOWLIST
    });
    if (typeof document !== "undefined") self.__TSR_ROUTER__ = this;
  }
  isShell() {
    return !!this.options.isShell;
  }
  isPrerendering() {
    return !!this.options.isPrerendering;
  }
  get state() {
    return this.stores.__store.get();
  }
  setRoutes({ routesById, routesByPath, processedTree }) {
    this.routesById = routesById;
    this.routesByPath = routesByPath;
    this.processedTree = processedTree;
    const notFoundRoute = this.options.notFoundRoute;
    if (notFoundRoute) {
      notFoundRoute.init({ originalIndex: 99999999999 });
      this.routesById[notFoundRoute.id] = notFoundRoute;
    }
  }
  getRouteBranch(route) {
    let branch = this.routeBranchCache.get(route);
    if (!branch) {
      branch = buildRouteBranch(route);
      this.routeBranchCache.set(route, branch);
    }
    return branch;
  }
  get looseRoutesById() {
    return this.routesById;
  }
  getParentContext(parentMatch) {
    return !parentMatch?.id ? this.options.context ?? void 0 : parentMatch.context ?? this.options.context ?? void 0;
  }
  matchRoutesInternal(next, opts) {
    const matchedRoutesResult = this.getMatchedRoutes(next.pathname);
    const { foundRoute, routeParams } = matchedRoutesResult;
    let { matchedRoutes } = matchedRoutesResult;
    let isGlobalNotFound = false;
    if (foundRoute ? foundRoute.path !== "/" && routeParams["**"] : trimPathRight(next.pathname)) if (this.options.notFoundRoute) matchedRoutes = [...matchedRoutes, this.options.notFoundRoute];
    else isGlobalNotFound = true;
    const globalNotFoundRouteId = isGlobalNotFound ? findGlobalNotFoundRouteId(this.options.notFoundMode, matchedRoutes) : void 0;
    const matches = new Array(matchedRoutes.length);
    const previousActiveMatchesByRouteId = /* @__PURE__ */ new Map();
    for (const store of this.stores.matchStores.values()) if (store.routeId) previousActiveMatchesByRouteId.set(store.routeId, store.get());
    for (let index = 0; index < matchedRoutes.length; index++) {
      const route = matchedRoutes[index];
      const parentMatch = matches[index - 1];
      let preMatchSearch;
      let strictMatchSearch;
      let searchError;
      {
        const parentSearch = parentMatch?.search ?? next.search;
        const parentStrictSearch = parentMatch?._strictSearch ?? void 0;
        try {
          const strictSearch = validateSearch(route.options.validateSearch, { ...parentSearch }) ?? void 0;
          preMatchSearch = {
            ...parentSearch,
            ...strictSearch
          };
          strictMatchSearch = {
            ...parentStrictSearch,
            ...strictSearch
          };
          searchError = void 0;
        } catch (err) {
          let searchParamError = err;
          if (!(err instanceof SearchParamError)) searchParamError = new SearchParamError(err.message, { cause: err });
          if (opts?.throwOnError) throw searchParamError;
          preMatchSearch = parentSearch;
          strictMatchSearch = {};
          searchError = searchParamError;
        }
      }
      const loaderDeps = route.options.loaderDeps?.({ search: preMatchSearch }) ?? "";
      const loaderDepsHash = loaderDeps ? JSON.stringify(loaderDeps) : "";
      const { interpolatedPath, usedParams } = interpolatePath({
        path: route.fullPath,
        params: routeParams,
        decoder: this.pathParamsDecoder,
        server: this.isServer
      });
      const matchId = route.id + interpolatedPath + loaderDepsHash;
      const existingMatch = this.getMatch(matchId);
      const previousMatch = previousActiveMatchesByRouteId.get(route.id);
      const strictParams = existingMatch?._strictParams ?? usedParams;
      let paramsError = void 0;
      if (!existingMatch) try {
        extractStrictParams(route, strictParams);
      } catch (err) {
        if (isNotFound(err) || isRedirect(err)) paramsError = err;
        else paramsError = new PathParamError(err.message, { cause: err });
        if (opts?.throwOnError) throw paramsError;
      }
      Object.assign(routeParams, strictParams);
      const cause = previousMatch ? "stay" : "enter";
      let match;
      if (existingMatch) match = {
        ...existingMatch,
        cause,
        params: previousMatch?.params ?? routeParams,
        _strictParams: strictParams,
        search: previousMatch ? nullReplaceEqualDeep(previousMatch.search, preMatchSearch) : nullReplaceEqualDeep(existingMatch.search, preMatchSearch),
        _strictSearch: strictMatchSearch
      };
      else {
        const status = route.options.loader || route.options.beforeLoad || route.lazyFn || routeNeedsPreload(route) ? "pending" : "success";
        match = {
          id: matchId,
          ssr: void 0,
          index,
          routeId: route.id,
          params: previousMatch?.params ?? routeParams,
          _strictParams: strictParams,
          pathname: interpolatedPath,
          updatedAt: Date.now(),
          search: previousMatch ? nullReplaceEqualDeep(previousMatch.search, preMatchSearch) : preMatchSearch,
          _strictSearch: strictMatchSearch,
          searchError: void 0,
          status,
          isFetching: false,
          error: void 0,
          paramsError,
          __routeContext: void 0,
          _nonReactive: { loadPromise: createControlledPromise() },
          __beforeLoadContext: void 0,
          context: {},
          abortController: new AbortController(),
          fetchCount: 0,
          cause,
          loaderDeps: previousMatch ? replaceEqualDeep$1(previousMatch.loaderDeps, loaderDeps) : loaderDeps,
          invalid: false,
          preload: false,
          links: void 0,
          scripts: void 0,
          headScripts: void 0,
          meta: void 0,
          staticData: route.options.staticData || {},
          fullPath: route.fullPath
        };
      }
      if (!opts?.preload) match.globalNotFound = globalNotFoundRouteId === route.id;
      match.searchError = searchError;
      const parentContext = this.getParentContext(parentMatch);
      match.context = {
        ...parentContext,
        ...match.__routeContext,
        ...match.__beforeLoadContext
      };
      matches[index] = match;
    }
    for (let index = 0; index < matches.length; index++) {
      const match = matches[index];
      const route = this.looseRoutesById[match.routeId];
      const existingMatch = this.getMatch(match.id);
      const previousMatch = previousActiveMatchesByRouteId.get(match.routeId);
      match.params = previousMatch ? nullReplaceEqualDeep(previousMatch.params, routeParams) : routeParams;
      if (!existingMatch) {
        const parentMatch = matches[index - 1];
        const parentContext = this.getParentContext(parentMatch);
        if (route.options.context) {
          const contextFnContext = {
            deps: match.loaderDeps,
            params: match.params,
            context: parentContext ?? {},
            location: next,
            navigate: (opts2) => this.navigate({
              ...opts2,
              _fromLocation: next
            }),
            buildLocation: this.buildLocation,
            cause: match.cause,
            abortController: match.abortController,
            preload: !!match.preload,
            matches,
            routeId: route.id
          };
          match.__routeContext = route.options.context(contextFnContext) ?? void 0;
        }
        match.context = {
          ...parentContext,
          ...match.__routeContext,
          ...match.__beforeLoadContext
        };
      }
    }
    return matches;
  }
  /**
  * Lightweight route matching for buildLocation.
  * Only computes fullPath, accumulated search, and params - skipping expensive
  * operations like AbortController, ControlledPromise, loaderDeps, and full match objects.
  */
  matchRoutesLightweight(location) {
    const lastStateMatchId = last(this.stores.matchesId.get());
    const cached = this.lightweightCache.get(location);
    if (cached && cached[0] === lastStateMatchId) return cached[1];
    const { matchedRoutes, routeParams } = this.getMatchedRoutes(location.pathname);
    const lastRoute = last(matchedRoutes);
    const accumulatedSearch = { ...location.search };
    for (const route of matchedRoutes) try {
      Object.assign(accumulatedSearch, validateSearch(route.options.validateSearch, accumulatedSearch));
    } catch {
    }
    const lastStateMatch = lastStateMatchId && this.stores.matchStores.get(lastStateMatchId)?.get();
    const canReuseParams = lastStateMatch && lastStateMatch.routeId === lastRoute.id && lastStateMatch.pathname === location.pathname;
    let params;
    if (canReuseParams) params = lastStateMatch.params;
    else {
      const strictParams = Object.assign(/* @__PURE__ */ Object.create(null), routeParams);
      for (const route of matchedRoutes) try {
        extractStrictParams(route, strictParams);
      } catch {
      }
      params = strictParams;
    }
    const result = {
      matchedRoutes,
      fullPath: lastRoute.fullPath,
      search: accumulatedSearch,
      params
    };
    this.lightweightCache.set(location, [lastStateMatchId, result]);
    return result;
  }
};
var SearchParamError = class extends Error {
};
var PathParamError = class extends Error {
};
function getInitialRouterState(location) {
  return {
    loadedAt: 0,
    isLoading: false,
    isTransitioning: false,
    status: "idle",
    resolvedLocation: void 0,
    location,
    matches: [],
    statusCode: 200
  };
}
function validateSearch(validateSearch2, input) {
  if (validateSearch2 == null) return {};
  if ("~standard" in validateSearch2) {
    const result = validateSearch2["~standard"].validate(input);
    if (result instanceof Promise) throw new SearchParamError("Async validation not supported");
    if (result.issues) throw new SearchParamError(JSON.stringify(result.issues, void 0, 2), { cause: result });
    return result.value;
  }
  if ("parse" in validateSearch2) return validateSearch2.parse(input);
  if (typeof validateSearch2 === "function") return validateSearch2(input);
  return {};
}
function getMatchedRoutes({ pathname, routesById, processedTree }) {
  const routeParams = /* @__PURE__ */ Object.create(null);
  const trimmedPath = trimPathRight(pathname);
  let foundRoute = void 0;
  const match = findRouteMatch(trimmedPath, processedTree, true);
  if (match) {
    foundRoute = match.route;
    Object.assign(routeParams, match.rawParams);
  }
  return {
    matchedRoutes: match?.branch || [routesById["__root__"]],
    routeParams,
    foundRoute
  };
}
function applySearchMiddleware({ search, dest, destRoutes, _includeValidateSearch }) {
  return buildMiddlewareChain(destRoutes)(search, dest, _includeValidateSearch ?? false);
}
function buildMiddlewareChain(destRoutes) {
  let dest;
  let includeValidateSearch;
  const middlewares = [];
  for (const route of destRoutes) {
    const routeOptions = route.options;
    if ("search" in routeOptions) {
      if (routeOptions.search?.middlewares) middlewares.push(...routeOptions.search.middlewares);
    } else if (routeOptions.preSearchFilters || routeOptions.postSearchFilters) {
      const legacyMiddleware = ({ search, next }) => {
        const result = next(routeOptions.preSearchFilters ? routeOptions.preSearchFilters.reduce((prev, next2) => next2(prev), search) : search);
        return routeOptions.postSearchFilters ? routeOptions.postSearchFilters.reduce((prev, next2) => next2(prev), result) : result;
      };
      middlewares.push(legacyMiddleware);
    }
    const routeValidateSearch = routeOptions.validateSearch;
    if (routeValidateSearch) {
      const validate = ({ search, next, meta }) => {
        const result = next(search);
        if (includeValidateSearch) try {
          const validated = validateSearch(routeValidateSearch, result);
          if (meta && validated) {
            for (const key in validated) if (!(key in result)) (meta.defaulted ||= /* @__PURE__ */ new Map()).set(key, validated[key]);
          }
          return {
            ...result,
            ...validated
          };
        } catch {
        }
        return result;
      };
      middlewares.push(validate);
    }
  }
  const applyNext = (index, currentSearch, meta) => {
    if (index >= middlewares.length) {
      if (!dest.search) return {};
      if (dest.search === true) return currentSearch;
      const result = functionalUpdate$1(dest.search, currentSearch);
      if (meta) meta.explicit = result;
      return result;
    }
    const next = (newSearch, collectMeta) => {
      if (collectMeta) {
        const nextMeta = meta || {};
        return {
          search: applyNext(index + 1, newSearch, nextMeta),
          meta: nextMeta
        };
      }
      return applyNext(index + 1, newSearch, meta);
    };
    return middlewares[index]({
      search: currentSearch,
      next,
      meta
    });
  };
  return function middleware(search, nextDest, _includeValidateSearch) {
    dest = nextDest;
    includeValidateSearch = _includeValidateSearch;
    return applyNext(0, search);
  };
}
function findGlobalNotFoundRouteId(notFoundMode, routes) {
  if (notFoundMode !== "root") for (let i = routes.length - 1; i >= 0; i--) {
    const route = routes[i];
    if (route.children) return route.id;
  }
  return rootRouteId;
}
function extractStrictParams(route, accumulatedParams) {
  const parseParams = route.options.params?.parse ?? route.options.parseParams;
  if (parseParams) {
    const result = parseParams(accumulatedParams);
    if (result === false) throw new Error("Route params.parse returned false for a matched route");
    Object.assign(accumulatedParams, result);
  }
}
var BaseRoute = class {
  get to() {
    return this._to;
  }
  get id() {
    return this._id;
  }
  get path() {
    return this._path;
  }
  get fullPath() {
    return this._fullPath;
  }
  constructor(options) {
    this.init = (opts) => {
      this.originalIndex = opts.originalIndex;
      const options2 = this.options;
      const isRoot = !options2?.path && !options2?.id;
      this.parentRoute = this.options.getParentRoute?.();
      if (isRoot) this._path = rootRouteId;
      else if (!this.parentRoute) {
        invariant();
      }
      let path = isRoot ? rootRouteId : options2?.path;
      if (path && path !== "/") path = trimPathLeft(path);
      const customId = options2?.id || path;
      let id = isRoot ? rootRouteId : joinPaths([this.parentRoute.id === "__root__" ? "" : this.parentRoute.id, customId]);
      if (path === "__root__") path = "/";
      if (id !== "__root__") id = joinPaths(["/", id]);
      const fullPath = id === "__root__" ? "/" : joinPaths([this.parentRoute.fullPath, path]);
      this._path = path;
      this._id = id;
      this._fullPath = fullPath;
      this._to = trimPathRight(fullPath);
    };
    this.addChildren = (children) => {
      return this._addFileChildren(children);
    };
    this._addFileChildren = (children) => {
      if (Array.isArray(children)) this.children = children;
      if (typeof children === "object" && children !== null) this.children = Object.values(children);
      return this;
    };
    this._addFileTypes = () => {
      return this;
    };
    this.updateLoader = (options2) => {
      Object.assign(this.options, options2);
      return this;
    };
    this.update = (options2) => {
      Object.assign(this.options, options2);
      return this;
    };
    this.lazy = (lazyFn) => {
      this.lazyFn = lazyFn;
      return this;
    };
    this.redirect = (opts) => redirect({
      from: this.fullPath,
      ...opts
    });
    this.options = options || {};
    this.isRoot = !options?.getParentRoute;
    if (options?.id && options?.path) throw new Error(`Route cannot have both an 'id' and a 'path' option.`);
  }
};
var BaseRootRoute = class extends BaseRoute {
  constructor(options) {
    super(options);
  }
};
function useMatch(opts) {
  const router2 = useRouter();
  const nearestMatchId = reactExports.useContext(opts.from ? dummyMatchContext : matchContext);
  const matchStore = opts.from ? router2.stores.getRouteMatchStore(opts.from) : router2.stores.matchStores.get(nearestMatchId);
  {
    const match = matchStore?.get();
    if (!match) {
      if (opts.shouldThrow ?? true) {
        invariant();
      }
      return;
    }
    return opts.select ? opts.select(match) : match;
  }
}
function useLoaderData(opts) {
  return useMatch({
    from: opts.from,
    strict: opts.strict,
    structuralSharing: opts.structuralSharing,
    select: (match) => {
      return opts.select ? opts.select(match.loaderData) : match.loaderData;
    }
  });
}
function useLoaderDeps(opts) {
  const { select, ...rest } = opts;
  return useMatch({
    ...rest,
    select: (match) => {
      return select ? select(match.loaderDeps) : match.loaderDeps;
    }
  });
}
function useParams(opts) {
  return useMatch({
    from: opts.from,
    shouldThrow: opts.shouldThrow,
    structuralSharing: opts.structuralSharing,
    strict: opts.strict,
    select: (match) => {
      const params = opts.strict === false ? match.params : match._strictParams;
      return opts.select ? opts.select(params) : params;
    }
  });
}
function useSearch(opts) {
  return useMatch({
    from: opts.from,
    strict: opts.strict,
    shouldThrow: opts.shouldThrow,
    structuralSharing: opts.structuralSharing,
    select: (match) => {
      return opts.select ? opts.select(match.search) : match.search;
    }
  });
}
function useNavigate(_defaultOpts) {
  const router2 = useRouter();
  return reactExports.useCallback((options) => {
    return router2.navigate({
      ...options,
      from: options.from ?? _defaultOpts?.from
    });
  }, [_defaultOpts?.from, router2]);
}
function useRouteContext(opts) {
  return useMatch({
    ...opts,
    select: (match) => opts.select ? opts.select(match.context) : match.context
  });
}
requireReactDom();
function useLinkProps(options, forwardedRef) {
  const router2 = useRouter();
  const innerRef = useForwardedRef(forwardedRef);
  const { activeProps, inactiveProps, activeOptions, to, preload: userPreload, preloadDelay: userPreloadDelay, preloadIntentProximity: _preloadIntentProximity, hashScrollIntoView, replace, startTransition, resetScroll, viewTransition, children, target, disabled, style, className, onClick, onBlur, onFocus, onMouseEnter, onMouseLeave, onTouchStart, ignoreBlocker, params: _params, search: _search, hash: _hash, state: _state, mask: _mask, reloadDocument: _reloadDocument, unsafeRelative: _unsafeRelative, from: _from, _fromLocation, ...propsSafeToSpread } = options;
  {
    const safeInternal = isSafeInternal(to);
    if (typeof to === "string" && !safeInternal && to.indexOf(":") > -1) try {
      new URL(to);
      if (isDangerousProtocol(to, router2.protocolAllowlist)) {
        if (false) ;
        return {
          ...propsSafeToSpread,
          ref: innerRef,
          href: void 0,
          ...children && { children },
          ...target && { target },
          ...disabled && { disabled },
          ...style && { style },
          ...className && { className }
        };
      }
      return {
        ...propsSafeToSpread,
        ref: innerRef,
        href: to,
        ...children && { children },
        ...target && { target },
        ...disabled && { disabled },
        ...style && { style },
        ...className && { className }
      };
    } catch {
    }
    const next2 = router2.buildLocation({
      ...options,
      from: options.from
    });
    const hrefOption2 = getHrefOption(next2.maskedLocation ? next2.maskedLocation.publicHref : next2.publicHref, next2.maskedLocation ? next2.maskedLocation.external : next2.external, router2.history, disabled);
    const externalLink2 = (() => {
      if (hrefOption2?.external) {
        if (isDangerousProtocol(hrefOption2.href, router2.protocolAllowlist)) {
          return;
        }
        return hrefOption2.href;
      }
      if (safeInternal) return void 0;
      if (typeof to === "string" && to.indexOf(":") > -1) try {
        new URL(to);
        if (isDangerousProtocol(to, router2.protocolAllowlist)) {
          if (false) ;
          return;
        }
        return to;
      } catch {
      }
    })();
    const isActive2 = (() => {
      if (externalLink2) return false;
      const currentLocation2 = router2.stores.location.get();
      const exact = activeOptions?.exact ?? false;
      if (exact) {
        if (!exactPathTest(currentLocation2.pathname, next2.pathname, router2.basepath)) return false;
      } else {
        const currentPathSplit = removeTrailingSlash(currentLocation2.pathname, router2.basepath);
        const nextPathSplit = removeTrailingSlash(next2.pathname, router2.basepath);
        if (!(currentPathSplit.startsWith(nextPathSplit) && (currentPathSplit.length === nextPathSplit.length || currentPathSplit[nextPathSplit.length] === "/"))) return false;
      }
      if (activeOptions?.includeSearch ?? true) {
        if (currentLocation2.search !== next2.search) {
          const currentSearchEmpty = !currentLocation2.search || typeof currentLocation2.search === "object" && !hasKeys(currentLocation2.search);
          const nextSearchEmpty = !next2.search || typeof next2.search === "object" && !hasKeys(next2.search);
          if (!(currentSearchEmpty && nextSearchEmpty)) {
            if (!deepEqual(currentLocation2.search, next2.search, {
              partial: !exact,
              ignoreUndefined: !activeOptions?.explicitUndefined
            })) return false;
          }
        }
      }
      if (activeOptions?.includeHash) return false;
      return true;
    })();
    if (externalLink2) return {
      ...propsSafeToSpread,
      ref: innerRef,
      href: externalLink2,
      ...children && { children },
      ...target && { target },
      ...disabled && { disabled },
      ...style && { style },
      ...className && { className }
    };
    const resolvedActiveProps2 = isActive2 ? functionalUpdate$1(activeProps, {}) ?? STATIC_ACTIVE_OBJECT : STATIC_EMPTY_OBJECT;
    const resolvedInactiveProps2 = isActive2 ? STATIC_EMPTY_OBJECT : functionalUpdate$1(inactiveProps, {}) ?? STATIC_EMPTY_OBJECT;
    const resolvedStyle2 = (() => {
      const baseStyle = style;
      const activeStyle = resolvedActiveProps2.style;
      const inactiveStyle = resolvedInactiveProps2.style;
      if (!baseStyle && !activeStyle && !inactiveStyle) return;
      if (baseStyle && !activeStyle && !inactiveStyle) return baseStyle;
      if (!baseStyle && activeStyle && !inactiveStyle) return activeStyle;
      if (!baseStyle && !activeStyle && inactiveStyle) return inactiveStyle;
      return {
        ...baseStyle,
        ...activeStyle,
        ...inactiveStyle
      };
    })();
    const resolvedClassName2 = (() => {
      const baseClassName = className;
      const activeClassName = resolvedActiveProps2.className;
      const inactiveClassName = resolvedInactiveProps2.className;
      if (!baseClassName && !activeClassName && !inactiveClassName) return "";
      let out = "";
      if (baseClassName) out = baseClassName;
      if (activeClassName) out = out ? `${out} ${activeClassName}` : activeClassName;
      if (inactiveClassName) out = out ? `${out} ${inactiveClassName}` : inactiveClassName;
      return out;
    })();
    return {
      ...propsSafeToSpread,
      ...resolvedActiveProps2,
      ...resolvedInactiveProps2,
      href: hrefOption2?.href,
      ref: innerRef,
      disabled: !!disabled,
      target,
      ...resolvedStyle2 && { style: resolvedStyle2 },
      ...resolvedClassName2 && { className: resolvedClassName2 },
      ...disabled && STATIC_DISABLED_PROPS,
      ...isActive2 && STATIC_ACTIVE_PROPS
    };
  }
}
var STATIC_EMPTY_OBJECT = {};
var STATIC_ACTIVE_OBJECT = { className: "active" };
var STATIC_DISABLED_PROPS = {
  role: "link",
  "aria-disabled": true
};
var STATIC_ACTIVE_PROPS = {
  "data-status": "active",
  "aria-current": "page"
};
function getHrefOption(publicHref, external, history, disabled) {
  if (disabled) return void 0;
  if (external) return {
    href: publicHref,
    external: true
  };
  return {
    href: history.createHref(publicHref) || "/",
    external: false
  };
}
function isSafeInternal(to) {
  if (typeof to !== "string") return false;
  const zero = to.charCodeAt(0);
  if (zero === 47) return to.charCodeAt(1) !== 47;
  return zero === 46;
}
var Link = reactExports.forwardRef((props, ref) => {
  const { _asChild, ...rest } = props;
  const { type: _type, ...linkProps } = useLinkProps(rest, ref);
  const children = typeof rest.children === "function" ? rest.children({ isActive: linkProps["data-status"] === "active" }) : rest.children;
  if (!_asChild) {
    const { disabled: _, ...rest2 } = linkProps;
    return reactExports.createElement("a", rest2, children);
  }
  return reactExports.createElement(_asChild, linkProps, children);
});
var Route$j = class Route extends BaseRoute {
  /**
  * @deprecated Use the `createRoute` function instead.
  */
  constructor(options) {
    super(options);
    this.useMatch = (opts) => {
      return useMatch({
        select: opts?.select,
        from: this.id,
        structuralSharing: opts?.structuralSharing
      });
    };
    this.useRouteContext = (opts) => {
      return useRouteContext({
        ...opts,
        from: this.id
      });
    };
    this.useSearch = (opts) => {
      return useSearch({
        select: opts?.select,
        structuralSharing: opts?.structuralSharing,
        from: this.id
      });
    };
    this.useParams = (opts) => {
      return useParams({
        select: opts?.select,
        structuralSharing: opts?.structuralSharing,
        from: this.id
      });
    };
    this.useLoaderDeps = (opts) => {
      return useLoaderDeps({
        ...opts,
        from: this.id
      });
    };
    this.useLoaderData = (opts) => {
      return useLoaderData({
        ...opts,
        from: this.id
      });
    };
    this.useNavigate = () => {
      return useNavigate({ from: this.fullPath });
    };
    this.Link = React.forwardRef((props, ref) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
        ref,
        from: this.fullPath,
        ...props
      });
    });
  }
};
function createRoute(options) {
  return new Route$j(options);
}
function createRootRouteWithContext() {
  return (options) => {
    return createRootRoute(options);
  };
}
var RootRoute = class extends BaseRootRoute {
  /**
  * @deprecated `RootRoute` is now an internal implementation detail. Use `createRootRoute()` instead.
  */
  constructor(options) {
    super(options);
    this.useMatch = (opts) => {
      return useMatch({
        select: opts?.select,
        from: this.id,
        structuralSharing: opts?.structuralSharing
      });
    };
    this.useRouteContext = (opts) => {
      return useRouteContext({
        ...opts,
        from: this.id
      });
    };
    this.useSearch = (opts) => {
      return useSearch({
        select: opts?.select,
        structuralSharing: opts?.structuralSharing,
        from: this.id
      });
    };
    this.useParams = (opts) => {
      return useParams({
        select: opts?.select,
        structuralSharing: opts?.structuralSharing,
        from: this.id
      });
    };
    this.useLoaderDeps = (opts) => {
      return useLoaderDeps({
        ...opts,
        from: this.id
      });
    };
    this.useLoaderData = (opts) => {
      return useLoaderData({
        ...opts,
        from: this.id
      });
    };
    this.useNavigate = () => {
      return useNavigate({ from: this.fullPath });
    };
    this.Link = React.forwardRef((props, ref) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
        ref,
        from: this.fullPath,
        ...props
      });
    });
  }
};
function createRootRoute(options) {
  return new RootRoute(options);
}
function createFileRoute(path) {
  return new FileRoute(path, { silent: true }).createRoute;
}
var FileRoute = class {
  constructor(path, _opts) {
    this.path = path;
    this.createRoute = (options) => {
      const route = createRoute(options);
      route.isRoot = false;
      return route;
    };
    this.silent = _opts?.silent;
  }
};
function lazyRouteComponent(importer, exportName) {
  let loadPromise;
  let comp;
  let error;
  let reload;
  const load = () => {
    if (!loadPromise) loadPromise = importer().then((res) => {
      loadPromise = void 0;
      comp = res[exportName];
    }).catch((err) => {
      error = err;
      if (isModuleNotFoundError(error)) {
        if (error instanceof Error && typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
          const storageKey = `tanstack_router_reload:${error.message}`;
          if (!sessionStorage.getItem(storageKey)) {
            sessionStorage.setItem(storageKey, "1");
            reload = true;
          }
        }
      }
    });
    return loadPromise;
  };
  const lazyComp = function Lazy(props) {
    if (reload) {
      window.location.reload();
      throw new Promise(() => {
      });
    }
    if (error) throw error;
    if (!comp) if (reactUse) reactUse(load());
    else throw load();
    return reactExports.createElement(comp, props);
  };
  lazyComp.preload = load;
  return lazyComp;
}
var getStoreFactory = (opts) => {
  return {
    createMutableStore: createNonReactiveMutableStore,
    createReadonlyStore: createNonReactiveReadonlyStore,
    batch: (fn) => fn()
  };
};
var createRouter = (options) => {
  return new Router(options);
};
var Router = class extends RouterCore {
  constructor(options) {
    super(options, getStoreFactory);
  }
};
function useRouterState(opts) {
  const contextRouter = useRouter({ warn: opts?.router === void 0 });
  const router2 = opts?.router || contextRouter;
  {
    const state = router2.stores.__store.get();
    return opts?.select ? opts.select(state) : state;
  }
}
var noopScriptHandler = () => {
};
function setScriptAttrs(script, attrs) {
  if (!attrs) return;
  for (const [key, value] of Object.entries(attrs)) if (key !== "suppressHydrationWarning" && value !== void 0 && value !== false) script.setAttribute(key, typeof value === "boolean" ? "" : String(value));
}
function Asset(asset) {
  const { attrs, children, nonce, preventScriptHoist } = asset;
  switch (asset.tag) {
    case "title":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("title", {
        ...attrs,
        suppressHydrationWarning: true,
        children
      });
    case "meta":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("meta", {
        ...attrs,
        suppressHydrationWarning: true
      });
    case "link":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("link", {
        ...attrs,
        precedence: attrs?.precedence ?? (attrs?.rel === "stylesheet" ? "default" : void 0),
        nonce,
        suppressHydrationWarning: true
      });
    case "style":
      if (asset.inlineCss && false) ;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("style", {
        ...attrs,
        dangerouslySetInnerHTML: { __html: children },
        nonce
      });
    case "script":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Script, {
        attrs,
        preventScriptHoist,
        children
      });
    default:
      return null;
  }
}
function Script({ attrs, children, preventScriptHoist }) {
  useRouter();
  useHydrated();
  const dataScript = typeof attrs?.type === "string" && attrs.type !== "" && attrs.type !== "text/javascript" && attrs.type !== "module";
  reactExports.useEffect(() => {
    if (dataScript) return;
    if (attrs?.src) {
      const normSrc = (() => {
        try {
          const base = document.baseURI || window.location.href;
          return new URL(attrs.src, base).href;
        } catch {
          return attrs.src;
        }
      })();
      for (const el of document.querySelectorAll("script[src]")) if (el.src === normSrc) return;
      const script = document.createElement("script");
      setScriptAttrs(script, attrs);
      document.head.appendChild(script);
      return () => script.remove();
    }
    if (typeof children === "string") {
      const typeAttr = typeof attrs?.type === "string" ? attrs.type : "text/javascript";
      const nonceAttr = typeof attrs?.nonce === "string" ? attrs.nonce : void 0;
      for (const el of document.querySelectorAll("script:not([src])")) {
        if (!(el instanceof HTMLScriptElement)) continue;
        const sType = el.getAttribute("type") ?? "text/javascript";
        const sNonce = el.getAttribute("nonce") ?? void 0;
        if (el.textContent === children && sType === typeAttr && sNonce === nonceAttr) return;
      }
      const script = document.createElement("script");
      script.textContent = children;
      setScriptAttrs(script, attrs);
      document.head.appendChild(script);
      return () => script.remove();
    }
  }, [
    attrs,
    children,
    dataScript
  ]);
  {
    if (attrs?.src) {
      if (!preventScriptHoist) return /* @__PURE__ */ jsxRuntimeExports.jsx("script", {
        ...attrs,
        suppressHydrationWarning: true
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx("script", {
        ...attrs,
        onLoad: noopScriptHandler,
        suppressHydrationWarning: true
      });
    }
    if (typeof children === "string") return /* @__PURE__ */ jsxRuntimeExports.jsx("script", {
      ...attrs,
      dangerouslySetInnerHTML: { __html: children },
      suppressHydrationWarning: true
    });
    return null;
  }
}
function buildTagsFromMatches(router2, nonce, matches, assetCrossOrigin) {
  const routeMeta = matches.map((match) => match.meta).filter((meta) => meta !== void 0);
  const resultMeta = [];
  const metaByAttribute = {};
  let title;
  for (let i = routeMeta.length - 1; i >= 0; i--) {
    const metas = routeMeta[i];
    for (let j = metas.length - 1; j >= 0; j--) {
      const m = metas[j];
      if (!m) continue;
      if (m.title) {
        if (!title) title = {
          tag: "title",
          children: m.title
        };
      } else if ("script:ld+json" in m) try {
        const json2 = JSON.stringify(m["script:ld+json"]);
        resultMeta.push({
          tag: "script",
          attrs: { type: "application/ld+json" },
          children: escapeHtml(json2)
        });
      } catch {
      }
      else {
        const attribute = m.name ?? m.property;
        if (attribute) if (metaByAttribute[attribute]) continue;
        else metaByAttribute[attribute] = true;
        resultMeta.push({
          tag: "meta",
          attrs: {
            ...m,
            nonce
          }
        });
      }
    }
  }
  if (title) resultMeta.push(title);
  if (nonce) resultMeta.push({
    tag: "meta",
    attrs: {
      property: "csp-nonce",
      content: nonce
    }
  });
  resultMeta.reverse();
  const constructedLinks = matches.flatMap((match) => match.links ?? []).filter((link) => link !== void 0).map((link) => ({
    tag: "link",
    attrs: {
      ...link,
      nonce
    }
  }));
  const manifest = router2.ssr?.manifest;
  const manifestCssTags = [];
  if (manifest) {
    matches.forEach((match) => {
      manifest.routes[match.routeId]?.css?.forEach((link) => {
        const resolvedLink = resolveManifestCssLink(link);
        manifestCssTags.push({
          tag: "link",
          attrs: {
            rel: "stylesheet",
            ...resolvedLink,
            crossOrigin: getAssetCrossOrigin(assetCrossOrigin, "stylesheet") ?? resolvedLink.crossOrigin,
            suppressHydrationWarning: true,
            nonce
          }
        });
      });
    });
    if (manifest.inlineStyle) manifestCssTags.push({
      tag: "style",
      attrs: {
        ...manifest.inlineStyle.attrs,
        nonce
      },
      children: manifest.inlineStyle.children,
      inlineCss: true
    });
  }
  const preloadLinks = [];
  if (manifest) matches.forEach((match) => {
    manifest.routes[match.routeId]?.preloads?.forEach((preload) => {
      preloadLinks.push({
        tag: "link",
        attrs: {
          ...getScriptPreloadAttrs(manifest, preload, assetCrossOrigin),
          nonce
        }
      });
    });
  });
  const styles = matches.flatMap((match) => match.styles ?? []).filter((style) => style !== void 0).map(({ children, ...attrs }) => ({
    tag: "style",
    attrs: {
      ...attrs,
      nonce
    },
    children
  }));
  const headScripts = matches.flatMap((match) => match.headScripts ?? []).filter((script) => script !== void 0).map(({ children, ...script }) => ({
    tag: "script",
    attrs: {
      ...script,
      nonce
    },
    children
  }));
  const tags = [];
  appendUniqueUserTags(tags, resultMeta);
  tags.push(...preloadLinks);
  appendUniqueUserTags(tags, constructedLinks);
  tags.push(...manifestCssTags);
  appendUniqueUserTags(tags, styles);
  appendUniqueUserTags(tags, headScripts);
  return tags;
}
var useTags = (assetCrossOrigin) => {
  const router2 = useRouter();
  const nonce = router2.options.ssr?.nonce;
  return buildTagsFromMatches(router2, nonce, router2.stores.matches.get(), assetCrossOrigin);
};
function HeadContent(props) {
  const tags = useTags(props.assetCrossOrigin);
  const nonce = useRouter().options.ssr?.nonce;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: tags.map((tag) => /* @__PURE__ */ reactExports.createElement(Asset, {
    ...tag,
    key: `tsr-meta-${JSON.stringify(tag)}`,
    nonce
  })) });
}
var Scripts = () => {
  const router2 = useRouter();
  const nonce = router2.options.ssr?.nonce;
  const getAssetScripts = (matches) => {
    const assetScripts = [];
    const manifest = router2.ssr?.manifest;
    if (!manifest) return [];
    for (const match of matches) {
      const scripts = manifest.routes[match.routeId]?.scripts;
      if (!scripts) continue;
      for (const asset of scripts) assetScripts.push({
        tag: "script",
        attrs: {
          ...asset.attrs,
          nonce
        },
        children: asset.children,
        ...typeof asset.attrs?.src === "string" ? { preventScriptHoist: true } : {}
      });
    }
    return assetScripts;
  };
  const getScripts = (matches) => matches.map((match) => match.scripts).flat(1).filter(Boolean).map(({ children, ...script }) => ({
    tag: "script",
    attrs: {
      ...script,
      suppressHydrationWarning: true,
      nonce
    },
    children
  }));
  {
    const activeMatches = router2.stores.matches.get();
    const assetScripts = getAssetScripts(activeMatches);
    return renderScripts(router2, getScripts(activeMatches), assetScripts);
  }
};
function renderScripts(router2, scripts, assetScripts) {
  const allScripts = [...scripts, ...assetScripts];
  if (router2.serverSsr) {
    const serverBufferedScript = router2.serverSsr.takeBufferedScripts();
    if (serverBufferedScript) allScripts.unshift(serverBufferedScript);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: allScripts.map((asset, i) => /* @__PURE__ */ reactExports.createElement(Asset, {
    ...asset,
    key: `tsr-scripts-${asset.tag}-${i}`
  })) });
}
var Subscribable = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Set();
    this.subscribe = this.subscribe.bind(this);
  }
  subscribe(listener) {
    this.listeners.add(listener);
    this.onSubscribe();
    return () => {
      this.listeners.delete(listener);
      this.onUnsubscribe();
    };
  }
  hasListeners() {
    return this.listeners.size > 0;
  }
  onSubscribe() {
  }
  onUnsubscribe() {
  }
};
var FocusManager = class extends Subscribable {
  #focused;
  #cleanup;
  #setup;
  constructor() {
    super();
    this.#setup = (onFocus) => {
      if (typeof window !== "undefined" && window.addEventListener) {
        const listener = () => onFocus();
        window.addEventListener("visibilitychange", listener, false);
        return () => {
          window.removeEventListener("visibilitychange", listener);
        };
      }
      return;
    };
  }
  onSubscribe() {
    if (!this.#cleanup) {
      this.setEventListener(this.#setup);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.#cleanup?.();
      this.#cleanup = void 0;
    }
  }
  setEventListener(setup) {
    this.#setup = setup;
    this.#cleanup?.();
    this.#cleanup = setup((focused) => {
      if (typeof focused === "boolean") {
        this.setFocused(focused);
      } else {
        this.onFocus();
      }
    });
  }
  setFocused(focused) {
    const changed = this.#focused !== focused;
    if (changed) {
      this.#focused = focused;
      this.onFocus();
    }
  }
  onFocus() {
    const isFocused = this.isFocused();
    this.listeners.forEach((listener) => {
      listener(isFocused);
    });
  }
  isFocused() {
    if (typeof this.#focused === "boolean") {
      return this.#focused;
    }
    return globalThis.document?.visibilityState !== "hidden";
  }
};
var focusManager = new FocusManager();
var defaultTimeoutProvider = {
  // We need the wrapper function syntax below instead of direct references to
  // global setTimeout etc.
  //
  // BAD: `setTimeout: setTimeout`
  // GOOD: `setTimeout: (cb, delay) => setTimeout(cb, delay)`
  //
  // If we use direct references here, then anything that wants to spy on or
  // replace the global setTimeout (like tests) won't work since we'll already
  // have a hard reference to the original implementation at the time when this
  // file was imported.
  setTimeout: (callback, delay) => setTimeout(callback, delay),
  clearTimeout: (timeoutId) => clearTimeout(timeoutId),
  setInterval: (callback, delay) => setInterval(callback, delay),
  clearInterval: (intervalId) => clearInterval(intervalId)
};
var TimeoutManager = class {
  // We cannot have TimeoutManager<T> as we must instantiate it with a concrete
  // type at app boot; and if we leave that type, then any new timer provider
  // would need to support the default provider's concrete timer ID, which is
  // infeasible across environments.
  //
  // We settle for type safety for the TimeoutProvider type, and accept that
  // this class is unsafe internally to allow for extension.
  #provider = defaultTimeoutProvider;
  #providerCalled = false;
  setTimeoutProvider(provider) {
    this.#provider = provider;
  }
  setTimeout(callback, delay) {
    return this.#provider.setTimeout(callback, delay);
  }
  clearTimeout(timeoutId) {
    this.#provider.clearTimeout(timeoutId);
  }
  setInterval(callback, delay) {
    return this.#provider.setInterval(callback, delay);
  }
  clearInterval(intervalId) {
    this.#provider.clearInterval(intervalId);
  }
};
var timeoutManager = new TimeoutManager();
function systemSetTimeoutZero(callback) {
  setTimeout(callback, 0);
}
var isServer = typeof window === "undefined" || "Deno" in globalThis;
function noop() {
}
function functionalUpdate(updater, input) {
  return typeof updater === "function" ? updater(input) : updater;
}
function isValidTimeout(value) {
  return typeof value === "number" && value >= 0 && value !== Infinity;
}
function timeUntilStale(updatedAt, staleTime) {
  return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function resolveStaleTime(staleTime, query) {
  return typeof staleTime === "function" ? staleTime(query) : staleTime;
}
function resolveQueryBoolean(option, query) {
  return typeof option === "function" ? option(query) : option;
}
function matchQuery(filters, query) {
  const {
    type = "all",
    exact,
    fetchStatus,
    predicate,
    queryKey,
    stale
  } = filters;
  if (queryKey) {
    if (exact) {
      if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
        return false;
      }
    } else if (!partialMatchKey(query.queryKey, queryKey)) {
      return false;
    }
  }
  if (type !== "all") {
    const isActive = query.isActive();
    if (type === "active" && !isActive) {
      return false;
    }
    if (type === "inactive" && isActive) {
      return false;
    }
  }
  if (typeof stale === "boolean" && query.isStale() !== stale) {
    return false;
  }
  if (fetchStatus && fetchStatus !== query.state.fetchStatus) {
    return false;
  }
  if (predicate && !predicate(query)) {
    return false;
  }
  return true;
}
function matchMutation(filters, mutation) {
  const { exact, status, predicate, mutationKey } = filters;
  if (mutationKey) {
    if (!mutation.options.mutationKey) {
      return false;
    }
    if (exact) {
      if (hashKey(mutation.options.mutationKey) !== hashKey(mutationKey)) {
        return false;
      }
    } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
      return false;
    }
  }
  if (status && mutation.state.status !== status) {
    return false;
  }
  if (predicate && !predicate(mutation)) {
    return false;
  }
  return true;
}
function hashQueryKeyByOptions(queryKey, options) {
  const hashFn = options?.queryKeyHashFn || hashKey;
  return hashFn(queryKey);
}
function hashKey(queryKey) {
  return JSON.stringify(
    queryKey,
    (_, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
      result[key] = val[key];
      return result;
    }, {}) : val
  );
}
function partialMatchKey(a, b) {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    return Object.keys(b).every((key) => partialMatchKey(a[key], b[key]));
  }
  return false;
}
var hasOwn = Object.prototype.hasOwnProperty;
function replaceEqualDeep(a, b, depth = 0) {
  if (a === b) {
    return a;
  }
  if (depth > 500) return b;
  const array = isPlainArray(a) && isPlainArray(b);
  if (!array && !(isPlainObject(a) && isPlainObject(b))) return b;
  const aItems = array ? a : Object.keys(a);
  const aSize = aItems.length;
  const bItems = array ? b : Object.keys(b);
  const bSize = bItems.length;
  const copy = array ? new Array(bSize) : {};
  let equalItems = 0;
  for (let i = 0; i < bSize; i++) {
    const key = array ? i : bItems[i];
    const aItem = a[key];
    const bItem = b[key];
    if (aItem === bItem) {
      copy[key] = aItem;
      if (array ? i < aSize : hasOwn.call(a, key)) equalItems++;
      continue;
    }
    if (aItem === null || bItem === null || typeof aItem !== "object" || typeof bItem !== "object") {
      copy[key] = bItem;
      continue;
    }
    const v = replaceEqualDeep(aItem, bItem, depth + 1);
    copy[key] = v;
    if (v === aItem) equalItems++;
  }
  return aSize === bSize && equalItems === aSize ? a : copy;
}
function isPlainArray(value) {
  return Array.isArray(value) && value.length === Object.keys(value).length;
}
function isPlainObject(o) {
  if (!hasObjectPrototype(o)) {
    return false;
  }
  const ctor = o.constructor;
  if (ctor === void 0) {
    return true;
  }
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  }
  if (Object.getPrototypeOf(o) !== Object.prototype) {
    return false;
  }
  return true;
}
function hasObjectPrototype(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
function sleep(timeout) {
  return new Promise((resolve) => {
    timeoutManager.setTimeout(resolve, timeout);
  });
}
function replaceData(prevData, data, options) {
  if (typeof options.structuralSharing === "function") {
    return options.structuralSharing(prevData, data);
  } else if (options.structuralSharing !== false) {
    return replaceEqualDeep(prevData, data);
  }
  return data;
}
function addToEnd(items, item, max = 0) {
  const newItems = [...items, item];
  return max && newItems.length > max ? newItems.slice(1) : newItems;
}
function addToStart(items, item, max = 0) {
  const newItems = [item, ...items];
  return max && newItems.length > max ? newItems.slice(0, -1) : newItems;
}
var skipToken = /* @__PURE__ */ Symbol();
function ensureQueryFn(options, fetchOptions) {
  if (!options.queryFn && fetchOptions?.initialPromise) {
    return () => fetchOptions.initialPromise;
  }
  if (!options.queryFn || options.queryFn === skipToken) {
    return () => Promise.reject(new Error(`Missing queryFn: '${options.queryHash}'`));
  }
  return options.queryFn;
}
function addConsumeAwareSignal(object, getSignal, onCancelled) {
  let consumed = false;
  let signal;
  Object.defineProperty(object, "signal", {
    enumerable: true,
    get: () => {
      signal ??= getSignal();
      if (consumed) {
        return signal;
      }
      consumed = true;
      if (signal.aborted) {
        onCancelled();
      } else {
        signal.addEventListener("abort", onCancelled, { once: true });
      }
      return signal;
    }
  });
  return object;
}
var environmentManager = /* @__PURE__ */ (() => {
  let isServerFn = () => isServer;
  return {
    /**
     * Returns whether the current runtime should be treated as a server environment.
     */
    isServer() {
      return isServerFn();
    },
    /**
     * Overrides the server check globally.
     */
    setIsServer(isServerValue) {
      isServerFn = isServerValue;
    }
  };
})();
function pendingThenable() {
  let resolve;
  let reject;
  const thenable = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  thenable.status = "pending";
  thenable.catch(() => {
  });
  function finalize(data) {
    Object.assign(thenable, data);
    delete thenable.resolve;
    delete thenable.reject;
  }
  thenable.resolve = (value) => {
    finalize({
      status: "fulfilled",
      value
    });
    resolve(value);
  };
  thenable.reject = (reason) => {
    finalize({
      status: "rejected",
      reason
    });
    reject(reason);
  };
  return thenable;
}
var defaultScheduler = systemSetTimeoutZero;
function createNotifyManager() {
  let queue = [];
  let transactions = 0;
  let notifyFn = (callback) => {
    callback();
  };
  let batchNotifyFn = (callback) => {
    callback();
  };
  let scheduleFn = defaultScheduler;
  const schedule = (callback) => {
    if (transactions) {
      queue.push(callback);
    } else {
      scheduleFn(() => {
        notifyFn(callback);
      });
    }
  };
  const flush = () => {
    const originalQueue = queue;
    queue = [];
    if (originalQueue.length) {
      scheduleFn(() => {
        batchNotifyFn(() => {
          originalQueue.forEach((callback) => {
            notifyFn(callback);
          });
        });
      });
    }
  };
  return {
    batch: (callback) => {
      let result;
      transactions++;
      try {
        result = callback();
      } finally {
        transactions--;
        if (!transactions) {
          flush();
        }
      }
      return result;
    },
    /**
     * All calls to the wrapped function will be batched.
     */
    batchCalls: (callback) => {
      return (...args) => {
        schedule(() => {
          callback(...args);
        });
      };
    },
    schedule,
    /**
     * Use this method to set a custom notify function.
     * This can be used to for example wrap notifications with `React.act` while running tests.
     */
    setNotifyFunction: (fn) => {
      notifyFn = fn;
    },
    /**
     * Use this method to set a custom function to batch notifications together into a single tick.
     * By default React Query will use the batch function provided by ReactDOM or React Native.
     */
    setBatchNotifyFunction: (fn) => {
      batchNotifyFn = fn;
    },
    setScheduler: (fn) => {
      scheduleFn = fn;
    }
  };
}
var notifyManager = createNotifyManager();
var OnlineManager = class extends Subscribable {
  #online = true;
  #cleanup;
  #setup;
  constructor() {
    super();
    this.#setup = (onOnline) => {
      if (typeof window !== "undefined" && window.addEventListener) {
        const onlineListener = () => onOnline(true);
        const offlineListener = () => onOnline(false);
        window.addEventListener("online", onlineListener, false);
        window.addEventListener("offline", offlineListener, false);
        return () => {
          window.removeEventListener("online", onlineListener);
          window.removeEventListener("offline", offlineListener);
        };
      }
      return;
    };
  }
  onSubscribe() {
    if (!this.#cleanup) {
      this.setEventListener(this.#setup);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.#cleanup?.();
      this.#cleanup = void 0;
    }
  }
  setEventListener(setup) {
    this.#setup = setup;
    this.#cleanup?.();
    this.#cleanup = setup(this.setOnline.bind(this));
  }
  setOnline(online) {
    const changed = this.#online !== online;
    if (changed) {
      this.#online = online;
      this.listeners.forEach((listener) => {
        listener(online);
      });
    }
  }
  isOnline() {
    return this.#online;
  }
};
var onlineManager = new OnlineManager();
function defaultRetryDelay(failureCount) {
  return Math.min(1e3 * 2 ** failureCount, 3e4);
}
function canFetch(networkMode) {
  return (networkMode ?? "online") === "online" ? onlineManager.isOnline() : true;
}
var CancelledError = class extends Error {
  constructor(options) {
    super("CancelledError");
    this.revert = options?.revert;
    this.silent = options?.silent;
  }
};
function createRetryer(config) {
  let isRetryCancelled = false;
  let failureCount = 0;
  let continueFn;
  const thenable = pendingThenable();
  const isResolved = () => thenable.status !== "pending";
  const cancel = (cancelOptions) => {
    if (!isResolved()) {
      const error = new CancelledError(cancelOptions);
      reject(error);
      config.onCancel?.(error);
    }
  };
  const cancelRetry = () => {
    isRetryCancelled = true;
  };
  const continueRetry = () => {
    isRetryCancelled = false;
  };
  const canContinue = () => focusManager.isFocused() && (config.networkMode === "always" || onlineManager.isOnline()) && config.canRun();
  const canStart = () => canFetch(config.networkMode) && config.canRun();
  const resolve = (value) => {
    if (!isResolved()) {
      continueFn?.();
      thenable.resolve(value);
    }
  };
  const reject = (value) => {
    if (!isResolved()) {
      continueFn?.();
      thenable.reject(value);
    }
  };
  const pause = () => {
    return new Promise((continueResolve) => {
      continueFn = (value) => {
        if (isResolved() || canContinue()) {
          continueResolve(value);
        }
      };
      config.onPause?.();
    }).then(() => {
      continueFn = void 0;
      if (!isResolved()) {
        config.onContinue?.();
      }
    });
  };
  const run = () => {
    if (isResolved()) {
      return;
    }
    let promiseOrValue;
    const initialPromise = failureCount === 0 ? config.initialPromise : void 0;
    try {
      promiseOrValue = initialPromise ?? config.fn();
    } catch (error) {
      promiseOrValue = Promise.reject(error);
    }
    Promise.resolve(promiseOrValue).then(resolve).catch((error) => {
      if (isResolved()) {
        return;
      }
      const retry = config.retry ?? (environmentManager.isServer() ? 0 : 3);
      const retryDelay = config.retryDelay ?? defaultRetryDelay;
      const delay = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
      const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
      if (isRetryCancelled || !shouldRetry) {
        reject(error);
        return;
      }
      failureCount++;
      config.onFail?.(failureCount, error);
      sleep(delay).then(() => {
        return canContinue() ? void 0 : pause();
      }).then(() => {
        if (isRetryCancelled) {
          reject(error);
        } else {
          run();
        }
      });
    });
  };
  return {
    promise: thenable,
    status: () => thenable.status,
    cancel,
    continue: () => {
      continueFn?.();
      return thenable;
    },
    cancelRetry,
    continueRetry,
    canStart,
    start: () => {
      if (canStart()) {
        run();
      } else {
        pause().then(run);
      }
      return thenable;
    }
  };
}
var Removable = class {
  #gcTimeout;
  destroy() {
    this.clearGcTimeout();
  }
  scheduleGc() {
    this.clearGcTimeout();
    if (isValidTimeout(this.gcTime)) {
      this.#gcTimeout = timeoutManager.setTimeout(() => {
        this.optionalRemove();
      }, this.gcTime);
    }
  }
  updateGcTime(newGcTime) {
    this.gcTime = Math.max(
      this.gcTime || 0,
      newGcTime ?? (environmentManager.isServer() ? Infinity : 5 * 60 * 1e3)
    );
  }
  clearGcTimeout() {
    if (this.#gcTimeout !== void 0) {
      timeoutManager.clearTimeout(this.#gcTimeout);
      this.#gcTimeout = void 0;
    }
  }
};
function infiniteQueryBehavior(pages) {
  return {
    onFetch: (context, query) => {
      const options = context.options;
      const direction = context.fetchOptions?.meta?.fetchMore?.direction;
      const oldPages = context.state.data?.pages || [];
      const oldPageParams = context.state.data?.pageParams || [];
      let result = { pages: [], pageParams: [] };
      let currentPage = 0;
      const fetchFn = async () => {
        let cancelled = false;
        const addSignalProperty = (object) => {
          addConsumeAwareSignal(
            object,
            () => context.signal,
            () => cancelled = true
          );
        };
        const queryFn = ensureQueryFn(context.options, context.fetchOptions);
        const fetchPage = async (data, param, previous) => {
          if (cancelled) {
            return Promise.reject(context.signal.reason);
          }
          if (param == null && data.pages.length) {
            return Promise.resolve(data);
          }
          const createQueryFnContext = () => {
            const queryFnContext2 = {
              client: context.client,
              queryKey: context.queryKey,
              pageParam: param,
              direction: previous ? "backward" : "forward",
              meta: context.options.meta
            };
            addSignalProperty(queryFnContext2);
            return queryFnContext2;
          };
          const queryFnContext = createQueryFnContext();
          const page = await queryFn(queryFnContext);
          const { maxPages } = context.options;
          const addTo = previous ? addToStart : addToEnd;
          return {
            pages: addTo(data.pages, page, maxPages),
            pageParams: addTo(data.pageParams, param, maxPages)
          };
        };
        if (direction && oldPages.length) {
          const previous = direction === "backward";
          const pageParamFn = previous ? getPreviousPageParam : getNextPageParam;
          const oldData = {
            pages: oldPages,
            pageParams: oldPageParams
          };
          const param = pageParamFn(options, oldData);
          result = await fetchPage(oldData, param, previous);
        } else {
          const remainingPages = pages ?? oldPages.length;
          do {
            const param = currentPage === 0 ? oldPageParams[0] ?? options.initialPageParam : getNextPageParam(options, result);
            if (currentPage > 0 && param == null) {
              break;
            }
            result = await fetchPage(result, param);
            currentPage++;
          } while (currentPage < remainingPages);
        }
        return result;
      };
      if (context.options.persister) {
        context.fetchFn = () => {
          return context.options.persister?.(
            fetchFn,
            {
              client: context.client,
              queryKey: context.queryKey,
              meta: context.options.meta,
              signal: context.signal
            },
            query
          );
        };
      } else {
        context.fetchFn = fetchFn;
      }
    }
  };
}
function getNextPageParam(options, { pages, pageParams }) {
  const lastIndex = pages.length - 1;
  return pages.length > 0 ? options.getNextPageParam(
    pages[lastIndex],
    pages,
    pageParams[lastIndex],
    pageParams
  ) : void 0;
}
function getPreviousPageParam(options, { pages, pageParams }) {
  return pages.length > 0 ? options.getPreviousPageParam?.(pages[0], pages, pageParams[0], pageParams) : void 0;
}
var Query = class extends Removable {
  #queryType;
  #initialState;
  #revertState;
  #cache;
  #client;
  #retryer;
  #defaultOptions;
  #abortSignalConsumed;
  constructor(config) {
    super();
    this.#abortSignalConsumed = false;
    this.#defaultOptions = config.defaultOptions;
    this.setOptions(config.options);
    this.observers = [];
    this.#client = config.client;
    this.#cache = this.#client.getQueryCache();
    this.queryKey = config.queryKey;
    this.queryHash = config.queryHash;
    this.#initialState = getDefaultState$1(this.options);
    this.state = config.state ?? this.#initialState;
    this.scheduleGc();
  }
  get meta() {
    return this.options.meta;
  }
  get queryType() {
    return this.#queryType;
  }
  get promise() {
    return this.#retryer?.promise;
  }
  setOptions(options) {
    this.options = { ...this.#defaultOptions, ...options };
    if (options?._type) {
      this.#queryType = options._type;
    }
    this.updateGcTime(this.options.gcTime);
    if (this.state && this.state.data === void 0) {
      const defaultState = getDefaultState$1(this.options);
      if (defaultState.data !== void 0) {
        this.setState(
          successState(defaultState.data, defaultState.dataUpdatedAt)
        );
        this.#initialState = defaultState;
      }
    }
  }
  optionalRemove() {
    if (!this.observers.length && this.state.fetchStatus === "idle") {
      this.#cache.remove(this);
    }
  }
  setData(newData, options) {
    const data = replaceData(this.state.data, newData, this.options);
    this.#dispatch({
      data,
      type: "success",
      dataUpdatedAt: options?.updatedAt,
      manual: options?.manual
    });
    return data;
  }
  setState(state) {
    this.#dispatch({ type: "setState", state });
  }
  cancel(options) {
    const promise = this.#retryer?.promise;
    this.#retryer?.cancel(options);
    return promise ? promise.then(noop).catch(noop) : Promise.resolve();
  }
  destroy() {
    super.destroy();
    this.cancel({ silent: true });
  }
  get resetState() {
    return this.#initialState;
  }
  reset() {
    this.destroy();
    this.setState(this.resetState);
  }
  isActive() {
    return this.observers.some(
      (observer) => resolveQueryBoolean(observer.options.enabled, this) !== false
    );
  }
  isDisabled() {
    if (this.getObserversCount() > 0) {
      return !this.isActive();
    }
    return this.options.queryFn === skipToken || !this.isFetched();
  }
  isFetched() {
    return this.state.dataUpdateCount + this.state.errorUpdateCount > 0;
  }
  isStatic() {
    if (this.getObserversCount() > 0) {
      return this.observers.some(
        (observer) => resolveStaleTime(observer.options.staleTime, this) === "static"
      );
    }
    return false;
  }
  isStale() {
    if (this.getObserversCount() > 0) {
      return this.observers.some(
        (observer) => observer.getCurrentResult().isStale
      );
    }
    return this.state.data === void 0 || this.state.isInvalidated;
  }
  isStaleByTime(staleTime = 0) {
    if (this.state.data === void 0) {
      return true;
    }
    if (staleTime === "static") {
      return false;
    }
    if (this.state.isInvalidated) {
      return true;
    }
    return !timeUntilStale(this.state.dataUpdatedAt, staleTime);
  }
  onFocus() {
    const observer = this.observers.find((x) => x.shouldFetchOnWindowFocus());
    observer?.refetch({ cancelRefetch: false });
    this.#retryer?.continue();
  }
  onOnline() {
    const observer = this.observers.find((x) => x.shouldFetchOnReconnect());
    observer?.refetch({ cancelRefetch: false });
    this.#retryer?.continue();
  }
  addObserver(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      this.clearGcTimeout();
      this.#cache.notify({ type: "observerAdded", query: this, observer });
    }
  }
  removeObserver(observer) {
    if (this.observers.includes(observer)) {
      this.observers = this.observers.filter((x) => x !== observer);
      if (!this.observers.length) {
        if (this.#retryer) {
          if (this.#abortSignalConsumed || this.#isInitialPausedFetch()) {
            this.#retryer.cancel({ revert: true });
          } else {
            this.#retryer.cancelRetry();
          }
        }
        this.scheduleGc();
      }
      this.#cache.notify({ type: "observerRemoved", query: this, observer });
    }
  }
  getObserversCount() {
    return this.observers.length;
  }
  #isInitialPausedFetch() {
    return this.state.fetchStatus === "paused" && this.state.status === "pending";
  }
  invalidate() {
    if (!this.state.isInvalidated) {
      this.#dispatch({ type: "invalidate" });
    }
  }
  async fetch(options, fetchOptions) {
    if (this.state.fetchStatus !== "idle" && // If the promise in the retryer is already rejected, we have to definitely
    // re-start the fetch; there is a chance that the query is still in a
    // pending state when that happens
    this.#retryer?.status() !== "rejected") {
      if (this.state.data !== void 0 && fetchOptions?.cancelRefetch) {
        this.cancel({ silent: true });
      } else if (this.#retryer) {
        this.#retryer.continueRetry();
        return this.#retryer.promise;
      }
    }
    if (options) {
      this.setOptions(options);
    }
    if (!this.options.queryFn) {
      const observer = this.observers.find((x) => x.options.queryFn);
      if (observer) {
        this.setOptions(observer.options);
      }
    }
    const abortController = new AbortController();
    const addSignalProperty = (object) => {
      Object.defineProperty(object, "signal", {
        enumerable: true,
        get: () => {
          this.#abortSignalConsumed = true;
          return abortController.signal;
        }
      });
    };
    const fetchFn = () => {
      const queryFn = ensureQueryFn(this.options, fetchOptions);
      const createQueryFnContext = () => {
        const queryFnContext2 = {
          client: this.#client,
          queryKey: this.queryKey,
          meta: this.meta
        };
        addSignalProperty(queryFnContext2);
        return queryFnContext2;
      };
      const queryFnContext = createQueryFnContext();
      this.#abortSignalConsumed = false;
      if (this.options.persister) {
        return this.options.persister(
          queryFn,
          queryFnContext,
          this
        );
      }
      return queryFn(queryFnContext);
    };
    const createFetchContext = () => {
      const context2 = {
        fetchOptions,
        options: this.options,
        queryKey: this.queryKey,
        client: this.#client,
        state: this.state,
        fetchFn
      };
      addSignalProperty(context2);
      return context2;
    };
    const context = createFetchContext();
    const behavior = this.#queryType === "infinite" ? infiniteQueryBehavior(
      this.options.pages
    ) : this.options.behavior;
    behavior?.onFetch(context, this);
    this.#revertState = this.state;
    if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== context.fetchOptions?.meta) {
      this.#dispatch({ type: "fetch", meta: context.fetchOptions?.meta });
    }
    this.#retryer = createRetryer({
      initialPromise: fetchOptions?.initialPromise,
      fn: context.fetchFn,
      onCancel: (error) => {
        if (error instanceof CancelledError && error.revert) {
          this.setState({
            ...this.#revertState,
            fetchStatus: "idle"
          });
        }
        abortController.abort();
      },
      onFail: (failureCount, error) => {
        this.#dispatch({ type: "failed", failureCount, error });
      },
      onPause: () => {
        this.#dispatch({ type: "pause" });
      },
      onContinue: () => {
        this.#dispatch({ type: "continue" });
      },
      retry: context.options.retry,
      retryDelay: context.options.retryDelay,
      networkMode: context.options.networkMode,
      canRun: () => true
    });
    try {
      const data = await this.#retryer.start();
      if (data === void 0) {
        if (false) ;
        throw new Error(`${this.queryHash} data is undefined`);
      }
      this.setData(data);
      this.#cache.config.onSuccess?.(data, this);
      this.#cache.config.onSettled?.(
        data,
        this.state.error,
        this
      );
      return data;
    } catch (error) {
      if (error instanceof CancelledError) {
        if (error.silent) {
          return this.#retryer.promise;
        } else if (error.revert) {
          if (this.state.data === void 0) {
            throw error;
          }
          return this.state.data;
        }
      }
      this.#dispatch({
        type: "error",
        error
      });
      this.#cache.config.onError?.(
        error,
        this
      );
      this.#cache.config.onSettled?.(
        this.state.data,
        error,
        this
      );
      throw error;
    } finally {
      this.scheduleGc();
    }
  }
  #dispatch(action) {
    const reducer = (state) => {
      switch (action.type) {
        case "failed":
          return {
            ...state,
            fetchFailureCount: action.failureCount,
            fetchFailureReason: action.error
          };
        case "pause":
          return {
            ...state,
            fetchStatus: "paused"
          };
        case "continue":
          return {
            ...state,
            fetchStatus: "fetching"
          };
        case "fetch":
          return {
            ...state,
            ...fetchState(state.data, this.options),
            fetchMeta: action.meta ?? null
          };
        case "success":
          const newState = {
            ...state,
            ...successState(action.data, action.dataUpdatedAt),
            dataUpdateCount: state.dataUpdateCount + 1,
            ...!action.manual && {
              fetchStatus: "idle",
              fetchFailureCount: 0,
              fetchFailureReason: null
            }
          };
          this.#revertState = action.manual ? newState : void 0;
          return newState;
        case "error":
          const error = action.error;
          return {
            ...state,
            error,
            errorUpdateCount: state.errorUpdateCount + 1,
            errorUpdatedAt: Date.now(),
            fetchFailureCount: state.fetchFailureCount + 1,
            fetchFailureReason: error,
            fetchStatus: "idle",
            status: "error",
            // flag existing data as invalidated if we get a background error
            // note that "no data" always means stale so we can set unconditionally here
            isInvalidated: true
          };
        case "invalidate":
          return {
            ...state,
            isInvalidated: true
          };
        case "setState":
          return {
            ...state,
            ...action.state
          };
      }
    };
    this.state = reducer(this.state);
    notifyManager.batch(() => {
      this.observers.forEach((observer) => {
        observer.onQueryUpdate();
      });
      this.#cache.notify({ query: this, type: "updated", action });
    });
  }
};
function fetchState(data, options) {
  return {
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchStatus: canFetch(options.networkMode) ? "fetching" : "paused",
    ...data === void 0 && {
      error: null,
      status: "pending"
    }
  };
}
function successState(data, dataUpdatedAt) {
  return {
    data,
    dataUpdatedAt: dataUpdatedAt ?? Date.now(),
    error: null,
    isInvalidated: false,
    status: "success"
  };
}
function getDefaultState$1(options) {
  const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
  const hasData = data !== void 0;
  const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
  return {
    data,
    dataUpdateCount: 0,
    dataUpdatedAt: hasData ? initialDataUpdatedAt ?? Date.now() : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: false,
    status: hasData ? "success" : "pending",
    fetchStatus: "idle"
  };
}
var Mutation = class extends Removable {
  #client;
  #observers;
  #mutationCache;
  #retryer;
  constructor(config) {
    super();
    this.#client = config.client;
    this.mutationId = config.mutationId;
    this.#mutationCache = config.mutationCache;
    this.#observers = [];
    this.state = config.state || getDefaultState();
    this.setOptions(config.options);
    this.scheduleGc();
  }
  setOptions(options) {
    this.options = options;
    this.updateGcTime(this.options.gcTime);
  }
  get meta() {
    return this.options.meta;
  }
  addObserver(observer) {
    if (!this.#observers.includes(observer)) {
      this.#observers.push(observer);
      this.clearGcTimeout();
      this.#mutationCache.notify({
        type: "observerAdded",
        mutation: this,
        observer
      });
    }
  }
  removeObserver(observer) {
    this.#observers = this.#observers.filter((x) => x !== observer);
    this.scheduleGc();
    this.#mutationCache.notify({
      type: "observerRemoved",
      mutation: this,
      observer
    });
  }
  optionalRemove() {
    if (!this.#observers.length) {
      if (this.state.status === "pending") {
        this.scheduleGc();
      } else {
        this.#mutationCache.remove(this);
      }
    }
  }
  continue() {
    return this.#retryer?.continue() ?? // continuing a mutation assumes that variables are set, mutation must have been dehydrated before
    this.execute(this.state.variables);
  }
  async execute(variables) {
    const onContinue = () => {
      this.#dispatch({ type: "continue" });
    };
    const mutationFnContext = {
      client: this.#client,
      meta: this.options.meta,
      mutationKey: this.options.mutationKey
    };
    this.#retryer = createRetryer({
      fn: () => {
        if (!this.options.mutationFn) {
          return Promise.reject(new Error("No mutationFn found"));
        }
        return this.options.mutationFn(variables, mutationFnContext);
      },
      onFail: (failureCount, error) => {
        this.#dispatch({ type: "failed", failureCount, error });
      },
      onPause: () => {
        this.#dispatch({ type: "pause" });
      },
      onContinue,
      retry: this.options.retry ?? 0,
      retryDelay: this.options.retryDelay,
      networkMode: this.options.networkMode,
      canRun: () => this.#mutationCache.canRun(this)
    });
    const restored = this.state.status === "pending";
    const isPaused = !this.#retryer.canStart();
    try {
      if (restored) {
        onContinue();
      } else {
        this.#dispatch({ type: "pending", variables, isPaused });
        if (this.#mutationCache.config.onMutate) {
          await this.#mutationCache.config.onMutate(
            variables,
            this,
            mutationFnContext
          );
        }
        const context = await this.options.onMutate?.(
          variables,
          mutationFnContext
        );
        if (context !== this.state.context) {
          this.#dispatch({
            type: "pending",
            context,
            variables,
            isPaused
          });
        }
      }
      const data = await this.#retryer.start();
      await this.#mutationCache.config.onSuccess?.(
        data,
        variables,
        this.state.context,
        this,
        mutationFnContext
      );
      await this.options.onSuccess?.(
        data,
        variables,
        this.state.context,
        mutationFnContext
      );
      await this.#mutationCache.config.onSettled?.(
        data,
        null,
        this.state.variables,
        this.state.context,
        this,
        mutationFnContext
      );
      await this.options.onSettled?.(
        data,
        null,
        variables,
        this.state.context,
        mutationFnContext
      );
      this.#dispatch({ type: "success", data });
      return data;
    } catch (error) {
      try {
        await this.#mutationCache.config.onError?.(
          error,
          variables,
          this.state.context,
          this,
          mutationFnContext
        );
      } catch (e) {
        void Promise.reject(e);
      }
      try {
        await this.options.onError?.(
          error,
          variables,
          this.state.context,
          mutationFnContext
        );
      } catch (e) {
        void Promise.reject(e);
      }
      try {
        await this.#mutationCache.config.onSettled?.(
          void 0,
          error,
          this.state.variables,
          this.state.context,
          this,
          mutationFnContext
        );
      } catch (e) {
        void Promise.reject(e);
      }
      try {
        await this.options.onSettled?.(
          void 0,
          error,
          variables,
          this.state.context,
          mutationFnContext
        );
      } catch (e) {
        void Promise.reject(e);
      }
      this.#dispatch({ type: "error", error });
      throw error;
    } finally {
      this.#mutationCache.runNext(this);
    }
  }
  #dispatch(action) {
    const reducer = (state) => {
      switch (action.type) {
        case "failed":
          return {
            ...state,
            failureCount: action.failureCount,
            failureReason: action.error
          };
        case "pause":
          return {
            ...state,
            isPaused: true
          };
        case "continue":
          return {
            ...state,
            isPaused: false
          };
        case "pending":
          return {
            ...state,
            context: action.context,
            data: void 0,
            failureCount: 0,
            failureReason: null,
            error: null,
            isPaused: action.isPaused,
            status: "pending",
            variables: action.variables,
            submittedAt: Date.now()
          };
        case "success":
          return {
            ...state,
            data: action.data,
            failureCount: 0,
            failureReason: null,
            error: null,
            status: "success",
            isPaused: false
          };
        case "error":
          return {
            ...state,
            data: void 0,
            error: action.error,
            failureCount: state.failureCount + 1,
            failureReason: action.error,
            isPaused: false,
            status: "error"
          };
      }
    };
    this.state = reducer(this.state);
    notifyManager.batch(() => {
      this.#observers.forEach((observer) => {
        observer.onMutationUpdate(action);
      });
      this.#mutationCache.notify({
        mutation: this,
        type: "updated",
        action
      });
    });
  }
};
function getDefaultState() {
  return {
    context: void 0,
    data: void 0,
    error: null,
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    status: "idle",
    variables: void 0,
    submittedAt: 0
  };
}
var MutationCache = class extends Subscribable {
  constructor(config = {}) {
    super();
    this.config = config;
    this.#mutations = /* @__PURE__ */ new Set();
    this.#scopes = /* @__PURE__ */ new Map();
    this.#mutationId = 0;
  }
  #mutations;
  #scopes;
  #mutationId;
  build(client, options, state) {
    const mutation = new Mutation({
      client,
      mutationCache: this,
      mutationId: ++this.#mutationId,
      options: client.defaultMutationOptions(options),
      state
    });
    this.add(mutation);
    return mutation;
  }
  add(mutation) {
    this.#mutations.add(mutation);
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const scopedMutations = this.#scopes.get(scope);
      if (scopedMutations) {
        scopedMutations.push(mutation);
      } else {
        this.#scopes.set(scope, [mutation]);
      }
    }
    this.notify({ type: "added", mutation });
  }
  remove(mutation) {
    if (this.#mutations.delete(mutation)) {
      const scope = scopeFor(mutation);
      if (typeof scope === "string") {
        const scopedMutations = this.#scopes.get(scope);
        if (scopedMutations) {
          if (scopedMutations.length > 1) {
            const index = scopedMutations.indexOf(mutation);
            if (index !== -1) {
              scopedMutations.splice(index, 1);
            }
          } else if (scopedMutations[0] === mutation) {
            this.#scopes.delete(scope);
          }
        }
      }
    }
    this.notify({ type: "removed", mutation });
  }
  canRun(mutation) {
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const mutationsWithSameScope = this.#scopes.get(scope);
      const firstPendingMutation = mutationsWithSameScope?.find(
        (m) => m.state.status === "pending"
      );
      return !firstPendingMutation || firstPendingMutation === mutation;
    } else {
      return true;
    }
  }
  runNext(mutation) {
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const foundMutation = this.#scopes.get(scope)?.find((m) => m !== mutation && m.state.isPaused);
      return foundMutation?.continue() ?? Promise.resolve();
    } else {
      return Promise.resolve();
    }
  }
  clear() {
    notifyManager.batch(() => {
      this.#mutations.forEach((mutation) => {
        this.notify({ type: "removed", mutation });
      });
      this.#mutations.clear();
      this.#scopes.clear();
    });
  }
  getAll() {
    return Array.from(this.#mutations);
  }
  find(filters) {
    const defaultedFilters = { exact: true, ...filters };
    return this.getAll().find(
      (mutation) => matchMutation(defaultedFilters, mutation)
    );
  }
  findAll(filters = {}) {
    return this.getAll().filter((mutation) => matchMutation(filters, mutation));
  }
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  resumePausedMutations() {
    const pausedMutations = this.getAll().filter((x) => x.state.isPaused);
    return notifyManager.batch(
      () => Promise.all(
        pausedMutations.map((mutation) => mutation.continue().catch(noop))
      )
    );
  }
};
function scopeFor(mutation) {
  return mutation.options.scope?.id;
}
var QueryCache = class extends Subscribable {
  constructor(config = {}) {
    super();
    this.config = config;
    this.#queries = /* @__PURE__ */ new Map();
  }
  #queries;
  build(client, options, state) {
    const queryKey = options.queryKey;
    const queryHash = options.queryHash ?? hashQueryKeyByOptions(queryKey, options);
    let query = this.get(queryHash);
    if (!query) {
      query = new Query({
        client,
        queryKey,
        queryHash,
        options: client.defaultQueryOptions(options),
        state,
        defaultOptions: client.getQueryDefaults(queryKey)
      });
      this.add(query);
    }
    return query;
  }
  add(query) {
    if (!this.#queries.has(query.queryHash)) {
      this.#queries.set(query.queryHash, query);
      this.notify({
        type: "added",
        query
      });
    }
  }
  remove(query) {
    const queryInMap = this.#queries.get(query.queryHash);
    if (queryInMap) {
      query.destroy();
      if (queryInMap === query) {
        this.#queries.delete(query.queryHash);
      }
      this.notify({ type: "removed", query });
    }
  }
  clear() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        this.remove(query);
      });
    });
  }
  get(queryHash) {
    return this.#queries.get(queryHash);
  }
  getAll() {
    return [...this.#queries.values()];
  }
  find(filters) {
    const defaultedFilters = { exact: true, ...filters };
    return this.getAll().find(
      (query) => matchQuery(defaultedFilters, query)
    );
  }
  findAll(filters = {}) {
    const queries = this.getAll();
    return Object.keys(filters).length > 0 ? queries.filter((query) => matchQuery(filters, query)) : queries;
  }
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  onFocus() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        query.onFocus();
      });
    });
  }
  onOnline() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        query.onOnline();
      });
    });
  }
};
var QueryClient = class {
  #queryCache;
  #mutationCache;
  #defaultOptions;
  #queryDefaults;
  #mutationDefaults;
  #mountCount;
  #unsubscribeFocus;
  #unsubscribeOnline;
  constructor(config = {}) {
    this.#queryCache = config.queryCache || new QueryCache();
    this.#mutationCache = config.mutationCache || new MutationCache();
    this.#defaultOptions = config.defaultOptions || {};
    this.#queryDefaults = /* @__PURE__ */ new Map();
    this.#mutationDefaults = /* @__PURE__ */ new Map();
    this.#mountCount = 0;
  }
  mount() {
    this.#mountCount++;
    if (this.#mountCount !== 1) return;
    this.#unsubscribeFocus = focusManager.subscribe(async (focused) => {
      if (focused) {
        await this.resumePausedMutations();
        this.#queryCache.onFocus();
      }
    });
    this.#unsubscribeOnline = onlineManager.subscribe(async (online) => {
      if (online) {
        await this.resumePausedMutations();
        this.#queryCache.onOnline();
      }
    });
  }
  unmount() {
    this.#mountCount--;
    if (this.#mountCount !== 0) return;
    this.#unsubscribeFocus?.();
    this.#unsubscribeFocus = void 0;
    this.#unsubscribeOnline?.();
    this.#unsubscribeOnline = void 0;
  }
  isFetching(filters) {
    return this.#queryCache.findAll({ ...filters, fetchStatus: "fetching" }).length;
  }
  isMutating(filters) {
    return this.#mutationCache.findAll({ ...filters, status: "pending" }).length;
  }
  /**
   * Imperative (non-reactive) way to retrieve data for a QueryKey.
   * Should only be used in callbacks or functions where reading the latest data is necessary, e.g. for optimistic updates.
   *
   * Hint: Do not use this function inside a component, because it won't receive updates.
   * Use `useQuery` to create a `QueryObserver` that subscribes to changes.
   */
  getQueryData(queryKey) {
    const options = this.defaultQueryOptions({ queryKey });
    return this.#queryCache.get(options.queryHash)?.state.data;
  }
  ensureQueryData(options) {
    const defaultedOptions = this.defaultQueryOptions(options);
    const query = this.#queryCache.build(this, defaultedOptions);
    const cachedData = query.state.data;
    if (cachedData === void 0) {
      return this.fetchQuery(options);
    }
    if (options.revalidateIfStale && query.isStaleByTime(resolveStaleTime(defaultedOptions.staleTime, query))) {
      void this.prefetchQuery(defaultedOptions);
    }
    return Promise.resolve(cachedData);
  }
  getQueriesData(filters) {
    return this.#queryCache.findAll(filters).map(({ queryKey, state }) => {
      const data = state.data;
      return [queryKey, data];
    });
  }
  setQueryData(queryKey, updater, options) {
    const defaultedOptions = this.defaultQueryOptions({ queryKey });
    const query = this.#queryCache.get(
      defaultedOptions.queryHash
    );
    const prevData = query?.state.data;
    const data = functionalUpdate(updater, prevData);
    if (data === void 0) {
      return void 0;
    }
    return this.#queryCache.build(this, defaultedOptions).setData(data, { ...options, manual: true });
  }
  setQueriesData(filters, updater, options) {
    return notifyManager.batch(
      () => this.#queryCache.findAll(filters).map(({ queryKey }) => [
        queryKey,
        this.setQueryData(queryKey, updater, options)
      ])
    );
  }
  getQueryState(queryKey) {
    const options = this.defaultQueryOptions({ queryKey });
    return this.#queryCache.get(
      options.queryHash
    )?.state;
  }
  removeQueries(filters) {
    const queryCache = this.#queryCache;
    notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        queryCache.remove(query);
      });
    });
  }
  resetQueries(filters, options) {
    const queryCache = this.#queryCache;
    return notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        query.reset();
      });
      return this.refetchQueries(
        {
          type: "active",
          ...filters
        },
        options
      );
    });
  }
  cancelQueries(filters, cancelOptions = {}) {
    const defaultedCancelOptions = { revert: true, ...cancelOptions };
    const promises = notifyManager.batch(
      () => this.#queryCache.findAll(filters).map((query) => query.cancel(defaultedCancelOptions))
    );
    return Promise.all(promises).then(noop).catch(noop);
  }
  invalidateQueries(filters, options = {}) {
    return notifyManager.batch(() => {
      this.#queryCache.findAll(filters).forEach((query) => {
        query.invalidate();
      });
      if (filters?.refetchType === "none") {
        return Promise.resolve();
      }
      return this.refetchQueries(
        {
          ...filters,
          type: filters?.refetchType ?? filters?.type ?? "active"
        },
        options
      );
    });
  }
  refetchQueries(filters, options = {}) {
    const fetchOptions = {
      ...options,
      cancelRefetch: options.cancelRefetch ?? true
    };
    const promises = notifyManager.batch(
      () => this.#queryCache.findAll(filters).filter((query) => !query.isDisabled() && !query.isStatic()).map((query) => {
        let promise = query.fetch(void 0, fetchOptions);
        if (!fetchOptions.throwOnError) {
          promise = promise.catch(noop);
        }
        return query.state.fetchStatus === "paused" ? Promise.resolve() : promise;
      })
    );
    return Promise.all(promises).then(noop);
  }
  fetchQuery(options) {
    const defaultedOptions = this.defaultQueryOptions(options);
    if (defaultedOptions.retry === void 0) {
      defaultedOptions.retry = false;
    }
    const query = this.#queryCache.build(this, defaultedOptions);
    return query.isStaleByTime(
      resolveStaleTime(defaultedOptions.staleTime, query)
    ) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
  }
  prefetchQuery(options) {
    return this.fetchQuery(options).then(noop).catch(noop);
  }
  fetchInfiniteQuery(options) {
    options._type = "infinite";
    return this.fetchQuery(options);
  }
  prefetchInfiniteQuery(options) {
    return this.fetchInfiniteQuery(options).then(noop).catch(noop);
  }
  ensureInfiniteQueryData(options) {
    options._type = "infinite";
    return this.ensureQueryData(options);
  }
  resumePausedMutations() {
    if (onlineManager.isOnline()) {
      return this.#mutationCache.resumePausedMutations();
    }
    return Promise.resolve();
  }
  getQueryCache() {
    return this.#queryCache;
  }
  getMutationCache() {
    return this.#mutationCache;
  }
  getDefaultOptions() {
    return this.#defaultOptions;
  }
  setDefaultOptions(options) {
    this.#defaultOptions = options;
  }
  setQueryDefaults(queryKey, options) {
    this.#queryDefaults.set(hashKey(queryKey), {
      queryKey,
      defaultOptions: options
    });
  }
  getQueryDefaults(queryKey) {
    const defaults = [...this.#queryDefaults.values()];
    const result = {};
    defaults.forEach((queryDefault) => {
      if (partialMatchKey(queryKey, queryDefault.queryKey)) {
        Object.assign(result, queryDefault.defaultOptions);
      }
    });
    return result;
  }
  setMutationDefaults(mutationKey, options) {
    this.#mutationDefaults.set(hashKey(mutationKey), {
      mutationKey,
      defaultOptions: options
    });
  }
  getMutationDefaults(mutationKey) {
    const defaults = [...this.#mutationDefaults.values()];
    const result = {};
    defaults.forEach((queryDefault) => {
      if (partialMatchKey(mutationKey, queryDefault.mutationKey)) {
        Object.assign(result, queryDefault.defaultOptions);
      }
    });
    return result;
  }
  defaultQueryOptions(options) {
    if (options._defaulted) {
      return options;
    }
    const defaultedOptions = {
      ...this.#defaultOptions.queries,
      ...this.getQueryDefaults(options.queryKey),
      ...options,
      _defaulted: true
    };
    if (!defaultedOptions.queryHash) {
      defaultedOptions.queryHash = hashQueryKeyByOptions(
        defaultedOptions.queryKey,
        defaultedOptions
      );
    }
    if (defaultedOptions.refetchOnReconnect === void 0) {
      defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
    }
    if (defaultedOptions.throwOnError === void 0) {
      defaultedOptions.throwOnError = !!defaultedOptions.suspense;
    }
    if (!defaultedOptions.networkMode && defaultedOptions.persister) {
      defaultedOptions.networkMode = "offlineFirst";
    }
    if (defaultedOptions.queryFn === skipToken) {
      defaultedOptions.enabled = false;
    }
    return defaultedOptions;
  }
  defaultMutationOptions(options) {
    if (options?._defaulted) {
      return options;
    }
    return {
      ...this.#defaultOptions.mutations,
      ...options?.mutationKey && this.getMutationDefaults(options.mutationKey),
      ...options,
      _defaulted: true
    };
  }
  clear() {
    this.#queryCache.clear();
    this.#mutationCache.clear();
  }
};
var QueryClientContext = reactExports.createContext(
  void 0
);
var QueryClientProvider = ({
  client,
  children
}) => {
  reactExports.useEffect(() => {
    client.mount();
    return () => {
      client.unmount();
    };
  }, [client]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientContext.Provider, { value: client, children });
};
const appCss = "/assets/styles-CNMFJWIB.css";
function reportHiggsfieldError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__higgsfieldEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const og_title = "Albacete MedDev | Advanced Wound Care & Practice Support";
const og_description = "Albacete MedDev supplies wound care products and supports specialty practices with revenue cycle management, consulting, documentation, and 3D wound imaging software.";
const og_image_url = "/og/albacete-og.jpg";
const favicon_url = "/favicon-32.png";
const appMetaJson = {
  og_title,
  og_description,
  og_image_url,
  favicon_url
};
const RouterLink = Link;
function AppLink({ href, children, ...rest }) {
  const internal = href.startsWith("/") && !href.startsWith("//");
  if (!internal) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href, ...rest, children });
  }
  const [path, hash] = href.split("#");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RouterLink, { to: path || "/", hash: hash || void 0, ...rest, children });
}
function Logo({ tone = "navy" }) {
  if (tone === "white") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "logo-img", src: "/brand/logo-white.png", alt: "Albacete MedDev", width: 720, height: 247 });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "logo-mask", role: "img", "aria-label": "Albacete MedDev" });
}
function Chevron({ className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className, "aria-hidden": "true", focusable: "false", viewBox: "0 0 12 12", width: "12", height: "12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M2.5 4.25 6 7.75l3.5-3.5", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
function ArrowIcon({ dir = "right" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { "aria-hidden": "true", focusable: "false", viewBox: "0 0 20 20", width: "20", height: "20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "path",
    {
      d: dir === "right" ? "M4 10h11M11 5.5 15.5 10 11 14.5" : "M16 10H5M9 5.5 4.5 10 9 14.5",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.7",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }
  ) });
}
const contact = {
  phone: "551-497-3428",
  tel: "tel:5514973428",
  email: "gabe@albacetemeddev.com",
  mailto: "mailto:gabe@albacetemeddev.com"
};
const utilityLinks = [
  { label: "Provider portal", href: "/portal" },
  { label: "Ovena Health", href: "/amazon-store" },
  { label: "Contact", href: "/contact" }
];
const productsMenu = {
  label: "Products",
  mobileLabel: "Products & solutions",
  href: "/products",
  categories: [
    { label: "Placental membranes", href: "/products#sheet-skin-substitutes", desc: "Compare composition and format." },
    { label: "Matrices & wound coverings", href: "/products#non-sheet-skin-substitutes", desc: "Explore the material behind the product." },
    { label: "Wound care devices", href: "/products#conservative-wound-care", desc: "Understand the technology and workflow." },
    { label: "Autologous wound care", href: "/products#blood-based-skin-substitutes", desc: "Explore patient-derived approaches." }
  ],
  across: {
    label: "Across the practice",
    href: "/products#practice-products",
    desc: "Support from the clinic to home.",
    children: [
      { label: "Surgical allografts", href: "/products/adhesion-barrier" },
      { label: "Peptide catalog", href: "/products/peptides" },
      { label: "Exosomes & birth tissue", href: "/products/exosomes" },
      { label: "Medical supplies", href: "/products/wholesaler" },
      { label: "Ovena Health", href: "/amazon-store" }
    ]
  },
  all: { label: "All products", href: "/products" }
};
const clinicalMenu = {
  label: "Clinical resources",
  href: "/evidence",
  links: [
    { label: "Evidence library", href: "/evidence" },
    { label: "Scientific portfolio", href: "/scientific-portfolio" },
    { label: "Peptide therapies", href: "/evidence#peptides" }
  ]
};
const servicesMenu = {
  label: "Practice services",
  href: "/services",
  links: [
    { label: "Practice services", href: "/services" },
    { label: "Revenue cycle management", href: "/services/revenue-cycle" },
    { label: "Practice consulting", href: "/services/consulting" }
  ]
};
const primaryLinks = [
  { label: "Software", href: "/software" },
  { label: "About", href: "/about" }
];
const mobileExtraLinks = [
  { label: "Software", href: "/software" },
  { label: "Provider portal", href: "/portal" },
  { label: "Ovena Health", href: "/amazon-store" },
  { label: "About Albacete", href: "/about" }
];
const navCta = { label: "Talk with our team", href: "/contact" };
const footer = {
  statement: "Medical products, revenue cycle management, consulting, and clinical software for specialty practices. Product and operational support informed by wound care experience.",
  columns: [
    {
      // NEW footer Products list (owner's order, Oct 2026).
      title: "Products",
      links: [
        { label: "Microlyte SAM", href: "/products/microlyte" },
        { label: "Myriad Matrix", href: "/products/myriad-matrix" },
        { label: "Tri-Membrane Wrap", href: "/products/tri-membrane-wrap" },
        { label: "AmchoPlast", href: "/products/amchoplast" },
        { label: "XCelliStem", href: "/products/xcellistem" },
        { label: "ActiGraft", href: "/products/actigraft" },
        { label: "Peptide Therapies", href: "/products/peptides" },
        { label: "All Products & Solutions", href: "/products" }
      ]
    },
    {
      title: "Services & Software",
      links: [
        { label: "Revenue Cycle Management", href: "/services/revenue-cycle" },
        { label: "Consulting", href: "/services/consulting" },
        { label: "StrataMetric: AI Wound Scan", href: "/software" },
        { label: "Ovena Health — Store & Amazon", href: "/amazon-store" },
        { label: "Portal & Support", href: "/portal" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Why Partner", href: "/why-partner" },
        { label: "Contact", href: "/contact" },
        { label: contact.email, href: contact.mailto },
        { label: contact.phone, href: contact.tel }
      ]
    }
  ],
  legal: ["© 2026 Albacete MedDev. All rights reserved.", "Medical products and practice services."]
};
function isCurrent(pathname, href) {
  const path = href.split("#")[0];
  if (!path.startsWith("/")) return false;
  if (path === "/") return pathname === "/";
  const clean = pathname.replace(/\/$/, "");
  return clean === path || clean.startsWith(path + "/");
}
function usePathname() {
  return useRouterState({ select: (s) => s.location.pathname });
}
function UtilityBar() {
  const pathname = usePathname();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "utility", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "utility-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "utility-list", children: [
    utilityLinks.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: l.href, "aria-current": isCurrent(pathname, l.href) ? "page" : void 0, children: l.label }) }, l.href)),
    /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: contact.tel, children: contact.phone }) })
  ] }) }) });
}
function DdList({ links, onNavigate }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "dd-list", children: links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: l.href, onClick: onNavigate, children: l.label }) }, l.href + l.label)) });
}
function Dropdown({ id, label, href, open, current, mega, setOpen, children }) {
  const leaveTimer = reactExports.useRef(void 0);
  const hoverOpened = reactExports.useRef(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "li",
    {
      className: `has-dd${open ? " is-open" : ""}`,
      onMouseEnter: () => {
        window.clearTimeout(leaveTimer.current);
        hoverOpened.current = true;
        setOpen(id);
      },
      onMouseLeave: () => {
        hoverOpened.current = false;
        leaveTimer.current = window.setTimeout(() => setOpen((current2) => current2 === id ? null : current2), 120);
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href, className: "primary-link", "aria-current": current ? "page" : void 0, children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "dd-btn",
            "aria-expanded": open,
            "aria-controls": `dd-${id}`,
            "aria-label": `${label} menu`,
            "data-dd-btn": id,
            onClick: () => {
              if (open && !hoverOpened.current) {
                setOpen(null);
              } else {
                hoverOpened.current = false;
                setOpen(id);
              }
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Chevron, {})
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `dd${mega ? " dd--mega" : ""}`, id: `dd-${id}`, hidden: !open, children })
      ]
    }
  );
}
function MGroup({
  id,
  label,
  href,
  open,
  toggle,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `m-group${open ? " is-open" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "m-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href, children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "m-btn", "aria-expanded": open, "aria-controls": `m-${id}`, "aria-label": `${label} menu`, onClick: toggle, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Chevron, {}) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "m-panel", id: `m-${id}`, hidden: !open, children })
  ] });
}
function SiteHeader() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = reactExports.useState(null);
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  const [mGroups, setMGroups] = reactExports.useState({});
  const navRef = reactExports.useRef(null);
  const toggleRef = reactExports.useRef(null);
  const closeAll = reactExports.useCallback(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, []);
  reactExports.useEffect(() => {
    closeAll();
  }, [pathname, closeAll]);
  reactExports.useEffect(() => {
    if (!openMenu && !mobileOpen) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (openMenu) {
        const btn = document.querySelector(`[data-dd-btn="${openMenu}"]`);
        setOpenMenu(null);
        btn?.focus();
      }
      if (mobileOpen) {
        setMobileOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onDown = (e) => {
      if (openMenu && navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [openMenu, mobileOpen]);
  reactExports.useEffect(() => {
    document.documentElement.classList.toggle("menu-open", mobileOpen);
    return () => document.documentElement.classList.remove("menu-open");
  }, [mobileOpen]);
  reactExports.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1101px)");
    const onChange = () => mq.matches && setMobileOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const close = () => setOpenMenu(null);
  const productsCurrent = isCurrent(pathname, "/products") || pathname === "/amazon-store";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "navbar", ref: navRef, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-inner", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: "/", className: "brand", "aria-label": "Albacete MedDev home", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "primary", "aria-label": "Primary", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "primary-list", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dropdown, { id: "products", label: productsMenu.label, href: productsMenu.href, open: openMenu === "products", current: productsCurrent, mega: true, setOpen: setOpenMenu, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dd-cols", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "dd-list dd-list--rich", children: productsMenu.categories.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href: l.href, onClick: close, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "dd-name", children: l.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "dd-desc", children: l.desc })
            ] }) }, l.href)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dd-across", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href: productsMenu.across.href, onClick: close, className: "dd-across-head", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "dd-name", children: productsMenu.across.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "dd-desc", children: productsMenu.across.desc })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DdList, { links: productsMenu.across.children, onNavigate: close })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dd-foot", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href: productsMenu.all.href, onClick: close, className: "link-arrow", children: [
            productsMenu.all.label,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dropdown, { id: "clinical", label: clinicalMenu.label, href: clinicalMenu.href, open: openMenu === "clinical", current: isCurrent(pathname, "/evidence") || isCurrent(pathname, "/scientific-portfolio"), setOpen: setOpenMenu, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DdList, { links: clinicalMenu.links, onNavigate: close }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dropdown, { id: "services", label: servicesMenu.label, href: servicesMenu.href, open: openMenu === "services", current: isCurrent(pathname, "/services"), setOpen: setOpenMenu, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DdList, { links: servicesMenu.links, onNavigate: close }) }),
        primaryLinks.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: l.href, className: "primary-link", "aria-current": isCurrent(pathname, l.href) ? "page" : void 0, children: l.label }) }, l.href))
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href: navCta.href, className: "btn btn--primary btn--nav", children: [
        navCta.label,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          ref: toggleRef,
          type: "button",
          className: `menu-toggle${mobileOpen ? " is-open" : ""}`,
          "aria-controls": "mobile-menu",
          "aria-expanded": mobileOpen,
          "aria-label": mobileOpen ? "Close menu" : "Open menu",
          onClick: () => setMobileOpen((v) => !v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "mobile-menu", className: `mobile-menu${mobileOpen ? " is-open" : ""}`, inert: !mobileOpen, "aria-hidden": !mobileOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "m-nav", "aria-label": "Mobile", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MGroup, { id: "products", label: productsMenu.mobileLabel, href: productsMenu.href, open: !!mGroups.products, toggle: () => setMGroups((g) => ({ ...g, products: !g.products })), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "m-sub", children: [
        productsMenu.categories.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: l.href, children: l.label }) }, l.href)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: productsMenu.across.href, children: productsMenu.across.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "m-sub m-sub--nested", children: productsMenu.across.children.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: l.href, children: l.label }) }, l.href)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: productsMenu.all.href, children: productsMenu.all.label }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MGroup, { id: "clinical", label: clinicalMenu.label, href: clinicalMenu.href, open: !!mGroups.clinical, toggle: () => setMGroups((g) => ({ ...g, clinical: !g.clinical })), children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "m-sub", children: clinicalMenu.links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: l.href, children: l.label }) }, l.href)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MGroup, { id: "services", label: servicesMenu.label, href: servicesMenu.href, open: !!mGroups.services, toggle: () => setMGroups((g) => ({ ...g, services: !g.services })), children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "m-sub", children: servicesMenu.links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: l.href, children: l.label }) }, l.href)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "m-links", children: mobileExtraLinks.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: l.href, "aria-current": isCurrent(pathname, l.href) ? "page" : void 0, children: l.label }) }, l.href)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href: navCta.href, className: "btn btn--primary m-cta", children: [
        navCta.label,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "m-contact", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: contact.mailto, children: contact.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: contact.tel, children: contact.phone })
      ] })
    ] }) })
  ] });
}
function SiteFooter() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "site-footer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "footer-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "footer-brand", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: "/", "aria-label": "Albacete MedDev home", className: "footer-logo", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { tone: "white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: footer.statement })
      ] }),
      footer.columns.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "footer-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "footer-head", children: col.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: col.links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: l.href, children: l.label }) }, l.href)) })
      ] }, col.title))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "footer-legal", children: footer.legal.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t }, t)) })
  ] }) });
}
const SCHEDULE = { label: "Schedule a consultation", href: "/contact" };
const WHY_PARTNER = { label: "Why partner with us", href: "/why-partner" };
const PORTFOLIO = { label: "Explore the portfolio", href: "/products" };
const TOPICS = [
  {
    id: "claims-denials",
    title: "Claims & denials",
    track: "Revenue cycle",
    href: "/services/revenue-cycle",
    caption: "Claims activity, denial reasons, and follow-up workflows.",
    description: "Review claims activity, denial patterns, eligibility, and authorization workflows to identify questions for follow-up and organize the documentation needed for a focused revenue cycle assessment.",
    reviewAreas: ["Eligibility and prior authorization", "Denial reasons and supporting records", "Appeal and follow-up workflows"],
    possibleDeliverable: "Claims and denial review summary"
  },
  {
    id: "coding-documentation",
    title: "Coding & documentation",
    track: "Revenue cycle",
    href: "/services/revenue-cycle",
    caption: "Encounter coding, product requirements, and clinical records.",
    description: "Examine how documented services translate into encounter coding, with attention to product-specific requirements, modifiers, units, and the information recorded in the clinical note.",
    reviewAreas: ["Encounter coding and documented services", "Product-specific modifiers and units", "Documentation gaps and template requirements"],
    possibleDeliverable: "Coding and documentation gap list"
  },
  {
    id: "product-evaluation",
    title: "Product evaluation",
    track: "Consulting",
    href: "/services/consulting",
    caption: "Clinical evidence, product utilization, and implementation requirements.",
    description: "Review the current product portfolio against patient needs, clinical focus, available evidence, and payer requirements, then organize questions for evaluation with practice leadership.",
    reviewAreas: ["Current formulary and product utilization", "Available clinical evidence and product information", "Coverage and implementation requirements"],
    possibleDeliverable: "Product evaluation brief"
  },
  {
    id: "practice-operations",
    title: "Practice operations",
    track: "Consulting",
    href: "/services/consulting",
    caption: "Patient flow, staffing, scheduling, and team responsibilities.",
    description: "Look closely at patient flow, scheduling, staff responsibilities, and benefit-verification processes to understand how work moves through the practice and where further review may help.",
    reviewAreas: ["Patient flow and scheduling", "Staff responsibilities and handoffs", "Benefit-verification workflow"],
    possibleDeliverable: "Workflow map and responsibility plan"
  },
  {
    id: "service-development",
    title: "Service development",
    track: "Consulting",
    href: "/services/consulting",
    caption: "Clinical capabilities, staffing, and the requirements for a new service.",
    description: "Evaluate potential services in relation to patient needs, clinical capabilities, staffing, and applicable requirements, with a clear view of the implementation questions to resolve.",
    reviewAreas: ["Patient needs and clinical capabilities", "Staffing and workflow requirements", "Training, documentation, and implementation steps"],
    possibleDeliverable: "Service implementation outline"
  },
  {
    id: "referral-strategy",
    title: "Referral strategy",
    track: "Consulting",
    href: "/services/consulting",
    caption: "Local referral activity, service demand, and professional relationships.",
    description: "Assess local referral activity and service demand to understand existing relationships and identify priorities for a referral strategy suited to the practice’s capabilities and focus.",
    reviewAreas: ["Local referral patterns", "Service demand and practice capabilities", "Professional relationship development"],
    possibleDeliverable: "Referral priorities and outreach plan"
  }
];
Object.fromEntries(TOPICS.map((t) => [t.id, t]));
const selectedTopics = (ids) => TOPICS.filter((t) => ids.includes(t.id));
function briefText(ids) {
  const picked = selectedTopics(ids);
  if (!picked.length) return "";
  const areas = picked.map((topic, index) => `${index + 1}. ${topic.title}
Service: ${topic.track}
` + topic.reviewAreas.map((area) => `- ${area}`).join("\n")).join("\n\n");
  return `ALBACETE MEDDEV — CONSULTATION BRIEF

Areas I would like to discuss:

${areas}

Scope and next steps to be discussed with Albacete MedDev.
551-497-3428 | gabe@albacetemeddev.com`;
}
function consultationHref(ids) {
  const picked = selectedTopics(ids);
  if (!picked.length) return "/contact";
  return "/contact?" + new URLSearchParams({ topics: picked.map((t) => t.id).join(",") }) + "#message";
}
function topicsFromQuery(query) {
  const raw = new URLSearchParams(query).get("topics") || "";
  return selectedTopics(raw.split(",")).map((t) => t.id);
}
const servicesHub = {
  meta: {
    title: "Practice Services: Revenue Cycle & Consulting | Albacete MedDev",
    description: "Revenue cycle management and consulting for specialty practices, including coding, documentation, operational workflows, and program development."
  },
  hero: {
    eyebrow: "Albacete MedDev / Practice services",
    title: ["Expertise for", "specialty practices."],
    lead: "Revenue cycle management and practice consulting, informed by experience in wound care.",
    cta: SCHEDULE,
    link: { label: "How an engagement works", href: "#engagement-process" },
    image: "practice-supply",
    alt: "Practice staff reviewing supplies together"
  },
  services: [
    {
      id: "revenue-cycle",
      eyebrow: "Albacete MedDev / Revenue cycle",
      title: "Revenue cycle management",
      description: "A structured review of the relationship between care delivered, clinical documentation, coding, and claims.",
      context: "For practices assessing billing workflows, documentation quality, or recurring denials.",
      cta: SCHEDULE,
      secondary: { label: "Explore revenue cycle services", href: "/services/revenue-cycle" },
      image: "services-billing",
      alt: "Practice staff working through billing records at a desktop computer",
      topics: ["claims-denials", "coding-documentation"]
    },
    {
      id: "practice-consulting",
      eyebrow: "Albacete MedDev / Consulting",
      title: "Practice consulting",
      description: "Advisory support for the decisions that shape a specialty practice, from product selection and operations to service development and referral strategy.",
      context: "For practice leaders reviewing current operations or preparing for their next stage of development.",
      cta: SCHEDULE,
      secondary: { label: "Explore consulting services", href: "/services/consulting" },
      image: "services-consulting",
      alt: "Consultant and clinician walking and talking in a practice corridor",
      topics: ["product-evaluation", "practice-operations", "service-development", "referral-strategy"]
    }
  ],
  scope: {
    heading: "Engagement scope",
    review: "What we review",
    deliverable: "Work products may include",
    note: "Scope and deliverables are agreed with your practice.",
    saveLabel: "Save topic for consultation",
    savedLabel: "Topic saved · remove"
  },
  brief: {
    review: "Review topics",
    placeholder: "Add an area you’d like to discuss.",
    title: "Your consultation brief",
    intro: "Review the topics you have selected, then save a copy or continue to arrange a consultation.",
    empty: "No areas selected. Choose a service area to start your brief.",
    copy: "Copy brief",
    download: "Download .txt",
    clear: "Clear selections",
    cont: "Continue to consultation",
    copied: "Brief copied.",
    copyFallback: "Select and copy the brief below, or download a text file.",
    downloaded: "Text file download started.",
    cleared: "Consultation brief cleared.",
    file: "albacete-consultation-brief.txt"
  },
  process: {
    eyebrow: "Working with Albacete",
    title: "A considered approach to your practice’s priorities.",
    cta: SCHEDULE,
    image: "services-review",
    alt: "Two people reviewing documents together at a table",
    steps: [
      { num: "01", title: "Initial discussion", text: "Review your clinical focus, current operations, and priorities." },
      { num: "02", title: "Scope agreement", text: "Define the work, responsible team members, and deliverables." },
      { num: "03", title: "Engagement & review", text: "Coordinate the agreed activities and review findings with practice leadership." }
    ]
  },
  direct: { title: "Start with a conversation." }
};
const revenueCycle = {
  meta: {
    title: "Revenue Cycle Management for Practices | Albacete MedDev",
    description: "Revenue cycle review for specialty practices. Assess product utilization, coding, documentation, payer requirements, claims activity, and implementation priorities."
  },
  hero: {
    eyebrow: "Albacete MedDev / Revenue cycle",
    title: "Revenue cycle analysis for specialty practices.",
    lead: "We review the products and services your practice provides, together with coding, documentation, payer requirements, and operational workflows. The analysis identifies areas for further clinical and financial review. Implementation is planned around your team’s responsibilities and existing workflow.",
    cta: { label: "Schedule a revenue review", href: "/contact" },
    link: { label: "See how it works", href: "#process" },
    image: "services-billing",
    alt: "Practice staff working through billing records at a desktop computer",
    stats: [
      { value: "Product review", desc: "utilization, costs, and supporting information" },
      { value: "AcuityMD", desc: "market and practice intelligence" },
      { value: "Workflow", desc: "documentation and process assessment" },
      { value: "Implementation", desc: "responsibilities, training, and review" }
    ]
  },
  problem: {
    title: "Review changes in products, services, and payer requirements.",
    paragraphs: [
      "Product options, payer policies, and service requirements change over time. A structured review can identify where existing processes, documentation, or product choices merit reassessment.",
      "Referral analysis can help a practice understand local referral patterns, service demand, and opportunities to develop professional relationships.",
      "We organize the findings into priorities for review with practice leadership, then define responsibilities and measures for implementation."
    ]
  },
  promise: {
    title: "A defined review and implementation process.",
    text: "Our team manages the analysis and develops recommendations for your practice to evaluate. Implementation requirements are discussed with clinical and operational leadership before changes are introduced.",
    list: [
      "Workflow assessment — understand responsibilities and implementation requirements.",
      "Managed analysis — product review, documentation assessment, and recommendations.",
      "Portal reporting — review relevant operational and revenue cycle information.",
      "Engagement terms — define scope, responsibilities, and performance measures.",
      "Policy review — assess recommendations against applicable payer and documentation requirements."
    ],
    outline: {
      title: "What the assessment covers",
      items: ["Product utilization and costs", "Documented services and coding", "Payer policies and claims activity", "Workflow and staff responsibilities", "Findings and implementation priorities"]
    }
  },
  process: {
    title: "Analyze the practice. Evaluate options. Plan implementation.",
    lead: "A structured review of your product portfolio, service activity, and workflows, followed by a practical implementation plan.",
    image: "software-documentation",
    alt: "Clinician documenting at a laptop beside a patient",
    steps: [
      {
        label: "Step",
        num: "01",
        title: "Portfolio analysis",
        text: "Review product utilization, rendered services, encounter-level financial information, and existing workflows to establish a baseline.",
        items: ["Full product-line audit across your current formulary", "Service activity by location and frequency", "Encounter-level revenue & margin analysis", "Existing workflow & EMR integration review"]
      },
      {
        label: "Step",
        num: "02",
        title: "Opportunity discovery",
        text: "Use available market and practice data to review product options, service activity, payer coverage, and referral patterns. Evaluate potential changes in the context of clinical appropriateness and the practice’s capabilities.",
        items: ["Product options, evidence, and costs", "Clinical service development opportunities", "Product and service workflow assessment", "Payer coverage and documentation review", "Local referral-pattern analysis"]
      },
      {
        label: "Step",
        num: "03",
        title: "Implementation planning",
        text: "Define the process changes, training, documentation, and reporting needed for implementation. Review responsibilities and progress with practice leadership.",
        items: ["Product implementation plan", "Service-line integration tailored to your workflow", "Portal-based revenue tracking & reconciliation", "Ongoing reviews at agreed intervals"]
      }
    ]
  },
  findings: {
    title: "Areas included in the revenue cycle review.",
    lead: "The review considers the relationship between services delivered, documentation, coding, product utilization, payer requirements, and referral activity.",
    cards: [
      { title: "Service development", text: "Evaluate additional services in relation to patient needs, clinical capabilities, staffing, and applicable requirements." },
      { title: "Product selection and costs", text: "Review product options, costs, clinical information, and applicable coverage requirements with your practice." },
      { title: "Product and service workflows", text: "Review how products and rendered services are used together, including documentation, coding, and operational requirements." },
      { title: "Supply utilization and billing", text: "Review supplies used at the point of care and assess how they are documented and billed under applicable payer rules." },
      { title: "Encounter coding", text: "Review whether selected codes accurately reflect the documented services and applicable coding requirements." },
      { title: "Referral patterns", text: "Assess local referral activity, service demand, and opportunities to develop professional relationships." },
      { title: "Payer coverage", text: "Review relevant payer policies and the documentation associated with the services your practice provides." },
      { title: "Clinical documentation", text: "Identify documentation gaps and develop guidance or templates to support accurate recording of the services delivered." }
    ]
  },
  settings: {
    title: "Every setting where procedural and clinical revenue lives.",
    lead: "The framework adapts to the billing patterns, payer mix, and workflow of your specialty. If you render services, perform procedures, or manage a clinical service line — we can surface revenue in your practice.",
    items: [
      "Private practice",
      "Wound care center",
      "Outpatient wound services",
      "Hospital system",
      "Mobile wound provider",
      "Interventional radiology",
      "Pain management",
      "Plastic surgery",
      "Reconstructive surgery",
      "Orthopedic surgery",
      "Neurosurgery",
      "Podiatry",
      "Vascular surgery",
      "General surgery",
      "Dermatology",
      "Endocrinology",
      "Infectious disease",
      "Skilled nursing facility",
      "Home health agency",
      "Rehabilitation center",
      "Ambulatory surgery center",
      "Long-term acute care",
      "Hyperbaric medicine",
      "Urgent care"
    ]
  },
  closing: {
    title: "Request a revenue cycle review.",
    text: "Schedule an introductory review of your product portfolio, service activity, and revenue cycle priorities. We will discuss the information needed and an appropriate scope for further assessment.",
    cta: { label: "Schedule your revenue review", href: "/contact" },
    secondary: WHY_PARTNER,
    image: "services-review",
    alt: "Two people reviewing documents together at a table"
  }
};
const consulting = {
  meta: {
    title: "Specialty Practice Consulting | Albacete MedDev",
    description: "Practice consulting across coding, documentation, operations, product selection, and payer coverage, informed by wound care experience."
  },
  hero: {
    eyebrow: "Albacete MedDev / Consulting",
    title: "Advisory support for specialty practice operations.",
    lead: "Consulting across coding, operations, product selection, and payer coverage, informed by experience in wound care practices. Each engagement considers the specialty, patient population, payer mix, and operational priorities.",
    cta: SCHEDULE,
    link: { label: "Explore advisory services", href: "#advisory" },
    image: "services-consulting",
    alt: "Consultant and clinician walking and talking in a practice corridor",
    stats: [
      { value: "20+", desc: "years of wound care experience" },
      { value: "Direct access", desc: "clinical and operational contacts" },
      { value: "Practice review", desc: "coding, operations, and product selection" },
      { value: "Defined scope", desc: "priorities and implementation responsibilities" }
    ]
  },
  advisory: {
    title: "Areas of advisory support.",
    lead: "Work with practice leadership to review coding, documentation, operational workflows, product selection, and payer requirements.",
    cards: [
      { title: "Coding strategy", text: "Per-product, per-payer CPT and HCPCS strategy tuned to your specialty. Modifier sequencing, unit billing, and revenue capture reviewed at the claim level." },
      { title: "Denial root-cause analysis", text: "Denials triaged to the underlying driver — coding, documentation, prior-auth, benefit verification, or payer policy shift — with remediation plans attached." },
      { title: "Operations & workflow", text: "Review patient flow, scheduling, staff responsibilities, and benefit-verification workflows to identify areas for improvement." },
      { title: "Formulary design", text: "Evaluate the product portfolio in relation to your patient population, clinical focus, available evidence, and payer requirements." },
      { title: "Payer coverage & market access", text: "Coverage posture across Medicare, Medicaid, and commercial — plus reimbursement pathway design for new products, service lines, and indications." },
      { title: "Compliance & audit readiness", text: "Review documentation standards, compliance processes, and charts in preparation for internal or external review." }
    ]
  },
  closer: {
    title: "Advisory with implementation support.",
    text: "Our advisory work draws on experience with billing, documentation, coding, scheduling, and practice operations. Recommendations are developed with the team responsible for implementing them.",
    bullets: ["Payer policy review", "Same advisory lead throughout", "Implementation support", "Scope agreed with your practice"],
    image: "services-training",
    alt: "Clinical team practising a dressing application together"
  },
  promise: {
    title: "Guidance informed by practice operations.",
    text: "Each engagement is shaped around the practice’s clinical focus, operational capacity, patient population, and payer requirements.",
    cta: SCHEDULE,
    image: "clinical-consult",
    alt: "Clinician in consultation with a patient and family member"
  },
  closing: {
    title: "Discuss an advisory engagement.",
    text: "Schedule a consultation to review your current operations and identify the questions, information, and priorities for an advisory engagement.",
    cta: SCHEDULE,
    secondary: WHY_PARTNER
  }
};
const about = {
  meta: {
    title: "About Albacete MedDev | Wound Care Operations Experts",
    description: "Albacete MedDev combines medical product distribution with documentation support, revenue cycle management, practice consulting, and clinical software."
  },
  hero: {
    eyebrow: "About Albacete",
    title: ["Wound care experience.", "Specialty practice support."],
    lead: "Albacete MedDev combines medical product distribution with practice support. Our work spans product evaluation, coding, documentation, revenue cycle management, and implementation.",
    cta: SCHEDULE,
    link: WHY_PARTNER,
    image: "care-hero",
    alt: "Preparation scene with a clinician, patient, AmCoreMatrix carton and membrane"
  },
  story: {
    title: "Our story",
    paragraphs: [
      "Medical product decisions involve clinical considerations, documentation requirements, staff training, and practice workflows.",
      "Albacete MedDev brings product distribution and operational support into a coordinated service, working with physicians, administrators, and clinical teams.",
      "We serve wound care practices, surgical groups, hospitals, and healthcare organizations with medical products, documentation support, practice services, and portal tools."
    ],
    image: "clinical-library",
    alt: "Clinician reading at a laptop in a library"
  },
  approach: {
    title: "Our approach",
    paragraphs: [
      "Every practice is different. Our approach starts with understanding your specialty, patient population, payer mix, and operational reality — then building a program around it.",
      "Product selection, documentation, and implementation are considered together. Our team provides training and operational support as the practice introduces and reviews its program.",
      "Our role is to support informed product decisions and practical implementation within the clinical setting."
    ],
    image: "services-review",
    alt: "Two people reviewing documents together at a table"
  },
  process: {
    title: "How we work with practices.",
    lead: "The engagement progresses through assessment, planning, implementation, and ongoing review.",
    steps: [
      { num: "01", label: "Discover", title: "Understand the practice", text: "Review the specialty, patient population, payer mix, existing workflows, and documentation. Identify priorities for further assessment." },
      { num: "02", label: "Align", title: "Design the program", text: "Develop a plan for product selection, clinical workflows, documentation, and coding, with consideration of applicable payer requirements." },
      { num: "03", label: "Implement", title: "Onboard the team", text: "Prepare the team through onboarding, product training, portal access, and documentation guidance. Confirm the responsibilities and steps required for implementation." },
      { num: "04", label: "Optimize", title: "Improve over time", text: "Review utilization, documentation, denials, and relevant program measures to identify changes for further evaluation." }
    ]
  },
  closing: {
    title: "Discuss your practice and its requirements.",
    text: "A 30-minute consultation to walk through how Albacete MedDev fits the operational reality of your practice.",
    cta: SCHEDULE,
    secondary: PORTFOLIO,
    image: "clinical-consult",
    alt: "Clinician in consultation with a patient and family member"
  }
};
const whyPartner = {
  meta: {
    title: "Why Partner With Albacete MedDev | Beyond Distribution",
    description: "Coordinate medical product evaluation with coding guidance, documentation support, clinical education, and practice services through Albacete MedDev."
  },
  hero: {
    eyebrow: "Why partner with us",
    title: "Product expertise and operational support.",
    lead: "Coordinate product evaluation with coding guidance, documentation support, clinical education, and practice services through Albacete MedDev.",
    cta: SCHEDULE,
    link: { label: "See the partnership", href: "#pillars" },
    image: "services-training",
    alt: "Clinical team practising a dressing application together",
    stats: [
      { value: "20+", desc: "years of wound care experience" },
      { value: "Direct access", desc: "clinical and operational contacts" },
      { value: "Staff training", desc: "product and documentation education" },
      { value: "Ongoing review", desc: "utilization and practice support" }
    ]
  },
  pillars: {
    title: "Support across the product lifecycle.",
    lead: "Discuss the product, training, documentation, portal, and revenue cycle support relevant to your practice.",
    cards: [
      { title: "Portal-integrated workflows", text: "Patient tracking, ordering, documentation, and utilization reporting — unified, real-time, role-based access for your clinical team." },
      { title: "Coding and documentation guidance", text: "Product-specific coding guidance, documentation review, benefit-verification support, and audit preparation." },
      { title: "Responsive human support", text: "Access to clinical and operations contacts for product questions, implementation, and ongoing support." },
      { title: "Clinical training & education", text: "Protocol-specific training for nurses, PAs, and MDs — tuned to your specialty, updated as the portfolio evolves." },
      { title: "Revenue cycle oversight", text: "Review claims activity, denial patterns, and revenue cycle information to identify items requiring follow-up." }
    ]
  },
  closer: {
    title: "Support through implementation and review.",
    text: "The engagement continues through product implementation, staff training, documentation review, and operational follow-up.",
    bullets: ["Direct team contacts", "Per-product coding & docs", "One unified portal", "Claims and denial review"],
    image: "software-documentation",
    alt: "Clinician documenting at a laptop beside a patient"
  },
  promise: {
    title: "A coordinated approach to practice support.",
    text: "Bring product, clinical, and operational questions into the same discussion. Define the support needed, the team’s responsibilities, and the steps for implementation.",
    cta: SCHEDULE,
    image: "practice-supply",
    alt: "Practice staff reviewing supplies together"
  },
  closing: {
    title: "Review your practice’s requirements.",
    text: "Schedule a consultation to review your clinical focus, current workflows, and service priorities, then identify an appropriate scope of support.",
    cta: SCHEDULE,
    secondary: PORTFOLIO
  }
};
const contactPage = {
  meta: { title: "Contact Albacete MedDev | Schedule a Consultation" },
  hero: {
    eyebrow: "Get in touch",
    title: "Schedule a consultation.",
    lead: "A 30-minute conversation to walk through how an Albacete MedDev partnership fits the operational and clinical reality of your practice. A focused discussion of your products, workflow, and priorities.",
    link: { label: "Tell us about your practice", href: "#your-practice" }
  },
  direct: {
    title: "Direct contact",
    text: "Connect with our team to discuss product information, practice services, and next steps.",
    channels: [
      { label: "Email", value: "gabe@albacetemeddev.com", href: "mailto:gabe@albacetemeddev.com" },
      { label: "Phone", value: "551-497-3428", href: "tel:5514973428" },
      { label: "Web", value: "albacetemeddev.com", href: "https://albacetemeddev.com" }
    ],
    hours: { label: "Hours", value: "Monday–Friday · 8:00 AM–6:00 PM ET" },
    more: {
      before: "Prefer to explore first? Take a look at ",
      portfolio: { label: "the full portfolio", href: "/products" },
      middle: " or ",
      why: { label: "why partner with us", href: "/why-partner" },
      after: "."
    }
  },
  practice: {
    title: "Tell us about your practice",
    text: "Share your clinical focus and the question you want to explore. For a direct conversation, call or email our team.",
    agenda: [
      { time: "0–10 min", text: "Your practice: specialty, patient mix, current products" },
      { time: "10–20 min", text: "Fit check: coverage, coding, and documentation reality" },
      { time: "20–30 min", text: "If it fits, a concrete next step. If not, we say so." }
    ]
  },
  form: {
    note: "Tell us what you would like to explore. This form prepares an email in your email app; you review and send it there. Please do not include patient-identifying information.",
    name: "Your name",
    email: "Email",
    practice: "Practice name",
    role: "Your role",
    roles: ["Select a role…", "Physician", "Practice administrator", "Compliance / billing", "Clinical staff", "Hospital / health system", "Other"],
    message: "How can we help?",
    messagePlaceholder: "Tell us about your specialty, patient population, and what you're exploring.",
    submit: "Prepare consultation email",
    status: "Your email app has been requested. Review and send the message there. If it does not open, email gabe@albacetemeddev.com or call 551-497-3428.",
    subjectPrefix: "Consultation request — ",
    subjectFallback: "New inquiry"
  },
  closing: {
    eyebrow: "Or jump ahead",
    title: "Explore the portfolio and approach.",
    text: "If you'd rather do a self-guided tour before the conversation, these are the best starting points.",
    cta: PORTFOLIO,
    secondary: WHY_PARTNER,
    image: "clinical-consult",
    alt: "Clinician in consultation with a patient and family member"
  }
};
const notFound = {
  hero: {
    eyebrow: "404",
    title: "This page moved on.",
    lead: "The address you followed doesn’t exist here anymore — the portfolio grew and a few things found new homes.",
    cta: { label: "Back to the homepage", href: "/" },
    link: { label: "Browse products", href: "/products" },
    image: "clinical-library",
    alt: "Clinician reading at a laptop in a library"
  }
};
const IMG = {
  "actigraft": { slug: "actigraft", widths: [480, 800, 1280], width: 1280, height: 960 },
  "activate-pack": { slug: "activate-pack", widths: [480, 800, 1280], width: 1280, height: 956 },
  "amchoplast": { slug: "amchoplast", widths: [480, 800, 1280], width: 1280, height: 960 },
  "apis": { slug: "apis", widths: [480, 800, 1280], width: 1280, height: 960 },
  "apis-pack": { slug: "apis-pack", widths: [480, 800, 1280], width: 1280, height: 956 },
  "arobella": { slug: "arobella", widths: [480, 800, 1280], width: 1280, height: 960 },
  "biolab-family-carton": { slug: "biolab-family-carton", widths: [480, 800], width: 800, height: 770 },
  "capsules": { slug: "capsules", widths: [480, 800, 1200], width: 1200, height: 900 },
  "care-hero": { slug: "care-hero", widths: [480, 800, 1280], width: 1280, height: 854 },
  "clinical-consult": { slug: "clinical-consult", widths: [480, 800, 1280], width: 1280, height: 853 },
  "clinical-lab": { slug: "clinical-lab", widths: [480, 800, 1280], width: 1280, height: 853 },
  "clinical-library": { slug: "clinical-library", widths: [480, 800, 1280], width: 1280, height: 853 },
  "evidence-reading": { slug: "evidence-reading", widths: [480, 800, 1280], width: 1280, height: 853 },
  "exosomes": { slug: "exosomes", widths: [480, 800, 1280], width: 1280, height: 854 },
  "interfyl": { slug: "interfyl", widths: [480, 800, 1280], width: 1280, height: 960 },
  "membrane-wrap": { slug: "membrane-wrap", widths: [480, 800, 1280], width: 1280, height: 854 },
  "membrane-wrap-hydro": { slug: "membrane-wrap-hydro", widths: [480, 800, 1280], width: 1280, height: 854 },
  "membrane-wrap-hydro-pack": { slug: "membrane-wrap-hydro-pack", widths: [480, 800, 1280], width: 1280, height: 956 },
  "membrane-wrap-lite-pack": { slug: "membrane-wrap-lite-pack", widths: [480, 800], width: 800, height: 603 },
  "membrane-wrap-pack": { slug: "membrane-wrap-pack", widths: [480, 800, 1280], width: 1280, height: 956 },
  "microdoc": { slug: "microdoc", widths: [480, 800, 1280], width: 1280, height: 960 },
  "microlyte": { slug: "microlyte", widths: [480, 800, 1280], width: 1280, height: 960 },
  "microlyte-pack": { slug: "microlyte-pack", widths: [480, 800, 1280], width: 1280, height: 956 },
  "microlyte-painguard": { slug: "microlyte-painguard", widths: [480, 800, 1280], width: 1280, height: 960 },
  "myriad-matrix": { slug: "myriad-matrix", widths: [480, 800, 1280], width: 1280, height: 960 },
  "ovena": { slug: "ovena", widths: [480, 800, 1280], width: 1280, height: 854 },
  "ovena-care-wash": { slug: "ovena-care-wash", widths: [480, 800, 1280], width: 1280, height: 1097 },
  "ovena-care-wash-01": { slug: "ovena-care-wash-01", widths: [480, 800, 1280], width: 1280, height: 1097 },
  "ovena-care-wash-02": { slug: "ovena-care-wash-02", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-care-wash-03": { slug: "ovena-care-wash-03", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-care-wash-04": { slug: "ovena-care-wash-04", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-care-wash-05": { slug: "ovena-care-wash-05", widths: [480, 800, 1280], width: 1280, height: 800 },
  "ovena-care-wash-06": { slug: "ovena-care-wash-06", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-care-wash-07": { slug: "ovena-care-wash-07", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-care-wash-08": { slug: "ovena-care-wash-08", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-care-wash-09": { slug: "ovena-care-wash-09", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-care-wash-10": { slug: "ovena-care-wash-10", widths: [480], width: 442, height: 330 },
  "ovena-care-wash-main": { slug: "ovena-care-wash-main", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-dressing": { slug: "ovena-collagen-dressing", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-dressing-01": { slug: "ovena-collagen-dressing-01", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-dressing-02": { slug: "ovena-collagen-dressing-02", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-dressing-03": { slug: "ovena-collagen-dressing-03", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-dressing-04": { slug: "ovena-collagen-dressing-04", widths: [480, 800], width: 800, height: 800 },
  "ovena-collagen-dressing-05": { slug: "ovena-collagen-dressing-05", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-dressing-06": { slug: "ovena-collagen-dressing-06", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-dressing-07": { slug: "ovena-collagen-dressing-07", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-dressing-08": { slug: "ovena-collagen-dressing-08", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-dressing-09": { slug: "ovena-collagen-dressing-09", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-dressing-10": { slug: "ovena-collagen-dressing-10", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-dressing-main": { slug: "ovena-collagen-dressing-main", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-kit": { slug: "ovena-collagen-kit", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-kit-01": { slug: "ovena-collagen-kit-01", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-kit-02": { slug: "ovena-collagen-kit-02", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-kit-03": { slug: "ovena-collagen-kit-03", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-kit-04": { slug: "ovena-collagen-kit-04", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-kit-05": { slug: "ovena-collagen-kit-05", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-kit-06": { slug: "ovena-collagen-kit-06", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-kit-07": { slug: "ovena-collagen-kit-07", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-kit-08": { slug: "ovena-collagen-kit-08", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-kit-09": { slug: "ovena-collagen-kit-09", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-kit-10": { slug: "ovena-collagen-kit-10", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-kit-11": { slug: "ovena-collagen-kit-11", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-kit-12": { slug: "ovena-collagen-kit-12", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-kit-13": { slug: "ovena-collagen-kit-13", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-kit-14": { slug: "ovena-collagen-kit-14", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-kit-15": { slug: "ovena-collagen-kit-15", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-kit-16": { slug: "ovena-collagen-kit-16", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-kit-17": { slug: "ovena-collagen-kit-17", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-kit-18": { slug: "ovena-collagen-kit-18", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-kit-main": { slug: "ovena-collagen-kit-main", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-powder": { slug: "ovena-collagen-powder", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-powder-01": { slug: "ovena-collagen-powder-01", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-powder-02": { slug: "ovena-collagen-powder-02", widths: [480, 800], width: 800, height: 800 },
  "ovena-collagen-powder-03": { slug: "ovena-collagen-powder-03", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-powder-04": { slug: "ovena-collagen-powder-04", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-powder-05": { slug: "ovena-collagen-powder-05", widths: [480, 800], width: 800, height: 800 },
  "ovena-collagen-powder-06": { slug: "ovena-collagen-powder-06", widths: [480, 800, 1280], width: 1280, height: 640 },
  "ovena-collagen-powder-07": { slug: "ovena-collagen-powder-07", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-powder-08": { slug: "ovena-collagen-powder-08", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-powder-09": { slug: "ovena-collagen-powder-09", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-powder-10": { slug: "ovena-collagen-powder-10", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-collagen-powder-main": { slug: "ovena-collagen-powder-main", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-compression-socks": { slug: "ovena-compression-socks", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-compression-socks-01": { slug: "ovena-compression-socks-01", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-compression-socks-02": { slug: "ovena-compression-socks-02", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-compression-socks-03": { slug: "ovena-compression-socks-03", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-compression-socks-04": { slug: "ovena-compression-socks-04", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-compression-socks-05": { slug: "ovena-compression-socks-05", widths: [480, 800], width: 800, height: 791 },
  "ovena-compression-socks-06": { slug: "ovena-compression-socks-06", widths: [480, 800, 1280], width: 1280, height: 640 },
  "ovena-compression-socks-07": { slug: "ovena-compression-socks-07", widths: [480, 800, 1280], width: 1280, height: 640 },
  "ovena-compression-socks-08": { slug: "ovena-compression-socks-08", widths: [480, 800, 1280], width: 1280, height: 1267 },
  "ovena-compression-socks-09": { slug: "ovena-compression-socks-09", widths: [480, 800, 1280], width: 1280, height: 1267 },
  "ovena-compression-socks-10": { slug: "ovena-compression-socks-10", widths: [480, 800, 1280], width: 1280, height: 1267 },
  "ovena-compression-socks-main": { slug: "ovena-compression-socks-main", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-hydrocolloid-roll": { slug: "ovena-hydrocolloid-roll", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-hydrocolloid-roll-01": { slug: "ovena-hydrocolloid-roll-01", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-hydrocolloid-roll-02": { slug: "ovena-hydrocolloid-roll-02", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-hydrocolloid-roll-03": { slug: "ovena-hydrocolloid-roll-03", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-hydrocolloid-roll-04": { slug: "ovena-hydrocolloid-roll-04", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-hydrocolloid-roll-05": { slug: "ovena-hydrocolloid-roll-05", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-hydrocolloid-roll-06": { slug: "ovena-hydrocolloid-roll-06", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-hydrocolloid-roll-07": { slug: "ovena-hydrocolloid-roll-07", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-hydrocolloid-roll-08": { slug: "ovena-hydrocolloid-roll-08", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-hydrocolloid-roll-09": { slug: "ovena-hydrocolloid-roll-09", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-hydrocolloid-roll-10": { slug: "ovena-hydrocolloid-roll-10", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-hydrocolloid-roll-main": { slug: "ovena-hydrocolloid-roll-main", widths: [480, 800, 1280], width: 1280, height: 1255 },
  "ovena-sock-aid": { slug: "ovena-sock-aid", widths: [480, 800], width: 800, height: 800 },
  "ovena-sock-aid-01": { slug: "ovena-sock-aid-01", widths: [480, 800], width: 800, height: 800 },
  "ovena-sock-aid-02": { slug: "ovena-sock-aid-02", widths: [480, 800], width: 800, height: 800 },
  "ovena-sock-aid-03": { slug: "ovena-sock-aid-03", widths: [480, 800], width: 800, height: 800 },
  "ovena-sock-aid-04": { slug: "ovena-sock-aid-04", widths: [480, 800], width: 800, height: 1067 },
  "ovena-sock-aid-05": { slug: "ovena-sock-aid-05", widths: [480, 800], width: 800, height: 800 },
  "ovena-sock-aid-06": { slug: "ovena-sock-aid-06", widths: [480, 800, 1280], width: 1280, height: 720 },
  "ovena-sock-aid-07": { slug: "ovena-sock-aid-07", widths: [480, 800, 1280], width: 1280, height: 640 },
  "ovena-sock-aid-08": { slug: "ovena-sock-aid-08", widths: [480, 800, 1280], width: 1280, height: 1280 },
  "ovena-sock-aid-09": { slug: "ovena-sock-aid-09", widths: [480, 800, 1280], width: 1280, height: 640 },
  "ovena-sock-aid-10": { slug: "ovena-sock-aid-10", widths: [480, 800, 1280], width: 1280, height: 640 },
  "ovena-sock-aid-main": { slug: "ovena-sock-aid-main", widths: [480, 800], width: 800, height: 800 },
  "palingen": { slug: "palingen", widths: [480, 800, 1280], width: 1280, height: 960 },
  "palisade-pack": { slug: "palisade-pack", widths: [480, 800, 1280], width: 1280, height: 956 },
  "pen": { slug: "pen", widths: [480, 800, 1200], width: 1200, height: 900 },
  "peptides-scene": { slug: "peptides-scene", widths: [480, 800, 1280], width: 1280, height: 854 },
  "practice-supply": { slug: "practice-supply", widths: [480, 800, 1280], width: 1280, height: 853 },
  "ref-actigraft": { slug: "ref-actigraft", widths: [480, 800, 1280], width: 1280, height: 978 },
  "ref-amchoplast": { slug: "ref-amchoplast", widths: [480], width: 480, height: 480 },
  "ref-apis": { slug: "ref-apis", widths: [480, 800, 1280], width: 1280, height: 1024 },
  "ref-arobella": { slug: "ref-arobella", widths: [480], width: 436, height: 298 },
  "ref-interfyl": { slug: "ref-interfyl", widths: [480], width: 450, height: 275 },
  "ref-membrane-wrap": { slug: "ref-membrane-wrap", widths: [480, 800, 1280], width: 1280, height: 853 },
  "ref-membrane-wrap-hydro": { slug: "ref-membrane-wrap-hydro", widths: [480, 800], width: 800, height: 770 },
  "ref-membrane-wrap-hydro-2": { slug: "ref-membrane-wrap-hydro-2", widths: [480], width: 252, height: 252 },
  "ref-microdoc": { slug: "ref-microdoc", widths: [480], width: 296, height: 296 },
  "ref-microlyte": { slug: "ref-microlyte", widths: [480, 800], width: 800, height: 486 },
  "ref-microlyte-painguard": { slug: "ref-microlyte-painguard", widths: [480, 800], width: 800, height: 534 },
  "ref-myriad-matrix": { slug: "ref-myriad-matrix", widths: [480, 800, 1280], width: 1280, height: 1163 },
  "ref-palingen": { slug: "ref-palingen", widths: [480, 800, 1280], width: 1280, height: 835 },
  "ref-tri-membrane-wrap": { slug: "ref-tri-membrane-wrap", widths: [480], width: 382, height: 382 },
  "ref-ultramist": { slug: "ref-ultramist", widths: [480, 800], width: 800, height: 499 },
  "ref-xcell-amnio-matrix": { slug: "ref-xcell-amnio-matrix", widths: [480], width: 419, height: 461 },
  "ref-xcellistem": { slug: "ref-xcellistem", widths: [480, 800], width: 800, height: 800 },
  "sentry-sl-pack": { slug: "sentry-sl-pack", widths: [480, 800, 1280], width: 1280, height: 956 },
  "services-billing": { slug: "services-billing", widths: [480, 800, 1280], width: 1280, height: 853 },
  "services-consulting": { slug: "services-consulting", widths: [480, 800, 1280], width: 1280, height: 853 },
  "services-review": { slug: "services-review", widths: [480, 800, 1280], width: 1280, height: 853 },
  "services-training": { slug: "services-training", widths: [480, 800, 1280], width: 1280, height: 853 },
  "software-documentation": { slug: "software-documentation", widths: [480, 800, 1280], width: 1280, height: 853 },
  "software-mesh": { slug: "software-mesh", widths: [480, 800, 1280], width: 1280, height: 853 },
  "software-review": { slug: "software-review", widths: [480, 800, 1280], width: 1280, height: 853 },
  "software-scan": { slug: "software-scan", widths: [480, 800, 1280], width: 1280, height: 853 },
  "supplies": { slug: "supplies", widths: [480, 800, 1200], width: 1200, height: 900 },
  "surgical": { slug: "surgical", widths: [480, 800, 1280], width: 1280, height: 854 },
  "tri-membrane-wrap": { slug: "tri-membrane-wrap", widths: [480, 800, 1280], width: 1280, height: 854 },
  "tri-membrane-wrap-pack": { slug: "tri-membrane-wrap-pack", widths: [480, 800, 1280], width: 1280, height: 956 },
  "ultramist": { slug: "ultramist", widths: [480, 800, 1280], width: 1280, height: 960 },
  "vial-liquid": { slug: "vial-liquid", widths: [480, 800, 1200], width: 1200, height: 900 },
  "vial-lyophilized": { slug: "vial-lyophilized", widths: [480, 800, 1200], width: 1200, height: 900 },
  "vial-pair": { slug: "vial-pair", widths: [480, 800, 1200], width: 1200, height: 900 },
  "wholesaler": { slug: "wholesaler", widths: [480, 800, 1280], width: 1280, height: 854 },
  "xcell-amnio-matrix": { slug: "xcell-amnio-matrix", widths: [480, 800, 1280], width: 1280, height: 960 },
  "xcellistem": { slug: "xcellistem", widths: [480, 800, 1280], width: 1280, height: 854 },
  "xcellistem-pack": { slug: "xcellistem-pack", widths: [480, 800, 1280], width: 1280, height: 956 }
};
const srcSet = (a, fmt) => a.widths.map((w) => `/img/${a.slug}-${w}.${fmt} ${w}w`).join(", ");
const fallbackSrc = (a) => `/img/${a.slug}-${a.widths[Math.min(1, a.widths.length - 1)]}.webp`;
const IDENTITY = {
  activate: "/img/identity/activate-identity.png",
  palisade: "/img/identity/palisade-identity.png",
  "sentry-sl": "/img/identity/sentry-sl-identity.png"
};
const IDENT_VIDEO = {
  landscape: { mp4: "/media/albacete-ident-landscape.mp4", webm: "/media/albacete-ident-landscape.webm" }
};
function Picture({ image, alt, sizes, className, priority = false, draggable }) {
  const a = IMG[image];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("picture", { className, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("source", { type: "image/avif", srcSet: srcSet(a, "avif"), sizes }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("source", { type: "image/webp", srcSet: srcSet(a, "webp"), sizes }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: fallbackSrc(a),
        alt,
        width: a.width,
        height: a.height,
        loading: priority ? "eager" : "lazy",
        decoding: priority ? "sync" : "async",
        fetchPriority: priority ? "high" : void 0,
        draggable
      }
    )
  ] });
}
const cx = (...parts) => parts.filter(Boolean).join(" ");
function Panel({
  tone = "light",
  as: Tag = "section",
  className,
  image,
  imageAlt = "",
  sizes = "(max-width: 1440px) 96vw, 1376px",
  priority,
  scrim = "left",
  children,
  ...rest
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { className: cx("panel", `panel--${tone}`, className), ...rest, children: [
    tone === "photo" && image ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-media", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Picture, { image, alt: imageAlt, sizes, priority }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `panel-scrim panel-scrim--${scrim}`, "aria-hidden": "true" })
    ] }) : null,
    children
  ] });
}
function SectionHead({ id, eyebrow, title, lead, link, aside, center, onDark, level = 2, className }) {
  const Heading = level === 1 ? "h1" : "h2";
  const body = /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    eyebrow ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cx("label", onDark && "label--on-dark"), children: eyebrow }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx(Heading, { id, className: level === 1 ? "h1" : "h2", children: title }),
    lead ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead", children: lead }) : null,
    link ? /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href: link.href, className: cx("link-arrow", onDark && "link-arrow--on-dark"), children: [
      link.label,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
    ] }) : null
  ] });
  if (aside) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: cx("section-head section-head--split", className), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: body }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-aside", children: aside })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: cx("section-head", center && "section-head--center", className), children: body });
}
function PhotoCard({ eyebrow, title, text, cta, image, alt, tone = "dark", align = "top", sizes = "(max-width: 640px) 94vw, (max-width: 1023px) 46vw, 31vw", className, priority }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: cx("pcard", tone === "light" && "pcard--light", align === "bottom" && "pcard--bottom", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pcard-media", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Picture, { image, alt, sizes, priority }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pcard-scrim", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pcard-body", children: [
      eyebrow ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "pcard-label", children: eyebrow }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "pcard-title", children: title }),
      text ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "pcard-text", children: text }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: cta.href, className: cx("btn stretch", tone === "light" ? "btn--primary" : "btn--light"), children: cta.label })
    ] })
  ] });
}
function PhotoCardGrid({ cols = 3, children, className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cx("pc-grid", cols === 4 && "pc-grid--4", cols === 2 && "pc-grid--2", className), children });
}
function StatementPanel({ id, eyebrow, title, text, cta, image, alt, className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { tone: "photo", scrim: "center", image, imageAlt: alt, className: cx("statement", className), "aria-labelledby": id, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "statement-body", children: [
    eyebrow ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "label label--on-dark", children: eyebrow }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id, className: "statement-title", children: title }),
    text ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "statement-text", children: text }) : null,
    cta ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "actions", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: cta.href, className: "btn btn--light", children: cta.label }) }) : null
  ] }) });
}
function EditorialCard({ label, num, title, text, href, linkLabel = "Read more", image, alt, tone = "white", tall, sizes = "(max-width: 640px) 94vw, (max-width: 1023px) 46vw, 31vw", children, as: Tag = "article" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { className: cx("ecard", tone === "grey" && "ecard--grey"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cx("ecard-media", tall && "ecard-media--tall"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Picture, { image, alt, sizes }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ecard-body", children: [
      label || num ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "ecard-label", children: [
        num ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mono-num", "aria-hidden": "true", children: num }) : null,
        label
      ] }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "ecard-title", children: title }),
      text ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ecard-text", children: text }) : null,
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href, className: "link-arrow ecard-link stretch", children: [
        linkLabel,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
      ] })
    ] })
  ] });
}
function EditorialGrid({ cols = 3, children, as: Tag = "div", className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: cx("ed-grid", cols === 2 && "ed-grid--2", className), children });
}
function SplitRow({ id, eyebrow, title, children, cta, secondary, image, identity, alt = "", reverse, tone = "grey", plate, sizes = "(max-width: 900px) 92vw, 44vw", level = 2, media, className }) {
  const Heading = level === 3 ? "h3" : "h2";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id, className: cx("split", reverse && "split--reverse", tone === "white" && "split--white", tone === "navy" && "split--navy", className), "aria-labelledby": id ? `${id}-title` : void 0, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cx("split-media", (plate || identity) && "split-media--plate", !plate && !identity && "split-media--cover"), children: media ? media : identity ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: identity, alt, width: 500, height: 152, loading: "lazy", decoding: "async" }) : image ? /* @__PURE__ */ jsxRuntimeExports.jsx(Picture, { image, alt, sizes }) : null }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "split-copy", children: [
      eyebrow ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "label", children: eyebrow }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Heading, { id: id ? `${id}-title` : void 0, children: title }),
      children,
      cta || secondary ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "actions", children: [
        cta ? /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: cta.href, className: cx("btn", tone === "navy" ? "btn--light" : "btn--primary"), children: cta.label }) : null,
        secondary ? /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href: secondary.href, className: cx("link-arrow", tone === "navy" && "link-arrow--on-dark"), children: [
          secondary.label,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
        ] }) : null
      ] }) : null
    ] })
  ] });
}
function SubNav({ title, titleHref, items, label = "Page sections" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "subnav", "aria-label": label, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "subnav-inner", children: [
    titleHref ? /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: titleHref, className: "subnav-title", children: title }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "subnav-title", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "subnav-list", children: items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: it.href, children: it.label }) }, it.href)) })
  ] }) });
}
function InfoBand({ title, notes, id = "info-title" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "info", "aria-labelledby": id, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container info-inner", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id, className: "info-head", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "info-text", children: notes.map((n, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: n }, i)) })
  ] }) });
}
let io = null;
function watch(el) {
  if (typeof window === "undefined") return;
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.classList.add("is-in");
    return;
  }
  io ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io?.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
  );
  io.observe(el);
}
function Reveal({ as = "div", className, children, ...rest }) {
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    watch(el);
    return () => io?.unobserve(el);
  }, []);
  return reactExports.createElement(as, { ref, className: cx("reveal", className), ...rest }, children);
}
function Anchor({ link, onDark, className }) {
  const cls = cx("link-arrow", onDark && "link-arrow--on-dark", className);
  if (link.href.startsWith("#")) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: link.href, className: cls, children: [
      link.label,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "↓" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLink, { href: link.href, className: cls, children: [
    link.label,
    " ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
  ] });
}
function CompanyHero({ eyebrow, title, lead, cta, link, image, alt = "", stats, aside, tone = "grey", className, titleId = "page-title" }) {
  const lines = Array.isArray(title) ? title : [title];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: cx("wide co-hero-wrap", className), "aria-labelledby": titleId, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { tone, as: "div", className: "co-hero", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cx("co-hero-grid", aside ? "co-hero-grid--aside" : null), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "co-hero-copy", children: [
        eyebrow ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "label", children: eyebrow }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { id: titleId, className: "co-hero-title", children: lines.map((line) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: line }, line)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "co-hero-lead", children: lead }),
        cta || link ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "actions", children: [
          cta ? /* @__PURE__ */ jsxRuntimeExports.jsx(AppLink, { href: cta.href, className: "btn btn--primary", children: cta.label }) : null,
          link ? /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor, { link }) : null
        ] }) : null
      ] }),
      aside ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "co-hero-aside", children: aside }) : image ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "co-hero-media", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Picture, { image, alt, sizes: "(max-width: 900px) 96vw, 46vw", priority: true }) }) : null
    ] }),
    stats?.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "co-stats", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: s.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: s.desc })
    ] }, s.value)) }) : null
  ] }) });
}
function NotFound() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CompanyHero, { ...notFound.hero, className: "co-nf", titleId: "nf-title" });
}
const DEFAULT_TITLE = "Albacete MedDev";
const DEFAULT_DESCRIPTION = "Medical products and practice services.";
const appMeta = appMetaJson;
const APP_HOST_ZONES = ["higgsfield.app", "higgsfield-dev.app"];
function toOwnAssetUrl(value) {
  if (!value) return null;
  if (value.startsWith("/")) return value;
  try {
    const u = new URL(value);
    const isAppHost = APP_HOST_ZONES.some((zone) => u.hostname === zone || u.hostname.endsWith(`.${zone}`));
    if (isAppHost) return u.pathname + u.search;
    return value;
  } catch {
    return value;
  }
}
const FONT_PRELOADS = ["/fonts/figtree-400.woff2", "/fonts/figtree-600.woff2", "/fonts/figtree-700.woff2"];
function buildHead(meta) {
  const title = meta.og_title ?? DEFAULT_TITLE;
  const description = meta.og_description ?? DEFAULT_DESCRIPTION;
  const ogImage = toOwnAssetUrl(meta.og_image_url);
  const favicon = toOwnAssetUrl(meta.favicon_url);
  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title },
      { name: "description", content: description },
      { name: "author", content: "Albacete MedDev" },
      { name: "theme-color", content: "#ffffff" },
      { name: "format-detection", content: "telephone=yes" },
      // Design demo of albacetemeddev.com: keep it out of search results so it
      // never competes with the live site.
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:site_name", content: "Albacete MedDev" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: ogImage ? "summary_large_image" : "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      ...ogImage ? [
        { property: "og:image", content: ogImage },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:image", content: ogImage }
      ] : []
    ],
    links: [
      ...FONT_PRELOADS.map((href) => ({ rel: "preload", as: "font", type: "font/woff2", href, crossOrigin: "anonymous" })),
      { rel: "stylesheet", href: appCss },
      ...favicon ? [{ rel: "icon", href: favicon, type: "image/png", sizes: "32x32" }] : [],
      { rel: "icon", href: "/favicon-16.png", type: "image/png", sizes: "16x16" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" }
    ]
  };
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(NotFound, {});
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportHiggsfieldError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section notfound", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "h1", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "btn btn--primary",
          onClick: () => {
            router2.invalidate();
            reset();
          },
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "btn btn--outline", children: "Back to the homepage" })
    ] })
  ] }) });
}
const Route$i = createRootRouteWithContext()({
  head: () => buildHead(appMeta),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en-US", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$i.useRouteContext();
  reactExports.useEffect(() => {
    document.documentElement.classList.add("js");
    window.setTimeout(() => document.documentElement.classList.add("reveal-all"), 4e3);
    {
      return;
    }
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "skip-link", href: "#main", children: "Skip to content" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(UtilityBar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { id: "main", tabIndex: -1, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, {})
  ] });
}
const $$splitComponentImporter$e = () => import("./why-partner-DXSpxIVW.js");
const Route$h = createFileRoute("/why-partner")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component"),
  head: () => ({
    meta: [{
      title: whyPartner.meta.title
    }, {
      name: "description",
      content: whyPartner.meta.description
    }]
  })
});
const SOFTWARE = {
  title: "StrataMetric AI Wound Scan Software | Albacete MedDev",
  description: "AI Wound Scan by StrataMetric: true wound volume from a 4-second iPhone LiDAR scan, audit-defensible notes, claims compliance and UDI graft inventory.",
  hero: {
    crumbs: ["Software", "StrataMetric", "Part of the Albacete MedDev ecosystem"],
    title: "The wound has depth. Now your documentation <em>does too.</em>",
    lead: "<strong>AI Wound Scan</strong>, by StrataMetric, measures true wound volume from a four-second iPhone LiDAR scan — reading depth point by point across the whole wound bed instead of multiplying length × width × depth. Area, depth and perimeter come with every scan, each with a 95% confidence interval, and the note is written before you leave the room.",
    primary: { label: "Explore stratametricai.com", href: "https://stratametricai.com" },
    secondary: { label: "Book a guided walkthrough", href: "mailto:gabe@stratametricai.com?subject=StrataMetric%20portal%20walkthrough" }
  },
  report: {
    aria: "Sample AI Wound Scan report rendered from StrataMetric's synthetic demonstration mesh",
    title: "AI Wound Scan · measurement report",
    chip: "SYNTHETIC DEMO",
    image: "software-mesh",
    alt: "Phone showing a three-dimensional wound mesh",
    metrics: [
      { k: "Length", v: "4.2 cm" },
      { k: "Width", v: "3.8 cm" },
      { k: "Max depth", v: "1.18 cm" },
      { k: "Wound bed", v: "11.2 cm²" },
      { k: "Peri-wound", v: "18.4 cm²" },
      { k: "Report", v: "< 5 min" }
    ],
    steps: ["Capture", "Reconstruct", "Segment", "Measure", "Report"],
    foot: ["4-s LiDAR burst", "60 depth frames", "every measurement with a 95% CI", "±0.03 cm @95% (per StrataMetric)", "iPhone 12 Pro+"],
    caption: "Synthetic demonstration mesh — not patient data.",
    link: { label: "Open the full interactive demo", href: "https://www.stratametricai.com/demo" }
  },
  why: {
    eyebrow: "Why it exists",
    title: "Length × width × depth <em>cannot see the wound.</em>",
    aside: "Wound beds are never uniform. Undermining, tunneling and uneven granulation all change how much volume is really there — and ruler-and-photo documentation is increasingly inadequate under Medicare audit. AI Wound Scan integrates the depth field across the wound’s own topography, so an undermined or irregular wound reports what it really holds.",
    image: "software-scan",
    alt: "Clinician scanning a dressed wound with a phone",
    cards: [
      { num: "01", label: "Capture", title: "Four-second capture", text: "A clinician points an iPhone. A LiDAR burst collects 60 depth frames in about four seconds — no rulers, no disposable markers, no probe in the wound bed." },
      { num: "02", label: "Measure", title: "Volume the wound actually has", text: "The engine integrates the depth field across the reconstructed wound bed rather than approximating with L×W×D. Surface area, depth and perimeter come with it — each with a 95% confidence interval." },
      { num: "03", label: "Document", title: "Documentation that defends itself", text: "Auto-generated, audit-defensible notes with full provenance and methodology in every report, clinical notes with sign-and-lock, and a tamper-evident audit hash chain." },
      { num: "04", label: "Claims", title: "Claims & compliance", text: "Documentation-compliance checks against claims requirements, built for the CMS/LCD/NCD context wound programs actually bill in." },
      { num: "05", label: "Inventory", title: "Graft inventory with UDI", text: "Serial, lot and UDI captured at the point of care, so every graft unit is traceable from manufacturer to application to the claim it was billed on." },
      { num: "06", label: "Operate", title: "The service line around it", text: "Patient and wound tracking with healing trajectories, reporting and analytics, route planning for mobile providers, and an admin console with a live tamper-evidence check." }
    ]
  },
  platform: {
    eyebrow: "The platform",
    title: "From bedside scan to <em>defensible report.</em>",
    aside: "A five-stage pipeline — capture, reconstruct, segment, measure, report — running end-to-end on AWS, typically inside five minutes.",
    spec: {
      title: "Pipeline",
      rows: [
        { k: "01 Capture", v: "iPhone · ARKit + LiDAR" },
        { k: "02 Reconstruct", v: "Sensor fusion · uncertainty-aware" },
        { k: "03 Segment", v: "ML boundary detection, clinician-confirmed" },
        { k: "04 Measure", v: "3D geometry engine" },
        { k: "05 Report", v: "Diagrams + plain language" },
        { k: "Components", v: "iOS app · measurement engine · provider portal" },
        { k: "Portal", v: "10 working views, TOTP MFA" },
        { k: "Cloud", v: "AWS · built with nClouds (AWS Premier Partner)" }
      ]
    },
    posture: {
      title: "Built for the pathway ahead",
      text: "StrataMetric’s stated regulatory posture, quoted plainly — and its limits, stated just as plainly:",
      items: [
        "<strong>Cures Act §3060 CDS exemption</strong> — the clinician retains decision authority, no diagnostic claims are made, and methodology is displayed in every report.",
        "<strong>510(k)-ready architecture</strong> — designed to support a future FDA submission. <em>Not FDA-cleared and not FDA-approved today.</em>",
        "<strong>HIPAA-grade controls</strong> — TOTP MFA, role-based access, tamper-evident audit chain, encryption at rest and in transit. <em>A control posture, not a certification.</em>",
        "<strong>Six-year retention</strong> — object-locked storage aligned to documentation-retention expectations."
      ],
      framing: "<strong>Required framing:</strong> For clinical decision support only. Not for diagnostic use. Clinician retains decision authority. Methodology disclosed in every measurement report."
    },
    partners: {
      eyebrow: "Infrastructure partners",
      title: "Built with AWS and nClouds.",
      text: "StrataMetric runs on Amazon Web Services and was built in partnership with nClouds, an AWS Premier Partner."
    }
  },
  demo: {
    eyebrow: "See it yourself",
    title: "The demo is <em>the software.</em>",
    aside: "stratametricai.com hosts a live WebGL wound-mesh viewer and a working portal walkthrough — ten views, from the 3D Scan Studio to claims and admin. The values shown there are synthetic demonstration data, and the site says so; real patient meshes render inside the authenticated portal.",
    photos: [
      { image: "software-documentation", alt: "Clinician documenting at a laptop beside a patient" },
      { image: "software-review", alt: "Clinician and patient reviewing a tablet" }
    ],
    cards: [
      { tag: "Live demo", title: "3D mesh viewer", text: "Interactive wound-parameter simulation with tissue-composition layers, depth and heat render modes, cross-sections and analytics.", cta: { label: "Open the demo", href: "https://www.stratametricai.com/demo" } },
      { tag: "Portal", title: "Provider portal", text: "Dashboard, patients, wound records, notes, inventory, claims & compliance, reports, routes and admin — sign-in for providers with an account.", cta: { label: "Portal sign-in", href: "https://www.stratametricai.com/login" } },
      { tag: "Access", title: "Request access", text: "Access is by request while the platform onboards practices — for your practice, network, or investment team.", cta: { label: "Request access", href: "mailto:gabe@stratametricai.com?subject=StrataMetric%20access%20request" } }
    ]
  },
  faq: {
    eyebrow: "Common questions",
    title: "What to know about <em>AI Wound Scan.</em>",
    items: [
      { q: "What exactly is StrataMetric, and how does it relate to Albacete MedDev?", a: "StrataMetric is the software company behind <strong>AI Wound Scan</strong>; in its own words, “AI Wound Scan is a StrataMetric product, part of the Albacete MedDev ecosystem.” It pairs naturally with the wound-care products and reimbursement services on this site — one partner across products, documentation and software." },
      { q: "Is it FDA cleared?", a: "<strong>No.</strong> AI Wound Scan operates today under the 21st Century Cures Act §3060 clinical-decision-support exemption: the clinician retains decision authority and no diagnostic claims are made. Its architecture is described as 510(k)-<em>ready</em> — designed to support a future submission — which is not the same thing as cleared or approved, and this page never treats it as such." },
      { q: "What hardware does it need?", a: "An <strong>iPhone 12 Pro or later</strong> — the LiDAR-equipped hardware clinics already carry. Capture runs in a guided SwiftUI app; the portal runs in the browser." },
      { q: "What does it cost?", a: 'Pricing is not public; access is by request while practices onboard. Email <a href="mailto:gabe@stratametricai.com">gabe@stratametricai.com</a> for an access request or a guided walkthrough.' }
    ]
  },
  cta: {
    eyebrow: "See the platform",
    title: "See it with your own cases.",
    text: "Providers with an account can sign in now. For access or a guided walkthrough for your practice, network, or investment team — we’ll set it up.",
    primary: { label: "Request access", href: "mailto:gabe@stratametricai.com?subject=StrataMetric%20access%20request" },
    secondary: { label: "Visit stratametricai.com", href: "https://stratametricai.com" },
    image: "clinical-consult",
    alt: "Clinician in consultation with a patient and family member"
  },
  info: {
    title: "Important information",
    notes: [
      "For clinical decision support only. Not for diagnostic use. Clinician retains decision authority. Methodology disclosed in every measurement report.",
      "Not FDA-cleared and not FDA-approved today.",
      "Synthetic demonstration mesh — not patient data."
    ]
  }
};
const $$splitComponentImporter$d = () => import("./software-BqPvoHxd.js");
const Route$g = createFileRoute("/software")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component"),
  head: () => ({
    meta: [{
      title: SOFTWARE.title
    }, {
      name: "description",
      content: SOFTWARE.description
    }, {
      property: "og:title",
      content: SOFTWARE.title
    }, {
      property: "og:description",
      content: SOFTWARE.description
    }]
  })
});
const Route$f = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          "  <url>",
          `    <loc>${origin}/</loc>`,
          `    <lastmod>${today}</lastmod>`,
          "    <changefreq>weekly</changefreq>",
          "    <priority>1.0</priority>",
          "  </url>",
          "</urlset>"
        ].join("\n");
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600"
          }
        });
      }
    }
  }
});
const $$splitComponentImporter$c = () => import("./scientific-portfolio-D1im_WrD.js");
const TITLE$1 = "Scientific Portfolio — Materials & Evidence | Albacete MedDev";
const DESC$1 = "A clinical reference to the materials, devices and published studies in the Albacete MedDev wound care portfolio. Read study context and find product-specific sources.";
const Route$e = createFileRoute("/scientific-portfolio")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component"),
  head: () => ({
    meta: [{
      title: TITLE$1
    }, {
      name: "description",
      content: DESC$1
    }, {
      property: "og:title",
      content: TITLE$1
    }, {
      property: "og:description",
      content: DESC$1
    }]
  })
});
const Route$d = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const body = [
          "User-agent: *",
          "Allow: /",
          "",
          `Sitemap: ${origin}/sitemap.xml`
        ].join("\n");
        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=86400"
          }
        });
      }
    }
  }
});
const PORTAL = {
  title: "Practice Portal: Tracking, Ordering & Compliance | Albacete",
  description: "One portal for patient tracking, ordering, compliance documentation, and utilization reporting. Role-based access, audit-ready, real-time claims visibility.",
  hero: {
    crumbs: ["Portal", "Clinical operating dashboard"],
    title: "One portal. <em>Every touchpoint.</em>",
    lead: "Patient tracking, product ordering, compliance documentation, and utilization reporting — unified in <strong>one real-time portal</strong> with role-based access for your entire clinical team. No vendor logins. No spreadsheet trackers. No tab-juggling.",
    primary: { label: "Request access", href: "/contact" },
    secondary: { label: "Try the portal preview", href: "#portal-demo" },
    photos: [
      { image: "services-review", alt: "Clinicians reviewing patient records together" },
      { image: "software-documentation", alt: "Clinician documenting at a laptop beside a patient" },
      { image: "services-billing", alt: "Practice administrator reviewing claims on a monitor" }
    ],
    stats: [
      { value: "Real-time", desc: "orders, claims, and documentation" },
      { value: "Role-based", desc: "access for clinical, billing, admin" },
      { value: "One login", desc: "across every product we carry" },
      { value: "24 / 7", desc: "availability — audit-ready anytime" }
    ]
  },
  demo: {
    eyebrow: "Inside the portal",
    title: "The <em>clinical operating dashboard.</em>",
    text: "Explore a sample workflow for patients, orders, documentation, and reporting. This interactive demonstration uses fictional sample data. Confirm current features and availability with our team."
  },
  caps: {
    eyebrow: "Inside the workflow",
    title: "What sits in the portal <em>on day one.</em>",
    lead: "Six operational surfaces unified in one real-time view — provisioned during onboarding, tuned per role, audit-ready from the first click.",
    items: [
      { title: "Patient tracking", text: "Every patient, every product, every visit — full treatment history in one view. Supports audit readiness and clinical decision-making.", image: "clinical-consult", alt: "Clinician in consultation with a patient and family member" },
      { title: "Real-time ordering", text: "Place product orders and follow them end-to-end — shipment, delivery, and confirmation visible without chasing emails or phone calls.", image: "practice-supply", alt: "Clinician checking supplies in a practice store room" },
      { title: "Compliance templates", text: "LCD/NCD-aligned documentation built into the workflow. Wound measurements, SWOs, and HCPCS validation happen as you work — not as a separate step.", image: "software-documentation", alt: "Clinician documenting at a laptop beside a patient" },
      { title: "Utilization reporting", text: "Utilization dashboards across your whole practice — patient outcomes, product mix, revenue cycle, operational efficiency in one view.", image: "services-billing", alt: "Practice administrator reviewing claims on a monitor" },
      { title: "Role-based access", text: "Physicians, nurses, documentation, billing, administrators — each team member sees the views and functions appropriate to their role.", image: "services-consulting", alt: "Consultant walking with a clinician in a practice corridor" },
      { title: "24 / 7 availability", text: "Encrypted in transit, audit-logged, and always on — your chart stack is accessible the hour an audit or patient call lands.", image: "services-training", alt: "Clinical team in a training session" }
    ]
  },
  cta: {
    eyebrow: "Ready when you are",
    title: "Your portfolio, visible in real time.",
    text: "A 30-minute walkthrough covering portal onboarding, role-based provisioning, and integration with your current workflow.",
    primary: { label: "Request a walkthrough", href: "/contact" },
    secondary: { label: "Why partner with us", href: "/why-partner" },
    image: "services-review",
    alt: "Clinicians reviewing patient records together"
  },
  info: {
    title: "Important information",
    notes: [
      "This interactive demonstration uses fictional sample data. Confirm current features and availability with our team.",
      "Downloads contain fictional sample data only.",
      "This account and its records are fictional demonstration data."
    ]
  }
};
const $$splitComponentImporter$b = () => import("./portal-CRkVNay_.js");
const Route$c = createFileRoute("/portal")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component"),
  head: () => ({
    meta: [{
      title: PORTAL.title
    }, {
      name: "description",
      content: PORTAL.description
    }, {
      property: "og:title",
      content: PORTAL.title
    }, {
      property: "og:description",
      content: PORTAL.description
    }]
  })
});
const $$splitComponentImporter$a = () => import("./evidence-Ds8nkkOJ.js");
const TITLE = "Evidence Base — Every Product, Graded | Albacete MedDev";
const DESC = "Every product Albacete MedDev distributes, graded A to D on verified clinical evidence, with links to each RCT, case series, registered trial, FDA 510(k) record, and instructions for use.";
const Route$b = createFileRoute("/evidence")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component"),
  head: () => ({
    meta: [{
      title: TITLE
    }, {
      name: "description",
      content: DESC
    }, {
      property: "og:title",
      content: TITLE
    }, {
      property: "og:description",
      content: DESC
    }]
  })
});
const $$splitComponentImporter$9 = () => import("./contact-ZHHsn63B.js");
const Route$a = createFileRoute("/contact")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component"),
  head: () => ({
    meta: [{
      title: contactPage.meta.title
    }]
  })
});
const pagesCss = "/assets/pages-products-DZSzl7Lv.css";
const $$splitComponentImporter$8 = () => import("./amazon-store-CwEjoL6b.js");
const Route$9 = createFileRoute("/amazon-store")({
  head: () => ({
    meta: [{
      title: "Ovena Health | Albacete MedDev"
    }, {
      name: "description",
      content: "Practical wound care and compression supplies for care beyond the clinic."
    }],
    links: [{
      rel: "stylesheet",
      href: pagesCss
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./about-DMHQ7WVt.js");
const Route$8 = createFileRoute("/about")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component"),
  head: () => ({
    meta: [{
      title: about.meta.title
    }, {
      name: "description",
      content: about.meta.description
    }]
  })
});
const $$splitComponentImporter$6 = () => import("./index-BvqLO8p_.js");
const Route$7 = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./index-NC8oQe3S.js");
const Route$6 = createFileRoute("/services/")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component"),
  head: () => ({
    meta: [{
      title: servicesHub.meta.title
    }, {
      name: "description",
      content: servicesHub.meta.description
    }]
  })
});
const PRODUCTS = [
  {
    "slug": "actigraft",
    "href": "/products/actigraft",
    "name": "ActiGraft",
    "title": "ActiGraft | Albacete MedDev",
    "description": 'width=device-width, initial-scale=1" name="viewport"/><title>ActiGraft | Albacete MedDev</title><meta content="An autologous approach using a clot prepared from the patient’s own blood.',
    "category": "blood-based-skin-substitutes",
    "categoryLabel": "Autologous wound care",
    "image": "actigraft",
    "identity": null,
    "reference": "ref-actigraft",
    "maker": "RedDress",
    "deck": "An autologous approach using a clot prepared from the patient’s own blood.",
    "cta": {
      "label": "Discuss this product",
      "href": "/contact?products=actigraft"
    },
    "source": {
      "label": "Source information",
      "href": "https://reddressmedical.com/solutions/",
      "external": true
    },
    "imageAlt": "Albacete MedDev",
    "imageCaption": "Manufacturer reference",
    "anchors": [
      {
        "href": "#overview",
        "label": "Product overview"
      },
      {
        "href": "#clinical-reading",
        "label": "Clinical reading"
      },
      {
        "href": "#resources",
        "label": "Next steps"
      }
    ],
    "specs": [
      {
        "k": "Material / technology",
        "v": "Patient-derived whole blood clot"
      },
      {
        "k": "Format",
        "v": "Point-of-care system"
      },
      {
        "k": "Product source",
        "v": "RedDress"
      }
    ],
    "overview": {
      "eyebrow": "The Product In Context",
      "title": "A closer look.",
      "text": "Understand the material, explore the source information, and bring the right questions to your clinical review.",
      "cards": [
        {
          "title": "Approach",
          "text": "A point-of-care system for preparing an autologous whole blood clot dressing."
        },
        {
          "title": "Confirm the system",
          "text": "ActiGraft systems and versions have different instructions and components. Confirm the exact system supplied before training or use."
        },
        {
          "title": "Read the evidence",
          "text": "Review the available clinical trials, populations, endpoints, and limitations in the evidence library."
        }
      ]
    },
    "extras": [],
    "reading": {
      "eyebrow": "Clinical Reading",
      "title": "Follow the source.",
      "text": "Read the full reference to understand the population, application, and limits of the findings.",
      "library": {
        "label": "Explore the evidence library",
        "href": "/evidence/#ev-actigraft"
      },
      "references": [
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/42641008/",
          "meta": "Meta-analysis · 2026",
          "citation": "Snyder RJ, Lee M. Efficacy of autologous blood-derived therapies in diabetic foot ulcers: a systematic review and meta-analysis of randomized controlled trials. Wounds. 2026;38(7):184-190."
        },
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/39287414/",
          "meta": "RCT · 2024",
          "citation": "Snyder R, Nouvong A, Ulloa J, et al. Efficacy and safety of autologous whole blood clot in diabetic foot ulcers: a randomised controlled trial. J Wound Care. 2024;33(9):688-700."
        },
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/39136828/",
          "meta": "Prospective comparative · 2024",
          "citation": "Ram E, Zager Y, Carter D, et al. Efficacy and safety of RD2 Ver.02, a whole blood clot therapy, coupled with a minimally invasive procedure in pilonidal sinus: a phase II study. Tech Coloproctol. 2024;28(1):97."
        }
      ]
    },
    "next": {
      "eyebrow": "Your Next Step",
      "title": "Bring it into your practice’s conversation.",
      "text": "Ask for current instructions, available sizes, product training, and help reviewing operational requirements.",
      "cta": {
        "label": "Talk with our team",
        "href": "/contact?products=actigraft"
      }
    },
    "sections": [],
    "faq": [],
    "ctaBand": null,
    "family": [],
    "disclaimers": []
  },
  {
    "slug": "activate",
    "href": "/products/activate",
    "name": "Activate Matrix",
    "title": "Activate Matrix | Albacete MedDev",
    "description": 'width=device-width, initial-scale=1" name="viewport"/><title>Activate Matrix | Albacete MedDev</title><meta content="A full-thickness placental-derived allograft for use as a wound covering.',
    "category": "sheet-skin-substitutes",
    "categoryLabel": "Placental membranes",
    "image": "activate-pack",
    "identity": null,
    "reference": null,
    "maker": "Sequence LifeScience",
    "deck": "A full-thickness placental-derived allograft for use as a wound covering.",
    "cta": {
      "label": "Discuss this product",
      "href": "/contact?products=activate"
    },
    "source": {
      "label": "Source information",
      "href": "https://sequencelifesci.com/activate/",
      "external": true
    },
    "imageAlt": "Activate Matrix carton and foil pouch, Nvision Biomedical Technologies",
    "imageCaption": "Explore the source information and request current product documentation.",
    "anchors": [
      {
        "href": "#overview",
        "label": "Product overview"
      },
      {
        "href": "#clinical-reading",
        "label": "Clinical reading"
      },
      {
        "href": "#resources",
        "label": "Next steps"
      }
    ],
    "specs": [
      {
        "k": "Material / technology",
        "v": "Amnion · intermediate layer · chorion"
      },
      {
        "k": "Format",
        "v": "Dehydrated membrane"
      },
      {
        "k": "Product source",
        "v": "Sequence LifeScience"
      }
    ],
    "overview": {
      "eyebrow": "The Product In Context",
      "title": "A closer look.",
      "text": "Understand the material, explore the source information, and bring the right questions to your clinical review.",
      "cards": [
        {
          "title": "Material & format",
          "text": "Includes the amniotic and chorionic membranes and the intermediate layer of the placenta."
        },
        {
          "title": "Size options",
          "text": "The manufacturer lists 2 × 2, 2 × 4, 4 × 4, and 4 × 8 cm formats. Confirm current availability before ordering."
        },
        {
          "title": "Clinical review",
          "text": "Use the current product instructions to evaluate intended use, preparation, orientation, and application for the individual patient."
        }
      ]
    },
    "extras": [],
    "reading": {
      "eyebrow": "Clinical Reading",
      "title": "Follow the source.",
      "text": "Read the full reference to understand the population, application, and limits of the findings.",
      "library": {
        "label": "Explore the evidence library",
        "href": "/evidence/"
      },
      "references": [
        {
          "href": "https://sequencelifesci.com/activate/",
          "meta": "Product reference",
          "citation": "Review the product information, specifications, and available resources."
        }
      ]
    },
    "next": {
      "eyebrow": "Your Next Step",
      "title": "Bring it into your practice’s conversation.",
      "text": "Ask for current instructions, available sizes, product training, and help reviewing operational requirements.",
      "cta": {
        "label": "Talk with our team",
        "href": "/contact?products=activate"
      }
    },
    "sections": [],
    "faq": [],
    "ctaBand": null,
    "family": [],
    "disclaimers": []
  },
  {
    "slug": "adhesion-barrier",
    "href": "/products/adhesion-barrier",
    "name": "Surgical allografts",
    "title": "Surgical allografts | Albacete MedDev",
    "description": 'width=device-width, initial-scale=1" name="viewport"/><title>Surgical allografts | Albacete MedDev</title><meta content="Bring the product, its labeled use, and your OR workflow into the same review.',
    "category": "practice-products",
    "categoryLabel": "Across the practice",
    "image": "surgical",
    "identity": null,
    "reference": null,
    "maker": "Surgical product program",
    "deck": "Bring the product, its labeled use, and your OR workflow into the same review.",
    "cta": {
      "label": "Discuss this product",
      "href": "/contact?products=adhesion-barrier"
    },
    "source": {
      "label": "Source information",
      "href": "https://www.cellutionbiologics.com/products/amcorematrix%E2%84%A2",
      "external": true
    },
    "imageAlt": "AmCoreMatrix carton beside its thin membrane held in forceps, based on Cellution Biologics references",
    "imageCaption": "",
    "anchors": [
      {
        "href": "#overview",
        "label": "Product overview"
      },
      {
        "href": "#clinical-reading",
        "label": "Clinical reading"
      },
      {
        "href": "#resources",
        "label": "Next steps"
      }
    ],
    "specs": [
      {
        "k": "Material / technology",
        "v": "Product-specific placental tissue"
      },
      {
        "k": "Format",
        "v": "Surgical membrane"
      },
      {
        "k": "Product source",
        "v": "Surgical product program"
      }
    ],
    "overview": {
      "eyebrow": "The Product In Context",
      "title": "A closer look.",
      "text": "Understand the material, explore the source information, and bring the right questions to your clinical review.",
      "cards": [
        {
          "title": "Product-specific review",
          "text": "Confirm the exact allograft brand and composition before evaluating a surgical application. The linked AmCoreMatrix manufacturer resource describes amnion, intermediate layer, and chorion."
        },
        {
          "title": "OR planning",
          "text": "Discuss storage, preparation, instrumentation, staff training, and product-specific handling with our team."
        },
        {
          "title": "Documentation",
          "text": "Request the current IFU and regulatory documentation. Review coverage and facility billing separately for the actual procedure and site of service."
        }
      ]
    },
    "extras": [],
    "reading": {
      "eyebrow": "Clinical Reading",
      "title": "Follow the source.",
      "text": "Read the full reference to understand the population, application, and limits of the findings.",
      "library": {
        "label": "Explore the evidence library",
        "href": "/evidence/#ev-adhesion-barrier"
      },
      "references": [
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/29521830/",
          "meta": "Animal study · 2018 · class",
          "citation": "Kuckelman JP, Kononchik J, Smith J, Kniery KR, Kay JT, Hoffer ZS, Steele SR, Sohn V. Human-Derived Amniotic Membrane Is Associated With Decreased Postoperative Intraperitoneal Adhesions in a Rat Model. Dis Colon Rectum. 2018 Apr;61(4):484-490."
        },
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/2724232/",
          "meta": "Animal study · 1989 · class",
          "citation": "Badawy SZ, Baggish MS, ElBakry MM, Baltoyannis P. Evaluation of tissue healing and adhesion formation after an intraabdominal amniotic membrane graft in the rat. J Reprod Med. 1989 Mar;34(3):198-202."
        },
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/6179420/",
          "meta": "Animal study · 1982 · class",
          "citation": "Soules MR, Dennis L, Bosarge A, Moore DE. The prevention of postoperative pelvic adhesions: an animal study comparing barrier methods with dextran 70. Am J Obstet Gynecol. 1982 Aug 1;143(7):829-34."
        }
      ]
    },
    "next": {
      "eyebrow": "Your Next Step",
      "title": "Bring it into your practice’s conversation.",
      "text": "Ask for current instructions, available sizes, product training, and help reviewing operational requirements.",
      "cta": {
        "label": "Talk with our team",
        "href": "/contact?products=adhesion-barrier"
      }
    },
    "sections": [],
    "faq": [],
    "ctaBand": null,
    "family": [],
    "disclaimers": []
  },
  {
    "slug": "advanced-biologics",
    "href": "/products/advanced-biologics",
    "name": "The BioLab membrane family.",
    "title": "BioLab membrane family | Albacete MedDev",
    "description": 'width=device-width, initial-scale=1" name="viewport"/><title>BioLab membrane family | Albacete MedDev</title><meta content="Compare Membrane Wrap, Membrane Wrap Hydro, and Tri-Membrane Wrap formats with current manufacturer resources.',
    "category": "family",
    "categoryLabel": "Product family",
    "image": "membrane-wrap-pack",
    "identity": null,
    "reference": null,
    "maker": "BioLab Holdings",
    "deck": "Compare Membrane Wrap, Membrane Wrap Hydro, and Tri-Membrane Wrap formats with current manufacturer resources.",
    "cta": {
      "label": "Discuss the family",
      "href": "/contact?products=membrane-wrap,membrane-wrap-hydro,tri-membrane-wrap"
    },
    "source": {
      "label": "Source information",
      "href": "https://www.biolabholdings.com/products/membranes",
      "external": true
    },
    "imageAlt": "Membrane Wrap carton from BioLab Sciences with the membrane in its pouch",
    "imageCaption": "Product use follows current manufacturer instructions.",
    "anchors": [],
    "specs": [],
    "overview": null,
    "extras": [],
    "reading": null,
    "next": null,
    "sections": [],
    "faq": [],
    "ctaBand": null,
    "family": [
      {
        "href": "/products/membrane-wrap",
        "slug": "membrane-wrap",
        "maker": "BioLab Holdings",
        "name": "Membrane Wrap",
        "text": "A dual-layer amniotic allograft used as a protective wound covering."
      },
      {
        "href": "/products/membrane-wrap-hydro",
        "slug": "membrane-wrap-hydro",
        "maker": "BioLab Holdings",
        "name": "Membrane Wrap Hydro",
        "text": "A hydrated, dual-layer amniotic membrane that serves as a protective wound covering."
      },
      {
        "href": "/products/tri-membrane-wrap",
        "slug": "tri-membrane-wrap",
        "maker": "BioLab Holdings",
        "name": "Tri-Membrane Wrap",
        "text": "A three-layer placental allograft for protective wound coverage."
      }
    ],
    "disclaimers": [
      "The family also includes single-layer and other hydrated variants. Confirm the exact name, composition, size, and instructions before ordering. Layer count alone does not establish clinical suitability.",
      "Product use follows current manufacturer instructions."
    ]
  },
  {
    "slug": "amchoplast",
    "href": "/products/amchoplast",
    "name": "AmchoPlast",
    "title": "AmchoPlast | Albacete MedDev",
    "description": 'width=device-width, initial-scale=1" name="viewport"/><title>AmchoPlast | Albacete MedDev</title><meta content="A placental membrane wound covering with its amnion, intermediate layer, and chorion structure retained.',
    "category": "sheet-skin-substitutes",
    "categoryLabel": "Placental membranes",
    "image": "amchoplast",
    "identity": null,
    "reference": "ref-amchoplast",
    "maker": "Cellution Biologics",
    "deck": "A placental membrane wound covering with its amnion, intermediate layer, and chorion structure retained.",
    "cta": {
      "label": "Discuss this product",
      "href": "/contact?products=amchoplast"
    },
    "source": {
      "label": "Source information",
      "href": "https://www.cellutionbiologics.com/products/amchoplast",
      "external": true
    },
    "imageAlt": "Albacete MedDev",
    "imageCaption": "Manufacturer reference",
    "anchors": [
      {
        "href": "#overview",
        "label": "Product overview"
      },
      {
        "href": "#clinical-reading",
        "label": "Clinical reading"
      },
      {
        "href": "#resources",
        "label": "Next steps"
      }
    ],
    "specs": [
      {
        "k": "Material / technology",
        "v": "Amnion · intermediate layer · chorion"
      },
      {
        "k": "Format",
        "v": "Dehydrated membrane"
      },
      {
        "k": "Product source",
        "v": "Cellution Biologics"
      }
    ],
    "overview": {
      "eyebrow": "The Product In Context",
      "title": "A closer look.",
      "text": "Understand the material, explore the source information, and bring the right questions to your clinical review.",
      "cards": [
        {
          "title": "Material & format",
          "text": "A sterile dehydrated human placental membrane allograft. The manufacturer describes AmchoPlast as a natural biological wound cover."
        },
        {
          "title": "Handling",
          "text": "Store in a clean, dry environment at room temperature and follow the expiration date and current instructions supplied with the product."
        },
        {
          "title": "Before ordering",
          "text": "Confirm the exact product name and dimensions. AmchoPlast and other Cellution product names should not be treated as interchangeable."
        }
      ]
    },
    "extras": [],
    "reading": {
      "eyebrow": "Clinical Reading",
      "title": "Follow the source.",
      "text": "Read the full reference to understand the population, application, and limits of the findings.",
      "library": {
        "label": "Explore the evidence library",
        "href": "/evidence/#ev-amchoplast"
      },
      "references": [
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/41458871/",
          "meta": "Prospective comparative · 2025",
          "citation": "Hall HJ, Keenan A, Massey K, D'Costa WF, Moyer P. Bridging the Wound Gap: Interim Results From Randomized Trials Evaluating Dehydrated Human Amnion-Intermediate Layer-Chorion Membrane for the Treatment of Non-healing Diabetic Foot Ulcers. Cureus. 2025 Nov 26;17(11):e97875."
        },
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/42462898/",
          "meta": "In vitro · 2026",
          "citation": "Muthuchamy M, Mohan V, Sarangapani S, Abhaya M, Somasundaram A. Structural and functional validation of dehydrated human amnion/chorion allograft: A biological wound cover. Mol Cell Endocrinol. 2026 Jul 16;621:112869."
        },
        {
          "href": "https://clinicaltrials.gov/study/NCT06562296",
          "meta": "Registered trial · completed",
          "citation": "CAMPLIFE: Multicenter, Prospective, Randomized Controlled Matriarch Trial Evaluating Several CAMPs and SOC Versus SOC Alone of Nonhealing Diabetic Foot and Venous Leg Ulcers"
        }
      ]
    },
    "next": {
      "eyebrow": "Your Next Step",
      "title": "Bring it into your practice’s conversation.",
      "text": "Ask for current instructions, available sizes, product training, and help reviewing operational requirements.",
      "cta": {
        "label": "Talk with our team",
        "href": "/contact?products=amchoplast"
      }
    },
    "sections": [],
    "faq": [],
    "ctaBand": null,
    "family": [],
    "disclaimers": []
  },
  {
    "slug": "apis",
    "href": "/products/apis",
    "name": "APIS",
    "title": "APIS | Albacete MedDev",
    "description": 'width=device-width, initial-scale=1" name="viewport"/><title>APIS | Albacete MedDev</title><meta content="A wound matrix combining collagen and Mānuka honey in a soft sheet format.',
    "category": "non-sheet-skin-substitutes",
    "categoryLabel": "Matrices & wound coverings",
    "image": "apis-pack",
    "identity": null,
    "reference": "ref-apis",
    "maker": "SweetBio",
    "deck": "A wound matrix combining collagen and Mānuka honey in a soft sheet format.",
    "cta": {
      "label": "Discuss this product",
      "href": "/contact?products=apis"
    },
    "source": {
      "label": "Source information",
      "href": "https://www.sweetbio.com/",
      "external": true
    },
    "imageAlt": "APIS by SweetBio carton with the sterile peel pouch and amber wafer",
    "imageCaption": "Manufacturer reference",
    "anchors": [
      {
        "href": "#overview",
        "label": "Product overview"
      },
      {
        "href": "#clinical-reading",
        "label": "Clinical reading"
      },
      {
        "href": "#resources",
        "label": "Next steps"
      }
    ],
    "specs": [
      {
        "k": "Material / technology",
        "v": "Collagen · Mānuka honey"
      },
      {
        "k": "Format",
        "v": "Matrix sheet"
      },
      {
        "k": "Product source",
        "v": "SweetBio"
      }
    ],
    "overview": {
      "eyebrow": "The Product In Context",
      "title": "A closer look.",
      "text": "Understand the material, explore the source information, and bring the right questions to your clinical review.",
      "cards": [
        {
          "title": "Material & format",
          "text": "A collagen-derived matrix with Mānuka honey. Confirm the current formulation and instructions in the manufacturer documentation."
        },
        {
          "title": "Read the evidence",
          "text": "Explore the product-specific clinical publications, including the study in Mohs surgical defects, alongside study populations and limitations."
        },
        {
          "title": "Before ordering",
          "text": "Confirm the selected size, handling requirements, and application instructions. APIS and VERIS are distinct products."
        }
      ]
    },
    "extras": [],
    "reading": {
      "eyebrow": "Clinical Reading",
      "title": "Follow the source.",
      "text": "Read the full reference to understand the population, application, and limits of the findings.",
      "library": {
        "label": "Explore the evidence library",
        "href": "/evidence/#ev-apis"
      },
      "references": [
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/32804895/",
          "meta": "Prospective comparative · 2021",
          "citation": "McMurray SL, Wallace MM, Stebbins WG, Clayton AS. Use of a Novel Biomaterial to Enhance Secondary Intention Healing. Dermatol Surg. 2021;47(6):843-844."
        },
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/33121306/",
          "meta": "Prospective comparative · 2020",
          "citation": "Rodriguez IA, Strombergsson A, Weinstein R, Maloney A, Hendrix C, Liden B, Fridman R. Preliminary Clinical Evaluation Using a Novel Bioengineered Wound Product to Treat Lower Extremity Ulcers. Int J Low Extrem Wounds. 2020;22(1):139-145."
        },
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/36749996/",
          "meta": "Retrospective comparative · 2023",
          "citation": "Rodríguez I, Alvarez A, Massey C, Miller L, Rannou R, Croce M, Alleman T. Novel bioengineered collagen with Manuka honey and hydroxyapatite sheet for the treatment of lower extremity chronic wounds in an urban hospital wound care setting. Wounds. 2023;35(1):E35-E38."
        }
      ]
    },
    "next": {
      "eyebrow": "Your Next Step",
      "title": "Bring it into your practice’s conversation.",
      "text": "Ask for current instructions, available sizes, product training, and help reviewing operational requirements.",
      "cta": {
        "label": "Talk with our team",
        "href": "/contact?products=apis"
      }
    },
    "sections": [],
    "faq": [],
    "ctaBand": null,
    "family": [],
    "disclaimers": []
  },
  {
    "slug": "arobella",
    "href": "/products/arobella",
    "name": "Arobella Qoustic",
    "title": "Arobella Qoustic | Albacete MedDev",
    "description": 'width=device-width, initial-scale=1" name="viewport"/><title>Arobella Qoustic | Albacete MedDev</title><meta content="An ultrasound-assisted system for wound debridement and cleansing.',
    "category": "conservative-wound-care",
    "categoryLabel": "Wound care devices",
    "image": "arobella",
    "identity": null,
    "reference": "ref-arobella",
    "maker": "Arobella Medical",
    "deck": "An ultrasound-assisted system for wound debridement and cleansing.",
    "cta": {
      "label": "Discuss this product",
      "href": "/contact?products=arobella"
    },
    "source": {
      "label": "Source information",
      "href": "https://arobella.com/products/",
      "external": true
    },
    "imageAlt": "Albacete MedDev",
    "imageCaption": "Manufacturer reference",
    "anchors": [
      {
        "href": "#overview",
        "label": "Product overview"
      },
      {
        "href": "#clinical-reading",
        "label": "Clinical reading"
      },
      {
        "href": "#resources",
        "label": "Next steps"
      }
    ],
    "specs": [
      {
        "k": "Material / technology",
        "v": "Ultrasonic debridement"
      },
      {
        "k": "Format",
        "v": "Console · handpiece"
      },
      {
        "k": "Product source",
        "v": "Arobella Medical"
      }
    ],
    "overview": {
      "eyebrow": "The Product In Context",
      "title": "A closer look.",
      "text": "Understand the material, explore the source information, and bring the right questions to your clinical review.",
      "cards": [
        {
          "title": "Technology",
          "text": "The Qoustic Wound Therapy System uses an ultrasonic generator and handpiece with irrigation."
        },
        {
          "title": "Practice planning",
          "text": "Review device configuration, instruments, staff training, and the labeled contact or non-contact techniques for the selected system."
        },
        {
          "title": "Resources",
          "text": "Manufacturer materials include cleared indications, specifications, and a product catalog. Use the current instructions for clinical decisions."
        }
      ]
    },
    "extras": [],
    "reading": {
      "eyebrow": "Clinical Reading",
      "title": "Follow the source.",
      "text": "Read the full reference to understand the population, application, and limits of the findings.",
      "library": {
        "label": "Explore the evidence library",
        "href": "/evidence/#ev-arobella"
      },
      "references": [
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/25751849/",
          "meta": "In vitro · 2015",
          "citation": "Conner-Kerr T, Malpass G, Steele A, Howlett A. Effects of 35 kHz, low-frequency ultrasound application in vitro on human fibroblast morphology and migration patterns. Ostomy Wound Manage. 2015 Mar;61(3):34-41."
        },
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/20562540/",
          "meta": "In vitro · 2010",
          "citation": "Karau MJ, Piper KE, Steckelberg JM, Kavros SJ, Patel R. In vitro activity of the Qoustic Wound Therapy System against planktonic and biofilm bacteria. Adv Skin Wound Care. 2010 Jul;23(7):316-320."
        },
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/20511683/",
          "meta": "In vitro · 2010",
          "citation": "Conner-Kerr T, Alston G, Stovall A, Vernon T, Winter D, Meixner J, Grant K, Kute T. The effects of low-frequency ultrasound (35 kHz) on methicillin-resistant Staphylococcus aureus (MRSA) in vitro. Ostomy Wound Manage. 2010 May;56(5):32-43."
        }
      ]
    },
    "next": {
      "eyebrow": "Your Next Step",
      "title": "Bring it into your practice’s conversation.",
      "text": "Ask for current instructions, available sizes, product training, and help reviewing operational requirements.",
      "cta": {
        "label": "Talk with our team",
        "href": "/contact?products=arobella"
      }
    },
    "sections": [],
    "faq": [],
    "ctaBand": null,
    "family": [],
    "disclaimers": []
  },
  {
    "slug": "exosomes",
    "href": "/products/exosomes",
    "name": "Exosomes & birth tissue",
    "title": "Exosomes & Birth Tissue Biologics | Albacete MedDev",
    "description": "Wharton's Jelly MSC exosomes and fresh, never-frozen placental biologics. FDA-registered facility, cGMP processing, ISO 5 clean rooms, NTA-validated.",
    "category": "practice-products",
    "categoryLabel": "Across the practice",
    "image": "exosomes",
    "identity": null,
    "reference": null,
    "maker": "Scientific & regulatory information",
    "deck": "Review the scientific and regulatory context before discussing product availability.",
    "cta": {
      "label": "Discuss this product",
      "href": "/contact?products=exosomes"
    },
    "source": {
      "label": "Clinical & regulatory resources",
      "href": "/evidence/",
      "external": false
    },
    "imageAlt": "Scientist examining a sample in a laboratory",
    "imageCaption": "Product use follows current manufacturer instructions.",
    "anchors": [
      {
        "href": "#clinical-section-1",
        "label": "Regenerative medicine, rigorously processed."
      },
      {
        "href": "#faq",
        "label": "What to know about regenerative biologics."
      }
    ],
    "specs": [],
    "overview": null,
    "extras": [],
    "reading": null,
    "next": null,
    "sections": [
      {
        "id": "clinical-section-1",
        "eyebrow": "Safety & production",
        "title": "Regenerative medicine, rigorously processed.",
        "text": "Every product meets the full FDA registration and cGMP processing standards for HCT/Ps — with fresh-processing protocols that preserve biological activity.",
        "items": [
          {
            "title": "FDA Registered Facility",
            "text": "cGMP processing facility with full FDA registration and compliance to 21 CFR Part 1271 for human cells, tissues, and cellular and tissue-based products (HCT/Ps). Quality assurance embedded at every production step."
          },
          {
            "title": "Fresh, Never Frozen",
            "text": "Birth tissue is processed immediately upon receipt and is never frozen — preserving maximum biological activity, signaling capacity, and growth factor integrity in every finished product."
          },
          {
            "title": "Next-Generation Biologics",
            "text": "Acellular exosome products and Wharton's Jelly MSC-derived therapies that simplify storage and handling while delivering concentrated bioactive cargo — growth factors, cytokines, and signaling molecules."
          }
        ]
      }
    ],
    "faq": [
      {
        "q": "What are exosomes?",
        "a": "In a wound that has stalled, the underlying problem is signaling — inflammation stays switched on and rebuilding never starts. Exosomes are the signaling packets cells use to change that. These nanoscale vesicles (30–150 nm) deliver growth factors, cytokines, and nucleic acids that help quiet the inflammatory loop, stimulate new blood vessel formation (angiogenesis), and support matrix remodeling and re-epithelialization. And because exosome products are acellular — vesicles, not living cells — storage, handling, and regulatory considerations are simpler than cell-based therapies."
      },
      {
        "q": "What birth tissue products are available?",
        "a": "Our regenerative portfolio includes exosome products (NTA-validated for concentration, particle size, and batch consistency), Wharton's Jelly MSC-derived therapies, and fresh-processed placental biologics. All products are processed in ISO 5 classified clean rooms with 24/7 environmental monitoring, inside an FDA-registered cGMP facility. Every batch ships fresh — never frozen — preserving maximum biological activity."
      },
      {
        "q": "What are the clinical applications?",
        "a": "Regenerative biologics support a range of wound care and musculoskeletal protocols — including chronic wound healing, inflammation modulation, soft tissue regeneration, and combination therapy alongside allografts and collagen programs. Albacete MedDev provides full operational and compliance infrastructure — documentation support, coding guidance, storage and handling protocols, and clinical education — so your practice can implement these therapies with confidence."
      }
    ],
    "ctaBand": {
      "title": "Add regenerative biologics to your program.",
      "text": "A 30-minute consultation to walk through product selection, clinical protocols, and compliance infrastructure.",
      "primary": {
        "label": "Schedule a consultation",
        "href": "/contact"
      },
      "secondary": {
        "label": "Explore the portfolio",
        "href": "/products"
      }
    },
    "family": [],
    "disclaimers": [
      "Product use follows current manufacturer instructions."
    ],
    "faqTitle": "What to know about regenerative biologics.",
    "faqEyebrow": ""
  },
  {
    "slug": "interfyl",
    "href": "/products/interfyl",
    "name": "Interfyl",
    "title": "Interfyl | Albacete MedDev",
    "description": 'width=device-width, initial-scale=1" name="viewport"/><title>Interfyl | Albacete MedDev</title><meta content="A human connective tissue matrix with flowable and particulate formats.',
    "category": "non-sheet-skin-substitutes",
    "categoryLabel": "Matrices & wound coverings",
    "image": "interfyl",
    "identity": null,
    "reference": "ref-interfyl",
    "maker": "Celularity",
    "deck": "A human connective tissue matrix with flowable and particulate formats.",
    "cta": {
      "label": "Discuss this product",
      "href": "/contact?products=interfyl"
    },
    "source": {
      "label": "Source information",
      "href": "https://celularity.com/biomaterial-platform/",
      "external": true
    },
    "imageAlt": "Albacete MedDev",
    "imageCaption": "Manufacturer reference",
    "anchors": [
      {
        "href": "#overview",
        "label": "Product overview"
      },
      {
        "href": "#clinical-reading",
        "label": "Clinical reading"
      },
      {
        "href": "#resources",
        "label": "Next steps"
      }
    ],
    "specs": [
      {
        "k": "Material / technology",
        "v": "Human connective tissue matrix"
      },
      {
        "k": "Format",
        "v": "Flowable · particulate"
      },
      {
        "k": "Product source",
        "v": "Celularity"
      }
    ],
    "overview": {
      "eyebrow": "The Product In Context",
      "title": "A closer look.",
      "text": "Understand the material, explore the source information, and bring the right questions to your clinical review.",
      "cards": [
        {
          "title": "Material & format",
          "text": "A placental-derived human connective tissue matrix. Flowable and particulate presentations have different preparation and ordering details."
        },
        {
          "title": "Product review",
          "text": "Compare the selected format, amount, handling, and labeled use with your clinical requirements."
        },
        {
          "title": "Clinical resources",
          "text": "The evidence library brings available regulatory, product, and clinical references together for further review."
        }
      ]
    },
    "extras": [],
    "reading": {
      "eyebrow": "Clinical Reading",
      "title": "Follow the source.",
      "text": "Read the full reference to understand the population, application, and limits of the findings.",
      "library": {
        "label": "Explore the evidence library",
        "href": "/evidence/#ev-interfyl"
      },
      "references": [
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/37289347/",
          "meta": "Systematic review · 2023",
          "citation": "Ganesh P, Puranik S, Abhaya M, Misra P, Guruvigneshwari M, Daniel JI. Connective tissue matrices from placental disc for wound healing: mini-review. Biotechnol Lett. 2023;45(8):921-929."
        },
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/35849201/",
          "meta": "In vitro · 2022",
          "citation": "Mao Y, John N, Protzman NM, Kuehn A, Long D, Sivalenka R, Junka RA, Gosiewska A, Hariri RJ, Brigido SA. A decellularized flowable placental connective tissue matrix supports cellular functions of human tenocytes in vitro. J Exp Orthop. 2022;9(1):69."
        }
      ]
    },
    "next": {
      "eyebrow": "Your Next Step",
      "title": "Bring it into your practice’s conversation.",
      "text": "Ask for current instructions, available sizes, product training, and help reviewing operational requirements.",
      "cta": {
        "label": "Talk with our team",
        "href": "/contact?products=interfyl"
      }
    },
    "sections": [],
    "faq": [],
    "ctaBand": null,
    "family": [],
    "disclaimers": []
  },
  {
    "slug": "membrane-wrap-hydro",
    "href": "/products/membrane-wrap-hydro",
    "name": "Membrane Wrap Hydro",
    "title": "Membrane Wrap Hydro | Albacete MedDev",
    "description": 'width=device-width, initial-scale=1" name="viewport"/><title>Membrane Wrap Hydro | Albacete MedDev</title><meta content="A hydrated, dual-layer amniotic membrane that serves as a protective wound covering.',
    "category": "sheet-skin-substitutes",
    "categoryLabel": "Placental membranes",
    "image": "membrane-wrap-hydro-pack",
    "identity": null,
    "reference": "ref-membrane-wrap-hydro",
    "maker": "BioLab Holdings",
    "deck": "A hydrated, dual-layer amniotic membrane that serves as a protective wound covering.",
    "cta": {
      "label": "Discuss this product",
      "href": "/contact?products=membrane-wrap-hydro"
    },
    "source": {
      "label": "Source information",
      "href": "https://www.biolabholdings.com/products/membranes",
      "external": true
    },
    "imageAlt": "Membrane Wrap Hydro carton from BioLab Sciences with the hydrated membrane pouch",
    "imageCaption": "Packaging reference",
    "anchors": [
      {
        "href": "#overview",
        "label": "Product overview"
      },
      {
        "href": "#clinical-reading",
        "label": "Clinical reading"
      },
      {
        "href": "#resources",
        "label": "Next steps"
      }
    ],
    "specs": [
      {
        "k": "Material / technology",
        "v": "Amnion · amnion"
      },
      {
        "k": "Format",
        "v": "Hydrated membrane"
      },
      {
        "k": "Product source",
        "v": "BioLab Holdings"
      }
    ],
    "overview": {
      "eyebrow": "The Product In Context",
      "title": "A closer look.",
      "text": "Understand the material, explore the source information, and bring the right questions to your clinical review.",
      "cards": [
        {
          "title": "Material & format",
          "text": "Two layers of amnion in a hydrated format. Membrane Wrap Hydro is distinct from Membrane Wrap–Amniotic Hydro."
        },
        {
          "title": "Practice consideration",
          "text": "Review the current packaging, available sizes, handling instructions, and documentation requirements with your clinical team."
        },
        {
          "title": "Texas Medicaid resources",
          "text": "Ask us to review Q4290 for the specific plan, provider type, setting, and date of service. A fee-schedule entry does not establish coverage or guarantee payment."
        }
      ]
    },
    "extras": [
      {
        "eyebrow": "For Texas Practices",
        "title": "Start with the actual plan.",
        "text": "Review Q4290 using current TMHP resources, then verify benefits, authorization, documentation, and the patient’s plan. Managed care requirements and rates may differ from fee-for-service.",
        "links": [
          {
            "label": "TMHP fee schedules",
            "href": "https://public.tmhp.com/FeeSchedules/StaticFeeSchedule/FeeSchedules.aspx",
            "external": true
          },
          {
            "label": "Request a Texas review",
            "href": "/contact?products=membrane-wrap-hydro",
            "external": false
          }
        ]
      }
    ],
    "reading": {
      "eyebrow": "Clinical Reading",
      "title": "Follow the source.",
      "text": "Read the full reference to understand the population, application, and limits of the findings.",
      "library": {
        "label": "Explore the evidence library",
        "href": "/evidence/#ev-membrane-wrap-hydro"
      },
      "references": [
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/41649915/",
          "meta": "Case series · 2026",
          "citation": "Kapp D, Ferguson A, Denmark TK, Johnson J, Naqvi S, Carpenter S, Morrison J. Efficacy of a dual-layer pre-hydrated amniotic membrane allograft in the treatment of hard-to-heal wounds. Journal of Wound Care. 2026;35(2):150-161."
        },
        {
          "href": "https://clinicaltrials.gov/study/NCT07701590",
          "meta": "Registered trial · recruiting",
          "citation": "CAMPR-II: A Multicenter Hybrid Platform Trial Comparing Membrane Wrap-Hydro (Saline-Hydrated Dual-Layer Amniotic Membrane) vs Microlyte (Synthetic Resorbable Polymeric Wound Matrix) to a Matched Retrospective Control Cohort of Hard-to-Heal DFUs and VLUs"
        },
        {
          "href": "https://clinicaltrials.gov/study/NCT07089602",
          "meta": "Registered trial · recruiting",
          "citation": "BIOCAMP (see Membrane Wrap entry) - includes Membrane Wrap-Hydro arm"
        }
      ]
    },
    "next": {
      "eyebrow": "Your Next Step",
      "title": "Bring it into your practice’s conversation.",
      "text": "Ask for current instructions, available sizes, product training, and help reviewing operational requirements.",
      "cta": {
        "label": "Talk with our team",
        "href": "/contact?products=membrane-wrap-hydro"
      }
    },
    "sections": [],
    "faq": [],
    "ctaBand": null,
    "family": [],
    "disclaimers": []
  },
  {
    "slug": "membrane-wrap",
    "href": "/products/membrane-wrap",
    "name": "Membrane Wrap",
    "title": "Membrane Wrap | Albacete MedDev",
    "description": 'width=device-width, initial-scale=1" name="viewport"/><title>Membrane Wrap | Albacete MedDev</title><meta content="A dual-layer amniotic allograft used as a protective wound covering.',
    "category": "sheet-skin-substitutes",
    "categoryLabel": "Placental membranes",
    "image": "membrane-wrap-pack",
    "identity": null,
    "reference": "ref-membrane-wrap",
    "maker": "BioLab Holdings",
    "deck": "A dual-layer amniotic allograft used as a protective wound covering.",
    "cta": {
      "label": "Discuss this product",
      "href": "/contact?products=membrane-wrap"
    },
    "source": {
      "label": "Source information",
      "href": "https://www.biolabholdings.com/products/membranes",
      "external": true
    },
    "imageAlt": "Membrane Wrap carton from BioLab Sciences with the membrane in its pouch",
    "imageCaption": "Manufacturer reference",
    "anchors": [
      {
        "href": "#overview",
        "label": "Product overview"
      },
      {
        "href": "#clinical-reading",
        "label": "Clinical reading"
      },
      {
        "href": "#resources",
        "label": "Next steps"
      }
    ],
    "specs": [
      {
        "k": "Material / technology",
        "v": "Amnion · amnion"
      },
      {
        "k": "Format",
        "v": "Membrane sheet"
      },
      {
        "k": "Product source",
        "v": "BioLab Holdings"
      }
    ],
    "overview": {
      "eyebrow": "The Product In Context",
      "title": "A closer look.",
      "text": "Understand the material, explore the source information, and bring the right questions to your clinical review.",
      "cards": [
        {
          "title": "Material & format",
          "text": "Human amnion-amnion tissue allograft supplied as a membrane."
        },
        {
          "title": "Product family",
          "text": "Compare the standard membrane with the hydrated Hydro format and the amnion-chorion-amnion composition of Tri-Membrane Wrap."
        },
        {
          "title": "Before ordering",
          "text": "Review the current manufacturer size list and product-specific instructions. Format and availability vary across the family."
        }
      ]
    },
    "extras": [],
    "reading": {
      "eyebrow": "Clinical Reading",
      "title": "Follow the source.",
      "text": "Read the full reference to understand the population, application, and limits of the findings.",
      "library": {
        "label": "Explore the evidence library",
        "href": "/evidence/#ev-membrane-wrap"
      },
      "references": [
        {
          "href": "https://internationaljournaloftissuerepair.com/index.php/ijtr/article/view/80",
          "meta": "Retrospective comparative · 2026",
          "citation": "Cole W, Fife C, Miao H, Medley M. Global burden to local action: a pilot feasibility study of placental-based solutions for complex pressure ulcers using real-world evidence. International Journal of Tissue Repair. 2026;2(3)."
        },
        {
          "href": "https://clinicaltrials.gov/study/NCT06544564",
          "meta": "Registered trial · terminated",
          "citation": "A Multi-Center, Prospective, Randomized Trial Evaluating the Efficacy of Membrane Wrap, A Human Amniotic Membrane on Venous Leg Ulcers in an Elderly Population"
        },
        {
          "href": "https://clinicaltrials.gov/study/NCT07089602",
          "meta": "Registered trial · recruiting",
          "citation": "BIOCAMP: Trial Assessing the Efficacy of Human Placental Membrane Products (Tri-Membrane Wrap, Membrane Wrap, Membrane Wrap-Lite, Membrane Wrap-Hydro) and SOC vs SOC Alone in Nonhealing DFUs and VLUs"
        }
      ]
    },
    "next": {
      "eyebrow": "Your Next Step",
      "title": "Bring it into your practice’s conversation.",
      "text": "Ask for current instructions, available sizes, product training, and help reviewing operational requirements.",
      "cta": {
        "label": "Talk with our team",
        "href": "/contact?products=membrane-wrap"
      }
    },
    "sections": [],
    "faq": [],
    "ctaBand": null,
    "family": [],
    "disclaimers": []
  },
  {
    "slug": "microdoc",
    "href": "/products/microdoc",
    "name": "MicroDoc",
    "title": "MicroDoc | Albacete MedDev",
    "description": 'width=device-width, initial-scale=1" name="viewport"/><title>MicroDoc | Albacete MedDev</title><meta content="A compact single-use negative pressure wound therapy system.',
    "category": "conservative-wound-care",
    "categoryLabel": "Wound care devices",
    "image": "microdoc",
    "identity": null,
    "reference": "ref-microdoc",
    "maker": "Pensar Medical",
    "deck": "A compact single-use negative pressure wound therapy system.",
    "cta": {
      "label": "Discuss this product",
      "href": "/contact?products=microdoc"
    },
    "source": {
      "label": "Source information",
      "href": "https://pensarmedical.com/microdoc/",
      "external": true
    },
    "imageAlt": "Albacete MedDev",
    "imageCaption": "Manufacturer reference",
    "anchors": [
      {
        "href": "#overview",
        "label": "Product overview"
      },
      {
        "href": "#clinical-reading",
        "label": "Clinical reading"
      },
      {
        "href": "#resources",
        "label": "Next steps"
      }
    ],
    "specs": [
      {
        "k": "Material / technology",
        "v": "Negative pressure wound therapy"
      },
      {
        "k": "Format",
        "v": "Portable single-use device"
      },
      {
        "k": "Product source",
        "v": "Pensar Medical"
      }
    ],
    "overview": {
      "eyebrow": "The Product In Context",
      "title": "A closer look.",
      "text": "Understand the material, explore the source information, and bring the right questions to your clinical review.",
      "cards": [
        {
          "title": "Technology",
          "text": "A small portable control unit used with the matching dressing system."
        },
        {
          "title": "Practice planning",
          "text": "Plan patient instruction, dressing selection, follow-up, and troubleshooting using current manufacturer guidance."
        },
        {
          "title": "Product resources",
          "text": "The manufacturer provides specifications, manuals, and care resources. Review the current model and compatible components before use."
        }
      ]
    },
    "extras": [],
    "reading": {
      "eyebrow": "Clinical Reading",
      "title": "Follow the source.",
      "text": "Read the full reference to understand the population, application, and limits of the findings.",
      "library": {
        "label": "Explore the evidence library",
        "href": "/evidence/#ev-microdoc"
      },
      "references": [
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/37903665/",
          "meta": "Meta-analysis · 2023 · class",
          "citation": "James K, Glasswell A, Costa B. Single-use negative pressure wound therapy versus conventional dressings for the reduction of surgical site infections in closed surgical incisions: Systematic literature review and meta-analysis. Am J Surg. 2024 Feb;228:70-77."
        },
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/33609382/",
          "meta": "Meta-analysis · 2021 · class",
          "citation": "Saunders C, Nherera LM, Horner A, Trueman P. Single-use negative-pressure wound therapy versus conventional dressings for closed surgical incisions: systematic literature review and meta-analysis. BJS Open. 2021 Jan 8;5(1):zraa003."
        },
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/26313829/",
          "meta": "Meta-analysis · 2015 · class",
          "citation": "Semsarzadeh NN, Tadisina KK, Maddox J, Chopra K, Singh DP. Closed Incision Negative-Pressure Therapy Is Associated with Decreased Surgical-Site Infections: A Meta-Analysis. Plast Reconstr Surg. 2015 Sep;136(3):592-602."
        }
      ]
    },
    "next": {
      "eyebrow": "Your Next Step",
      "title": "Bring it into your practice’s conversation.",
      "text": "Ask for current instructions, available sizes, product training, and help reviewing operational requirements.",
      "cta": {
        "label": "Talk with our team",
        "href": "/contact?products=microdoc"
      }
    },
    "sections": [],
    "faq": [],
    "ctaBand": null,
    "family": [],
    "disclaimers": []
  },
  {
    "slug": "microlyte-painguard",
    "href": "/products/microlyte-painguard",
    "name": "Microlyte PainGuard",
    "title": "Microlyte PainGuard | Albacete MedDev",
    "description": 'width=device-width, initial-scale=1" name="viewport"/><title>Microlyte PainGuard | Albacete MedDev</title><meta content="A synthetic antimicrobial matrix with lidocaine, distinct from standard Microlyte.',
    "category": "non-sheet-skin-substitutes",
    "categoryLabel": "Matrices & wound coverings",
    "image": "microlyte-painguard",
    "identity": null,
    "reference": "ref-microlyte-painguard",
    "maker": "Imbed Biosciences · BioLab",
    "deck": "A synthetic antimicrobial matrix with lidocaine, distinct from standard Microlyte.",
    "cta": {
      "label": "Discuss this product",
      "href": "/contact?products=microlyte-painguard"
    },
    "source": {
      "label": "Source information",
      "href": "https://imbedbio.com/products/sam-painguard-with-lidocaine/",
      "external": true
    },
    "imageAlt": "Albacete MedDev",
    "imageCaption": "Manufacturer reference",
    "anchors": [
      {
        "href": "#overview",
        "label": "Product overview"
      },
      {
        "href": "#clinical-reading",
        "label": "Clinical reading"
      },
      {
        "href": "#resources",
        "label": "Next steps"
      }
    ],
    "specs": [
      {
        "k": "Material / technology",
        "v": "Synthetic polymers · silver · lidocaine"
      },
      {
        "k": "Format",
        "v": "Ultrathin matrix"
      },
      {
        "k": "Product source",
        "v": "Imbed Biosciences · BioLab"
      }
    ],
    "overview": {
      "eyebrow": "The Product In Context",
      "title": "A closer look.",
      "text": "Understand the material, explore the source information, and bring the right questions to your clinical review.",
      "cards": [
        {
          "title": "Material & format",
          "text": "Combines the synthetic antimicrobial matrix platform with lidocaine HCl."
        },
        {
          "title": "Product distinction",
          "text": "PainGuard contains lidocaine. Review contraindications, precautions, product size, and current labeling for the specific patient."
        },
        {
          "title": "Clinical resources",
          "text": "Review manufacturer information and the evidence library before establishing a practice protocol."
        }
      ]
    },
    "extras": [],
    "reading": {
      "eyebrow": "Clinical Reading",
      "title": "Follow the source.",
      "text": "Read the full reference to understand the population, application, and limits of the findings.",
      "library": {
        "label": "Explore the evidence library",
        "href": "/evidence/#ev-microlyte-painguard"
      },
      "references": [
        {
          "href": "https://imbedbio.com/products/sam-painguard-with-lidocaine/",
          "meta": "Product reference",
          "citation": "Review the product information, specifications, and available resources."
        }
      ]
    },
    "next": {
      "eyebrow": "Your Next Step",
      "title": "Bring it into your practice’s conversation.",
      "text": "Ask for current instructions, available sizes, product training, and help reviewing operational requirements.",
      "cta": {
        "label": "Talk with our team",
        "href": "/contact?products=microlyte-painguard"
      }
    },
    "sections": [],
    "faq": [],
    "ctaBand": null,
    "family": [],
    "disclaimers": []
  },
  {
    "slug": "microlyte",
    "href": "/products/microlyte",
    "name": "Microlyte SAM",
    "title": "Microlyte SAM | Albacete MedDev",
    "description": 'width=device-width, initial-scale=1" name="viewport"/><title>Microlyte SAM | Albacete MedDev</title><meta content="A fully synthetic antimicrobial matrix that conforms to the wound surface.',
    "category": "non-sheet-skin-substitutes",
    "categoryLabel": "Matrices & wound coverings",
    "image": "microlyte-pack",
    "identity": null,
    "reference": "ref-microlyte",
    "maker": "Imbed Biosciences · BioLab",
    "deck": "A fully synthetic antimicrobial matrix that conforms to the wound surface.",
    "cta": {
      "label": "Discuss this product",
      "href": "/contact?products=microlyte"
    },
    "source": {
      "label": "Source information",
      "href": "https://imbedbio.com/products/microlyte/",
      "external": true
    },
    "imageAlt": "Microlyte Matrix navy carton from Imbed Biosciences with its foil pouch",
    "imageCaption": "Manufacturer reference",
    "anchors": [
      {
        "href": "#overview",
        "label": "Product overview"
      },
      {
        "href": "#clinical-reading",
        "label": "Clinical reading"
      },
      {
        "href": "#resources",
        "label": "Next steps"
      }
    ],
    "specs": [
      {
        "k": "Material / technology",
        "v": "Synthetic polymers · silver"
      },
      {
        "k": "Format",
        "v": "Ultrathin matrix"
      },
      {
        "k": "Product source",
        "v": "Imbed Biosciences · BioLab"
      }
    ],
    "overview": {
      "eyebrow": "The Product In Context",
      "title": "A closer look.",
      "text": "Understand the material, explore the source information, and bring the right questions to your clinical review.",
      "cards": [
        {
          "title": "Material & format",
          "text": "A bioresorbable synthetic polymer matrix containing ionic and metallic silver."
        },
        {
          "title": "Clinical review",
          "text": "Manufacturer labeling covers several chronic, surgical, and traumatic wound categories. Review the exact indications and current instructions."
        },
        {
          "title": "Evidence & use",
          "text": "Separate laboratory antimicrobial findings from clinical outcomes. The evidence library links the available product-specific research."
        }
      ]
    },
    "extras": [],
    "reading": {
      "eyebrow": "Clinical Reading",
      "title": "Follow the source.",
      "text": "Read the full reference to understand the population, application, and limits of the findings.",
      "library": {
        "label": "Explore the evidence library",
        "href": "/evidence/#ev-microlyte-sam"
      },
      "references": [
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/37890580/",
          "meta": "Case series · 2023",
          "citation": "Carrillo AJ, Mancuso ML, Maxwell EA. Management of open wounds in dogs using a bioresorbable polymeric wound matrix: 14 Cases (2019-2021). Top Companion Anim Med. 2023 Oct 27;56-57:100825."
        },
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/33465043/",
          "meta": "Case series · 2020",
          "citation": "Manning SW, Humphrey DA, Shillinglaw WR, Crawford E, Pranami G, Agarwal A, Schurr MJ. Efficacy of a Bioresorbable Matrix in Healing Complex Chronic Wounds: An Open-Label Prospective Pilot Study. Wounds. 2020 Nov;32(11):309-318."
        },
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/33827167/",
          "meta": "Animal study · 2021",
          "citation": "Ang J, Pierezan F, Kim S, Heckman TI, Sebastiao FA, Yazdi Z, Abdelrazek SMR, Soto E. Use of Topical Treatments and Effects of Water Temperature on Wound Healing in Common Carp. J Zoo Wildl Med. 2021 Apr;52(1):103-116."
        }
      ]
    },
    "next": {
      "eyebrow": "Your Next Step",
      "title": "Bring it into your practice’s conversation.",
      "text": "Ask for current instructions, available sizes, product training, and help reviewing operational requirements.",
      "cta": {
        "label": "Talk with our team",
        "href": "/contact?products=microlyte"
      }
    },
    "sections": [],
    "faq": [],
    "ctaBand": null,
    "family": [],
    "disclaimers": []
  },
  {
    "slug": "myriad-matrix",
    "href": "/products/myriad-matrix",
    "name": "Myriad Matrix",
    "title": "Myriad Matrix | Albacete MedDev",
    "description": 'width=device-width, initial-scale=1" name="viewport"/><title>Myriad Matrix | Albacete MedDev</title><meta content="An extracellular matrix bioscaffold available in multiple sheet configurations.',
    "category": "non-sheet-skin-substitutes",
    "categoryLabel": "Matrices & wound coverings",
    "image": "myriad-matrix",
    "identity": null,
    "reference": "ref-myriad-matrix",
    "maker": "AROA Biosurgery",
    "deck": "An extracellular matrix bioscaffold available in multiple sheet configurations.",
    "cta": {
      "label": "Discuss this product",
      "href": "/contact?products=myriad-matrix"
    },
    "source": {
      "label": "Source information",
      "href": "https://aroa.com/product/myriad-matrix-ecm/",
      "external": true
    },
    "imageAlt": "Albacete MedDev",
    "imageCaption": "Manufacturer reference",
    "anchors": [
      {
        "href": "#overview",
        "label": "Product overview"
      },
      {
        "href": "#clinical-reading",
        "label": "Clinical reading"
      },
      {
        "href": "#resources",
        "label": "Next steps"
      }
    ],
    "specs": [
      {
        "k": "Material / technology",
        "v": "Ovine extracellular matrix"
      },
      {
        "k": "Format",
        "v": "Perforated matrix sheet"
      },
      {
        "k": "Product source",
        "v": "AROA Biosurgery"
      }
    ],
    "overview": {
      "eyebrow": "The Product In Context",
      "title": "A closer look.",
      "text": "Understand the material, explore the source information, and bring the right questions to your clinical review.",
      "cards": [
        {
          "title": "Material & format",
          "text": "A soft tissue bioscaffold based on AROA ECM. Sheet formats include different layer counts and dimensions."
        },
        {
          "title": "Clinical scope",
          "text": "Manufacturer indications include soft tissue repair or reinforcement and management of a range of wounds. Review the exact product instructions."
        },
        {
          "title": "Ordering",
          "text": "Confirm the selected formulation, layer count, and size. Availability through our supplier network may differ from the full manufacturer catalog."
        }
      ]
    },
    "extras": [],
    "reading": {
      "eyebrow": "Clinical Reading",
      "title": "Follow the source.",
      "text": "Read the full reference to understand the population, application, and limits of the findings.",
      "library": {
        "label": "Explore the evidence library",
        "href": "/evidence/"
      },
      "references": [
        {
          "href": "https://aroa.com/product/myriad-matrix-ecm/",
          "meta": "Product reference",
          "citation": "Review the product information, specifications, and available resources."
        }
      ]
    },
    "next": {
      "eyebrow": "Your Next Step",
      "title": "Bring it into your practice’s conversation.",
      "text": "Ask for current instructions, available sizes, product training, and help reviewing operational requirements.",
      "cta": {
        "label": "Talk with our team",
        "href": "/contact?products=myriad-matrix"
      }
    },
    "sections": [],
    "faq": [],
    "ctaBand": null,
    "family": [],
    "disclaimers": []
  },
  {
    "slug": "palingen",
    "href": "/products/palingen",
    "name": "PalinGen Membrane",
    "title": "PalinGen Membrane | Albacete MedDev",
    "description": 'width=device-width, initial-scale=1" name="viewport"/><title>PalinGen Membrane | Albacete MedDev</title><meta content="A chorion-free amniotic tissue allograft used as a biological wound covering.',
    "category": "sheet-skin-substitutes",
    "categoryLabel": "Placental membranes",
    "image": "palingen",
    "identity": null,
    "reference": "ref-palingen",
    "maker": "Amnio Technology",
    "deck": "A chorion-free amniotic tissue allograft used as a biological wound covering.",
    "cta": {
      "label": "Discuss this product",
      "href": "/contact?products=palingen"
    },
    "source": {
      "label": "Source information",
      "href": "https://amniotechnology.com/index.php/palingen-membrane/",
      "external": true
    },
    "imageAlt": "Albacete MedDev",
    "imageCaption": "Manufacturer reference",
    "anchors": [
      {
        "href": "#overview",
        "label": "Product overview"
      },
      {
        "href": "#clinical-reading",
        "label": "Clinical reading"
      },
      {
        "href": "#resources",
        "label": "Next steps"
      }
    ],
    "specs": [
      {
        "k": "Material / technology",
        "v": "Human amnion"
      },
      {
        "k": "Format",
        "v": "Air-dried membrane"
      },
      {
        "k": "Product source",
        "v": "Amnio Technology"
      }
    ],
    "overview": {
      "eyebrow": "The Product In Context",
      "title": "A closer look.",
      "text": "Understand the material, explore the source information, and bring the right questions to your clinical review.",
      "cards": [
        {
          "title": "Material & format",
          "text": "Human amnion supplied as an air-dried, sterile membrane. The manufacturer describes it as resorbable and chorion-free."
        },
        {
          "title": "Ordering",
          "text": "Rectangular and circular formats are listed. Confirm the exact membrane variant; dual-layer and hydrated products have their own specifications."
        },
        {
          "title": "Clinical review",
          "text": "Review current instructions for the selected product and the intended wound application."
        }
      ]
    },
    "extras": [],
    "reading": {
      "eyebrow": "Clinical Reading",
      "title": "Follow the source.",
      "text": "Read the full reference to understand the population, application, and limits of the findings.",
      "library": {
        "label": "Explore the evidence library",
        "href": "/evidence/"
      },
      "references": [
        {
          "href": "https://amniotechnology.com/index.php/palingen-membrane/",
          "meta": "Product reference",
          "citation": "Review the product information, specifications, and available resources."
        }
      ]
    },
    "next": {
      "eyebrow": "Your Next Step",
      "title": "Bring it into your practice’s conversation.",
      "text": "Ask for current instructions, available sizes, product training, and help reviewing operational requirements.",
      "cta": {
        "label": "Talk with our team",
        "href": "/contact?products=palingen"
      }
    },
    "sections": [],
    "faq": [],
    "ctaBand": null,
    "family": [],
    "disclaimers": []
  },
  {
    "slug": "palisade",
    "href": "/products/palisade",
    "name": "Palisade",
    "title": "Palisade | Albacete MedDev",
    "description": 'width=device-width, initial-scale=1" name="viewport"/><title>Palisade | Albacete MedDev</title><meta content="A dual-membrane placental allograft with amnion and chorion in one wound covering.',
    "category": "sheet-skin-substitutes",
    "categoryLabel": "Placental membranes",
    "image": "palisade-pack",
    "identity": null,
    "reference": null,
    "maker": "Sequence LifeScience",
    "deck": "A dual-membrane placental allograft with amnion and chorion in one wound covering.",
    "cta": {
      "label": "Discuss this product",
      "href": "/contact?products=palisade"
    },
    "source": {
      "label": "Source information",
      "href": "https://sequencelifesci.com/palisade-2/",
      "external": true
    },
    "imageAlt": "Palisade DM Matrix carton and foil pouch, Nvision Biomedical Technologies",
    "imageCaption": "Explore the source information and request current product documentation.",
    "anchors": [
      {
        "href": "#overview",
        "label": "Product overview"
      },
      {
        "href": "#clinical-reading",
        "label": "Clinical reading"
      },
      {
        "href": "#resources",
        "label": "Next steps"
      }
    ],
    "specs": [
      {
        "k": "Material / technology",
        "v": "Amnion · chorion"
      },
      {
        "k": "Format",
        "v": "Dehydrated membrane"
      },
      {
        "k": "Product source",
        "v": "Sequence LifeScience"
      }
    ],
    "overview": {
      "eyebrow": "The Product In Context",
      "title": "A closer look.",
      "text": "Understand the material, explore the source information, and bring the right questions to your clinical review.",
      "cards": [
        {
          "title": "Material & format",
          "text": "A dehydrated placental membrane combining amnion and chorion. This composition differs from single-layer Sentry and full-thickness Activate."
        },
        {
          "title": "Size options",
          "text": "The manufacturer lists 2 × 2, 2 × 4, 4 × 4, and 4 × 8 cm formats."
        },
        {
          "title": "Before use",
          "text": "Review the product-specific package insert for donor screening, handling, and application information."
        }
      ]
    },
    "extras": [],
    "reading": {
      "eyebrow": "Clinical Reading",
      "title": "Follow the source.",
      "text": "Read the full reference to understand the population, application, and limits of the findings.",
      "library": {
        "label": "Explore the evidence library",
        "href": "/evidence/#ev-palisade"
      },
      "references": [
        {
          "href": "https://clinicaltrials.gov/study/NCT07086443",
          "meta": "Registered trial · recruiting",
          "citation": "RENEW: A Multicenter, Prospective, Randomized Controlled Modified Platform Trial Evaluating Placental Derived Allografts and Standard of Care in the Treatment of Nonhealing Diabetic Foot Ulcers Using Matched Controls"
        },
        {
          "href": "https://clinicaltrials.gov/study/NCT07665268",
          "meta": "Registered trial · recruiting",
          "citation": "RESTORE: A Multicenter, Prospective, Modified Platform Trial Evaluating Several CAMPs and SOC Versus Matched SOC Controls in Nonhealing Pressure Ulcers"
        }
      ]
    },
    "next": {
      "eyebrow": "Your Next Step",
      "title": "Bring it into your practice’s conversation.",
      "text": "Ask for current instructions, available sizes, product training, and help reviewing operational requirements.",
      "cta": {
        "label": "Talk with our team",
        "href": "/contact?products=palisade"
      }
    },
    "sections": [],
    "faq": [],
    "ctaBand": null,
    "family": [],
    "disclaimers": []
  },
  {
    "slug": "sentry-sl",
    "href": "/products/sentry-sl",
    "name": "Sentry SL",
    "title": "Sentry SL | Albacete MedDev",
    "description": 'width=device-width, initial-scale=1" name="viewport"/><title>Sentry SL | Albacete MedDev</title><meta content="A single-layer amniotic membrane allograft designed as a biological wound covering.',
    "category": "sheet-skin-substitutes",
    "categoryLabel": "Placental membranes",
    "image": "sentry-sl-pack",
    "identity": null,
    "reference": null,
    "maker": "Sequence LifeScience",
    "deck": "A single-layer amniotic membrane allograft designed as a biological wound covering.",
    "cta": {
      "label": "Discuss this product",
      "href": "/contact?products=sentry-sl"
    },
    "source": {
      "label": "Source information",
      "href": "https://sequencelifesci.com/sentry-2/",
      "external": true
    },
    "imageAlt": "Sentry SL Matrix carton and foil pouch, Sequence LifeScience",
    "imageCaption": "Explore the source information and request current product documentation.",
    "anchors": [
      {
        "href": "#overview",
        "label": "Product overview"
      },
      {
        "href": "#clinical-reading",
        "label": "Clinical reading"
      },
      {
        "href": "#resources",
        "label": "Next steps"
      }
    ],
    "specs": [
      {
        "k": "Material / technology",
        "v": "Single-layer amnion"
      },
      {
        "k": "Format",
        "v": "Dehydrated membrane"
      },
      {
        "k": "Product source",
        "v": "Sequence LifeScience"
      }
    ],
    "overview": {
      "eyebrow": "The Product In Context",
      "title": "A closer look.",
      "text": "Understand the material, explore the source information, and bring the right questions to your clinical review.",
      "cards": [
        {
          "title": "Material & format",
          "text": "Dehydrated human amnion in a thin single-layer format."
        },
        {
          "title": "Size options",
          "text": "The manufacturer lists 2 × 2, 2 × 4, 4 × 4, and 4 × 8 cm formats."
        },
        {
          "title": "Clinical review",
          "text": "Consider labeled use, the wound presentation, and the current instructions rather than selecting a product by layer count alone."
        }
      ]
    },
    "extras": [],
    "reading": {
      "eyebrow": "Clinical Reading",
      "title": "Follow the source.",
      "text": "Read the full reference to understand the population, application, and limits of the findings.",
      "library": {
        "label": "Explore the evidence library",
        "href": "/evidence/#ev-sentry-sl"
      },
      "references": [
        {
          "href": "https://clinicaltrials.gov/study/NCT07086443",
          "meta": "Registered trial · recruiting",
          "citation": "RENEW: A Multicenter, Prospective, Randomized Controlled Modified Platform Trial Evaluating Placental Derived Allografts and Standard of Care in the Treatment of Nonhealing Diabetic Foot Ulcers Using Matched Controls"
        },
        {
          "href": "https://clinicaltrials.gov/study/NCT07665268",
          "meta": "Registered trial · recruiting",
          "citation": "RESTORE: A Multicenter, Prospective, Modified Platform Trial Evaluating Several CAMPs and SOC Versus Matched SOC Controls in Nonhealing Pressure Ulcers"
        }
      ]
    },
    "next": {
      "eyebrow": "Your Next Step",
      "title": "Bring it into your practice’s conversation.",
      "text": "Ask for current instructions, available sizes, product training, and help reviewing operational requirements.",
      "cta": {
        "label": "Talk with our team",
        "href": "/contact?products=sentry-sl"
      }
    },
    "sections": [],
    "faq": [],
    "ctaBand": null,
    "family": [],
    "disclaimers": []
  },
  {
    "slug": "tri-membrane-wrap",
    "href": "/products/tri-membrane-wrap",
    "name": "Tri-Membrane Wrap",
    "title": "Tri-Membrane Wrap | Albacete MedDev",
    "description": 'width=device-width, initial-scale=1" name="viewport"/><title>Tri-Membrane Wrap | Albacete MedDev</title><meta content="A three-layer placental allograft for protective wound coverage.',
    "category": "sheet-skin-substitutes",
    "categoryLabel": "Placental membranes",
    "image": "tri-membrane-wrap-pack",
    "identity": null,
    "reference": "ref-tri-membrane-wrap",
    "maker": "BioLab Holdings",
    "deck": "A three-layer placental allograft for protective wound coverage.",
    "cta": {
      "label": "Discuss this product",
      "href": "/contact?products=tri-membrane-wrap"
    },
    "source": {
      "label": "Source information",
      "href": "https://www.biolabholdings.com/products/membranes",
      "external": true
    },
    "imageAlt": "Tri-Membrane Wrap carton from BioLab Sciences with the membrane in its pouch",
    "imageCaption": "Manufacturer reference",
    "anchors": [
      {
        "href": "#overview",
        "label": "Product overview"
      },
      {
        "href": "#clinical-reading",
        "label": "Clinical reading"
      },
      {
        "href": "#resources",
        "label": "Next steps"
      }
    ],
    "specs": [
      {
        "k": "Material / technology",
        "v": "Amnion · chorion · amnion"
      },
      {
        "k": "Format",
        "v": "Triple-layer membrane"
      },
      {
        "k": "Product source",
        "v": "BioLab Holdings"
      }
    ],
    "overview": {
      "eyebrow": "The Product In Context",
      "title": "A closer look.",
      "text": "Understand the material, explore the source information, and bring the right questions to your clinical review.",
      "cards": [
        {
          "title": "Material & format",
          "text": "Combines amnion, chorion, and amnion in a membrane sheet."
        },
        {
          "title": "Clinical consideration",
          "text": "Layer composition is one product characteristic. Patient assessment, labeled use, handling, and available evidence also inform selection."
        },
        {
          "title": "Before ordering",
          "text": "Confirm the current size list and product-specific instructions with the manufacturer or our team."
        }
      ]
    },
    "extras": [],
    "reading": {
      "eyebrow": "Clinical Reading",
      "title": "Follow the source.",
      "text": "Read the full reference to understand the population, application, and limits of the findings.",
      "library": {
        "label": "Explore the evidence library",
        "href": "/evidence/#ev-tri-membrane-wrap"
      },
      "references": [
        {
          "href": "https://clinicaltrials.gov/study/NCT07046767",
          "meta": "Registered trial · recruiting",
          "citation": "CAMP RWE: Tri-Layer Amnion Graft (BioLab Tri-Membrane Wrap) vs Single-Layer Amnion Graft (Membrane Wrap-Lite) vs Matched Retrospective Control, Hard-to-Heal DFUs/VLUs"
        },
        {
          "href": "https://clinicaltrials.gov/study/NCT07089602",
          "meta": "Registered trial · recruiting",
          "citation": "BIOCAMP (see Membrane Wrap entry) - includes Tri-Membrane Wrap arm"
        },
        {
          "href": "https://clinicaltrials.gov/study/NCT07364630",
          "meta": "Registered trial · recruiting",
          "citation": "Multi-Platform Trial of Human Placental Membrane Products (includes Tri-Membrane Wrap arm)"
        }
      ]
    },
    "next": {
      "eyebrow": "Your Next Step",
      "title": "Bring it into your practice’s conversation.",
      "text": "Ask for current instructions, available sizes, product training, and help reviewing operational requirements.",
      "cta": {
        "label": "Talk with our team",
        "href": "/contact?products=tri-membrane-wrap"
      }
    },
    "sections": [],
    "faq": [],
    "ctaBand": null,
    "family": [],
    "disclaimers": []
  },
  {
    "slug": "ultramist",
    "href": "/products/ultramist",
    "name": "UltraMIST",
    "title": "UltraMIST | Albacete MedDev",
    "description": 'width=device-width, initial-scale=1" name="viewport"/><title>UltraMIST | Albacete MedDev</title><meta content="Ultrasound therapy delivered through a non-contact saline mist.',
    "category": "conservative-wound-care",
    "categoryLabel": "Wound care devices",
    "image": "ultramist",
    "identity": null,
    "reference": "ref-ultramist",
    "maker": "SANUWAVE",
    "deck": "Ultrasound therapy delivered through a non-contact saline mist.",
    "cta": {
      "label": "Discuss this product",
      "href": "/contact?products=ultramist"
    },
    "source": {
      "label": "Source information",
      "href": "https://sanuwave.com/products/ultramist/",
      "external": true
    },
    "imageAlt": "Albacete MedDev",
    "imageCaption": "Manufacturer reference",
    "anchors": [
      {
        "href": "#overview",
        "label": "Product overview"
      },
      {
        "href": "#clinical-reading",
        "label": "Clinical reading"
      },
      {
        "href": "#resources",
        "label": "Next steps"
      }
    ],
    "specs": [
      {
        "k": "Material / technology",
        "v": "Low-frequency ultrasound"
      },
      {
        "k": "Format",
        "v": "Non-contact device"
      },
      {
        "k": "Product source",
        "v": "SANUWAVE"
      }
    ],
    "overview": {
      "eyebrow": "The Product In Context",
      "title": "A closer look.",
      "text": "Understand the material, explore the source information, and bring the right questions to your clinical review.",
      "cards": [
        {
          "title": "Technology",
          "text": "A low-frequency ultrasound system using non-contact fluid delivery to the treatment site."
        },
        {
          "title": "Practice planning",
          "text": "Consider staff training, treatment setup, disposable supplies, and workflow alongside clinical suitability."
        },
        {
          "title": "Resources",
          "text": "The manufacturer provides instructions for use and published references. Review product-specific patient considerations and contraindications."
        }
      ]
    },
    "extras": [],
    "reading": {
      "eyebrow": "Clinical Reading",
      "title": "Follow the source.",
      "text": "Read the full reference to understand the population, application, and limits of the findings.",
      "library": {
        "label": "Explore the evidence library",
        "href": "/evidence/#ev-ultramist"
      },
      "references": [
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/22184750/",
          "meta": "Meta-analysis · 2011",
          "citation": "Voigt J, Wendelken M, Driver V, Alvarez OM. Low-frequency ultrasound (20-40 kHz) as an adjunctive therapy for chronic wound healing: a systematic review of the literature and meta-analysis of eight randomized controlled trials. Int J Low Extrem Wounds. 2011 Dec;10(4):190-199."
        },
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/21649783/",
          "meta": "Meta-analysis · 2011",
          "citation": "Driver VR, Yao M, Miller CJ. Noncontact low-frequency ultrasound therapy in the treatment of chronic wounds: a meta-analysis. Wound Repair Regen. 2011 Jul-Aug;19(4):475-480."
        },
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/32787600/",
          "meta": "Systematic review · 2020",
          "citation": "Kotronis G, Vas PRJ. Ultrasound Devices to Treat Chronic Wounds: The Current Level of Evidence. Int J Low Extrem Wounds. 2020 Dec;19(4):341-349."
        }
      ]
    },
    "next": {
      "eyebrow": "Your Next Step",
      "title": "Bring it into your practice’s conversation.",
      "text": "Ask for current instructions, available sizes, product training, and help reviewing operational requirements.",
      "cta": {
        "label": "Talk with our team",
        "href": "/contact?products=ultramist"
      }
    },
    "sections": [],
    "faq": [],
    "ctaBand": null,
    "family": [],
    "disclaimers": []
  },
  {
    "slug": "wholesaler",
    "href": "/products/wholesaler",
    "name": "Medical supplies",
    "title": "Wholesale Medical Supplies, HCPCS-Coded | Albacete MedDev",
    "description": "FDA-approved wound care supplies at wholesale pricing — foam, alginate, collagen, antimicrobials, compression. Ships HCPCS-coded and LCD-aligned.",
    "category": "practice-products",
    "categoryLabel": "Across the practice",
    "image": "wholesaler",
    "identity": null,
    "reference": null,
    "maker": "Practice supply support",
    "deck": "Bring your facility’s supply requirements into one practical conversation.",
    "cta": {
      "label": "Discuss this product",
      "href": "/contact?products=wholesaler"
    },
    "source": {
      "label": "Clinical & regulatory resources",
      "href": "/evidence/",
      "external": false
    },
    "imageAlt": "Dressings, gauze, tape, and gloves neatly arranged on a counter",
    "imageCaption": "Product use follows current manufacturer instructions.",
    "anchors": [
      {
        "href": "#clinical-section-1",
        "label": "A compliance-ready supply chain."
      },
      {
        "href": "#clinical-section-2",
        "label": "What's in the catalog."
      },
      {
        "href": "#faq",
        "label": "What to know about wholesale distribution."
      }
    ],
    "specs": [],
    "overview": null,
    "extras": [],
    "reading": null,
    "next": null,
    "sections": [
      {
        "id": "clinical-section-1",
        "eyebrow": "Wholesale advantages",
        "title": "A compliance-ready supply chain.",
        "text": "Every product in our wholesale catalog is FDA-approved, HCPCS-coded, and supported with documentation guidance that aligns with CMS coverage policies.",
        "items": [
          {
            "title": "Wholesale Pricing",
            "text": "Competitive wholesale pricing on the full catalog of medical supplies — reducing procurement costs for hospitals and surgical centers without compromising on FDA-approved quality or sourcing standards."
          },
          {
            "title": "HCPCS Coded Per Product",
            "text": "Every product ships with correct HCPCS codes assigned — enabling hospitals and surgical centers to submit accurate claims for reimbursement from Medicare, Medicaid, and commercial payers."
          },
          {
            "title": "Compliance Documentation",
            "text": "Coverage policy guidance that supports successful reimbursement — aligned with LCD/NCD requirements and medical necessity criteria. No guesswork on coding, no compliance gaps in your documentation."
          }
        ]
      },
      {
        "id": "clinical-section-2",
        "eyebrow": "Catalog scope",
        "title": "What's in the catalog.",
        "text": "Six categories, sourced from established manufacturers — every product FDA-approved and shipped with its HCPCS code assigned.",
        "items": [
          {
            "title": "Advanced Wound Dressings",
            "text": "Foam, alginate, collagen, and antimicrobial dressings for moderate-to-heavy exudate and at-risk wounds."
          },
          {
            "title": "Skin Substitutes & Allografts",
            "text": "Amniotic allografts and skin substitutes with coverage-aligned documentation for chronic wound escalation."
          },
          {
            "title": "Compression Therapy",
            "text": "Multi-layer systems and compression supplies for venous leg ulcer pathways and edema management."
          },
          {
            "title": "Surgical Preparation",
            "text": "Prep products and perioperative supplies for surgical centers — sourced to spec, delivered on schedule."
          },
          {
            "title": "Post-Op Wound Management",
            "text": "Incision care and post-operative management supplies that bridge the surgical and outpatient settings."
          },
          {
            "title": "Conservative Wound Care",
            "text": "The daily staples — gauzes, wraps, cleansers, and barrier products that every wound care clinic runs on."
          }
        ]
      }
    ],
    "faq": [
      {
        "q": "What does wholesale mean for our facility?",
        "a": "As a medical supplies wholesaler, Albacete MedDev connects hospitals and surgical centers directly with FDA-approved wound care products at wholesale pricing. Your facility receives the same quality supplies used in leading healthcare institutions — through a streamlined procurement channel with competitive pricing, proper HCPCS coding for every product, and compliance-ready documentation that supports reimbursement from Medicare, Medicaid, and commercial payers."
      },
      {
        "q": "How does HCPCS support reimbursement?",
        "a": "Every medical supply in our wholesale catalog is assigned its correct HCPCS (Healthcare Common Procedure Coding System) code. These codes are essential for billing — they allow hospitals and surgical centers to submit claims for reimbursement to CMS and commercial payers. When paired with proper documentation of medical necessity, correct HCPCS coding ensures your facility can recover costs for the supplies used in patient care, subject to the applicable LCDs and NCDs for each product category."
      },
      {
        "q": "Who qualifies for wholesale access?",
        "a": "Wholesale distribution is available to hospitals, surgical centers, wound care clinics, and qualified healthcare organizations. Our catalog includes advanced wound dressings (foam, alginate, collagen, antimicrobial), skin substitutes and amniotic allografts, compression therapy supplies, surgical preparation products, post-operative wound management supplies, and conservative wound care staples. All products meet FDA regulatory requirements and are sourced from established manufacturers."
      }
    ],
    "ctaBand": {
      "title": "Access FDA-approved supplies at wholesale.",
      "text": "A 30-minute consultation to walk through catalog access, HCPCS coding, and reimbursement alignment.",
      "primary": {
        "label": "Schedule a consultation",
        "href": "/contact"
      },
      "secondary": {
        "label": "Explore the portfolio",
        "href": "/products"
      }
    },
    "family": [],
    "disclaimers": [
      "Product use follows current manufacturer instructions."
    ],
    "faqTitle": "What to know about wholesale distribution.",
    "faqEyebrow": ""
  },
  {
    "slug": "xcell-amnio-matrix",
    "href": "/products/xcell-amnio-matrix",
    "name": "XCell Amnio Matrix",
    "title": "XCell Amnio Matrix | Albacete MedDev",
    "description": 'width=device-width, initial-scale=1" name="viewport"/><title>XCell Amnio Matrix | Albacete MedDev</title><meta content="A lyophilized amniotic membrane wound covering, available through New Horizon Medical Solutions.',
    "category": "sheet-skin-substitutes",
    "categoryLabel": "Placental membranes",
    "image": "xcell-amnio-matrix",
    "identity": null,
    "reference": "ref-xcell-amnio-matrix",
    "maker": "Precise Bioscience · New Horizon",
    "deck": "A lyophilized amniotic membrane wound covering, available through New Horizon Medical Solutions.",
    "cta": {
      "label": "Discuss this product",
      "href": "/contact?products=xcell-amnio-matrix"
    },
    "source": {
      "label": "Source information",
      "href": "https://nhmedical.com/products/",
      "external": true
    },
    "imageAlt": "Albacete MedDev",
    "imageCaption": "Manufacturer reference",
    "anchors": [
      {
        "href": "#overview",
        "label": "Product overview"
      },
      {
        "href": "#clinical-reading",
        "label": "Clinical reading"
      },
      {
        "href": "#resources",
        "label": "Next steps"
      }
    ],
    "specs": [
      {
        "k": "Material / technology",
        "v": "Human amniotic membrane"
      },
      {
        "k": "Format",
        "v": "Lyophilized membrane"
      },
      {
        "k": "Product source",
        "v": "Precise Bioscience · New Horizon"
      }
    ],
    "overview": {
      "eyebrow": "The Product In Context",
      "title": "A closer look.",
      "text": "Understand the material, explore the source information, and bring the right questions to your clinical review.",
      "cards": [
        {
          "title": "Material & format",
          "text": "A dry amniotic membrane with a flexible, opaque appearance described in the product literature."
        },
        {
          "title": "Product identity",
          "text": "XCell Amnio Matrix and Xcellerate have different product names and ordering details. Confirm the exact product and size on every order."
        },
        {
          "title": "Documentation",
          "text": "Request the current package insert, size list, and handling information before use."
        }
      ]
    },
    "extras": [],
    "reading": {
      "eyebrow": "Clinical Reading",
      "title": "Follow the source.",
      "text": "Read the full reference to understand the population, application, and limits of the findings.",
      "library": {
        "label": "Explore the evidence library",
        "href": "/evidence/#ev-xcell-amnio-matrix"
      },
      "references": [
        {
          "href": "https://clinicaltrials.gov/study/NCT07116174",
          "meta": "Registered trial · recruiting",
          "citation": "A Prospective, Multi-center, Randomized Controlled Clinical Trial Evaluating the Effectiveness and Safety of Xcell Amnio Matrix (XAM) as Adjunct to SOC Compared to SOC Alone in the Management of Diabetic Foot Ulcers"
        }
      ]
    },
    "next": {
      "eyebrow": "Your Next Step",
      "title": "Bring it into your practice’s conversation.",
      "text": "Ask for current instructions, available sizes, product training, and help reviewing operational requirements.",
      "cta": {
        "label": "Talk with our team",
        "href": "/contact?products=xcell-amnio-matrix"
      }
    },
    "sections": [],
    "faq": [],
    "ctaBand": null,
    "family": [],
    "disclaimers": []
  },
  {
    "slug": "xcellistem",
    "href": "/products/xcellistem",
    "name": "XCelliStem",
    "title": "XCelliStem | Albacete MedDev",
    "description": 'width=device-width, initial-scale=1" name="viewport"/><title>XCelliStem | Albacete MedDev</title><meta content="A particulate wound product based on a blend of extracellular matrix materials.',
    "category": "non-sheet-skin-substitutes",
    "categoryLabel": "Matrices & wound coverings",
    "image": "xcellistem-pack",
    "identity": null,
    "reference": "ref-xcellistem",
    "maker": "StemSys",
    "deck": "A particulate wound product based on a blend of extracellular matrix materials.",
    "cta": {
      "label": "Discuss this product",
      "href": "/contact?products=xcellistem"
    },
    "source": {
      "label": "Source information",
      "href": "https://www.stemsysbio.com/our-products",
      "external": true
    },
    "imageAlt": "XCelliStem Wound Powder jar and Tyvek pouch from Stemsys",
    "imageCaption": "Manufacturer reference",
    "anchors": [
      {
        "href": "#overview",
        "label": "Product overview"
      },
      {
        "href": "#clinical-reading",
        "label": "Clinical reading"
      },
      {
        "href": "#resources",
        "label": "Next steps"
      }
    ],
    "specs": [
      {
        "k": "Material / technology",
        "v": "Multi-tissue extracellular matrix"
      },
      {
        "k": "Format",
        "v": "Wound powder"
      },
      {
        "k": "Product source",
        "v": "StemSys"
      }
    ],
    "overview": {
      "eyebrow": "The Product In Context",
      "title": "A closer look.",
      "text": "Understand the material, explore the source information, and bring the right questions to your clinical review.",
      "cards": [
        {
          "title": "Material & format",
          "text": "A fine wound powder produced using the StemSys multi-tissue platform."
        },
        {
          "title": "Clinical review",
          "text": "Review the product-specific indications and application instructions before considering its place in the care pathway."
        },
        {
          "title": "Evidence",
          "text": "Read the available clinical reports in context; case reports and case series answer different questions from comparative trials."
        }
      ]
    },
    "extras": [],
    "reading": {
      "eyebrow": "Clinical Reading",
      "title": "Follow the source.",
      "text": "Read the full reference to understand the population, application, and limits of the findings.",
      "library": {
        "label": "Explore the evidence library",
        "href": "/evidence/#ev-xcellistem"
      },
      "references": [
        {
          "href": "https://clinicalcasereportsjournal.com/article/1000257/case-reports-of-clinical-and-histologic-wound-healing-response-with-multi-tissue-extracellular-matrix-with-cost-analysis-compared-to-negative-pressure-wound-therapy",
          "meta": "Retrospective comparative · 2023",
          "citation": "Diaz-Valadez FD, Griffin K, Sasse KC. Case Reports of Clinical and Histologic Wound Healing Response with Multi-Tissue Extracellular Matrix with Cost Analysis Compared to Negative Pressure Wound Therapy. Clin Case Rep J. 2023;4(2):1-7."
        },
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/42564952/",
          "meta": "Case series · 2026",
          "citation": "Krasner H, Khorsandi J, Dillon D, Iftekhar N, MacDavid J. Utilization of a Novel Porcine Extracellular Matrix as a Dermal Template for Skin Graft. Eplasty. 2026;26:e5."
        },
        {
          "href": "https://pubmed.ncbi.nlm.nih.gov/42466235/",
          "meta": "Case series · 2026",
          "citation": "Khorsandi J, Olcott J, Iftekhar N, Franzoni D, MacDavid J. Novel Porcine Xenograft as a Salvage Strategy for Lower Extremity Wound Reconstruction Following Free Flap Failure. Plast Reconstr Surg Glob Open. 2026;14(7):e7950."
        }
      ]
    },
    "next": {
      "eyebrow": "Your Next Step",
      "title": "Bring it into your practice’s conversation.",
      "text": "Ask for current instructions, available sizes, product training, and help reviewing operational requirements.",
      "cta": {
        "label": "Talk with our team",
        "href": "/contact?products=xcellistem"
      }
    },
    "sections": [],
    "faq": [],
    "ctaBand": null,
    "family": [],
    "disclaimers": []
  }
];
const PRODUCT_BY_SLUG = Object.fromEntries(PRODUCTS.map((p) => [p.slug, p]));
const PRODUCTS_HUB = {
  "eyebrow": "THE ALBACETE PORTFOLIO",
  "title": "Get to know your options.",
  "text": "Different materials. Different approaches. Explore the details that matter to your practice."
};
const CATEGORIES = [
  {
    "id": "sheet-skin-substitutes",
    "label": "Placental membranes",
    "text": "Compare composition and format.",
    "members": [
      {
        "slug": "amchoplast",
        "href": "/products/amchoplast",
        "maker": "Cellution Biologics",
        "name": "AmchoPlast",
        "text": "A placental membrane wound covering with its amnion, intermediate layer, and chorion structure retained."
      },
      {
        "slug": "membrane-wrap-hydro",
        "href": "/products/membrane-wrap-hydro",
        "maker": "BioLab Holdings",
        "name": "Membrane Wrap Hydro",
        "text": "A hydrated, dual-layer amniotic membrane that serves as a protective wound covering."
      },
      {
        "slug": "activate",
        "href": "/products/activate",
        "maker": "Sequence LifeScience",
        "name": "Activate Matrix",
        "text": "A full-thickness placental-derived allograft for use as a wound covering."
      },
      {
        "slug": "palisade",
        "href": "/products/palisade",
        "maker": "Sequence LifeScience",
        "name": "Palisade",
        "text": "A dual-membrane placental allograft with amnion and chorion in one wound covering."
      },
      {
        "slug": "sentry-sl",
        "href": "/products/sentry-sl",
        "maker": "Sequence LifeScience",
        "name": "Sentry SL",
        "text": "A single-layer amniotic membrane allograft designed as a biological wound covering."
      },
      {
        "slug": "membrane-wrap",
        "href": "/products/membrane-wrap",
        "maker": "BioLab Holdings",
        "name": "Membrane Wrap",
        "text": "A dual-layer amniotic allograft used as a protective wound covering."
      },
      {
        "slug": "tri-membrane-wrap",
        "href": "/products/tri-membrane-wrap",
        "maker": "BioLab Holdings",
        "name": "Tri-Membrane Wrap",
        "text": "A three-layer placental allograft for protective wound coverage."
      },
      {
        "slug": "xcell-amnio-matrix",
        "href": "/products/xcell-amnio-matrix",
        "maker": "Precise Bioscience · New Horizon",
        "name": "XCell Amnio Matrix",
        "text": "A lyophilized amniotic membrane wound covering, available through New Horizon Medical Solutions."
      },
      {
        "slug": "palingen",
        "href": "/products/palingen",
        "maker": "Amnio Technology",
        "name": "PalinGen Membrane",
        "text": "A chorion-free amniotic tissue allograft used as a biological wound covering."
      }
    ]
  },
  {
    "id": "non-sheet-skin-substitutes",
    "label": "Matrices & wound coverings",
    "text": "Explore the material behind the product.",
    "members": [
      {
        "slug": "microlyte",
        "href": "/products/microlyte",
        "maker": "Imbed Biosciences · BioLab",
        "name": "Microlyte SAM",
        "text": "A fully synthetic antimicrobial matrix that conforms to the wound surface."
      },
      {
        "slug": "microlyte-painguard",
        "href": "/products/microlyte-painguard",
        "maker": "Imbed Biosciences · BioLab",
        "name": "Microlyte PainGuard",
        "text": "A synthetic antimicrobial matrix with lidocaine, distinct from standard Microlyte."
      },
      {
        "slug": "myriad-matrix",
        "href": "/products/myriad-matrix",
        "maker": "AROA Biosurgery",
        "name": "Myriad Matrix",
        "text": "An extracellular matrix bioscaffold available in multiple sheet configurations."
      },
      {
        "slug": "interfyl",
        "href": "/products/interfyl",
        "maker": "Celularity",
        "name": "Interfyl",
        "text": "A human connective tissue matrix with flowable and particulate formats."
      },
      {
        "slug": "xcellistem",
        "href": "/products/xcellistem",
        "maker": "StemSys",
        "name": "XCelliStem",
        "text": "A particulate wound product based on a blend of extracellular matrix materials."
      },
      {
        "slug": "apis",
        "href": "/products/apis",
        "maker": "SweetBio",
        "name": "APIS",
        "text": "A wound matrix combining collagen and Mānuka honey in a soft sheet format."
      }
    ]
  },
  {
    "id": "conservative-wound-care",
    "label": "Wound care devices",
    "text": "Understand the technology and workflow.",
    "members": [
      {
        "slug": "ultramist",
        "href": "/products/ultramist",
        "maker": "SANUWAVE",
        "name": "UltraMIST",
        "text": "Ultrasound therapy delivered through a non-contact saline mist."
      },
      {
        "slug": "arobella",
        "href": "/products/arobella",
        "maker": "Arobella Medical",
        "name": "Arobella Qoustic",
        "text": "An ultrasound-assisted system for wound debridement and cleansing."
      },
      {
        "slug": "microdoc",
        "href": "/products/microdoc",
        "maker": "Pensar Medical",
        "name": "MicroDoc",
        "text": "A compact single-use negative pressure wound therapy system."
      }
    ]
  },
  {
    "id": "blood-based-skin-substitutes",
    "label": "Autologous wound care",
    "text": "Explore patient-derived approaches.",
    "members": [
      {
        "slug": "actigraft",
        "href": "/products/actigraft",
        "maker": "RedDress",
        "name": "ActiGraft",
        "text": "An autologous approach using a clot prepared from the patient’s own blood."
      }
    ]
  },
  {
    "id": "practice-products",
    "label": "Across the practice",
    "text": "Support from the clinic to home.",
    "members": [
      {
        "slug": "adhesion-barrier",
        "href": "/products/adhesion-barrier",
        "maker": "Surgical product program",
        "name": "Surgical allografts",
        "text": "Bring the product, its labeled use, and your OR workflow into the same review."
      },
      {
        "slug": "peptides",
        "href": "/products/peptides",
        "maker": "Physician-directed product information",
        "name": "Peptide catalog",
        "text": "Review the catalog, available channels, and product-specific regulatory information."
      },
      {
        "slug": "exosomes",
        "href": "/products/exosomes",
        "maker": "Scientific & regulatory information",
        "name": "Exosomes & birth tissue",
        "text": "Review the scientific and regulatory context before discussing product availability."
      },
      {
        "slug": "wholesaler",
        "href": "/products/wholesaler",
        "maker": "Practice supply support",
        "name": "Medical supplies",
        "text": "Bring your facility’s supply requirements into one practical conversation."
      },
      {
        "slug": "ovena",
        "href": "/amazon-store",
        "maker": "Ovena Health",
        "name": "Ovena Health",
        "text": "Practical wound care and compression supplies for care beyond the clinic."
      }
    ]
  }
];
const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
const $$splitComponentImporter$4 = () => import("./index-BHkprYkD.js");
const Route$5 = createFileRoute("/products/")({
  head: () => ({
    meta: [{
      title: "Products & solutions | Albacete MedDev"
    }, {
      name: "description",
      content: PRODUCTS_HUB.text
    }],
    links: [{
      rel: "stylesheet",
      href: pagesCss
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./revenue-cycle-CV9LdsHL.js");
const Route$4 = createFileRoute("/services/revenue-cycle")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component"),
  head: () => ({
    meta: [{
      title: revenueCycle.meta.title
    }, {
      name: "description",
      content: revenueCycle.meta.description
    }]
  })
});
const $$splitComponentImporter$2 = () => import("./consulting-BuPTEI4s.js");
const Route$3 = createFileRoute("/services/consulting")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component"),
  head: () => ({
    meta: [{
      title: consulting.meta.title
    }, {
      name: "description",
      content: consulting.meta.description
    }]
  })
});
const pageCss = "/assets/peptides-DOM8f63k.css";
const PEPTIDES = {
  "href": "/products/peptides",
  "name": "Peptide catalog",
  "title": "Peptide Therapies for Physician Practices | Albacete MedDev",
  "description": "54-entry physician peptide catalog: GLP-1 programs, GH-axis, recovery, longevity, cognitive and immune protocols across 503A and 503A/B channels. Pricing on request.",
  "image": "peptides-scene",
  "maker": "Physician-directed product information",
  "notice": "For licensed prescribers and practice staff only — not for patients or consumers. Compounded preparations are not FDA-approved. 503A preparations are dispensed only under a patient-specific prescription; office-use stock is available only from a 503B outsourcing facility, where federal and state law allow.",
  "deck": "Review the catalog, available channels, and product-specific regulatory information.",
  "cta": {
    "label": "Discuss this product",
    "href": "/contact/?products=peptides"
  },
  "source": {
    "label": "Clinical & regulatory resources",
    "href": "/evidence/#peptides"
  },
  "imageAlt": "Pharmacist and clinician reviewing a product in a pharmacy",
  "imageCaption": "For licensed prescribers · Compounded preparations are not FDA-approved",
  "channels": {
    "eyebrow": "Supply channels",
    "title": "Two channels, one ordering relationship.",
    "text": "Albacete MedDev coordinates access and pricing across both supplier channels. Which channel a preparation ships from determines how it is prescribed and where it can ship.",
    "panels": [
      {
        "title": "MyPharmacyOrder — 503A",
        "rows": [
          {
            "k": "Model",
            "v": "Patient-specific prescriptions"
          },
          {
            "k": "Ordering",
            "v": "Portal ordering"
          },
          {
            "k": "Ships to",
            "v": "Clinic or patient"
          },
          {
            "k": "Exception",
            "v": "Testosterone ships direct to patient"
          },
          {
            "k": "Catalog",
            "v": "GLP-1 programs, sermorelin, NAD+, ancillaries"
          }
        ]
      },
      {
        "title": "MyViaHealth — 503A/B",
        "rows": [
          {
            "k": "Model",
            "v": "503A or 503B — confirm per preparation"
          },
          {
            "k": "Ordering",
            "v": "Ordering platform"
          },
          {
            "k": "Ships to",
            "v": "Patient or clinic"
          },
          {
            "k": "Formats",
            "v": "Lyophilized, reconstituted, pens"
          },
          {
            "k": "Volume breaks",
            "v": "10+ and 50+ unit tiers"
          }
        ]
      }
    ]
  },
  "before": {
    "title": "Before you order",
    "paragraphs": [
      {
        "lead": "Who can order.",
        "text": "We accept requests only from licensed prescribers and their practices. A 503A pharmacy compounds for an identified patient under a patient-specific prescription; 503A preparations cannot be supplied as office stock. A 503B outsourcing facility may supply office-use stock only where federal and state law allow, and only the outsourcing facility may sell or transfer that stock — it may not be resold or passed on to another practice."
      },
      {
        "lead": "Not FDA-approved.",
        "text": "Compounded drugs are not FDA-approved. FDA does not review them for safety, effectiveness, or quality before they reach patients. FDA has not determined that any compounded preparation is equivalent to, or interchangeable with, an FDA-approved drug."
      },
      {
        "lead": "Active ingredients of FDA-approved drugs.",
        "text": "Federal law bars a 503A pharmacy from compounding, regularly or in inordinate amounts, a drug that is essentially a copy of a commercially available FDA-approved drug, and separately bars a 503B outsourcing facility from compounding drugs that are essentially copies of approved drugs. A preparation is not considered a copy when the prescriber determines, as a clinical judgment for an individual patient, that a specific change (for example, leaving out an ingredient the patient cannot tolerate) produces a significant difference for that patient; FDA guidance asks that the change and the difference be noted on the prescription. We list these substances only for patient-specific 503A prescriptions that carry that note. A 503B outsourcing facility may compound from a bulk drug substance only if the substance is on FDA's 503B bulks list (or in Category 1 under FDA's 503B interim policy) or the drug is on FDA's drug shortage list when it is compounded, distributed, and dispensed. A 503A pharmacy may compound semaglutide or tirzepatide only from the form that is the active ingredient of the approved drugs; salt forms (for example, semaglutide sodium or semaglutide acetate) do not qualify."
      },
      {
        "lead": "Status chips.",
        "text": 'Each entry shows our reading of its federal status; the legend under the filters defines every chip. "Bulks Category 1" means FDA has placed the substance in Category 1 under its interim policy for the 503A bulks list, the 503B bulks list, or both — substances FDA is still evaluating. FDA has said it does not intend to take action against compounding from them while that evaluation continues, provided every other legal condition is met. It is not FDA approval and not a finding of safety or effectiveness. State law may be stricter than federal policy. Entries marked "Not available to order" are listed for reference only.'
      },
      {
        "lead": "Research.",
        "text": "Catalog entries do not summarize research. Our Evidence page grades published research on each substance (often laboratory or animal studies), not research on any compounded preparation. We make no claim that any preparation is safe or effective for any use, and we do not provide dosing guidance."
      },
      {
        "lead": "Who compounds and dispenses.",
        "text": "Albacete MedDev is not a pharmacy or an outsourcing facility. It does not compound, dispense, or prescribe, and it does not practice medicine or direct prescribing decisions. Each order is filled by the supplier for the channel shown on the entry, not by Albacete MedDev. Before you order, ask us for the supplier's legal name, its license, and, for a 503B outsourcing facility, its FDA registration. You are free to use any appropriately licensed pharmacy; ordering through these channels is never required."
      },
      {
        "lead": "Prescriber responsibility.",
        "text": "The prescriber decides whether a compounded preparation is appropriate for a patient instead of an FDA-approved alternative, and is responsible for licensure and a valid practitioner–patient relationship under the law of the patient's state, informed consent (including that the preparation is not FDA-approved), the choice of dose and route, monitoring, and, for active ingredients of FDA-approved drugs, the significant-difference determination noted on the prescription."
      },
      {
        "lead": "State availability.",
        "text": "Whether a preparation can be dispensed depends on the dispensing entity's licensure in the state where the preparation will be delivered and on that state's law. Not every preparation is available in every state."
      },
      {
        "lead": "Adverse events and quality concerns.",
        "text": "Report suspected adverse events and product-quality problems to the dispensing pharmacy or outsourcing facility and to FDA MedWatch at www.fda.gov/medwatch or 1-800-FDA-1088. To tell us about a quality concern, call 551-497-3428 — please do not email patient details."
      },
      {
        "lead": "Privacy.",
        "text": "Do not send patient names or any other patient health information by email."
      }
    ],
    "foot": "This page is not medical advice. Pricing information is provided on request to licensed prescribers and their practices; requesting pricing creates no obligation. Before any order, we will tell you which entity receives the prescription or order, invoices you, and ships the preparation."
  },
  "catalog": {
    "eyebrow": "The catalog",
    "title": "54 entries, filtered your way.",
    "text": "Filter by use case, channel or regulatory status — or search by molecule and mechanism. Expand any card for its available preparations.",
    "searchPlaceholder": "Search molecules, mechanisms, uses…",
    "searchLabel": "Search the peptide catalog",
    "clearLabel": "Clear all ×",
    "filterGroups": [
      {
        "aria": "Filter by use case",
        "label": "Use case",
        "pills": [
          {
            "filter": "cat",
            "value": "",
            "label": "All"
          },
          {
            "filter": "cat",
            "value": "weight",
            "label": "Weight Management & Metabolic"
          },
          {
            "filter": "cat",
            "value": "gh",
            "label": "Growth Hormone Axis & Body Composition"
          },
          {
            "filter": "cat",
            "value": "hormone",
            "label": "Hormone Support"
          },
          {
            "filter": "cat",
            "value": "recovery",
            "label": "Recovery & Tissue Support"
          },
          {
            "filter": "cat",
            "value": "longevity",
            "label": "Longevity & Cellular Health"
          },
          {
            "filter": "cat",
            "value": "metabolic",
            "label": "NAD+ & Metabolic Support"
          },
          {
            "filter": "cat",
            "value": "skin",
            "label": "Aesthetic & Skin"
          },
          {
            "filter": "cat",
            "value": "cognitive",
            "label": "Cognitive & Neuro"
          },
          {
            "filter": "cat",
            "value": "immune",
            "label": "Immune & Inflammation"
          },
          {
            "filter": "cat",
            "value": "sexual",
            "label": "Sexual Health"
          },
          {
            "filter": "cat",
            "value": "ancillary",
            "label": "Ancillaries & Non-Peptide Support"
          }
        ]
      },
      {
        "aria": "Filter by channel",
        "label": "Channel",
        "pills": [
          {
            "filter": "ch",
            "value": "",
            "label": "All"
          },
          {
            "filter": "ch",
            "value": "MyPharmacyOrder",
            "label": "MyPharmacyOrder"
          },
          {
            "filter": "ch",
            "value": "MyViaHealth",
            "label": "MyViaHealth"
          }
        ]
      },
      {
        "aria": "Filter by regulatory status",
        "label": "Status",
        "pills": [
          {
            "filter": "status",
            "value": "",
            "label": "All"
          },
          {
            "filter": "status",
            "value": "approved",
            "label": "Approved-drug substance"
          },
          {
            "filter": "status",
            "value": "cat1",
            "label": "Bulks Category 1"
          },
          {
            "filter": "status",
            "value": "split",
            "label": "Split status — confirm channel"
          },
          {
            "filter": "status",
            "value": "cat3",
            "label": "Bulks Category 3"
          },
          {
            "filter": "status",
            "value": "withdrawn",
            "label": "Nomination withdrawn"
          },
          {
            "filter": "status",
            "value": "not-listed",
            "label": "No compounding pathway"
          },
          {
            "filter": "status",
            "value": "cat2",
            "label": "Category 2 — safety risk"
          },
          {
            "filter": "status",
            "value": "biologic",
            "label": "Regulated as a biologic"
          },
          {
            "filter": "status",
            "value": "supply",
            "label": "Supply item"
          }
        ]
      }
    ],
    "legend": {
      "summary": "What the status chips mean",
      "rows": [
        {
          "chip": "Approved-drug substance",
          "chipClass": "pep-chip--ok",
          "text": "Active ingredient of an FDA-approved drug; compounding follows the approved-drug pathway (shortage and essentially-a-copy rules apply)."
        },
        {
          "chip": "Bulks Category 1",
          "chipClass": "pep-chip--ok",
          "text": "On FDA's interim Category 1 list — nominated with sufficient information; FDA does not intend to act against compounding with it during the interim period. Route or salt-form carve-outs may apply; see the entry note."
        },
        {
          "chip": "Split status — confirm channel",
          "chipClass": "pep-chip--warn",
          "text": "Standing differs between the 503A and 503B pathways; confirm with the dispensing pharmacy which pathway your preparation uses."
        },
        {
          "chip": "Bulks Category 3",
          "chipClass": "pep-chip--warn",
          "text": "Nominated without sufficient supporting information; not currently authorized for compounding."
        },
        {
          "chip": "Nomination withdrawn",
          "chipClass": "pep-chip--warn",
          "text": "Previously nominated (several were on FDA's 2023 safety-risk list) but the nomination was withdrawn — no active authorization for compounding today."
        },
        {
          "chip": "No compounding pathway",
          "chipClass": "pep-chip--stop",
          "text": "Not an approved-drug component and not on any FDA bulks list — no pathway currently authorizes compounding with this substance."
        },
        {
          "chip": "Category 2 — safety risk",
          "chipClass": "pep-chip--stop",
          "text": "FDA has identified significant safety risks on its interim lists (503A and/or 503B); not permitted in compounding."
        },
        {
          "chip": "Regulated as a biologic",
          "chipClass": "pep-chip--stop",
          "text": "Transitioned to biologic licensure (2020) and is outside the 503A/503B bulk-compounding framework entirely."
        },
        {
          "chip": "Supply item",
          "chipClass": "pep-chip--ok",
          "text": "Not a drug substance — ordering supplies carried by the same channels."
        }
      ],
      "foot": "Statuses are our reading of FDA's drug shortage list, the 503A and 503B bulk drug substance lists and interim policies, FDA's list of products transitioned to biologics licensure, and FDA's rule that peptides of more than 40 amino acids are regulated as biologics, at the time this page was prepared; they may be out of date. State law may be stricter. Confirm current status with the dispensing pharmacy or outsourcing facility before prescribing and again when ordering."
    }
  },
  "categories": [
    {
      "id": "cat-weight",
      "title": "Weight Management & Metabolic",
      "text": "GLP-1-class incretin therapies and metabolic peptides anchor modern medical weight-management programs. This group spans the approved-drug substances used in compounded titration protocols alongside investigational metabolic peptides — eligibility differs sharply molecule to molecule, so check each status chip."
    },
    {
      "id": "cat-gh",
      "title": "Growth Hormone Axis & Body Composition",
      "text": "Secretagogues that act on the GHRH receptor or the ghrelin receptor to support endogenous growth-hormone pulsatility, ordered in body-composition, recovery and healthy-aging protocols. Regulatory status varies widely in this group — several molecules have no active FDA bulks-list authorization, so check each chip."
    },
    {
      "id": "cat-hormone",
      "title": "Hormone Support",
      "text": "Peptide hormones with long clinical histories and approved reference products, ordered for fertility, endocrine and obstetric-adjacent indications under physician direction."
    },
    {
      "id": "cat-recovery",
      "title": "Recovery & Tissue Support",
      "text": "The repair-and-recovery group: peptides studied preclinically for angiogenesis, fibroblast activity and tissue remodeling. Most of this group is investigational with limited human data, and several members lack any FDA compounding authorization — review each status before ordering."
    },
    {
      "id": "cat-longevity",
      "title": "Longevity & Cellular Health",
      "text": "Mitochondrial, senolytic and cellular-energetics peptides ordered in longevity and healthspan protocols. Evidence ranges from early human trials to purely preclinical work; status chips mark where FDA has weighed in."
    },
    {
      "id": "cat-metabolic",
      "title": "NAD+ & Metabolic Support",
      "text": "NAD+ restoration for cellular energetics, ordered as infusions, injections and nasal formats in metabolic-health and recovery protocols."
    },
    {
      "id": "cat-skin",
      "title": "Aesthetic & Skin",
      "text": "Copper peptides and melanocortin agonists ordered in aesthetic, hair and skin protocols — from GHK-Cu's collagen-signaling work to melanotan pigmentation peptides that remain investigational."
    },
    {
      "id": "cat-cognitive",
      "title": "Cognitive & Neuro",
      "text": "Neuropeptides from the Russian nootropic literature and sleep-axis peptides, ordered for focus, stress resilience and sleep-quality protocols. Human evidence is limited across this group."
    },
    {
      "id": "cat-immune",
      "title": "Immune & Inflammation",
      "text": "Thymic peptides, host-defense peptides and anti-inflammatory fragments ordered in immune-support and inflammatory-condition protocols."
    },
    {
      "id": "cat-sexual",
      "title": "Sexual Health",
      "text": "Melanocortin and kisspeptin pathways for sexual-health indications — including the one peptide in this catalog with its own FDA-approved reference product for hypoactive sexual desire disorder."
    },
    {
      "id": "cat-ancillary",
      "title": "Ancillaries & Non-Peptide Support",
      "text": "Non-peptide items carried on the same supplier channels — reconstitution supplies, vitamins and hormone support that practices order alongside peptide protocols."
    }
  ],
  "cards": [
    {
      "key": "5-amino-1mq",
      "cat": "weight",
      "channels": [
        "MyViaHealth"
      ],
      "status": "not-listed",
      "search": "5-amino-1mq small-molecule nnmt inhibitor that raises intracellular nad+ and preserves sam.",
      "chips": [
        {
          "cls": "pep-chip--stop",
          "label": "No compounding pathway"
        }
      ],
      "name": "5-Amino-1MQ",
      "mech": "Small-molecule NNMT inhibitor that raises intracellular NAD+ and preserves SAM.",
      "note": "Absent from all FDA compounding lists; a Jan 2026 FDA warning letter states it is not eligible for 503B compounding exemptions.",
      "label": {
        "frame": "pl--capsules",
        "image": "capsules",
        "labelHtml": '<span class="pl" style="--kn:0.83"><span class="pl-hd"><span class="pl-name">5-Amino-1MQ</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Capsules</span></span><span class="pl-bc"></span></span>',
        "names": [
          "5-Amino-1MQ"
        ],
        "forms": [
          "Capsules"
        ]
      },
      "preparations": "Capsules ×1 · Lyophilized ×1 · Vial ×1",
      "rows": [
        {
          "name": "5 AMINO 1MQ - 10 mg",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "5-Amino-1MQ (10mg)",
          "meta": "10mg vial · MyViaHealth"
        },
        {
          "name": "5-Amino-1MQ Capsules (50mg/60ct)",
          "meta": "50mg x60 caps · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "aod-9604",
      "cat": "weight",
      "channels": [
        "MyViaHealth"
      ],
      "status": "withdrawn",
      "search": "aod-9604 modified hgh fragment 176-191 studied for lipolysis without growth-receptor activity.",
      "chips": [
        {
          "cls": "pep-chip--warn",
          "label": "Nomination withdrawn"
        }
      ],
      "name": "AOD-9604",
      "mech": "Modified hGH fragment 176-191 studied for lipolysis without growth-receptor activity.",
      "note": "Placed in 503A Category 2 in 2023, removed after nominator withdrawal in 2024; advisory committee voted against listing (Dec 2024). No active authorization.",
      "label": {
        "frame": "pl--vial-lyophilized",
        "image": "vial-lyophilized",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">AOD-9604</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span>',
        "names": [
          "AOD-9604"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×1 · Vial ×1",
      "rows": [
        {
          "name": "AOD-9604 - 10MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "AOD-9604 (5mg)",
          "meta": "5mg vial · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "cagrilintide",
      "cat": "weight",
      "channels": [
        "MyViaHealth"
      ],
      "status": "not-listed",
      "search": "cagrilintide long-acting amylin analog studied with semaglutide (cagrisema) for weight management.",
      "chips": [
        {
          "cls": "pep-chip--stop",
          "label": "No compounding pathway"
        }
      ],
      "name": "Cagrilintide",
      "mech": "Long-acting amylin analog studied in combination with semaglutide for weight management.",
      "note": "Investigational; on no FDA compounding list. Covered by FDA's explicit cannot-be-compounded statement for unapproved GLP-1-adjacent peptides.",
      "label": {
        "frame": "pl--vial-lyophilized",
        "image": "vial-lyophilized",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">Cagrilintide</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span>',
        "names": [
          "Cagrilintide"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×1 · Reconstituted Vial ×1",
      "rows": [
        {
          "name": "Cagrilinitide 10mg (1mg/ml 10ml vial)",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "Cagrilintide 10MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "retatrutide",
      "cat": "weight",
      "channels": [
        "MyViaHealth"
      ],
      "status": "not-listed",
      "search": "retatrutide triple agonist (gip/glp-1/glucagon receptors) in late-stage clinical development.",
      "chips": [
        {
          "cls": "pep-chip--stop",
          "label": "No compounding pathway"
        }
      ],
      "name": "Retatrutide",
      "mech": "Triple agonist (GIP/GLP-1/glucagon receptors) in late-stage clinical development.",
      "note": "Investigational; on no FDA compounding list. FDA states it cannot be used in compounding under federal law and has issued warning letters.",
      "label": {
        "frame": "pl--vial-lyophilized",
        "image": "vial-lyophilized",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">Retatrutide</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span>',
        "names": [
          "Retatrutide"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×4 · Pen ×5 · Reconstituted Vial ×3 · Vial ×3",
      "rows": [
        {
          "name": "GLP-3R 100MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "GLP-3R 10MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "GLP-3R 16mg 3mL Pen",
          "meta": "Pen · MyViaHealth"
        },
        {
          "name": "GLP-3R 24mg 3mL Pen (8mg/mL)",
          "meta": "Pen · MyViaHealth"
        },
        {
          "name": "GLP-3R 30MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "GLP-3R 32mg 3mL Pen",
          "meta": "Pen · MyViaHealth"
        },
        {
          "name": "GLP-3R 48mg 3mL Pen (16mg/mL)",
          "meta": "Pen · MyViaHealth"
        },
        {
          "name": "GLP-3R 60MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "GLP-3R 8mg 3mL Pen",
          "meta": "Pen · MyViaHealth"
        },
        {
          "name": "Reta 100mg (20mg/ml 5ml vial)",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "Reta 200mg (20mg/ml 10ml vial)",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "Reta 60mg (20mg/ml 3ml vial)",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "PEP R / GLP-3 (Retatrutide) 16mg",
          "meta": "16mg vial · MyViaHealth"
        },
        {
          "name": "PEP R / GLP-3 (Retatrutide) 60mg",
          "meta": "60mg vial · MyViaHealth"
        },
        {
          "name": "PEP R / GLP-3 (Retatrutide) 8mg",
          "meta": "8mg vial · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "semaglutide",
      "cat": "weight",
      "channels": [
        "MyPharmacyOrder",
        "MyViaHealth"
      ],
      "status": "approved",
      "search": "semaglutide glp-1 receptor agonist slowing gastric emptying and improving satiety and glycemic control.",
      "chips": [
        {
          "cls": "pep-chip--ok",
          "label": "Approved-drug substance"
        }
      ],
      "name": "Semaglutide",
      "mech": "GLP-1 receptor agonist slowing gastric emptying and improving satiety and glycemic control.",
      "note": "Semaglutide is the active ingredient of FDA-approved drugs. FDA removed semaglutide from its drug shortage list on February 21, 2025. Listed only for patient-specific 503A prescriptions on which the prescriber notes the specific change and the significant difference it produces for that patient. Not eligible for 503B compounding from bulk drug substance. Salt forms (for example, semaglutide sodium or semaglutide acetate) do not qualify.",
      "label": {
        "frame": "pl--vial-liquid",
        "image": "vial-liquid",
        "labelHtml": '<span class="pl" style="--kn:0.97"><span class="pl-hd"><span class="pl-name">Semaglutide</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Compounded<br>Vial</span></span><span class="pl-bc"></span></span>',
        "names": [
          "Semaglutide"
        ],
        "forms": [
          "Compounded / Vial"
        ]
      },
      "preparations": "Compounded Vial ×14 · Injectable ×9 · Lyophilized ×3 · Prefilled Pen ×1 · Reconstituted Vial ×3 · Sublingual Troche ×5 · Vial ×4",
      "rows": [
        {
          "name": "GLP-1S 10MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "GLP-1S 10mg Prefilled Pen (3ML)",
          "meta": "Prefilled Pen · MyViaHealth"
        },
        {
          "name": "GLP-1S 20MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "GLP-1S 50MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "Semaglutide + Glycine Injection 6mg/0.5mg/mL [CA Eligible]",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Semaglutide 12.5mg + B12 2mg (3.125/0.5 mg/ml 4ML Vial)",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "Semaglutide 2.5mg + B12 1mg (1.25/0.5 mg/ml 2ml vial)",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "Semaglutide 5mg + B12 1mg (2.5/0.5 mg/ml 2ml vial)",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "Semaglutide/B12 1/0.5 mg/ml 1mL Vial [CA Eligible]",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Semaglutide/B12 10/0.5 mg/ml (1ML Vial) [CA Eligible]",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Semaglutide/B12 2/0.5 mg/ml 1mL Vial [CA Eligible]",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Semaglutide/B12 4/0.5 mg/ml (1ML Vial) [CA Eligible]",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Semaglutide/B12 6/0.5 mg/ml (1ML Vial) [CA Eligible]",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Semaglutide/Glycine 1.25/5 mg/ml (1ML Vial)",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Semaglutide/Glycine 1/0.5 mg/ml (1ML Vial) [CA Eligible]",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Semaglutide/Glycine 10/0.5 mg/ml (1ML Vial) [CA Eligible]",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Semaglutide/Glycine 12.5mg (3.125/5 mg/ml 4ML Vial)",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Semaglutide/Glycine 2.50mg (1.25/5 mg/ml 2ML Vial)",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Semaglutide/Glycine 2/0.5 mg/ml (1ML Vial) [CA Eligible]",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Semaglutide/Glycine 4/0.5 mg/ml (1ML Vial) [CA Eligible]",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Semaglutide/Glycine 5mg (2.5/5 mg/ml 2ML Vial)",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Semaglutide",
          "meta": "4 ct · 0.75mg Sublingual Troche · MyPharmacyOrder"
        },
        {
          "name": "Semaglutide",
          "meta": "4 ct · 1.5mg Sublingual Troche · MyPharmacyOrder"
        },
        {
          "name": "Semaglutide",
          "meta": "4 ct · 3mg Sublingual Troche · MyPharmacyOrder"
        },
        {
          "name": "Semaglutide",
          "meta": "4 ct · 5.1mg Sublingual Troche · MyPharmacyOrder"
        },
        {
          "name": "Semaglutide",
          "meta": "4 ct · 7.2mg Sublingual Troche · MyPharmacyOrder"
        },
        {
          "name": "Semaglutide / Methylcobalamin",
          "meta": "0.2mL, 1 vial · 5mg/1mg/mL · 1mg/0.2mg Injectable · MyPharmacyOrder"
        },
        {
          "name": "Semaglutide / Methylcobalamin",
          "meta": "0.4mL, 1 vial · 5mg/1mg/mL · 2mg/0.4mg Injectable · MyPharmacyOrder"
        },
        {
          "name": "Semaglutide / Methylcobalamin",
          "meta": "0.6mL, 2 vials · 5mg/1mg/mL · 3mg/0.6mg Injectable · MyPharmacyOrder"
        },
        {
          "name": "Semaglutide / Methylcobalamin",
          "meta": "0.8mL, 1 vial · 5mg/1mg/mL · 4mg/0.8mg Injectable · MyPharmacyOrder"
        },
        {
          "name": "Semaglutide / Methylcobalamin",
          "meta": "1mL, 1 vial · 5mg/1mg/mL · 5mg/1mg Injectable · MyPharmacyOrder"
        },
        {
          "name": "Semaglutide / Methylcobalamin",
          "meta": "1.5mL, 1 vial · 5mg/1mg/mL · 7.5mg/1.5mg Injectable · MyPharmacyOrder"
        },
        {
          "name": "Semaglutide / Methylcobalamin",
          "meta": "2mL, 1 vial · 5mg/1mg/mL · 10mg/2mg Injectable · MyPharmacyOrder"
        },
        {
          "name": "Semaglutide / Methylcobalamin",
          "meta": "2.5mL, 2 vials · 5mg/1mg/mL · 12.5mg/2.5mg Injectable · MyPharmacyOrder"
        },
        {
          "name": "Semaglutide / Methylcobalamin",
          "meta": "3mL, 1 vial · 5mg/1mg/mL · 15mg/3mg Injectable · MyPharmacyOrder"
        },
        {
          "name": "PEP S / GLP-1 (Semaglutide) 10mg/3ml",
          "meta": "10mg/3ml · MyViaHealth"
        },
        {
          "name": "PEP S / GLP-1 (Semaglutide) 10mg/5ml",
          "meta": "10mg/5ml · MyViaHealth"
        },
        {
          "name": "PEP S / GLP-1 (Semaglutide) 20mg",
          "meta": "20mg vial · MyViaHealth"
        },
        {
          "name": "PEP S / GLP-1 (Semaglutide) 5mg",
          "meta": "5mg vial · MyViaHealth"
        }
      ],
      "na": "",
      "orderNote": "503A, patient-specific prescriptions only — significant-difference note required.",
      "request": {
        "label": "Request pricing",
        "href": "mailto:gabe@albacetemeddev.com?subject=Peptide%20pricing%20request%20%E2%80%94%20Semaglutide&body=Please%20do%20not%20include%20patient%20names%20or%20health%20information.%0D%0A%0D%0APractice%20name%3A%0D%0APrescriber%20name%20and%20credentials%3A%0D%0ANPI%3A%0D%0AState%20license%20number%20and%20state%3A%0D%0AStates%20where%20your%20patients%20receive%20preparations%3A%0D%0APreparation%20and%20channel%3A%0D%0A%0D%0AI%20confirm%20I%20am%20a%20licensed%20prescriber%2C%20or%20practice%20staff%20requesting%20on%20a%20prescriber%27s%20behalf.",
        "describedBy": "pep-ord-semaglutide"
      }
    },
    {
      "key": "tirzepatide",
      "cat": "weight",
      "channels": [
        "MyPharmacyOrder",
        "MyViaHealth"
      ],
      "status": "approved",
      "search": "tirzepatide dual gip/glp-1 receptor agonist with additive effects on satiety and insulin sensitivity.",
      "chips": [
        {
          "cls": "pep-chip--ok",
          "label": "Approved-drug substance"
        }
      ],
      "name": "Tirzepatide",
      "mech": "Dual GIP/GLP-1 receptor agonist with additive effects on satiety and insulin sensitivity.",
      "note": "Tirzepatide is the active ingredient of FDA-approved drugs. FDA removed tirzepatide from its drug shortage list on October 2, 2024, and reaffirmed that on December 19, 2024. Listed only for patient-specific 503A prescriptions on which the prescriber notes the specific change and the significant difference it produces for that patient. Not eligible for 503B compounding from bulk drug substance.",
      "label": {
        "frame": "pl--vial-liquid",
        "image": "vial-liquid",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">Tirzepatide</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Compounded<br>Vial</span></span><span class="pl-bc"></span></span>',
        "names": [
          "Tirzepatide"
        ],
        "forms": [
          "Compounded / Vial"
        ]
      },
      "preparations": "Compounded Vial ×18 · Injectable ×6 · Lyophilized ×4 · Reconstituted Vial ×3 · Sublingual Troche ×6 · Vial ×5",
      "rows": [
        {
          "name": "GLP-2T - 10MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "GLP-2T 100MG (10mg/mL 10mL Vial)",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "GLP-2T 100MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "GLP-2T 30MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "GLP-2T 60MG (6mg/ml 10mL Vial)",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "GLP-2T 60MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "Tirzepatide 10mg/mL + B12 .5mg/mL 2mL Vial [CA Eligible]",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Tirzepatide 10mg/mL + Glycine .5mg/mL 2mL Vial [CA Eligible]",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Tirzepatide 15mg/mL + B12 .5mg/mL 2mL Vial [CA Eligible]",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Tirzepatide 15mg/mL + Glycine .5mg/mL 2mL Vial [CA Eligible]",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Tirzepatide 17mg + B12 1mg (8.5/0.5 mg/ml 2ML Vial)",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "Tirzepatide 20mg/mL + B12 .5mg/mL 2mL Vial [CA Eligible]",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Tirzepatide 20mg/mL + Glycine .5mg/mL 2mL Vial [CA Eligible]",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Tirzepatide 25mg/mL + B12 .5mg/mL 2mL Vial [CA Eligible]",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Tirzepatide 25mg/mL + Glycine .5mg/mL 2mL Vial [CA Eligible]",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Tirzepatide 30mg/mL + B12 .5mg/mL 2mL Vial [CA Eligible]",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Tirzepatide 30mg/mL + Glycine .5mg/mL 2mL Vial [CA Eligible]",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Tirzepatide 34mg + B12 1mg (17/0.5 mg/ml 2ML Vial)",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "Tirzepatide 5mg/mL + B12 .5mg/mL 2mL Vial [CA Eligible]",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Tirzepatide 5mg/mL + Glycine .5mg/mL 2mL Vial [CA Eligible]",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Tirzepatide 68mg + B12 2mg (17mg/ml + B12 .5mg/ml 4ml vial)",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "Tirzepatide/Glycine 17mg (8.5/5 mg/ml 2ML Vial)",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Tirzepatide/Glycine 34mg (17/5 mg/ml 2ML Vial)",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Tirzepatide/Glycine 68mg (17/5 mg/ml 4ML Vial)",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Tirzepatide/Glycine 8.5mg (8.5/5 mg/ml 1ML Vial)",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "Tirzepatide",
          "meta": "4 ct · 6.7mg Sublingual Troche · MyPharmacyOrder"
        },
        {
          "name": "Tirzepatide",
          "meta": "4 ct · 13.4mg Sublingual Troche · MyPharmacyOrder"
        },
        {
          "name": "Tirzepatide",
          "meta": "4 ct · 20mg Sublingual Troche · MyPharmacyOrder"
        },
        {
          "name": "Tirzepatide",
          "meta": "4 ct · 26.7mg Sublingual Troche · MyPharmacyOrder"
        },
        {
          "name": "Tirzepatide",
          "meta": "4 ct · 33.3mg Sublingual Troche · MyPharmacyOrder"
        },
        {
          "name": "Tirzepatide",
          "meta": "4 ct · 40mg Sublingual Troche · MyPharmacyOrder"
        },
        {
          "name": "Tirzepatide / Methylcobalamin",
          "meta": "1mL, 1 vial · 10mg/0.5mg/mL · 10mg/0.5mg Injectable · MyPharmacyOrder"
        },
        {
          "name": "Tirzepatide / Methylcobalamin",
          "meta": "2mL, 1 vial · 10mg/0.5mg/mL · 20mg/1mg Injectable · MyPharmacyOrder"
        },
        {
          "name": "Tirzepatide / Methylcobalamin",
          "meta": "3mL, 2 vials · 10mg/0.5mg/mL · 30mg/1.5mg Injectable · MyPharmacyOrder"
        },
        {
          "name": "Tirzepatide / Methylcobalamin",
          "meta": "2mL, 2 vials · 10mg/0.5mg/mL · 40mg/2mg Injectable · MyPharmacyOrder"
        },
        {
          "name": "Tirzepatide / Methylcobalamin",
          "meta": "2mL, 1 vial · 25mg/0.5mg/mL · 50mg/1mg Injectable · MyPharmacyOrder"
        },
        {
          "name": "Tirzepatide / Methylcobalamin",
          "meta": "2.4mL, 1 vial · 25mg/0.5mg/mL · 60mg/1.2mg Injectable · MyPharmacyOrder"
        },
        {
          "name": "PEP T / GLP-2 (Tirzepatide) 100mg",
          "meta": "100mg vial · MyViaHealth"
        },
        {
          "name": "PEP T / GLP-2 (Tirzepatide) 10mg",
          "meta": "10mg vial · MyViaHealth"
        },
        {
          "name": "PEP T / GLP-2 (Tirzepatide) 30mg",
          "meta": "30mg vial · MyViaHealth"
        },
        {
          "name": "PEP T / GLP-2 (Tirzepatide) 60mg",
          "meta": "60mg vial · MyViaHealth"
        },
        {
          "name": "PEP T / GLP-2 (Tirzepatide) 80mg",
          "meta": "80mg vial · MyViaHealth"
        }
      ],
      "na": "",
      "orderNote": "503A, patient-specific prescriptions only — significant-difference note required.",
      "request": {
        "label": "Request pricing",
        "href": "mailto:gabe@albacetemeddev.com?subject=Peptide%20pricing%20request%20%E2%80%94%20Tirzepatide&body=Please%20do%20not%20include%20patient%20names%20or%20health%20information.%0D%0A%0D%0APractice%20name%3A%0D%0APrescriber%20name%20and%20credentials%3A%0D%0ANPI%3A%0D%0AState%20license%20number%20and%20state%3A%0D%0AStates%20where%20your%20patients%20receive%20preparations%3A%0D%0APreparation%20and%20channel%3A%0D%0A%0D%0AI%20confirm%20I%20am%20a%20licensed%20prescriber%2C%20or%20practice%20staff%20requesting%20on%20a%20prescriber%27s%20behalf.",
        "describedBy": "pep-ord-tirzepatide"
      }
    },
    {
      "key": "cjc-1295",
      "cat": "gh",
      "channels": [
        "MyViaHealth"
      ],
      "status": "withdrawn",
      "search": "cjc-1295 (no dac) ghrh analog (no-dac/mod grf 1-29) extending gh pulse amplitude.",
      "chips": [
        {
          "cls": "pep-chip--warn",
          "label": "Nomination withdrawn"
        }
      ],
      "name": "CJC-1295 (No DAC)",
      "mech": "GHRH analog (no-DAC/mod GRF 1-29) extending GH pulse amplitude.",
      "note": "Placed in 503A Category 2 in Sept 2023; nomination since withdrawn — no current 503A or 503B pathway.",
      "label": {
        "frame": "pl--vial-liquid",
        "image": "vial-liquid",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">CJC-1295</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-sub">No DAC</span><span class="pl-form">Vial</span></span><span class="pl-bc"></span></span>',
        "names": [
          "CJC-1295"
        ],
        "forms": [
          "Vial"
        ]
      },
      "preparations": "Vial ×1",
      "rows": [
        {
          "name": "CJC-1295 No DAC / Ipamorelin (5mg/5mg)",
          "meta": "5mg/5mg blend · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "cjc-ipa",
      "cat": "gh",
      "channels": [
        "MyViaHealth"
      ],
      "status": "cat2",
      "search": "cjc-1295 / ipamorelin ghrh analog + ghrelin-receptor agonist for synergistic gh pulsatility.",
      "chips": [
        {
          "cls": "pep-chip--stop",
          "label": "Category 2 — safety risk"
        }
      ],
      "name": "CJC-1295 / Ipamorelin",
      "mech": "GHRH analog + ghrelin-receptor agonist for synergistic GH pulsatility.",
      "note": "Blend status follows its least-permissive component (IPAMORELIN): Ipamorelin is not a component of any FDA-approved drug; FDA currently lists ipamorelin acetate in Category 2 (significant safety risks) of its 503B interim compounding policy, and its 503A nomination has been withdrawn, so it appears on no list of substances eligible for compounding.",
      "label": {
        "frame": "pl--vial-pair",
        "image": "vial-pair",
        "labelHtml": '<span class="pl pl--l"><span class="pl-hd"><span class="pl-name">CJC-1295</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span><span class="pl pl--r"><span class="pl-hd"><span class="pl-name">Ipamorelin</span></span><span class="pl-gl"></span><span class="pl-bd"></span><span class="pl-bc"></span></span>',
        "names": [
          "CJC-1295",
          "Ipamorelin"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×1 · Pen ×1 · Reconstituted Vial ×1 · Vial ×1",
      "rows": [
        {
          "name": "CJC (no DAC)/Ipamorelin 10/10mg 3mL Pen (3.33mg/mL)",
          "meta": "Pen · MyViaHealth"
        },
        {
          "name": "CJC-1295/Ipamorelin 1/1 mg/ml (10ML Vial)",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "CJC-No-DAC-10MG/Ipamorelin- 10MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "Tesamorelin/CJC-1295/Ipamorelin 3X Blend",
          "meta": "6mg/3mg/3mg · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "ghrh",
      "cat": "gh",
      "channels": [
        "MyViaHealth"
      ],
      "status": "not-listed",
      "search": "ghrh native growth-hormone-releasing hormone acting on pituitary somatotrophs.",
      "chips": [
        {
          "cls": "pep-chip--stop",
          "label": "No compounding pathway"
        }
      ],
      "name": "GHRH",
      "mech": "Native growth-hormone-releasing hormone acting on pituitary somatotrophs.",
      "note": "No approved product; absent from FDA's bulks lists (distinct from sermorelin and gonadorelin).",
      "label": {
        "frame": "pl--vial-liquid",
        "image": "vial-liquid",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">GHRH</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Vial</span></span><span class="pl-bc"></span></span>',
        "names": [
          "GHRH"
        ],
        "forms": [
          "Vial"
        ]
      },
      "preparations": "Vial ×1",
      "rows": [
        {
          "name": "GHRH (5mg)",
          "meta": "5mg vial · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "ghrp-2",
      "cat": "gh",
      "channels": [
        "MyViaHealth"
      ],
      "status": "cat3",
      "search": "ghrp-2 ghrelin-receptor agonist increasing gh pulse with mild appetite effect.",
      "chips": [
        {
          "cls": "pep-chip--warn",
          "label": "Bulks Category 3"
        }
      ],
      "name": "GHRP-2",
      "mech": "Ghrelin-receptor agonist increasing GH pulse with mild appetite effect.",
      "note": "503A Category 3 (insufficient supporting information); 503B status splits by route (Category 2 injectable/nasal).",
      "label": {
        "frame": "pl--vial-lyophilized",
        "image": "vial-lyophilized",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">GHRP-2</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span>',
        "names": [
          "GHRP-2"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×1 · Vial ×2",
      "rows": [
        {
          "name": "GHRP-2 10MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "GHRP-2 (10mg)",
          "meta": "10mg vial · MyViaHealth"
        },
        {
          "name": "GHRP-2 (5mg)",
          "meta": "5mg vial · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "ghrp-6",
      "cat": "gh",
      "channels": [
        "MyViaHealth"
      ],
      "status": "cat3",
      "search": "ghrp-6 ghrelin-receptor agonist with pronounced appetite stimulation.",
      "chips": [
        {
          "cls": "pep-chip--warn",
          "label": "Bulks Category 3"
        }
      ],
      "name": "GHRP-6",
      "mech": "Ghrelin-receptor agonist with pronounced appetite stimulation.",
      "note": "503A Category 3; Category 2 on the 503B interim list.",
      "label": {
        "frame": "pl--vial-lyophilized",
        "image": "vial-lyophilized",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">GHRP-6</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span>',
        "names": [
          "GHRP-6"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×1 · Vial ×2",
      "rows": [
        {
          "name": "GHRP-6 10MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "GHRP-6 (10mg)",
          "meta": "10mg vial · MyViaHealth"
        },
        {
          "name": "GHRP-6 (5mg)",
          "meta": "5mg vial · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "igf-1-lr3",
      "cat": "gh",
      "channels": [
        "MyViaHealth"
      ],
      "status": "not-listed",
      "search": "igf-1 lr3 long-arginine-3 igf-1 analog with extended half-life and reduced binding-protein affinity.",
      "chips": [
        {
          "cls": "pep-chip--stop",
          "label": "No compounding pathway"
        }
      ],
      "name": "IGF-1 LR3",
      "mech": "Long-arginine-3 IGF-1 analog with extended half-life and reduced binding-protein affinity.",
      "note": "Different active moiety from mecasermin, the active ingredient of an FDA-approved drug; on no FDA compounding list.",
      "label": {
        "frame": "pl--vial-lyophilized",
        "image": "vial-lyophilized",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">IGF-1 LR3</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span>',
        "names": [
          "IGF-1 LR3"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×1 · Vial ×1",
      "rows": [
        {
          "name": "IGF1-LR3 - 1MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "IGF-1 LR3 (1mg)",
          "meta": "1mg vial · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "ipamorelin",
      "cat": "gh",
      "channels": [
        "MyViaHealth"
      ],
      "status": "cat2",
      "search": "ipamorelin selective ghrelin-receptor agonist (gh secretagogue) with minimal cortisol/prolactin effect.",
      "chips": [
        {
          "cls": "pep-chip--stop",
          "label": "Category 2 — safety risk"
        }
      ],
      "name": "Ipamorelin",
      "mech": "Selective ghrelin-receptor agonist (GH secretagogue) with minimal cortisol/prolactin effect.",
      "note": "Ipamorelin is not a component of any FDA-approved drug; FDA currently lists ipamorelin acetate in Category 2 (significant safety risks) of its 503B interim compounding policy, and its 503A nomination has been withdrawn, so it appears on no list of substances eligible for compounding.",
      "label": {
        "frame": "pl--vial-lyophilized",
        "image": "vial-lyophilized",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">Ipamorelin</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span>',
        "names": [
          "Ipamorelin"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×1 · Reconstituted Vial ×1 · Vial ×2",
      "rows": [
        {
          "name": "Ipamorelin 1 mg/ml (10ML Vial)",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "Ipamorelin 10MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "Ipamorelin (10mg)",
          "meta": "10mg vial · MyViaHealth"
        },
        {
          "name": "Ipamorelin (5mg)",
          "meta": "5mg vial · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "sermorelin",
      "cat": "gh",
      "channels": [
        "MyPharmacyOrder",
        "MyViaHealth"
      ],
      "status": "split",
      "search": "sermorelin ghrh 1-29 fragment stimulating endogenous gh release with preserved feedback.",
      "chips": [
        {
          "cls": "pep-chip--warn",
          "label": "Split status — confirm channel"
        }
      ],
      "name": "Sermorelin",
      "mech": "GHRH 1-29 fragment stimulating endogenous GH release with preserved feedback.",
      "note": "Sermorelin NDAs were withdrawn in 2009 (not for safety reasons). Sermorelin is absent from the 503A category lists but sits in 503B interim Category 1 as an approved-drug component — confirm which pathway your preparation uses.",
      "label": {
        "frame": "pl--vial-liquid",
        "image": "vial-liquid",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">Sermorelin</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Injectable</span></span><span class="pl-bc"></span></span>',
        "names": [
          "Sermorelin"
        ],
        "forms": [
          "Injectable"
        ]
      },
      "preparations": "Injectable ×4 · Lyophilized ×1 · Pen ×1 · Reconstituted Vial ×2 · Vial ×2",
      "rows": [
        {
          "name": "Sermorelin - 10MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "Sermorelin 0.9mg/ml 10ml Vial",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "Sermorelin 10mg 3mL Pen (3.33mg/mL)",
          "meta": "Pen · MyViaHealth"
        },
        {
          "name": "Sermorelin 20mg (2mg/ml 10ml vial)",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "Sermorelin",
          "meta": "6mL · 1mg/mL Injectable · MyPharmacyOrder"
        },
        {
          "name": "Sermorelin",
          "meta": "9mL · 1mg/mL Injectable · MyPharmacyOrder"
        },
        {
          "name": "Sermorelin",
          "meta": "12mL · 1mg/mL Injectable · MyPharmacyOrder"
        },
        {
          "name": "Sermorelin",
          "meta": "14mL · 1mg/mL Injectable · MyPharmacyOrder"
        },
        {
          "name": "Sermorelin (10mg)",
          "meta": "10mg vial · MyViaHealth"
        },
        {
          "name": "Sermorelin (2mg)",
          "meta": "2mg vial · MyViaHealth"
        }
      ],
      "na": "",
      "orderNote": "Confirm the 503A or 503B pathway with the dispensing entity before ordering.",
      "request": {
        "label": "Request pricing",
        "href": "mailto:gabe@albacetemeddev.com?subject=Peptide%20pricing%20request%20%E2%80%94%20Sermorelin&body=Please%20do%20not%20include%20patient%20names%20or%20health%20information.%0D%0A%0D%0APractice%20name%3A%0D%0APrescriber%20name%20and%20credentials%3A%0D%0ANPI%3A%0D%0AState%20license%20number%20and%20state%3A%0D%0AStates%20where%20your%20patients%20receive%20preparations%3A%0D%0APreparation%20and%20channel%3A%0D%0A%0D%0AI%20confirm%20I%20am%20a%20licensed%20prescriber%2C%20or%20practice%20staff%20requesting%20on%20a%20prescriber%27s%20behalf.",
        "describedBy": "pep-ord-sermorelin"
      }
    },
    {
      "key": "tesamorelin",
      "cat": "gh",
      "channels": [
        "MyViaHealth"
      ],
      "status": "approved",
      "search": "tesamorelin stabilized ghrh analog; reduces visceral adipose tissue in hiv-associated lipodystrophy.",
      "chips": [
        {
          "cls": "pep-chip--ok",
          "label": "Approved-drug substance"
        }
      ],
      "name": "Tesamorelin",
      "mech": "Stabilized GHRH analog; reduces visceral adipose tissue in HIV-associated lipodystrophy.",
      "note": "Active ingredient of marketed FDA-approved drugs — approved-drug pathway applies.",
      "label": {
        "frame": "pl--vial-lyophilized",
        "image": "vial-lyophilized",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">Tesamorelin</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span>',
        "names": [
          "Tesamorelin"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×2 · Pen ×2 · Reconstituted Vial ×2 · Vial ×2",
      "rows": [
        {
          "name": "TESAMORELIN - 10 mg",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "Tesamorelin 10MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "Tesamorelin 10mg (1mg/ml 10ml vial)",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "Tesamorelin 10mg 3mL Pen (3.33mg/mL)",
          "meta": "Pen · MyViaHealth"
        },
        {
          "name": "Tesamorelin 30mg (3mg/ml 10ml vial)",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "Tesamorelin 30mg 3mL Pen (10mg/mL)",
          "meta": "Pen · MyViaHealth"
        },
        {
          "name": "Tesamorelin (25mg)",
          "meta": "25mg vial · MyViaHealth"
        },
        {
          "name": "Tesamorelin (2mg)",
          "meta": "2mg vial · MyViaHealth"
        }
      ],
      "na": "",
      "orderNote": "503A, patient-specific prescriptions only — significant-difference note required.",
      "request": {
        "label": "Request pricing",
        "href": "mailto:gabe@albacetemeddev.com?subject=Peptide%20pricing%20request%20%E2%80%94%20Tesamorelin&body=Please%20do%20not%20include%20patient%20names%20or%20health%20information.%0D%0A%0D%0APractice%20name%3A%0D%0APrescriber%20name%20and%20credentials%3A%0D%0ANPI%3A%0D%0AState%20license%20number%20and%20state%3A%0D%0AStates%20where%20your%20patients%20receive%20preparations%3A%0D%0APreparation%20and%20channel%3A%0D%0A%0D%0AI%20confirm%20I%20am%20a%20licensed%20prescriber%2C%20or%20practice%20staff%20requesting%20on%20a%20prescriber%27s%20behalf.",
        "describedBy": "pep-ord-tesamorelin"
      }
    },
    {
      "key": "tesa-ipa",
      "cat": "gh",
      "channels": [
        "MyViaHealth"
      ],
      "status": "cat2",
      "search": "tesamorelin / ipamorelin tesamorelin + ipamorelin pairing an approved-drug ghrh analog with a secretagogue.",
      "chips": [
        {
          "cls": "pep-chip--stop",
          "label": "Category 2 — safety risk"
        }
      ],
      "name": "Tesamorelin / Ipamorelin",
      "mech": "Tesamorelin + ipamorelin pairing an approved-drug GHRH analog with a secretagogue.",
      "note": "Blend status follows its least-permissive component (IPAMORELIN): Ipamorelin is not a component of any FDA-approved drug; FDA currently lists ipamorelin acetate in Category 2 (significant safety risks) of its 503B interim compounding policy, and its 503A nomination has been withdrawn, so it appears on no list of substances eligible for compounding.",
      "label": {
        "frame": "pl--vial-pair",
        "image": "vial-pair",
        "labelHtml": '<span class="pl pl--l"><span class="pl-hd"><span class="pl-name">Tesamorelin</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Vial</span></span><span class="pl-bc"></span></span><span class="pl pl--r"><span class="pl-hd"><span class="pl-name">Ipamorelin</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Vial</span></span><span class="pl-bc"></span></span>',
        "names": [
          "Tesamorelin",
          "Ipamorelin"
        ],
        "forms": [
          "Vial",
          "Vial"
        ]
      },
      "preparations": "Reconstituted Vial ×1 · Vial ×2",
      "rows": [
        {
          "name": "Tesamorelin/Ipamorelin 3mL Vial 12mg/3mg (4mg/1mg/mL)",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "Tesamorelin / Ipamorelin (5mg/5mg)",
          "meta": "5mg/5mg blend · MyViaHealth"
        },
        {
          "name": "Tesamorelin / Ipamorelin (6mg/2mg)",
          "meta": "6mg/2mg blend · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "hcg",
      "cat": "hormone",
      "channels": [
        "MyViaHealth"
      ],
      "status": "biologic",
      "search": "hcg human chorionic gonadotropin — lh-receptor agonist maintaining testicular function.",
      "chips": [
        {
          "cls": "pep-chip--stop",
          "label": "Regulated as a biologic"
        }
      ],
      "name": "HCG",
      "mech": "Human chorionic gonadotropin — LH-receptor agonist maintaining testicular function.",
      "note": "Approved hCG products transitioned to biologic licenses in March 2020, taking hCG outside the 503A/503B bulk-compounding framework entirely — ask the supplier what they actually dispense.",
      "label": {
        "frame": "pl--vial-lyophilized",
        "image": "vial-lyophilized",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">HCG</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span>',
        "names": [
          "HCG"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×1 · Vial ×1",
      "rows": [
        {
          "name": "HCG 6000IU Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "HCG (10,000 IU)",
          "meta": "10,000 IU · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "oxytocin",
      "cat": "hormone",
      "channels": [
        "MyViaHealth"
      ],
      "status": "approved",
      "search": "oxytocin posterior-pituitary nonapeptide; uterotonic and social-bonding neuromodulator.",
      "chips": [
        {
          "cls": "pep-chip--ok",
          "label": "Approved-drug substance"
        }
      ],
      "name": "Oxytocin",
      "mech": "Posterior-pituitary nonapeptide; uterotonic and social-bonding neuromodulator.",
      "note": "Active ingredient of FDA-approved drugs; 503B interim list marks it as an approved-drug component.",
      "label": {
        "frame": "pl--vial-liquid",
        "image": "vial-liquid",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">Oxytocin</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Vial</span></span><span class="pl-bc"></span></span>',
        "names": [
          "Oxytocin"
        ],
        "forms": [
          "Vial"
        ]
      },
      "preparations": "Vial ×1",
      "rows": [
        {
          "name": "Oxytocin (10mg)",
          "meta": "10mg vial · MyViaHealth"
        }
      ],
      "na": "",
      "orderNote": "503A, patient-specific prescriptions only — significant-difference note required.",
      "request": {
        "label": "Request pricing",
        "href": "mailto:gabe@albacetemeddev.com?subject=Peptide%20pricing%20request%20%E2%80%94%20Oxytocin&body=Please%20do%20not%20include%20patient%20names%20or%20health%20information.%0D%0A%0D%0APractice%20name%3A%0D%0APrescriber%20name%20and%20credentials%3A%0D%0ANPI%3A%0D%0AState%20license%20number%20and%20state%3A%0D%0AStates%20where%20your%20patients%20receive%20preparations%3A%0D%0APreparation%20and%20channel%3A%0D%0A%0D%0AI%20confirm%20I%20am%20a%20licensed%20prescriber%2C%20or%20practice%20staff%20requesting%20on%20a%20prescriber%27s%20behalf.",
        "describedBy": "pep-ord-oxytocin"
      }
    },
    {
      "key": "ara-290",
      "cat": "recovery",
      "channels": [
        "MyViaHealth"
      ],
      "status": "cat3",
      "search": "ara-290 erythropoietin-derived innate-repair-receptor agonist (cibinetide) without erythropoietic effect.",
      "chips": [
        {
          "cls": "pep-chip--warn",
          "label": "Bulks Category 3"
        }
      ],
      "name": "ARA-290",
      "mech": "Erythropoietin-derived innate-repair-receptor agonist (cibinetide) without erythropoietic effect.",
      "note": "503A Category 3 — nominated with inadequate supporting information.",
      "label": {
        "frame": "pl--vial-liquid",
        "image": "vial-liquid",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">ARA-290</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Vial</span></span><span class="pl-bc"></span></span>',
        "names": [
          "ARA-290"
        ],
        "forms": [
          "Vial"
        ]
      },
      "preparations": "Vial ×2",
      "rows": [
        {
          "name": "ARA-290 (10mg)",
          "meta": "10mg vial · MyViaHealth"
        },
        {
          "name": "ARA-290 (16mg)",
          "meta": "16mg vial · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "bpc-157",
      "cat": "recovery",
      "channels": [
        "MyViaHealth"
      ],
      "status": "withdrawn",
      "search": "bpc-157 synthetic gastric pentadecapeptide studied preclinically for angiogenesis and tendon/gut repair.",
      "chips": [
        {
          "cls": "pep-chip--warn",
          "label": "Nomination withdrawn"
        }
      ],
      "name": "BPC-157",
      "mech": "Synthetic gastric pentadecapeptide studied preclinically for angiogenesis and tendon/gut repair.",
      "note": "On FDA's 2023 safety-risk list, later moved to nominated-but-withdrawn; no active authorization today. A July 2026 advisory committee vote recommended future listing — non-binding, nothing compoundable yet.",
      "label": {
        "frame": "pl--vial-lyophilized",
        "image": "vial-lyophilized",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">BPC-157</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span>',
        "names": [
          "BPC-157"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×1 · Pen ×1 · Reconstituted Vial ×2 · Vial ×3",
      "rows": [
        {
          "name": "BPC-157 10MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "BPC-157 10mg (1mg/ml 10ml vial)",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "BPC-157 10mg 3mL Pen (3.33mg/mL)",
          "meta": "Pen · MyViaHealth"
        },
        {
          "name": "BPC-157 20mg (2mg/ml 10ml vial)",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "BPC-157 (10mg/3ml)",
          "meta": "10mg/3ml · MyViaHealth"
        },
        {
          "name": "BPC-157 (10mg/5ml)",
          "meta": "10mg/5ml · MyViaHealth"
        },
        {
          "name": "BPC-157 (5mg)",
          "meta": "5mg vial · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "mgf",
      "cat": "recovery",
      "channels": [
        "MyViaHealth"
      ],
      "status": "cat3",
      "search": "mgf mechano growth factor — igf-1 splice variant expressed after mechanical muscle stress.",
      "chips": [
        {
          "cls": "pep-chip--warn",
          "label": "Bulks Category 3"
        }
      ],
      "name": "MGF",
      "mech": "Mechano growth factor — IGF-1 splice variant expressed after mechanical muscle stress.",
      "note": "503A Category 3 — nominated without sufficient supporting information; not authorized.",
      "label": {
        "frame": "pl--vial-liquid",
        "image": "vial-liquid",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">MGF</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Vial</span></span><span class="pl-bc"></span></span>',
        "names": [
          "MGF"
        ],
        "forms": [
          "Vial"
        ]
      },
      "preparations": "Vial ×1",
      "rows": [
        {
          "name": "MGF (5mg)",
          "meta": "5mg vial · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "peg-mgf",
      "cat": "recovery",
      "channels": [
        "MyViaHealth"
      ],
      "status": "withdrawn",
      "search": "peg-mgf pegylated mgf extending half-life of the splice-variant peptide.",
      "chips": [
        {
          "cls": "pep-chip--warn",
          "label": "Nomination withdrawn"
        }
      ],
      "name": "PEG-MGF",
      "mech": "PEGylated MGF extending half-life of the splice-variant peptide.",
      "note": "Former 503A Category 2; nomination withdrawn — on no current list.",
      "label": {
        "frame": "pl--vial-liquid",
        "image": "vial-liquid",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">PEG-MGF</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Vial</span></span><span class="pl-bc"></span></span>',
        "names": [
          "PEG-MGF"
        ],
        "forms": [
          "Vial"
        ]
      },
      "preparations": "Vial ×1",
      "rows": [
        {
          "name": "PEG-MGF (5mg)",
          "meta": "5mg vial · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "tb-500",
      "cat": "recovery",
      "channels": [
        "MyViaHealth"
      ],
      "status": "withdrawn",
      "search": "tb-500 (thymosin beta-4) thymosin beta-4 fragment involved in actin regulation, cell migration and angiogenesis.",
      "chips": [
        {
          "cls": "pep-chip--warn",
          "label": "Nomination withdrawn"
        }
      ],
      "name": "TB-500 (Thymosin Beta-4)",
      "mech": "Thymosin beta-4 fragment involved in actin regulation, cell migration and angiogenesis.",
      "note": "Same 2023 cohort as BPC-157, now nominated-but-withdrawn (FDA's entry covers the LKKTETQ fragment); no active authorization.",
      "label": {
        "frame": "pl--vial-lyophilized",
        "image": "vial-lyophilized",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">TB-500</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-sub">Thymosin Beta-4</span><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span>',
        "names": [
          "TB-500"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×1 · Pen ×1 · Reconstituted Vial ×1 · Vial ×1",
      "rows": [
        {
          "name": "TB-500 10MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "TB-500 10mg (1mg/ml) 10mg vial",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "TB-500 10mg 3mL Pen (3.33mg/mL)",
          "meta": "Pen · MyViaHealth"
        },
        {
          "name": "Thymosin Beta-4 (TB-500) (15mg)",
          "meta": "15mg vial · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "wolverine",
      "cat": "recovery",
      "channels": [
        "MyViaHealth"
      ],
      "status": "withdrawn",
      "search": "wolverine (bpc-157 / tb-500) bpc-157 + tb-500 recovery blend.",
      "chips": [
        {
          "cls": "pep-chip--warn",
          "label": "Nomination withdrawn"
        }
      ],
      "name": "Wolverine (BPC-157 / TB-500)",
      "mech": "BPC-157 + TB-500 recovery blend.",
      "note": "Blend status follows its least-permissive component (BPC-157): On FDA's 2023 safety-risk list, later moved to nominated-but-withdrawn; no active authorization today. A July 2026 advisory committee vote recommended future listing — non-binding, nothing compoundable yet.",
      "label": {
        "frame": "pl--vial-pair",
        "image": "vial-pair",
        "labelHtml": '<span class="pl pl--l"><span class="pl-hd pl-hd--f"><span class="pl-fam">Wolverine</span><span class="pl-name">BPC-157</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span><span class="pl pl--r"><span class="pl-hd pl-hd--f"><span class="pl-fam">Wolverine</span><span class="pl-name">TB-500</span></span><span class="pl-gl"></span><span class="pl-bd"></span><span class="pl-bc"></span></span>',
        "names": [
          "BPC-157",
          "TB-500"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×3 · Pen ×3 · Reconstituted Vial ×3 · Vial ×3",
      "rows": [
        {
          "name": "(GLOW) GHK-Cu/BPC-157/TB-500 50/10/10 mg Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "(KLOW) GHK-Cu/BPC-157/TB-500/KPV 50/10/10/10 Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "BPC-157/TB-500 (Wolverine) 10mg/10mg 3mL Pen (3.33mg/3.33mg per mL)",
          "meta": "Pen · MyViaHealth"
        },
        {
          "name": "GLOW (BPC-157/TB-500/GHK) 10/10/50mg 3mL Pen",
          "meta": "Pen · MyViaHealth"
        },
        {
          "name": "GLOW (BPC-157/TB-500/GHK-Cu) 10/10/50mg (10ML Vial)",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "KLOW (KPV/BPC-157/TB-500/GHK) 10/10/10/50mg 3mL Pen",
          "meta": "Pen · MyViaHealth"
        },
        {
          "name": "KLOW (KPV/BPC-157/TB-500/GHK-CU) 10/10/10/50mg 10ml",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "Wolverine BPC-157 10mg TB-500 10mg 10ml",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "Wolverine BPC-157/TB-500 10/10 mg Lyophilized - Blend",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "GLOW Blend GHK-Cu/BPC-157/TB500 (50/10/10mg)",
          "meta": "50/10/10mg · MyViaHealth"
        },
        {
          "name": "KLOW Blend GHK-Cu/BPC-157/TB500/KPV (5/10/10/10mg)",
          "meta": "5/10/10/10mg · MyViaHealth"
        },
        {
          "name": "Wolverine Blend BPC-157/TB500 (10/10mg)",
          "meta": "10mg/10mg · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "atx-304",
      "cat": "longevity",
      "channels": [
        "MyViaHealth"
      ],
      "status": "not-listed",
      "search": "atx-304 ampk-pathway small molecule ordered in metabolic-endurance protocols.",
      "chips": [
        {
          "cls": "pep-chip--stop",
          "label": "No compounding pathway"
        }
      ],
      "name": "ATX-304",
      "mech": "AMPK-pathway small molecule ordered in metabolic-endurance protocols.",
      "note": "Not on any FDA compounding list; not an approved drug (small molecule, not a peptide).",
      "label": {
        "frame": "pl--capsules",
        "image": "capsules",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">ATX-304</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Capsules</span></span><span class="pl-bc"></span></span>',
        "names": [
          "ATX-304"
        ],
        "forms": [
          "Capsules"
        ]
      },
      "preparations": "Capsules ×1",
      "rows": [
        {
          "name": "ATX-304 Capsules (50mg/60ct)",
          "meta": "50mg x60 caps · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "dihexa",
      "cat": "longevity",
      "channels": [
        "MyViaHealth"
      ],
      "status": "withdrawn",
      "search": "dihexa angiotensin iv-derived hexapeptide studied preclinically for hgf/c-met-linked synaptogenesis.",
      "chips": [
        {
          "cls": "pep-chip--warn",
          "label": "Nomination withdrawn"
        }
      ],
      "name": "Dihexa",
      "mech": "Angiotensin IV-derived hexapeptide studied preclinically for HGF/c-Met-linked synaptogenesis.",
      "note": "Withdrawn from the 2023 safety-risk list by nominator; FDA noted no human exposure data by any route. No authorization.",
      "label": {
        "frame": "pl--capsules",
        "image": "capsules",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">Dihexa</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Capsules</span></span><span class="pl-bc"></span></span>',
        "names": [
          "Dihexa"
        ],
        "forms": [
          "Capsules"
        ]
      },
      "preparations": "Capsules ×1",
      "rows": [
        {
          "name": "Dihexa Capsules (10mg/30ct)",
          "meta": "10mg x30 caps · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "dsip",
      "cat": "longevity",
      "channels": [
        "MyViaHealth"
      ],
      "status": "withdrawn",
      "search": "dsip delta sleep-inducing peptide studied for sleep architecture and stress-axis modulation.",
      "chips": [
        {
          "cls": "pep-chip--warn",
          "label": "Nomination withdrawn"
        }
      ],
      "name": "DSIP",
      "mech": "Delta sleep-inducing peptide studied for sleep architecture and stress-axis modulation.",
      "note": "Nominated-but-withdrawn; the July 2026 advisory committee voted against listing DSIP (emideltide).",
      "label": {
        "frame": "pl--vial-lyophilized",
        "image": "vial-lyophilized",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">DSIP</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span>',
        "names": [
          "DSIP"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×1 · Pen ×1 · Vial ×1",
      "rows": [
        {
          "name": "DSIP 5mg 3mL Pen",
          "meta": "Pen · MyViaHealth"
        },
        {
          "name": "Dsip 5MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "DSIP (5mg)",
          "meta": "5mg vial · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "epithalon",
      "cat": "longevity",
      "channels": [
        "MyViaHealth"
      ],
      "status": "withdrawn",
      "search": "epithalon synthetic pineal tetrapeptide (aedg) studied in russian literature for telomerase activation.",
      "chips": [
        {
          "cls": "pep-chip--warn",
          "label": "Nomination withdrawn"
        }
      ],
      "name": "Epithalon",
      "mech": "Synthetic pineal tetrapeptide (AEDG) studied in Russian literature for telomerase activation.",
      "note": "Nominated-but-withdrawn; the July 2026 advisory committee recommended listing (non-binding, no rule yet).",
      "label": {
        "frame": "pl--vial-lyophilized",
        "image": "vial-lyophilized",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">Epithalon</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span>',
        "names": [
          "Epithalon"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×1 · Vial ×3",
      "rows": [
        {
          "name": "Epithalon 10MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "Epithalon (10mg)",
          "meta": "10mg vial · MyViaHealth"
        },
        {
          "name": "Epithalon (20mg)",
          "meta": "20mg vial · MyViaHealth"
        },
        {
          "name": "Epithalon (50mg)",
          "meta": "50mg vial · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "foxo4-dri",
      "cat": "longevity",
      "channels": [
        "MyViaHealth"
      ],
      "status": "not-listed",
      "search": "foxo4-dri d-retro-inverso foxo4-p53 interference peptide inducing apoptosis in senescent cells.",
      "chips": [
        {
          "cls": "pep-chip--stop",
          "label": "No compounding pathway"
        }
      ],
      "name": "FOXO4-DRI",
      "mech": "D-retro-inverso FOXO4-p53 interference peptide inducing apoptosis in senescent cells.",
      "note": "Never nominated to the bulks lists; no FDA evaluation exists.",
      "label": {
        "frame": "pl--vial-liquid",
        "image": "vial-liquid",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">FOXO4-DRI</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Vial</span></span><span class="pl-bc"></span></span>',
        "names": [
          "FOXO4-DRI"
        ],
        "forms": [
          "Vial"
        ]
      },
      "preparations": "Vial ×1",
      "rows": [
        {
          "name": "FOXO4-DRI (10mg)",
          "meta": "10mg vial · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "mots-c",
      "cat": "longevity",
      "channels": [
        "MyViaHealth"
      ],
      "status": "withdrawn",
      "search": "mots-c mitochondrial-derived peptide regulating metabolic homeostasis via ampk.",
      "chips": [
        {
          "cls": "pep-chip--warn",
          "label": "Nomination withdrawn"
        }
      ],
      "name": "MOTS-C",
      "mech": "Mitochondrial-derived peptide regulating metabolic homeostasis via AMPK.",
      "note": "Nominated-but-withdrawn; July 2026 advisory committee recommended listing (non-binding).",
      "label": {
        "frame": "pl--pen",
        "image": "pen",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">MOTS-C</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Pen</span></span><span class="pl-bc"></span></span>',
        "names": [
          "MOTS-C"
        ],
        "forms": [
          "Pen"
        ]
      },
      "preparations": "Pen ×2 · Reconstituted Vial ×1 · Vial ×1",
      "rows": [
        {
          "name": "MOTS-C 10mg 3mL Pen (3.33mg/mL)",
          "meta": "Pen · MyViaHealth"
        },
        {
          "name": "MOTS-C 20mg 3mL Pen (6.67mg/mL)",
          "meta": "Pen · MyViaHealth"
        },
        {
          "name": "MOTS-C 25mg (5mg/ml 5ml vial)",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "MOTS-C (10mg)",
          "meta": "10mg vial · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "ss-31",
      "cat": "longevity",
      "channels": [
        "MyViaHealth"
      ],
      "status": "approved",
      "search": "ss-31 (elamipretide) cardiolipin-binding tetrapeptide (elamipretide) supporting inner-mitochondrial-membrane function.",
      "chips": [
        {
          "cls": "pep-chip--ok",
          "label": "Approved-drug substance"
        }
      ],
      "name": "SS-31 (Elamipretide)",
      "mech": "Cardiolipin-binding tetrapeptide (elamipretide) supporting inner-mitochondrial-membrane function.",
      "note": "Active ingredient of an FDA-approved drug (elamipretide, Sept 2025, Barth syndrome). Approved-drug pathway with essentially-a-copy limits.",
      "label": {
        "frame": "pl--vial-lyophilized",
        "image": "vial-lyophilized",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">SS-31</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-sub">Elamipretide</span><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span>',
        "names": [
          "SS-31"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×1 · Reconstituted Vial ×1 · Vial ×1",
      "rows": [
        {
          "name": "SS-31 1 mg/ml (10ML Vial)",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "SS-31 10MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "SS-31 / Elamipretide (25mg)",
          "meta": "25mg vial · MyViaHealth"
        }
      ],
      "na": "",
      "orderNote": "503A, patient-specific prescriptions only — significant-difference note required.",
      "request": {
        "label": "Request pricing",
        "href": "mailto:gabe@albacetemeddev.com?subject=Peptide%20pricing%20request%20%E2%80%94%20SS-31%20%28Elamipretide%29&body=Please%20do%20not%20include%20patient%20names%20or%20health%20information.%0D%0A%0D%0APractice%20name%3A%0D%0APrescriber%20name%20and%20credentials%3A%0D%0ANPI%3A%0D%0AState%20license%20number%20and%20state%3A%0D%0AStates%20where%20your%20patients%20receive%20preparations%3A%0D%0APreparation%20and%20channel%3A%0D%0A%0D%0AI%20confirm%20I%20am%20a%20licensed%20prescriber%2C%20or%20practice%20staff%20requesting%20on%20a%20prescriber%27s%20behalf.",
        "describedBy": "pep-ord-ss-31"
      }
    },
    {
      "key": "nad",
      "cat": "metabolic",
      "channels": [
        "MyPharmacyOrder",
        "MyViaHealth"
      ],
      "status": "cat1",
      "search": "nad+ nicotinamide adenine dinucleotide — the central redox coenzyme of cellular energy metabolism.",
      "chips": [
        {
          "cls": "pep-chip--ok",
          "label": "Bulks Category 1"
        }
      ],
      "name": "NAD+",
      "mech": "Nicotinamide adenine dinucleotide — the central redox coenzyme of cellular energy metabolism.",
      "note": "503A and 503B Category 1 as NAD+. Salt-form caveat: the disodium salt trihydrate sits in Category 3 — confirm the form your pharmacy dispenses.",
      "label": {
        "frame": "pl--vial-liquid",
        "image": "vial-liquid",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">NAD+</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Injectable</span></span><span class="pl-bc"></span></span>',
        "names": [
          "NAD+"
        ],
        "forms": [
          "Injectable"
        ]
      },
      "preparations": "Compounded Vial ×2 · Injectable ×5 · Lyophilized ×2 · Nasal Spray ×3 · Pen ×1 · Reconstituted Vial ×1 · Vial ×2",
      "rows": [
        {
          "name": "NAD+ - 1000MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "NAD+ - 500MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "NAD+ 1000mg (100mg/ml 10ml vial)",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "NAD+ 1000mg 200mg/ml (5ml Vial)",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "NAD+ 1000mg 3mL Pen (333mg/mL)",
          "meta": "Pen · MyViaHealth"
        },
        {
          "name": "NAD+ 2000mg 200mg/ml (10ml vial)",
          "meta": "Compounded Vial · MyViaHealth"
        },
        {
          "name": "NAD+",
          "meta": "30mL · 50mg/mL Nasal Spray · MyPharmacyOrder"
        },
        {
          "name": "NAD+",
          "meta": "7.5mL · 300mg/mL Nasal Spray · MyPharmacyOrder"
        },
        {
          "name": "NAD+",
          "meta": "15mL · 300mg/mL Nasal Spray · MyPharmacyOrder"
        },
        {
          "name": "NAD+",
          "meta": "5mL · 1mg/mL Injectable · MyPharmacyOrder"
        },
        {
          "name": "NAD+",
          "meta": "10mL · 100mg/mL Injectable · MyPharmacyOrder"
        },
        {
          "name": "NAD+",
          "meta": "20mL, 2 vials · 100mg/mL Injectable · MyPharmacyOrder"
        },
        {
          "name": "NAD+",
          "meta": "5mL · 200mg/mL Injectable · MyPharmacyOrder"
        },
        {
          "name": "NAD+",
          "meta": "10mL, 2 vials · 200mg/mL Injectable · MyPharmacyOrder"
        },
        {
          "name": "NAD+ (1000mg)",
          "meta": "1000mg vial · MyViaHealth"
        },
        {
          "name": "NAD+ (500mg)",
          "meta": "500mg vial · MyViaHealth"
        }
      ],
      "na": "",
      "orderNote": "Confirm the 503A or 503B pathway with the dispensing entity before ordering.",
      "request": {
        "label": "Request pricing",
        "href": "mailto:gabe@albacetemeddev.com?subject=Peptide%20pricing%20request%20%E2%80%94%20NAD%2B&body=Please%20do%20not%20include%20patient%20names%20or%20health%20information.%0D%0A%0D%0APractice%20name%3A%0D%0APrescriber%20name%20and%20credentials%3A%0D%0ANPI%3A%0D%0AState%20license%20number%20and%20state%3A%0D%0AStates%20where%20your%20patients%20receive%20preparations%3A%0D%0APreparation%20and%20channel%3A%0D%0A%0D%0AI%20confirm%20I%20am%20a%20licensed%20prescriber%2C%20or%20practice%20staff%20requesting%20on%20a%20prescriber%27s%20behalf.",
        "describedBy": "pep-ord-nad"
      }
    },
    {
      "key": "ghk-cu",
      "cat": "skin",
      "channels": [
        "MyViaHealth"
      ],
      "status": "cat1",
      "search": "ghk-cu copper tripeptide signaling collagen synthesis, angiogenesis and tissue remodeling.",
      "chips": [
        {
          "cls": "pep-chip--ok",
          "label": "Bulks Category 1"
        }
      ],
      "name": "GHK-Cu",
      "mech": "Copper tripeptide signaling collagen synthesis, angiogenesis and tissue remodeling.",
      "note": "Category 1 for non-injectable routes only; the injectable nomination was withdrawn April 2026 — confirm route with the pharmacy.",
      "label": {
        "frame": "pl--vial-lyophilized",
        "image": "vial-lyophilized",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">GHK-Cu</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span>',
        "names": [
          "GHK-Cu"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×1 · Pen ×1 · Reconstituted Vial ×1 · Vial ×2",
      "rows": [
        {
          "name": "GHK-Cu 50MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "GHK-Cu 50mg (5mg/ml 10ml vial)",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "GHK-Cu 50mg 3mL Pen (16.67 mg/mL)",
          "meta": "Pen · MyViaHealth"
        },
        {
          "name": "GHK-Cu (100mg)",
          "meta": "100mg vial · MyViaHealth"
        },
        {
          "name": "GHK-Cu (50mg)",
          "meta": "50mg vial · MyViaHealth"
        }
      ],
      "na": "",
      "orderNote": "Confirm the 503A or 503B pathway with the dispensing entity before ordering.",
      "request": {
        "label": "Request pricing",
        "href": "mailto:gabe@albacetemeddev.com?subject=Peptide%20pricing%20request%20%E2%80%94%20GHK-Cu&body=Please%20do%20not%20include%20patient%20names%20or%20health%20information.%0D%0A%0D%0APractice%20name%3A%0D%0APrescriber%20name%20and%20credentials%3A%0D%0ANPI%3A%0D%0AState%20license%20number%20and%20state%3A%0D%0AStates%20where%20your%20patients%20receive%20preparations%3A%0D%0APreparation%20and%20channel%3A%0D%0A%0D%0AI%20confirm%20I%20am%20a%20licensed%20prescriber%2C%20or%20practice%20staff%20requesting%20on%20a%20prescriber%27s%20behalf.",
        "describedBy": "pep-ord-ghk-cu"
      }
    },
    {
      "key": "ghk-kpv",
      "cat": "skin",
      "channels": [
        "MyViaHealth"
      ],
      "status": "withdrawn",
      "search": "ghk-cu / kpv copper peptide + anti-inflammatory tripeptide blend.",
      "chips": [
        {
          "cls": "pep-chip--warn",
          "label": "Nomination withdrawn"
        }
      ],
      "name": "GHK-Cu / KPV",
      "mech": "Copper peptide + anti-inflammatory tripeptide blend.",
      "note": "Blend status follows its least-permissive component (KPV): Not listed; reviewed by FDA's advisory committee July 2026 for wound healing (advisory only).",
      "label": {
        "frame": "pl--vial-pair",
        "image": "vial-pair",
        "labelHtml": '<span class="pl pl--l"><span class="pl-hd"><span class="pl-name">GHK-Cu</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span><span class="pl pl--r"><span class="pl-hd"><span class="pl-name">KPV</span></span><span class="pl-gl"></span><span class="pl-bd"></span><span class="pl-bc"></span></span>',
        "names": [
          "GHK-Cu",
          "KPV"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×1",
      "rows": [
        {
          "name": "GHK-Cu/KPV 50/10 mg Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "glow",
      "cat": "skin",
      "channels": [
        "MyViaHealth"
      ],
      "status": "withdrawn",
      "search": "glow (ghk-cu / bpc-157 / tb-500) ghk-cu + bpc-157 + tb-500 skin-and-recovery blend.",
      "chips": [
        {
          "cls": "pep-chip--warn",
          "label": "Nomination withdrawn"
        }
      ],
      "name": "GLOW (GHK-Cu / BPC-157 / TB-500)",
      "mech": "GHK-Cu + BPC-157 + TB-500 skin-and-recovery blend.",
      "note": "Blend status follows its least-permissive component (BPC-157): On FDA's 2023 safety-risk list, later moved to nominated-but-withdrawn; no active authorization today. A July 2026 advisory committee vote recommended future listing — non-binding, nothing compoundable yet.",
      "label": {
        "frame": "pl--vial-pair",
        "image": "vial-pair",
        "labelHtml": '<span class="pl pl--l"><span class="pl-hd pl-hd--f"><span class="pl-fam">GLOW</span><span class="pl-name">GHK-Cu</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Vial</span></span><span class="pl-bc"></span></span><span class="pl pl--r" style="--kn:0.74"><span class="pl-hd pl-hd--f"><span class="pl-fam">GLOW</span><span class="pl-name">BPC-157 · TB-500</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Vial</span></span><span class="pl-bc"></span></span>',
        "names": [
          "GHK-Cu",
          "BPC-157 · TB-500"
        ],
        "forms": [
          "Vial",
          "Vial"
        ]
      },
      "preparations": "Vial ×2",
      "rows": [
        {
          "name": "GLOW Blend (70/10/10mg 3ml)",
          "meta": "70/10/10mg 3ml · MyViaHealth"
        },
        {
          "name": "GLOW Blend (70/10/10mg 5ml)",
          "meta": "70/10/10mg 5ml · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "melanotan-1",
      "cat": "skin",
      "channels": [
        "MyViaHealth"
      ],
      "status": "not-listed",
      "search": "melanotan i linear α-msh analog (afamelanotide&#x27;s parent structure) driving eumelanin synthesis.",
      "chips": [
        {
          "cls": "pep-chip--stop",
          "label": "No compounding pathway"
        }
      ],
      "name": "Melanotan I",
      "mech": "Linear α-MSH analog (afamelanotide's parent structure) driving eumelanin synthesis.",
      "note": "Afamelanotide is the approved relative; bulk melanotan I has no established compounding authorization.",
      "label": {
        "frame": "pl--vial-lyophilized",
        "image": "vial-lyophilized",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">Melanotan I</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span>',
        "names": [
          "Melanotan I"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×2",
      "rows": [
        {
          "name": "MELANOTAN 1 - 10 mg",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "Melanotan-1 (MT-1) - 10MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "melanotan-2",
      "cat": "skin",
      "channels": [
        "MyViaHealth"
      ],
      "status": "withdrawn",
      "search": "melanotan ii cyclic α-msh analog with pigmentation and libido effects via mc1r/mc4r.",
      "chips": [
        {
          "cls": "pep-chip--warn",
          "label": "Nomination withdrawn"
        }
      ],
      "name": "Melanotan II",
      "mech": "Cyclic α-MSH analog with pigmentation and libido effects via MC1R/MC4R.",
      "note": "Removed from Category 2 by nominator withdrawal — not a safety clearance; no active authorization.",
      "label": {
        "frame": "pl--vial-lyophilized",
        "image": "vial-lyophilized",
        "labelHtml": '<span class="pl" style="--kn:0.97"><span class="pl-hd"><span class="pl-name">Melanotan II</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span>',
        "names": [
          "Melanotan II"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×2 · Vial ×1",
      "rows": [
        {
          "name": "MELANOTAN 2 - 10 mg",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "Melanotan-2 (MT-2) 10MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "Melanotan II (10mg)",
          "meta": "10mg vial · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "pinealon",
      "cat": "cognitive",
      "channels": [
        "MyViaHealth"
      ],
      "status": "not-listed",
      "search": "pinealon synthetic tripeptide (edr) from the russian peptide-bioregulator literature.",
      "chips": [
        {
          "cls": "pep-chip--stop",
          "label": "No compounding pathway"
        }
      ],
      "name": "Pinealon",
      "mech": "Synthetic tripeptide (EDR) from the Russian peptide-bioregulator literature.",
      "note": "No listing history in any FDA category; no authorization.",
      "label": {
        "frame": "pl--vial-lyophilized",
        "image": "vial-lyophilized",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">Pinealon</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span>',
        "names": [
          "Pinealon"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×1 · Vial ×2",
      "rows": [
        {
          "name": "PINEALON - 10 mg",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "Pinealon (10mg)",
          "meta": "10mg vial · MyViaHealth"
        },
        {
          "name": "Pinealon (20mg)",
          "meta": "20mg vial · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "selank",
      "cat": "cognitive",
      "channels": [
        "MyViaHealth"
      ],
      "status": "withdrawn",
      "search": "selank tuftsin-analog heptapeptide studied in russian literature for anxiolytic effect without sedation.",
      "chips": [
        {
          "cls": "pep-chip--warn",
          "label": "Nomination withdrawn"
        }
      ],
      "name": "Selank",
      "mech": "Tuftsin-analog heptapeptide studied in Russian literature for anxiolytic effect without sedation.",
      "note": "Removed from Category 2 by nominator withdrawal — not a safety clearance; no active authorization.",
      "label": {
        "frame": "pl--vial-lyophilized",
        "image": "vial-lyophilized",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">Selank</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span>',
        "names": [
          "Selank"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×1 · Reconstituted Vial ×1 · Vial ×1",
      "rows": [
        {
          "name": "Selank 10MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "Selank 10mg (1mg/ml) 10ml",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "Selank (5mg)",
          "meta": "5mg vial · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "selank-semax",
      "cat": "cognitive",
      "channels": [
        "MyViaHealth"
      ],
      "status": "withdrawn",
      "search": "selank / semax combined anxiolytic + nootropic neuropeptide blend.",
      "chips": [
        {
          "cls": "pep-chip--warn",
          "label": "Nomination withdrawn"
        }
      ],
      "name": "Selank / Semax",
      "mech": "Combined anxiolytic + nootropic neuropeptide blend.",
      "note": "Blend status follows its least-permissive component (SELANK): Removed from Category 2 by nominator withdrawal — not a safety clearance; no active authorization.",
      "label": {
        "frame": "pl--vial-pair",
        "image": "vial-pair",
        "labelHtml": '<span class="pl pl--l"><span class="pl-hd"><span class="pl-name">Selank</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Vial</span></span><span class="pl-bc"></span></span><span class="pl pl--r"><span class="pl-hd"><span class="pl-name">Semax</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Vial</span></span><span class="pl-bc"></span></span>',
        "names": [
          "Selank",
          "Semax"
        ],
        "forms": [
          "Vial",
          "Vial"
        ]
      },
      "preparations": "Vial ×1",
      "rows": [
        {
          "name": "Selank / Semax Blend (10mg/10mg)",
          "meta": "10mg/10mg · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "semax",
      "cat": "cognitive",
      "channels": [
        "MyViaHealth"
      ],
      "status": "withdrawn",
      "search": "semax acth 4-10 analog studied for bdnf upregulation and cognitive performance.",
      "chips": [
        {
          "cls": "pep-chip--warn",
          "label": "Nomination withdrawn"
        }
      ],
      "name": "Semax",
      "mech": "ACTH 4-10 analog studied for BDNF upregulation and cognitive performance.",
      "note": "Not listed; reviewed by FDA's advisory committee July 2026 (advisory only — rulemaking still required).",
      "label": {
        "frame": "pl--vial-lyophilized",
        "image": "vial-lyophilized",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">Semax</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span>',
        "names": [
          "Semax"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×1 · Reconstituted Vial ×1 · Vial ×2",
      "rows": [
        {
          "name": "Semax - 10MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "Semax 10mg (1mg/ml) 10ml",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "Semax (30mg)",
          "meta": "30mg vial · MyViaHealth"
        },
        {
          "name": "Semax (5mg)",
          "meta": "5mg vial · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "kpv",
      "cat": "immune",
      "channels": [
        "MyViaHealth"
      ],
      "status": "withdrawn",
      "search": "kpv α-msh c-terminal tripeptide with anti-inflammatory signaling at mc1r.",
      "chips": [
        {
          "cls": "pep-chip--warn",
          "label": "Nomination withdrawn"
        }
      ],
      "name": "KPV",
      "mech": "α-MSH C-terminal tripeptide with anti-inflammatory signaling at MC1R.",
      "note": "Not listed; reviewed by FDA's advisory committee July 2026 for wound healing (advisory only).",
      "label": {
        "frame": "pl--vial-lyophilized",
        "image": "vial-lyophilized",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">KPV</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span>',
        "names": [
          "KPV"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×1 · Vial ×1",
      "rows": [
        {
          "name": "KPV 10MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "KPV (5mg)",
          "meta": "5mg vial · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "ll-37",
      "cat": "immune",
      "channels": [
        "MyViaHealth"
      ],
      "status": "withdrawn",
      "search": "ll-37 human cathelicidin host-defense peptide with antimicrobial and immunomodulatory activity.",
      "chips": [
        {
          "cls": "pep-chip--warn",
          "label": "Nomination withdrawn"
        }
      ],
      "name": "LL-37",
      "mech": "Human cathelicidin host-defense peptide with antimicrobial and immunomodulatory activity.",
      "note": "Removed from Category 2 by nominator withdrawal — not a safety clearance; no active authorization.",
      "label": {
        "frame": "pl--vial-liquid",
        "image": "vial-liquid",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">LL-37</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Vial</span></span><span class="pl-bc"></span></span>',
        "names": [
          "LL-37"
        ],
        "forms": [
          "Vial"
        ]
      },
      "preparations": "Vial ×1",
      "rows": [
        {
          "name": "LL-37 (5mg)",
          "meta": "5mg vial · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "pnc-27",
      "cat": "immune",
      "channels": [
        "MyViaHealth"
      ],
      "status": "not-listed",
      "search": "pnc-27 p53-derived membranolytic peptide studied in vitro against cancer cell lines.",
      "chips": [
        {
          "cls": "pep-chip--stop",
          "label": "No compounding pathway"
        }
      ],
      "name": "PNC-27",
      "mech": "p53-derived membranolytic peptide studied in vitro against cancer cell lines.",
      "note": "No listing history; FDA has previously warned on marketing claims for this peptide. Strictly investigational.",
      "label": {
        "frame": "pl--vial-liquid",
        "image": "vial-liquid",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">PNC-27</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Vial</span></span><span class="pl-bc"></span></span>',
        "names": [
          "PNC-27"
        ],
        "forms": [
          "Vial"
        ]
      },
      "preparations": "Vial ×1",
      "rows": [
        {
          "name": "PNC-27 (5mg)",
          "meta": "5mg vial · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "ta-1",
      "cat": "immune",
      "channels": [
        "MyViaHealth"
      ],
      "status": "cat3",
      "search": "thymosin alpha-1 thymalfasin — thymic peptide enhancing t-cell maturation and dendritic function.",
      "chips": [
        {
          "cls": "pep-chip--warn",
          "label": "Bulks Category 3"
        }
      ],
      "name": "Thymosin Alpha-1",
      "mech": "Thymalfasin — thymic peptide enhancing T-cell maturation and dendritic function.",
      "note": "503B Category 3; not on the 503A category lists. No US-approved product.",
      "label": {
        "frame": "pl--vial-lyophilized",
        "image": "vial-lyophilized",
        "labelHtml": '<span class="pl"><span class="pl-hd pl-hd--2"><span class="pl-name">Thymosin<br>Alpha-1</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span>',
        "names": [
          "ThymosinAlpha-1"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×1 · Vial ×2",
      "rows": [
        {
          "name": "Thymosin Alpha (TA-1) 10MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "Thymosin Alpha-1 (10mg/10ml)",
          "meta": "10mg/10ml · MyViaHealth"
        },
        {
          "name": "Thymosin Alpha-1 (10mg/3ml)",
          "meta": "10mg/3ml · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "thymulin",
      "cat": "immune",
      "channels": [
        "MyViaHealth"
      ],
      "status": "cat3",
      "search": "thymulin zinc-dependent thymic nonapeptide modulating t-cell differentiation and inflammation.",
      "chips": [
        {
          "cls": "pep-chip--warn",
          "label": "Bulks Category 3"
        }
      ],
      "name": "Thymulin",
      "mech": "Zinc-dependent thymic nonapeptide modulating T-cell differentiation and inflammation.",
      "note": "503A Category 3 (thymulin acetate); not on the 503B list.",
      "label": {
        "frame": "pl--vial-liquid",
        "image": "vial-liquid",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">Thymulin</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Vial</span></span><span class="pl-bc"></span></span>',
        "names": [
          "Thymulin"
        ],
        "forms": [
          "Vial"
        ]
      },
      "preparations": "Vial ×1",
      "rows": [
        {
          "name": "Thymulin (10mg)",
          "meta": "10mg vial · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "vip",
      "cat": "immune",
      "channels": [
        "MyViaHealth"
      ],
      "status": "cat1",
      "search": "vip vasoactive intestinal peptide — broad anti-inflammatory and bronchodilatory neuropeptide.",
      "chips": [
        {
          "cls": "pep-chip--ok",
          "label": "Bulks Category 1"
        }
      ],
      "name": "VIP",
      "mech": "Vasoactive intestinal peptide — broad anti-inflammatory and bronchodilatory neuropeptide.",
      "note": "503A Category 1. Aviptadil has no FDA approval or EUA.",
      "label": {
        "frame": "pl--vial-liquid",
        "image": "vial-liquid",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">VIP</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Vial</span></span><span class="pl-bc"></span></span>',
        "names": [
          "VIP"
        ],
        "forms": [
          "Vial"
        ]
      },
      "preparations": "Vial ×2",
      "rows": [
        {
          "name": "VIP (10mg)",
          "meta": "10mg vial · MyViaHealth"
        },
        {
          "name": "VIP (5mg)",
          "meta": "5mg vial · MyViaHealth"
        }
      ],
      "na": "",
      "orderNote": "Confirm the 503A or 503B pathway with the dispensing entity before ordering.",
      "request": {
        "label": "Request pricing",
        "href": "mailto:gabe@albacetemeddev.com?subject=Peptide%20pricing%20request%20%E2%80%94%20VIP&body=Please%20do%20not%20include%20patient%20names%20or%20health%20information.%0D%0A%0D%0APractice%20name%3A%0D%0APrescriber%20name%20and%20credentials%3A%0D%0ANPI%3A%0D%0AState%20license%20number%20and%20state%3A%0D%0AStates%20where%20your%20patients%20receive%20preparations%3A%0D%0APreparation%20and%20channel%3A%0D%0A%0D%0AI%20confirm%20I%20am%20a%20licensed%20prescriber%2C%20or%20practice%20staff%20requesting%20on%20a%20prescriber%27s%20behalf.",
        "describedBy": "pep-ord-vip"
      }
    },
    {
      "key": "kisspeptin-10",
      "cat": "sexual",
      "channels": [
        "MyViaHealth"
      ],
      "status": "cat2",
      "search": "kisspeptin-10 kiss1r agonist upstream of gnrh; governs the reproductive hormonal axis.",
      "chips": [
        {
          "cls": "pep-chip--stop",
          "label": "Category 2 — safety risk"
        }
      ],
      "name": "Kisspeptin-10",
      "mech": "KISS1R agonist upstream of GnRH; governs the reproductive hormonal axis.",
      "note": "Still in 503A Category 2 — the one 2023-cohort peptide FDA did not remove. Not permitted in 503A compounding.",
      "label": {
        "frame": "pl--vial-lyophilized",
        "image": "vial-lyophilized",
        "labelHtml": '<span class="pl" style="--kn:0.85"><span class="pl-hd"><span class="pl-name">Kisspeptin-10</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span>',
        "names": [
          "Kisspeptin-10"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×1",
      "rows": [
        {
          "name": "Kisspeptin-10 10mg Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        }
      ],
      "na": "Not available to order",
      "orderNote": "Listed for reference only.",
      "request": null
    },
    {
      "key": "pt-141",
      "cat": "sexual",
      "channels": [
        "MyViaHealth"
      ],
      "status": "approved",
      "search": "pt-141 (bremelanotide) melanocortin-4 agonist (bremelanotide) acting centrally on sexual desire pathways.",
      "chips": [
        {
          "cls": "pep-chip--ok",
          "label": "Approved-drug substance"
        }
      ],
      "name": "PT-141 (Bremelanotide)",
      "mech": "Melanocortin-4 agonist (bremelanotide) acting centrally on sexual desire pathways.",
      "note": "Active ingredient of an FDA-approved drug — approved-drug pathway applies.",
      "label": {
        "frame": "pl--vial-lyophilized",
        "image": "vial-lyophilized",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">PT-141</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-sub">Bremelanotide</span><span class="pl-form">Lyophilized</span></span><span class="pl-bc"></span></span>',
        "names": [
          "PT-141"
        ],
        "forms": [
          "Lyophilized"
        ]
      },
      "preparations": "Lyophilized ×1 · Pen ×1 · Reconstituted Vial ×1 · Vial ×1",
      "rows": [
        {
          "name": "PT-141 10MG Lyophilized",
          "meta": "Lyophilized · MyViaHealth"
        },
        {
          "name": "PT-141 10mg 3mL Pen (3.33mg/mL)",
          "meta": "Pen · MyViaHealth"
        },
        {
          "name": "PT-141 20mg (2mg/ml 10ml vial)",
          "meta": "Reconstituted Vial · MyViaHealth"
        },
        {
          "name": "PT-141 / Bremelanotide (10mg)",
          "meta": "10mg vial · MyViaHealth"
        }
      ],
      "na": "",
      "orderNote": "503A, patient-specific prescriptions only — significant-difference note required.",
      "request": {
        "label": "Request pricing",
        "href": "mailto:gabe@albacetemeddev.com?subject=Peptide%20pricing%20request%20%E2%80%94%20PT-141%20%28Bremelanotide%29&body=Please%20do%20not%20include%20patient%20names%20or%20health%20information.%0D%0A%0D%0APractice%20name%3A%0D%0APrescriber%20name%20and%20credentials%3A%0D%0ANPI%3A%0D%0AState%20license%20number%20and%20state%3A%0D%0AStates%20where%20your%20patients%20receive%20preparations%3A%0D%0APreparation%20and%20channel%3A%0D%0A%0D%0AI%20confirm%20I%20am%20a%20licensed%20prescriber%2C%20or%20practice%20staff%20requesting%20on%20a%20prescriber%27s%20behalf.",
        "describedBy": "pep-ord-pt-141"
      }
    },
    {
      "key": "bact-water",
      "cat": "ancillary",
      "channels": [
        "MyViaHealth"
      ],
      "status": "supply",
      "search": "bacteriostatic water bacteriostatic water (0.9% benzyl alcohol) for reconstitution.",
      "chips": [
        {
          "cls": "pep-chip--ok",
          "label": "Supply item"
        }
      ],
      "name": "Bacteriostatic Water",
      "mech": "Bacteriostatic water (0.9% benzyl alcohol) for reconstitution.",
      "note": "Supply item.",
      "label": {
        "frame": "pl--vial-liquid",
        "image": "vial-liquid",
        "labelHtml": '<span class="pl"><span class="pl-hd pl-hd--2"><span class="pl-name">Bacteriostatic<br>Water</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Vial</span></span><span class="pl-bc"></span></span>',
        "names": [
          "BacteriostaticWater"
        ],
        "forms": [
          "Vial"
        ]
      },
      "preparations": "Vial ×1",
      "rows": [
        {
          "name": "Bacteriostatic Water (30ml)",
          "meta": "30ml vial · MyViaHealth"
        }
      ],
      "na": "",
      "orderNote": "Supplies — not a compounded preparation.",
      "request": {
        "label": "Request pricing",
        "href": "mailto:gabe@albacetemeddev.com?subject=Peptide%20pricing%20request%20%E2%80%94%20Bacteriostatic%20Water&body=Please%20do%20not%20include%20patient%20names%20or%20health%20information.%0D%0A%0D%0APractice%20name%3A%0D%0APrescriber%20name%20and%20credentials%3A%0D%0ANPI%3A%0D%0AState%20license%20number%20and%20state%3A%0D%0AStates%20where%20your%20patients%20receive%20preparations%3A%0D%0APreparation%20and%20channel%3A%0D%0A%0D%0AI%20confirm%20I%20am%20a%20licensed%20prescriber%2C%20or%20practice%20staff%20requesting%20on%20a%20prescriber%27s%20behalf.",
        "describedBy": "pep-ord-bact-water"
      }
    },
    {
      "key": "glutathione",
      "cat": "ancillary",
      "channels": [
        "MyViaHealth"
      ],
      "status": "cat1",
      "search": "glutathione master intracellular antioxidant tripeptide (gsh).",
      "chips": [
        {
          "cls": "pep-chip--ok",
          "label": "Bulks Category 1"
        }
      ],
      "name": "Glutathione",
      "mech": "Master intracellular antioxidant tripeptide (GSH).",
      "note": "Category 1 on both the 503A and 503B interim lists.",
      "label": {
        "frame": "pl--vial-liquid",
        "image": "vial-liquid",
        "labelHtml": '<span class="pl"><span class="pl-hd"><span class="pl-name">Glutathione</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Reconstituted<br>Vial</span></span><span class="pl-bc"></span></span>',
        "names": [
          "Glutathione"
        ],
        "forms": [
          "Reconstituted / Vial"
        ]
      },
      "preparations": "Reconstituted Vial ×1",
      "rows": [
        {
          "name": "Glutathione 200mg/ml 10ml 2000mg Total",
          "meta": "Reconstituted Vial · MyViaHealth"
        }
      ],
      "na": "",
      "orderNote": "Confirm the 503A or 503B pathway with the dispensing entity before ordering.",
      "request": {
        "label": "Request pricing",
        "href": "mailto:gabe@albacetemeddev.com?subject=Peptide%20pricing%20request%20%E2%80%94%20Glutathione&body=Please%20do%20not%20include%20patient%20names%20or%20health%20information.%0D%0A%0D%0APractice%20name%3A%0D%0APrescriber%20name%20and%20credentials%3A%0D%0ANPI%3A%0D%0AState%20license%20number%20and%20state%3A%0D%0AStates%20where%20your%20patients%20receive%20preparations%3A%0D%0APreparation%20and%20channel%3A%0D%0A%0D%0AI%20confirm%20I%20am%20a%20licensed%20prescriber%2C%20or%20practice%20staff%20requesting%20on%20a%20prescriber%27s%20behalf.",
        "describedBy": "pep-ord-glutathione"
      }
    },
    {
      "key": "supplies",
      "cat": "ancillary",
      "channels": [
        "MyPharmacyOrder"
      ],
      "status": "supply",
      "search": "injection kits &amp; supplies injection kits: needles/syringes with alcohol prep pads in sub-q and im formats.",
      "chips": [
        {
          "cls": "pep-chip--ok",
          "label": "Supply item"
        }
      ],
      "name": "Injection Kits & Supplies",
      "mech": "Injection kits: needles/syringes with alcohol prep pads in sub-Q and IM formats.",
      "note": "Supply items from the 503A channel.",
      "label": {
        "frame": "pl--supplies",
        "image": "supplies",
        "labelHtml": "",
        "names": [],
        "forms": []
      },
      "preparations": "Supplies ×6",
      "rows": [
        {
          "name": 'GLP-1 Sub-Q Injection Kit (10 needles/syringes 30g 1/2" 100-unit + swabs)',
          "meta": "kit Supplies · MyPharmacyOrder"
        },
        {
          "name": 'GLP-1 Sub-Q Injection Kit (10 needles/syringes 30g 1/2" 50-unit + swabs)',
          "meta": "kit Supplies · MyPharmacyOrder"
        },
        {
          "name": 'IntraMuscular Injection Kit (10 needles/syringes 25g 1/2" 1mL + swabs)',
          "meta": "kit Supplies · MyPharmacyOrder"
        },
        {
          "name": 'IntraMuscular Injection Kit (5 needles/syringes 25g 1/2" 1mL + swabs)',
          "meta": "kit Supplies · MyPharmacyOrder"
        },
        {
          "name": 'Sub-Q Injection Kit (10 needles/syringes 30g 1/2" 100-unit + swabs)',
          "meta": "kit Supplies · MyPharmacyOrder"
        },
        {
          "name": 'Sub-Q Injection Kit (10 needles/syringes 30g 1/2" 50-unit + swabs)',
          "meta": "kit Supplies · MyPharmacyOrder"
        }
      ],
      "na": "",
      "orderNote": "Supplies — not a compounded preparation.",
      "request": {
        "label": "Request pricing",
        "href": "mailto:gabe@albacetemeddev.com?subject=Peptide%20pricing%20request%20%E2%80%94%20Injection%20Kits%20%26%20Supplies&body=Please%20do%20not%20include%20patient%20names%20or%20health%20information.%0D%0A%0D%0APractice%20name%3A%0D%0APrescriber%20name%20and%20credentials%3A%0D%0ANPI%3A%0D%0AState%20license%20number%20and%20state%3A%0D%0AStates%20where%20your%20patients%20receive%20preparations%3A%0D%0APreparation%20and%20channel%3A%0D%0A%0D%0AI%20confirm%20I%20am%20a%20licensed%20prescriber%2C%20or%20practice%20staff%20requesting%20on%20a%20prescriber%27s%20behalf.",
        "describedBy": "pep-ord-supplies"
      }
    },
    {
      "key": "b12",
      "cat": "ancillary",
      "channels": [
        "MyViaHealth"
      ],
      "status": "cat1",
      "search": "methylcobalamin (b12) methylcobalamin — active b12 form for methylation and neurologic support.",
      "chips": [
        {
          "cls": "pep-chip--ok",
          "label": "Bulks Category 1"
        }
      ],
      "name": "Methylcobalamin (B12)",
      "mech": "Methylcobalamin — active B12 form for methylation and neurologic support.",
      "note": "Category 1 on both interim lists; a staple co-therapy vitamin.",
      "label": {
        "frame": "pl--vial-liquid",
        "image": "vial-liquid",
        "labelHtml": '<span class="pl" style="--kn:0.71"><span class="pl-hd"><span class="pl-name">Methylcobalamin</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-sub">B12</span><span class="pl-form">Compounded<br>Vial</span></span><span class="pl-bc"></span></span>',
        "names": [
          "Methylcobalamin"
        ],
        "forms": [
          "Compounded / Vial"
        ]
      },
      "preparations": "Compounded Vial ×1",
      "rows": [
        {
          "name": "Methylcobalamin (B12) 10mg (1mg/ml 10ml vial)",
          "meta": "Compounded Vial · MyViaHealth"
        }
      ],
      "na": "",
      "orderNote": "Confirm the 503A or 503B pathway with the dispensing entity before ordering.",
      "request": {
        "label": "Request pricing",
        "href": "mailto:gabe@albacetemeddev.com?subject=Peptide%20pricing%20request%20%E2%80%94%20Methylcobalamin%20%28B12%29&body=Please%20do%20not%20include%20patient%20names%20or%20health%20information.%0D%0A%0D%0APractice%20name%3A%0D%0APrescriber%20name%20and%20credentials%3A%0D%0ANPI%3A%0D%0AState%20license%20number%20and%20state%3A%0D%0AStates%20where%20your%20patients%20receive%20preparations%3A%0D%0APreparation%20and%20channel%3A%0D%0A%0D%0AI%20confirm%20I%20am%20a%20licensed%20prescriber%2C%20or%20practice%20staff%20requesting%20on%20a%20prescriber%27s%20behalf.",
        "describedBy": "pep-ord-b12"
      }
    },
    {
      "key": "test-cyp",
      "cat": "ancillary",
      "channels": [
        "MyViaHealth"
      ],
      "status": "approved",
      "search": "testosterone cypionate testosterone cypionate — long-acting androgen ester.",
      "chips": [
        {
          "cls": "pep-chip--ok",
          "label": "Approved-drug substance"
        }
      ],
      "name": "Testosterone Cypionate",
      "mech": "Testosterone cypionate — long-acting androgen ester.",
      "note": "Active ingredient of FDA-approved drugs. Schedule III controlled substance; this supplier ships testosterone direct-to-patient only.",
      "label": {
        "frame": "pl--vial-liquid",
        "image": "vial-liquid",
        "labelHtml": '<span class="pl"><span class="pl-hd pl-hd--2"><span class="pl-name">Testosterone<br>Cypionate</span></span><span class="pl-gl"></span><span class="pl-bd"><span class="pl-form">Compounded<br>Vial</span></span><span class="pl-bc"></span></span>',
        "names": [
          "TestosteroneCypionate"
        ],
        "forms": [
          "Compounded / Vial"
        ]
      },
      "preparations": "Compounded Vial ×1",
      "rows": [
        {
          "name": "Test Cyp 200 mg/ml (1ML Vial)",
          "meta": "Compounded Vial · MyViaHealth"
        }
      ],
      "na": "",
      "orderNote": "503A, patient-specific prescriptions only — significant-difference note required.",
      "request": {
        "label": "Request pricing",
        "href": "mailto:gabe@albacetemeddev.com?subject=Peptide%20pricing%20request%20%E2%80%94%20Testosterone%20Cypionate&body=Please%20do%20not%20include%20patient%20names%20or%20health%20information.%0D%0A%0D%0APractice%20name%3A%0D%0APrescriber%20name%20and%20credentials%3A%0D%0ANPI%3A%0D%0AState%20license%20number%20and%20state%3A%0D%0AStates%20where%20your%20patients%20receive%20preparations%3A%0D%0APreparation%20and%20channel%3A%0D%0A%0D%0AI%20confirm%20I%20am%20a%20licensed%20prescriber%2C%20or%20practice%20staff%20requesting%20on%20a%20prescriber%27s%20behalf.",
        "describedBy": "pep-ord-test-cyp"
      }
    }
  ]
};
const PEPTIDE_CARDS = PEPTIDES.cards;
const PEPTIDE_BY_KEY = Object.fromEntries(PEPTIDE_CARDS.map((c) => [c.key, c]));
const $$splitComponentImporter$1 = () => import("./peptides-DAzRZ36c.js");
const str = (v) => typeof v === "string" && v ? v : void 0;
const Route$2 = createFileRoute("/products/peptides")({
  validateSearch: (s) => ({
    cat: str(s.cat),
    ch: str(s.ch),
    status: str(s.status),
    q: str(s.q)
  }),
  head: () => ({
    meta: [{
      title: PEPTIDES.title
    }, {
      name: "description",
      content: PEPTIDES.description
    }],
    links: [{
      rel: "stylesheet",
      href: pageCss
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./_slug-BOLLvaz-.js");
const Route$1 = createFileRoute("/products/$slug")({
  beforeLoad: ({
    params
  }) => {
    if (!PRODUCT_BY_SLUG[params.slug]) throw notFound$1();
  },
  head: ({
    params
  }) => {
    const p = PRODUCT_BY_SLUG[params.slug];
    return {
      meta: [{
        title: p?.title ?? "Albacete MedDev"
      }, {
        name: "description",
        content: p?.deck ?? ""
      }],
      links: [{
        rel: "stylesheet",
        href: pagesCss
      }]
    };
  },
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const UPSTREAM = "https://albacetemeddev.com/api/ovena-products";
const json = (body, status) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const Route2 = createFileRoute("/api/ovena-products")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const r = await fetch(UPSTREAM, { headers: { accept: "application/json", "user-agent": "Mozilla/5.0 (compatible; Albacete MedDev storefront section)" } });
          if (!r.ok) return json({ error: "upstream " + r.status }, 502);
          const body = await r.text();
          return new Response(body, { status: 200, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=300" } });
        } catch {
          return json({ error: "upstream unreachable" }, 502);
        }
      }
    }
  }
});
const WhyPartnerRoute = Route$h.update({
  id: "/why-partner",
  path: "/why-partner",
  getParentRoute: () => Route$i
});
const SoftwareRoute = Route$g.update({
  id: "/software",
  path: "/software",
  getParentRoute: () => Route$i
});
const SitemapDotxmlRoute = Route$f.update({
  id: "/sitemap.xml",
  path: "/sitemap.xml",
  getParentRoute: () => Route$i
});
const ScientificPortfolioRoute = Route$e.update({
  id: "/scientific-portfolio",
  path: "/scientific-portfolio",
  getParentRoute: () => Route$i
});
const RobotsDottxtRoute = Route$d.update({
  id: "/robots.txt",
  path: "/robots.txt",
  getParentRoute: () => Route$i
});
const PortalRoute = Route$c.update({
  id: "/portal",
  path: "/portal",
  getParentRoute: () => Route$i
});
const EvidenceRoute = Route$b.update({
  id: "/evidence",
  path: "/evidence",
  getParentRoute: () => Route$i
});
const ContactRoute = Route$a.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$i
});
const AmazonStoreRoute = Route$9.update({
  id: "/amazon-store",
  path: "/amazon-store",
  getParentRoute: () => Route$i
});
const AboutRoute = Route$8.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$i
});
const IndexRoute = Route$7.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$i
});
const ServicesIndexRoute = Route$6.update({
  id: "/services/",
  path: "/services/",
  getParentRoute: () => Route$i
});
const ProductsIndexRoute = Route$5.update({
  id: "/products/",
  path: "/products/",
  getParentRoute: () => Route$i
});
const ServicesRevenueCycleRoute = Route$4.update({
  id: "/services/revenue-cycle",
  path: "/services/revenue-cycle",
  getParentRoute: () => Route$i
});
const ServicesConsultingRoute = Route$3.update({
  id: "/services/consulting",
  path: "/services/consulting",
  getParentRoute: () => Route$i
});
const ProductsPeptidesRoute = Route$2.update({
  id: "/products/peptides",
  path: "/products/peptides",
  getParentRoute: () => Route$i
});
const ProductsSlugRoute = Route$1.update({
  id: "/products/$slug",
  path: "/products/$slug",
  getParentRoute: () => Route$i
});
const ApiOvenaProductsRoute = Route2.update({
  id: "/api/ovena-products",
  path: "/api/ovena-products",
  getParentRoute: () => Route$i
});
const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  AmazonStoreRoute,
  ContactRoute,
  EvidenceRoute,
  PortalRoute,
  RobotsDottxtRoute,
  ScientificPortfolioRoute,
  SitemapDotxmlRoute,
  SoftwareRoute,
  WhyPartnerRoute,
  ApiOvenaProductsRoute,
  ProductsSlugRoute,
  ProductsPeptidesRoute,
  ServicesConsultingRoute,
  ServicesRevenueCycleRoute,
  ProductsIndexRoute,
  ServicesIndexRoute
};
const routeTree = Route$i._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultPreload: "intent",
    // Calm cross-fade between pages where the View Transitions API exists.
    defaultViewTransition: true
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  AppLink as A,
  PRODUCTS_HUB as B,
  CompanyHero as C,
  revenueCycle as D,
  EditorialGrid as E,
  consulting as F,
  PEPTIDES as G,
  PEPTIDE_CARDS as H,
  InfoBand as I,
  Route$2 as J,
  Route$1 as K,
  CATEGORY_BY_ID as L,
  fallbackSrc as M,
  srcSet as N,
  router as O,
  Picture as P,
  Reveal as R,
  SectionHead as S,
  TOPICS as T,
  SplitRow as a,
  StatementPanel as b,
  SOFTWARE as c,
  Panel as d,
  cx as e,
  IDENTITY as f,
  IMG as g,
  SubNav as h,
  EditorialCard as i,
  PORTAL as j,
  contactPage as k,
  briefText as l,
  contact as m,
  ArrowIcon as n,
  about as o,
  IDENT_VIDEO as p,
  PEPTIDE_BY_KEY as q,
  PhotoCardGrid as r,
  PhotoCard as s,
  topicsFromQuery as t,
  PRODUCT_BY_SLUG as u,
  selectedTopics as v,
  whyPartner as w,
  servicesHub as x,
  consultationHref as y,
  CATEGORIES as z
};
