<header id="pageHeader">
  <div class="header"><button menu-trigger="#siteNav" class="toggle-btn" id="menu"><span class="screen-reader">Toggle Menu</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>
    <div id="filterBar">
      <form ng-submit="searchLocation(search)">
        <div class="input input-select">
          <md-select ng-model="filter.industry" ng-change="filterBy(filter)">
            <md-option value="" disabled>Industry</md-option>
            <md-option value="all">All</md-option>
            <md-option ng-repeat="industry in industries" ng-value="{{industry.id}}">{{industry.name}}</md-option>
          </md-select>
        </div>
        <div class="input input-select">
          <md-select ng-model="filter.issue" ng-change="filterBy(filter)">
            <md-option value="" disabled>Issue</md-option>
            <md-option value="all">All</md-option>
            <md-option ng-repeat="issue in issues" ng-value="{{issue.id}}">{{issue.name}}</md-option>
          </md-select>
        </div>
        <div class="input input-select">
          <md-select ng-model="filter.year" ng-change="filterBy(filter)">
            <md-option value="" disabled>Year</md-option>
            <md-option value="all">All</md-option>
            <md-option ng-repeat="year in years" ng-value="{{year.id}}">{{year.name}}</md-option>
          </md-select>
        </div>
        <div class="input input-text input-search"><span class="icon fa fa-search"></span><input type="text" ng-model="search" placeholder="enter a zip code" locator="locator" />
          <ul id="autocomplete"></ul>
        </div>
      </form>
    </div>
    <a ui-sref="main" title="Home" class="branding"><img rel="The Workers Lab" src="/assets/img/logo.png" /></a>
  </div>
</header>
<nav id="siteNav">
  <div ng-bind-html="htmlSafe(settings.about_text)" class="nav-intro"></div>
  <div class="nav-item nav-item-social"><a ng-repeat="profile in settings.social_media_links" href="{{profile.url}}" title="{{profile.service}}" target="_blank" class="link link-social"><span class="icon fa fa-{{profile.service}}"></span></a></div>
</nav>