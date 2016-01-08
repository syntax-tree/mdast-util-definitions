'use strict';

/* eslint-env node */

/*
 * Dependencies.
 */

var test = require('tape');
var remark = require('remark');
var definitions = require('./index.js');

/*
 * Tests.
 */

test('mdast-util-definitions', function (t) {
    var getDefinition;
    var ast;

    t.throws(
        function () {
            definitions();
        },
        /mdast-util-definitions expected node/,
        'should fail without node'
    );

    ast = remark.parse('[example]: http://example.com "Example"');
    getDefinition = definitions(ast);

    t.deepEqual(
        getDefinition('example'),
        {
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
        },
        'should return a definition'
    );

    t.equal(
        getDefinition('foo'),
        null,
        'should return null when not found'
    );

    ast = remark.parse('[__proto__]: http://proto.com "Proto"');
    getDefinition = definitions(ast);

    t.deepEqual(
        getDefinition('__proto__'),
        {
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
        },
        'should work on weird identifiers'
    );

    t.deepEqual(
        getDefinition('toString'),
        null,
        'should work on weird identifiers when not found'
    );

    t.end();
});
