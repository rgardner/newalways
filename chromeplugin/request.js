/************************ REDIRECT CODE ***********************/
chrome.webRequest.onBeforeRequest.addListener(function(details) {
    return detectRedirect(details);
}, {
    urls : ['<all_urls>'],
    types: ['main_frame', 'sub_frame']
}, ['blocking']);


function detectRedirect(details) {
  'use strict';
  var url = details.url,
      HN = 'news.ycombinator.com',
      REDDIT = 'www.reddit.com';

  if (!url) {
      return;
  }

  if (url.match(HN)) {
    return redirectHn(url);
  }

  else if (url.match(REDDIT)) {
    return redirectReddit(url);
  }
}

// Redirect HN to /newest if requesting the homepage.
function redirectHn(url) {
  'use strict';
  var parser = parseUrl(url);

  // root page
  if (parser.pathname === '/') {
    return {
      redirectUrl: url + 'newest'
    };
  }
}

// Redirect Reddit homepage, subreddits, and comments to sort on 'new'
function redirectReddit(url) {
  'use strict';
  var parser = parseUrl(url),
      shouldInsertSlash = !endsWith(url, '/'),
      SUBREDDIT_REGEX = /\/r\/[\w]*\/?$/,
      COMMENTS_REGEX = /\/r\/[\w]*\/comments\//;


  // already sorting comments, no need to re-sort.
  if (parser.search.indexOf('sort') !== -1) return;

  // root page
  if (parser.pathname === '/') {
    return {
      redirectUrl: url + 'new'
    };
  }

  // subreddit
  else if (SUBREDDIT_REGEX.test(parser.pathname)) {
    return {
      redirectUrl: url + (shouldInsertSlash ? '/' : '') + 'new'
    };
  }

  // comments
  else if (COMMENTS_REGEX.test(parser.pathname)) {
    return {
      redirectUrl: url + '?sort=new'
    };
  }
}

/** URI Parsing with JS.
 * thanks to @jlong on GitHub {@link https://gist.github.com/jlong/2428561}
 * @example
 * var parser = document.createElement('a');
 * parser.href = "http://example.com:3000/pathname/?search=test#hash";
 * parser.protocol; // => "http:"
 * parser.hostname; // => "example.com"
 * parser.port;     // => "3000"
 * parser.pathname; // => "/pathname/"
 * parser.search;   // => "?search=test"
 * parser.hash;     // => "#hash"
 * parser.host;     // => "example.com:3000"
 */
function parseUrl(url) {
  'use strict';
  var parser = document.createElement('a');
  parser.href = url;
  return parser;
}

/** Does string ends with suffix?
 * thanks to @chakrit on SO {@link http://stackoverflow.com/a/2548133/4228400}
 */
function endsWith(str, suffix) {
  'use strict';
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
