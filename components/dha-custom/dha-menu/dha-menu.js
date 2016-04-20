//***************** [dha-menupoint]
Polymer({is: 'dha-menupoint',
	enableCustomStyleProperties: true,
	properties: {
		content: {
			type: Object,
			notify:true
		}
	},
	attached: function () {
		setTimeout(function () {
			this.classList.add('active');
		}.bind(this), 500);
	},
	_swapContent: function (e) {
		if (this.content.call_type == undefined) {this.content.calltype = "";}
		if (this.content['schema:keywords'] == undefined) {this.content['schema:keywords'] = [""];}
		for (var i = 0; i < this.content['schema:keywords'].length; i++) {
			if(this.content['schema:keywords'][i].match(/_/)) this.content['schema:keywords'].splice(i,1);
		}
		this.content['schema:keywords'] = this.content['schema:keywords'].filter(function (item) { return item != undefined });
		this.fire('swapcontent',{"type": this.content.call_type, "tags":this.content['schema:keywords'], "title":this.content['schema:headline'], "desc":this.content.desc, "icon":this.content.icon});
	}
});