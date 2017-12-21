const assert = require('assert')
const parse5 = require('parse5')
const diffAndUpdateChildren = require('./lib/diff-and-update-children')

module.exports = function(dom, html) {
  assert(dom, 'dom is a necessary parameter')

  const ast = parse5.parseFragment(html.trim())
  diffAndUpdateChildren(ast, dom)
}
