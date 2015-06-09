( function( polymer ) {
  "use strict";

  Promise.all([
    System.import( "domain/ed/services/ed-discover-service" )
  ]).then( function( imported ) {
    var
      discoverService = imported[ 0 ].default,
      router = document.querySelector( "#root-app-router" ),
      currentView = 1,
      chartNames = [ "most-tracks-rated-fan", "completed-listens-fan", "completed-listens-track", "highest-rated-track" ],
      updateChartClass = function( classesRemoveArray, classAdd, self ) {
        classesRemoveArray.forEach( function( classNumber ) {
          self.singleChartWrapper.classList.remove( classNumber );
          self.singleChartWrapper.classList.add( classAdd );

          if ( currentView === 4 ) {
            self.arrowLeft.classList.remove( "hidden" );
            self.arrowRight.classList.add( "hidden" );
          } else if ( currentView === 1 ) {
            self.arrowLeft.classList.add( "hidden" );
            self.arrowRight.classList.remove( "hidden" );
          } else if ( currentView === 2 || currentView === 3 ) {
            self.arrowLeft.classList.remove( "hidden" );
            self.arrowRight.classList.remove( "hidden" );
          }
        });
      },
      updateChartsViewHandler = function( event ) {
        var eventType = event.detail.name;

        if ( eventType === "moveLeft" ) {
          switch ( currentView ) {
            case 1:
              updateChartClass( [ "two", "three", "four" ], "one", this );
              currentView = 1;
              break;
            case 2:
              updateChartClass( [ "two", "three", "four" ], "one", this );
              currentView = 1;
              break;
            case 3:
              updateChartClass( [ "one", "three", "four" ], "two", this );
              currentView = 2;
              break;
            case 4:
              updateChartClass( [ "one", "two", "four" ], "three", this );
              currentView = 3;
              break;
            default:
              break;
          }
        }

        if ( eventType === "moveRight" ) {
          switch ( currentView ) {
            case 1:
              updateChartClass( [ "one", "three", "four" ], "two", this );
              currentView = 2;
              break;
            case 2:
              updateChartClass( [ "one", "two", "four" ], "three", this );
              currentView = 3;
              break;
            case 3:
              updateChartClass( [ "one", "two", "three" ], "four", this );
              currentView = 4;
              break;
            case 4:
              updateChartClass( [ "one", "two", "four" ], "four", this );
              currentView = 4;
              break;
            default:
              break;
          }
        }
      },
      resetChartViewHandler = function() {
        currentView = 1;
      };

    polymer( "ed-charts-view", {
      /* LIFECYCLE */
      ready: function() {
        this.singleChartWrapper = this.$[ "single-chart-wrapper" ];
        this.arrowLeft = this.$[ "arrow-left" ];
        this.arrowRight = this.$[ "arrow-right" ];

        this.chartElementsByName = {};

        Array.prototype.forEach.call( this.shadowRoot.querySelectorAll( "ed-single-chart" ), function( chartElement ) {
          this.chartElementsByName[ chartElement.chartIdentifier ] = chartElement;
        }, this );
      },
      attached: function() {
        router = router || document.querySelector( "#root-app-router" );

        this.handler = {
          updateChartView: updateChartsViewHandler.bind( this ),
          resetChartView: resetChartViewHandler.bind( this )
        };

        router.addEventListener( "state-change", this.handler.resetChartView );
        this.addEventListener( "chartsUpdate", this.handler.updateChartView );

        this.getEdChartObject();
        this.arrowLeft.classList.add( "hidden" );
      },
      detached: function() {
        router.removeEventListener( "state-change", this.handler.resetChartView );
        this.removeEventListener( "chartsUpdate", this.handler.updateChartView );
      },
      getEdChartObject: function() {
        var
          chartIndex = 0,
          maxIndex = chartNames.length,
          componentAssignment = function( edChart ) {
            if ( edChart.chartName in this.chartElementsByName ) {
              this.chartElementsByName[ edChart.chartName ].chartObject = edChart;

              console.dir( this.chartElementsByName[ edChart.chartName ] );
              console.dir( edChart );
            }

            return edChart;
          }.bind( this ),
          nextGet = function( nextIndex ) {
            return function( edChart ) {
              if ( nextIndex >= maxIndex ) {
                return componentAssignment( edChart );
              }

              return discoverService.getLeaderboardCharts( chartNames[ nextIndex ] )
                .then( componentAssignment )
                .then( nextGet( nextIndex + 1 ));
            };
          };

        return discoverService.getLeaderboardCharts( chartNames[ chartIndex ] )
          .then( componentAssignment )
          .then( nextGet( chartIndex + 1 ));
      },
      attributeChanged: function( attrName, oldValue, newValue ) {}
    });
  });
})( window.Polymer )
