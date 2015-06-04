var single = null;
var double = null;
var poll = null;

var percussion = new Percussion();

if (typeof(Bacon) !== 'undefined') {
  single = Bacon.fromEventTarget(document.getElementById('demo'), 'click').map(
    function(data) {
      return 'click';
    }
  );
  double = single.bufferWithTimeOrCount(300, 2).filter(
    function(x) {
      return x.length >= 2;
    }
  ).map(
    function(data) {
      return 'dblclick';
    }
  );
  poll = Bacon.fromPoll(
    5000,
    function() {
      return 'time!';
    }
  ).startWith('init');
}
else if (typeof(Rx) !== 'undefined') {
  single = Rx.Observable.fromEvent(document.getElementById('demo'), 'click')
    .map(function() { return 'click'; });
  double = single.buffer(function() { return single.throttle(300); })
    .map(function(list) { return list.length; })
    .filter(function(x) { return x >= 2; })
    .map(function() { return 'dblclick'; });
  poll = Rx.Observable.interval(5000)
    .map(function(list) { return 'time!'; })
    .startWith('init');
}
else if (typeof(Kefir) !== 'undefined') {
  single = Kefir.fromEvents(document.getElementById('demo'), 'click')
    .map(function() { return 'click'; });
  double = single.bufferBy(single.debounce(300))
    .map(function(list) { return list.length; })
    .filter(function(x) { return x >= 2; })
    .map(function() { return 'dblclick'; });
  poll = Kefir.interval(5000, 'time!').toProperty(
    function() {
      return 'init';
    }
  );
}

percussion.addStream(single);
percussion.addStream(double);
percussion.addStream(poll);
