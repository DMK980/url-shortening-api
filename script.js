// variables 

//hamburger menu
const hamburgerMenu = document.getElementsByClassName("hamburger")[0]
const nav = document.getElementsByTagName("nav")[0]

//user input variables requried
const userInput = document.getElementById('linkshortening-input-container').children[0]
const userInputError = document.getElementById('linkshortening-input-container').children[1]

const answerDiv = document.getElementById("linkshortening-answer-div")
const submitbtn = document.getElementById("shorten-it-btn");
const shortenedLinks = []

//input select EventListener
userInput.addEventListener("focus",()=>{
    userInput.value ? userInput.select():""
})

// Copy button EventListener
answerDiv.addEventListener('click',(e)=>{
    if(e.target.localName === "button"){
        navigator.clipboard.writeText(e.target.parentElement.children[1].href)
    }
})

// Hamburger Menu EventListener
hamburgerMenu.addEventListener("click",()=>{
    nav.classList.toggle('nav-hidden')
});
//populates already saved links
populate()

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
        sessionStore(userInput.value,shortlink)
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
                <button id="copyBtn"class="button-3">Copy</button>
            </div>
            `
}

// Asynchronous function
async function apiCalling(url){
    /*
        Function calls the api and gets the 
        shortened url.
    */
    const apiurl = `https://api.tinyurl.com/create`
    const apiKey = `xfpMKA4UlmRvkpb6beW5tEtXzmKocgpgk92ykhgkU2XZgXAMGy6S4kiGEfwj`
    const response = await fetch(apiurl,{
        method:"POST",
        headers:{
            'content-Type':'application/json',
            "Authorization":`Bearer ${apiKey}`
        },
        body: JSON.stringify({url:inputValidation(url)})
    });
    !response.ok ? console.log(response.status):console.log('Run successfully');
    const data = await response.json()
    return data.data.tiny_url
}

function sessionStore(userinput,shortlink){
    /*
        Function stores the shortened links
        in the session storage
    */
   if(localStorage.getItem('links')){
    JSON.parse(localStorage.getItem('links')).map((link)=>{
        shortenedLinks.push(link)
    })
   }
    shortenedLinks.push({userInput:userinput,shortlink:shortlink})
    localStorage.setItem("links",JSON.stringify(shortenedLinks))
}

function populate(){
    /*
        Function populates the links
        section with shortened links 
        saved in session storage.
    */
   if(localStorage.getItem('links')){
    JSON.parse(localStorage.getItem('links')).map((link)=>{
        answerDiv.innerHTML += shortenedLinksHTML(link.userInput,link.shortlink)
    })
   }
}

function inputValidation(url){
    /*
        Function makes sure the url 
        is in good format for the API
    */
   if(!url.includes('https') || !url.includes('http')){
    let validUrl = `https://${url}`
    return validUrl
   } else{
    return url
   }
}

function inputValidation(url){
    /*
        Function makes sure the url 
        is in good format for the API
    */
   if(!url.includes('https') || !url.includes('http')){
    let validUrl = `https://${url}`
    return validUrl
   } else{
    return url
   }
}

