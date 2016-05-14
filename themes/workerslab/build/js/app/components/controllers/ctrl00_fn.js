var formatErr = function(err){
  var errString = JSON.stringify(err),
      errArray = errString.split(','),
      responseString = "";
  for(var i=0;i<errArray.length;i++){
    var clean = errArray[i].replace(/\[|\]|"|{|}/g,''),
        item = clean.match(/.*(?=:)/)[0],
        message = clean.match(/(:)(.*)/)[2];
    responseString += "<li>"+item+": "+message+"</li>";
  }
  return responseString;
};
function waitForEl(selector, fn){
  var el = document.querySelectorAll(selector)[0];
  if(typeof el === 'undefined' || el.length < 1){
    setTimeout(function(){waitForEl(selector, fn);}, 500);
  } else {
    fn();
  }
}
