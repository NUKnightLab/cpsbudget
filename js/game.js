$ = jQuery;
$(document).ready(function(){
  var SALARY_t = "I want my children to receive individual attention from teachers and staff so they can benefit from personalized advising and be better prepared for colleges."
  function updateRankings(){
    console.log("updateRankings");
   var counter = 0;
   $(".priority li").each(function(index){
     console.log(this);
      $(this).attr('id', counter);
      var card = $(this).children(".card");
      $(card).children(".number").html(counter+1);
      counter++;
   });
  }
  $(".priority").sortable({
    forceHelperSize: true,
    placeholder: "card-placeholder",
    forcePlaceholderSize: true,
    update: function(event){
      updateRankings();
      console.log("updated");
    }
  });
  // disables text selection w/in elements for easier dragging
  $(".priority").disableSelection();

  $("#rank").click(function(){
    var choice = ($(".description")[0]).innerHTML;
    console.log(choice);
    if (choice == SALARY_t) {
      $("#understanding").text("If money equals priority, it seems that you have a pretty good sense of how the budget of your kid school is spent.");
    }
    else{
      $("#understanding").text("If money equals priority, it seems that the budget of your children’s school is being spent with a different mindset.");
    }
    $('html, body').animate({scrollTop: $('.budget-2015').offset().top}, 500);
    $content = $('.game-content');
    $content.slideToggle(500, function() {
      $('#rank').text(function(){
        return $content.is(":visible")? "I think I got it!" :"Play Again";
      })
    })
  });

  updateRankings();
});
