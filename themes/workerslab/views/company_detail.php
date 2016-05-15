<md-bottom-sheet ng-class="{filtered: ctrl.parent.filterType !== null}" class="full-content" id="compDetail">
  <md-content><a ng-click="ctrl.parent.closeSheet()" class="close-btn"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="16" height="16" viewBox="0 0 16 16" 'xml:space'="preserve"><path d="M0 0 L16 16" fill="#fff" stroke="#fff" stroke-width="2px"></path><path d="M0 16 L16 0" fill="#fff" stroke="#fff" stroke-width="2px"></path></svg></a>
    <div
      slideshow="slideshow" class="comp-images">
      <div ng-repeat="image in ctrl.parent.company.acf.slideshow_images" class="img fit-images"><img src="{{image.image}}" /></div>
      </div>
      <div class="comp-info">
        <div class="meta">
          <div class="titles">
            <h2 class="title">{{ctrl.parent.company.title.rendered}}</h2>
            <h3 class="subtitle">{{ctrl.parent.company.company_meta.subtitle}}</h3></div>
          <div class="social">
            <div class="avatar"><img src="{{ctrl.parent.company.company_meta.avatar}}" alt="{{ctrl.parent.company.title.rendered}} logo" /></div>
            <div class="links"><a ng-repeat="site in ctrl.parent.company.acf.social_media" target="_blank" href="{{site.url}}" title="{{site.service}}"><span class="icon fa fa-{{site.service}}"></span></a></div>
          </div>
        </div>
        <div ng-bind-html="ctrl.parent.htmlSafe(ctrl.parent.company.content.rendered)" class="intro"></div>
        <div ng-cloak="ng-cloak" class="tabs">
          <md-content>
            <md-tabs md-dynamic-height="md-dynamic-height" md-border-bottom="md-border-bottom" md-center-tabs="md-center-tabs" md-stretch-tabs="always" md-swipe-content="md-swipe-content">
              <md-tab ng-repeat="tab in ctrl.parent.company.acf.tabbed_content" label="{{tab.content_title}}">
                <md-content ng-bind-html="ctrl.parent.htmlSafe(tab.content)" class="md-padding"></md-content>
              </md-tab>
            </md-tabs>
          </md-content>
        </div>
      </div>
  </md-content>
</md-bottom-sheet>