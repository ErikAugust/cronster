
$(document).ready(function() {
  // Signup form submit handler
  $('#signup-form').submit(function(event) {
    event.preventDefault(); // Prevent form submission

    // Get form data
    var formData = {
      username: $('#username').val(),
      email: $('#email').val(),
      password: $('#password').val()
    };

    // Send POST request to /api/users
    $.ajax({
      url: '/api/users',
      method: 'POST',
      data: formData,
      success: function(response) {
        // Hide error alert
        $('#error-alert').addClass('d-none');

        // Show success message
        $('#success-alert').removeClass('d-none');
        
        // Save token to local storage
        const { token } = response;
        localStorage.setItem('token', token);
  
        // Redirect to the dashboard page after 2 seconds
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      },
      error: function(xhr, status, error) {
        // Show error message to the user
        $('#error-alert').text(xhr.responseJSON.message);
        $('#error-alert').removeClass('d-none');
      }
    });
  });
});
