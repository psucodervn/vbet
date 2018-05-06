import { FetchRequest } from '../shared/interfaces';

export const serialize = (obj, prefix = '') => {
  const str: string[] = [];
  for (const p in obj) {
    if (obj.hasOwnProperty(p)) {
      const k = prefix ? prefix + '[' + p + ']' : p,
        v = obj[p];
      if (Array.isArray(v)) {
        str.push(encodeURIComponent(k) + '=' + v.join(','));
      } else if (v !== null && typeof v === 'object') {
        str.push(serialize(v, k));
      } else {
        str.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
      }
    }
  }
  return str.join('&');
};

// prettier-ignore
export const headers = {
  'pragma': 'no-cache',
  'accept-language': 'en-US,en;q=0.9,de;q=0.8,vi;q=0.7',
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
  'accept': 'application/json, text/plain, */*',
  'cache-control': 'no-cache',
  'authority': 'game.let.bet',
  'x-requested-with': 'XMLHttpRequest',
  'referer': 'https://game.let.bet/sport',
};

export const getOptions = (req: FetchRequest) => {
  return {
    url: `https://game.let.bet/api/game/sports/matches?` + serialize(req),
    header: headers,
  };
};
