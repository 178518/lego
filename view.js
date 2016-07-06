var Readable = require('stream').Readable;
var inherits = require('util').inherits;
var co = require('co');
var fs = require('fs');
// var async = require('async');

inherits(View, Readable);

function View(context) {
  Readable.call(this, {});

  // render the view on a different loop
  co.call(this, this.render).catch(context.onerror);
}

View.prototype._read = function () {};

View.prototype.render = function* () {
  // flush layout and assets
  var layoutHtml = fs.readFileSync(__dirname + "/layout.html").toString();
  this.push(layoutHtml);

  var context = this;

  var options = [
    {id:"A",html:"moduleAA",delay:1000},
    {id:"B",html:"moduleBB",delay:0},
    {id:"C",html:"moduleCC",delay:2000}
  ];

  var exec = options.map(function(item){ return opt(item); });

  function opt(item) {
    return new Promise(function (resolve, reject) {
      setTimeout(function(){
        context.push('<script>doProgress("#'+item.id+'","'+item.html+'");</script>');
        resolve(item);
      }, item.delay);
    });
  }

  function done() {
    context.push('</body></html>');
    // end the stream
    context.push(null);
  }

  co(function* () {
    yield exec;
  }).then(function(){
    done();
  });

};

module.exports = View;
