'use strict';

var classes = require('component-classes')
  , Emitter = require('component-emitter')
  , noop    = function() { };

module.exports = Accordion;

var defaults = {
  deselect:     true,
  multiselect:  false,
  entry:        '.hentry',
  title:        '.entry-title'
};

function Accordion(el,options) {
  if (!(this instanceof Accordion)) return new Accordion(el,options);

  options = merge(defaults, options || {})

  this.selectBehavior   = (options.multiselect ? noop : this.deselectAll);
  this.reselectBehavior = (options.deselect ? this.deselect : noop);
  this.entrySelector = options.entry;
  this.entryTitle = options.title;
  this.panels = [];
  this.el = el;
  if (el) this.bind(el);
  this.deselectAll();
  return this;
}

Accordion.prototype = new Emitter;

Accordion.prototype.bind = function(el){
  if (typeof el=='string') el = document.querySelector(el);
  var items = el.querySelectorAll(this.entrySelector);
  for (var i=0;i<items.length;++i) {
    this.panels.push(new Panel(this, items[i]));
  }
  classes(el).add('accordion');
  return this;
}

Accordion.prototype.deselectAll = function(){
  for (var i=0;i<this.panels.length;++i) {
    this.deselect(this.panels[i])
  }
  return this;
}

Accordion.prototype.select = function(panel){
  if (panel.selected){
    this.reselectBehavior(panel);
  } else {
    this.selectBehavior(panel);
    classes(panel.el).add('selected');
    panel.selected = true;
    this.emit('select',panel);
  }
}

Accordion.prototype.deselect = function(panel){
  classes(panel.el).remove('selected');
  panel.selected = false;
  this.emit('deselect', panel);
}


function Panel(container,el) {
  if (!(this instanceof Panel)) return new Panel(container,el);

  this.container = container;
  this.el = el;
  this.selected = false;
  if (el) this.bind(el);
  return this;
}

Panel.prototype.bind = function(el){
  var self = this;
  var title = el.querySelector(self.container.entryTitle);
  title.onclick = function(){ self.container.select(self) };
}

// private

var has = Object.prototype.hasOwnProperty;

var mergeInto = function(a,b){
  for (var key in b) {
    if (has.call(b,key)){
      a[key] = b[key];
    }
  }
  return a;
}

// non-mutating merge
var merge = function(a,b){
  var m = mergeInto({},a);
  return mergeInto(m,b);
}

