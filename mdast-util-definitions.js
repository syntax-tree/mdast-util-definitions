(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.mdastUtilDefinitions = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"unist-util-visit":2}],2:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer. All rights reserved.
 * @module unist:util:visit
 * @fileoverview Utility to recursively walk over unist nodes.
 */

'use strict';

/**
 * Walk forwards.
 *
 * @param {Array.<*>} values - Things to iterate over,
 *   forwards.
 * @param {function(*, number): boolean} callback - Function
 *   to invoke.
 * @return {boolean} - False if iteration stopped.
 */
function forwards(values, callback) {
    var index = -1;
    var length = values.length;

    while (++index < length) {
        if (callback(values[index], index) === false) {
            return false;
        }
    }

    return true;
}

/**
 * Walk backwards.
 *
 * @param {Array.<*>} values - Things to iterate over,
 *   backwards.
 * @param {function(*, number): boolean} callback - Function
 *   to invoke.
 * @return {boolean} - False if iteration stopped.
 */
function backwards(values, callback) {
    var index = values.length;
    var length = -1;

    while (--index > length) {
        if (callback(values[index], index) === false) {
            return false;
        }
    }

    return true;
}

/**
 * Visit.
 *
 * @param {Node} tree - Root node
 * @param {string} [type] - Node type.
 * @param {function(node): boolean?} callback - Invoked
 *   with each found node.  Can return `false` to stop.
 * @param {boolean} [reverse] - By default, `visit` will
 *   walk forwards, when `reverse` is `true`, `visit`
 *   walks backwards.
 */
function visit(tree, type, callback, reverse) {
    var iterate;
    var one;
    var all;

    if (typeof type === 'function') {
        reverse = callback;
        callback = type;
        type = null;
    }

    iterate = reverse ? backwards : forwards;

    /**
     * Visit `children` in `parent`.
     */
    all = function (children, parent) {
        return iterate(children, function (child, index) {
            return child && one(child, index, parent);
        });
    };

    /**
     * Visit a single node.
     */
    one = function (node, index, parent) {
        var result;

        index = index || (parent ? 0 : null);

        if (!type || node.type === type) {
            result = callback(node, index, parent || null);
        }

        if (node.children && result !== false) {
            return all(node.children, node);
        }

        return result;
    };

    one(tree);
}

/*
 * Expose.
 */

module.exports = visit;

},{}]},{},[1])(1)
});