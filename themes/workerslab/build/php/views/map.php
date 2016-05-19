<header id="pageHeader">
  <div class="header"><button class="toggle-btn menu-btn"><span class="screen-reader">Toggle Menu</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>
    <div id="filterBar">
      <form ng-submit="searchFor(search)">
        <div class="input input-select">
          <md-select ng-model="filter.industry" ng-change="filterBy(filter)" aria-label="Industry">
            <md-option value="" disabled>Industry</md-option>
            <md-option value="all">All</md-option>
            <md-option ng-repeat="industry in industries" ng-value="{{industry.id}}">{{industry.name}}</md-option>
          </md-select>
        </div>
        <div class="input input-select">
          <md-select ng-model="filter.issue" ng-change="filterBy(filter)" aria-label="Issue">
            <md-option value="" disabled>Issue</md-option>
            <md-option value="all">All</md-option>
            <md-option ng-repeat="issue in issues" ng-value="{{issue.id}}">{{issue.name}}</md-option>
          </md-select>
        </div>
        <div class="input input-select">
          <md-select ng-model="filter.state" ng-change="filterBy(filter)" aria-label="State">
            <md-option value="" disabled>State</md-option>
            <md-option value="all">All</md-option>
            <md-option ng-repeat="state in states" ng-value="{{state.id}}">{{state.name}}</md-option>
          </md-select>
        </div>
        <div class="input input-text input-search"><span class="icon fa fa-search"></span><input type="text" ng-model="search" placeholder="enter a location" locator="locator" />
          <ul id="autocomplete"></ul>
        </div>
      </form>
    </div>
    <a ui-sref="main" title="Home" class="branding"><img alt="The Workers Lab" src="/assets/img/logo.png" /></a>
  </div>
</header><map map-ready="mapReady" menu-trigger="#siteNav" id="mapbox"></map>
<div ng-show="filterType !== null &amp;&amp; $state.current.name !== 'main'" id="filterMsg">
  <div class="filter-msg-desktop"><span ng-if="filterChoices.length &gt; 0 &amp;&amp; filterType === 'filter'">Filtered by "{{filterChoices}}." Select a <img alt="map marker" src="/assets/img/marker_icon_clicked.svg"> pin to see why they stand out.</span><span ng-if="filterLocation1.length &gt; 0 &amp;&amp; filterType === 'location'">Showing results in the {{filterLocation1}} area. Select a <img alt="map marker" src="/assets/img/marker_icon_clicked.svg"> pin to see why they stand out.</span></div>
  <div
    class="filter-msg-mobile"><span ng-if="filterChoices.length &gt; 0 &amp;&amp; filterType === 'filter'">Showing "{{filterChoices}}" results in the area.</span><span ng-if="filterLocation1.length &gt; 0 &amp;&amp; filterType === 'location'">Showing results in the area {{filterLocation1}}</span></div>
</div>
<div ng-class="{open: filterSelectionsOpen === true}" id="filterBarDisplay"><a ng-click="toggleFilterSelections()"><span ng-hide="filterType === 'location'">Filter by:</span><span ng-if="filterType === 'filter'" class="filter-choice">{{filterChoice}}</span><span ng-if="filterType === 'location'" class="filter-choice location-choice"><strong>{{filterLocation1}}</strong>{{filterLocation2}}</span><span class="icon fa fa-caret-down pull-right"></span></a>
  <ul
    class="unstyled">
    <li><a ng-click="revealFilterModal('industry')">Industry</a></li>
    <li><a ng-click="revealFilterModal('issue')">Issue</a></li>
    <li><a ng-click="revealFilterModal('year')">Year</a></li>
    </ul>
</div>