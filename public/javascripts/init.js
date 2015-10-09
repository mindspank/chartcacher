!function(r, document, global) {
	
	r.config({ baseUrl: 'https://charts.qlikcloud.com/resources/0.8'});
	
	r(["assets/object-renderer/object-renderer"], function(renderer) {
		
		function inject() {	
			
			var settings = {
				element: document.getElementById('object-container'),
				layout: global.data,
				localeInfo: {},
				interactive: true
			};
						
			renderer.renderSnapshot(settings).then(null, console.log);
		};
	
		renderer.init({ language: 'en-US' }).then(inject, console.log)
	})
}(require, document, this);