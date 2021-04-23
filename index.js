/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('mdast').Definition} Definition
 * @typedef {import('unist-util-visit').Visitor<Definition>} DefinitionVisitor
 */

import {visit} from 'unist-util-visit'

var own = {}.hasOwnProperty

/**
 *
 * @param {Node} node
 */
export function definitions(node) {
  /** @type {Object.<string, Definition>} */
  var cache = Object.create(null)

  if (!node || !node.type) {
    throw new Error('mdast-util-definitions expected node')
  }

  visit(node, 'definition', ondefinition)

  return getDefinition

  /** @type {DefinitionVisitor} */
  function ondefinition(definition) {
    var id = clean(definition.identifier)
    if (id && !own.call(cache, id)) {
      cache[id] = definition
    }
  }

  /**
   * Get a node from the bound definition-cache.
   *
   * @param {string} identifier
   * @returns {Definition|null}
   */
  function getDefinition(identifier) {
    var id = clean(identifier)
    return id && own.call(cache, id) ? cache[id] : null
  }
}

/**
 * @param {string} [value]
 * @returns {string}
 */
function clean(value) {
  return String(value || '').toUpperCase()
}
