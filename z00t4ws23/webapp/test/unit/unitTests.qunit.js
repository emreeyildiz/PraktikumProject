/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"z00t4ws23/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
