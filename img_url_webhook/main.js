function get_data() {
  //シートを指定
  var spreadsheet = SpreadsheetApp.openById('1uiqmjcqD7L30yr_MEQsPlO5of8RAqzwK14n-NV69DBI');
  var sheet = spreadsheet.getSheetByName('image');
  
  //GithubのRawURLを生成
  var url = 'https://github.com/redpeacock78/img_repo/commit/master.diff';
  var head = 'https://raw.githubusercontent.com/redpeacock78/img_repo/master';
  var response = String(UrlFetchApp.fetch(url).getContentText().match(/Binary .*/g));
  var result = response.replace(/ differ/g, '').replace(/Binary files \/dev\/null and b/g, head).split(',');
  
  //マスターシートに書き込み
  for (var i = 0; i < result.length; i++) {
    var raw_urls = [result[i]];
    sheet.appendRow(raw_urls);
  }
}

function copy_paste() {
  var copyMaster = SpreadsheetApp.openById('1uiqmjcqD7L30yr_MEQsPlO5of8RAqzwK14n-NV69DBI'); //コピー元のマスターデータのあるスプレッドシート
  var pasteMaster = SpreadsheetApp.openById('114nY2AbozZEWMl4o9yuTfrjNHZsyhEAhm-KZpq5sOvA'); //ペースト先のスプレッドシート
 
  var sheetFrom = copyMaster.getSheetByName('image'); //コピー元のスプレッドシートの値を抜き出したいシート名
  var sheetTo = pasteMaster.getSheetByName('image_copy'); //ペーストする自分のスプレッドシートのシート名
 
  var copylastRow = sheetFrom.getLastRow(); //コピー元の最終行を取得
  var copylastColumn = sheetFrom.getLastColumn(); //コピー元の最終列を取得
  
  var pastelastRow = sheetTo.getLastRow(); //ペースト先の最終行を取得
  var pastelastColumn = sheetTo.getLastColumn(); //ペースト先の最終列を取得
 
  var copyData = sheetFrom.getRange(1,1,copylastRow,copylastColumn).getValues(); //コピー元のシートから値の入っている全範囲をコピー
  sheetTo.getRange(1,1,copylastRow,copylastColumn).setValues(copyData); //自分のシートにコピーした値を全範囲をペースト
  
  var pasteData = sheetTo.getRange(1,1,pastelastRow,pastelastColumn); //ペースト先のシートから値の入っている全範囲の内容を取得
  pasteData.removeDuplicates(); //ペースト先のシートで被っている値を削除
}

function doPost(e){
  var text = 'This script ran successfully.';
  get_data();
  copy_paste();
  return text;
}
