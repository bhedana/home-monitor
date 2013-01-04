var _ = require('underscore');

function jsonPacker(data, structure, opts){
  this.opts = opts || {} 
  this.structure = structure;
  this.data = data;
  this.bufferSize = this.opts.size || 100;
  this.buffer = new Buffer(this.bufferSize);
  this.buffer.fill(0);
  this.marker = 0;

}

jsonPacker.prototype.pack = function(){
  var self = this;
  this.packers.uint8.apply(this, [this.structure.type]); 
  for (var y = 0; y < this.structure.keys.length; y++){
    var element = this.structure.keys[y];
    self.packers[element.valuetype].apply(self, [self.data[element.name]]); 
  }
  return this.buffer;
}
//note all functions use Little Endian for simplication on arduino side
jsonPacker.prototype.packers = { 
	uint8: function (value) { 
    this.buffer.writeUInt8(value, this.marker);
    this.marker +=1;},
	uint16: function (value){
    this.buffer.writeUInt16LE(value, this.marker)
    this.marker +=2;},
	uint32: function (value){ 
    this.buffer.writeUInt32LE(value, this.marker)
    this.marker +=4;},
	int8: function (value) { 
    this.buffer.writeInt8(value, this.marker)
    this.marker +=1;},
	int16: function (value) { 
    this.buffer.writeInt16LE(value, this.marker)
    this.marker +=2;},
	int32: function (value) { 
    this.buffer.writeInt32LE(value, this.marker)
    this.marker +=4;},
	float32: function (value) { 
    this.buffer.writeFloatLE(value, this.marker)
    this.marker +=4;},
	float64: function (value) { 
    this.buffer.writeDoubleLE(value, this.marker)
    this.marker +=8;},
  string: function(value){
    this.marker += this.buffer.write(value, this.marker);}
}
module.exports= jsonPacker;
