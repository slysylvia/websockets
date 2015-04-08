/*global suite, suiteSetup, test, console*/
( function( win, doc, System, sinon, expect ) {
  "use strict";

  suite( "EDCollection", function() {
    var EDCollection, iteratorSym;

    suiteSetup( function( done ) {
      System.import( "domain/ed/storage/EDCollection" )
      .then( function( imported ) {
        EDCollection = imported.default;
        iteratorSym = Object.getOwnPropertySymbols( new EDCollection( [ "ids", "type" ] ) )[0];

        done();
      }, function( error ) {
        console.warn( "Could not import 'EDCollection' for testing: ", error.message );
        console.error( error.stack );
        done( error );
      });
    });

// Tests begin
    suite( "Methods", function() {
      suite( "get( index )", function() {
        test( "returns a promise that resolves to the data for the id at the given index", function() {
          // returns this.ids[ index ]
          // expect to be an instance of EDDataObject
        });

        test( "only makes server call once", function() {
          // make request, get dataObject, ask for it again ...
          // expect edDataService.getDataObjectById( val ) to have callCount 1
        });
      });

      suite( "getRange( indexFrom, indexTo )", function() {
        test( "returns an array of promises for the ids located at the indexes", function() {
          // testing testing
        });
      });

      suite( "getAll()", function() {
        test( "returns an array of promises for all items in the array", function() {
          // testing testing testing
        });
      });

      suite( "iterator does things", function() {
        test( "the test", function() {

        });
      });
    });
  });
})( window, document, window.System, window.sinon, window.chai.expect );
