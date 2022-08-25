import * as echart from 'echarts';

import { getDocs } from 'firebase/firestore';
import { colRef } from './firebase-config'
import { saveCSV } from './dataprocessing';

//get Data from firestore

var myChart = echart.init(document.getElementById('main'));
var myChart2 = echart.init(document.getElementById('main2'));
var myChart3 = echart.init(document.getElementById('main3'));
var myChart4 = echart.init(document.getElementById('main4'));

function getData() {
  let collection = [];
  let data = [];
  let line = [];
  let point = [];

  let mata_0 = [];
  let mata_1 = [];
  let centerPoint = [];
  let lineCenterPoints = [];

  let total_x = 0, total_y = 0, total_rx = 0, total_ry = 0;
  let total_x_0 = 0, total_y_0 = 0, total_rx_0 = 0, total_ry_0 = 0;
  let counter_0 = 0, counter_1 = 0;



  getDocs(colRef)
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        data.push(doc.data())
      })
      data.forEach((elements) => {
        elements.data.forEach((element, index) => {
          point.push(element.x)
          point.push(element.y)
          point.push(element.rx)
          point.push(element.ry)
          point.push(element.trigger)
          line.push(point)
          point = [];


          if (element.trigger > 0) {
            total_x += element.x;
            total_y += element.y;
            total_rx += element.rx;
            total_ry += element.ry;
            counter_1++;
          } else {
            total_x_0 += element.x;
            total_y_0 += element.y;
            total_rx_0 += element.rx;
            total_ry_0 += element.ry;
            counter_0++;
          }

        })
        collection.push(line)
        line = [];

        mata_0.push(total_x_0 / counter_0);
        mata_0.push(total_y_0 / counter_0);
        mata_0.push(total_rx_0 / counter_0);
        mata_0.push(total_ry_0 / counter_0);
        mata_1.push(total_x / counter_1);
        mata_1.push(total_y / counter_1);
        mata_1.push(total_rx / counter_1);
        mata_1.push(total_ry / counter_1);
        centerPoint.push(mata_0);
        centerPoint.push(mata_1);
        lineCenterPoints.push(centerPoint);
        mata_0 = [];
        mata_1 = [];
        centerPoint = [];
      })
      console.log(collection);
      console.log(lineCenterPoints);

      let collection_points = []
      let col_point = []

      lineCenterPoints.forEach((element) => {
        col_point.push(element[0][0])
        col_point.push(element[0][1])
        col_point.push(element[0][2])
        col_point.push(element[0][3])
        col_point.push(0)
        collection_points.push(col_point)
        col_point = []
        col_point.push(element[1][0])
        col_point.push(element[1][1])
        col_point.push(element[1][2])
        col_point.push(element[1][3])
        col_point.push(1)
        collection_points.push(col_point)
        col_point = []
      })

      console.log(collection_points);

      // output CSV
      let csvTitle = 'ControllerData';
      let head = ['x','y','rx','ry','type'];
      let csvData = collection_points;

      saveCSV(csvTitle, head, csvData).then(() => {
        console.log('success');
      })
    })
    .catch(err => {
      console.log(err.message);
    })
}

//set option
function setGraphOption(coordinateSeries, chart, chartTitle) {
  chart.setOption({
    title: {
      text: chartTitle
    },
    xAxis: {},
    yAxis: {},
    series: coordinateSeries,
  });
}

const fetchData = document.getElementById('FetchData');
fetchData.addEventListener('click', (e) => {
  e.preventDefault();
  // Aiming action
  getData();

  // moving action
  // getData(1, myChart2, myChart4, 'Moving Action Samples');
});

