<button class="toggle-btn menu-btn" id="menu-btn"><span class="screen-reader">Toggle Menu</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>
<nav id="siteNav">
  <div ng-bind-html="htmlSafe(settings.about_text)" class="nav-intro"></div>
  <div class="nav-item nav-item-social"><a ng-repeat="profile in settings.social_media_links" href="{{profile.url}}" title="{{profile.service}}" target="_blank" class="link link-social"><span class="icon fa fa-{{profile.service}}"></span></a></div>
</nav>