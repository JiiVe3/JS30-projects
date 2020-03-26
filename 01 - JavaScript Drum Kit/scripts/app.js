const keys = document.querySelectorAll('.key');

window.addEventListener('keydown', keypress);
keys.forEach(key => key.addEventListener('transitionend', removeClass));


function keypress(e) {
    let key = document.querySelector(`div[data-key="${e.keyCode}"`);
    let audio = document.querySelector(`audio[data-key="${e.keyCode}"`);
    if (!audio) {return}
    key.classList.add('playing');
    audio.currentTime = 0;
    audio.play();
}

function removeClass(e) {
    if(e.propertyName !== 'transform') {return}
    this.classList.remove('playing');
}