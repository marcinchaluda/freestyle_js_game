const options = document.querySelectorAll('.option');


for(let i = 0; i < options.length; i++) {
   options[i].addEventListener('click', mark);
}

function mark(){

    for(let i = 0; i < options.length; i++) {
       // options[i].classList.remove('option_clicked');
        options[i].setAttribute('class', 'option')
    }
    this.setAttribute('class', 'option_clicked');
}


