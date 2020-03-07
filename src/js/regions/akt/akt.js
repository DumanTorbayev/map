function merge(array1, array2) {
    array1.forEach(function (item, i) {
        let props = item['properties'];
        let id = props['id'];

        if (array2[id] === undefined) {
            return;
        }

        if (array2[id]['regionname'] !== undefined) {
            array1[i]['properties']['regionname'] = array2[id]['regionname'];
        }

        if (array2[id]['datastat'] !== undefined) {
            array1[i]['properties']['datastat'] = array2[id]['datastat'];
        }

        if (array2[id]['dataImg'] !== undefined) {
            array1[i]['properties']['dataImg'] = array2[id]['dataImg'];
        }

        if (array2[id]['drilldownPath'] !== undefined) {
            array1[i]['properties']['drilldownPath'] = array2[id]['drilldownPath'];
        }
    });

    return array1;
}

function printAreasName(areasArray) {
    areasArray.forEach(function (item) {
        let images = printImages(item.properties.dataImg);

        item.dataLabels = {
            useHTML: true,
            y: -5,
            formatter() {
                return `${item.properties.name}<br><div class="data-img-wrap">${images}</div>`;
            },
        };

        if (item.properties.id === 'Alginskiy') {
            item.dataLabels = {
                useHTML: true,
                y: -5,
                x: -45,
                formatter() {
                    return `${item.properties.name}<br><div class="data-img-wrap">${images}</div>`;
                },
            };
        }
    })
}

function printRuralCounties(RuralCountiesArray) {
    RuralCountiesArray.forEach(function (city, i) {
        let images = printImages(city.properties.dataImg);

        city.dataLabels = {
            useHTML: true,
            formatter() {
                return `${city.properties.regionname}<br><div class="data-img-wrap">${images}</div>`;
            }
        };
    });
}

function printImages(imageObject) {
    if (imageObject === undefined || !Array.isArray(imageObject) || imageObject.length === 0) {
        return '';
    }

    let result = '';

    imageObject.forEach(function (item) {
        if (item === '') {
            return;
        }
        result += `<img class="data-img" src="${item}" alt="img">`;
    });

    return result;
}

function setRegionsDrilldown(areasArray) {
    areasArray.forEach(function (item) {
        item.drilldown = item.properties.id;
    })
}

function setPointsDrilldown(RuralCountiesArray) {
    RuralCountiesArray.forEach(function (item) {
        item.drilldown = item.properties.id;
    })
}

Highcharts.getJSON('src/js/regions/akt/akt.geo.json', function (geojson) {

    let areas = Highcharts.geojson(geojson, 'map');
    let ruralCounties = Highcharts.geojson(geojson, 'mappoint');

    let dataAttrContainer = document.querySelector('#container');
    let dataAttr = dataAttrContainer.dataset.mapProps;
    let dataAttrObj = {};
    if (dataAttr !== undefined && dataAttr !== '') {
        dataAttrObj = JSON.parse(dataAttr);
    }

    let mergedRegionsArray = merge(areas, dataAttrObj);
    let mergedCitiesArray = merge(ruralCounties, dataAttrObj);


    printAreasName(mergedRegionsArray);
    printRuralCounties(mergedCitiesArray);
    setRegionsDrilldown(mergedRegionsArray);
    setPointsDrilldown(mergedCitiesArray);

    Highcharts.mapChart('container', {
        "chart": {
            "height": '40%',
            events: {
                drilldown: function (e) {
                    if (e.point.properties.name !== '') {
                        window.location.href = `${e.point.properties.drilldownPath}`;
                    }
                }
            }
        },

        "title": {
            "text": ''
        },

        mapNavigation: {
            "enabled": true,
            "buttonOptions": {
                "verticalAlign": 'bottom',
                "align": 'right',
                "theme": {
                    "fill": '#00B0C7',
                    "stroke": '#FEC91B',
                },
                "style": {
                    "color": '#000'
                }
            }
        },

        "legend": false,

        "series": [{
            "type": 'map',
            "label": true,
            "cursor": 'pointer',
            "data": areas,
            "color": '#00B0C7',
            "borderColor": '#FEC91B',
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
                    "fontSize": '8px',
                    "fontWeight": '600',
                },
            },
        }, {
            "name": 'RuralCounties',
            "type": 'mappoint',
            "allAreas": false,
            "cursor": 'pointer',
            "data": ruralCounties,
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
                    "fontSize": '9px',
                    "fontWeight": '600',
                }
            }
        }],

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
        },

        drilldown: {
            activeDataLabelStyle: {
                color: '#000',
                textDecoration: 'none',
            }
        }
    });
});