const { Client } = require('pg');
const pgClient = new Client({
  user: 'market',
  password: 'market',
  host: 'postgres',
  database: 'hitbtc_market'
});

pgClient.connect();

const JsonRpcWs = require('json-rpc-ws');
const client = JsonRpcWs.createClient();


const viewList = function(pair, params){
  var date = new Date();
  var arr = ['ask', 'bid'];

  for(i in arr){
    let value = arr[i];

    for(j in params[value]){
      checkOrderbookRaw(params[value][j], `${value}s`, date, pair);
    };
  };
};

const checkOrderbookRaw = function(row, tableName, date, pair){
  let price = row['price'];
  let size = row['size'];
  let queryText = "";
  let values = [];

  if (size > 0) {
    values = [price, size, date, pair];

    queryText = `INSERT INTO ${tableName} ( "price", "size", "date_from", "pair") VALUES($1, $2, $3, $4) RETURNING NULL`;
  }
  else {
    values = [price, date, pair];

    queryText =  `UPDATE ${tableName} SET "date_till" = $2`;
    queryText += `WHERE "price" = $1 AND "date_till" IS NULL AND "pair" = $3`;
  }

  pgClient.query(queryText, values, (err, res) => {
    if(err) {
      console.log('Error: ', err.stack);
    }
  });
};

var currencyPair = "ETHBTC";

client.connect("wss://api.hitbtc.com:443/api/2/ws", function connected () {
  client.send('subscribeOrderbook', { "symbol": currencyPair }, function mirrorReply (error, reply) {
    console.log('Subscribe orderbook reply:', reply);
  });

  client.expose('snapshotOrderbook', function snapshotOrderbook(params, reply) {
    viewList(currencyPair, params);

    console.log('Orderbook snapshot received');
  });

  client.expose('updateOrderbook', function updateOrderbook(params, reply) {
    viewList(currencyPair, params);

    console.log('Orderbook snapshot updated');
  });
});
