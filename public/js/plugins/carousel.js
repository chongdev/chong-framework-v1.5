// Utility
if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {};
		F.prototype = obj;
		return new F();
	};
}

(function( $, window, document, undefined ) {

	var Carousel = {
		init: function ( options, elem ) {
			var self = this;

			// set Elem 
			self.$elem = $(elem);
			self.$wrap = self.$elem.parent();
			

			self.$elem.css('position', 'relative').parent().css('overflow', 'hidden');
			

			// set Data
			self.options = $.extend( {}, $.fn.carousel.options, options );
			self.length = self.$elem.children().length;
			self.movex = 0;
			self.working = false;
			self.point = 'next';

			var data = self.$elem.data();
			if( data.delay ) {
				self.options.refresh = data.delay;
			}


			self.resize();
			$(window).resize(function(event) {
				self.resize();
			});

			self.index = self.options.index || 0;
			/*self.$elem.children().first().before( self.$item.last() );
			self.$elem.css('left', self.items.width*-1 );*/

			// self.refresh();

			
			// Event 
			/*self.$elem.mouseenter(function () {
				clearTimeout( self.is_laoding );
				self.is_laoding = false;
			}).mouseleave(function () {
				if( !self.is_laoding ){
					self.refresh();
				}
			});*/

			self.$wrap.find('[data-action=prev], [data-action=next]').click(function(e) {
				e.preventDefault();

				clearTimeout( self.is_laoding );
				self.is_laoding = false;

				self.point = $(this).data('action');

				self.buildFrag();
				self.display();

			});;

			self.$elem.delegate('[data-action=prev], [data-action=next]', 'click', function() {
				clearTimeout( self.is_laoding );
				self.is_laoding = false;

				self.point = $(this).data('action');

				self.buildFrag();
				self.display();
			});

			if( navigator.msMaxTouchPoints ){ }
			else{

				self.$elem.on("touchstart", function(event) {
					if( self.working ) return false;
					$('#touchStart').text('start' + event.originalEvent.touches[0].pageX);
					self.touchStart(event);

			    });

			    self.$elem.on("touchmove", function(event) {
			    	if( self.working ) return false;
			    	$('#touchMove').text('move' + event.originalEvent.touches[0].pageX);
			    	self.touchMove(event);
			    	
			    });

			    self.$elem.on("touchend", function(event) {
			    	
			    	if( self.working ) return false;
			    	$('#touchEnd').text('end:');
			        self.touchEnd(event);

			    });
			}

		},

		resize: function () {
			var self = this;

			self.items = {
				width: self.$elem.children().first().outerWidth()
			}
		},

		refresh: function ( length, point ) {
			var self = this;

			var point = point || 'next';

			self.first_is_clone = false;

			self.is_laoding = setTimeout(function () {

				if( self.working ) return false;
				self.buildFrag( point );
				self.display();

			}, length || self.options.refresh );
		},

		buildFrag: function () {
			var self = this;

			// prev
			if( self.point=='prev' ){

				self.index--;
				if( self.index < 0 ){
					self.index = self.length-1;
				}

				self.$elem.children().first().before( self.$elem.children().last().clone() );
				self.$elem.css('left', self.items.width*-1 );
			}

			// next
			else if( self.point=='next' ){
				self.index++;
				if( self.index >= self.length ){
					self.index = 0;
				}
				self.$elem.children().last().after( self.$elem.children().first().clone() );
				// self.$carousel.css('left', self.width*-1);
			}
		},

		display: function ( settings ) {
			var self = this;

			if( !settings ) settings = {};
			
			self.working = true;
			var panx = self.items.width + self.movex;
			if( self.point=='next' ){
				panx = self.items.width - self.movex;
			}
			
			self.$elem.stop(true, true).animate({ fake: panx }, {
				duration: settings.duration || self.options.duration,
				easing: settings.easing || self.options.easing,
				queue: false,
				step: function(now, fx) {

					var nowPanx = now;

					if( self.point=='next' ){
						nowPanx = now *-1;
					}

					nowPanx -= self.movex;

			      	$(this).css('transform','translateX(' + nowPanx + 'px)'); 
			      	if( now == panx ){ fx.now = 0; }
			    },
			    complete : function() {

		    		self.$elem.css({
		    			left: '',
		    			transform: ''
		    		});

		    		// prev
		    		if( self.point=='prev' ){
		    			self.$elem.children().last().remove();
		    			self.point = 'next';
		    		}

		    		// next
		    		else if( self.point=='next' ){
		    			self.$elem.children().first().remove();
		    		}

		    		self.movex = 0;

		    		setTimeout(function () {
		    			self.working = false;
		    		}, 1);

		    		if( self.options.refresh ){
						self.refresh();
					}

			    }
			} ); 
		},

		touchStart: function (event) {
			var self = this;

			clearTimeout( self.is_laoding );
			self.is_laoding = false;

			// Get the original touch position.
			self.touchstartx = event.originalEvent.touches[0].pageX;

		},
		touchMove: function (event) {
			
			var self = this;

			self.touchmovex =  event.originalEvent.touches[0].pageX;
			self.movex = self.touchstartx - self.touchmovex;

			var maxX = (self.items.width*20)/100;
			var _maxX = maxX*-1;

			if( self.movex > maxX ){
				self.movex = maxX;
			}
			else if( self.movex < _maxX){
				self.movex = _maxX;
			}

			var val = self.movex*-1;
			if( self.movex== 0){
				return false;
			}

			self.$elem.css('transform','translateX(' + val + 'px)'); 
		},
		touchEnd: function (event) {
			
			var self = this; 

			if( self.movex== 0) return false;
			clearTimeout( self.is_laoding );
			self.is_laoding = false;

	    	self.point = self.movex>0 ? 'next': 'prev';
	    	self.buildFrag();
	    	self.display({
	    		easing: 'swing' //'linear'
	    	});

		}
	};

	$.fn.carousel = function( options ) {
		return this.each(function() {
			var $this = Object.create( Carousel );
			$this.init( options, this );
			$.data( this, 'carousel', $this );
		});
	};

	$.fn.carousel.options = {

		effect: 'fade',
		speed: 500,

		duration: 750,
		easing: 'easeInOutQuint', // 'linear',

		auto: true,
		refresh: 5000,
		random: true,

		// max_height: 450,
		min_height: 180,

		// Define these as global variables so we can use them across the entire script.
	    // touchstartx: undefined,
	    // touchmovex: undefined, 
	    // movex: undefined,
	    index: 0,
	    // longTouch: undefined,
	};
	
	
})( jQuery, window, document );