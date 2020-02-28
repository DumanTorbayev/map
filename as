var data = Highcharts.geojson(Highcharts.maps['countries/kz/kz-all']),
    separators = Highcharts.geojson(Highcharts.maps['countries/kz/kz-all'], 'mapline'),
    cities = Highcharts.geojson(Highcharts.maps['countries/kz/kz-all'], 'mappoint'),

    small = $('#container').width() < 400;

// Set drilldown pointers
$.each(data, function (i) {
    this.drilldown = this.properties['hc-key'];
    this.myKey = 12;
});

console.log(data);
console.log(cities);

// Instantiate the map
Highcharts.mapChart('container', {
    chart: {
        events: {
            drilldown: function (e) {
                if (!e.seriesOptions) {
                    var chart = this,
                        mapKey = 'js/' + e.point.drilldown + '-all',
                        // Handle error, the timeout is cleared on success
                        fail = setTimeout(function () {
                            if (!Highcharts.maps[mapKey]) {
                                chart.showLoading('<i class="icon-frown"></i> Failed loading ' + e.point.name);
                                fail = setTimeout(function () {
                                    chart.hideLoading();
                                }, 1000);
                            }
                        }, 3000);

                    console.log(mapKey);

                    // Show the spinner
                    chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>'); // Font Awesome spinner

                    // Load the drilldown map
                    $.getScript('https://code.highcharts.com/mapdata/' + mapKey + '.js', function () {

                        data = Highcharts.geojson(Highcharts.maps[mapKey]);

                        // Set a non-random bogus value
                        $.each(data, function (i) {
                            this.value = i;
                        });

                        // Hide loading and add series
                        chart.hideLoading();
                        clearTimeout(fail);
                        chart.addSeriesAsDrilldown(e.point, {
                            name: e.point.name,
                            data: data,
                            dataLabels: {
                                enabled: true,
                                format: '{point.name}'
                            }
                        });
                    });
                }

                this.setTitle(null, { text: e.point.name });
            },
            drillup: function () {
                this.setTitle(null, { text: '' });
            }
        }
    },

    title: {
        text: ''
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

    legend: {
        enabled: false
    },

    colorAxis: {
        min: 0,
        minColor: '#172747',
        maxColor: '#172747'
    },

    mapNavigation: {
        enabled: false,
        buttonOptions: {
            verticalAlign: 'bottom'
        }
    },

    plotOptions: {
        map: {
            states: {
                hover: {
                    color: '#03A9F4'
                }
            }
        }
    },

    series: [{
        data: data,
        name: 'Казахстан',
        color: 'rgb(23,39,71)',
        dataLabels: {
            enabled: true,
            useHTML: true,
            allowOverlap: true,
            formatter() {
                if (1) {
                    return '<img src="https://www.highcharts.com/samples/graphics/sun.png"/>'
                } else {
                    return '<img src="https://www.highcharts.com/samples/graphics/snow.png"/>'
                }
            },
        },
    }, {
        type: 'mappoint',
        data: cities,
        color: 'silver',
        enableMouseTracking: false,
        animation: {
            duration: 500
        }
    }],

    drilldown: {
        activeDataLabelStyle: {
            color: 'red',
            textDecoration: 'none',
            textOutline: '1px #000000'
        },
        drillUpButton: {
            relativeTo: 'spacingBox',
            position: {
                x: 0,
                y: 50
            }
        }
    },

    tooltip: {
        enabled: true,
        outside: true,
    }
});
