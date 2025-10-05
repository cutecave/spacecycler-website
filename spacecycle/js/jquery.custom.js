/*

	Theme Name: Born Again - One Page Portfolio Site
	Author:		Dan Richardson (Subatomic Themes)
	Version:	1.0.1
	jQuery:		Custom jQuery script (jquery.custom.js)

*/
jQuery(document).ready(function($){
	
	/*------------------------------------------------------------------------------------------
	#
	# --- Navigation
	#
	------------------------------------------------------------------------------------------*/
	
	var ease_type 		= 'easeInOutCirc';
	var ease_duration 	= 1200;
	
	// Scroll to the top of the page.
	$('.back_to_top').click(function(e){
	
		$('body, html')
			.animate({ scrollTop: 0} , ease_duration , ease_type );
		e.preventDefault();
	
	});
	
	// Scroll to a section on the page.
	$('.scroll_to').click(function(e){
	
		var the_id 			= $(this).attr('id');
		var destination 	= the_id.split('_')[0];
		var window_width 	= $(window).width();
		var the_offset 		= 89; // -- The size of the page header minus 1px.
	
		// If the viewport is in mobile browser, hide the menu again after selecting.
		if( window_width < 767 )
		{
			the_offset = -1;
			if( $('#page_header_overlay nav').is(':visible') )
			{
				$('#page_header_overlay nav').slideUp( 800 , 'easeOutBounce' );
			} 
			
		} else {
			the_offset = 89;
		}
		
		$('body , html').animate({ scrollTop: $('#' + destination).offset().top-the_offset } , ease_duration , ease_type );
	
		e.preventDefault();
	
	});
	
	// Mobile navigation menu.
	$('#mobile_menu').click(function(e){
	
		$('#navigation').slideToggle( 800 , 'easeOutBounce' );
		e.preventDefault();
	
	});
	
	$(window).resize(function(){
		
		window_width = $(window).width();
		
		// Show or hide the main navigation depending on window size.
		if ( window_width > 766 )
		{
		
			$('#navigation').show();
		
		} else if ( window_width < 767 ){
		
			$('#navigation').hide();
			
		}
		
	});
	
	/*------------------------------------------------------------------------------------------
	#
	# --- Sortable Portfolio
	#
	------------------------------------------------------------------------------------------*/
	
	// Enable all Portfolio elements...
	$('.main_portfolio li').addClass('item_enabled');
	
	// Hide all hover icons and update the porfolio.
	$('.hover_zoom').css({ opacity : 0 });
	update_portfolio();
	
	// Targets all Portfolio items when clicked...
	$('.portfolio_list li a.portfolio_all').click(function(e){
	
		$('.main_portfolio li')
			.removeClass('item_disabled')
			.addClass('item_enabled')
			.stop()
			.animate({ opacity : 1 });
	
		update_portfolio();
		e.preventDefault();
		
	});
	
	// Targets only the Portfolio items with the same 'tag'...
	$('.portfolio_list li a').not('.portfolio_all').click(function(e){
	
		var $the_tag		= $(this).attr('class');
		var $current_tag 	= $('.main_portfolio').find('li[data-type~=' + $the_tag + ']');
		
		$('.main_portfolio li')
			.addClass('item_disabled')
			.removeClass('item_enabled')
			.stop()
			.animate({ opacity : 0.15 });
	
		$current_tag
			.removeClass('item_disabled')
			.addClass('item_enabled')
			.stop()
			.animate({ opacity : 1 });
	
		update_portfolio();
		e.preventDefault();
	
	});
	
	// Function to update the click and hover events on Portfolio items...
	function update_portfolio()
	{
	
		$('.main_portfolio li').click(function(e){
		
			if ($(this).hasClass('item_disabled'))
			{
				e.preventDefault();
			}
		
		});
		
		$('.main_portfolio li').hover(
			// Mouse Over
			function ()
			{
				if($(this).hasClass('item_enabled')){
				
					// Get the thumbnail sizes...
					var the_img_width 	= $('.main_portfolio li figure img').width();
					var the_img_height 	= $('.main_portfolio li figure img').height();
					
					// Position the icons...
					$('.hover_zoom').css({
					
						"top" 	: ( the_img_height / 2 - 30 ) + "px"
						//"left"	: ( the_img_width  / 2 - 30 ) + "px"
						
					});
				
					$(this).find('figure img')
						.stop()
						.animate({ opacity : 0.1 } , 400 );
						
					$(this).find('.hover_zoom')
						.stop()
						.animate({						
							opacity : 1,
							left	: ( the_img_width  / 2 - 30 )
						} , 400 , "easeOutBack" );
					
				}
			},
			// Mouse Out
			function ()
			{
				if($(this).hasClass('item_enabled')){
				
					$(this).find('figure img')
						.stop()
						.animate({ opacity : 1 } , 400 );
					
					$(this).find('.hover_zoom')
						.stop()
						.animate({ 
							opacity : 0,
							left	: 0
						} , 400 , "easeInOutCirc" );
						
				}
			}
		);
	};
	
	/*------------------------------------------------------------------------------------------
	#
	# --- Icon Hover Effects
	#
	------------------------------------------------------------------------------------------*/
	
	$('.bounce').hover
	(
		function (){ $(this).stop().animate({ paddingBottom	: '15px' , bottom : '15px' } , 500 , 'easeOutBack' );},
		function (){ $(this).stop().animate({ paddingBottom : '0'    , bottom : '0'    } , 500 , 'easeInBack'  );}
	);
	
	$('.float').hover
	(
		function (){ $(this).stop().animate({ paddingBottom	: '6px' , bottom : '6px' } , 250 , 'easeInOutCirc' );},
		function (){ $(this).stop().animate({ paddingBottom : '0'   , bottom : '0'   } , 250 , 'easeInOutCirc' );}
	);
	
	/*------------------------------------------------------------------------------------------
	#
	# --- Contact Form and Comment Reply Validation
	#
	------------------------------------------------------------------------------------------*/
	
	$('#contact_form_outcome').hide();
	$('#contact_form').validate({
		
		rules :
		{
			user_name :
			{
				required	: true
			},
			user_email :
			{
				required	: true,
				email		: true
			},
			user_message :
			{
				required	: true
			}
		},
		
		messages :
		{
			user_name 		: "Please enter your name!",
			user_email  	: "Please enter a valid email!",
			user_message	: "Please write a message!"
		},
		
		submitHandler : function(form)
		{
		
			var user_name    = $('input#user_name').val();
			var user_email   = $('input#user_email').val();
			var user_url     = $('input#user_url').val();
			var user_message = $('textarea#user_message').val();
			
			$.ajax({
			
				type: 'post',
				url:  'sendEmail.php',
				data: 'user_name=' + user_name + '&user_email=' + user_email + '&user_url' + user_url + '&user_message=' + user_message,
				success: function(results) {
				
					$('#contact_form_outcome').html(results);
					$('#contact_form_outcome').slideDown( 1000 , 'easeInOutCirc' );
					
				}
				
			});
			
		}
		
	});
	
	
	$('#commentform').validate({
	
		rules :
		{
			name :
			{
				required	: true
			},
			email :
			{
				required	: true,
				email		: true
			},
			comment :
			{
				required	: true
			}
		},
		
		messages :
		{
			name 		: "Please enter your name!",
			email  		: "Please enter a valid email!",
			comment		: "Please write a message!"
		}
	
	});
	
});