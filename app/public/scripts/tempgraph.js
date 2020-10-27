function createTemperatureChart(queryID) {
    var ctx = document.querySelector(queryID).getContext('2d');
    return new Chart(ctx,
        {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Temperatur',
                    backgroundColor: '#ff0000',
                    borderColor: '#ff0000',
                    fill: false,
                    data: []
                }],

            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Temperatur over tid"
                },
                scales: {
                    xAxes: [{
                        type: 'linear',
                        position: 'bottom',
                        scaleLabel: {
                            display: true,
                            labelString: 'Tid (sek)'
                        },
                        ticks: {
                            stepSize: 1
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Temperatur (C)',
                        },
                        ticks: {
                            suggestedMax: 35,
                            suggestedMin: 10
                        }
                    }]
                }
            }
        }
    );
}