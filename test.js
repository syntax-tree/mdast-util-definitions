'use strict'

var test = require('tape')
var remark = require('remark')
var definitions = require('.')

test('mdast-util-definitions', function (t) {
  var getDefinition
  var tree

  t.throws(
    function () {
      definitions()
    },
    /mdast-util-definitions expected node/,
    'should fail without node'
  )

  tree = remark().parse('[example]: https://example.com "Example"')
  getDefinition = definitions(tree)

  t.deepEqual(
    getDefinition('example'),
    {
      type: 'definition',
      identifier: 'example',
      label: 'example',
      url: 'https://example.com',
      title: 'Example',
      position: {
        start: {column: 1, line: 1, offset: 0},
        end: {column: 41, line: 1, offset: 40},
        indent: []
      }
    },
    'should return a definition'
  )

  t.equal(getDefinition('foo'), null, 'should return null when not found')

  tree = remark().parse('[__proto__]: https://proto.com "Proto"')
  getDefinition = definitions(tree)

  t.deepEqual(
    getDefinition('__proto__'),
    {
      type: 'definition',
      identifier: '__proto__',
      label: '__proto__',
      url: 'https://proto.com',
      title: 'Proto',
      position: {
        start: {column: 1, line: 1, offset: 0},
        end: {column: 39, line: 1, offset: 38},
        indent: []
      }
    },
    'should work on weird identifiers'
  )

  /* eslint-disable-next-line no-use-extend-native/no-use-extend-native */
  t.equal({}.type, undefined, 'should not polute the prototype')

  t.deepEqual(
    getDefinition('toString'),
    null,
    'should work on weird identifiers when not found'
  )

  tree = remark().parse(
    '[example]: https://one.com\n[example]: https://two.com'
  )

  t.deepEqual(
    definitions(tree)('example').url,
    'https://two.com',
    'should prefer the last of duplicate definitions by default'
  )

  t.deepEqual(
    definitions(tree, {commonmark: true})('example').url,
    'https://one.com',
    'should prefer the first of duplicate definitions in commonmark mode'
  )

  t.end()
})
