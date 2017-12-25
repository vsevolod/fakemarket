// Import the module
var polo = require("poloniex-unofficial");

// Get access to the push API
var poloPush = new polo.PushWrapper();

// Receive trollbox updates
poloPush.trollbox((err, response) => {
  if (err) {
    // Log error message
    console.log("An error occurred: " + err.msg);

    // Disconnect
    return true;
  }

  // Log chat message as "[rep] username: message"
  // console.log("    [" + response.reputation + "] " + response.username + ": " + response.message);
  console.log(response);
});
