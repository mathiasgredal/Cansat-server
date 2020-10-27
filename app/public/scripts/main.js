// var table = new Tabulator("#example-table", {
//     reactiveData:true,
//     height:605,
//     ajaxURL: "/api/all",
//     layout:"fitColumns",
//     columns:[
//         {title:"Temp", field:"temperature", width:150},
//         {title:"Pressure", field:"pressure", hozAlign:"left"},
//     ]
// });


// setInterval(async () => {
//     const tableData = await (await fetch("/api/all")).json();
//     table.setData(tableData);
// }, 1000);

var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
  // The type of chart we want to create
  type: 'line',

  // The data for our dataset
  data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
      label: 'My First dataset',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: [0, 10, 5, 2, 20, 30, 45]
    }]
  },

  // Configuration options go here
  options: {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    title: {
      display: true,
      text: "Temperaturgraf"
    },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Temperatur [°C]'
        }
      }]
    }     
  }
});