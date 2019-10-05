// Utility
if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {};
		F.prototype = obj;
		return new F();
	};
}

(function( $, window, document, undefined ) {

	var MediaGallery = {
		init: function ( options, elem ) {
			var self = this;

			// set Elem 
			self.$elem = $(elem);

			// set Data
			self.options = $.extend( {}, $.fn.mediaGallery.options, options );
			self.active = false;
			self.tab = 'my';
			console.log( self.options );


			// Modal
			self.setModal();
			self.displayModal();

			// event
			$(window).resize(function () {
				self.resize();
			});

			self.$modal.delegate('[data-action]', 'click', function(event) {


				if( $(this).hasClass('active') ) return false;
				$(this).addClass('active').siblings().removeClass('active');

				self.action();

			}); 
			


		},

		setModal: function (  ) {
			var self = this;

			self.$modal = $('<div>', {class: 'model model-gallery'}).addClass('effect-' + self.options.effect);
			$('body').append( self.$modal );

			// 
			self.$pop = $('<div>', {class: 'model-container'});
			self.$modal.append( self.$pop );


			self.$pop.append( self.setContent( {
				title: 'Photos album',
				toolbar: [ {id:'my', name:'My Images'}, {id:'social', name:'Social Images'}, {id:'free', name:'Free Images'} ],
				// body: '1sd',
				summary: 'Upload or drag n’ drop images in JPEG, PNG or GIF formats. Each file can be up to 15MB.'
				// summary: 'Add images from your Facebook, Instagram, Google Drive, Google Photos or Flickr accounts at the click of a button.'
			} ) );
		},
		setContent: function ( settings ) { 
			var self = this;

			// content
			var $elem = $( settings.elem || '<div/>' )
				.addClass("model-content")
				.addClass( settings.addClass );


			// Input hidden
			if( settings.hiddenInput ){
				$elem.append( thisettings.setHiddenInput( settings.hiddenInput ) );
			}


			// Title
			if( settings.title ){
				$elem.append( $('<div/>', {class: 'model-title'}).html(settings.title) );
			}

			var $tabs = $('<div/>', {class: 'model-tabs'});
			$elem.append( $tabs );

			// toolbar
			if( settings.toolbar ){

				$toolbar = $('<nav/>', {class: 'model-toolbar'});
				$.each(settings.toolbar, function( key, obj ) {
					$toolbar.append( $('<div>', { class: 'model-toolbar-btn', text: obj.name, 'data-tab-action': obj.id}) );
				});
				$tabs.append( $toolbar );
			}

			var $actions = $('<div>', { class: 'model-tabs-actions'});
			$tabs.append( $actions );
			$actions.append( $('<button>', {type: 'button', class: 'btn btn-blue'}).append( $('<i>', {class: 'icon-upload mrs'}), $('<span>', {text: 'Upload Images'}) ) );

			// Summary
			if( settings.summary ){
				$elem.append( $('<div/>', {class: 'model-summary clearfix'}).append(
					$('<div/>', {class: 'model-summary-msg lfloat'}).html(settings.summary)
				) );
			}


			var $main = $('<div/>', {class: 'model-main'});
			$elem.append( $main );

			$main.append( $('<div/>', {class: 'model-sidebar'}), $('<div/>', {class: 'model-body'}) );

			// Body
			if( settings.body ){
				$main.find('.model-body').html(settings.body);
			}

			// Buttons
			if( settings.button || settings.bottom_msg ){

				var $buttons = $('<div/>', {class: 'model-buttons clearfix'});

				if ( settings.button ){
	                $buttonsettings.append( $('<div/>', {class: 'rfloat mlm'}).html(settings.button) );
				}

	            if ( settings.bottom_msg ){
	            	$buttonsettings.append( $('<div/>', {class: 'model-buttons-msg'}).html(settings.bottom_msg) );
	            }

	            $elem.append($buttons);
			}

			// Footer
			// $elem.append( $('<div/>', {class: 'model-footer'}).html('') );
			/*if( settings.footer ){
				$elem.append( $('<div/>', {class: 'model-footer'}).html(settings.footer) );
			}*/

			return $elem;
		},

		displayModal: function () {
			var self = this;

			if( !$('html').hasClass('hasModel') ){
				var top = $(window).scrollTop();

				$('#doc').addClass('fixed_elem').css('top', top*-1);
				$('html').addClass('hasModel');
			}

			self.$modal.addClass('active');
			self.$modal.addClass('show');
			self.active = true;

			self.tabsAction(); 

			

			self.resize();
		},
		resize: function () {
			var self = this;

			if( !self.active || !self.$modal) return false;


			self.$modal.find('.model-main').css({
				height: self.$modal.find('.model-container').outerHeight() - ( self.$modal.find('.model-title').outerHeight() + self.$modal.find('.model-tabs').outerHeight() + self.$modal.find('.model-summary').outerHeight() + self.$modal.find('.model-footer').outerHeight() )
			});
		},

		tabsAction: function () {
			var self = this;	

			self.$modal.find('[data-tab-action='+ self.tab +']').addClass('active').siblings().removeClass('active');

			if( self.tab=='my' ){
				self.setMyImage();
			}

		},

		setMyImage: function () {
			var self = this;

			// sidebar
			var $sidebarWrap = $('<div>', {class: 'model-sidebar-wrap'});
			var $sidebarFooter = $('<div>', {class: 'model-sidebar-footer'});
			self.$modal.find('.model-sidebar').append(
				$sidebarWrap
			);

			var $sidebarNav = $('<ul>', {class: 'model-sidebar-nav'});
			$sidebarWrap.append( $sidebarNav );

			var a = ['All Media', 'Site Media', 'Banners'];
			$.each(a, function(index, el) {
				$sidebarNav.append( $('<li>', {class: 'model-sidebar-item', 'data-action': ''}).text(el) );
			});
			
			$sidebarFooter.append( $('<a>', {class: ''}).append(
				  $('<i>', {class: 'icon-plus mrs'})
				, $('<span>').text('Add New Folder')
			) );


			var $droppable = $('<div>', {role: 'droppable', class: 'model-droppable'});

			$droppable.html( $('<div>', { class: 'modal-droppable-text'}).append( 
				  $('<i>', {class: 'icon-picture-o'})
				, $('<h3>', {text: 'Start Adding Files to "Mobile Uploads". It\'s Easy!'}) 
				, $('<p>', {text: 'Drag and drop them here, or click Upload Images.'}) 
				, $('<p>', {text: 'Your images will also appear in your Site Media folder, so they’re easy to find and use. '}).append( $('<a>', {role: 'upload', text: 'Upload Images'}) ) 
			) );


			self.$listsbox = $('<div>', {ref: 'listsbox', class: 'gallery-grid'});
			self.$modal.find('.model-body').append( $droppable, self.$listsbox );

			/*
			https://johnny.github.io/jquery-sortable/js/jquery-sortable.js
			https://codepen.io/salasks/pen/ojzvp
			https://stackoverflow.com/questions/6199890/jquery-droppable-receiving-events-during-drag-over-not-just-on-initial-drag-o

			$droppable.droppable({
				drop: function (event, ui) {
					console.log( 'drop' );
				}
			});*/
		},


		action: function () {
			var self = this;

			self.$listsbox.empty();

			self.getData = {
				limit: 12,
				pager: 1
			};
			self.refresh();
		},

		refresh: function (length) {
			var self = this;

			setTimeout(function () {
				self.fetch().done(function( results ) {

					self.getData = $.extend( {}, self.getData, results.options );

					self.$modal.find('.model-body').toggleClass('has-empty', parseInt(results.total) == 0 );

					self.buildFrag(results.lists);

					self.displayImages();

				});
			}, length || 1);
		},

		fetch: function(url, getData){
			var self = this;

			return $.ajax({
				url: Event.URL + 'media/album/',
				data: self.getData,
				dataType: 'json'
			})
			.always(function() {
				Event.hideMsg();
			})
			.fail(function() { 
				Event.showMsg({ text: "เกิดข้อผิดพลาด...", load: true , auto: true });
			});
		},
		buildFrag: function ( results ) {
			self = this;

			self.$items = $.map( results, function(obj) {
				return self.setItemImage(obj)[0];
			});
			
		},
		setItemImage: function (data) {

			var $div = $('<div>', {class: 'gallery-grid-item'});
			$div.append( $('<div>', {class: 'pic'}) );



			$div.data( data );

			return $div;
		},


		getBlockInRow: function(rowNum){
            var appendBlocks = this.options.appendBlocks();
            for (var i = 0; i < appendBlocks.length; i++) {
                var block = appendBlocks[i];
                if(block.rowNum === rowNum){
                    return block;
                }
            }
        },

		displayImages: function () {
			var self = this,
                ws = [],
                rowNum = 0,
                baseLine = 0,
                rows = [],
                totalWidth = 0;


            var limit = self.$items.length,
                photos = self.$items,
                appendBlocks = self.options.appendBlocks();


            var w = self.$listsbox.width();
            var border = parseInt(self.options.margin, 10);

            var h = parseInt(self.options.rowHeight, 10);


			self.$listsbox.append( self.$items );
			$.each( self.$items, function() {
				
				var $elem = $(this);
				var data = $elem.data();

				// console.log(data);

				var wt = parseInt(data.size.width, 10);
	            var ht = parseInt(data.size.height, 10);

	             if (ht !== h) {
	                wt = Math.floor(wt * (h / ht));
	            }
	            totalWidth += wt;
	            ws.push(wt);
				
			});

			$.each(appendBlocks, function(index, block){
                totalWidth += block.width;
            });

            var perRowWidth = totalWidth / Math.ceil(totalWidth / w);
            console.log('rows', Math.ceil(totalWidth / w));

            var tw = 0;
            while (baseLine < limit) {
                var row = {
                        width: 0,
                        photos: []
                    },
                    c = 0,
                    block = self.getBlockInRow(rows.length + 1);

                if(block){
                    row.width += block.width;
                    tw += block.width;
                }
                while ((tw + ws[baseLine + c] / 2 <= perRowWidth * (rows.length + 1)) && (baseLine + c < limit)) {
                    tw += ws[baseLine + c];
                    row.width += ws[baseLine + c];
                    row.photos.push({
                        width: ws[baseLine + c],
                        photo: photos[baseLine + c]
                    });
                    c++;
                }
                baseLine += c;
                rows.push(row);
            }
            console.log(rows.length, rows);


            /*for (var i = 1; i < rows.length; i++) {
                var row = rows[i];
                for (var j = 0; j < row.photos.length; j++) {
                    var photo = row.photos[j].photo;
                };
            }*/


            for (var i = 0; i < rows.length; i++) {
            	var row = rows[i],
                    lastRow = false;


                rowNum = i + 1;
                if (self.options.maxRows && rowNum > self.options.maxRows) {
                    break;
                }
                if (i === rows.length - 1) {
                    lastRow = true;
                }

                tw = -1 * border;
                var newBlock = self.getBlockInRow(lastRow ? -1 : rowNum), availableRowWidth = w;
                if(newBlock){
                    availableRowWidth -= newBlock.width;
                    tw = 0;
                }

                // Ratio of actual width of row to total width of images to be used.
                var r = availableRowWidth / row.width, //Math.min(w / row.width, this.options.maxScale),
                    c = row.photos.length;

                // new height is not original height * ratio
                var ht = Math.min(Math.floor(h * r), parseInt(self.options.maxRowHeight,10));
                r = ht / self.options.rowHeight;

                var domRow = $('<div/>', {
                    'class': 'gallery-grid-item'
                });
                domRow.height(ht + border);
                self.$listsbox.append(domRow);

                var imagesHtml = '';
                for (var j = 0; j < row.photos.length; j++) {
                    var photo = row.photos[j].photo;
                    // Calculate new width based on ratio
                    var wt = Math.floor(row.photos[j].width * r);
                    tw += wt + border;

                    var data = $(photo).data();

                    imagesHtml += self.renderPhoto(photo, {
                        src: data.url, //self.options.thumbnailPath(photo, wt, ht),
                        width: wt,
                        height: ht
                    }, newBlock ? false : j === row.photos.length - 1);
                }
                if(imagesHtml === ''){
                    domRow.remove();
                    continue;
                }

                domRow.html(imagesHtml);


                if ((Math.abs(tw - availableRowWidth) < 0.05 * availableRowWidth)) {
                	// if total width is slightly smaller than
                    // actual div width then add 1 to each
                    // photo width till they match

                    var k = 0;
                    while (tw < availableRowWidth) {
                        var div1 = domRow.find('.' + self.options.imageContainer + ':nth-child(' + (k + 1) + ')'),
                            img1 = div1.find('.' + self.options.imageSelector);
                        img1.width(img1.width() + 1);
                        k = (k + 1) % c;
                        tw++;
                    }
                    // if total width is slightly bigger than
                    // actual div width then subtract 1 from each
                    // photo width till they match
                    k = 0;
                    while (tw > availableRowWidth) {
                        var div2 = domRow.find('.' + self.options.imageContainer + ':nth-child(' + (k + 1) + ')'),
                            img2 = div2.find('.' + self.options.imageSelector);
                        img2.width(img2.width() - 1);
                        k = (k + 1) % c;
                        tw--;
                    }
                } else{
                	if( availableRowWidth - tw > 0.05 * availableRowWidth ){
                        var diff = availableRowWidth-tw,
                            adjustedDiff = 0,
                            images = domRow.find('.' + self.options.imageContainer),
                            marginTop = 0;
                        for(var l = 0 ; l < images.length ; l++ ){
                            var currentDiff = diff / (images.length),
                                imgDiv = images.eq(l),
                                img = imgDiv.find('.' + self.options.imageSelector),
                                imageWidth = img.width(),
                                imageHeight = img.height();
                            if( i === images.length - 1 ){
                                currentDiff = diff - adjustedDiff;
                            }
                            img.width( imageWidth + currentDiff );
                            img.height( ( imageHeight / imageWidth ) * (imageWidth + currentDiff) );
                            marginTop = (imageHeight - img.height()) / 2;
                            img.css('margin-top', marginTop);
                            adjustedDiff += currentDiff;
                        }
                    }
                }
                

                console.log( newBlock );
                if(newBlock){
                    $('<div />', {
                        class : this.options.imageContainer + ' added-block',
                        css : {
                            width : newBlock.width,
                            height: ht
                        },
                        html : newBlock.html
                    }).appendTo(domRow);
                }

            } // end: for
			// console.log( ws );

		},
		renderPhoto: function(image, obj, isLast) {
            var data = {},
                d;
            d = $.extend({}, image, {
                src: obj.src,
                displayWidth: obj.width,
                displayHeight: obj.height,
                marginRight: isLast ? 0 : this.options.margin
            });
            if (this.options.dataObject) {
                data[this.options.dataObject] = d;
            } else {
                data = d;
            }
            return this.options.template(data);
		},
	};

	$.fn.mediaGallery = function( options ) {
		return this.each(function() {
			var $this = Object.create( MediaGallery );
			$this.init( options, this );
			$.data( this, 'mediaGallery', $this );
		});
	};

	$.fn.mediaGallery.options = {
		effect: 1,

		appendBlocks : function(){ return []; },
        rowHeight: 150,
        maxRowHeight: 350,
        handleResize: false,
        margin: 5,
        imageSelector: 'image-thumb',
        imageContainer: 'photo-container',

        template: function(data) {
            return '<div class="photo-container" style="height:' + data.displayHeight + 'px;margin-right:' + data.marginRight + 'px;">' +
                '<img class="image-thumb" src="' + data.src + '" style="width:' + data.displayWidth + 'px;height:' + data.displayHeight + 'px;" >' +
                '</div>';
        },
	};
	
	
})( jQuery, window, document );