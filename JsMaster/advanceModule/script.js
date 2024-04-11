// Importing module
import * as allContent  from './shoppingCart.js'
import cloneDeep from 'lodash-es'
console.log('Importing module')

allContent.addToCart('bread', 10)
allContent.addToCart('rice', 20)
allContent.addToCart('beans', 30)

console.log(allContent.cart)


let x = [{
    title:'html, css javascript',
    body: 'tailwindcss'
},
{
    title:'big man',
    body: 'tech bro'
},
{
    title:'a front end web developer, html, css ',
    body: 'i will be successful'
}]
console.log({title: x.at(-1).title, body: x.at(-1).body})

const state = {
    cart: [
        {product: 'bread', quantity:5},
        {product: 'pizza', quantity: 10}
    ],
    user: {
        loggedIn: true
    }
}

const stateClone = Object.assign({}, state)
console.log(stateClone)

// using the lodash library
const deepClone = cloneDeep(state)
console.log(deepClone)
state.user.loggedIn = false

if(module.hot){
    module.hot.accept()
}