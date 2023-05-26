const inslider=document.querySelector("[data-lengthslider]");
const lengthdisplay=document.querySelector("[data-lengthnum]");
const passwordDisplay=document.querySelector("[data-passworddisplay]");
const copymsg =document.querySelector("[data-copymsg]");
const copybtn = document.querySelector("[data-copy]");
const allcheckbox =document.querySelectorAll("input[type=checkbox]");
const uppercasecheck =document.querySelector("#uppercase");
const  lowercasecheck=document.querySelector("#lowercase");
const numberscheck =document.querySelector("#numbers");
const symbolscheck =document.querySelector("#symbols");
const bttn =document.querySelector(".password");
const indicator =document.querySelector("[data-indicator]");
const symbols= '!~@#$%^&*()_+=-,./?<}>{}:;""/';

let password="";
let pl= 11;
let checkcount=0;
handleslider();

setindicator("#ccc");

function handleslider(){
    inslider.value = pl;
    lengthdisplay.innerText= pl;
    const min = inslider.min;
    const max = inslider.max;
    inslider.style.backgroundSize = ( (pl - min)*100/(max - min)) + "% 100%";
}
function setindicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
   }

function getrandinteger(min,max){
  return Math.floor(Math.random()* (max-min))+min ;
}

function generaterandomnumber(){
    return getrandinteger(0,9);
}
function generatelowercase(){
    return String.fromCharCode(getrandinteger(97,123))
}

//string.fromcharcode directly converts the ascii code to character-->



function generateuppercase(){
    return String.fromCharCode(getrandinteger(65,91))
}
function generatesymbol(){
    const randnum=getrandinteger(0,symbols.length);
    return symbols.charAt(randnum);
   }
function calcstrength(){
    let hasupper=false;
    let haslower=false;
    let hasnum=false;
    let hassym=false;
    if(uppercasecheck.checked)hasupper=true;
    if(lowercasecheck.checked)haslower=true;
    if(numberscheck.checked)hasnum=true;
    if(symbolscheck.checked)hassym=true;
    if(hasupper && haslower && (hasnum || hassym) && pl >=9) {
        setindicator("#0f0");
    }else if(
        (haslower || hasupper)&&(hasnum || hassym)&&(pl>=6)
    ){setindicator("#ff0");
}else{
    setindicator("#f00");
}
}
async function copycontent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copymsg.innerText="copied";
    }
    catch(e){
        copymsg.innerText="failed";
    }
    //to make copy span visible

    copymsg.classList.add("active");

    setTimeout(() =>{copymsg.classList.remove("active"); 
},2000); 
}
function shufflepassword(array){
    //fisher yates method apply on array and u can shuffle 
  for(let i=array.length-1;i>0;i--){
     const j=Math.floor(Math.random()*(i+1));
     //swapping
     const temp=array[i];
     array[i]=array[j];
     array[j]=temp;
  }
  let str="";
  array.forEach((el) => (str += el));
  return str;


}
function handlechechkboxchange(){
    checkcount=0;
    allcheckbox.forEach( (checkbox) => {
        if(checkbox.checked)
        checkcount++;
    });
    if(pl < checkcount){
        pl=checkcount;
        handleslider();
    }
}
allcheckbox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handlechechkboxchange);
})

inslider.addEventListener('input',(e)=>{
    pl=e.target.value;
    handleslider();
})
copybtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copycontent();
})




bttn.addEventListener('click',() =>{
     //none of the checkbox are selected
     if(checkcount==0) 
     return;
     if(pl < checkcount)
     {
        pl=checkcount;
        handleslider();
     }
     //lets start the journey to find new password
     password="";
     //lets put the stuff mentioned by checkbox

    //  if(uppercasecheck.checked){
    //     password += generateuppercase();
    //  }
    //  if(lowercasecheck.checked){
    //     password += generatelowercase();
    //  }
    //  if(numberscheck.checked){
    //     password += generaterandomnumber();
    //  }
    //  if(symbolscheck.checked){
    //     password += generatesymbol();
    //  }
    let funcarr=[];
    if(uppercasecheck.checked)
       funcarr.push(generateuppercase);
    if(lowercasecheck.checked)
       funcarr.push(generatelowercase);
     if(numberscheck.checked)
       funcarr.push(generaterandomnumber);
     if(symbolscheck.checked)
       funcarr.push(generatesymbol);
       //compulsory addition 
       for(let i=0 ; i<funcarr.length ; i++){
        password += funcarr[i]();
       }
       //remaining addition
       for(let i=0;i<pl-funcarr.length; i++){
        let randindex=getrandinteger(0,funcarr.length);
        password += funcarr[randindex]();
       }
       //shuffle the password
       password = shufflepassword(Array.from(password)) ;
       console.log("Shuffling done");
       passwordDisplay.value=password;
       console.log("UI adddition done");
       //calculate strength
       calcstrength();
       });

