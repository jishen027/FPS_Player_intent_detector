import * as echart from 'echarts';

import { getDocs } from 'firebase/firestore';
import { colRef } from './firebase-config'

//get Data from firestore

var myChart = echart.init(document.getElementById('main'));
var myChart2 = echart.init(document.getElementById('main2'));

function getData(type, myChart) {
  let data = [];
  let axis = [];
  let axes = [];
  let Type_1_data = [];
  getDocs(colRef)
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        data.push(doc.data());
      })
      console.log(data)
      let type_1 = data.filter((doc) => { return doc.ArrayType == type}).slice(0, 100);
      type_1.forEach((d) => {
        d.data.forEach((a) => {
          axis.push(a.x);
          axis.push(a.y);
          axes.push(axis);
          axis = []
        })
        Type_1_data.push(axes);
        axes = [];
      })
      console.log(Type_1_data);
      let coordinateSeries = [];
      Type_1_data.forEach((data) => {
        coordinateSeries.push({
          type: 'scatter',
          data: data
        })
      })
      console.log(coordinateSeries);

      setGraphOption(coordinateSeries, myChart);
    })
    .catch(err => {
      console.log(err.message);
    })
}

function setGraphOption(coordinateSeries, chart) {
  console.log(coordinateSeries)
  chart.setOption({
    title: {
      text: 'ECharts Getting Started Example'
    },
    xAxis: {},
    yAxis: {},
    series: coordinateSeries,
  });
}

// Aiming action
getData(0, myChart);

// moving action
getData(1, myChart2);

