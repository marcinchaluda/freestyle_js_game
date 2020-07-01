const options = document.querySelectorAll('.option');

options.forEach(setEvents);

function setEvents(option){
    option.setAttribute('selected', 'False');
    option.addEventListener('click', mark);
}

function mark(){

    for(let i = 0; i < options.length; i++) {
        options[i].setAttribute('class', 'option');
        options[i].setAttribute('selected', 'False');
    }
    this.setAttribute('selected', 'True');
    this.setAttribute('class', 'option_clicked');
}


