jQuery.sap.declare("sap.em.somit.ecw.util.Selector");

sap.em.somit.ecw.util.Selector = {
	getSiblingComponentFromSource : function( id, sParentClass, sTargetClass ) {
		return sap.ui.getCore().byId($(id).closest(sParentClass).
				find(sTargetClass).attr('id'));
	}
};