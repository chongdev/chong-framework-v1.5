// Utility
if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {};
		F.prototype = obj;
		return new F();
	};
}

function initMap() {

	var el = document.getElementById('map');
	console.log( el );
	var uluru = {lat: 13.761583069404265, lng: 100.50811657094732};
	var map = new google.maps.Map(el, {
	  zoom: 4,
	  center: uluru
	});
	var marker = new google.maps.Marker({
	  position: uluru,
	  map: map
	});
}

(function( $, window, document, undefined ) {
	
	var MapMarker = {
		init: function (options, elem) {
			var self = this;

			self.elem = elem;
			self.$elem = $(elem);
			// self.$elem.attr('id', 'mapMarker');
			self.options = $.extend( {}, $.fn.mapmarker.options, options );
			self.$listbox = self.$elem.find('[ref=listbox]');

			self.uluru = self.options.center;

			if (typeof google === 'undefined'){
				$.getScript( 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDt1-iJi7cO8S6S7Qtolxm9JnSi39sbnnc&initMap' ).done(function (res) {
					
					console.log( 'done', res );
					// self.loadMap();
				}).fail(function () {
					console.log( 'fail:' );
				});;
			}
			else{
				self.loadMap();
			}
			// return 
			

			// self.map = new google.maps.Map(self.elem, mapOptions);

		},

		loadMap: function () {
			var self = this;

			console.log( '__' );
			/*
			self.map = new google.maps.Map( document.getElementById('map'), self.options);

			self.marker = new google.maps.Marker({
	          	position: self.uluru,
	          	map: self.map,

	          	draggable: true,
	          // animation: google.maps.Animation.DROP,
	        });
			console.log( google );*/
		}
	}
	$.fn.mapmarker = function( options ) {
		return this.each(function() {
			var $this = Object.create( MapMarker );
			$this.init( options, this );
			$.data( this, 'mapmarker', $this );
		});
	};
	$.fn.mapmarker.options = {
		zoom: 14,
      	center: {lat: '13.761583069404265', lng: '100.50811657094732'},

      	navigationControl: false,
		mapTypeControl: false,
		scaleControl: false,

		// draggable: false,

		scrollwheel: false,
		disableDoubleClickZoom: true,

	}

})( jQuery, window, document );