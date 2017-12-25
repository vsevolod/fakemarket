var autobahn = require('autobahn');
var connection = new autobahn.Connection({
  url: "wss://api.poloniex.com:443",
  realm: "realm1"
});

connection.onopen = function (session) {
  console.log('Websocket connection open');

  function marketEvent (args,kwargs) {
    console.log('=============1');
    console.log(args);
  }
  function tickerEvent (args,kwargs) {
    console.log('=============2');
    console.log(args);
  }
  function trollboxEvent (args,kwargs) {
    console.log('=============3');
    console.log(args);
  }
  function alertsEvent (args,kwargs) {
    console.log('=============4');
    console.log(args);
  }
  function heartbeatEvent (args,kwargs) {
    console.log('=============5');
    console.log(args);
  }
  function footerEvent (args,kwargs) {
    console.log('=============6');
    console.log(args);
  }

  session.subscribe('USDT_BTC', marketEvent);
  session.subscribe('ticker', tickerEvent);
  session.subscribe('alerts', alertsEvent);
  session.subscribe('heartbeat', heartbeatEvent);
  session.subscribe('footer', footerEvent);
  //session.subscribe('trollbox', trollboxEvent);
}

connection.onclose = function () {
  console.log('Websocket connection closed');
}

connection.open();
