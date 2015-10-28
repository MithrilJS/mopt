mithril-objectify
=================
[![NPM Version](https://img.shields.io/npm/v/mithril-objectify.svg)](https://www.npmjs.com/package/mithril-objectify)
[![NPM License](https://img.shields.io/npm/l/mithril-objectify.svg)](https://www.npmjs.com/package/mithril-objectify)
[![NPM Downloads](https://img.shields.io/npm/dm/mithril-objectify.svg)](https://www.npmjs.com/package/mithril-objectify)
[![Build Status](https://img.shields.io/travis/tivac/mithril-objectify.svg)](https://travis-ci.org/tivac/mithril-objectify)
[![Dependency Status](https://img.shields.io/david/tivac/mithril-objectify.svg)](https://david-dm.org/tivac/mithril-objectify)
[![devDependency Status](https://img.shields.io/david/dev/tivac/mithril-objectify.svg)](https://david-dm.org/tivac/mithril-objectify#info=devDependencies)


Turn [mithril](http://mithril.js.org) html functions like `m(".fooga")` into static JS objects like:

```js
{ tag: "div", attrs: { "className" : "fooga" }, children: [ ] }
```

for speeeeeed.

Use via CLI, API, or as a [Browserify](http://browserify.org/) transform!

## Installation

Install with npm

`npm i mithril-objectify`

## Usage

### CLI

Accepts an input file and optional output file. No output file will echo the result to stdout.

```
> mithril-objectify ./input.js
> mithril-objectify ./input.js ./output.js
```

### API

Accepts a string or buffer, returns a buffer.

```js
var objectify = require("mithril-objectify");

console.log(objectify(`m(".fooga.wooga.booga")`);

// logs
// ({ tag: "div", attrs: { className: "fooga wooga booga" }, children: [ ] })
```

### Browserify

Use as a browserify transform, either via the CLI or via code.

#### CLI
`browserify -t mithril-objectify <file>`

#### Code
```js
var build = require("browserify")();

build.transform("mithril-objectify");

b.add("./client.js");

b.bundle().pipe(process.stdout);
```

## Warning

There may be edge cases this doesn't handle well. I'd love to see issues filed w/ repro code for any of them and would be happy to fix them!
