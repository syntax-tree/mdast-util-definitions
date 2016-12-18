'use strict';

var visit = require('unist-util-visit');

module.exports = getDefinitionFactory;

/* Get a definition in `node` by `identifier`. */
function getDefinitionFactory(node) {
  return getterFactory(gather(node));
}

/* Gather all definitions in `node` */
function gather(node) {
  var cache = {};

  if (!node || !node.type) {
    throw new Error('mdast-util-definitions expected node');
  }

  visit(node, 'definition', check);

  return cache;

  /* Add `definition` to `cache` if it has an identifier. */
  function check(definition) {
    cache[normalise(definition.identifier)] = definition;
  }
}

/* Factory to get a node from the given definition-cache. */
function getterFactory(cache) {
  return getter;

  /* Get a node from the bound definition-cache. */
  function getter(identifier) {
    return (identifier && cache[normalise(identifier)]) || null;
  }
}

function normalise(identifier) {
  return identifier.toUpperCase();
}
