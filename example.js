const {
  EventEmitter
} = require('events')
const Handlebars = require('handlebars')
const updateDomTree = require('./')

// Prepare a tareg HTML to update.
document.body.innerHTML = `
<div class="target">
</div>
`

// Declare a model.
class Model extends EventEmitter {
  constructor() {
    super()
    this._message = 'Hello world!'
  }

  set message(message) {
    this._message = message
    this.emit('update')
  }

  get message() {
    return this._message
  }
}

// Declare a view.
const template = Handlebars.compile(`
<div class="message">
  <span>{{message}}</span>
</div>
`)

function render(dom, model) {
  const html = template(model)
  updateDomTree(dom, html)
}

// Bind the view to the model.
const model = new Model()
const dom = document.body.querySelector('.target')
model.on('update', () => render(dom, model))

// Bind the model to an user operation events.
document.addEventListener('click', ({target}) => {
  if(target.closest('.message')) {
    model.message = 'Good night world!'
  }
})

// Init the view.
render(dom, model)
