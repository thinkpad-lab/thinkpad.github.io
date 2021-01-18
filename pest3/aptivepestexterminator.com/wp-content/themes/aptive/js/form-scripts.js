
      jQuery(".zip-code input").attr('maxlength', 5);

      jQuery(".zip-code input").on( 'keypress keyup blur', function (event) {    
        jQuery(this).val( jQuery(this).val().replace(/[^\d].+/, "") );
        if ((event.which < 48 || event.which > 57)) {
          event.preventDefault();
        }
      });

      jQuery(".hero .zip-code input").on( 'blur', function (event) {   
        validateZipCodeLength( ".hero" );
      });
      jQuery("#bottom-form-mobile .zip-code input").on( 'blur', function (event) {   
        validateZipCodeLength( "#bottom-form-mobile" );
      });
      
      function validateZipCodeLength( context ) {
        if( jQuery( context + " .zip-code input" ).val().length != 5 ) {
          jQuery( context + " .zip-code input" ).val( "" );
          return false;
        }
        return true;
      }

      jQuery(".phone-number input").mask("(999) 999-9999");

      jQuery('.hero .wpforms-submit').on( 'click', function(e) {
        if( !validateEmail('.hero') ) e.preventDefault();
      });
      jQuery('#bottom-form-mobile .wpforms-submit').on( 'click', function(e) {
        if( !validateEmail('#bottom-form-mobile') ) e.preventDefault();
      });

      function validateEmail( context ) {
        var emailInput = jQuery( context + ' .email-address input');
        var emailInputValue = emailInput.val();
        var isValidEmail;
        var emailErrorMessage = '';
        
        if( emailInputValue == '' ) {
          isValidEmail = false;
          emailErrorMessage = 'This field is required.';
        } else {
          var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          isValidEmail = regex.test( emailInputValue );
          emailErrorMessage = 'Please enter a valid email address.';
        }
        
        if( !isValidEmail ) {
          var emailInputID = emailInput.attr('id');
          var emailErrorMessageID = emailInputID + '-error';
          var emailErrorMessageElement = jQuery( context + ' #' + emailErrorMessageID );

          // check if element already exists
          if( emailErrorMessageElement.length ) {
            emailErrorMessageElement.show();
            emailErrorMessageElement.html( emailErrorMessage )
          } else {
            emailInput.after( '<label id="' + emailErrorMessageID + '" class="wpforms-error" for="' + emailInputID + '">' + emailErrorMessage + '</label>' )
          }
          emailInput.addClass('wpforms-error');

          return false;
        } else {
          return true;
        }
      }
      

      /* pass gclid from querystring to aptive posting
       *************************************************************** */
      function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
      };

      var querystringGclid = getUrlParameter( "gclid" );      
      if( querystringGclid != "" ) {
        jQuery( '.sub-id input' ).val( querystringGclid )
      }

      
      /* pass city and state from ziptasticapi.co 
       *************************************************************** */
      jQuery('.hero .wpforms-page-1 .wpforms-page-next').on( 'click', function(e) {
        lookupCityAndState('.hero');
      });
      jQuery('#bottom-form-mobile .wpforms-page-1 .wpforms-page-next').on( 'click', function(e) {
        lookupCityAndState('#bottom-form-mobile');
      });

      function lookupCityAndState( context ) {
        try {
          var zipCodeInput = jQuery( context + ' .zip-code input');
          var zipCodeInputValue = zipCodeInput.val();
                  
          jQuery.ajax('https://ziptasticapi.com/' + zipCodeInputValue)
          .done(
              function success(response) {
                  var responseObject = jQuery.parseJSON( response );          // response comes back as string from api
                  if( responseObject.error == undefined ) {
                    jQuery( '.wpforms-city input' ).val( capitalize( responseObject.city ) );
                    jQuery( '.wpforms-state input' ).val( responseObject.state );
                  }
              }
          )
          .fail( function( data, status ) {
            
          });
        }
        catch( e ) {}
      }

      // helper function - capitalize city properly since it comes back all caps from ziptastic api
      function capitalize(str) {
        str = str.toString().toLowerCase();

        var words = str.split(' ');
        words.forEach(function(word, i) {
          words[i] = word[0].toUpperCase() + word.slice(1);
        });
        return words.join(' ');
      }

      // listen for ENTER keypress on the form
      jQuery( '.hero .wpforms-form' ).keypress( function( e ) {
        if( e.keyCode == 13 ) {
          e.preventDefault();   // prevent default action

          if( jQuery( '.hero .wpforms-page-1' ).css( 'display' ) != 'none' ) {
            jQuery( '.hero .wpforms-page-1 .wpforms-page-next' ).click();
          } else if( jQuery( '.hero .wpforms-page-2' ).css( 'display' ) != 'none' ) {
            jQuery( '.hero .wpforms-page-2 .wpforms-page-next' ).click();
          } else  if( jQuery( '.hero .wpforms-page-3' ).css( 'display' ) != 'none' ) {
            if( validateEmail('.hero') ) jQuery( '.hero .wpforms-form' ).submit();
          }       
        } 
      });

      // handle the bottom form separately
      jQuery( '#bottom-form-mobile .wpforms-form' ).keypress( function( e ) {
        if( e.keyCode == 13 ) {
          e.preventDefault();   // prevent default action

          if( jQuery( '#bottom-form-mobile .wpforms-page-1' ).css( 'display' ) != 'none' ) {
            jQuery( '#bottom-form-mobile .wpforms-page-1 .wpforms-page-next' ).click();
          } else if( jQuery( '#bottom-form-mobile .wpforms-page-2' ).css( 'display' ) != 'none' ) {
            jQuery( '#bottom-form-mobile .wpforms-page-2 .wpforms-page-next' ).click();
          } else  if( jQuery( '#bottom-form-mobile .wpforms-page-3' ).css( 'display' ) != 'none' ) {
            if( validateEmail('#bottom-form-mobile') ) jQuery( '#bottom-form-mobile .wpforms-form' ).submit();
          }       
        } 
      });
      
      // hide non-form sections on steps 2 and 3 of the form
      var userClickedPrevious;

      jQuery( '.hero .wpforms-page-1 .wpforms-page-next' ).on( 'click', function(e) {
        if( validateZipCodeLength( ".hero" ) ) hideNonFormElements();
      });

      jQuery( '#bottom-form-mobile .wpforms-page-1 .wpforms-page-next' ).on( 'click', function(e) {
        if( validateZipCodeLength( "#bottom-form-mobile" ) ) hideNonFormElements();
      });

      function hideNonFormElements() {
        jQuery( '.centered-block-container' ).fadeOut( 100 );
        jQuery( '#faqs' ).fadeOut( 100 );
        jQuery( '#article-content' ).fadeOut( 100 );        // for article pages

        if( jQuery( '#bottom-form-mobile' ).length ) {
          jQuery( '#mobile-form-anchor' ).fadeOut( 100 );
          userClickedPrevious = false;

          if( jQuery(window).width() <= 600 ) {             // extra logic when bottom form is present on mobile
            jQuery( '.hero' ).fadeOut( 100 );
            
            jQuery( window ).resize(function() {            // listen for resize to show hero on desktop view
              if( !userClickedPrevious ) {
                if( jQuery(window).width() > 600 ) { 
                  jQuery( '.hero' ).show();
                } else {
                  jQuery( '.hero' ).hide();
                }  
              }
            });
          }
        }
      }

      jQuery( '.wpforms-page-2 .wpforms-page-prev' ).on( 'click', function(e) {
        showNonFormElements();
      });

      function showNonFormElements() {
        jQuery( '.centered-block-container' ).fadeIn( 100 );
        jQuery( '#faqs' ).fadeIn( 100 );
        jQuery( '#article-content' ).fadeIn( 100 );                 // for article pages

        if( jQuery( '#bottom-form-mobile' ).length ) {              // extra logic when bottom form is present on mobile
          jQuery( '.hero' ).fadeIn( 100 );
          jQuery( '#mobile-form-anchor' ).removeAttr( 'style' );    // use this approach so there are no overriding inline styles and it behaves per the stylesheets
          userClickedPrevious = true;

          if( jQuery(window).width() <= 600 ) {
            scrollToMobileForm( 130 );                              // defined in manifest.js
          }
        }
      }


      jQuery( '.hero .wpforms-page-2 .wpforms-page-next' ).on( 'click', function(e) {
        jQuery( '#tcpa-consent' ).fadeIn( 200 );
      });
      jQuery( '#bottom-form-mobile .wpforms-page-2 .wpforms-page-next' ).on( 'click', function(e) {
        jQuery( '#tcpa-consent-bottom-form' ).fadeIn( 200 );
      });

      jQuery( '.hero .wpforms-page-3 .wpforms-page-prev' ).on( 'click', function(e) {
        jQuery( '#tcpa-consent' ).hide();
      });
      jQuery( '#bottom-form-mobile .wpforms-page-3 .wpforms-page-prev' ).on( 'click', function(e) {
        jQuery( '#tcpa-consent-bottom-form' ).hide();
      });

