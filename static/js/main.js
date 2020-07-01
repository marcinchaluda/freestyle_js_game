const options = document.querySelectorAll('.option');

options.forEach(setEvents);

function setEvents(option){
    option.addEventListener('click', mark);
}

function mark(){
    let color = this.id;
    console.log(color);
    for(let i = 0; i < options.length; i++) {
        options[i].setAttribute('class', 'option');
    }
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("playerColor", color);
    }
    this.setAttribute('class', 'option_clicked');
}
