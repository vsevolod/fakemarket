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

    queryText =  `UPDATE ${tableName} SET "date_till" = $2 `;
    queryText += `WHERE "price" = $1 AND "date_till" IS NULL AND "pair" = $3`;
  }

  pgClient.query(queryText, values, (err, res) => {
    if(err) {
      console.log(`Error with query for ${tableName}: `, err.stack);
    }
  });
};

const viewTradesList = function(pair, params) {
  let arr = params['data'];

  for(i in arr){
    let row = arr[i];
    let queryText = `INSERT INTO trades ( "id", "price", "quantity", "side", "timestamp") VALUES($1, $2, $3, $4, $5) RETURNING NULL`;
    let values = [row['id'], row['price'], row['quantity'], row['side'], row['timestamp']];

    pgClient.query(queryText, values, (err, res) => {
      if(err) {
        console.log('Error insert into trades: ', err.stack);
      }
    });
  };
}

var currencyPair = "ETHBTC";

client.connect("wss://api.hitbtc.com:443/api/2/ws", function connected () {

  // Orderbook
  //client.send('subscribeOrderbook', { "symbol": currencyPair }, function mirrorReply (error, reply) {
  //  console.log('Subscribe orderbook reply:', reply);
  //});
  //client.expose('snapshotOrderbook', function snapshotOrderbook(params, reply) {
  //  viewList(currencyPair, params);

  //  console.log('Orderbook snapshot received');
  //});

  //client.expose('updateOrderbook', function updateOrderbook(params, reply) {
  //  viewList(currencyPair, params);

  //  console.log('Orderbook snapshot updated');
  //});

  // Trades
  client.send('subscribeTrades', { "symbol": currencyPair }, function mirrorReply (error, reply) {
    console.log('Subscribe trades reply:', reply);
  });

  client.expose('snapshotTrades', function snapshotTrades(params, reply) {
    viewTradesList(currencyPair, params);

    console.log('Trades snapshot received');
  });

  client.expose('updateTrades', function updateTrades(params, reply) {
    viewTradesList(currencyPair, params);

    console.log('Trades snapshot updated');
  });
});
