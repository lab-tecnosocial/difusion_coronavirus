/*
Simulación de difusión de coronavirus
=====================================

Autor: Alex Ojeda Copa
Organización: labtecnosocial.org

Una simulación de acuerdo a diferentes parametros: población, tasa de mortalidad y distancia social.

Basado inicialmene en este artículo: https://www.washingtonpost.com/graphics/2020/world/corona-simulator-spanish/ y en el skecth de Jason Labbe: https://www.openprocessing.org/sketch/858150/

Se puso el gráfico en un envoltorio HTML, se tradujeron las variables, se modificaron los controles de los parametros de la simulación, integrando paneles con sliders.
*/

var poblacion = 200;
var tamanoPersona = 12;
var tiempoRecuperacion = 800; 
var tasaMortalidad = 7; // sobre 100%
var distanciaSocial = 0; // sobre 100%. Recomendados: 0, 30, 85


var _limites = 600;
var _personas = [];

var _nSanos = 0;
var _nEnfermos = 0;
var _nRecuperados = 0;
var _nMuertos = 0;
var _nDistanciaSocial = 0;

var _colorSanos;
var _colorEnfermos;
var _colorRecuperados;
var _colorMuertos;

const SANO = 0;
const ENFERMO = 1;
const RECUPERADO = 2;
const MUERTO = 3;



function setup() {
  background(51);

  
  // Panel de datos
  
  pob = select('#pob');
  mort = select('#mort');
  soc = select('#soc');
  
  pobSlider = select('#pobSlider');
  mortSlider = select('#mortSlider');
  socSlider = select('#socSlider');
  ini = select('#ini');

  textStyle(BOLD);
  
  _colorSanos = color(80, 200, 80);
  _colorEnfermos = color(210, 200, 0);
  _colorRecuperados = color(203, 138, 192);
  _colorMuertos = color(255, 50, 50);
  
  // Boton de inicio
  ini.mousePressed(iniciar);
  
  createP('');
  
  let canvas = createCanvas(_limites, _limites + 100);
  canvas.parent('content');

  img = loadImage('logo-lab.png');

  
  resetSim();
}

function draw() {

  
  poblacion = pobSlider.value();
  tasaMortalidad = mortSlider.value();
  distanciaSocial = socSlider.value();
  
  pob.html(pobSlider.value());
  mort.html(mortSlider.value() + "%");
  soc.html(socSlider.value() + "%");

  noStroke();
  fill(255);
  rect(0, 0, _limites, _limites);
  
  for (let i = 0; i < _personas.length; i++) {
    _personas[i].move();
    _personas[i].display();
  }
  
  displayStats();
  
  if (_nEnfermos == 0) {
    displayEnd();
  } else {
    displayGrapth();
  }
  image(img, 520, 540, img.width / 4, img.height / 4);
}


function resetSim() {
  frameCount = 0;
  _personas = [];
  _nSanos = poblacion;
  _nEnfermos = 0;
  _nRecuperados = 0;
  _nMuertos = 0;
  _nDistanciaSocial = 0;
  
  noStroke();
  fill(100);
  rect(0, _limites, _limites, _limites - 100);
  
  for (let i = 0; i < poblacion; i++) {
    let person = new Person(random(_limites), random(_limites));
    _personas.push(person);
    
    if (i / poblacion * 100 < distanciaSocial) {
      person.vel.mult(0);
      _nDistanciaSocial++;
    }
  }
  
  let patientZero = _personas[floor(random() * _personas.length)];
  patientZero.setState(ENFERMO);
  patientZero.vel = p5.Vector.random2D(); // El paciente cero no práctica distancia social
}

function displayStats() {
  noStroke();
  textAlign(LEFT);
  textSize(14);
  
  fill(51, 200);
  rect(0, 0, 200, 100);
  
  fill(0);
  
  fill(_colorSanos);
  text("Sanos: " + _nSanos + " (" + percentage(_nSanos, _personas.length) + "%)", 10, 20);
  
  fill(_colorEnfermos);
  text("Enfermos: " + _nEnfermos + " (" + percentage(_nEnfermos, _personas.length) + "%)", 10, 40);
  
  fill(_colorMuertos);
  text("Decesos: " + _nMuertos + " (" + percentage(_nMuertos, _personas.length) + "%)", 10, 60);
  
  fill(_colorRecuperados);
  text("Recuperados: " + _nRecuperados + " (" + percentage(_nRecuperados, _personas.length) + "%)", 10, 80);
}

function displayGrapth() {
  let sickHeight = map(_nEnfermos, 0, _personas.length, height - 100, height) - _limites;
  let normalHeight = map(_nSanos, 0, _personas.length, height - 100, height) - _limites;
  let recoveryHeight = map(_nRecuperados, 0, _personas.length, height - 100, height) - _limites;
  let deadHeight = map(_nMuertos, 0, _personas.length, height - 100, height) - _limites;
  
  let speed = frameCount * 0.25;
  let y = height;
  
  strokeWeight(1);
  
  stroke(_colorMuertos);
  line(speed, y, speed, y - deadHeight);
  y -= deadHeight;
  
  stroke(_colorEnfermos);
  line(speed, y, speed, y - sickHeight);
  y -= sickHeight;
  
  stroke(_colorSanos);
  line(speed, y, speed, y - normalHeight);
  y -= normalHeight;
  
  stroke(_colorRecuperados);
  line(speed, y, speed, y - recoveryHeight);
  //y -= recoveryHeight;
}

function displayEnd() {
  noStroke();
  fill(0);
  textAlign(CENTER);
  textSize(60);
  text("Brote completo", width / 2, height / 2);
}

function percentage(value, maxValue) {
  return (value / maxValue * 100.0).toFixed(1);
}


function iniciar() {
  resetSim();
}
