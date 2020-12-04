
{% extends "base.html" %}
{% block heads %}
    <script src="static/js/cardlib.js"></script>
<style>
  body { /*font-family: 'Roboto Condensed';*/ background: url('static/common/back.jpg');}

.dcard-area {
  height: 1000px;
  margin-top: 50px auto;
  margin-bottom: 100px auto;
}
.dcard-choose-area {
  padding-top: 10px;
  height: 310px;
  width: 215px;
}
.draggable {
  width: 215px;
  height: 310px;
  border-radius: 10px;
  margin: 0px 10px 10px 0px;
  float: left;
  position: absolute;


}
.draggable.is-pointer-down {
  z-index: 1; /* above other draggies */
}
.draggable.is-dragging { opacity: 1; }


</style>
{% endblock %}

{% block page_content %}


<br>
<br>
<br>
<br>
{% load static %}


 <div class="row"><br><br><br><br><br></div>


 <div class="row">
  <div class="col-2 ml-5 mr-0">
  	<img id="deck" src="static/common/cb.png" style="border-radius: 10px; width: 215px; height: 310px;">
      <br>
      <br>
    <img id="flower" src="static/common/flower.svg" height="300" width="300" />
  </div>
  <div class="col-8"><div id="dc_area" class="dcard-area"></div></div>
  <div class="col-2"></div>
 </div>
 <div class="row"><br><br><br><br><br></div>

{% for card in cards %}
      <div id="{{ card.title }}"  style="background-image: url( '{% static card.image %}' );"></div><br>
{% endfor %}

<br>
<br>
<br>
<br>
{% endblock %}

{% block scripts %}
<script src="static/js/draggabilly.pkgd.js"></script>
  <script>

const MAX_CARDS = 5;
const CONT = false;
let ENLISTED = 0;
let CARDS_IN_PREV = new Array();
let CARDS_IN_GAME = new Array();

$(document).ready( function() {
  var $draggables = $('.draggable').draggabilly({containment: CONT, grid: [ 10, 10 ]});
});


function dcToArea(item){

  let card = CARDS_IN_PREV.pop();
  item.setAttribute('prev', '0');

  CARDS_IN_GAME.push(card);

  // add listeners
  $(document).ready( function() {var $draggables = $('.draggable').draggabilly({containment: CONT, grid: [ 10, 10 ]}); });
  for (let el of document.getElementsByClassName("draggable")) el.addEventListener('dblclick', function (e) {back_change(el);});

}

function relist(){
  if (CARDS_IN_PREV.length === 0) return ;
  ENLISTED = CARDS_IN_GAME.length;
  for (let el of CARDS_IN_PREV) {
   dc = document.getElementById(`${el}`);
   if (dc != null) dc.outerHTML="";
  }
  document.getElementById('fdeck').outerHTML='<img id="deck" src="static/common/cb.png" style="border-radius: 10px; width: 215px; height: 310px;">';
  document.getElementById('deck').addEventListener('click', function (e) {deckClick();});
  
}

// click on deck
function deckClick(){
	let newcard;
	if (MAX_CARDS === (CARDS_IN_GAME.length + CARDS_IN_PREV.length)) {
		if  (CARDS_IN_PREV.length != 0) {
			newcard = CARDS_IN_PREV.shift();  // get card
		} else { return ; }  // no new card
	} else {
		//  get random card
		newcard = `dc${getRandomInt(1, MAX_CARDS)}`;
	    while (CARDS_IN_GAME.includes(newcard) || CARDS_IN_PREV.includes(newcard)) newcard = `dc${getRandomInt(1, MAX_CARDS)}`;
	}

	ENLISTED += 1;
	CARDS_IN_PREV.push(newcard);
	document.getElementById('dc_area').innerHTML += `<div id="${newcard}" class="draggable" prev="1" cb="" style="background-image: url('static/${newcard.slice(2)}.gif');"></div>`;
    if (MAX_CARDS === ENLISTED) {
      document.getElementById('deck').outerHTML='<img id="fdeck" src="static/common/flower.svg" height="300" width="300" />';
      document.getElementById('fdeck').addEventListener('click', function (e) {relist();});
   }
    // add listeners
    $(document).ready( function() {var $draggables = $('.draggable').draggabilly({containment: CONT, grid: [ 10, 10 ]}); });
}

function reset(){
	ENLISTED = 0;
	CARDS_IN_PREV = new Array();
	CARDS_IN_GAME = new Array();
	document.getElementById('dc_area').innerHTML="";
	let fdeck = document.getElementById('fdeck');
	if (fdeck != null) {
		fdeck.outerHTML='<img id="deck" src="static/common/cb.png" style="border-radius: 10px; width: 215px; height: 310px;">';
		document.getElementById('deck').addEventListener('click', function (e) {deckClick();});
	}
}

function updater(item){
	if (item.getAttribute('prev') === "1"){ dcToArea(item);}

  let card_list = document.getElementById('dc_area').getElementsByClassName("draggable");

  let card_arr = new Array();
  for (let el of card_list) {if (el.id!=item.id) card_arr.push(el);}
  document.getElementById('dc_area').innerHTML = "";
  for (let el of card_arr) {document.getElementById('dc_area').innerHTML += el.outerHTML;}
  document.getElementById('dc_area').innerHTML += item.outerHTML;
  // add listeners
  $(document).ready( function() {var $draggables = $('.draggable').draggabilly({containment: CONT, grid: [ 10, 10 ]}); });
  for (let el of document.getElementsByClassName("draggable")) el.addEventListener('dblclick', function (e) {back_change(el);});
}

function back_change(item){
  let actual_value = item.getAttribute('cb');
  if (actual_value === ""){item.setAttribute('cb', item.style.backgroundImage);  item.style.backgroundImage = "url('static/common/cb.png')"; }
  else { item.style.backgroundImage = actual_value; item.setAttribute('cb', "");}
  // add listeners
  $(document).ready( function() {var $draggables = $('.draggable').draggabilly({containment: CONT, grid: [ 10, 10 ]}); });
}


// add listeners
document.getElementById('deck').addEventListener('click', function (e) {deckClick();});
document.getElementById('flower').addEventListener('click', function (e) {reset();});

for (let el of document.getElementsByClassName("draggable")) {el.addEventListener('dblclick', function (e) {back_change(el);})};
</script>
{% endblock %}
