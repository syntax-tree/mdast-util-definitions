/**
 * @typedef {import('mdast').Definition} Definition
 * @typedef {import('mdast').Nodes} Nodes
 */

/**
 * @callback GetDefinition
 *   Get a definition by identifier.
 * @param {string | null | undefined} [identifier]
 *   Identifier of definition (optional).
 * @returns {Definition | null}
 *   Definition corresponding to `identifier` or `null`.
 */

import {visit} from 'unist-util-visit'

const own = {}.hasOwnProperty

/**
 * Find definitions in `tree`.
 *
 * Uses CommonMark precedence, which means that earlier definitions are
 * preferred over duplicate later definitions.
 *
 * @param {Nodes} tree
 *   Tree to check.
 * @returns {GetDefinition}
 *   Getter.
 */
export function definitions(tree) {
  /** @type {Record<string, Definition>} */
  const cache = Object.create(null)

  if (!tree || !tree.type) {
    throw new Error('mdast-util-definitions expected node')
  }

  visit(tree, 'definition', function (definition) {
    const id = clean(definition.identifier)
    if (id && !own.call(cache, id)) {
      cache[id] = definition
    }
  })

  return definition

  /** @type {GetDefinition} */
  function definition(identifier) {
    const id = clean(identifier)
    // To do: next major: return `undefined` when not found.
    return id && own.call(cache, id) ? cache[id] : null
  }
}

/**
 * @param {string | null | undefined} [value]
 * @returns {string}
 */
function clean(value) {
  return String(value || '').toUpperCase()
}
