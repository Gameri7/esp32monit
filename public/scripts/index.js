// convertir epochtime a objeto de fecha JavaScripte
function epochToJsDate(epochTime){
    return new Date(epochTime*1000);
  }
// convertir el tiempo en legible por humanos format YYYY/MM/DD HH:MM:SS
  function epochToDateTime(epochTime){
    let epochDate = new Date(epochToJsDate(epochTime));
    let dateTime = epochDate.getFullYear() + "/" +
      ("00" + (epochDate.getMonth() + 1)).slice(-2) + "/" +
      ("00" + epochDate.getDate()).slice(-2) + " " +
      ("00" + epochDate.getHours()).slice(-2) + ":" +
      ("00" + epochDate.getMinutes()).slice(-2) + ":" +
      ("00" + epochDate.getSeconds()).slice(-2);
  
    return dateTime;
  }
  
  // función para trazar valores en gráficos
function plotValues(chart, timestamp, value){
  let x = epochToJsDate(timestamp).getTime();
  let y = Number (value);
  if(chart.series[0].data.length > 40) { 
    chart.series[0].addPoint([x, y], true, true, true);
  } else {
    chart.series[0].addPoint([x, y], true, false, true);
  }
}

// elementos DOM (Document Object Model)
  const loginElement = document.querySelector('#login-form');
const contentElement = document.querySelector("#content-sign-in");
const userDetailsElement = document.querySelector('#user-details');
const authBarElement = document.querySelector('#authentication-bar');
const deleteButtonElement = document.getElementById('delete-button');
const deleteModalElement = document.getElementById('delete-modal');
const deleteDataFormElement = document.querySelector('#delete-data-form');
const viewDataButtonElement = document.getElementById('view-data-button');
const hideDataButtonElement = document.getElementById('hide-data-button');
const tableContainerElement = document.querySelector('#table-container');
const chartsRangeInputElement = document.getElementById('charts-range');
const loadDataButtonElement = document.getElementById('load-data');
const cardsCheckboxElement = document.querySelector('input[name=cards-checkbox]');
const gaugesCheckboxElement = document.querySelector('input[name=gauges-checkbox]');
const chartsCheckboxElement = document.querySelector('input[name=charts-checkbox]');
// DOM elementos para lecturas de sensores
const cardsReadingsElement = document.querySelector("#cards-div");
const gaugesReadingsElement = document.querySelector("#gauges-div");
const chartsDivElement = document.querySelector('#charts-div');
const voltElement = document.getElementById("volt");
const updateElement = document.getElementById("lastUpdate")
  
// ADMINISTRAR LOGIN/LOGOUT UI
  const setupUI = (user) => {
    if (user) {
      //toggle UI elements
      loginElement.style.display = 'none';
      contentElement.style.display = 'block';
      authBarElement.style.display ='block';
      userDetailsElement.style.display ='block';
      userDetailsElement.innerHTML = user.email;
  
      // obtener el UID del usuario para obtener datos de la base de datos
      let uid = user.uid;
      console.log(uid);
  
      //Rutas de la base de datos (con UID de usuario)
      let dbPath = 'UsersData/' + uid.toString() + '/volt';
      let chartPath = 'UsersData/' + uid.toString() + 'charts/range';
  
      // Referencias de bases de datos
      let dbRef = firebase.database().ref(dbPath);
      let chartRef = firebase.database().ref(chartPath);

      //CHARTS-- Número de lecturas para trazar en gráficos
      let chartRange = 0;
      // Obtenga el número de lecturas para trazar guardadas en la base de datos 
      //(se ejecuta cuando la página se carga por primera vez y cada vez que hay un cambio en la base de datos)
      chartRef.on('value', snapshot =>{
        chartRange = Number(snapshot.val());
        console.log(chartRange);
        // Elimine todos los datos de los gráficos para actualizarlos con nuevos valores 
        //cuando se seleccione un nuevo rango
        chartT.destroy();
        
        // Renderice nuevos gráficos para mostrar un nuevo rango de datos
        chartT = createVoltageChart();
        
        // Actualizar los gráficos con el nuevo rango
        // Obtenga las últimas lecturas y trácelas en gráficos 
        //(el número de lecturas graficadas corresponde al valor chartRange)
        dbRef.orderByKey().limitToLast(chartRange).on('child_added', snapshot =>{
          let jsonData = snapshot.toJSON(); // example: {Volt: 25.02, timestamp:1641317355}
          // Guarda valores 
          let volt = jsonData.volt;
          let timestamp = jsonData.timestamp;
          // Trace los valores en los gráficos
          plotValues(chartT, timestamp, volt);
        });
      });
  
      // Actualizar la base de datos con un nuevo rango (campo de entrada)
      chartsRangeInputElement.onchange = () =>{
        chartRef.set(chartsRangeInputElement.value);
      };
  
      //CHECKBOXES
      // Checkbox (tarjetas para lecturas de sensores)
      
      cardsCheckboxElement.addEventListener('change', (e) =>{
        if (cardsCheckboxElement.checked) {
          cardsReadingsElement.style.display = 'block';
        }
        else{
          cardsReadingsElement.style.display = 'none';
        }
      });
      // Casilla de verificación (indicadores para lecturas de sensores)
      gaugesCheckboxElement.addEventListener('change', (e) =>{
        if (gaugesCheckboxElement.checked) {
          gaugesReadingsElement.style.display = 'block';
        }
        else{
          gaugesReadingsElement.style.display = 'none';
        }
      });
      // Casilla de verificación (gráfico para las lecturas del sensor)
      chartsCheckboxElement.addEventListener('change', (e) =>{
        if (chartsCheckboxElement.checked) {
          chartsDivElement.style.display = 'block';
        }
        else{
          chartsDivElement.style.display = 'none';
        }
      });
      // CARDS --Obtenga las últimas lecturas y visualización en tarjetas
      dbRef.orderByKey().limitToLast(1).on('child_added', snapshot =>{
        let jsonData = snapshot.toJSON(); // example: {volt: 25.02,timestamp:1641317355}
        let volt = jsonData.volt;
       
        let timestamp = jsonData.timestamp;
       
        // Actualizar elementos DOM
        voltElement.innerHTML = volt;
        
        updateElement.innerHTML = epochToDateTime(timestamp);
      });
  
      // GAUGES
      // Obtenga las últimas lecturas y visualice los indicadores
      dbRef.orderByKey().limitToLast(1).on('child_added', snapshot =>{
        let jsonData = snapshot.toJSON(); // example: {volt: 25.02, timestamp:1641317355}
        let voltage = jsonData.volt;
        let timestamp = jsonData.timestamp;
        // Actualizar elementos DOM
        let gaugeT = createVoltageGauge();
        gaugeT.draw();
        gaugeT.value = voltage;
        updateElement.innerHTML = epochToDateTime(timestamp);
      }); 
      //BORAR DATOS-- Agregue un detector de eventos para abrir modal cuando haga clic en el botón "Eliminar datos"
      deleteButtonElement.addEventListener('click', e =>{
        console.log("Remove data");
        e.preventDefault;
        deleteModalElement.style.display="block";
      });
      // Agregue un detector de eventos cuando se envíe el formulario de eliminación
      deleteDataFormElement.addEventListener('submit', (e) => {
        // borrar datos (lecturas)
        dbRef.remove();
      });
      // TABLA
      let lastReadingTimestamp; //guarda la última marca de tiempo que se muestra en la tabla
      // Función que crea la tabla con las primeras 100 lecturas
      function createTable(){
        // agregar todos los datos a la tabla
        let firstRun = true;
        dbRef.orderByKey().limitToLast(100).on('child_added', function(snapshot) {
          if (snapshot.exists()) {
            let jsonData = snapshot.toJSON();
            console.log(jsonData);
            let volt = jsonData.volt;
            let timestamp = jsonData.timestamp;
            let content = '';
            content += '<tr>';
            content += '<td>' + epochToDateTime(timestamp) + '</td>';
            content += '<td>' + volt + '</td>';
            content += '</tr>';
            $('#tbody').prepend(content);
            // Guardar lastReadingTimestamp --> 
            //corresponde a la primera marca de tiempo en los datos de la instantánea devuelta
            if (firstRun){
              lastReadingTimestamp = timestamp;
              firstRun=false;
              console.log(lastReadingTimestamp);
            }
          }
        });
      };
      // agregar lecturas a la tabla (después de presionar el botón Más resultados...)
      function appendToTable(){
        let dataList = []; // guarda la lista de lecturas devueltas por la instantánea (más antigua-->más reciente)
        let reversedList = []; // lo mismo que el anterior, pero al revés (más nuevo--> más antiguo)
        console.log("APEND");
        dbRef.orderByKey().limitToLast(100).endAt(lastReadingTimestamp).once('value', function(snapshot) {
          // convierte el snapshot to JSON
          if (snapshot.exists()) {
            snapshot.forEach(element => {
              let jsonData = element.toJSON();
              dataList.push(jsonData); // crear una lista con todos los datos
            });
            lastReadingTimestamp = dataList[0].timestamp; //la marca de tiempo más antigua corresponde a la primera de la lista (más antigua --> más nueva)
            reversedList = dataList.reverse(); // invertir el orden de la lista (datos más nuevos --> datos más antiguos)
  
            let firstTime = true;
            // recorrer todos los elementos de la lista y agregarlos a la tabla (primero los elementos más nuevos)
            reversedList.forEach(element =>{
              if (firstTime){ // ignorar la primera lectura (ya está en la tabla de la consulta anterior)
                firstTime = false;
              }
              else{
                let volt = element.volt;
                
                let timestamp = element.timestamp;
                let content = '';
                content += '<tr>';
                content += '<td>' + epochToDateTime(timestamp) + '</td>';
                content += '<td>' + volt + '</td>';
                content += '</tr>';
                $('#tbody').append(content);
                
              }
            });
          }
        });
      }
      viewDataButtonElement.addEventListener('click', (e) =>{
        // Toggle DOM elements
        tableContainerElement.style.display = 'block';
        viewDataButtonElement.style.display ='none';
        hideDataButtonElement.style.display ='inline-block';
        loadDataButtonElement.style.display = 'inline-block'
        createTable();
      });
        loadDataButtonElement.addEventListener('click', (e) => {
        appendToTable();
      });
        hideDataButtonElement.addEventListener('click', (e) => {
        tableContainerElement.style.display = 'none';
        viewDataButtonElement.style.display = 'inline-block';
        hideDataButtonElement.style.display = 'none';
      });
      //Si el usuario está desconectado
    } else{
      // toggle UI elements
      loginElement.style.display = 'block';
      authBarElement.style.display ='none';
      userDetailsElement.style.display ='none';
      contentElement.style.display = 'none';
    }
}