mithril-objectify
=================

# WARNING: DO NOT USE

Despite my best efforts I don't think there's a safe way to statically determine if arguments to `m()` are attributes or children, making this a **VERY** dangerous thing to have as part of your build pipeline.

I'm abandoning this effort for a bit until I can think a bit more and see if I can salvage it. Caveat Emptor.

* * *

Turn [mithril](http://mithril.js.org) html functions like `m(".fooga")` into static JS objects like:

```js
{ tag: "div", attrs: { "className" : "fooga" }, children: [ ] }
```

for speeeeeed.

Use via CLI, API, or as a [Browserify](http://browserify.org/) transform!

**NOTE**: This requires `iojs`/`nodejs@0.12.x`/`nodejs@4.x.x` to run, it uses ECMAScript 2015 template strings. Sorry!

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
