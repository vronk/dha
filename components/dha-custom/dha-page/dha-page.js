//*****************************************************
//***************** [dha-page] ************************
//receives filtered content from menu options
//constructs view options and views
Polymer({is: 'dha-page',
  enableCustomStyleProperties: true,
  properties: {
    q: {
      type: String,
      notify: true
    },
    viewIcon: {
      type: String,
      computed: 'computeViewIcon(view)',
      value: 'apps'
    },
    view: {
      type: String,
      notify: true,
      value: 'start'
    },
    lastview: {
      type: String
    },
    dnode: {
      type: String,
      notify:true,
      observer: '_updateCard'
    },
    content: {
      type: Array,
      notify: true,
      observer: '_updateView'
    },
    mhead: {
      type: Object,
      notify: true,
      observer: '_updateHead'
    },
    mtags: {
      type: Array,
      notify: true,
      observer:"_updateView"
    } 
  },
  
  ready: function () {
    //console.log(this.content);
  },
  attached: function () {
    this.fire('page-meta', { title: null });
  },
  listeners: {
    'updateCard' : '_updateCard'
  },
  toggleView: function (e) {
    this.view = e.detail.sourceEvent.target._iconName;
  },
  _visibleView: function (v, vv) {
    if (this.view === v) {
      return true;
    } else {
      return false;
    }
  },
  _updateCard: function (e) {
    console.log(e);
    this.lastview = this.view;
    if(e && e != "") {
      if(e.detail) this.dnode = e.detail;
      else this.dnode = e;
      setTimeout(function () {
        this.view = "detail";
      }.bind(this), 50);
    }
  },
  _updateView: function(e) {
    if((this.dnode == "" || this.dnode == undefined) && e ) {
      var types = [];
      this.content.forEach(function(a){
        if (types.indexOf(a['schema:additionalType']) == -1) types.push(a['schema:additionalType']);
      });
      if(types.indexOf('schema:project')!= -1 && types.length == 1) this.view = 'view-list';
      else if(types.indexOf('schema:biblio')!= -1 && types.length == 1) this.view = 'view-list';
      else if(types.indexOf('schema:event')!= -1 && types.length == 1) this.view = 'apps';
      else if(types.indexOf('schema:menu_entry')!= -1 && types.length == 1) this.view = 'start';
      else if(types.indexOf('schema:institution')!= -1) this.view = 'view-list';
      //else this.view = 'view-list';
    }
  },
  _updateHead: function(e) {
    if($('#pagedesc')[0]) {
      $('#pagedesc')[0].innerHTML = "";
      $('#pagedesc')[0].insertAdjacentHTML('afterbegin',this.mhead.desc);
    }
  },
  _addTag: function(e) {
    this.fire('swapcontent',{"type": "TopicsView", "tags":[e.target.lastChild.textContent],"action":"addTag","title":"Tag Selection: (click to remove)"});
  },
  _displayTag: function(tag) {
    if(tag.match(/_/)) return false;
    return true;
  },
  _checkTags: function(e){
    console.log(e);
  },
  _removeTag: function(e) {
    console.log(e.target.lastChild.textContent);
    this.fire('swapcontent',{"type": "TopicsView", "tags":[e.target.lastChild.textContent],"action":"removeTag","title":"Tag Selection: (click to remove)"});
  },
  _visibleViewMenu: function(e) {
    if(e == "detail" || e == 'start') return false;
    return true;
  }
});