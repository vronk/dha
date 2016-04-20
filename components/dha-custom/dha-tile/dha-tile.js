//***************** [dha-tile] ************************
Polymer({is: 'dha-tile',
	enableCustomStyleProperties: true,
	properties: {
		name: {
			type: String,
			notify: true
		},
		content: {
			type: Object,
			notify: true
		}
	},
	observers: ['_openDetail(e)'],
	
	//styling functions///////////////////////////
	attached: function () {
		setTimeout(function () {
		this.classList.add('active');
		}.bind(this), 500);
	},
	_openDetail: function (e) {
		History.pushState(null , "title", "?node="+this.content["schema:name"]);
		this.fire('updateCard',this.content["schema:name"]);
	},
	//////////////////////////////////////////////

	//mapping functions //////////////////////////
	_mapContent: function (content,field) {
		if(layoutMaps['tile'][content["schema:additionalType"]]){
			if(layoutMaps['tile'][content["schema:additionalType"]][field] === "schema:startDate") {
				return this._parseDate(content[layoutMaps['tile'][content["schema:additionalType"]][field]]);
			}
			else if((field == 'cover' || field == 'icon') &&  content[layoutMaps['tile'][content["schema:additionalType"]][field]] != undefined) {
				return content[layoutMaps['tile'][content["schema:additionalType"]][field]]['src'];
			}
			else {return content[layoutMaps['tile'][content["schema:additionalType"]][field]];}
		}
		else {return ""};
	},
	_parseDate: function(date) {
		if(date){
			var ndate = new Date(date*1000);
			return ndate.getDate()+"-"+(ndate.getMonth()+1)+"-"+ndate.getFullYear();
		}
	}
	//////////////////////////////////////////////
});