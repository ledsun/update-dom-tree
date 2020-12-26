# update-dom-tree

This is a JavaScript function to update DOM tree according to given html.

## Benefit

Make easy DOM updating logics and Make easy to change User Interface.
This is similar to [virtual-dom](https://github.com/Matt-Esch/virtual-dom)

### Difference from virtual-DOM

You need simple HTML document.
This function need a target DOM to update and a HTML text as input parameters.
[hyperscript](https://github.com/hyperhype/hyperscript) is not necessary.

This function is not tuned to insert a new element to middle of existing elements.
Just work, but all elements after the new element are repainted.

## Algorithm

Follow steps below:

1. Parse a HTML text to an abstract syntax tree by [parse5](https://github.com/inikulin/parse5)
2. Traverse a DOM tree and Update

## Typically Usage Sample

Use [handlebars](http://handlebarsjs.com/) to create HTML text.

```js
const dom = document.querySelector('.target')
render(dom, { message: 'Hello world!' })

function render(dom, model) {
  const template = Handlebars.compile(`
  <div class="message-region">
    <span>{{message}}</span>
  </div>
  `)
  const html = template(model)
  updateDomTree(dom, html)
}
```

### Use with the EventEmitter to observe the model

If you want observe change of model, use the [EventEmitter](https://nodejs.org/api/events.html) to make model enable to fire events.

```js
class model extends EventEmitter {
  constructor() {
    super()
    this._message = ''
  }

  get message() {
    return this._message
  }

  set message(message) {
    this._message = message
    this.emit('update')
  }
}

new Model().on('update' => render(dom, model))
```

### Use with event delegation to observe user operation events

If you want observe events fired in DOM elements created by this function, use event delegation.

```js
document.addEventLitener('click', ({target}) => {
  if(target.closest('.message-region')) {
    model.message = 'Good night world!'
  }
})

```

### Suppress hight frequently update

If trigger events to call this function are more frequent than finish this function, use `requestAnimationFrame` to make this function asynchronous and manage state of running.

```js
throttle(() => render(dom, model))

let isInUpdate
function throttle(process) {
  if (!isInUpdate) {
    isInUpdate = true
    requestAnimationFrame(() => {
      process()
      isInUpdate = false
    })
  }
}
```

### See an example

```
npm i
npm run example
```

Open http://localhost:8080/example.html

## TODO

- [ ] Update [boolean attributes](https://www.w3.org/TR/html5/infrastructure.html#sec-boolean-attributes) other than checked and disabled
