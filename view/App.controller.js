sap.ui.controller("sap.em.somit.ecw.view.App", {
	 
	to : function (pageId, context) {
		
		var app = this.getView().app;
		
		// load page 
		var bMaster = ("Master" === pageId);
		if (app.getPage(pageId, bMaster) === null) {
			var page = sap.ui.view({
				id : pageId,
				viewName : "sap.em.somit.ecw.view." + pageId,
				type : "XML"
			});
			page.getController().nav = this;
			app.addPage(page, bMaster);
		}
		
		// show the page
		app.to(pageId);
		
		if (context) {
			var page = app.getPage(pageId);
			page.setModel( context ); 
		}
	},
	
});