Simple EventSource manager.

Install:

```bash
npm install --save event-source-manager
```

Usage:

```javascript
var express = require('express');
var esm     = require('event-source-manager');

var epp = express();

app.get('/', function(req, res){
  res.setHeader('Content-Type', 'text/html');
  res.send(
    '<script>\n'                                           +
    'var es = new EventSource("/events");\n'               +
    'es.addEventListener("serverTime", function(event){'   +
    '  document.body.innerHTML = event.data;\n'            +
    '})\n'                                                 +
    '</script>'
  );
});

app.get('/events', esm);

setInterval(function(){
  esm.broadcast('serverTime', new Date);
}, 1000);

app.listen(3000);
```
