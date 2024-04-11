console.log('Exporting module')

// we have named and default export 
const shippingCost = 10;
export const cart = []
export const addToCart = function(product, quantity){
    cart.push({product, quantity})
    console.log(`${quantity} ${product} needed at the store`)
}
// this works with the help of closure
const ShoppingCart2 = (function(){
    const cart = []

    const addToCart = function(product, quantity){
        cart.push({product, quantity})
        console.log(`${quantity} ${product} added to the cart`)
    }
    return{
        cart, addToCart
    }
})()

ShoppingCart2.addToCart('apple', 4)
console.log(ShoppingCart2.cart)

// console.log(ShoppingCart2)
// using json api to fetch data
// try{
// const res = await fetch('https://jsonplaceholder.typicode.com/posts')
// const data = await res.json()
// console.log({title: data.at(-1).title, body: data.at(-1).body})
// }
// catch(err){
//     console.error(err.message)
// }