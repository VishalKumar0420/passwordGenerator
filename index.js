const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const copyMsg = document.querySelector("[data-copyMsg]");
const copybtn = document.querySelector("[data-copy]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolcheck = document.querySelector("#symbols");
const lenghtNumber = document.querySelector("[data-lenghtNumber]");
const lengthSlider = document.querySelector("[data-lengthSlider]");
const indicator = document.querySelector("[data-indicator]");
const genrateBtn = document.querySelector(".generatebtn");
const tooltip =document.querySelector(".tooltip")

//for all Checkbox selection
const allcheckbox = document.querySelectorAll("input[type=checkbox]");

let password = "";
let passwordLength = 10;
let checkCount = 0;
let symbols = ["~","!", "@","#","$","^","&","*","(",")","_","-","=","+","`",",",".","/","<",">","?",";",":","'","[","{","]","}","%","|","\\"];

handleSlider();

//set strength circle color to grey
setIndicator("#ccc");

//set password length
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =((passwordLength - min)*100/(max-min)) + "%  100%";


}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random()*(max - min)+min);
}

function genRndNumber() {
  return getRndInteger(0, 9); //generate random numbers
}

function genLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123)); //generate random lowercase letters
}

function genUpperCase() {
  return String.fromCharCode(getRndInteger(65, 98)); //generate random upper letters
}

function genSymbols() {
  const ranNum = getRndInteger(0, symbols.length);
  return symbols[ranNum];
}

function calcStrenght() {
  let upper = false;
  let lower = false;
  let number = false;
  let symbols = false;

  if (uppercaseCheck.checked) {
    upper = true;
  } 
   if (numbersCheck.checked) {
    lower = true;
  } 
   if (lowercaseCheck.checked) {
    upper = true;
  } 
  if(symbolcheck.checked) {
    symbols= true;
  }

  if(upper && lower && (number || symbols) && passwordLength >= 8) 
  {
    setIndicator("#0f0");
  }

  else if((upper || lower) && (number || symbols) && passwordLength>=6)
  {
    setIndicator("#ff0");
  }
  else{
    setIndicator("#f00");
  }
}

async function copyContent()
{
    try{
      let copyContent=await navigator.clipboard.writeText(passwordDisplay.value);
      tooltip.innerText="Copied";
      // to make copy span visible
      copyMsg.classList.add("active");
      setTimeout(()=>
      {
        copyMsg.classList.remove("active");
      },2000);

    }
    catch(e)
    {
        copyMsg.innerText="Failed";

    }
    

}

function shufflePassword(array)
{
  //fisher Yates method

  for(let i = array.length - 1 ; i >0 ; i--)
  {
    const j = Math.floor(Math.random()*(i+1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  let str ="";
  array.forEach((Element)=>(str+=Element))
  return str;
}
// Event listners

function handleCheckboxChange()
{
    checkCount = 0;
    allcheckbox.forEach((checkbox)=>
    {
        if(checkbox.checked)
        {
            checkCount++;
        }
    });

    //special condition

    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }
}

allcheckbox.forEach((checkbox)=>
{
    checkbox.addEventListener('change' , handleCheckboxChange)
})

inputSlider.addEventListener('input' , (e)=>
{
    passwordLength=e.target.value;
    handleSlider();
})

copybtn.addEventListener("click" , ()=>
{
  // console.log("clicked");
  // console.log(password.length);
    if(password.length>0)
    {
        copyContent();
    }
})

genrateBtn.addEventListener("click",()=>
{
    //none of the checkbox are selected
    
    if(checkCount <= 0) return;
    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }

    //Remove the password
    password = "";

    let funArr=[];
    
    if(uppercaseCheck.checked)
    {
        funArr.push(genUpperCase);
    }
    if(lowercaseCheck.checked)
    {
        funArr.push(genLowerCase);
    }
    if(numbersCheck.checked)
    {
        funArr.push(genRndNumber);
    }
    if(symbolcheck.checked)
    {
        funArr.push(genSymbols);
    }

    //compulsory addition
    for(let i =0 ; i< funArr.length ; i++)
    {
        password +=funArr[i]();
    }
    //remaining additiion
    for(let i = 0; i< passwordLength - funArr.length; i++)
    {
      
      let ranIndex = getRndInteger(0 , funArr.length);

      password += funArr[ranIndex]();
    }

    //password shuffling
    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password
    
    //calculate the strength
    calcStrenght();
});
