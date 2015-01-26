'use strict';
var assert = require('assert');
var debug = require('debug')('event-source-manager');
var extend = require('extend');

var eventId = 0;
var connections = [];

var manager = {
  addConnection: function(conn){
    var self = this;

    debug('adding connection');

    connections.push(conn);

    debug(this.connectionsCount() + ' active connections');

    return conn;
  },

  removeConnection: function(conn){
    var idx = connections.indexOf(conn);

    debug('removing connection', idx);

    assert(idx > -1, 'Invalid connection');

    connections.splice(idx, 1);

    return conn;
  },

  connectionsCount: function(){
    return connections.length;
  },

  broadcast: function(eventType, data){
    var event = [
      "id: "    + (++eventId),
      "event: " + eventType,
      "data: "  + data,
    ].join("\n") + "\n\n";

    debug('notifying ' + this.connectionsCount() + ' connections');

    connections.forEach(function(conn){
      conn.write(event);
    });
  }
};

function middleware(req, res){
  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');

  res.on('close', function(){
    manager.removeConnection(res);
  });

  manager.addConnection(res);
}

extend(middleware, manager);

module.exports = middleware;
