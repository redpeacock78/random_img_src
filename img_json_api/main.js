function doGet(e) {
  //スプレッドシートからランダムに画像URLを取得
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('image_copy');
  var lastRow = sheet.getLastRow();
  var number = Math.ceil(Math.random() * (lastRow-1)) + 1;
  var img_url = sheet.getRange(number, 1).getValue();
  
  //取得したURLからそれぞれの情報を生成
  var resp = UrlFetchApp.fetch(img_url,{'method':'get'});
  var blob = resp.getBlob();
  var length = blob.getBytes().length;
  var size = String(length);
  var content_type = blob.getContentType();
  var ext = img_url.split('.').pop().toLowerCase();
  var zero_number = ( '0000000' + number ).slice( -7 );
  var name = 'IMG_' + zero_number + "." + ext;
  var base64 = Utilities.base64Encode(blob.getBytes());
  
  //HTTPリクエストをされた時点の時刻を生成
  var now = new Date();
  var date = Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy-MM-dd');
  var time = Utilities.formatDate(now, 'Asia/Tokyo', 'HH:mm:ss');
  var request_time = date + "H" + time + "Z";
  
  //一意なFilekeyを作成
  var length = 35;
  var character = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var cl = character.length;
  var r = "";
  for(var i=0; i<length; i++){
    r += character[Math.floor(Math.random()*cl)];
  }
  var key_date = date.replace(/-/g, '0');
  var key_time = time.replace(/:/g, '');
  var filekey = key_date + key_time + r;
  
  //JSONデータを生成
  var json = {
    "record": {
      "downroad_time": {
        "type": "DOWNROAD_TIME",
        "value": request_time
      },
      "attached_file": {
        "type": "FILE",
        "value": [
          {
            "content_type": content_type,
            "filekey": filekey,
            "base64": base64,
            "name": name,
            "size": size
          }
        ]
      }
    }
  }
  
  //生成したJSONデータを返す
  var out = ContentService.createTextOutput();
  out.setMimeType(ContentService.MimeType.JSON);
  out.setContent(JSON.stringify(json));
  return out;
}
