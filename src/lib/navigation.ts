import { goto as svelteGoto } from '$app/navigation';
import { base } from '$app/paths';

export function goto(url: string, opts?: Parameters<typeof svelteGoto>[1]) {
  const prefixedUrl = url.startsWith('/') && !url.startsWith(base) ? `${base}${url}` : url;
  return svelteGoto(prefixedUrl, opts);
}
