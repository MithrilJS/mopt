mopt [![NPM Version](https://img.shields.io/npm/v/mopt.svg)](https://www.npmjs.com/package/mopt) [![NPM License](https://img.shields.io/npm/l/mopt.svg)](https://www.npmjs.com/package/mopt)
=================

<p align="center">
    <a href="https://www.npmjs.com/package/mopt" alt="NPM Downloads">
        <img src="https://img.shields.io/npm/dm/mopt.svg" />
    </a>
    <a href="https://travis-ci.org/tivac/mithril-objectify" alt="Build Status">
        <img src="https://img.shields.io/travis/tivac/mithril-objectify/master.svg" />
    </a>
    <a href="https://david-dm.org/tivac/mithril-objectify" alt="Dependency Status">
        <img src="https://img.shields.io/david/tivac/mithril-objectify.svg" />
    </a>
    <a href="https://david-dm.org/tivac/mithril-objectify#info=devDependencies" alt="devDependency Status">
        <img src="https://img.shields.io/david/dev/tivac/mithril-objectify.svg" />
    </a>
</p>


A [babel](babeljs.io) plugin to transform [mithril](http://mithril.js.org) hyperscript function invocations like `m(".fooga")` into static JS objects like:

```js
({
    tag: "div",
    attrs: {
        className: "fooga",
    }
    children: [],
    dom: undefined,
    domSize: undefined,
    events: undefined,
    key: undefined,
    state: {},
    text: undefined
});
```

for speeeeeed.

Please file an issue if you come across any cases that this doesn't handle, I'd love to improve the number of structures I can rewrite!

## Installation

Install with npm

`npm i mopt`

## Usage

### `.babelrc`

```js
// .babelrc
{
    "plugins": [ "mopt" ]
}
```

### CLI

`$ babel --plugins mopt script.js`

### API

```js
require("babel-core").transform("<code>", {
  plugins: [ "mopt" ]
});
```

## [Rollup](http://rollupjs.org)

[`rollup-plugin-babel`](https://www.npmjs.com/package/rollup-plugin-babel)

## [Browserify](http://browserify.org/)

[`babelify`](https://www.npmjs.com/package/babelify)

## [WebPack](https://webpack.github.io/)

[`babel-loader`](https://www.npmjs.com/package/babel-loader)
