# Sitemap parser

Yes, another parser. But unlike the others, it returns the *entire* information from the sitemap, not only the list of URLs.

## Installation

~~~~
npm install sitemap-getter --save
~~~~

## Usage

### Stream mode
~~~~
import SitemapGetter from 'sitemap-getter';

const stream = await SitemapGetter.createStreamLocations(`https://your-website.com/sitemap.xml`);
stream.on('data', (loc) => {
    console.dir(loc);
});
~~~~

Note that the result stream works in `object mode`, so you will need to make a transform stream to be able to `.pipe()` it to something like `process.stdout`

Result:
~~~~
{ loc: 'https://foreignsky.ru/' }
{ loc: 'https://foreignsky.ru/pzwfCkCN2KmjRRERX',
  lastmod: 2017-07-09T22:00:00.000Z }
{ loc: 'https://foreignsky.ru/wNppu4ncxfS2fQ6to',
  lastmod: 2017-12-20T18:28:53.000Z }
~~~~

### Getter mode
~~~~
import SitemapGetter from 'sitemap-getter';

const data = await SitemapGetter.getLocations(`https://your-website.com/sitemap.xml`);
console.dir(data);
~~~~

Result:
~~~~
[ { loc: 'https://your-website.com/' },
  { loc: 'https://your-website.com/pzwfCkCN2KmjRRERX',
    lastmod: 2017-07-09T22:00:00.000Z },
  { loc: 'https://your-website.com/wNppu4ncxfS2fQ6to',
    lastmod: 2017-12-20T18:28:53.000Z } ]
~~~~

## Limitations
* Works only server-side
* Handling of HTTP 301 and 302 is not implemented
* Getting sitemap URL from robots.txt is not implemented
* Handling nested sitemaps is not implemented

Feel free to make some PRs and\or forks.

Enjoy!