// variables 

//hamburger menu
const hamburgerMenu = document.getElementsByClassName("hamburger")[0]
const nav = document.getElementsByTagName("nav")[0]

//user input variables requried
const userInput = document.getElementById('linkshortening-input-container').children[0]
const userInputError = document.getElementById('linkshortening-input-container').children[1]

const answerDiv = document.getElementById("linkshortening-answer-div")
const submitbtn = document.getElementById("shorten-it-btn");

// Hamburger Menu EventListener
hamburgerMenu.addEventListener("click",hamburgerAction);

function hamburgerAction(e){
    /* 
        Function toggles the nav bar
        on mobile devices
    */
    nav.classList.toggle('nav-hidden')
}

submitbtn.addEventListener('click',submit)

// submit function
async function submit(){
    /*
        Function handles the submit of the link
        including error handling
    */
    if(!userInput.value && !userInput.classList.contains('error')){
        userInput.classList.add('error')
        userInputError.style.visibility = "visible"
    } else if(userInput.value){
        userInput.classList.remove('error')
        userInputError.style.visibility = "hidden"

        // API integration goes here
        const shortlink = await apiCalling(userInput.value)
        answerDiv.innerHTML += shortenedLinksHTML(userInput.value,shortlink)
    }
}

// HTML for shortened links
function shortenedLinksHTML(prevLink,shortenedLink){
    /*
        Function creates the inner html
        for the shortened links
    */
    return `<div id="shortenedlinks-div">
                <p>${prevLink}</p>
                <a href="${shortenedLink}">${shortenedLink}</a>
                <button class="button-3">Copy</button>
            </div>
            `
}

// Asynchronous function
async function apiCalling(url){
    /*
        Function calls the api and gets the 
        shortened url.
    */
    const apiurl = `https://serverlessfunction-rjk1oyrc9-dmk980s-projects.vercel.app`
    const response = await fetch(apiurl,{
        method:"POST",
        headers:{
            'content-Type':'application/json'
        },
        body: JSON.stringify({ url })
    });
    !response.ok ? console.log(response.status):console.log('Run successfully');

    const json = await response.json()
    console.log(json)
    return json.result_url
}
