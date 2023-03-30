
// Crear los gráficos cuando se carga la página web
window.addEventListener('load', onload);
function onload(event){
  chartT = createVoltageChart(); 
}
// Crea voltage Chart
function createVoltageChart() {
  let chart = new Highcharts.Chart({
   //muestra la hora actual
    time:{
      useUTC: false
      },
      //  
    chart:{ 
      renderTo:'chart-volt',
      type: 'spline' 
    },
    series: [
      {
        name: 'ZMPT101B',
        marker: {
        symbol: 'diamond'
      }
    }
    ],
    title: { 
      text: undefined
    },
    plotOptions: {
      line: { 
        animation: false,
        dataLabels: { 
          enabled: true 
        }
      }
    },
    xAxis: {
     type: 'datetime',
      dateTimeLabelFormats: { second: '%H:%M:%S' }
    },
    yAxis: {
      title: { 
        text: 'voltaje(V)' 
      }
    },
    credits: { 
      enabled: false 
    }
  });
  return chart;
}