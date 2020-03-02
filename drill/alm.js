function printAreasName(areasArray) {
    areasArray.forEach(function (item) {
        item.dataLabels = {
            useHTML: true,
            formatter() {
                return `${item.properties.name}<br>`; // <div class="data-img-wrap">${images}</div>
            },
        };
    })
}

Highcharts.getJSON('alm.geo.json', function (geojson) {

    let areas = Highcharts.geojson(geojson, 'map');
    //let ruralСounties = Highcharts.geojson(geojson, 'mappoint');

    printAreasName(areas);

    Highcharts.mapChart('container', {
        "chart": {
            "height": 'auto',
        },

        "title": {
            "text": ''
        },

        "mapNavigation": {
            "enabled": true,
            "buttonOptions": {
                "verticalAlign": 'bottom',
                "align": 'right',
                "theme": {
                    "fill": '#172747',
                    "stroke": '#03A9F4',
                },
                "style": {
                    "color": '#fff'
                }
            }
        },

        "legend": false,

        "series": [{
            "type": 'map',
            "label": true,
            "cursor": 'pointer',
            "data": areas,
            "color": '#172747',
            "borderColor": '#03A9F4',
            "states": {
                "hover": {
                    "color": '#03A9F4'
                }
            },
            "dataLabels": {
                "enabled": true,
                "useHTML": true,
                "allowOverlap": true,
                "className": 'regions-name',
                "align": 'center',
                "style": {
                    "width": '90px',
                    "align": 'center',
                    "fontFamily": 'Segoe UI',
                    "fontSize": '9px',
                    "fontWeight": '600',
                    "color": '#ADC8FF',
                },
            },
        }, /*{
            "name": 'Cities',
            "type": 'mappoint',
            "allAreas": false,
            "cursor": 'pointer',
            "data": cities,
            "color": '#03A9F4',
            "className": 'city-name',
            "index.js": 3,
            "marker": {
                "radius": 4.5,
                "lineWidth": 2
            },
            "animation": false,
            "dataLabels": {
                "align": 'right',
                "verticalAlign": 'middle',
                "padding": 10,
                "style": {
                    "color": '#ADC8FF',
                    "fontSize": '9px',
                    "fontWeight": '600',
                }
            }
        }*/],
        "tooltip": {
            formatter: function () {
                return `${this.point.properties.name}<br>${this.point.properties.datastat}`;
            },
            "backgroundColor": 'rgba(64,64,64,0.9)',
            "borderWidth": 1,
            "borderColor": '#03A9F4',
            "borderRadius": 10,
            "padding": 15,
            "outside": true,
            "style": {
                "color": '#fff'
            },
        }
    });
});

