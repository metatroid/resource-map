<div id="mainWrapper">
  <div ui-view="header" autoscroll="true" id="header"></div>
  <div id="views">
    <div ng-repeat="page in pages" id="page_{{page.slug}}" on-finish-render="ngRepeatFinished" class="page">
      <div ui-view="{{page.slug}}" autoscroll="true" ng-bind-html="htmlSafe(page.content.rendered)" class="page-content"></div>
    </div>
  </div>
</div>
<div ng-show="showLandingOverlay === true" class="overlay" id="landing">
  <div class="overlay-content">
    <div ng-bind-html="htmlSafe(settings.landing_content)"></div>
  </div>
</div>
<div ng-show="companyActive === true" class="overlay" id="company">
  <div class="overlay-content">
    <ng-include src="'/wp-content/themes/workerslab/views/company_detail.php'" id="compDetails"></ng-include>
  </div>
</div>