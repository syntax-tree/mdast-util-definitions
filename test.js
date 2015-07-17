'use strict';

/* eslint-env mocha */

/*
 * Dependencies.
 */

var definitions = require('./index.js');
var mdast = require('mdast');
var assert = require('assert');

/*
 * Tests.
 */

describe('mdast-util-definitions', function () {
    it('should fail without node', function () {
        assert.throws(function () {
            definitions();
        }, /mdast-util-definitions expected node/);
    });

    it('should work', function () {
        var ast = mdast.parse('[example]: http://example.com "Example"');
        var getDefinition = definitions(ast);

        assert.deepEqual(getDefinition('example'), {
            'type': 'definition',
            'identifier': 'example',
            'link': 'http://example.com',
            'title': 'Example',
            'position': {
                'start': {
                    'column': 1,
                    'line': 1
                },
                'end': {
                    'column': 40,
                    'line': 1
                },
                'indent': []
            }
        });

        assert.deepEqual(getDefinition('foo'), null);
    });

    it('should work on weird identifiers', function () {
        var ast = mdast.parse('[__proto__]: http://proto.com "Proto"');
        var getDefinition = definitions(ast);

        assert.deepEqual(getDefinition('__proto__'), {
            'type': 'definition',
            'identifier': '__proto__',
            'link': 'http://proto.com',
            'title': 'Proto',
            'position': {
                'start': {
                    'column': 1,
                    'line': 1
                },
                'end': {
                    'column': 38,
                    'line': 1
                },
                'indent': []
            }
        });

        assert.deepEqual(getDefinition('toString'), null);
    });
});
