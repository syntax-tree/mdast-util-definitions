/**
 * @typedef {import('unist').Node} Node
 */

import test from 'tape'
import remark from 'remark'
import {definitions} from './index.js'

test('mdast-util-definitions', (t) => {
  /** @type {Node} */
  let tree

  t.throws(
    () => {
      // @ts-ignore runtime
      definitions()
    },
    /mdast-util-definitions expected node/,
    'should fail without node'
  )

  tree = remark().parse('[example]: https://example.com "Example"')

  t.deepLooseEqual(
    definitions(tree)('example'),
    {
      type: 'definition',
      identifier: 'example',
      label: 'example',
      title: 'Example',
      url: 'https://example.com',
      position: {
        start: {line: 1, column: 1, offset: 0},
        end: {line: 1, column: 41, offset: 40}
      }
    },
    'should return a definition'
  )

  t.equal(definitions(tree)('foo'), null, 'should return null when not found')

  tree = remark().parse('[__proto__]: https://proto.com "Proto"')

  t.deepLooseEqual(
    definitions(tree)('__proto__'),
    {
      type: 'definition',
      identifier: '__proto__',
      label: '__proto__',
      title: 'Proto',
      url: 'https://proto.com',
      position: {
        start: {line: 1, column: 1, offset: 0},
        end: {line: 1, column: 39, offset: 38}
      }
    },
    'should work on weird identifiers'
  )

  /* eslint-disable no-use-extend-native/no-use-extend-native */
  // @ts-expect-error: yes.
  // type-coverage:ignore-next-line
  t.equal({}.type, undefined, 'should not polute the prototype')
  /* eslint-enable no-use-extend-native/no-use-extend-native */

  t.deepEqual(
    definitions(tree)('toString'),
    null,
    'should work on weird identifiers when not found'
  )

  tree = remark().parse(
    '[example]: https://one.com\n[example]: https://two.com'
  )

  const example = definitions(tree)('example')

  t.deepEqual(
    example && example.url,
    'https://one.com',
    'should prefer the first of duplicate definitions'
  )

  t.deepEqual(
    definitions(tree)(''),
    null,
    'should not return something for a missing identifier'
  )

  t.end()
})
