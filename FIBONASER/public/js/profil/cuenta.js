const form = document.querySelector('acuerdo__form');
const nombre = document.getElementById('nombre');
const username = document.getElementById('username');
const email = document.getElementById('email');
const bio = document.getElementById('bio');
const web = document.getElementById('web');
const instagram = document.getElementById('instagram');
const github = document.getElementById('github');
const twitter = document.getElementById('twitter');

const validationMessagenombre = document.getElementById('validation-message-nombre');
const validationMessageUsername = document.getElementById('validation-message-username');
const validationMessageEmail = document.getElementById('validation-message-email');
const validationMessageBio = document.getElementById('validation-message-bio');
const validationMessageWeb = document.getElementById('validation-message-web');
const validationMessageInstagram = document.getElementById('validation-message-instagram');
const validationMessageGithub = document.getElementById('validation-message-github');
const validationMessageTwitter = document.getElementById('validation-message-twitter');

function validatenombre(message, add, remove) {
    validationMessagenombre.textContent = message;
    validationMessagenombre.classList.add(add)
    validationMessagenombre.classList.remove(remove)
}
function validateUsername(message, add, remove) {
    validationMessageUsername.textContent = message;
    validationMessageUsername.classList.add(add)
    validationMessageUsername.classList.remove(remove)
}
function validateEmail(message, add, remove) {
    validationMessageEmail.textContent = message;
    validationMessageEmail.classList.add(add)
    validationMessageEmail.classList.remove(remove)
}
function validateBio(message, add, remove) {
    validationMessageBio.textContent = message;
    validationMessageBio.classList.add(add)
    validationMessageBio.classList.remove(remove)
}
function validateWeb(message, add, remove) {
    validationMessageWeb.textContent = message;
    validationMessageWeb.classList.add(add)
    validationMessageWeb.classList.remove(remove)
}
function validateInstagram(message, add, remove) {
    validationMessageInstagram.textContent = message;
    validationMessageInstagram.classList.add(add)
    validationMessageInstagram.classList.remove(remove)
}
function validateGithub(message, add, remove) {
    validationMessageGithub.textContent = message;
    validationMessageGithub.classList.add(add)
    validationMessageGithub.classList.remove(remove)
}
function validateTwitter(message, add, remove) {
    validationMessageTwitter.textContent = message;
    validationMessageTwitter.classList.add(add)
    validationMessageTwitter.classList.remove(remove)
}

var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
var letterformat = /[a-zA-Z]/;

nombre.addEventListener('input', e => {
    e.preventDefault();
    nombreValue = nombre.value;

    if(nombreValue == "" || (!nombreValue.match(letterformat))) {
        validatenombre('Masukkan nombre kamu!', 'valid-error', 'valid-sukses')
    }
    else {
        validatenombre('', '', 'valid-error')
    }
})

username.addEventListener('input', e => {
    e.preventDefault();
    usernameValue = username.value;

    if(usernameValue == "") {
        validateUsername('Masukkan username!', 'valid-error', 'valid-sukses')
    }
    else {
        validateUsername('', '', 'valid-error')
    }
})

email.addEventListener('input', e => {
    e.preventDefault()
    emailValue = email.value;

    if(emailValue.match(mailformat)) {
        validateEmail('', '', 'valid-error');
    } 
    else {
        validateEmail('Email harus diisi yang valid!', 'valid-error', 'valid-sukses')
    }
})

const button = document.getElementById('btn-submit')
button.disabled = true;

function checkCuenta(nombre, username, email) {
    if((!nombre) || (!username) || (nombre.match(letterformat)) || (email.match(mailformat))){
        button.disabled = false;
        button.classList.remove('btn-valid-error')
    }
    else {
        button.disabled = true;
        button.classList.add('btn-valid-error')
    }
}

nombre.addEventListener('keyup', e => {
    e.preventDefault();
    nombrevalue = nombre.value;
    usernameValue = username.value;
    emailValue = email.value;
    checkAkun(nombrevalue, usernameValue, emailValue);
})

username.addEventListener('keyup', e => {
    e.preventDefault();
    nombrevalue = nombre.value;
    usernameValue = username.value;
    emailValue = email.value;
    checkAkun(nombrevalue, usernameValue, emailValue);
})

email.addEventListener('keyup', e => {
    e.preventDefault();
    nombrevalue = nombre.value;
    usernameValue = username.value;
    emailValue = email.value;
    if(emailValue.match(mailformat)) {
        button.disabled = false;
        button.classList.remove('btn-valid-error')
    }
    else {
        button.disabled = true;
        button.classList.add('btn-valid-error')
    }
})

instagram.addEventListener('keyup', e => {
    e.preventDefault();
    instagramValue = instagram.value;
    if(instagramValue != "") {
        button.disabled = false;
        button.classList.remove('btn-valid-error')
    }
    else {
        button.disabled = false;
        button.classList.remove('btn-valid-error')
    }
})
twitter.addEventListener('keyup', e => {
    e.preventDefault();
    twitterValue = twitter.value;
    if(twitterValue != "") {
        button.disabled = false;
        button.classList.remove('btn-valid-error')
    }
    else {
        button.disabled = false;
        button.classList.remove('btn-valid-error')
    }
})
github.addEventListener('keyup', e => {
    e.preventDefault();
    githubValue = github.value;
    if(githubValue != "") {
        button.disabled = false;
        button.classList.remove('btn-valid-error')
    }
    else {
        button.disabled = false;
        button.classList.remove('btn-valid-error')
    }
})
bio.addEventListener('keyup', e => {
    e.preventDefault();
    bioValue = bio.value;
    if(bioValue != "") {
        button.disabled = false;
        button.classList.remove('btn-valid-error')
    }
    else {
        button.disabled = false;
        button.classList.remove('btn-valid-error')
    }
})
web.addEventListener('keyup', e => {
    e.preventDefault();
    webValue = web.value;
    if(webValue != "") {
        button.disabled = false;
        button.classList.remove('btn-valid-error')
    }
    else {
        button.disabled = false;
        button.classList.remove('btn-valid-error')
    }
})