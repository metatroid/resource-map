<!DOCTYPE html>
<html ng-app="resourceMap">

  <head>
    <title>The Workers Lab</title>
    <meta charset="UTF-8" />
    <meta name="description" />
    <meta name="viewport" content="initial-scale=1.0, user-scalable=yes" />
    <link rel="stylesheet" href="/assets/css/main.css" />
    <script src="/assets/js/main.js"></script>
  </head>

  <body ng-controller="mainCtrl">
    <div ui-view="main" id="main"></div>
    <script type="text/javascript">
      //<![CDATA[
      waitForEl('#landing a', function()
      {
        var btns = document.querySelectorAll("#landing a, #menu");
        for (var i = 0; i < btns.length; i++)
        {
          btns[i].addEventListener("click", function(e)
          {
            var scope = angular.element(document.getElementById('main')).scope();
            scope.$apply(function()
            {
              scope.hideOverlay();
            });
          }, false);
        }
      });
      //]]>
    </script>
  </body>

</html>