// Resolve extensionless relative TS imports for node --experimental-strip-types.
export async function resolve(spec, ctx, next) {
  if ((spec.startsWith('./') || spec.startsWith('../')) && !/\.(ts|js|mjs|cjs|json)$/.test(spec)) {
    try { return await next(spec + '.ts', ctx); } catch { /* fall through */ }
  }
  return next(spec, ctx);
}
