$(document).ready(function(){
  var school_selected = window.location.hash;
  school_selected = school_selected.substring(1);
  school_selected = decodeURI(school_selected);
  if (school_selected == '') {
  	school_selected = 'Julia Ward Howe School'; //default school feel free to change. There's not much logic behind this.
  }
  console.log(school_selected);
  select_school(school_selected);
})