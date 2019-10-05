// Utility
if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {};
		F.prototype = obj;
		return new F();
	};
}

(function( $, window, document, undefined ) {
	
	var Banner = {
		init: function (options, elem) {
			var self = this;

			self.$elem = $(elem);
			self.$listbox = self.$elem.find('[ref=listbox]');

			self.options = options;
			self.size = {
				width: parseInt( options.width),
				height: parseInt(options.height),
			}

			// console.log( options.data );

			var full_width = self.$elem.outerWidth();
			if(  self.size.width > full_width ){

				self.size.width = full_width;
				self.size.height = (full_width*options.height) / options.width;
			}

			// self.size = options.width || self.$elem.outerWidth();
			// self.width 
			if( options.data.media.length>0 ){
				$.each( options.data.media, function(i, obj) {
					self.add( obj );
				});
			}
			else{
				self.add();
			}

			
			// console.log( options );

			// Event

			self.$elem.find('[data-action=add]').click(function() {
				self.add();
			}); 

			self.$elem.delegate('[data-action=remove]', 'click', function(event) {


				var $form = $(this).closest('form');
				var data = $form.find('[role=dropzone]').data();
				var $input = $form.find('[name=media]');

				var id = $input.val();
				console.log( id );

				if( id ){


					Dialog.load( Event.URL + 'banner/del', {
						id: id,
						callback: 1
					}, {
						onSubmit: function ( $d ) {

							var _$form = $d.$pop.find('form');

							Event.inlineSubmit( _$form ).done(function( result ) {

								if( result.message ){
									Event.showMsg({text: result.message, load: 1, auto: 1});
								}

								if( result.error ){
									return false;
								}


								$form.find('[name=media], [name=link]').val('');

								Dialog.close();
								self.clear( $form );
							});
						}
					} );
				}
				else{
					self.clear( $form );
				}

				// self.clear( $(this).closest('form') );
			});

			self.$elem.delegate(':input[type=file]', 'change', function(event) {
				
				var $form = $(this).closest('form');
				$form.removeClass('has-empty').addClass('has-loading');
				self.loadFile($form.find('[role=dropzone]'), this.files[0]);
			});

			self.$elem.delegate('.uiCoverImage_overlay', 'click', function() {
				var $form = $(this).closest('form');

				$form.find(':input[type=file]').trigger("click");
			});


			/*self.$elem.delegate('[role=dropzone]', 'contextmenu', function(e) {
				e.stopPropagation();
			});*/

			self.$elem.delegate('[role=dropzone]', 'mousedown', function(e) {
				var $this = $(this);

				if( $this.data('img') ){

					$this.data('touch', true);
					$this.data('startY', e.offsetY);
					$this.data('beforeY', parseInt($this.data('img').css('margin-top')) );
				}

			});

			self.$elem.delegate('[role=dropzone]', 'mousemove', function(e) {
				var $this = $(this);
				var data = $(this).data();

				if( data.touch && data.img ){

					var axisY = data.beforeY - (data.startY-e.offsetY);

					if( axisY >= 0 ) axisY = 0;

					if( axisY <= data.maxY ) axisY = data.maxY;

					// cropimage_y

					data.img.css('marginTop', axisY);

					axisY*=-1;

					var marginTop = (data._marginTop*axisY) / data.marginTop
					// console.log( axisY );

					data.img.closest('form').find( '#cropimage_y' ).val( parseInt(marginTop) );
					// console.log( 'mousemove', $(this).data() );
				}
				
			});

			self.$elem.delegate('[role=dropzone]', 'mouseup', function(event) {
				$(this).data('touch', false);
				// console.log( 'mouseup' );
			});
			
			self.$elem.delegate('[role=dropzone]', 'mouseleave', function(event) {
				$(this).data('touch', false);
			});

			self.$elem.delegate('form', 'submit', function(e) {
				e.preventDefault();

				self.save( $(this) );
			});

			self.$elem.delegate('[name=link]', 'change', function(e) {
				$form = $(this).closest('form');
				var id = $form.find('[name=media]').val();

				if( id ){
					self.save( $form );
				}
				
			});
			
		},
		add: function ( data ) {
			var self = this;

			var $item = self.setItem( data );

			self.$listbox.append( $item );
		},
		clear: function ( $el ) {
			var self = this;

			$el.find('[role=dropzone]')
				.removeClass('has-image')
				.addClass('has-empty');

			$el.find('[type=file]').val('');	

			if( $el.siblings().length!=0 ){
				$el.remove();
			}
		},

		setItem: function ( data ) {
			var self = this;

			data = data || {};

			var $image = $('<div>', {class: "uiCoverImageContainer has-empty", role: 'dropzone'});
			$image.css( self.size );

			$image.append(
				  '<div class="uiCoverImage_empty"><div class="uiCoverImage_emptyText">'+

				  	self.options.message + 

				  '<div></div>'
				, '<div class="uiCoverImage_action">' + 
					// '<a data-action="change"><i class="icon-camera"></i></a>' +
					'<a data-action="remove"><i class="icon-remove"></i></a>' +
				'</div>'
				, '<div class="uiCoverImage_image" ref="preview"></div>'
				, '<div class="uiCoverImage_overlay"></div>'
				, '<div class="uiCoverImage_uploader"><div class="loader-spin-wrap"><div class="loader-spin"></div></div></div>'
			);

			$form = $('<form>', {class: 'form-insert dropzone-banner' });
			
			if( data.id ){

				$image.data('id', data.id);
				$form.append( $('<input>', { type: 'hidden', name: 'media', value: data.id, autocomplete: "off" }) );

				$image.removeClass('has-empty').addClass('has-image').find('[ref=preview]').html( $('<img>', {
					src: data.url
				}) );

			}
			
			$form.append( $('<input>', { type: 'hidden', name: 'id', value: self.options.data.id, autocomplete: "off" }) );
			$form.append( $('<input>', { type: 'hidden', name: 'cropimage[width]', value: self.options.data.width, autocomplete: "off" }) );
			$form.append( $('<input>', { type: 'hidden', name: 'cropimage[height]', value: self.options.data.height, autocomplete: "off" }) );


			$form.append( $('<input>', { id: 'cropimage_x', type: 'hidden', name: 'cropimage[x]', value: 0, autocomplete: "off" }) );
			$form.append( $('<input>', { id: 'cropimage_y', type: 'hidden', name: 'cropimage[y]', value: 0, autocomplete: "off" }) );

			$fieldset = $('<fieldset class="control-group"></fieldset>');
			$fieldset.append( $image );

			$form.append( 

				  $('<fieldset>', {class: 'control-group'}).html( 
				  	$('<input>', {
						type: 'text',
						name: 'link',
						value: data.primalink,
						autocomplete: "off",
						placeholder: 'ลิงก์',
						class: 'inputtext'
					}) 
				)
				, $fieldset
				, $('<fieldset>', {class: 'control-group'}).html( '<input role="button" type="file" accept="image/*" name="file1">' )
				/*, $('<fieldset>', {class: 'control-group tar'}).append( 
					''
					  // '<a class="btn btn-link">ยกเลิก</a>' 
					, '<button type="submit" class="btn btn-primary -disabled btn-submit">บันทึก</button>' 

				)*/
			);

			return $form;
		},

		loadFile: function ($el, file) {
			var self = this;

			var reader = new FileReader();
			reader.onload = function (e) {
				self.loadImg( $el, e.target.result );
			}

			reader.readAsDataURL( file );
		},
		loadImg: function ($el, src) {
			var self = this;
			var image = new Image();
			image.src = src;

			var $image = $(image).addClass('img');

			image.onload = function() {
					
				var scaledW = this.width;
				var scaledH = this.height;

				var w = $el.outerWidth(),
					h =  $el.outerHeight();

				$el.addClass('has-image -touch');
				$el.find('[ref=preview]').html( $image );

				var imgW = w;
				var imgH = (w*scaledH) / scaledW;

				var axisY = (imgH - h)/2;
				$image.css({
					// marginTop: axisY*-1
				});

				$image.attr({
					width: imgW,
					height: imgH
				});

				$el.data( '$img', $image );

				var max = imgH-h;
				if( max>0 ) max*=-1;

				$el.data( 'maxY', max );
				$el.data( 'scaledH', scaledH );
				$el.data( 'scaledW', scaledW );
				$el.data( 'marginTop', axisY );

				self.save( $el.closest('form') );
				// self.setAxisY( $el );
			}
		},

		setAxisY: function ( $el ) {
			var self = this;

			var data = $el.data();

			// $width = $set_width;
            var height = ( self.options.data.width* data.scaledH ) / data.scaledW;
            if( height < self.options.data.height ){
            	height = self.options.data.height;
            }


			// var height = (self.options.data.width*data.scaledH) / data.scaledW;

			height += self.options.data.height;
			// var y = self.options.data.height/2;
			var axisY = parseInt( (height/2) + self.options.data.height); 

            $el.data( '_marginTop', axisY )
            /*var imgW = self.options.data.width;
			var imgH = (self.options.data.height*scaledH) / scaledW;*/

			console.log( axisY, data.scaledW, data.scaledH );
			// var axisY = (self.options.data.height*scaledH) / 2;
			// 

			$el.closest('form').find( '#cropimage_y' ).val( axisY );
		},


		save: function ( $form ) {
			var self = this;

			$form.attr('action', self.options.urls.save );
			Event.inlineSubmit($form).done(function (res) {
				
				if( res.message ){
					Event.showMsg({text: res.message, load: 1, auto: 1});
				}

				if( res.error ){
					return false;
				}

				$form.find('[role=dropzone]').removeClass('has-loading')

				if( res.id ){
					var $input = $form.find('[name=media]');

					if( $input.length == 0 ){
						$form.append( $('<input>', { type: 'hidden', name: 'media', value: res.id, autocomplete: "off" }) );
					}
					else{
						$input.val( res.id );
					}	
				}


			});
		}

	}
	$.fn.banner = function( options ) {
		return this.each(function() {
			var $this = Object.create( Banner );
			$this.init( options, this );
			$.data( this, 'banner', $this );
		});
	};
	$.fn.banner.settings = {
		multiple: false,
		// width
	}

})( jQuery, window, document );