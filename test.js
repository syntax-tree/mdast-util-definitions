import assert from 'node:assert/strict'
import test from 'node:test'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {definitions} from './index.js'
import * as mod from './index.js'

test('definitions', () => {
  assert.deepEqual(
    Object.keys(mod).sort(),
    ['definitions'],
    'should expose the public api'
  )

  assert.throws(
    () => {
      // @ts-expect-error runtime
      definitions()
    },
    /mdast-util-definitions expected node/,
    'should fail without node'
  )

  assert.deepEqual(
    definitions(fromMarkdown('[example]: https://example.com "Example"'))(
      'example'
    ),
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

  assert.equal(
    definitions(fromMarkdown('[example]: https://example.com "Example"'))(
      'foo'
    ),
    null,
    'should return null when not found'
  )

  assert.deepEqual(
    definitions(fromMarkdown('[__proto__]: https://proto.com "Proto"'))(
      '__proto__'
    ),
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
  assert.equal({}.type, undefined, 'should not polute the prototype')
  /* eslint-enable no-use-extend-native/no-use-extend-native */

  assert.deepEqual(
    definitions(fromMarkdown('[__proto__]: https://proto.com "Proto"'))(
      'toString'
    ),
    null,
    'should work on weird identifiers when not found'
  )

  const example = definitions(
    fromMarkdown('[example]: https://one.com\n[example]: https://two.com')
  )('example')

  assert.deepEqual(
    example && example.url,
    'https://one.com',
    'should prefer the first of duplicate definitions'
  )

  assert.deepEqual(
    definitions(
      fromMarkdown('[example]: https://one.com\n[example]: https://two.com')
    )(''),
    null,
    'should not return something for a missing identifier'
  )
})
