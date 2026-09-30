/* Moved into @wojciech/mdx-components so the article components can reach it:
 * an in-article image needs the same cache-proof address a cover does, and the
 * package cannot import from the app. Re-exported here so existing imports and
 * the name the repo already knows keep working. */
export { versioned } from '@wojciech/mdx-components/lib/assetVersion';
