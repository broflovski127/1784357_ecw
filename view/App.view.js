sap.ui.jsview("sap.em.somit.ecw.view.App", {

	getControllerName: function () {
		return "sap.em.somit.ecw.view.App";
	},
	
	createContent: function (oController) {
		
		//hide scroll bar on Desktop 
		this.setDisplayBlock(true);
		
		this.app = new sap.m.SplitApp("App");
		
		var masterView = sap.ui.xmlview("Master", "sap.em.somit.ecw.view.Master");
		masterView.getController().nav = this.getController();
		this.app.addPage(masterView, true);
		
		var emptyView = sap.ui.xmlview("Empty", "sap.em.somit.ecw.view.Empty");
		this.app.addPage(emptyView, false);

		return this.app;
	}
});