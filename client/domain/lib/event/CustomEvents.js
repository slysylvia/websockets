/**
 *
 * @param name
 * @param descriptor
 * @returns {*|Event}
 * @constructor
 */

  // check if supported via try/catch
export default function( name, descriptor ) {
  descriptor = {};
  var event;

  try {
    if ( window.CustomEvent === undefined ) {
      throw "Dispatch was not called with proper Event object";
    }
  } catch ( err ) {
    console.log( err );
  }

  if ( window.CustomEvent === undefined ) {
    event = document.createEvent( "CustomEvent" );
    event.initCustomEvent( name, false, false, undefined );
  } else {
    event = new CustomEvent( name, descriptor );
  }

  return event;
}
