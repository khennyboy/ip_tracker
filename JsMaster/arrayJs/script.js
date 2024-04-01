const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2024-03-26T17:01:17.194Z",
    "2024-03-30T23:36:17.929Z",
    "2024-03-31T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2024-06-25T18:49:59.371Z",
    "2024-03-31T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

// const account1 = {
//     owner: 'Jonas Schmedtmann',
//     movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//     interestRate: 1.2, // %
//     pin: 1111,
//   };
  
//   const account2 = {
//     owner: 'Jessica Davis',
//     movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//     interestRate: 1.5,
//     pin: 2222,
//   };
  
//   const account3 = {
//     owner: 'Steven Thomas Williams',
//     movements: [200, -200, 340, -300, -20, 50, 400, -460],
//     interestRate: 0.7,
//     pin: 3333,
//   };
  
//   const account4 = {
//     owner: 'Sarah Smith',
//     movements: [430, 1000, 700, 50, 90],
//     interestRate: 1,
//     pin: 4444,
//   };
  
  // const accounts = [account1, account2, account3, account4];
  const accounts = [account1, account2];
  
  
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
  
  const formatMovement = function(date, locale){
    const calcdaysPassed = ((date1, date2)=>{
      return Math.round(Math.abs((date2-date1)/(1000*60*60*24)))
    })
    const daysPassed = calcdaysPassed(new Date(), date)
    
    if(daysPassed===0) return 'Today'
    if(daysPassed===1) return 'Yesterday'
    if(daysPassed<=7) return `${daysPassed} days ago`
    // const day = `${date.getDate()}`.padStart(2, 0)
    // const month = `${date.getMonth()+1}`.padStart(2, 0)
    // const year = date.getFullYear()
    // return `${day}/${month}/${year}`  
    return new Intl.DateTimeFormat(locale).format(date)
  }

 
  const displayMovement = function(acc, sort = false){
    containerMovements.innerHTML =''

    const movs = sort ?  acc.movements.slice().sort((a, b)=>a-b) : acc.movements
    
    movs.forEach((mov, index)=>{
        const type = mov > 0 ? 'deposit' : 'withdrawal'
        const date = new Date(acc.movementsDates[index])
        const displayDate = formatMovement(date, acc.locale)

        const formattedMov = formatCur(mov, acc.locale, acc.currency)
      
        const html = `<div class="movements__row">
        <div class="movements__type movements__type--${type}">${index +1}. ${type}</div>
        
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>`
      containerMovements.insertAdjacentHTML('afterbegin', html)
    })
  }
 
  //formatting of currency
  const formatCur = function(value, locale, currency){
    return  new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(value)
  }
  //calculating balance
  const calcDisplayBalance = function(acc){
     acc.balance  = acc.movements.reduce((accumulator, value)=>{
      return accumulator + value
    }, 0)
    
    labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency)
  }

  

  // computing summary 
  const calcDisplaysummary = function(acc){
    const incomes = acc.movements.filter(mov=>mov>0).reduce((acc, mov)=>{
      return acc+mov
    }, 0)
    labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency)

    const out = acc.movements.filter(mov=>mov<0).reduce((acc, mov)=>{
      return acc+mov
    }, 0)
    labelSumOut.textContent = formatCur(out, acc.locale, acc.currency)

    const interest = acc.movements.filter(mov=>mov>0).map(deposit=>deposit*acc.interestRate/100)
    .filter(mov=>mov>=1)
    .reduce((acc, mov)=>{
      return acc +mov 
    }, 0)
    labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency)
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
      displayMovement(acc)

      //Displaying balance
      calcDisplayBalance(acc)

      //Displaying summary
      calcDisplaysummary(acc)
      
  }
  //implementing login
  let currentAccount, timer;

  btnLogin.addEventListener('click', function(e){
    e.preventDefault()
    currentAccount = accounts.find(acc=>acc.username ===inputLoginUsername.value)
    console.log(currentAccount)

      if(currentAccount?.pin === +(inputLoginPin.value)){
        // displaying Ui an message
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
        containerApp.style.opacity = 100
        if(timer) clearInterval(timer)
        timer = startLogOutUser()
        console.log(timer)
        console.log(startLogOutUser())
        updateUi(currentAccount)
        //implementing date
      // const now = new Date()
      // const day = `${now.getDate()}`.padStart(2, 0)
      // const month = `${now.getMonth()+1}`.padStart(2, 0)
      // const year = now.getFullYear()
      // const hour = `${now.getHours()}`.padStart(2, 0)
      // const min = `${now.getMinutes()}`.padStart(2, 0)
      // const sec = `${now.getSeconds()}`.padStart(2, 0)
      // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}:${sec}`
      // internationalization API
      const now = new Date()
      const options = {
        hour: 'numeric',
        minute: 'numeric',
        day: 'numeric',
        month: 'numeric',
        year:'numeric',
        // weekday: 'long'
      }
      const locale = currentAccount.locale

      labelDate.textContent = new Intl.DateTimeFormat(locale,  options).format(now)
        //clear input field
        inputLoginUsername.value = inputLoginPin.value =''
        inputLoginPin.blur()
      }
  })

btnTransfer.addEventListener('click', function(e){
  e.preventDefault()
  const amount = +(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc=>acc.username===inputTransferTo.value)
  console.log(amount, receiverAcc)
  if(amount>0 && receiverAcc &&
     currentAccount.balance >=amount && 
     receiverAcc?.username!==currentAccount.username){
      currentAccount.movements.push(-amount)
      receiverAcc.movements.push(amount)
      currentAccount.push(new Date().toISOString())
      receiverAcc.push(new Date().toISOString())
      updateUi(currentAccount)
  }
  inputTransferAmount.value = inputTransferTo.value =''

})

btnClose.addEventListener('click', function(e){
  e.preventDefault()
  if(inputCloseUsername.value === currentAccount.username && +(inputClosePin.value)==currentAccount.pin){
    const index = accounts.findIndex((acc)=>acc.username==currentAccount.username)
    accounts.splice(index, 1)
    //hide Ui
    containerApp.style.opacity=0
  }
  inputCloseUsername.value = inputClosePin.value =''
})

btnLoan.addEventListener('click', function(e){
  e.preventDefault()
  const amount = Math.floor(inputLoanAmount.value)
  if(amount>0 && currentAccount.movements.some(mov=>mov>=amount*0.1)){
    setTimeout(()=>{
      currentAccount.movements.push(amount)
      currentAccount.movementsDates.push(new Date().toISOString())
    updateUi(currentAccount)
    }, 2500)
  }
  inputLoanAmount.value =''
})

let sorted = false
btnSort.addEventListener('click', function(e){
  e.preventDefault()
  displayMovement(currentAccount, !sorted)
  sorted =! sorted
 
})

//Timer function

const startLogOutUser = function(){
  //set timer to 5 minutes
  let time = 100;
const tick = function(){
  const min = String(Math.trunc(time/60)).padStart(2, 0)
  const sec = String(time%60).padStart(2, 0)
   labelTimer.textContent = `${min}:${sec}`
   //log the user out once the time is zero
   if(time==0){
    clearInterval(Clear_timer)
    labelWelcome.textContent = 'Login to get started'
    containerApp.style.opacity = 0
   }
   time--
}
  tick()
  //call the timer every second
  const Clear_timer = setInterval(tick, 1000)
  return Clear_timer;
}


// Fake always logged
// currentAccount = account1;
// updateUi(currentAccount)
// containerApp.style.opacity = 10
// const now = new Date()
//       const options = {
//         hour: 'numeric',
//         minute: 'numeric',
//         day: 'numeric',
//         month: 'numeric',
//         year:'numeric',
//         // weekday: 'long'
//       }
//       const locale = currentAccount.locale
//       labelDate.textContent = new Intl.DateTimeFormat(locale,  options).format(now)
//       labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`

// formatting number
// const num = 3884748.887;
// const option = {
//   style:'currency',
//   unit : 'mile-per-hour',
//   currency: 'EUR'
//   // useGrouping: false
// }
// console.log(new Intl.NumberFormat('en-US', option).format(num))


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


// const x = new Array(7)
// x.fill(1)
// console.log(x)

// const y = Array.from({length:4}, (_, i)=>i+1)
// console.log(y)

// const  z = Array.from('string', (e)=>{
//   return e+'z'
// })

// console.log(x1)
