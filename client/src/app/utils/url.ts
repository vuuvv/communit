import { environment } from '../../environments/environment';

const SERVER_URL = environment.serverUrl;

function fixUrl(url: string): string {
  const absoluteUrlPattern = new RegExp('^([a-z]+://|//)', 'i');
  let base = SERVER_URL;
  if (absoluteUrlPattern.test(url) || !base) {
    return url;
  }
  url = url.replace(/^\//, '');
  base = base.replace(/\/$/, '');
  return `${base}/${url}`;
}

function buildQueryString(data: any) {
  if (!data) {
    return '';
  }
  return Object.keys(data).filter(
    value => data[value] !== undefined && data[value] !== null
  ).map(
    key => `${key}=${encodeURIComponent(data[key])}`
  ).join('&');
}

function buildUrl(url: string, data: any = null, noCache = true) {
  url = fixUrl(url);

  if (!data) {
    data = {};
  }

  if (noCache) {
    data['_t'] = new Date().getTime();
  }

  let qs = buildQueryString(data);
  if (qs && url.indexOf('?') === -1) {
    url += '?';
  }

  return url + qs;
}

export { fixUrl, buildQueryString, buildUrl };
