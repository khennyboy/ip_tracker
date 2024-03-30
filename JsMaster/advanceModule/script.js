// Importing module
import * as allContent  from './shoppingCart.js'
import cloneDeep from './node_modules/lodash-es/cloneDeep.js'
console.log('Importing module')

allContent.addToCart('bread', 10)
allContent.addToCart('rice', 20)
allContent.addToCart('beans', 30)

console.log(allContent.cart)

// using json api to fetch data
try{
const res = await fetch('https://jsonplaceholder.typicode.com/posts')
const data = await res.json()
console.log({title: data.at(-1).title, body: data.at(-1).body})
}
catch(err){
    console.error(err.message)
}
let x = [{
    title:'html, css javascript',
    body: 'tailwindcss'
},
{
    title:'big man',
    body: 'tech bro'
},
{
    title:'a front end web developer',
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

