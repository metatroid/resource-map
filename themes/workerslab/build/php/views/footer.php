<div class="footer">
  <div class="copy">Copyright The Workers Lab {{currentYear}}</div>
  <div class="cta"><a href="#">Call to action.</a></div>
  <div class="social-media"><a ng-repeat="profile in settings.social_media_links" href="{{profile.url}}" title="{{profile.service}}" target="_blank" class="link link-social"><span class="icon fa fa-{{profile.service}}"></span></a></div>
</div>