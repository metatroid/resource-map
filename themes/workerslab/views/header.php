<header id="pageHeader"><div class="header"><button menu-trigger="#siteNav" class="toggle-btn"><span class="screen-reader"></span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><div id="filterBar"><form ng-submit="filterMarkers(industry, issue, year)"><div class="input input-select"><md-select ng-model="filter.industry" ng-change="filterBy(filter)"><md-option value="" disabled>Industry</md-option><md-option ng-repeat="industry in industries" ng-value="{{industry.id}}">{{industry.name}}</md-option></md-select></div><div class="input input-select"><md-select ng-model="filter.issue" ng-change="filterBy(filter)"><md-option value="" disabled>Issue</md-option><md-option ng-repeat="issue in issues" ng-value="{{issue.id}}">{{issue.name}}</md-option></md-select></div><div class="input input-select"><md-select ng-model="filter.year" ng-change="filterBy(filter)"><md-option value="" disabled>Year</md-option><md-option ng-repeat="year in years" ng-value="{{year}}">{{year}}</md-option></md-select></div><div class="input input-text input-search"><span class="icon fa fa-search"></span><input type="text" ng-model="search" placeholder="enter a zip code" /></div></form></div><a href="/" title="Home" class="branding"><img rel="The Workers Lab" src="/assets/img/logo.png" /></a></div></header><nav id="siteNav"><div class="nav-item"><a href="#pageMap" class="link link-page">Map</a></div><div class="nav-item"><a href="#pageOther" class="link link-page">Other Page</a></div><div class="nav-item"><a href="#pagePage" class="link link-page">Page</a></div><div class="nav-item nav-item-social"><a href="https://twitter.com/theworkerslab" title="Twitter" target="_blank" class="link link-social"><span class="icon fa fa-twitter"></span></a><a href="https://www.facebook.com/theworkerslab" title="Facebook" target="_blank" class="link link-social"><span class="icon fa fa-facebook"></span></a><a href="http://www.instagram.com/theworkerslab" title="instagram" target="_blank" class="link link-social"><span class="icon fa fa-instagram"></span></a></div></nav>