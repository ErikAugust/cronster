$(document).ready(function() {

  var calculateTimeDifference = function(date) {
    const given = moment(date);
    const current = moment();

    const duration = moment.duration(current.diff(given));
    const days = Math.trunc(duration.asDays());

    return {
      date,
      days: Math.abs(days),
      hours: Math.abs(duration.hours()),
      minutes: Math.abs(duration.minutes()),
      seconds: Math.abs(duration.seconds())
    }
  }

  $('.countdown-timer').each(function() {
      const $this = $(this);
      const targetDate = new Date($this.data('datetime'));

      const timer = setInterval(function() {
          var diff = calculateTimeDifference(targetDate);

          // Update each paragraph tag
          $this.find('.days').text(diff.days + ' days');
          $this.find('.hours').text(diff.hours + ' hours');
          $this.find('.minutes').text(diff.minutes + ' minutes');
          $this.find('.seconds').text(diff.seconds + ' seconds');
      }, 1000);
  });
});