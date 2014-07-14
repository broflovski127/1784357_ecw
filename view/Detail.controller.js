jQuery.sap.require("sap.ui.demo.myFiori.util.Formatter");

sap.ui.controller("sap.ui.demo.myFiori.view.Detail", {
	
	onInit : function() {
		var oModel = this.getView().getModel();  
	},

	handleNavButtonPress : function (evt) {
		this.nav.back("Master");
	}, 
	
	afterBinding: function() {
	    $(".Horizontal:not(:has(.EventItemBox2))").hide(); 
	},
});