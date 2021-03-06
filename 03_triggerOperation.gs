/**
 * いったん現在のトリガーを削除し、次のトリガーを設定する
 * 
 * @param {string} トリガーを操作する関数名
 */
function setNextTrigger(functionName) {
  deleteAllTriggersNamed(functionName);
  Logger.log('トリガーを全削除しました。');
  
  var date            = new Date();
  var nextTriggerTime = setNextTime(date);

  ScriptApp.newTrigger(functionName).timeBased().at(nextTriggerTime).create();
  Logger.log('次のトリガーを設定しました。');
}

/**
 * 対象関数に紐づいたトリガーを全削除する
 * 
 * @param {string} トリガーを削除する関数名
 */
var deleteAllTriggersNamed = function(functionName) {
  var triggers = ScriptApp.getProjectTriggers();
  
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() !== functionName) continue;
    ScriptApp.deleteTrigger(triggers[i]);
  }
}

/**
 * 次のトリガーの時刻を設定する（10:25、11:25、11:55）
 * 
 * @param {object} 実行時点の時刻を表すDateオブジェクト
 * 
 * @return {object} 次のトリガーの時刻を表すDateオブジェクト
 */
var setNextTime = function(date) {
  var hour   = date.getHours();
  var minute = date.getMinutes();

  switch (true) {
    // 現在10:25なら11:25にセット
    case (hour === 10):
      hour = 11;
      date.setHours(hour);
      break;
      
    // 現在11:15なら11:55にセット
    case (hour === 11 && minute === 25):
      minute = 55;
      date.setMinutes(minute);
      break;
      
    // 現在11:55（もしくは初回）なら翌日の10:25にセット
    default:
      hour   = 10;
      minute = 25;
      date.setDate(date.getDate() + 1);
      date.setHours(hour);
      date.setMinutes(minute);
  };

  return date;
}