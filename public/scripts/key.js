 
      const firebaseConfig = {
        apiKey: "AIzaSyA4KWM0LQWt54e3J052Nt6Hn9hZCl6vtQI",
        authDomain: "monitoreo-voltaje.firebaseapp.com",
        databaseURL: "https://monitoreo-voltaje-default-rtdb.firebaseio.com",
        projectId: "monitoreo-voltaje",
        storageBucket: "monitoreo-voltaje.appspot.com",
        messagingSenderId: "306467687879",
        appId: "1:306467687879:web:89cdb3389175047f20dde2",
        measurementId: "G-78HQMW5B2W"
      };
            
      firebase.initializeApp(firebaseConfig);
       
      // Hacer referencias de autenticación y base de datos
      const auth = firebase.auth();
      const db = firebase.database();