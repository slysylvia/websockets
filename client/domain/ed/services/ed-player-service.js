import EDTrack from "domain/ed/objects/media/EDTrack";
import EDCollection from "domain/ed/storage/EDCollection";

import edAnalyticsService from "domain/ed/analytics/ed-analytics-service";
import edConnectionService from "domain/ed/services/ed-connection-service";
import edDiscoverService from "domain/ed/services/ed-discover-service";
import edDataService from "domain/ed/services/ed-data-service";

import EventEmitter from "domain/lib/event/EventEmitter";
import createEvent from "domain/lib/event/create-event";

var
  queue = [],
  currentTrack = null,
  emitter = new EventEmitter([ "play", "pause", "stop", "skip" ]),
  audio = new Audio() || document.createElement( "audio" ),
  hasScrubbed = false,
  edPlayerService,
  rateCurrentlyPlaying,
  tracksCollection,
  currentIndexPlaying = 0,
  currentArtist = null,
  hasScrubbedHandler,
  trackEndedHandler;

// helpers
hasScrubbedHandler = function( event ) {
  if ( !hasScrubbed ) {
    hasScrubbed = true;
  }

  return hasScrubbed;
};

trackEndedHandler = function() {
  if ( !hasScrubbed ) {
    edAnalyticsService.send( "completedListen", {
      trackId: currentTrack.id
    });
  }
};

rateCurrentlyPlaying = function( number ) {
  if ( number != null && currentTrack ) {
    return currentTrack.rate( number )
      .then(function( response ) {
        // adding in fake ID for now
        edAnalyticsService.send( "rate", {
          trackId: currentTrack.id,
          timecode: audio.currentTime,
          rating: number
        });

        return response;
      });
  }
};

// init audio element
audio.setAttribute( "id", "hiddenAudioPlayer" );
audio.setAttribute( "preload", "auto" );

audio.style.display = "none";
audio.style.visibility = "hidden";

// TODO where to unbind this?
audio.addEventListener( "seeked", hasScrubbedHandler );
audio.addEventListener( "ended", trackEndedHandler );

export default edPlayerService = {
  get emitter() {
    return emitter;
  },

  get currentStats() {
    return {
      playing: currentTrack,
      currentArtist: currentArtist,
      time: this.formattedTime,
      hours: this.currentHours,
      minutes: this.currentMinutes,
      seconds: this.currentSeconds,
      length: this.trackLength
    };
  },

  get queue() {
    return queue;
  },

  get isPlaying() {
    return !audio.paused;
  },

  get isPaused() {
    return audio.paused && !!audio.src;
  },

  get isStopped() {
    return audio.paused && !audio.src;
  },

  get currentTime() {
    if ( this.isPlaying || this.isPaused ) {
      return audio.currentTime;
    }

    return 0;
  },

  set currentTime( value ) {
    return audio.currentTime;
  },

  get currentSeconds() {
    return Math.floor( this.currentTime % 60 );
  },

  get currentMinutes() {
    return Math.floor( this.currentTime / 60 );
  },

  get currentHours() {
    return Math.floor( 60 / this.currentTime );
  },

  get formattedTimeDisplay() {
    return this.formattedTime + " / " + this.formattedLength;
  },

  get formattedTime() {
    var ss = this.currentSeconds,
      mm = this.currentMinutes,
      hh = this.currentHours;
    ss = ss < 10 ? "0" + ss : ss;
    mm = mm < 10 ? "0" + mm : mm;
    hh = hh < 10 ? "0" + hh : hh;

    if ( this.isPlaying || this.isPaused ) {
      //if ( hh !== "00" ) {
      //  return `${ hh }:${ mm }:${ ss }`;
      //}
      return `${ mm }:${ ss }`;
    }

    return "00:00";
  },

  get formattedLength() {
    return this.formatTime( this.trackLength );
  },

  get trackLength() {
    if ( currentTrack != null ) {
      return audio.duration;
    }

    return 0;
  },

  // To be removed once integrated with player service
  formatTime: function( time ) {
    var ss = Math.floor( time % 60 ),
      mm = Math.floor( time / 60 );
    ss = ss < 10 ? "0" + ss : ss;
    mm = mm < 10 ? "0" + mm : mm;

    return mm + ":" + ss;
  },

  getEDTrack: function( tracks, currentIndex ) {
    return tracks.get( currentIndex )
      .then( edTrack => {
        return edDataService.getArtistById( edTrack.profileId, 10 )
          .then( edArtist => {
            currentArtist = edArtist;

            this.playTrack( edTrack );

            return edArtist;
          });
      });
  },

  playTrack: function( edTrack ) {
    if ( !edTrack instanceof EDTrack ) {
      throw new TypeError( "Track is not an EDTrack object" );
    }

    // playing same track toggles the play pause events
    if ( currentTrack != null && edTrack === currentTrack ) {
      if ( this.isPlaying ) {
        return this.pause();
      }

      if ( this.isPaused ) {
        return this.play();
      }
    }

    currentTrack = edTrack;

    return edTrack.getUrl()
      .then(( response ) => {
        audio.src = response.data.url;
        audio.play();

        this.emitter.dispatch( createEvent( "playerUpdate", {
          detail: {
            type: "play"
          }
        }));

        edAnalyticsService.send( "play", {
          trackId: currentTrack.id,
          timecode: currentTrack.currentTime
        });

        return response;
      });
  },

  play: function( content ) {
    if ( content == null && this.isPaused && !!audio.src ) {
      audio.play();
      return true;
    }

    // Do content type check, call specific play method
    if( content instanceof EDTrack ) {
      return this.playSong( content );
    }
  },

  pause: function() {
    this.emitter.dispatch( createEvent( "playerUpdate", {
      detail: {
        type: "pause"
      }
    }));

    audio.pause();

    edAnalyticsService.send( "pause", {
      trackId: currentTrack.id,
      timecode: audio.currentTime
    });

    return this.isPaused;
  },

  stop: function() {
    if ( this.isPlaying ) {
      audio.pause();
      audio.removeAttribute( "src" );
      currentTrack = null;
    }

    edAnalyticsService.send( "quit", {
      trackId: currentTrack.id,
      timecode: audio.currentTime,
      action: "stop"
    });
    return true;
  },

  scrubTo: function( value ) {
    var scrubFrom = currentTrack.currentTime;
    audio.currentTime = value;

    hasScrubbed = true;

    edAnalyticsService.send( "scrub", {
      trackId: currentTrack.id,
      timeStart: scrubFrom,
      timeEnd: value
    });
  },

  enqueue: function( edTrack ) {
    return this.queue.push( edTrack );
  },

  enqueueNext: function( edTrack ) {
    return this.queue.unshift( edTrack );
  },

  dequeue: function() {
    return this.queue.shift();
  },

  next: function() {
    if ( this.queue.length ) {
      if ( this.isPlaying || this.isPaused ) {
        audio.pause();
      }

      edAnalyticsService.send( "quit", {
        trackId: currentTrack.id,
        timecode: audio.currentTime,
        action: "skip"
      });

      return this.play( this.dequeue() );
    }
  },

  skipTo: function( index ) {
    var i, len = this.queue.length;

    if ( this.queue.length ) {
      for ( i = 0; i < len; i++ ) {
        if ( i === index ) {
          return this.play( this.queue[ i ] );
        }
      }
    }
  },

  rateSong: function( number ) {
    return rateCurrentlyPlaying( number );
  },

  startMusicDiscovery: function( type ) {
    return edDiscoverService.getDiscoverTrackList( type )
      .then(( trackIds ) => {
        tracksCollection = new EDCollection( EDTrack.MODEL_TYPE, trackIds );

        this.queueTracksAndPlay( tracksCollection );

        return trackIds;
      })
      .catch(( error ) => {
        console.warn( "Error getting tracks in player service" );
        console.error( error );
        throw error;
      });
  },

  queueTracksAndPlay: function( tracks, show ) {
    if ( show ) {
      document.getElementById( "main-player-wrapper" ).setAttribute( "class", "active" );
      document.getElementById( "mini-player" ).setAttribute( "class", "hidden" );
    }

    console.log( "tracks", tracks );
    return this.getEDTrack( tracks, currentIndexPlaying );
  }
};

// TODO remove debug
window.playerService = edPlayerService;
window.edDiscoverService = edDiscoverService;
