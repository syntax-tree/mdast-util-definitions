'use strict'

var visit = require('unist-util-visit')

module.exports = createGetDefinition

var own = {}.hasOwnProperty

// Get a definition in `node` by `identifier`.
function createGetDefinition(node) {
  var cache = {}

  if (!node || !node.type) {
    throw new Error('mdast-util-definitions expected node')
  }

  visit(node, 'definition', ondefinition)

  return getDefinition

  function ondefinition(definition) {
    var id = clean(definition.identifier)
    if (id && !own.call(cache, id)) {
      cache[id] = definition
    }
  }

  // Get a node from the bound definition-cache.
  function getDefinition(identifier) {
    var id = clean(identifier)
    return id && own.call(cache, id) ? cache[id] : null
  }
}

function clean(value) {
  return String(value || '').toUpperCase()
}
