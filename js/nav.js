$(function(){
    var sections = {},
        _height  = $(window).height(),
        i        = 0;

    $('.section').each(function(){
        sections[this.name] = $(this).offset().top;
    });
    // Track navbar initial location
    var navbarPos = $("#main-nav").offset().top;

    $(document).scroll(function(){
        var $this = $(this),
            pos   = $this.scrollTop();
        if (pos >= navbarPos) {
          $("#main-nav").addClass("sticky");
        } else if (pos < navbarPos){
          $("#main-nav").removeClass("sticky");
        }
        for(i in sections){
            if(sections[i] > pos && sections[i] < pos + _height){
                $('a').removeClass('active');
                $('#nav_' + i).addClass('active');
            }
        }
    });
});


// // for the sharing buttons 
// $(function() {
//     var $sidebar   = $(".share-buttons"), 
//         $window    = $(window),
//         offset     = $sidebar.offset(),
//         topPadding = 300;

//     $window.scroll(function() {
//         if ($window.scrollTop() > offset.top) {
//             $sidebar.stop().animate({
//                 marginTop: $window.scrollTop() - offset.top + topPadding,
//                 duration:0
//             });
//         } else {
//             $sidebar.stop().animate({
//                 marginTop: 0,
//                 duration:0
//             });
//         }
//     });
    
// });
