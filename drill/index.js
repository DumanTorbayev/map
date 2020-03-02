/*
TODO:
- Check data labels after drilling. Label rank? New positions?
*/

var data = Highcharts.geojson(Highcharts.maps['countries/kz/kz-all']),
    separators = Highcharts.geojson(Highcharts.maps['countries/kz/kz-all'], 'mapline'),
    // Some responsiveness
    small = $('#container').width() < 400;

console.log(data)

// Set drilldown pointers
$.each(data, function (i) {
    this.drilldown = this.properties['hc-key'];
    this.value = i; // Non-random bogus data
});

// Instantiate the map
Highcharts.mapChart('container', {
    chart: {
        events: {
            drilldown: function (e) {
                if (!e.seriesOptions) {
                    var chart = this,
                        mapKey = 'countries/us/' + e.point.drilldown + '-all',
                        // Handle error, the timeout is cleared on success
                        fail = setTimeout(function () {
                            if (!Highcharts.maps[mapKey]) {
                                chart.showLoading('<i class="icon-frown"></i> Failed loading ' + e.point.name);
                                fail = setTimeout(function () {
                                    chart.hideLoading();
                                }, 1000);
                            }
                        }, 3000);

                    // Show the spinner
                    chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>'); // Font Awesome spinner

                    // Load the drilldown map
                    $.getScript('http://localhost:63342/map/drill/alm.js?_ijt=i3fquhp15kkk9d7kp2lehdji8r', function () {
                        chart.hideLoading();
                        clearTimeout(fail);
                    });

                    this.setTitle(null, { text: e.point.name });
                }
            }
        }
    },

    title: {
        text: 'Highcharts Map Drilldown'
    },

    subtitle: {
        text: '',
        floating: true,
        align: 'right',
        y: 50,
        style: {
            fontSize: '16px'
        }
    },

    legend: small ? {} : {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },

    colorAxis: {
        min: 0,
        minColor: '#E6E7E8',
        maxColor: '#005645'
    },

    mapNavigation: {
        enabled: true,
        buttonOptions: {
            verticalAlign: 'bottom'
        }
    },

    plotOptions: {
        map: {
            states: {
                hover: {
                    color: '#EEDD66'
                }
            }
        }
    },

    series: [{
        data: data,
        name: 'USA',
        dataLabels: {
            enabled: true,
            format: '{point.properties.postal-code}'
        }
    }, {
        type: 'mapline',
        data: separators,
        color: 'silver',
        enableMouseTracking: false,
        animation: {
            duration: 500
        }
    }],

    drilldown: {
        activeDataLabelStyle: {
            color: '#FFFFFF',
            textDecoration: 'none',
            textOutline: '1px #000000'
        },
        drillUpButton: {
            relativeTo: 'spacingBox',
            position: {
                x: 0,
                y: 60
            }
        }
    }
});
