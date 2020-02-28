Highcharts.getJSON('js/kz-all.geo.json', function (geojson) {

    let region = Highcharts.geojson(geojson, 'map');
    let cities = Highcharts.geojson(geojson, 'mappoint');
    let regionsArr = region.filter(item => item.properties.id);// Удаление пустого объекта из массива

    let dataAttrContainer = document.querySelector('#container');
    let dataAttr = dataAttrContainer.dataset.mapProps;
    let dataAttrObj = JSON.parse(dataAttr);

    for(let key in dataAttrObj) {
        console.log(dataAttrObj[key]);

        regionsArr.forEach(function (obl) {
            let props = obl.properties;

            obl.dataLabels = {
                useHTML: true,
                x: -5,
                formatter() {
                    return
                },
            };

            /*if(obl.properties.id === 'sko') {
                obl.dataLabels = {
                    useHTML: true,
                    formatter() {
                        return `${obl.properties.regionname}<br>`;
                    },
                    y: -20,
                    x: 25
                }
            } else if (obl.properties.id === 'akm') {
                obl.dataLabels = {
                    useHTML: true,
                    formatter() {
                        return `${obl.properties.regionname}<br>`;
                    },
                    y: -15,
                    x: 15
                }
            } else if (obl.properties.id === 'kyz') {
                obl.dataLabels = {
                    useHTML: true,
                    formatter() {
                        return `${obl.properties.regionname}<br>`;
                    },
                    y: -10,
                    x: -5
                }
            } else if (obl.properties.id === 'tur') {
                obl.dataLabels = {
                    useHTML: true,
                    formatter() {
                        return `${obl.properties.regionname}<br>`;
                    },
                    y: -40,
                    x: -5
                }
            }*/
        });
    };


    cities.forEach(function (city) {
        city.dataLabels = {
            useHTML: true,
            formatter() {
                return `${city.properties.regionname}<br>`;
            }
        };
    });

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
            "data": region,
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
        }, {
            "name": 'Cities',
            "type": 'mappoint',
            "allAreas": false,
            "cursor": 'pointer',
            "data": cities,
            "color": '#03A9F4',
            "className": 'city-name',
            "index": 3,
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
        }],
        "tooltip": {
            //"headerFormat": '<span style="font-size: 14px; padding-bottom: 10px;">{point.properties.regionname}</span><br/>',
            //"pointFormat": '{point.properties.datastat}',
            formatter: function () {
                return this.point.properties.regionname + '<br>' + this.point.properties.datastat;
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

