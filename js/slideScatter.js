$(function getStep(){
	var graphStep;
	$("#steps").click(function(event) {
	    graphStep = $(event.target).text();
	    //set current step
	    $('#steps li').removeClass('active-step');
	    var currentStep = "#" + "step" + graphStep;
	    $(currentStep).addClass("active-step");
	    //reset the classes for d3 generated objects
		$("#graph-step2").attr("class", "graph-exp");
		$("#graph-step3").attr("class", "graph-exp");
		$("#graph-step4").attr("class", "graph-exp");
		//set explanation
	    $('.text-blocks-scatter p').removeClass('active-explanation');
	    var currentExp = "#" + "explanation" + graphStep;
	    $(currentExp).addClass("active-explanation");
	    //set graphs
	    var currentGraph = "#" + "graph-step" + graphStep;
	    console.log($(currentGraph))
	    $(currentGraph).attr("class", "active-graph");
  		reset_style();
	    update_scatter(graphStep);

	});
});


function update_scatter(graphStep) {
  console.log("UPDATE GRAPH");
  if (graphStep == 1) {
  	$('.my-school').css("opacity","1");
  	$('.similars').css("opacity","1");
  	// $('.district-dot').css("opacity","0.2");
  	// $('.charter-dot').css("opacity","0.2");
  }
  else if (graphStep == 2){
  	// $('.my-school').css("opacity","1");
  	// $('.similars').css("opacity","1");
  	// $('.district-dot').css("opacity","0.4");
  	// $('.charter-dot').css("opacity","0.4");
  }
  else if (graphStep == 3) {
  	var district_style = {
  		//strokeWidth: "5",
  		stroke: "#FFAE15",
  		opacity:"1"
  	}
  	$('.district-dot').css(district_style);
  }
  else if (graphStep == 4) {
  	var charter_style = {
  		//strokeWidth:"5",
  		stroke:"#7243A2",
  		opacity:"1"
  	}
  	$('.charter-dot').css(charter_style);
  }
}


function reset_style(){
	console.log("CALLED RESET");
	var district_original ={
		strokeWidth:"0",
		opacity:"0.2"
	}
	var charter_original = {
		strokeWidth:"0",
		opacity:"0.2"
	}
	$('.district-dot').css(district_original);
	$('.charter-dot').css(charter_original);
}


