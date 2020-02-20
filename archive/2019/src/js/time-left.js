// May 3, 2019 7:00pm -0700
const eventDate = new Date('2019-05-04T02:00:00Z');

$(() => {
    updateTimeLeftDisplay();
    $('.time-left').animate({opacity: 1}, 500);
    setInterval(updateTimeLeftDisplay, 15 * 1000);
});

function updateTimeLeftDisplay() {
    const {weeks, days, hours, minutes, seconds} = timeLeft();

    if (days + hours + minutes + seconds <= 0) {
        $('.time-left').html('');
        return;
    }

    if (weeks > 0) {
        display([[weeks, 'week']]);
    } else if (days > 0) {
        display([[days, 'day']]);
    } else {
        display([[hours, 'hour'], [minutes, 'minute']]);
    }
}

function display(timeComponents) {
    const html = timeComponents.map(([value, label]) => `<span>${pluralize(value, label)}</span>`).join(' and ');
    $('.time-left').html(html + ' until party time!');
}

function pluralize(number, label) {
    if (number === 1) {
        return `${number} ${label}`;
    }
    return `${number} ${label}s`;
};

function timeLeft() {
    const now = new Date();
    const secondsLeft = (eventDate.getTime() - now.getTime()) / 1000;
    const weeksLeft = Math.floor(secondsLeft / 60 / 60 / 24 / 7);
    const daysLeft = Math.floor(secondsLeft / 60 / 60 / 24) % 7;
    const hoursLeft = Math.floor(secondsLeft / 60 / 60) % 24;
    const minutesLeft = Math.floor(secondsLeft / 60) % 60;

    return {
        weeks: weeksLeft,
        days: daysLeft,
        hours: hoursLeft,
        minutes: minutesLeft,
        seconds: Math.floor(secondsLeft % 60),
    };
}
