var sys = require("util")
  , assert = require("assert")
  , XMLHttpRequest = require("../lib/XMLHttpRequest").XMLHttpRequest
  , http = require("http")
  , xhr;

// Test server
var server = http.createServer(function (req, res) {
  // Check request method and URL
  if (req.url === "/set") {
    res.setHeader("Set-Cookie", ["foo=bar", "morefoo=morebar"]);
    res.end();
  } else {
    if (req.headers["cookie"] &&
      req.headers["cookie"] == "foo=bar; morefoo=morebar") {
      res.write("good");
    } else {
      res.write("bad");
    }
    res.end();
  }
}).listen(8000);

function testCreds(enabled, cb) {
  var xhr2 = new XMLHttpRequest();
  xhr2.withCredentials = enabled;

  xhr2.open("GET", "http://localhost:8000/check");
  xhr2.send();

  xhr2.onreadystatechange = function() {
    if (this.readyState == 4) {
      assert.equal(enabled ? "good" : "bad", this.responseText);
      cb();
    }
  };
}

xhr = new XMLHttpRequest();
assert.equal(false, xhr.withCredentials);

xhr.onreadystatechange = function() {
  if (this.readyState == 4) {
    testCreds(true, function() {
      testCreds(false, function() {
        server.close();
      })
    });
  }
};

xhr.open("GET", "http://localhost:8000/set");
xhr.send();
