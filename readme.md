# mdast-util-definitions [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status] [![Chat][chat-badge]][chat]

<!--lint disable list-item-spacing heading-increment list-item-indent-->

<!--lint disable no-duplicate-headings-->

Get definitions in [MDAST][] nodes by `identifier`.  Supports funky
keys, like `__proto__` or `toString`.

## Installation

[npm][]:

```bash
npm install mdast-util-definitions
```

**mdast-util-definitions** is also available as an AMD, CommonJS, and
globals module, [uncompressed and compressed][releases].

## Usage

```js
var remark = require('remark');
var definitions = require('mdast-util-definitions');

var ast = remark().parse('[example]: http://example.com "Example"');

var definition = definitions(ast);

definition('example');
// {type: 'definition', 'title': 'Example', ...}

definition('foo');
// null
```

## API

### `definitions(node)`

Create a cache of all `definition`s in `node`.

###### Parameters

*   `node` ([`Node`][node]) — Ancestor of definitions.

###### Returns

[`Function`][definition]

### `definition(identifier)`

###### Parameters

*   `identifier` (`string`) — Identifier of definition.

###### Returns

[`Node?`][node] — Definition, if found.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/wooorm/mdast-util-definitions.svg

[build-status]: https://travis-ci.org/wooorm/mdast-util-definitions

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/mdast-util-definitions.svg

[coverage-status]: https://codecov.io/github/wooorm/mdast-util-definitions

[chat-badge]: https://img.shields.io/gitter/room/wooorm/remark.svg

[chat]: https://gitter.im/wooorm/remark

[releases]: https://github.com/wooorm/mdast-util-definitions/releases

[license]: LICENSE

[author]: http://wooorm.com

[npm]: https://docs.npmjs.com/cli/install

[mdast]: https://github.com/wooorm/mdast

[node]: https://github.com/wooorm/mdast#node

[definition]: #definitionidentifier
