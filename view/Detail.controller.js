jQuery.sap.require("sap.em.somit.ecw.util.Formatter");

sap.ui.controller("sap.em.somit.ecw.view.Detail", {
	
	onInit : function() {
	}, 
	
	onAfterBinding: function() {
		/* Hide empty item list */
	    $(".HorizontalList:not(:has(.DetailItemBox))").hide(); 
	},
});