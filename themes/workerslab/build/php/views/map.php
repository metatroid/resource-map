<map map-ready="mapReady" menu-trigger="#siteNav" id="mapbox"></map>
<div ng-class="{open: filterSelectionsOpen === true}" id="filterBar"><a ng-click="toggleFilterSelections()">Filter by:<span class="icon fa fa-caret-down pull-right"></span></a>
  <ul class="unstyled">
    <li><a ng-click="revealFilterModal('industry')">Industry</a></li>
    <li><a ng-click="revealFilterModal('issue')">Issue</a></li>
    <li><a ng-click="revealFilterModal('year')">Year</a></li>
  </ul>
</div>