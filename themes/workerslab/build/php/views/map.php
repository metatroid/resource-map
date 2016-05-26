<header id="pageHeader">
  <div class="header"><button class="toggle-btn menu-btn"><span class="screen-reader">Toggle Menu</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>
    <div id="filterBar">
      <form ng-submit="searchFor(search)">
        <div class="input input-select">
          <md-select ng-model="filter.industry" aria-label="Industry">
            <md-option value="" disabled>Industry</md-option>
            <md-option value="all" ng-click="filterBy(filter)">All</md-option>
            <md-option ng-repeat="industry in industries" ng-value="{{industry.id}}" ng-click="filterBy(filter)">{{industry.name}}</md-option>
          </md-select>
        </div>
        <div class="input input-select">
          <md-select ng-model="filter.campaign" aria-label="Campaign">
            <md-option value="" disabled>Campaign</md-option>
            <md-option value="all" ng-click="filterBy(filter)">All</md-option>
            <md-option ng-repeat="campaign in campaigns" ng-value="{{campaign.id}}" ng-click="filterBy(filter)">{{campaign.name}}</md-option>
          </md-select>
        </div>
        <div class="input input-select">
          <md-select ng-model="filter.state" aria-label="State">
            <md-option value="" disabled>State</md-option>
            <md-option value="all" ng-click="filterBy(filter)">All</md-option>
            <md-option ng-repeat="state in states" ng-value="{{state.id}}" ng-click="filterBy(filter)">{{state.name}}</md-option>
          </md-select>
        </div>
        <div class="input input-text input-search"><span class="icon fa fa-search"></span><input type="text" ng-model="search" placeholder="enter a location" />
          <ul id="autocomplete"></ul>
        </div>
      </form>
    </div>
    <a ui-sref="main" title="Home" class="branding"><img alt="The Workers Lab" src="/assets/img/logo.png" /></a>
  </div>
</header><map map-ready="mapReady" menu-trigger="#siteNav" id="mapbox"></map>
<div ng-show="filterType !== null &amp;&amp; $state.current.name !== 'main'" id="filterMsg">
  <div class="filter-msg-desktop"><span ng-if="filterText.length &gt; 0 &amp;&amp; filterType === 'filter'" ng-bind-html="htmlSafe(filterText)"></span><span ng-if="filterLocation1.length &gt; 0 &amp;&amp; filterType === 'location'">Showing results in the <strong>{{filterLocation1}}</strong> area. Click on a <img alt="map marker" src="/assets/img/marker_icon_subnav_blue.svg"> pin for info.</span></div>
  <div
    class="filter-msg-mobile"><span ng-if="filterText.length &gt; 0 &amp;&amp; filterType === 'filter'" ng-bind-html="htmlSafe(filterText)"></span><span ng-if="filterLocation1.length &gt; 0 &amp;&amp; filterType === 'location'">Showing results in the area {{filterLocation1}}</span></div>
</div>
<div ng-class="{open: filterSelectionsOpen === true}" id="filterBarDisplay"><a ng-click="toggleFilterSelections()"><span ng-hide="filterType === 'location'">Filter by:</span><span ng-if="filterType === 'filter'" class="filter-choice">{{filterChoice}}</span><span ng-if="filterType === 'location'" class="filter-choice location-choice"><strong>{{filterLocation1}}</strong>{{filterLocation2}}</span><span class="icon fa fa-caret-down pull-right"></span></a>
  <ul
    class="unstyled">
    <li><a ng-click="revealFilterModal('industry')">Industry</a></li>
    <li><a ng-click="revealFilterModal('campaign')">Campaign</a></li>
    <li><a ng-click="revealFilterModal('state')">State</a></li>
    </ul>
</div>
<md-sidenav ng-class="{filtered: filterType !== null}" md-component-id="left" class="full-content md-sidenav-left" id="compDetail">
  <ng-include src="'/wp-content/themes/workerslab/views/company_detail.php'"></ng-include>
</md-sidenav>