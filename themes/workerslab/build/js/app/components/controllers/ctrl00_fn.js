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