function Person(x, y) {
  this.pos = new p5.Vector(x, y);
  this.vel = p5.Vector.random2D();
  this.state = SANO;
  this.infectedTime = 0;
  
  this.move = function() {
    if (this.state == MUERTO) {
      return;
    }
    
    this.pos.add(this.vel);
    this.keepInBounds();
    
    if (this.state == ENFERMO) {
      this.infectOthers();
      this.tryToRecover();
    }
  }
  
  this.infectOthers = function() {
    for (let i = 0; i < _personas.length; i++) {
      let other = _personas[i];
      if (this == other || other.state != SANO) {
        continue;
      }

      if (dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y) < tamanoPersona) {
        other.setState(ENFERMO);
        other.infectedTime = frameCount;
      }
    }
  }
  
  this.tryToRecover = function() {
    if (frameCount > this.infectedTime + tiempoRecuperacion) {
      if (random() < tasaMortalidad / 100.0) {
        this.setState(MUERTO);
      } else {
        this.setState(RECUPERADO);
      }
    }
  }
  
  this.keepInBounds = function() {
    let halfSize = tamanoPersona / 2;
    
    if (this.pos.x - halfSize < 0 || this.pos.x + halfSize > _limites) {
      this.vel.x *= -1;
      this.pos.x = constrain(this.pos.x, halfSize, _limites - halfSize);
    }
    
    if (this.pos.y - halfSize < 0 || this.pos.y + halfSize > _limites) {
      this.vel.y *= -1;
      this.pos.y = constrain(this.pos.y, halfSize, _limites - halfSize);
    }
  }
  
  this.display = function() {
    strokeWeight(tamanoPersona);
    
    if (this.state == SANO) {
      stroke(_colorSanos);
    } else if (this.state == ENFERMO) {
      stroke(_colorEnfermos);
    } else if (this.state == RECUPERADO) {
      stroke(_colorRecuperados);
    } else if (this.state == MUERTO) {
      stroke(_colorMuertos);
    }
    
    point(this.pos.x, this.pos.y);
  }
  
  this.setState = function(newState) {
    this.state = newState;
    
    if (newState == ENFERMO) {
      _nSanos --;
      _nEnfermos++;
    } else if (this.state == RECUPERADO) {
      _nEnfermos--;
      _nRecuperados++;
    } else if (this.state == MUERTO) {
      _nEnfermos--;
      _nMuertos++;
    }
  }
}
