/**
 * @author Titus Wormer
 * @copyright 2015-2016 Titus Wormer. All rights reserved.
 * @license MIT
 * @module mdast:util:definitions
 * @fileoverview Get a definition in `node` by `identifier`.
 */

'use strict';

/*
 * Dependencies.
 */

var visit = require('unist-util-visit');

/**
 * Factory to get a node from the given definition-cache.
 *
 * @private
 * @param {Object.<string, Node>} cache - Definitions.
 * @return {function(string): Node?} - Getter, bound to
 *   `cache`.
 */
function getterFactory(cache) {
    /**
     * Get a node from the bound definition-cache.
     *
     * @private
     * @param {string} identifier - Identifier of
     *   definition.
     * @return {Node?} - Definition, if found.
     */
    function getter(identifier) {
        return (identifier && cache[identifier.toUpperCase()]) || null;
    }

    return getter;
}

/**
 * Gather all definitions in `node`
 *
 * @private
 * @param {Node} node - (Grand)parent of definitions.
 * @return {Object.<string, Node>} - Map of found
 *   definitions by their identifier.
 */
function gather(node) {
    var cache = {};

    if (!node || !node.type) {
        throw new Error('mdast-util-definitions expected node');
    }

    /**
     * Add `definition` to `cache` if it has an identifier.
     *
     * @param {Node} definition - Definition node.
     */
    function check(definition) {
        cache[definition.identifier.toUpperCase()] = definition;
    }

    visit(node, 'definition', check);

    return cache;
}

/**
 * Get a definition in `node` by `identifier`.
 *
 * Supports weird keys (like `__proto__`).
 *
 * @example
 *   var ast = remark.parse('[example]: http://example.com "Example"');
 *   var getDefinition = getDefinitionFactory(ast);
 *   getDefinition('example');
 *   // {type: 'definition', 'title': 'Example', ...}
 *
 * @param {Node} node - (Grand)parent of definitions.
 * @return {function(string): Node?} - Getter.
 */
function getDefinitionFactory(node) {
    return getterFactory(gather(node));
}

/*
 * Expose
 */

module.exports = getDefinitionFactory;
