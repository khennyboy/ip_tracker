console.log('Exporting module')

// we have named and default export 
const shippingCost = 10;
export const cart = []
export const addToCart = function(product, quantity){
    cart.push({product, quantity})
    console.log(`${quantity} ${product} needed at the store`)
}
//this works with the help of closure
const ShoppingCart2 = (function(){
    const cart = []
    const shippingCost = 10
    const totalPrice = 237;
    const totalQuantity = 23;

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

console.log(ShoppingCart2)