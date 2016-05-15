<ul class="unstyled filter-options">
  <li><a ng-click="ctrl.parent.selectFilter(ctrl.parent.openFilterModal, 'all', 'All')">All<span ng-show="'all' === ctrl.parent.filter[ctrl.parent.openFilterModal]" class="icon fa fa-check"></span></a></li>
  <li ng-repeat="filter in ctrl.parent.filterSet"><a ng-click="ctrl.parent.selectFilter(ctrl.parent.openFilterModal, filter.id, filter.name)">{{filter.name}}<span ng-show="filter.id === ctrl.parent.filter[ctrl.parent.openFilterModal]" class="icon fa fa-check"></span></a></li>
</ul>
<md-dialog-actions>
  <md-button ng-click="ctrl.parent.cancelFilters()">Cancel</md-button>
  <md-button ng-click="ctrl.parent.confirmFilters()">Apply</md-button>
</md-dialog-actions>