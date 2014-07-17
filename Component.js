jQuery.sap.declare("sap.em.somit.ecw.Component");

sap.ui.core.UIComponent.extend("sap.em.somit.ecw.Component", {

	createContent : function() {

		var mainView = sap.ui.view({
			id : "app",
			viewName : "sap.em.somit.ecw.view.App",
			type : "JS",
			viewData : { component : this }
		});


		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "i18n/messageBundle.properties"
		});
		mainView.setModel(i18nModel, "i18n");

		//Using OData model to connect against a real service
		/*
 		var url = "/proxy/http/<server>:<port>/sap/opu/odata/sap/ZGWSAMPLE_SRV/";
 		var oModel = new sap.ui.model.odata.ODataModel(url, true, "<user>", "<password>");
 		oView.setModel(oModel);
 		*/

		// Using a local model for offline development
		var nominationModel = new sap.ui.model.json.JSONModel("model/Nom.json");
		/*nominationModel.attachRequestCompleted(function(data,textStatus,jqXHR){

		});*/
		mainView.setModel(nominationModel);
		sap.ui.getCore().setModel(nominationModel);

		return mainView;
	}
});