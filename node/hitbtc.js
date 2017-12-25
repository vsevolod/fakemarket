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


const viewList = function(params){
  var date = new Date();
  var arr = ['ask', 'bid'];

  for(i in arr){
    let value = arr[i];

    for(j in params[value]){
      checkOrderbookRaw(params[value][j], `${value}s`, date);
    };
  };
};

const checkOrderbookRaw = function(row, tableName, date){
  let price = row['price'];
  let size = row['size'];
  let queryText = "";

  if (size > 0) {
    queryText = `INSERT INTO ${tableName} ("price", "size", "date_from") VALUES($1, $2, $3) RETURNING NULL`;
  }
  else {
    queryText =  `UPDATE ${tableName} SET "price" = $1, "size" = $2, "date_till" = $3 `;
    queryText += `WHERE "price" = $1 AND "date_till" IS NULL`;
  }

  let values = [row['price'], row['size'], date];

  pgClient.query(queryText, values, (err, res) => {
    if(err) {
      console.log('Error: ', err.stack);
    }
  });
};

client.connect("wss://api.hitbtc.com:443/api/2/ws", function connected () {
  client.send('subscribeOrderbook', { "symbol": "ETHBTC" }, function mirrorReply (error, reply) {
    console.log('Subscribe orderbook reply:', reply);
  });

  client.expose('snapshotOrderbook', function snapshotOrderbook(params, reply) {
    viewList(params)

    console.log('Orderbook snapshot received');
  });

  client.expose('updateOrderbook', function updateOrderbook(params, reply) {
    viewList(params)

    console.log('Orderbook snapshot updated');
  });
});
