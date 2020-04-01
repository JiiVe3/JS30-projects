let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

buttons.forEach(button => button.addEventListener('click', function() { timer(this.dataset.time) }));
document.customForm.addEventListener('submit', function(e) {
  e.preventDefault();
  timer(this.minutes.value * 60);
  this.reset();
});

function timer(seconds) {
  const now = Date.now();
  const then = now + seconds * 1000;

  clearInterval(countdown);
  displayTimeLeft(seconds);
  displayEndTime(then);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);

    if(secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }

    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(seconds) {
  const display = `${Math.floor(seconds / 3600)}:${('0' + Math.floor(seconds / 60) % 60).slice(-2)}:${('0' + seconds % 60).slice(-2)}`;
  document.title = display;
  timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {
  const end = new Date(timestamp);
  endTime.textContent = `Be Back At ${end.getHours()}:${('0' + end.getMinutes()).slice(-2)}`;
}
