var sys = require("util")
  , assert = require("assert")
  , XMLHttpRequest = require("../lib/XMLHttpRequest").XMLHttpRequest
  , http = require("http");

// Test server
var server = http.createServer(function (req, res) {
  setTimeout(function(){
    res.end();
  }, 3000);
}).listen(8000);


function mkreq(cb) {
  var xhr = new XMLHttpRequest();

  xhr.ontimeout = function() {
    cb();
  };

  return xhr;
}

var tid;

var xhr = mkreq(function() {
  var xhr2 = mkreq(function() {
    server.close();
    clearTimeout(tid);
  });

  xhr2.open("GET", "http://localhost:8000/");
  xhr2.send();
  xhr2.timeout = 500;
});

xhr.timeout = 500;
xhr.open("GET", "http://localhost:8000/");
xhr.send();

tid = setTimeout(function() {
  console.error("Did not time out");
  server.close();
}, 1500);
