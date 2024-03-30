const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
  };
  
  const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
  };
  
  const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
  };
  
  const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
  };
  
  const accounts = [account1, account2, account3, account4];
  
  // Elements
  const labelWelcome = document.querySelector('.welcome');
  const labelDate = document.querySelector('.date');
  const labelBalance = document.querySelector('.balance__value');
  const labelSumIn = document.querySelector('.summary__value--in');
  const labelSumOut = document.querySelector('.summary__value--out');
  const labelSumInterest = document.querySelector('.summary__value--interest');
  const labelTimer = document.querySelector('.timer');
  
  const containerApp = document.querySelector('.app');
  const containerMovements = document.querySelector('.movements');
  
  const btnLogin = document.querySelector('.login__btn');
  const btnTransfer = document.querySelector('.form__btn--transfer');
  const btnLoan = document.querySelector('.form__btn--loan');
  const btnClose = document.querySelector('.form__btn--close');
  const btnSort = document.querySelector('.btn--sort');
  
  const inputLoginUsername = document.querySelector('.login__input--user');
  const inputLoginPin = document.querySelector('.login__input--pin');
  const inputTransferTo = document.querySelector('.form__input--to');
  const inputTransferAmount = document.querySelector('.form__input--amount');
  const inputLoanAmount = document.querySelector('.form__input--loan-amount');
  const inputCloseUsername = document.querySelector('.form__input--user');
  const inputClosePin = document.querySelector('.form__input--pin');

  const currencies = new Map([
    ['USD', 'United States dollar'],
    ['EUR', 'Euro'],
    ['GBP', 'Pound sterling'],
  ]);
  


  const displayMovement = function(movement, sort = false){
    containerMovements.innerHTML =''

    const movs = sort ?  movement.splice().sort((a, b)=>a-b) : movement
  
    movs.forEach((mov, index)=>{
        const type = mov > 0 ? 'deposit' : 'withdrawal'
        const html = `<div class="movements__row">
        <div class="movements__type movements__type--${type}">${index +1}. ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>`
      containerMovements.insertAdjacentHTML('afterbegin', html)
    })
  }
 
  
  //calculating balance
  const calcDisplayBalance = function(acc){
     acc.balance  = acc.movements.reduce((accumulator, value)=>{
      return accumulator + value
    }, 0)
    labelBalance.textContent = `${acc.balance}€`
  }

  

  // computing summary 
  const calcDisplaysummary = function(acc){
    const incomes = acc.movements.filter(mov=>mov>0).reduce((acc, mov)=>{
      return acc+mov
    }, 0)
    labelSumIn.textContent = `${incomes}€`

    const out = acc.movements.filter(mov=>mov<0).reduce((acc, mov)=>{
      return acc+mov
    }, 0)
    labelSumOut.textContent = `${Math.abs(out)}€`

    const interest = acc.movements.filter(mov=>mov>0).map(deposit=>deposit*acc.interestRate/100)
    .filter(mov=>mov>=1)
    .reduce((acc, mov)=>{
      return acc +mov 
    }, 0)
    labelSumInterest.textContent = `${interest}€`
  }

  // computing username
  const createUsername = function(acct){
    acct.forEach((user)=>{
        user.username= user.owner.toLowerCase().split(' ').map((word)=>{
        return word.at(0)
      }).join('')
    })
  }
   
  createUsername(accounts)

  //update Ui
  const updateUi = function(acc){
      //Displaying movement
      displayMovement(acc.movements)

      //Displaying balance
      calcDisplayBalance(acc)

      //Displaying summary
      calcDisplaysummary(acc)
      
  }
  //implementing login
  let currentAccount;

  btnLogin.addEventListener('click', function(e){
    e.preventDefault()
    currentAccount = accounts.find(acc=>acc.username ===inputLoginUsername.value)
    console.log(currentAccount)

      if(currentAccount?.pin === Number(inputLoginPin.value)){
        // displaying Ui an message
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
        containerApp.style.opacity = 100
        updateUi(currentAccount)
      }
      //clear input field
      inputLoginUsername.value = inputLoginPin.value =''
      inputLoginPin.blur()
  })

btnTransfer.addEventListener('click', function(e){
  e.preventDefault()
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc=>acc.username===inputTransferTo.value)
  console.log(amount, receiverAcc)
  if(amount>0 && receiverAcc &&
     currentAccount.balance >=amount && 
     receiverAcc?.username!==currentAccount.username){
      currentAccount.movements.push(-amount)
      receiverAcc.movements.push(amount)
      updateUi(currentAccount)
  }
  inputTransferAmount.value = inputTransferTo.value =''

})

btnClose.addEventListener('click', function(e){
  e.preventDefault()
  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value)==currentAccount.pin){
    const index = accounts.findIndex((acc)=>acc.username==currentAccount.username)
    accounts.splice(index, 1)
    //hide Ui
    containerApp.style.opacity=0
  }
  inputCloseUsername.value = inputClosePin.value =''
})

btnLoan.addEventListener('click', function(e){
  e.preventDefault()
  const amount = Number(inputLoanAmount.value)
  if(amount>0 && currentAccount.movements.some(mov=>mov>=amount*0.1)){
    currentAccount.movements.push(amount)
    updateUi(currentAccount)
  }
  inputLoanAmount.value =''
})

let sorted = false
btnSort.addEventListener('click', function(e){
  e.preventDefault()
  displayMovement(currentAccount.movements, !sorted)
  sorted =!sorted
})

labelBalance.addEventListener('click', function(){
  const movemetsUI = Array.from(document.querySelectorAll('.movements__value'), 
  (el)=>{
    return Number(el.textContent.replace('€', ''))
  }
  )
  console.log(movemetsUI)
})
// flat and flatMap method
// const arr = [[1,2,3], [4,5,6],7,8]
// console.log(arr.flat())
// const arrDeep = [[[1,2],3], [4,
//   5,6],7,8] 

// console.log(arrDeep.flat(2))

// const overallBalance = accounts.map((acc)=>acc.movements).flat().reduce((accumulator, move)=>{
//   return accumulator+move
// }, 0)

// console.log(overallBalance)
// const overallBalance2 = accounts.flatMap((acc)=>acc.movements).reduce((accumulator, move)=>{
//   return accumulator+move
// }, 0)
// console.log(overallBalance2)
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// return < 0 A, B (keep order)
// return > 0 B, A (switch order)
// console.log(movements)

// movements.sort((a, b)=>{
//   if(a>b) return 1
//   if(b>a) return -1
// })
// movements.sort((a,b)=>a-b)


const x = new Array(7)
x.fill(1)
console.log(x)

const y = Array.from({length:4}, (_, i)=>i+1)
console.log(y)

const  z = Array.from('string', (e)=>{
  return e+'z'
})



// console.log(x1)