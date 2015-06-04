/*! Percussion v0.1.0 | (c) 2015 grisendo */

(function() {

  var Percussion = function(options) {

    if (typeof(options) === 'undefined') {
      options = {};
    }

    this.lineSize = 20;
    this.pointSize = 10;
    this.speed = 20;
    this.timeout = 250;
    this.autoScroll = true;
    this.colors = [];
    this.textColors = [];
    this.eventIn = null;
    this.eventOut = null;
    this.position = document.body;
    this.print = false;

    this._setOptions(options);

    this.interval = null;
    this.canvas = null;
    this.canvasIn = null;
    this.running = false;
    this.lines = 0;
    this.time = 0;
    this.counter = 0;
    this.streams = [];
    this.events = [];

    this._startCanvas();

  };

  Percussion.prototype._setOptions = function(options) {
    (typeof(options.lineSize) !== 'undefined') ? (this.lineSize = options.lineSize) : null;
    (typeof(options.pointSize) !== 'undefined') ? (this.pointSize = options.pointSize) : null;
    (typeof(options.speed) !== 'undefined') ? (this.speed = options.speed) : null;
    (typeof(options.timeout) !== 'undefined') ? (this.timeout = options.timeout) : null;
    (typeof(options.autoScroll) !== 'undefined') ? (this.autoScroll = options.autoScroll) : null;
    (typeof(options.colors) !== 'undefined') ? (this.colors = options.colors) : null;
    (typeof(options.textColors) !== 'undefined') ? (this.textColors = options.textColors) : null;
    (typeof(options.eventIn) !== 'undefined') ? (this.eventIn = options.eventIn) : null;
    (typeof(options.eventOut) !== 'undefined') ? (this.eventOut = options.eventOut) : null;
    (typeof(options.position) !== 'undefined') ? (this.position = options.position) : null;
    (typeof(options.print) !== 'undefined') ? (this.print = options.print) : null;
  };

  Percussion.prototype._startCanvas = function() {
    this.lines = 0;
    this.time = 0;
    this.counter = 0;
    this.running = false;
    if (!this.colors || this.colors.length == 0) {
      this.colors = ['#FF0000', '#00FF00', '#0000FF'];
    }
    if (!this.textColors || this.textColors.length == 0) {
      this.textColors = ['#FFFFFF', '#FFFFFF', '#FFFFFF'];
    }
    if (!this.eventIn) {
      if ((typeof(Bacon) !== 'undefined') || (typeof(Kefir) !== 'undefined')) {
        this.eventIn = 'onValue';
      }
      else if (typeof(Rx) !== 'undefined') {
        this.eventIn = 'subscribe';
      }
    }
    if (!this.eventOut) {
      if (typeof(Bacon) !== 'undefined') {
        this.eventOut = '';
      }
      else if (typeof(Rx) !== 'undefined') {
        this.eventOut = 'dispose';
      }
      else if (typeof(Kefir) !== 'undefined') {
        this.eventOut = '_clear';
      }
    }
    this.canvas = document.createElement('DIV');
    this.canvasIn = document.createElement('DIV');
    this.canvas.style.position = 'relative';
    this.canvas.style.width = '100%';
    this.canvas.style.overflowX = 'auto';
    this.canvas.style.overflowY = 'hidden';
    this.canvasIn.style.position = 'relative';
    this.canvasIn.style.width = 0;
    this.canvas.appendChild(this.canvasIn);
    this.position.appendChild(this.canvas);
    this.start();
    for (var key in this.streams) {
      this.addStream(this.streams[key], true);
    }
  };

  Percussion.prototype.addStream = function(stream, recover) {
    if (typeof(recover) === 'undefined') {
      recover = false;
    }
    if (!recover) {
      this.streams.push(stream);
    }
    var currentLine = this.lines;
    var line = document.createElement('DIV');
    var color = this.colors[this.counter];
    var textColor = this.textColors[this.counter];
    line.style.position = 'absolute';
    line.style.width = '100%';
    line.style.top = (this.lines * this.lineSize + this.pointSize) + 'px';
    line.style.left = 0;
    line.style.height = '1px';
    line.style.background = '#000';
    this.canvasIn.appendChild(line);
    if (this.eventIn && (typeof(stream[this.eventIn]) === 'function')) {
      var percussion = this;
      var event = stream[this.eventIn](
        function(data) {
          if (percussion.running) {
            var hit = document.createElement('DIV');
            hit.style.borderRadius = '50%';
            hit.style.minWidth = percussion.pointSize + 'px';
            hit.style.minHeight = percussion.pointSize + 'px';
            hit.style.position = 'absolute';
            hit.style.top = (currentLine * percussion.lineSize + (percussion.pointSize / 2)) + 'px';
            hit.style.background = color;
            hit.style.cursor = 'pointer';
            hit.style.left = percussion.time + 'px';
            hit.style.color = textColor;
            if (typeof(data) !== 'object') {
              hit.title = data;
              if (percussion.print) {
                hit.innerHTML = data;
              }
            }
            else {
              hit.title = 'Object: Click to view value via Javascript Console';
            }
            hit.onclick = function() {
              console.log(data);
            };
            percussion.canvasIn.appendChild(hit);
          }
        }
      );
      this.events.push(event);
    }
    this.counter++;
    this.counter = this.counter % 3;
    this.lines++;
    this.canvas.style.height = ((this.lines + 1) * this.lineSize) + 'px';
    this.canvasIn.style.height = this.canvas.style.height;
  };

  Percussion.prototype.stop = function() {
    if (!this.running) {
      return;
    }
    this.running = false;
    if (this.interval) {
      clearInterval(this.interval);
    }
  };

  Percussion.prototype.start = function() {
    if (this.running) {
      return;
    }
    this.running = true;
    var percussion = this;
    this.interval = setInterval(
      function() {
        if (percussion.running) {
          percussion.time += percussion.speed;
          percussion.canvasIn.style.width = percussion.time + 'px';
          if (percussion.autoScroll) {
            percussion.canvas.scrollLeft = percussion.time;
          }
        }
      },
      this.timeout
    );
  };

  Percussion.prototype.setAutoScroll = function(value) {
    this.autoScroll = value;
  };

  Percussion.prototype.restart = function() {
    this.stop();
    this.canvas.parentNode.removeChild(this.canvas);
    for (var key in this.events) {
      if (this.eventOut === '') {
        this.events[key]();
      }
      else if(eventOut) {
        this.events[key][this.eventOut]();
      }
    }
    this.events = [];
    this._startCanvas();
  };

  window.Percussion = Percussion;

})();
