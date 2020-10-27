var tempGraph = createTemperatureChart("#tempChart");
var pressureGraph = createPressureChart("#pressureChart");
var accelGraph = createPressureChart("#pressureChart");

var startUpdate = Date.now()/1000;
var latestUpdate = startUpdate;

var index = 0;

setInterval(async ()=> {
  var data = await (await fetch('/api/date?' + new URLSearchParams({
      date: latestUpdate,
  }))).json();
  console.log(data)

  var X_Time = Date.now()/1000-startUpdate;
  tempGraph.data.datasets[0].data.push({x: X_Time, y: data[0].temperature});
  pressureGraph.data.datasets[0].data.push({x: X_Time,y: data[0].pressure});

  if(index > 50) {
    tempGraph.data.datasets[0].data.shift();
    pressureGraph.data.datasets[0].data.shift();
  }

  tempGraph.update();
  pressureGraph.update();

  latestUpdate = Date.now()/1000;
  index++;
}, 500);


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
