import * as echart from 'echarts';

import { getDocs } from 'firebase/firestore';
import { colRef } from './firebase-config'
import { saveCSV } from './dataprocessing';

//get Data from firestore

var myChart = echart.init(document.getElementById('main'));
var myChart2 = echart.init(document.getElementById('main2'));
var myChart3 = echart.init(document.getElementById('main3'));
var myChart4 = echart.init(document.getElementById('main4'));

function getData(type, chartOne, ChartTwo, chartTitle) {
  let data = [];
  let axis = [];
  let axes = [];
  let Type_1_data = [];
  getDocs(colRef)
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        data.push(doc.data());
      })
      let type_1 = data.filter((doc) => { return doc.ArrayType == type })
      type_1.forEach((d) => {
        d.data.forEach((a) => {
          axis.push(a.y);
          axis.push(a.x);
          axes.push(axis);
          axis = []
        })
        Type_1_data.push(axes);
        axes = [];
      })
      let coordinateSeries = [];
      console.log(Type_1_data);
      Type_1_data.forEach((data) => {
        coordinateSeries.push({
          symbol: 'none',
          type: 'line',
          data: data
        })
      })
      console.log(coordinateSeries);

      setGraphOption(coordinateSeries, chartOne, chartTitle);

      // cetre point
      let centerpoints = [];
      let centrePoint = [];
      Type_1_data.forEach((coordinates) => {
        var x = 0, y = 0;
        for (let i = 1; i < coordinates.length; i++) {
          const axesX = +coordinates[i][0].toFixed(2)
          const axesY = +coordinates[i][1].toFixed(2)
          x = x + axesX
          y = y + axesY
        }
        centrePoint.push(x);
        centrePoint.push(y);
        centerpoints.push(centrePoint);

        //init
        centrePoint = [];
        x = 0, y = 0;
      })
      console.log(centerpoints);
      let centerPointSeries = [
        {
          type: 'scatter',
          data: centerpoints
        }
      ];
      setGraphOption(centerPointSeries, ChartTwo, "Center Points")

      // output CSV
      let csvTitle = 'center point csv ' + type;
      let head = ['x', 'y'];
      let csvData = centerpoints;

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

// Aiming action
getData(0, myChart, myChart3, 'Aiming Action Samples');

// moving action
getData(1, myChart2, myChart4, 'Moving Action Samples');



