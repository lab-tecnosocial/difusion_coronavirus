function Persona(x, y) {
  this.pos = new p5.Vector(x, y);
  this.vel = p5.Vector.random2D();
  this.estado = SANO;
  this.tiempoInfeccion = 0;
  
  this.mover = function() {
    if (this.estado == MUERTO) {
      return;
    }
    
    this.pos.add(this.vel);
    this.mantenerEnLimites();
    
    if (this.estado == ENFERMO) {
      this.infectarOtros();
      this.intentarRecuperarse();
    }
  }
  
  this.infectarOtros = function() {
    for (let i = 0; i < _personas.length; i++) {
      let other = _personas[i];
      if (this == other || other.estado != SANO) {
        continue;
      }

      if (dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y) < tamanoPersona) {
        other.setEstado(ENFERMO);
        other.tiempoInfeccion = frameCount;
      }
    }
  }
  
  this.intentarRecuperarse = function() {
    if (frameCount > this.tiempoInfeccion + tiempoRecuperacion) {
      if (random() < tasaMortalidad / 100.0) {
        this.setEstado(MUERTO);
      } else {
        this.setEstado(RECUPERADO);
      }
    }
  }
  
  this.mantenerEnLimites = function() {
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
    
    if (this.estado == SANO) {
      stroke(_colorSanos);
    } else if (this.estado == ENFERMO) {
      stroke(_colorEnfermos);
    } else if (this.estado == RECUPERADO) {
      stroke(_colorRecuperados);
    } else if (this.estado == MUERTO) {
      stroke(_colorMuertos);
    }
    
    point(this.pos.x, this.pos.y);
  }
  
  this.setEstado = function(nuevoEstado) {
    this.estado = nuevoEstado;
    
    if (nuevoEstado == ENFERMO) {
      _nSanos --;
      _nEnfermos++;
    } else if (this.estado == RECUPERADO) {
      _nEnfermos--;
      _nRecuperados++;
    } else if (this.estado == MUERTO) {
      _nEnfermos--;
      _nMuertos++;
    }
  }
}
