app.controller(
  "ReportController",
  function ($scope, $http, $translate, $rootScope, $location) {
    $scope.listYear = [];
    $scope.violationsPosts = [];
    $scope.numberReport = [];
    $scope.listCountAcc = [];
    $scope.topPostsLikes = [];
    $scope.totalPosts = [];
    $scope.posts = {};
    var url = "http://localhost:8080"
    $http
      .get(url + "/admin/reportListYear")
      .then(function (response) {
        var listYear = response.data;
        $scope.listYear = listYear;
      })
      .catch(function (error) {
        console.log(error);
      });

    var ViolationsPosts = $http
      .get(url + "/admin/reportViolationsPosts")
      .then(function (response) {
        $scope.violationsPosts = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    var NumberReport = $http
      .get(url + "/admin/reportNumberReport")
      .then(function (response) {
        $scope.numberReport = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    var age = $http.get(url + "/admin/reportAge").then(function (response) {
      $scope.age = response.data;
    });

    var age2 = $http.get(url + "/admin/reportAge2").then(function (response) {
      $scope.age2 = response.data;
    });

    var age3 = $http.get(url + "/admin/reportAge3").then(function (response) {
      $scope.age3 = response.data;
    });

    var listAcc = $http
      .get(url + "/admin/reportlistCountAcc")
      .then(function (response) {
        $scope.listCountAcc = response.data;
      });

    $http
      .get(url + "/admin/reporttopPostsLikes")
      .then(function (response) {
        var topPostsLikes = response.data;
        $scope.topPostsLikes = topPostsLikes;
      })
      .catch(function (error) {
        console.log(error);
      });

    $http
      .get(url + "/admin/reportTotalPosts")
      .then(function (response) {
        $scope.totalPosts = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });

      $scope.detail = function(postId){
     
        $http.get(url + '/admin/report/detail/' + postId)
              .then(function (response) {
                  $scope.posts = response.data;
              })
              .catch(function (error) {
                  console.log(error);
              });
              
              $("#exampleModal").modal("show");
      }
    //Tạo biểu đồ

    //Biểu đồ 1
    var chart1;
    var chartOptions = {
      series: [
        {
          name: "Số lượt tố cáo",
          data: [],
        },
        {
          name: "Số bài viết vi phạm",
          data: [],
        },
      ],
      chart: {
        type: "bar",
        height: 440,
        offsetX: -15,
        toolbar: {
          show: true,
        },
        foreColor: "#adb0bb",
        fontFamily: "inherit",
        sparkline: {
          enabled: false,
        },
      },
      colors: ["#5D87FF", "#49BEFF"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "75%",
          borderRadius: [6],
          borderRadiusApplication: "end",
          borderRadiusWhenStacked: "all",
        },
      },
      markers: {
        size: 0,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        borderColor: "rgba(0,0,0,0.1)",
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: false,
          },
        },
      },
      xaxis: {
        type: "category",
        categories: [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          " Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ],
        labels: {
          style: {
            cssClass: "grey--text lighten-2--text fill-color",
          },
        },
      },
      yaxis: {
        show: true,
        min: 0,
        max: 20,
        tickAmount: 4,
        labels: {
          style: {
            cssClass: "grey--text lighten-2--text fill-color",
          },
        },
      },
      stroke: {
        show: true,
        width: 3,
        lineCap: "butt",
        colors: ["transparent"],
      },
      tooltip: {
        theme: "light",
      },
      responsive: [
        {
          breakpoint: 600,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 3,
              },
            },
          },
        },
      ],
    };
    chart1 = new ApexCharts(document.querySelector("#chart"), chartOptions);
    chart1.render();

    //Biểu đồ 2
    var chart2;
    var breakup = {
      color: "#adb5bd",
      series: [],
      labels: ["18 - 25 tuổi", "25 - 35 tuổi", "Trên 35 tuổi"],
      chart: {
        width: 345,
        type: "donut",
        fontFamily: "Plus Jakarta Sans, sans-serif",
        foreColor: "#adb0bb",
      },
      plotOptions: {
        pie: {
          startAngle: 0,
          endAngle: 360,
          donut: {
            size: "5%",
          },
        },
      },
      stroke: {
        show: true,
      },

      dataLabels: {
        enabled: true,
      },

      legend: {
        show: true,
      },
      colors: ["#439DF6", "#A2BD37", "#EF5D31"],

      responsive: [
        {
          breakpoint: 991,
          options: {
            chart: {
              width: 150,
            },
          },
        },
      ],
      tooltip: {
        theme: "dark",
        fillSeriesColor: false,
      },
    };
    chart2 = new ApexCharts(document.querySelector("#breakup"), breakup);
    chart2.render();

    //Biểu đồ 3
    var chart3;
    var earning = {
      chart: {
        id: "sparkline3",
        type: "area",
        height: 180,
        sparkline: {
          enabled: true,
        },
        group: "sparklines",
        fontFamily: "Plus Jakarta Sans', sans-serif",
        foreColor: "#adb0bb",
      },
      series: [
        {
          name: "Số lượng",
          color: "#49BEFF",
          data: [],
        },
      ],
      stroke: {
        curve: "smooth",
        width: 3,
      },
      fill: {
        colors: ["#f3feff"],
        type: "solid",
        opacity: 0.05,
      },
      markers: {
        size: 4,
      },
      tooltip: {
        theme: "dark",
        fixed: {
          enabled: true,
          position: "right",
        },
        x: {
          show: true,
        },
      },
      xaxis: {
        categories: [],
      },
    };
    chart3 = new ApexCharts(document.querySelector("#earning"), earning);
    chart3.render();

    Promise.all([ViolationsPosts, NumberReport, age, age2, age3, listAcc]).then(
      function () {
        //Biểu đồ 1
        var data = [];
        for (var i = 0; i < $scope.violationsPosts.length; i++) {
          data.push($scope.violationsPosts[i].violationPosts);
        }
        var data2 = [];
        for (var i = 0; i < $scope.numberReport.length; i++) {
          data2.push($scope.numberReport[i].numberReport);
        }
        chart1.updateSeries([{ data: data }, { data: data2 }]);

        //Biểu Đồ 2
        chart2.updateSeries([$scope.age, $scope.age2, $scope.age3]);

        //Biểu đồ 3
        var acc = [];
        var day = [];
        for (var i = 0; i < $scope.listCountAcc.length; i++) {
          acc.push($scope.listCountAcc[i].accountCount);
        }
        for (var i = 0; i < $scope.listCountAcc.length; i++) {
          day.push($scope.listCountAcc[i].day);
        }
        chart3.updateOptions({
          xaxis: {
            categories: day,
          },
          series: [
            {
              data: acc,
            },
          ],
        });
      }
    );

    $scope.onYear = function () {

      var getData1 = $http.get(url + "/admin/report/filterYearViolationsPosts/" + $scope.selectedYear.years).then(function (response) {
        $scope.violationsPosts = response.data;
      });

      var getData2 = $http.get(url + "/admin/report/filterYearReport/" + $scope.selectedYear.years).then(function (response) {
        $scope.numberReport = response.data;
      });

      Promise.all([getData1, getData2]).then(function () {
        var data = [];
        for (var i = 0; i < $scope.violationsPosts.length; i++) {
          data.push($scope.violationsPosts[i].violationPosts);
        }
        var data2 = [];
        for (var i = 0; i < $scope.numberReport.length; i++) {
          data2.push($scope.numberReport[i].numberReport);
        }

        chart1.updateSeries([{ data: data }, { data: data2 }]);
      });
    };

    //
  }
);
