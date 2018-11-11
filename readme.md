# mdast-util-definitions [![Build][build-badge]][build] [![Coverage][coverage-badge]][coverage] [![Downloads][downloads-badge]][downloads] [![Chat][chat-badge]][chat]

Get definitions in [mdast][] nodes by `identifier`.  Supports funky
keys, like `__proto__` or `toString`.

## Installation

[npm][]:

```bash
npm install mdast-util-definitions
```

## Usage

```js
var remark = require('remark')
var definitions = require('mdast-util-definitions')

var ast = remark().parse('[example]: https://example.com "Example"')

var definition = definitions(ast)

definition('example')
// => {type: 'definition', 'title': 'Example', ...}

definition('foo')
// => null
```

## API

### `definitions(node[, options])`

Create a cache of all `definition`s in [`node`][node].

###### `options.commonmark`

`boolean`, default: false — Turn on to use CommonMark precedence: ignore
later found definitions for duplicate definitions.  The default behaviour
is to prefer the last found definition.

###### Returns

[`Function`][definition]

### `definition(identifier)`

###### Parameters

*   `identifier` (`string`) — Identifier of definition.

###### Returns

[`Node?`][node] — Definition, if found.

## Contribute

See [`contributing.md` in `syntax-tree/mdast`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/syntax-tree/mdast-util-definitions.svg

[build]: https://travis-ci.org/syntax-tree/mdast-util-definitions

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/mdast-util-definitions.svg

[coverage]: https://codecov.io/github/syntax-tree/mdast-util-definitions

[downloads-badge]: https://img.shields.io/npm/dm/mdast-util-definitions.svg

[downloads]: https://www.npmjs.com/package/mdast-util-definitions

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/remark

[license]: license

[author]: https://wooorm.com

[npm]: https://docs.npmjs.com/cli/install

[mdast]: https://github.com/syntax-tree/mdast

[node]: https://github.com/syntax-tree/unist#node

[definition]: #definitionidentifier

[contributing]: https://github.com/syntax-tree/mdast/blob/master/contributing.md

[coc]: https://github.com/syntax-tree/mdast/blob/master/code-of-conduct.md
