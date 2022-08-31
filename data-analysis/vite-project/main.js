import { collection, getDocs } from 'firebase/firestore';
import { colRef } from './firebase-config'
import { saveCSV } from './dataprocessing';

const AIMING_ACTION = 0;
const MOVING_ACTION = 1;

//get Data from firestore
function getData() {
  let data = [];
  let elements = [];
  let element = "";
  let _line_data = [];
  let _collection = [];

  let _center_point = [];

  let mean_x = 0, mean_y = 0, mean_rx = 0, mean_ry = 0;
  let sum_x = 0, sum_y = 0, sum_rx = 0, sum_ry = 0;
  let counter = 0;
  let type = 0;

  getDocs(colRef)
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        data.push(doc.data())
      })
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        elements = data[i].data;
        elements.forEach((element) => {
          sum_x += element.x;
          sum_y += element.y;
          sum_rx += element.rx;
          sum_ry += element.ry;
          type = element.type;
        })
        counter = elements.length

        mean_x = sum_x / counter;
        mean_y = sum_y / counter;
        mean_rx = sum_rx / counter;
        mean_ry = sum_ry / counter;

        counter = 0;

        _center_point.push(mean_x);
        _center_point.push(mean_y);
        _center_point.push(mean_rx);
        _center_point.push(mean_ry);
        _center_point.push(type);

        sum_x = 0;
        sum_y = 0;
        sum_rx = 0;
        sum_ry = 0;

        mean_x = 0;
        mean_y = 0;
        mean_rx = 0;
        mean_ry = 0;

        _collection.push(_center_point);
        _center_point = [];
      }

      console.log(_collection);

      // output CSV
      let csvTitle = 'ControllerData';
      let head = ['x', 'y', 'rx', 'ry', 'type'];
      let csvData = _collection;

      saveCSV(csvTitle, head, csvData).then(() => {
        console.log('success');
      })

    })
    .catch(err => {
      console.log(err.message);
    })
}

const isGreaterThreshold = (currentElement) => {
  currentElement.trigger > 0.1;
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

