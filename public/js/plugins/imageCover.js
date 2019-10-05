// Utility
if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {};
		F.prototype = obj;
		return new F();
	};
}

(function( $, window, document, undefined ) {

	var imageCover = {
		init: function(options, elem) {
			var self = this;
			self.elem = elem;

			self.options = $.extend( {}, $.fn.imageCover.options, options );

			

			self.initElem();
			self.initEvent();
		},
		initElem: function ( ) {
			var self = this;
			self.$elem = $( self.elem );

			self.$input = self.$elem.find('[data-action=file]');
			self.$preview  = self.$elem.find('[role=preview]');

			var width = self.$elem.width();
			var height = ( self.options.scaledY * width ) / self.options.scaledX;
			self.$elem.css({
				width: width,
				height: height
			});

			if( self.options.src ){
				self.$elem.removeClass('has-empty').addClass('has-loading');
				self.loadImage( self.options.src );
			}

			/*if( self.options.url ){
				self.updateImage();
			}*/
		},
		initEvent: function () {
			var self = this;
			self.$input.change(function () {
				self.setImage(this.files[0]);
			});


			self.$elem.delegate('[data-action=remove]', 'click', function(event) {
				
				if( self.options.del_url && self.options.data ){

					Dialog.load( self.options.del_url, self.options.data, {
						onClose: function () { },
						onSubmit: function ($d) {

							var $form = $d.$pop.find('form');
							Event.inlineSubmit( $form ).done(function( result ) {

								if( result.message ){
									Event.showMsg({text: result.message, load: 1, auto: 1});
								}

								if( result.error ){
									return false;
								}

								Dialog.close();
								self.options.data = null;

								self.clear();
							});

						}
					});
				}
				else{
					self.clear();
				}
			}); 
		},

		setImage: function (file) {
			var self = this;

			self.$elem.addClass('has-loading');
			var $progress = self.$elem.find('.progress-bar');
			var $remove = $('<a/>', {class:"preview-remove"}).html( $('<i/>', {class:'icon-remove'}) );

			$remove.click(function (e) {
				e.preventDefault();
				self.clear();
			});

			var $img = $('<div/>',{ class:'image-crop'});
			self.$elem.find('.preview').append( $remove, $img );

			var width = self.$elem.width();

			var reader = new FileReader();
			reader.onload = function (e) {
				var image = new Image();
				image.src = e.target.result;
				$image = $(image).addClass('img img-crop');

				image.onload = function() {
					
					var scaledW = this.width;
					var scaledH = this.height;
					var height = ( scaledH * width ) / scaledW;
					$image.width( width );
					$image.height( height );

					var scaledW = self.options.scaledX;
					var scaledH = self.options.scaledY;
					var height = ( scaledH * width ) / scaledW;
					
					$img.css({ width: width, height: height });
					
					self.$elem.removeClass('has-loading').addClass('has-file');
					$img.html( $image );

					self.cropperImage( self.$elem.find('.preview') );
				}
			}

			reader.onprogress = function(data) {
				if (data.lengthComputable) {                                            
	                var progress = parseInt( ((data.loaded / data.total) * 100), 10 );
	                $progress.find('.bar').width( progress+"%" );
	            }
        	}

			reader.readAsDataURL( file );
		},
		clear:function () {
			var self = this;

			self.$input.val('');
			self.$preview.empty();
			self.$elem.removeClass('has-file');
		},

		cropperImage: function ( $el ) {
			var self = this;

			var $x = $('<input/>', {type: 'hidden', name:'cropimage[x]', value: 0});
			var $y = $('<input/>', {type: 'hidden', name:'cropimage[y]', value: 0});
			var $width = $('<input/>', {type: 'hidden', name:'cropimage[width]', value: 0 });
			var $height = $('<input/>', {type: 'hidden', name:'cropimage[height]', value: 0 });
			var $rotate = $('<input/>', {type: 'hidden', name:'cropimage[rotate]', value: 0 });
			var $scaleX = $('<input/>', {type: 'hidden', name:'cropimage[scaleX]', value: 0 });
			var $scaleY = $('<input/>', {type: 'hidden', name:'cropimage[scaleY]', value: 0 });
			
			$el.find('.image-crop').append($x, $y,$width, $height, $rotate, $scaleX, $scaleY);

			Event.setPlugin( $el.find('img.img-crop'), 'cropper', {
				aspectRatio: self.options.scaledX / self.options.scaledY,
				autoCropArea: .95,
				strict: true,
				guides: true,
				highlight: false,
				dragCrop: false,
				cropBoxMovable: true,
				cropBoxResizable: false,
				crop: function(e) {

					if( $el.find('.image-wrap').length ){

					 	$el.find('.image-wrap').addClass('hidden_elem');
					}

					if( $el.find('.image-crop').hasClass('hidden_elem') ){
					 	$el.find('.image-crop').removeClass('hidden_elem');
					}

				    // Output the result data for cropping image.
				    $x.val(e.x);
				    $y.val(e.y);
				    $width.val(e.width);
				    $height.val(e.height);
				    $rotate.val(e.rotate);
				    $scaleX.val(e.scaleX);
				    $scaleY.val(e.scaleY);

				}
			} );
		},

		updateImage: function() {
			
			var self = this;
			var $remove = $('<a/>', {class:"preview-remove"}).html( $('<i/>', {class:'icon-remove'}) );
			var $img = $('<div/>', { class:'image-crop hidden_elem'});
			var $wrap = $('<div/>',{ class:'image-wrap'});
			var $edit = $('<div/>',{ class:'image-cover-edit', text: 'ปรับตำแหน่ง'});
			self.$elem.addClass('has-file').find('.preview').append( $remove, $edit, $img, $wrap );

			$edit.click(function (e) {

				if( self.$elem.hasClass('has-cropimage') ){
					$edit.text('ปรับตำแหน่ง');
					self.$elem.removeClass('has-cropimage');
					$wrap.removeClass('hidden_elem');
					$img.addClass('hidden_elem').empty();
				}
				else{
					$edit.text('ยกเลิก');
					self.$elem.addClass('has-cropimage');
					setcrop();
					self.cropperImage( self.$elem.find('.preview') );
				}	
			});

			$remove.click(function (e) {
				e.preventDefault();

				Dialog.load( self.options.action_url, {}, {

					onSubmit: function ( data ) {
						$form = data.$pop.find('form.model-content');
						Event.inlineSubmit( $form ).done(function( result ) {
							Event.processForm($form, result);

							if( result.status==1 ){
								self.clear();
							}
						});
					},
					onClose: function () {}
				});
			});

			var scaledW = self.options.scaledX;
			var scaledH = self.options.scaledY;

			var width = self.$elem.width();
			var height = ( scaledH * width ) / scaledW;

			function setcrop() {
				$img.css({
					width: width,
					height: height
				}).append( 
					$('<img>', {class: 'img img-crop',src: self.options.original_url })
				);
			}

			$wrap.css({
				width: width,
				height: height
			}).html( $('<img>', {class: 'img', src: self.options.url }) );
		},


		loadImage: function ( url ) {
			var self = this;

			var image = new Image();
				image.src = url;

			var $image = $(image).addClass('img');

			image.onload = function() {
					
				var scaledW = this.width;
				var scaledH = this.height;

				self.$elem.removeClass('has-loading').addClass('has-file');
				self.$preview.empty().append( $image, '<a data-action="remove" class="preview-remove"><i class="icon-remove"></i></a>' );
			}
		}

	};

	$.fn.imageCover = function( options ) {
		return this.each(function() {
			var $this = Object.create( imageCover );
			$this.init( options, this );
			$.data( this, 'imageCover', $this );
		});
	};
	$.fn.imageCover.options = {
		scaledX: 640,
		scaledY: 360
	};
	
})( jQuery, window, document );