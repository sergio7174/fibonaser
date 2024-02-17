const contactForm = document.querySelector('.contacto-form');
let nombre = document.getElementById('nombre');
let email = document.getElementById('email');
let subject = document.getElementById('subject');
let message = document.getElementById('mensaje');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let formData = {
        name: nombre.value,
        email: email.value,
        subject: subject.value,
        message: message.value
    }

    console.log(formData);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.onload = function() {
        console.log(xhr.responseText);
        if(xhr.responseText == 'success'){
            alert('E-mail ha sido enviado');
            nombre.value = '';
            email.value = '';
            subject.value = '';
            message.value = '';
        }else{
            alert('Something went wrong!')
        }
    }

    xhr.send(JSON.stringify(formData));
});