'use strict';

var test = require('tape');
var remark = require('remark');
var definitions = require('./index.js');

test('mdast-util-definitions', function (t) {
  var getDefinition;
  var tree;

  t.throws(
    function () {
      definitions();
    },
    /mdast-util-definitions expected node/,
    'should fail without node'
  );

  tree = remark().parse('[example]: http://example.com "Example"');
  getDefinition = definitions(tree);

  t.deepEqual(
    getDefinition('example'),
    {
      type: 'definition',
      identifier: 'example',
      url: 'http://example.com',
      title: 'Example',
      position: {
        start: {column: 1, line: 1, offset: 0},
        end: {column: 40, line: 1, offset: 39},
        indent: []
      }
    },
    'should return a definition'
  );

  t.equal(
    getDefinition('foo'),
    null,
    'should return null when not found'
  );

  tree = remark().parse('[__proto__]: http://proto.com "Proto"');
  getDefinition = definitions(tree);

  t.deepEqual(
    getDefinition('__proto__'),
    {
      type: 'definition',
      identifier: '__proto__',
      url: 'http://proto.com',
      title: 'Proto',
      position: {
        start: {column: 1, line: 1, offset: 0},
        end: {column: 38, line: 1, offset: 37},
        indent: []
      }
    },
    'should work on weird identifiers'
  );

  t.deepEqual(
    getDefinition('toString'),
    null,
    'should work on weird identifiers when not found'
  );

  tree = remark().parse([
    '[example]: http://one.com',
    '[example]: http://two.com'
  ].join('\n'));

  t.deepEqual(
    definitions(tree)('example').url,
    'http://two.com',
    'should prefer the last of duplicate definitions by default'
  );

  t.deepEqual(
    definitions(tree, {commonmark: true})('example').url,
    'http://one.com',
    'should prefer the first of duplicate definitions in commonmark mode'
  );

  t.end();
});
