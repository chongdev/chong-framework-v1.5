// Utility
if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {};
		F.prototype = obj;
		return new F();
	};
}

(function( $, window, document, undefined ) {

	var Crop = {
		init: function( options, elem ){
			var self = this;

			self.elem = elem
			self.$elem = $(elem);
			self.options = $.extend( {}, $.fn.cropimage.options, options );

			self.initElem();
			if( self.options.file ){

				self.setImage( self.options.file );
			}
			else{
				// config
				self.$input = self.$elem.find('input[type=file]');

				// Event 
				self.$input.change(function (e) {
					// self.file = ;
					self.setImage( this.files[0] );
				});

				if( self.options.url ){

					self.$image.attr('src', self.options.url);
					self.preveiw();

					self.options.url = null;
				}
			}
		},

		initElem: function () {
			var self = this;

			self.$preveiw = self.$elem.find('.image-preveiw');

			self.$elem.css('width', self.$elem.width() );

			self.setElemCrop();

			self.$form = self.$elem.parents('form');
			self.$btnSubmit = self.$form.find('.btn-submit');
		},

		setElemCrop: function () {
			var self = this;

			var $dataX = $('<input/>', {type:"hidden",autocomplete:"off",name:"cropimage[X]"});
		    var $dataY = $('<input/>',{type:"hidden",autocomplete:"off",name:"cropimage[Y]"});
		    var $dataHeight = $('<input/>',{type:"hidden",autocomplete:"off",name:"cropimage[height]"});
		    var $dataWidth = $('<input/>',{type:"hidden",autocomplete:"off",name:"cropimage[width]"});$('#dataWidth');
		    var $dataRotate = $('<input/>',{type:"hidden",autocomplete:"off",name:"cropimage[rotate]"});
		    var $dataScaleX = $('<input/>',{type:"hidden",autocomplete:"off",name:"cropimage[scaleX]"});
		    var $dataScaleY = $('<input/>',{type:"hidden",autocomplete:"off",name:"cropimage[scaleY]"});

		    self.$image = $('<img/>', {class: 'img',alt: ''});
		    self.$close = $('<a/>', {class: 'preview-dismiss'}).html( $('<i/>', {class: 'icon-remove'}) );

			self.$preveiw.append(
				$dataX,
				$dataY,
				$dataWidth,
				$dataHeight,
				$dataRotate,
				$dataScaleX,
				$dataScaleY,
				self.$image,
				self.$close
			);

			if( self.options.url ){
				self.$preveiw.append( $('<input/>',{type:"hidden",autocomplete:"off",name:"cropimage[url]", 'value': self.options.url}) );
			}
			if( self.options.photo_id ){
				self.$preveiw.append( $('<input/>',{type:"hidden",autocomplete:"off",name:"cropimage[photo_id]", 'value': self.options.photo_id}) );
			}

		    self.options.crop = function (e) {
	            $dataX.val(Math.round(e.x));
	            $dataY.val(Math.round(e.y));
	            $dataHeight.val(Math.round(e.height));
	            $dataWidth.val(Math.round(e.width));
	            $dataRotate.val(e.rotate);
	            $dataScaleX.val(e.scaleX);
	            $dataScaleY.val(e.scaleY);
	        }

	        self.$close.click(function (e) {
	        	e.preventDefault();
	        	self.cancel();
	        })
		},

		cancel: function () {
			var self = this;

			self.$elem.removeClass('preveiw');
			self.$preveiw.html('');
			self.$input.val('');
			self.setElemCrop();

			if( self.$btnSubmit.length==1 ){
				self.$btnSubmit.addClass('disabled');
			}
		},

		setImage: function( file ){
			var self = this;

			var reader = new FileReader();
			reader.onload = function(e){

     			var image = new Image();
	            image.src = e.target.result;
	            image.onload = function() {

	            	self.$image.attr('src', e.target.result);
	            	self.preveiw();
	            }
			}
			reader.readAsDataURL( file );
		},

		preveiw: function () {

			var self = this;

			self.$elem.addClass('preveiw');
        	if (typeof $.fn['cropper'] !== 'undefined') {
				self.$image.cropper( self.options );
			}
			else{
				Event.getPlugin( 'cropper' ).done(function () {
					self.$image.cropper( self.options );
				}).fail(function () {
					console.log( 'Is not connect plugin:' );
				});
			}

			if( self.$btnSubmit.length==1 ){
				self.$btnSubmit.removeClass('disabled');
			}
		}

	};

	$.fn.cropimage = function( options ) {
		return this.each(function() {
			var crop = Object.create( Crop );
			crop.init( options, this );
			$.data( this, 'cropimage', crop );
		});
	};

	$.fn.cropimage.options = {
		aspectRatio: 1,
		autoCropArea: 0.65,
		preview: '.img-preview',
		strict: true,
		guides: true,
		highlight: false,
		dragCrop: false,
		cropBoxMovable: true,
		cropBoxResizable: false,
		/*width: 1,
		height: 1,*/
		// onCallback: function () {},
	};

})( jQuery, window, document );