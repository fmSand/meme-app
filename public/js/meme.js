/**
 * @desc Attach click handler to all "Details" buttons for memes
 * Sends a POST request to record the meme as viewed and redirects to the details page
 */

jQuery(() => {
  $('.details-btn').on('click', function () {
    const memeData = $(this).data('meme');

    $.ajax({
      url: '/meme/track-viewed-meme',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(memeData),
      processData: false,
      success: function () {
        window.location.href = `/meme/${memeData.id}`;
      },
      error: function (xhr, status, error) {
        console.error('Error sending meme data:', error);
        if (xhr.status === 401) {
          window.location.href = '/auth/login';
        }
      },
    });
  });
});
