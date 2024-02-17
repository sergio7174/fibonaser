const dropdowns = document.querySelector('.dropdowns');
const dropdownButton = document.querySelector('#drop-down');

dropdownButton.addEventListener('click', function() {

    if(!dropdownButton && dropdowns != null) return

    if(dropdowns.classList.contains('activo')) {
        dropdowns.classList.remove('activo')
    }
    else {
        dropdowns.classList.add('activo')
    }
});

document.addEventListener('click', function(event) {
    if (!event.target.closest('#dropdowns')) {
        dropdowns.classList.remove('activo')
    }
  });