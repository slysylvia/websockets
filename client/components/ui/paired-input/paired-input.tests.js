/*eslint-env mocha */
( function( window, document, chai ) {
  "use strict";
  var expect = chai.expect,
      // get wrapper from document or for karma, create a new div and append it to the DOM
      testingWrapper = document.getElementById( "paired-input-test-wrapper" ) ||
        ( function() {
          var wrapper = document.createElement( "div" );
          document.body.appendChild( wrapper );
          return wrapper;
        })(),
      // original state to test against
      originalWrapperOuterHTML = testingWrapper.outerHTML,
      // re-sets wrapper to blank
      resetWrapper = function() {
        testingWrapper.innerHTML = "";
      };

  suite( "<paired-input>", function() {
    suite( "Life Cycle", function() {
      test( "ready: can create from document.createElement", function() {
        expect( document.createElement( "paired-input" ) )
          .to.have.property( "outerHTML" )
          .that.is.a( "string" )
          .and.equals( "<paired-input type=\"text\"></paired-input>" );
      });

      test( "attached: can be added to another DOM Element", function() {
        testingWrapper.appendChild( document.createElement( "paired-input" ) );

        expect( testingWrapper )
          .to.have.property( "innerHTML" )
          .that.is.a( "string" )
          .and.equals( "<paired-input type=\"text\"></paired-input>" );

        resetWrapper();
      });

      test( "detached: can be removed from another DOM element", function() {
        var pairedInput = document.createElement( "paired-input" );

        testingWrapper.appendChild( pairedInput );
        testingWrapper.removeChild( pairedInput );

        expect( testingWrapper )
          .to.have.property( "outerHTML" )
          .that.is.a( "string" )
          .and.equals( originalWrapperOuterHTML );

        resetWrapper();
      });
    });

    suite( "Attributes and Properties", function() {
      suite( "type", function() {
        suite( "default values", function() {
          test( "default value is \"text\"", function() {
            var pairedInput = document.createElement( "paired-input" );

            pairedInput.setAttribute( "type", "default" );

            expect( pairedInput.hasAttribute( "type" ) )
              .to.equal( true );

            expect( pairedInput.getAttribute( "type" ) )
              .to.be.a( "string" )
              .that.equals( "text" );

            expect( pairedInput )
              .to.have.property( "outerHTML" )
              .that.equals( "<paired-input type=\"text\"></paired-input>" );
          });

          test( "setting via setAttribute, default value \"text\" reflects to property", function() {
            var pairedInput = document.createElement( "paired-input" );

            pairedInput.setAttribute( "type", "default" );

            expect( pairedInput )
              .to.have.property( "type" )
              .that.equals( "text" )
              .and.equals( pairedInput.getAttribute( "type" ) );
          });

          test( "setting via property, default value \"text\" reflects to attribute", function() {
            var pairedInput = document.createElement( "paired-input" );

            pairedInput.type = "invalid-value";

            expect( pairedInput.getAttribute( "type" ) )
              .to.be.a( "string" )
              .that.equals( "text" );
          });
        });

        suite( "attempting to set invalid values", function() {
          test( "when set to an invalid value via setAttribute defaults to text", function() {
            var pairedInput = document.createElement( "paired-input" );

            pairedInput.setAttribute( "type", "invalid-value" );

            expect( pairedInput.hasAttribute( "type" ) )
              .to.equal( true );

            expect( pairedInput.getAttribute( "type" ) )
              .to.be.a( "string" )
              .that.equals( "text" );
          });

          test( "when set to an invalid value via setAttribute reflects to property", function() {
            var pairedInput = document.createElement( "paired-input" );

            pairedInput.setAttribute( "type", "invalid-value" );

            expect( pairedInput.hasAttribute( "type" ) )
              .to.equal( true );

            expect( pairedInput )
              .to.have.property( "type" )
              .that.equals( "text" )
              .and.equals( pairedInput.getAttribute( "type" ) );
          });

          test( "when set to an invalid value via property defaults to text", function() {
            var pairedInput = document.createElement( "paired-input" );

            pairedInput.type = "invalid-value";

            expect( pairedInput )
              .to.have.property( "type" )
              .that.equals( "text" )
              .and.equals( pairedInput.getAttribute( "type" ) );
          });

          test( "when set to an invalid value via property reflects to attribute", function() {
            var pairedInput = document.createElement( "paired-input" );

            pairedInput.type = "invalid-value";

            expect( pairedInput.getAttribute( "type" ) )
              .to.be.a( "string" )
              .that.equals( "text" );
          });
        });

        suite( "set acceptable values via setAttribute", function() {
          [
            "text",
            "password",
            "email",
            "tel",
            "number",
            "url",
            "search"
          ].forEach( function( value ) {
            test( "can be set via setAttribute to " + value, function() {
              var pairedInput = document.createElement( "paired-input" );

              pairedInput.setAttribute( "type", value );

              expect( pairedInput.hasAttribute( "type" ) )
                .to.equal( true );

              expect( pairedInput.getAttribute( "type" ) )
                .to.be.a( "string" )
                .that.equals( value );
            });
          });

          [
            "text",
            "password",
            "email",
            "tel",
            "number",
            "url",
            "search"
          ].forEach( function( value ) {
            test( "setting via " + value + " reflects to property", function() {
              var pairedInput = document.createElement( "paired-input" );

              pairedInput.setAttribute( "type", value );

              expect( pairedInput )
                .to.have.property( "type" )
                .that.equals( value )
                .and.equals( pairedInput.getAttribute( "type" ) );
            });
          });
        });

        suite( "set acceptable values via property", function() {
          [
            "text",
            "password",
            "email",
            "tel",
            "number",
            "url",
            "search"
          ].forEach( function( value ) {
            test( "can be set via property to " + value, function() {
              var pairedInput = document.createElement( "paired-input" );

              pairedInput.type = value;

              expect( pairedInput )
                .to.have.property( "type" )
                .that.equals( value )
                .and.equals( pairedInput.getAttribute( "type" ) );
            });
          });

          [
            "text",
            "password",
            "email",
            "tel",
            "number",
            "url",
            "search"
          ].forEach( function( value ) {
            test( "setting via " + value + " reflects to attribute", function() {
              var pairedInput = document.createElement( "paired-input" );

              pairedInput.type = value;

              expect( pairedInput.getAttribute( "type" ) )
                .to.be.a( "string" )
                .that.equals( value );
            });
          });
        });
      });

      suite( "placeholder", function() {
        test( "can be set via \"setAttribute\"", function() {
          var pairedInput = document.createElement( "paired-input" );

          pairedInput.setAttribute( "placeholder", "type-name" );

          expect( pairedInput.hasAttribute( "placeholder" ) ).to.equal( true );

          expect( pairedInput.getAttribute( "placeholder" ) )
            .to.be.a( "string" )
            .that.equals( "type-name" );

          expect( pairedInput )
            .to.have.property( "outerHTML" )
            .that.equals( "<paired-input placeholder=\"type-name\"></paired-input>" );
        });

        test( "can be removed via removeAttribute", function() {
          var pairedInput = document.createElement( "paired-input" );

          pairedInput.setAttribute( "placeholder", "something" );
          pairedInput.removeAttribute( "placeholder" );

          expect( pairedInput )
            .to.have.property( "outerHTML" )
            .that.is.a( "string" )
            .and.equals( "<paired-input type=\"text\"></paired-input>" );
        });

        test( "when set via setAttribute, placeholder value should reflect to shadowDom",
          function() {
            var pairedInput = document.createElement( "paired-input" );

            pairedInput.setAttribute( "placeholder", "type-name" );

            expect( pairedInput.$.primaryBox.getAttribute( "placeholder" ) )
              .to.be.a( "string" )
              .that.equals( "type-name" );

            expect( pairedInput.$.confirmBox.getAttribute( "placeholder" ) )
              .to.be.a( "string" )
              .that.equals( "Confirm " + "type-name" );

            // expect( elem.$.primaryBox ).has( "placeholder" ).equals( "set" )
            // expect( elem.$.confirmBox ).has( "placeholder" ).equals( "Confirm" + "set" )

        });

        test( "when set via property, placeholder value should reflect to shadowDom",
          function() {
            var pairedInput = document.createElement( "paired-input" );

            pairedInput.placeholder = "type-name";

            expect( pairedInput.$.primaryBox )
              .to.have.property( "placeholder" )
              .that.equals( "type-name" );

            expect( pairedInput.$.confirmBox )
              .to.have.property( "placeholder" )
              .that.equals( "Confirm type-name" );
          });
      });

      suite( "pattern", function() {
        test( "can be set via setAttribute", function() {
          var pairedInput = document.createElement( "paired-input" );

          pairedInput.setAttribute( "pattern", "regex" );

          expect( pairedInput.hasAttribute( "pattern" ) ).to.equal( true );

          expect( pairedInput.getAttribute( "pattern" ) )
            .to.be.a( "string" )
            .that.equals( "regex" );

          expect( pairedInput )
            .to.have.property( "outerHTML" )
            .that.equals( "<paired-input type=\"text\" pattern=\"regex\"></paired-input>" );
        });

        test( "can be removed via removeAttribute", function() {
          var pairedInput = document.createElement( "paired-input" );

          pairedInput.setAttribute( "pattern", "regex" );
          pairedInput.removeAttribute( "pattern" );

          expect( pairedInput )
            .to.have.property( "outerHTML" )
            .that.is.a( "string" )
            .and.equals( "<paired-input type=\"text\"></paired-input>" );
        });

        test( "setting via setAttribute reflects to property", function() {
          var pairedInput = document.createElement( "paired-input" );

          pairedInput.setAttribute( "pattern", "regex" );

          expect( pairedInput )
            .to.have.property( "pattern" )
            .that.equals( "regex" )
            .and.equals( pairedInput.getAttribute( "pattern" ) );
        });

        test( "can be set via property to pattern", function() {
          var pairedInput = document.createElement( "paired-input" );

          pairedInput.pattern = "regex";

          expect( pairedInput )
            .to.have.property( "pattern" )
            .that.equals( "regex" )
            .and.equals( pairedInput.getAttribute( "pattern" ) );

          expect( pairedInput )
            .to.have.property( "outerHTML" )
            .that.equals( "<paired-input type=\"text\" pattern=\"regex\"></paired-input>" );
        });

        test( "setting via property reflects to attribute", function() {
          var pairedInput = document.createElement( "paired-input" );

          pairedInput.pattern = "regex";

          expect( pairedInput.getAttribute( "pattern" ) )
            .to.be.a( "string" )
            .that.equals( "regex" );
        });
      });

      suite( "single-line", function() {
        test( "default value is false", function() {
          var pairedInput = document.createElement( "paired-input" );

          expect( pairedInput )
            .to.have.property( "singleLine" )
            .that.is.a( "boolean" )
            .and.equals( false );
        });

        test( "can be set via attribute", function() {
          var pairedInput = document.createElement( "paired-input" );

          pairedInput.setAttribute( "single-line", "" );

          expect( pairedInput.hasAttribute( "single-line" ) )
            .to.equal( true );

          expect( pairedInput.getAttribute( "single-line" ) )
            .to.be.a( "string" )
            .that.equals( "" );

          expect( pairedInput )
            .to.have.property( "outerHTML" )
            .that.is.a( "string" )
            .and.equals( "<paired-input type=\"text\" single-line></paired-input>" );
        });

        test( "can be removed via attribute", function() {
          var pairedInput = document.createElement( "paired-input" );

          pairedInput.setAttribute( "single-line", "" );
          pairedInput.removeAttribute( "single-line" );

          expect( pairedInput )
            .to.have.property( "outerHTML" )
            .that.is.a( "string" )
            .and.equals( "<paired-input type=\"text\"></paired-input>" );
        });

        test( "can be set via property to single-line", function() {
          var pairedInput = document.createElement( "paired-input" );

          pairedInput.singleLine = true;

          expect( pairedInput )
            .to.have.property( "singleLine" )
            .that.is.a( "boolean" )
            .and.equals( true );

          expect( pairedInput )
            .to.have.property( "outerHTML" )
            .that.is.a( "string" )
            .and.equals( "<paired-input type=\"text\" single-line></paired-input>" );
        });
      });
      // Tests for required
      suite( "required", function() {
        test( "default value is false", function() {
          var pairedInput = document.createElement( "paired-input" );

          expect( pairedInput )
            .to.have.property( "required" )
            .that.is.a( "boolean" )
            .and.equals( false );
        });

        test( "can be set via setAttribute", function() {
          var pairedInput = document.createElement( "paired-input" );

          pairedInput.setAttribute( "required", "" );

          expect( pairedInput.hasAttribute( "required" ) )
            .to.equal( true );

          expect( pairedInput.getAttribute( "required" ) )
            .to.be.a( "string" )
            .and.equals( "" );

          expect( pairedInput )
            .to.have.property( "outerHTML" )
            .that.is.a( "string" )
            .and.equals( "<paired-input type=\"text\" required=\"\"></paired-input>" );
        });

        test( "setting via setAttribute reflects to property", function() {
          var pairedInput = document.createElement( "paired-input" );

          pairedInput.setAttribute( "required", "" );

          expect( pairedInput )
            .to.have.property( "required" )
            .and.equals( true );
        });

        test( "can be removed via removeAttribute", function() {
          var pairedInput = document.createElement( "paired-input" );

          pairedInput.setAttribute( "required", "" );
          pairedInput.removeAttribute( "required" );

          expect( pairedInput )
            .to.have.property( "outerHTML" )
            .that.is.a( "string" )
            .and.equals( "<paired-input type=\"text\"></paired-input>" );
        });

        test( "can be set via property to required", function() {
          var pairedInput = document.createElement( "paired-input" );

          pairedInput.required = true;

          expect( pairedInput )
            .to.have.property( "required" )
            .that.is.a( "boolean" )
            .and.equals( true );
        });

        test( "setting via property reflects to attribute", function() {
          var pairedInput = document.createElement( "paired-input" );

          pairedInput.required = true;

          expect( pairedInput.hasAttribute( "required" ) )
            .to.be.a( "boolean" )
            .that.equals( true );
        });

        test( "can be removed via property", function() {
          var pairedInput = document.createElement( "paired-input" );

          pairedInput.required = true;
          pairedInput.required = false;

          expect( pairedInput.hasAttribute( "required" ) )
            .to.be.a( "boolean" )
            .that.equals( false );
        });
      });

      suite( "disabled", function() {
        test( "can be set via attribute", function() {
          var pairedInput = document.createElement( "paired-input" );

          pairedInput.setAttribute( "disabled", "" );

          expect( pairedInput.hasAttribute( "disabled" ) ).to.equal( true );
          expect( pairedInput.getAttribute( "disabled" ) )
            .to.be.a( "string" )
            .and.equals( "" );

          expect( pairedInput )
            .to.have.property( "outerHTML" )
            .that.is.a( "string" )
            .and.equals( "<paired-input type=\"text\" disabled=\"\"></paired-input>" );
        });

        test( "can be removed via attribute", function() {
          var pairedInput = document.createElement( "paired-input" );

          pairedInput.setAttribute( "disabled", "" );
          pairedInput.removeAttribute( "disabled" );

          expect( pairedInput )
            .to.have.property( "outerHTML" )
            .that.is.a( "string" )
            .and.equals( "<paired-input type=\"text\"></paired-input>" );
        });

        test( "should not be able to input value with disable tag present", function() {
          // pairedInput is defined as firstInput requires pairedInput and is used twice
          var pairedInput = document.createElement( "paired-input" ),
            firstInput = pairedInput.shadowRoot.getElementsByTagName( "input" )[ 0 ];

          document.createElement( "paired-input" ).setAttribute( "disabled", "" );
          firstInput.value = "random value";

          expect( firstInput )
            .to.have.property( "value" )
            .to.be.empty();
        });
      });
      // Tests for valid
      suite( "valid", function() {
        test( "has default value: false", function() {
          expect( document.createElement( "paired-input" ) )
            .to.have.property( "valid" )
            .that.is.a( "boolean" )
            .and.equals( false );
        });

        test( "is true when input values match", function() {
          var pairedInput = document.createElement( "paired-input" ),
              genericValue = "random test value";

          pairedInput.shadowRoot.getElementsByTagName( "input" )[ 0 ].value = genericValue;
          pairedInput.shadowRoot.getElementsByTagName( "input" )[ 1 ].value = genericValue;

          expect( pairedInput )
            .to.have.property( "valid" )
            .that.is.a( "boolean" )
            .and.equals( true );
        });
      });
      // Tests for value
      suite( "value", function() {
        test( "returns undefined when element is not valid", function() {
          var pairedInput = document.createElement( "paired-input" );

          pairedInput.shadowRoot.getElementsByTagName( "input" )[ 0 ].value = "first value";
          pairedInput.shadowRoot.getElementsByTagName( "input" )[ 1 ].value = "second value";

          expect( pairedInput )
            .to.have.property( "value" )
            .to.be.undefined();
        });

        test( "returns value if both input fields match", function() {
          var pairedInput = document.createElement( "paired-input" ),
              genericValue = "random test value";

          pairedInput.shadowRoot.getElementsByTagName( "input" )[ 0 ].value = genericValue;
          pairedInput.shadowRoot.getElementsByTagName( "input" )[ 1 ].value = genericValue;

          expect( pairedInput )
            .to.have.property( "value" )
            .to.be.a( "string" )
            .that.equals( genericValue );
        });

        test( "set value of both input fields via property", function() {
          var pairedInput = document.createElement( "paired-input" ),
              genericValue = "random test value";

          pairedInput.value = genericValue;

          expect( pairedInput.shadowRoot.getElementsByTagName( "input" )[ 0 ] )
            .to.have.property( "value" )
            .to.be.a( "string" )
            .that.equals( genericValue );

          expect( pairedInput.shadowRoot.getElementsByTagName( "input" )[ 1 ] )
            .to.have.property( "value" )
            .to.be.a( "string" )
            .that.equals( genericValue );
        });
      });
    });
  });
})( window, document, window.chai );
