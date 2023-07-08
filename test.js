/**
 * @typedef {import('mdast').Root} Root
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {definitions} from './index.js'

test('definitions', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('./index.js')).sort(), [
      'definitions'
    ])
  })

  await t.test('should fail without node', async function () {
    assert.throws(function () {
      // @ts-expect-error: check that an error is thrown at runtime.
      definitions()
    }, /mdast-util-definitions expected node/)
  })

  await t.test('should return a definition', async function () {
    assert.deepEqual(
      definitions(from('[example]: https://example.com "Example"'))('example'),
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
      }
    )
  })

  await t.test('should return `undefined` when not found', async function () {
    assert.equal(
      definitions(from('[example]: https://example.com "Example"'))('foo'),
      undefined
    )
  })

  await t.test('should work on weird identifiers', async function () {
    assert.deepEqual(
      definitions(from('[__proto__]: https://proto.com "Proto"'))('__proto__'),
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
      }
    )
  })

  await t.test('should not polute the prototype', async function () {
    /* eslint-disable no-use-extend-native/no-use-extend-native */
    // @ts-expect-error: yes.
    // type-coverage:ignore-next-line
    assert.equal({}.type, undefined)
    /* eslint-enable no-use-extend-native/no-use-extend-native */
  })

  await t.test(
    'should work on weird identifiers when not found',
    async function () {
      assert.deepEqual(
        definitions(from('[__proto__]: https://proto.com "Proto"'))('toString'),
        undefined
      )
    }
  )

  await t.test(
    'should prefer the first of duplicate definitions',
    async function () {
      const example = definitions(
        from('[example]: https://one.com\n[example]: https://two.com')
      )('example')

      assert.deepEqual(example && example.url, 'https://one.com')
    }
  )

  await t.test(
    'should not return something for a missing identifier',
    async function () {
      assert.deepEqual(
        definitions(
          from('[example]: https://one.com\n[example]: https://two.com')
        )(''),
        undefined
      )
    }
  )
})

/**
 * @param {string} value
 * @returns {Root}
 */
function from(value) {
  // @ts-expect-error: To do: remove cast when `from-markdown` is released.
  return fromMarkdown(value)
}
