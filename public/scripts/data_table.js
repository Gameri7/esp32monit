function export2csv() {
  let data = "";
  const tableData = [];
  const rows = document.querySelectorAll("table tr");
  for (const row of rows) {
    const rowData = [];
    for (const [index, column] of row.querySelectorAll("th, td").entries()) {
      // Para conservar las comas en la columna "Descripción", 
      //podemos encerrar esos campos entre comillas.
      if ((index + 1) % 3 === 0) {
        rowData.push('"' + column.innerText + '"');
      } else {
        rowData.push(column.innerText);
      }
    }
    tableData.push(rowData.join(","));
  }
  data += tableData.join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([data], { type: "text/csv" }));
  a.setAttribute("download", "dataVolt.csv");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}