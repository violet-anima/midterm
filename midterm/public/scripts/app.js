$(() => {
$('form.new-resource').hide()
  $('h3').on('click', function (event) {
    $('form.new-resource').slideToggle(1000)
    $('textarea').select()
  });
});
