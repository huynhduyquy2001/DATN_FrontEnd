app.controller('personalStatisticsController', function ($scope, $http, $translate, $rootScope, $location) {
    var Url = "http://localhost:8080";

    $scope.countorderperonal = [];
    var Url = "http://localhost:8080/personalStatistics";
    $http.get(Url)
        .then(function (response) {
            $scope.countorderperonal = response.data;
            console.log("Load dữ liệu" + response);

            var categories = [];
            var data = [];

            // Tạo mảng categories và data từ dữ liệu
            $scope.countorderperonal.forEach(function (item) {
                categories.push("Tháng " + (item[0])); // Cộng thêm 1 vào giá trị tháng
                data.push(parseFloat(item[1]));
            });
            console.log("Data: " + JSON.stringify(data));
            var option = {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: '',
                    align: 'left'
                },
                subtitle: {

                    align: 'left'
                },
                xAxis: {
                    categories: categories,
                },
                yAxis: [{ // Primary yAxis
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'Tổng số lượng đơn hàng',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    }
                }, { // Secondary yAxis
                    title: {
                        text: 'Precipitation',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        format: '{value} mm',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    opposite: true
                }],
                tooltip: {
                    shared: true
                },
                legend: {
                    align: 'left',
                    x: 80,
                    verticalAlign: 'top',
                    y: 60,
                    floating: true,
                    backgroundColor:
                        Highcharts.defaultOptions.legend.backgroundColor || // theme
                        'rgba(255,255,255,0.25)'
                },
                series: [{
                    name: 'Precipitation',
                    type: 'column',
                    yAxis: 1,
                    data: [27.6, 28.8, 21.7, 34.1, 29.0, 28.4, 45.6, 51.7, 39.0,
                        60.0, 28.6, 32.1],
                    tooltip: {
                        valueSuffix: ' mm'
                    }

                }, {
                    name: 'Tổng số lượng đơn hàng',
                    type: 'spline',
                    data: data,
                    tooltip: {
                        valueSuffix: ' đơn hàng'
                    }
                }]
            }
            Highcharts.chart('container', option);

            // biểu đồ 2 
            const chart = Highcharts.chart('container1', {
                title: {
                    text: 'Unemployment rates in engineering and ICT subjects, 2021',
                    align: 'left'
                },
                subtitle: {
                    text: 'Chart option: Plain | Source: ' +
                        '<a href="https://www.nav.no/no/nav-og-samfunn/statistikk/arbeidssokere-og-stillinger-statistikk/helt-ledige"' +
                        'target="_blank">NAV</a>',
                    align: 'left'
                },
                colors: [
                    '#4caefe',
                    '#3fbdf3',
                    '#35c3e8',
                    '#2bc9dc',
                    '#20cfe1',
                    '#16d4e6',
                    '#0dd9db',
                    '#03dfd0',
                    '#00e4c5',
                    '#00e9ba',
                    '#00eeaf',
                    '#23e274'
                ],
                xAxis: {
                    categories: categories
                },
                series: [{
                    type: 'column',
                    name: 'Unemployed',
                    borderRadius: 5,
                    colorByPoint: true,
                    data: data,
                    showInLegend: false
                }]
            });

            document.getElementById('plain').addEventListener('click', () => {
                chart.update({
                    chart: {
                        inverted: false,
                        polar: false
                    },
                    subtitle: {
                        text: 'Chart option: Plain | Source: ' +
                            '<a href="https://www.nav.no/no/nav-og-samfunn/statistikk/arbeidssokere-og-stillinger-statistikk/helt-ledige"' +
                            'target="_blank">NAV</a>'
                    }
                });
            });

            document.getElementById('inverted').addEventListener('click', () => {
                chart.update({
                    chart: {
                        inverted: true,
                        polar: false
                    },
                    subtitle: {
                        text: 'Chart option: Inverted | Source: ' +
                            '<a href="https://www.nav.no/no/nav-og-samfunn/statistikk/arbeidssokere-og-stillinger-statistikk/helt-ledige"' +
                            'target="_blank">NAV</a>'
                    }
                });
            });


        })
        .catch(function (error) {
            console.error("Lỗi: " + error);
        });

});