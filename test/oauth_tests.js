const tape = require("tape"),
  _test = require("tape-promise"),
  test = _test(tape), // decorate tape
  Codebird = require("../codebird");

function mock() {
  var cb = new Codebird();
  cb.setConsumerKey("123", "456");

  var xml = {
    readyState: 4,
    status: 200,
    open: url => {
      this.url = url
    },
    setRequestHeader: function () { return true; },
    responseText: "{\"token_type\":\"bearer\",\"access_token\":\"VqiO0n2HrKE\"}"
  };
  xml.send = function () {
    setTimeout(xml.onreadystatechange, 200);
  };

  cb.__test.mock({
    _getXmlRequestObject: function () {
      return xml
    }
  });

  return cb;
}

test("Tests oauth_authenticate Promise", function (t) {
  const cb = mock();
  t.plan(1);

  cb.setToken("123", "456");
  return cb.oauth_authenticate().then(function (a) {
    t.deepEqual(
      a,
      {reply: "https://api.twitter.com/oauth/authenticate?oauth_token=123"}
    )
  });
});

test("Tests oauth_authenticate callback", function (t) {
  const cb = mock();
  t.plan(4);

  cb.setToken("123", "456");
  cb.oauth_authenticate({}, function (a) {
    t.equal(
      a, "https://api.twitter.com/oauth/authenticate?oauth_token=123"
    )
  });
  cb.oauth_authenticate({force_login: true}, function (a) {
    t.equal(
      a, "https://api.twitter.com/oauth/authenticate?oauth_token=123&force_login=1"
    )
  });
  cb.oauth_authenticate({force_login: true, screen_name: "TwitterAPI"}, function (a) {
    t.equal(
      a, "https://api.twitter.com/oauth/authenticate?oauth_token=123&force_login=1&screen_name=TwitterAPI"
    )
  });
  cb.oauth_authenticate({screen_name: "TwitterAPI"}, function (a) {
    t.equal(
      a, "https://api.twitter.com/oauth/authenticate?oauth_token=123&screen_name=TwitterAPI"
    )
  });
});

test("Tests oauth_authorize callback", function (t) {
  const cb = mock();
  t.plan(4);

  cb.setToken("123", "456");
  cb.oauth_authorize({}, function (a) {
    t.equal(
      a, "https://api.twitter.com/oauth/authorize?oauth_token=123"
    )
  });
  cb.oauth_authorize({force_login: true}, function (a) {
    t.equal(
      a, "https://api.twitter.com/oauth/authorize?oauth_token=123&force_login=1"
    )
  });
  cb.oauth_authorize({force_login: true, screen_name: "TwitterAPI"}, function (a) {
    t.equal(
      a, "https://api.twitter.com/oauth/authorize?oauth_token=123&force_login=1&screen_name=TwitterAPI"
    )
  });
  cb.oauth_authorize({screen_name: "TwitterAPI"}, function (a) {
    t.equal(
      a, "https://api.twitter.com/oauth/authorize?oauth_token=123&screen_name=TwitterAPI"
    )
  });
});

test("Tests oauth2_token", function (t) {
  const cb = mock();
  t.plan(1);

  cb.oauth2_token(
    function (a) {
      t.deepEqual(
        a, {
          token_type: "bearer",
          access_token: "VqiO0n2HrKE",
          httpstatus: 200
        }
      );
    });
});