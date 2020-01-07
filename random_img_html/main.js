function getAPI() {
  var url = 'https://script.google.com/macros/s/AKfycbz4bSN0Cny3KxFMfQpl1n3MeD_RfyVHrvL9oM_Vj3lq2BvSOtI/exec'
  var response = UrlFetchApp.fetch(url);
  var json = JSON.parse(response.getContentText());
  
  var name = json.record.attached_file.value[0].name;
  var base64 = json.record.attached_file.value[0].base64;
  var content_type = json.record.attached_file.value[0].content_type;
  
  var data = "data:" + content_type + ";base64," + base64;
  var img_src = '<img src="' + data + '" alt="' + name + '" />';
  
  return img_src;
}

function doGet(e) {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}