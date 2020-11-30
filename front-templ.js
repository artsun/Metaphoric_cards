<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<title>Metaphoric</title>
<link href="https://www.jqueryscript.net/css/jquerysctipttop.css" rel="stylesheet" type="text/css">
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
<script src="js/cardlib.js"></script>
<style>
  body { /*font-family: 'Roboto Condensed';*/ background: url('back.jpg');}

.dcard-area {
  padding-top: 10px;
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
</head>

<body>

  <nav class="navbar navbar-dark navbar-expand-md fixed-top" >

    <div class="mx-auto">
        <a class="navbar-brand mx-auto " href="{{ url_for('common.main_page') }}"><h3><b>Metaphoric</b></h3></a>
    </div>
    <div class="navbar-collapse">
        <ul class="navbar-nav ml-auto">

            <li class="nav-item">
                <a class="nav-link" href="{{ url_for('common.profile_page') }}"><h4><b>Профиль</b></h4></a>
            </li>

            <li class="nav-item">
                <a class="nav-link" href="{{ url_for('auth.login_page') }}"><h4><b>Авторизоваться</b></h4></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="{{ url_for('auth.signup_page') }}"><h4><b>Регистрация</b></h4></a>
            </li>

            <li class="nav-item">
                <a class="nav-link" href="{{ url_for('auth.logout_page') }}"><h4><b>Выход</b></h4></a>
            </li>

        </ul>
    </div>
</nav>

 <div class="row"><br><br><br><br><br></div>


 <div class="row">
  <div class="col-1 ml-5 mr-5"><img id="deck" src="cb.png" style="border-radius: 10px; width: 215px; height: 310px;"><br><br><img id="flower" src="flower.svg" height="300" width="300" /></div>
  <div class="col-9 ml-5"><div id="deck_prev"></div><div id="dc_area" class="dcard-area"></div></div><div class="col-2"></div> 
 </div>
 <div class="row"><br><br><br><br><br></div>


<script src="https://code.jquery.com/jquery-1.12.4.min.js" integrity="sha384-nvAa0+6Qg9clwYCGGPpDQLVpLNn0fRaROjHqs13t4Ggj3Ez50XnGQqc/r8MhnRDZ" crossorigin="anonymous"></script>
<script src="dist/draggabilly.pkgd.js"></script>

<script>
  // external js: draggabilly.pkgd.js

const MAX_CARDS = 9;
const CONT = false;
let CARDS_IN_PREV = new Array();

$(document).ready( function() {
  var $draggables = $('.draggable').draggabilly({containment: CONT, grid: [ 10, 10 ]});
});


function click_to_area(e){
  
  let card = CARDS_IN_PREV.pop();
  let txt = document.getElementById('deck_prev').innerHTML;
  document.getElementById('dc_area').innerHTML += `<div>${txt}</div>`;
  if (CARDS_IN_PREV.length === 0) {  // in preview no more
    document.getElementById('deck_prev').innerHTML="";

    // add listeners
    for (let el of document.getElementsByClassName("draggable")) el.addEventListener('dblclick', function (e) {back_change(el);});
    $(document).ready( function() {var $draggables = $('.draggable').draggabilly({containment: CONT, grid: [ 10, 10 ]}); });
    return ;
  };

  //if left more in prev
  card = CARDS_IN_PREV.pop();
  document.getElementById('deck_prev').innerHTML = `<div id="${card}" class="draggable" cb="" style="background-image: url('deck/${card.slice(2)}.gif');"></div>`;
  CARDS_IN_PREV.push(card);
  
  // add listeners
  $(document).ready( function() {var $draggables = $('.draggable').draggabilly({containment: CONT, grid: [ 10, 10 ]}); });
  for (let el of document.getElementsByClassName("draggable")) el.addEventListener('dblclick', function (e) {back_change(el);});
  
}

function relist(){
  if (CARDS_IN_PREV.length === 0) return ;
  CARDS_IN_PREV = new Array();
  document.getElementById('deck_prev').innerHTML=""; 
  document.getElementById('fdeck').outerHTML='<img id="deck" src="cb.png" style="border-radius: 10px; width: 215px; height: 310px;">';
  document.getElementById('deck').addEventListener('click', function (e) {deckClick();});
}

// click on deck
function deckClick(){
  let cards_on_board = {};
  for (let item of document.getElementById('dc_area').getElementsByClassName("draggable")) {cards_on_board[item.id]=item.style.backgroundImage;}
  if (MAX_CARDS === (Object.keys(cards_on_board).length + CARDS_IN_PREV.length)) {
   document.getElementById('deck_prev').innerHTML=""; CARDS_IN_PREV = new Array();
   return ; }

  //  get random card
  let rnum = getRandomInt(1, MAX_CARDS); let newcard = `dc${rnum}`;
  while (Object.keys(cards_on_board).includes(newcard) || CARDS_IN_PREV.includes(newcard)) {rnum = getRandomInt(1, MAX_CARDS); newcard = `dc${rnum}`;}
  let deck_prev = document.getElementById('deck_prev');
  CARDS_IN_PREV.push(newcard);

  deck_prev.innerHTML =`<div id="${newcard}" class="draggable" cb="" style="background-image: url('deck/${rnum}.gif');"></div>`;
  if (MAX_CARDS === (Object.keys(cards_on_board).length + CARDS_IN_PREV.length)) {
    document.getElementById('deck').outerHTML='<img id="fdeck" src="flower.svg" height="300" width="300" />';
    document.getElementById('fdeck').addEventListener('click', function (e) {relist();});
  }

  // add listeners
  $(document).ready( function() {var $draggables = $('.draggable').draggabilly({containment: CONT, grid: [ 10, 10 ]}); });  
}

function reset(){
  CARDS_IN_PREV = new Array();
  document.getElementById('deck_prev').innerHTML="";
  document.getElementById('dc_area').innerHTML="";
  document.getElementById('fdeck').outerHTML='<img id="deck" src="cb.png" style="border-radius: 10px; width: 215px; height: 310px;">';
  document.getElementById('deck').addEventListener('click', function (e) {deckClick();});
}

function make_upper(item){
  
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
  if (actual_value === ""){item.setAttribute('cb', item.style.backgroundImage);  item.style.backgroundImage = "url('cb.png')"; }
  else { item.style.backgroundImage = actual_value; item.setAttribute('cb', "");}
  // add listeners
  $(document).ready( function() {var $draggables = $('.draggable').draggabilly({containment: CONT, grid: [ 10, 10 ]}); });
}


// add listeners
document.getElementById('deck').addEventListener('click', function (e) {deckClick();});
document.getElementById('deck_prev').addEventListener('click', function (e) {click_to_area(e);});
document.getElementById('flower').addEventListener('click', function (e) {reset();});

for (let el of document.getElementsByClassName("draggable")) {el.addEventListener('dblclick', function (e) {back_change(el);})};




</script>


<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
</body>
</html>

