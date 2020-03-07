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

function printImages(imageObject) {
    if (imageObject === undefined || !Array.isArray(imageObject) || imageObject.length === 0) {
        return '';
    }

    let result = '';

    imageObject.forEach(function (item) {
        if (item === '') {
            return;
        }
        result += `<img class="data-img" src="${item}">`;
    });

    return result;
}

function printRegions(regionsArray) {
    regionsArray.forEach(function (obl, i) {
        let images = printImages(obl.properties.dataImg);

        obl.dataLabels = {
            useHTML: true,
            x: 10,
            y: -10,
            formatter() {
                return `${obl.properties.regionname}<br><div class="data-img-wrap">${images}</div>`;
            },
        };

        if (obl.properties.id === 'sko') {
            obl.dataLabels = {
                useHTML: true,
                formatter() {
                    return `${obl.properties.regionname}<br><div class="data-img-wrap">${images}</div>`;
                },
                y: -30,
                x: -10
            }
        } else if (obl.properties.id === 'akm') {
            obl.dataLabels = {
                useHTML: true,
                formatter() {
                    return `${obl.properties.regionname}<br><div class="data-img-wrap">${images}</div>`;
                },
                y: -25,
                x: 15
            }
        } else if (obl.properties.id === 'kyz') {
            obl.dataLabels = {
                useHTML: true,
                formatter() {
                    return `${obl.properties.regionname}<br><div class="data-img-wrap">${images}</div>`;
                },
                y: -10,
                x: -5
            }
        } else if (obl.properties.id === 'tur') {
            obl.dataLabels = {
                useHTML: true,
                formatter() {
                    return `${obl.properties.regionname}<br><div class="data-img-wrap">${images}</div>`;
                },
                y: -40,
                x: -5
            }
        } else if (obl.properties.id === 'kos') {
            obl.dataLabels = {
                useHTML: true,
                formatter() {
                    return `${obl.properties.regionname}<br><div class="data-img-wrap">${images}</div>`;
                },
                y: -40,
                x: -5
            }
        }
    });
}

function printCities(citiesArray) {
    citiesArray.forEach(function (city, i) {
        let images = printImages(city.properties.dataImg);

        city.dataLabels = {
            useHTML: true,
            formatter() {
                return `${city.properties.regionname}<br><div class="data-img-wrap">${images}</div>`;
            }
        };
    });
}

function setRegionsDrilldown(regionsArray) {
    regionsArray.forEach(function (item) {
        item.drilldown = item.properties.id;
    })
}

function setPointsDrilldown(citiesArray) {
    citiesArray.forEach(function (item) {
        item.drilldown = item.properties.id;
    })
}

const getScript = (source, callback) => {
    var script = document.createElement('script');
    var prior = document.getElementsByTagName('script')[0];
    script.async = 1;

    script.onload = script.onreadystatechange = (_, isAbort) => {
        if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
            script.onload = script.onreadystatechange = null;
            script = undefined;
            if (!isAbort) if (callback) callback();
        }
    };

    script.src = source;
    prior.parentNode.insertBefore(script, prior);
};

Highcharts.getJSON('src/js/kz-all.geo.json', function (geojson) {

    let region = Highcharts.geojson(geojson, 'map');
    let cities = Highcharts.geojson(geojson, 'mappoint');
    let regionsArr = region.filter(item => item.properties.id); // Удаление пустого объекта из массива

    let dataAttrContainer = document.querySelector('#container');
    let dataAttr = dataAttrContainer.dataset.mapProps;
    let dataAttrObj = {};
    if (dataAttr !== undefined && dataAttr !== '') {
        dataAttrObj = JSON.parse(dataAttr);
    }

    let mergedRegionsArray = merge(regionsArr, dataAttrObj);
    let mergedCitiesArray = merge(cities, dataAttrObj);

    printRegions(mergedRegionsArray);
    printCities(mergedCitiesArray);
    setRegionsDrilldown(mergedRegionsArray);
    setPointsDrilldown(mergedCitiesArray);


    Highcharts.mapChart('container', {
        chart: {
            height: '40%',
            events: {
                drilldown: function (e) {
                    console.log(this);
                    let regionsPath = e.point.properties.drilldownPath;

                    if (e.point.properties.regionname !== '') {
                        getScript(regionsPath);
                    }

                },
                drillup: function () {
                    this.setTitle(null, { text: 'asdfasd' });
                }
            }
        },

        title: {
            "text": ''
        },

        mapNavigation: {
            "enabled": false,
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

        legend: false,

        series: [{
            "type": 'map',
            "label": true,
            "cursor": 'pointer',
            "data": region,
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
                    "fontSize": '10px',
                    "fontWeight": '700',
                    fontFamily: 'Montserrat, sans-serif'
                },
            },
        }, {
            "name": 'Cities',
            "type": 'mappoint',
            "allAreas": false,
            "cursor": 'pointer',
            "data": cities,
            "color": '#00B0C7',
            "className": 'city-name',
            "index": 3,
            "marker": {
                "radius": 6,
                "lineWidth": 2
            },
            "animation": false,
            "dataLabels": {
                "align": 'right',
                "verticalAlign": 'middle',
                "padding": 10,
                x: -10,
                "style": {
                    "fontSize": '10px',
                    "fontWeight": '700',
                    fontFamily: 'Montserrat, sans-serif'
                }
            }
        }],

        tooltip: {
            formatter: function () {
                return `${this.point.properties.regionname}<br>${this.point.properties.datastat}`;
            },
            useHTML: true,
            "backgroundColor": 'rgba(64,64,64,0.9)',
            "borderWidth": 1,
            "borderColor": '#03A9F4',
            "borderRadius": 10,
            "padding": 10,
            "outside": true,
            "style": {
                "color": '#fff'
            },
        },

        drilldown: {
            activeDataLabelStyle: {
                color: '#000',
                textDecoration: 'none',
            },
            drillUpButton: {
                relativeTo: 'spaceBox',
                position: {
                    x: 0,
                    y: 0
                }
            }
        }
    });
});

