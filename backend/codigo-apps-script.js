/**
 * CÓDIGO BACKEND PARA GOOGLE SHEETS
 * Instrucciones:
 * 1. Crea un Google Sheets llamado "Base de Datos - Nenapp"
 * 2. Nombra la Hoja 1 como "Ubicacion"
 * 3. Pon encabezados en A1:D1 -> camion | lat | lng | timestamp
 * 4. Ve a Extensiones > Apps Script, pega esto y publica como Web App (acceso: Todos)
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Ubicacion");
  var data = JSON.parse(e.postData.contents);
  
  var camionId = data.camion;
  var lat = data.lat;
  var lng = data.lng;
  var timestamp = new Date();
  
  var rows = sheet.getDataRange().getValues();
  var found = false;
  
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] == camionId) {
      sheet.getRange(i + 1, 2).setValue(lat);
      sheet.getRange(i + 1, 3).setValue(lng);
      sheet.getRange(i + 1, 4).setValue(timestamp);
      found = true;
      break;
    }
  }
  
  if (!found) {
    sheet.appendRow([camionId, lat, lng, timestamp]);
  }
  
  return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
                      .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Ubicacion");
  var rows = sheet.getDataRange().getValues();
  var resultado = [];
  
  for (var i = 1; i < rows.length; i++) {
    resultado.push({
      camion: rows[i][0],
      lat: rows[i][1],
      lng: rows[i][2],
      time: rows[i][3]
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify(resultado))
                      .setMimeType(ContentService.MimeType.JSON);
}
