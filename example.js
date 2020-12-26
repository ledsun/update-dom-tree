const {
  EventEmitter
} = require('events')
const updateDomTree = require('./')

// Prepare a tareg HTML to update.
document.body.innerHTML = `
<div class="target">
</div>
`

const BEFORE_DATA = [{
  checked: true,
  message: 'Hello world!'
}, {
  checked: true,
  message: 'Hello world!'
}]
const AFTER_DATA = [{
  checked: false,
  message: 'Good evening world!'
}, {
  checked: false,
  message: 'Good night world!'
}]

// Declare a model.
class Model extends EventEmitter {
  constructor() {
    super()
    this._hasAttribute = true
    this._dataList = BEFORE_DATA
  }

  set dataList(message) {
    this._dataList = message
    this.emit('update')
  }

  get dataList() {
    return this._dataList
  }

  set hasAttribute(val) {
    this._hasAttribute = val
  }

  get hasAttribute() {
    return this._hasAttribute
  }
}

// Declare a view.
function template(context) {
  const { hasAttribute, dataList } = context

  return `
  <ul class="message"${ hasAttribute ? ' hoge': ''}>
    ${ dataList.map(({ checked, message }) => `
    <li>
      <input type="checkbox"${ checked ? ' checked="checked"': ''}><span>${message}</span>
    </li>
    `).join('\n')}
  </ul>
  `
}

function render(dom, model) {
  const html = template(model)
  updateDomTree(dom, html)
}

// Bind the view to the model.
const model = new Model()
const dom = document.body.querySelector('.target')
model.on('update', () => render(dom, model))
let count = 0

// Bind the model to an user operation events.
document.addEventListener('click', ({
  target
}) => {
  if (target.closest('.message')) {
    model.hasAttribute = false
    model.dataList = [AFTER_DATA, BEFORE_DATA][count % 2]
    count += 1
  }
})

// Init the view.
render(dom, model)
