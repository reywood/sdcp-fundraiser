const eventDate = new Date('2018-05-18T18:00:00-0700');

setInterval(() => {
    const {days, hours, minutes, seconds} = timeLeft();
    const pluralize = (number, label) => {
        if (number === 1) {
            return `${number} ${label}`;
        }
        return `${number} ${label}s`;
    };

    if (days + hours + minutes + seconds > 0) {
        $('.time-left').html(`
            ${pluralize(days, 'day')} &nbsp;&nbsp;
            ${pluralize(hours, 'hour')} &nbsp;&nbsp;
            ${pluralize(minutes, 'minute')} &nbsp;&nbsp;
            ${pluralize(seconds, 'second')}
        `);
    }
}, 1000);

function timeLeft() {
    const now = new Date();
    const secondsLeft = (eventDate.getTime() - now.getTime()) / 1000;
    const daysLeft = Math.floor(secondsLeft / 60 / 60 / 24);
    const hoursLeft = Math.floor(secondsLeft / 60 / 60) % 24;
    const minutesLeft = Math.floor(secondsLeft / 60) % 60;

    return {
        days: daysLeft,
        hours: hoursLeft,
        minutes: minutesLeft,
        seconds: Math.floor(secondsLeft % 60),
    };
}
