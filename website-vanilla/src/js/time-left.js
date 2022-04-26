$(() => {
    timeLeftDisplay.init();
});

const timeLeftDisplay = {
    init() {
        this.update();
        $('.time-left').animate({ opacity: 1 }, 500);
        setInterval(() => this.update(), 15 * 1000);
    },

    update() {
        const { weeks, days, hours, minutes, seconds } = this.getTimeLeft();

        if (days + hours + minutes + seconds <= 0) {
            $('.time-left').html('');
            return;
        }

        if (weeks > 0) {
            this.display([[weeks, 'week']]);
        } else if (days > 0) {
            this.display([[days, 'day']]);
        } else {
            this.display([
                [hours, 'hour'],
                [minutes, 'minute']
            ]);
        }
    },

    display(timeComponents) {
        const html = timeComponents
            .map(([value, label]) => `<span>${this.pluralize(value, label)}</span>`)
            .join(' and ');
        $('.time-left').html(html + ' until party time!');
    },

    pluralize(number, label) {
        if (number === 1) {
            return `${number} ${label}`;
        }
        return `${number} ${label}s`;
    },

    getTimeLeft() {
        const now = new Date();
        const secondsLeft = (config.eventStartDate.getTime() - now.getTime()) / 1000;
        const weeksLeft = Math.floor(secondsLeft / 60 / 60 / 24 / 7);
        const daysLeft = Math.floor(secondsLeft / 60 / 60 / 24) % 7;
        const hoursLeft = Math.floor(secondsLeft / 60 / 60) % 24;
        const minutesLeft = Math.floor(secondsLeft / 60) % 60;

        return {
            weeks: weeksLeft,
            days: daysLeft,
            hours: hoursLeft,
            minutes: minutesLeft,
            seconds: Math.floor(secondsLeft % 60)
        };
    }
};
