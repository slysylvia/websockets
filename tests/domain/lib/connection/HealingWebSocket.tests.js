/*eslint-env mocha*/
( function( win, doc, System, sinon, expect ) {
  "use strict";

  suite( "HealingWebSocket", function() {
    var HealingWebSocket;

    suiteSetup( function( done ) {
      System.import( "domain/lib/connection/HealingWebSocket" )
        .then( function( imported ) {
          HealingWebSocket = imported.default;
          done();
        }, function( error ) {
          console.warn( "Could not import 'HealingWebSocket' for testing: ", error.message );
          console.error( error.stack );
          done( error );
        });
    });

    // Start Tests
    test( "starts in non-open state when created", function() {
      var hws = new HealingWebSocket( "wss://echo.websocket.org" );

      expect( hws )
        .to.have.property( "readyState" )
        .that.equals( WebSocket.CONNECTING );

      expect( hws )
        .to.have.property( "isOpen" )
        .that.equals( false );
    });

    test( "when websocket is closed, isOpen property is false", function() {
      var hws = new HealingWebSocket( "wss://echo.websocket.org" );

      if ( hws.readyState === WebSocket.CLOSED ) {
        expect( hws )
          .to.have.property( "isOpen" )
          .that.equals( false );
      }
    });

    test( "when websocket is closed, new websocket is opened", function() {
      var hws = new HealingWebSocket( "wss://echo.websocket.org" );

      if ( hws.readyState === WebSocket.CLOSED ) {
        expect( hws )
          .to.have.property( "isOpen" )
          .that.equals( true );
      }
    });

    test( "when websocket is open, isOpen property is true", function() {
      var hws = new HealingWebSocket( "wss://echo.websocket.org" );

      if ( hws.readyState === WebSocket.OPEN ) {
        expect( hws )
          .to.have.property( "isOpen" )
          .that.equals( true );
      }
    });

    test( "can send string", function( done ) {
      var hws = new HealingWebSocket( "wss://echo.websocket.org" ),
          strData = "string data";

      hws.on( "message", function( data ) {
        expect( data )
          .to.be.a( "string" )
          .and.equal( strData );

        done();
      });

      hws.send( strData );
    });

    test( "can send blob", function( done ) {
      var hws = new HealingWebSocket( "wss://echo.websocket.org" ),
          blobArray = [ "<a id=\"a\"><b id=\"b\">oh my blob</b></a>" ],
          blobData = new Blob( blobArray );

      hws.on( "message", function( data ) {
        expect( data )
          .to.be.an.instanceOf( Blob )
          .and.equal( blobData );

        done();
      });

      hws.send( blobData );
    });

    test( "can send array buffer", function( done ) {
      var hws = new HealingWebSocket( "wss://echo.websocket.org" ),
          arrayBufferLength = new ArrayBuffer( 256 );

      hws.on( "message", function( data ) {
        expect( data )
          .to.be.an.instanceOf( ArrayBuffer )
          .and.equal( arrayBufferLength );

        done();
      });

      hws.send( arrayBufferLength );
    });

    

    // End Tests
  });
})( window, document, window.System, window.sinon, window.chai.expect );
