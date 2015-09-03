var EQUIPMENT = 0;
var CONTRACT = 1;
var COMMODITY = 2;
var TRANSPORTATION = 3;
var CONTINGENCY = 4;

var school_data;
var dataset;
var name_to_unit = {}
var school;
var similars;
var total_budget;

//Autocomplete bar
d3.csv("./js/data/unitList.csv",function (csv) {
    school_data=csv;
    init_autocomplete();
});

//Call back for when user selects a school
function select_school(school_name) {
  d3.json('./js/data/article1.json', function(error, data) {
    if (error) throw error;
    window.dataset = data;
    d3.select('body').selectAll('svg').remove();
    d3.select("body").selectAll("select").remove();
    for (i = 0; i < dataset.length; i++){
      if (dataset[i]['Unit Name'] == school_name) {
        school = dataset[i];
        school_short = school["School Name"];
        total_budget = school["FY2015ApprovedBudget"];
        similars = school["SimilarNames"].trim().split(",");
        for (j = 0; j < similars.length; j ++){
        similars[j] = similars[j].trim().replace("'","").replace("[","").replace("]","").replace("'","");
        }
      }
    }   
    update_text(school); 
    draw_line_chart(school_short,school_name,similars,dataset);
    draw_pie_chart(school_name,total_budget);
    draw_scatter_plot(school,similars,dataset);
  });   
}

//Setup and render the autocomplete
function init_autocomplete() {
    var ac_data = [];
    for (var i = 0; i < school_data.length; i++) {
      ac_data.push(school_data[i]['Unit Name'])
      name_to_unit[school_data[i]['Unit Name']] = school_data[i]['Unit']
    };
    $(".search #user_school").autocomplete({
      minLength: 4,
      delay: 400,
      focus: function () {
        $(".search #user_school").autocomplete("option", "delay", 0);
      },
      source: ac_data,
      select: function( event, ui ) {
        school_name = ui.item.value;
        window.location.hash = school_name;
        console.log("select handler user selected " + school_name + " aka " + name_to_unit[school_name]);
          for (i = 0; i < dataset.length; i++){
            if (ac_data[i] == school_name) {
              $('html, body').animate({scrollTop: $('#main-nav').offset().top}, 1000);
            }
          }
        select_school(school_name);
      }
    }).autocomplete("widget").addClass("fixed-height");
}

function update_text(school){
    reverse_text();
    $('.custom-formal-school-name').text(school['Unit Name']);
    $('.custom-school-name').text(school['School Name']);
    $('#custom-consistency').text(school['Consistency']);
    $('#custom-consistency-comparison').text(consistency_comparison_result(school));
    $('#custom-total-budget').text(currencyFormat(school['FY2015ApprovedBudget']));
    //set customize paragraph
    charter(school);
    charter_pie_explanation(school);
    $('#custom-salary').text(toPercent(school['2015Salary%']));
    $('#custom-benefits').text(toPercent(school['2015Benefit%']));
    $('#custom-third').text(school['LargestSpending']);
    $('#custom-usage').text(label(school['LargestSpending']));
    $('#custom-service-level').text(comparison_word(school['2015Contract%'], school['AvgSpending'][CONTRACT], "the same level of", "better", "worse"));
    //comparison
    $('#custom-service-exp').text(comparison_word(parseFloat(school['2015Contract%']), parseFloat(school['AvgSpending'][CONTRACT]), "similar", "more", "less"));
    $('#custom-service-training').text(comparison_word(parseFloat(school['2015Contract%']), parseFloat(school['AvgSpending'][CONTRACT]), "similar amount of", "better", "worse"));
    $('#custom-logic-1').text(logic_word(parseFloat(school['2015Commodities%']), parseFloat(school['AvgSpending'][COMMODITY]), "fortunately", "unfortunately"));
    $('#custom-commodity-exp', comparison_word(parseFloat(school['2015Commodities%']), parseFloat(school['AvgSpending'][COMMODITY]), "about the same as the", "more", "less"));
    $('#custom-logic-2').text(logic_word(parseFloat(school['2015Equipment%']), parseFloat(school['AvgSpending'][EQUIPMENT]), "on the other hand", "However,"));
    $('#custom-equipment-exp').text(comparison_word(parseFloat(school['2015Euipment%']), parseFloat(school['AvgSpending'][EQUIPMENT]), "similar", "more than", "less than"));
    $('#custom-transporation-exp').text(comparison_word(parseFloat(school['2015Transportation%']), parseFloat(school['AvgSpending'][TRANSPORTATION]), "similar", "more than", "less than"));
    $('#spending-contingency').text(currencyFormat(parseFloat(school['FY2015ApprovedContingency'])));
    $('#pupil-spending-contingency').text(currencyFormat(parseFloat(school['FY2015ApprovedContingency'])/parseFloat(school['FY 15 Enrollment'])));
    //2016
    $('#custom-budget-2016').text(currencyFormat(parseFloat(school['FY 16 Budget    (Core and Supplemental)'])));
    $('#custom-2016-total-percent-change').text(toPercent(school['% Change from FY 15']) + " " + logic_word(school['% Change from FY 15'], 0, "more", "less"));
    $('#custom-2016-pupil').text(currencyFormat(Math.abs(school['Change in Per Pupil Enrollment Funding'])) + " " + logic_word(school['Change in Per Pupil Enrollment Funding'], 0, "more", "less"));
}

function currencyFormat(number)
{
   var decimalplaces = 0;
   var decimalcharacter = "";
   var thousandseparater = ",";
   number = parseFloat(number);
   var sign = number < 0 ? "-" : "";
   var formatted = new String(number.toFixed(decimalplaces));
   if( decimalcharacter.length && decimalcharacter != "." ) { formatted = formatted.replace(/\./,decimalcharacter); }
   var integer = "";
   var fraction = "";
   var strnumber = new String(formatted);
   var dotpos = decimalcharacter.length ? strnumber.indexOf(decimalcharacter) : -1;
   if( dotpos > -1 )
   {
      if( dotpos ) { integer = strnumber.substr(0,dotpos); }
      fraction = strnumber.substr(dotpos+1);
   }
   else { integer = strnumber; }
   if( integer ) { integer = String(Math.abs(integer)); }
   while( fraction.length < decimalplaces ) { fraction += "0"; }
   temparray = new Array();
   while( integer.length > 3 )
   {
      temparray.unshift(integer.substr(-3));
      integer = integer.substr(0,integer.length-3);
   }
   temparray.unshift(integer);
   integer = temparray.join(thousandseparater);
   return "$" + sign + integer + decimalcharacter + fraction;
}
  //helper functions

function decapitalize(s) {
    return s.charAt(0).toLowerCase() + s.slice(1);
}

function toPercent(num){
  return (Math.abs(num)*100).toPrecision(2) + " percent"; 
}

function charter(school){ 
  console.log("Charter called!");
  if (school["Governance"] == 'Charter' || school["Governance"] == "Contract") {
    $('#charter-description').text("However, because " + school["School Name"] + " is a " + decapitalize(String(school['Governance'])) + " school, "
      + "most of the expenditures including salaries, benefits, and commodities are combined into spending on contract. " + 
      "Therefore, we can only try our best to estimate the spendings based on CPS school average.");
  }
}


function charter_pie_explanation(school){ 
  if (school["Governance"] == 'Charter' || school["Governance"] == "Contract") {
    $('#explanation-charter-1').text("Salaries and benefits which are ");
    $('#explanation-charter-2').text("contained in spending on contract ");
    $('#explanation-charter-3').text("this is your school's most current breakdown:")
  }
  else {
    $('#highlight-salary-benefits').text(toPercent(parseFloat(school['2015Benefit%'])+ parseFloat(school["2015Salary%"]))+ " ");
    $('#explanation-district-1').text(" of your school budget was spent on salaries and benefits,");
    $('#explanation-district-2').text(" excluding");
    $('#explanation-district-3').text(" " + "those two types of expenditures this is your school's most current breakdown:");
  }
}

function reverse_text(){
  $('#highlight-salary-benefits').text("");
  $('#charter-description').text("");
  $('#explanation-charter-1').text("");
  $('#explanation-charter-2').text("");
  $('#explanation-district-1').text("");
  $('#explanation-district-2').text("");
  $('#explanation-district-3').text("");
}

// customize texts
function consistency_comparison_result(school){
  if (school['Consistency'] == school['MajorityConsistency']){
    return 'in line with';
  }
  else {
    return 'the oppoosed of';
  }
}

function label(spending){      
  if (spending === 'contingency'){
    return 'emergency expenditures';
  }
  else if (spending === 'contract'){
    return 'the resources to fund seminars and work trips, to spend with printing, delivery services, and phones';
  }
  else if (spending === 'equipment') {
    return 'the money spent to improve school infrastructure including building maintenance and technological resources';
  }
  else if (spending === 'commodity'){
    return 'the purchase of software licenses, instructional material, library books, and pay for electricity and gas';
  }
}
// return self-defined comparison words
function comparison_word(s_service, avg, same, better, worse){
  if (Math.abs(s_service - avg) <= 0.01) {
    return same;
  }
  else if (s_service > avg) {
    return better;
  }
  else {
    return worse;
  }
}

// return self-defined logic words
function logic_word(s_service, avg, better, worse){
  if (s_service > avg) {
    return better;
  }
  else {
    return worse;
  }
}
