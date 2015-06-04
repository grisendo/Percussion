# Percussion
Debugging tool for JS reactive programming libraries.

This library allows to visualize streams in order to debug reactive javascript programming applications. Currently supported libraries are:
* Bacon.js - [https://baconjs.github.io/](https://baconjs.github.io/)
* RxJS - [http://reactivex.io/](http://reactivex.io/)
* Kefir.js - [https://rpominov.github.io/kefir/](https://rpominov.github.io/kefir/)


## Simple usage

You can just initialize constructor without options:
```javascript
var percussion = new Percussion();
```

And then add as many streams as you want:
```javascript
percussion.addStream(stream1);
percussion.addStream(stream2);
percussion.addStream(stream3);
...
```
Then, you will see streams represented as lines, and events represented as circles in those lines. You can mouse-hover in the circles in order to see their values in a tooltip, or click them to see their values in the browser debugger console.

## Methods

You can stop debugging with:
```javascript
percussion.stop();
```

And then recover execution with:
```javascript
percussion.start();
```

By default, data visualization will automatically be scrolled in order to see last stream events. You can disable this in runtime with:
```javascript
percussion.setAutoScroll(false);
```
and enable again with:
```javascript
percussion.setAutoScroll(true);
```

## Constructor options

* **lineSize**: Height of the stream line in px. *Default: 20*
* **pointSize**: Width of the event point in px. *Default: 10*
* **speed**: Speed of stream visualization in px/sample. *Default: 20*
* **timeout**: Time of each sample in ms. *Default: 250*
* **autoScroll**: Whether if data visualization will automatically do scroll or not. *Default: true*
* **print** = Whether if event values will be printed in the stream visualization or not. *Default: false*
* **colors**: Array of colors for events in each stream. Will be repeated cyclically. *Default: ['#F00', '#0F0', '#00F']*
* **textColors** = Array of text colors for events in each stream (visible only if print == true). Should be the same size as colors, and also, will be repeated cyclically. *Default: ['#FFF', '#FFF', '#FFF']*
* **position** = HTML Element where data visualization will be injected. Notice this needs to be a pure Element, so if you use libraries like jQuery, you need to convert it (i.e.: $('#canvas')[0]). *Default: document.body*

Example:
```javascript
var percussion = new Percussion(
  {
    position: document.getElementById('canvas'),
    speed: 
  }
);
```

## Contributors

grisendo: Francisco J. Cruz Romanos <grisendo@gmail.com>

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
