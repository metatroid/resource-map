<!DOCTYPE html>
<html ng-app="resourceMap">

  <head>
    <title>The Workers Lab</title>
    <meta charset="UTF-8" />
    <meta name="description" />
    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
    <link rel="stylesheet" href="/assets/css/main.css" />
    <script src="/assets/js/main.js"></script>
  </head>

  <body ng-controller="mainCtrl">
    <div ui-view="header" autoscroll="true" id="header"></div>
    <div ui-view="main" id="main"></div>
    <div ui-view="landing"></div>
    <footer ui-view="footer" id="pageFooter"></footer>
  </body>

</html>