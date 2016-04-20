//***************** [dha-splashtile] ************************
Polymer({is: 'dha-splashtile',
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
	_swapContent: function (e) {
		if (this.content.call_type == undefined) {this.content.calltype == "";}
		if (this.content['schema:keywords'] == undefined) {this.content['schema:keywords'] == [""];}
		var keywords = [];
		var that = this;
		for (var i = 0; i < this.content['schema:keywords'].length; i++) {
 			 (function (i) {
				if(!that.content['schema:keywords'][i].match(/_/)) keywords.push(that.content['schema:keywords'][i]);
			})(i);
		}
		console.log(that.content['schema:keywords']);
		$('#headbar').show();
		this.fire('swapcontent',{"type": this.content.call_type, "tags":keywords, "title":this.content['schema:headline'], "desc":this.content.desc, "icon":this.content.icon});
	},
	//////////////////////////////////////////////

	//mapping functions //////////////////////////
	_mapContent: function (content,field) {
		that = this;
		if(layoutMaps['tile'][content["schema:additionalType"]]){
			if(layoutMaps['tile'][content["schema:additionalType"]][field] === "schema:startDate") {
				return this._parseDate(content[layoutMaps['tile'][content["schema:additionalType"]][field]]);
			}
			else if(field == 'tagline' && content[layoutMaps['tile'][content["schema:additionalType"]][field]] != undefined) {
				return this._strip(content[layoutMaps['tile'][content["schema:additionalType"]][field]]);
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
	},
	_strip: function (html)
	{
   		var tmp = document.createElement("DIV");
   		tmp.innerHTML = html;
   		return tmp.firstChild.textContent || tmp.firstChild.innerText || "";
	}
	//////////////////////////////////////////////
});