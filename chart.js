
var chartData = [];
var heroWinsOverTime = [];
var heroWinsDates = [];

GetChartDataFromDB();


function CreateChart(data)
{
    PrepareChartData(data);

    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: heroWinsDates,
            datasets: [{
                label: 'Wins Over Time',
                data: heroWinsOverTime,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)'
                ],
                lineTension: 0,
                showLine: true,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
}

function PrepareChartData(data)
{

    
    var herowinsAggregator = 0;
    data.map(function(current, index){
        if(current.winner === "Hero")
        {
            herowinsAggregator+= 1;
            heroWinsOverTime.push(herowinsAggregator);
            heroWinsDates.push(current.created_at);
        }
    });
    
}

function GetChartDataFromDB()
{
    console.log("Get Chart Data from DB");
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log("Got XMLHTTP Request Response")
    //   console.log(JSON.stringify(xhttp.response));
      chartData = JSON.parse(xhttp.responseText);
      CreateChart(chartData);
    }
  };
  xhttp.open("GET", `http://localhost:8080/chartData`, true);
  xhttp.send();
  console.log("XMLHTTP Request Sent")
}