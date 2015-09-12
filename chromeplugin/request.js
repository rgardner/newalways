/************************ REDIRECT CODE ***********************/
chrome.webRequest.onBeforeRequest.addListener(function(details) {
    return detectRedirect(details);
}, {
    urls : ['<all_urls>'],
    types: ['main_frame', 'sub_frame']
}, ['blocking']);


function detectRedirect(details) {
  var url = details.url,
      HTTP = 'http://',
      HTTPS = 'https://',
      protocol,
      HN = 'news.ycombinator.com',
      REDDIT = 'www.reddit.com';

    console.log(url);

    if (!url) {
        return;
    }

    protocol = (url.indexOf(HTTP) !== -1) ? HTTP : HTTPS;

    if (url.match(protocol + HN)) {
      return redirectHn(protocol, HN, url);
    }

    else if (url.match(protocol + REDDIT)) {
      return redirectReddit(protocol, REDDIT, url);
    }
}

// Redirect HN to /newest if requesting the homepage.
function redirectHn(protocol, domain, url) {
  // root page
  if (url === (protocol + domain + '/')) {
    return {
      redirectUrl: url + 'newest'
    };
  }
}

// Redirect Reddit homepage, subreddits, and comments to sort on 'new'
function redirectReddit(protocol, domain, url) {
  // TODO(rgardner): Enable subreddit support

  // root page
  if (url === (protocol + domain + '/')) {
    return {
      redirectUrl: protocol + domain + '/'
    };
  }
}
