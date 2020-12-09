

window.getRandomInt = function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.dcToArea = function dcToArea(item){

  let card = CARDS_IN_PREV.pop();
  item.setAttribute('prev', '0');

  CARDS_IN_GAME.push(card);

  // add listeners
  $(document).ready( function() {var $draggables = $('.draggable').draggabilly({containment: CONT, grid: [ 10, 10 ]}); });
  for (let el of document.getElementsByClassName("draggable")) {el.addEventListener('contextmenu', function (e) { cardFlip(e, el);})};
  for (let el of document.getElementsByClassName("draggable")) el.addEventListener('dblclick', function (e) {back_change(e, el);});
}

window.relist = function relist(){
  if (CARDS_IN_PREV.length === 0) return ;
  ENLISTED = CARDS_IN_GAME.length;
  for (let el of CARDS_IN_PREV) {
   dc = document.getElementById(`${el}`);
   if (dc != null) dc.outerHTML="";
  }
  document.getElementById('fdeck').outerHTML='<img id="deck" src="static/common/cb.png" style="border-radius: 10px; width: 215px; height: 310px;">';
  document.getElementById('deck').addEventListener('click', function (e) {deckClick(e, 1);});
  document.getElementById('deck').addEventListener('contextmenu', function (e) { deckClick(e, 0);});
}

// click on deck
window.deckClick = function deckClick(e, rclick){
  $(function () { $('[data-toggle="tooltip"]').tooltip('hide'); });  // hide all tooltips
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
  let nc;
  if (TOOLTIP_FIRST_CARD === 0){  // tooltip
    nc = `<div id="${newcard}" data-toggle="tooltip" class="draggable" prev="1" cb="" fl="" style="background-image: url('static/${newcard.slice(2)}.gif');" title="Потяните карту левой кнопкой мыши"></div>`;    
    TOOLTIP_FIRST_CARD = newcard;
  } else {
    nc = `<div id="${newcard}" class="draggable" prev="1" cb="" fl="" style="background-image: url('static/${newcard.slice(2)}.gif');"></div>`;
  }
  document.getElementById('dc_area').innerHTML += nc;
  if (rclick===1) { back_change(e, document.getElementById(`${newcard}`));} else {e.preventDefault();}
  
  $(function () { $(`[id="${newcard}"]`).tooltip('show'); });  
  $(function () { $(`[id="${newcard}"]`).on('mouseover', function () { $(this).tooltip('disable'); $(this).tooltip('dispose'); })});

  
  if (MAX_CARDS === ENLISTED) {
    document.getElementById('deck').outerHTML='<img id="fdeck" src="static/common/flower.svg" height="300" width="300" />';
    document.getElementById('fdeck').addEventListener('click', function (e) {relist();});
  }
    // add listeners
    for (let el of document.getElementsByClassName("draggable")) {el.addEventListener('dblclick', function (e) { cardFlip(e, el);})};
    $(document).ready( function() {var $draggables = $('.draggable').draggabilly({containment: CONT, grid: [ 10, 10 ]}); });
}

window.shake = function shake(n, e){
  if (n === 16) {document.getElementById('mixer').hidden=1; reset(); return;}  // stop
  deckClick(e, n%2);
  for (let el of document.getElementsByClassName("draggable")) el.style.position='relative';
  setTimeout(shake, 150, n+1, e);
}

window.reset = function reset(){
  $(function () { $('[data-toggle="tooltip"]').tooltip('hide'); });  // hide all tooltips
  ENLISTED = 0;
  CARDS_IN_PREV = new Array();
  CARDS_IN_GAME = new Array();
  document.getElementById('dc_area').innerHTML="";
  let fdeck = document.getElementById('fdeck');
  if (fdeck != null) {
    fdeck.outerHTML='<img id="deck" src="static/common/cb.png" style="border-radius: 10px; width: 215px; height: 310px;">';
    document.getElementById('deck').addEventListener('click', function (e) {deckClick(e, 1);});
    document.getElementById('deck').addEventListener('contextmenu', function (e) { deckClick(e, 0);});
  }
}

window.updater = function updater(item){
  if (item.getAttribute('prev') === "1"){ dcToArea(item);}
  $(function () { $('[data-toggle="tooltip"]').tooltip('hide'); });  // hide all tooltips

  let card_list = document.getElementById('dc_area').getElementsByClassName("draggable");

  let card_arr = new Array();
  for (let el of card_list) {if (el.id!=item.id) card_arr.push(el);}
  document.getElementById('dc_area').innerHTML = "";
  for (let el of card_arr) {document.getElementById('dc_area').innerHTML += el.outerHTML;}
  document.getElementById('dc_area').innerHTML += item.outerHTML;
  
  if (TOOLTIP_FIRST_CARD_MOVED === 0){    
    document.getElementById(`${item.id}`).setAttribute("data-toggle", "tooltip");
    document.getElementById(`${item.id}`).setAttribute("title", "Клик правой - отзеркалить карту, двойной - перевернуть");
    $(function () { $(`[id="${item.id}"]`).tooltip('show'); });
    $(function () { $(`[id="${item.id}"]`).on('mouseout', function () { $(this).tooltip('disable'); $(this).tooltip('hide'); })});
    TOOLTIP_FIRST_CARD_MOVED = 1;
  }

  reportCard(item);
  // add listeners
  $(document).ready( function() {var $draggables = $('.draggable').draggabilly({containment: CONT, grid: [ 10, 10 ]}); });
  for (let el of document.getElementsByClassName("draggable")) {el.addEventListener('contextmenu', function (e) { cardFlip(e, el);})};
  for (let el of document.getElementsByClassName("draggable")) el.addEventListener('dblclick', function (e) {back_change(e, el);});
}

window.back_change = function back_change(e, item){
  let actual_value = item.getAttribute('cb');
  if (actual_value === ""){item.setAttribute('cb', item.style.backgroundImage);  item.style.backgroundImage = "url('static/common/cb.png')"; }
  else { item.style.backgroundImage = actual_value; item.setAttribute('cb', "");}
  // add listeners
  $(document).ready( function() {var $draggables = $('.draggable').draggabilly({containment: CONT, grid: [ 10, 10 ]}); });
}

window.cardFlip = function cardFlip(e, el){
  e.preventDefault();
  if (el.getAttribute('cb') != "") return;  // if back_changed -> no flip
  let actual_value = el.getAttribute('fl');
  if (actual_value === ""){el.setAttribute('fl', el.style.backgroundImage);  el.style.backgroundImage = `url(static/flipped/${el.id.slice(2)}.gif)`; }
  else { el.style.backgroundImage = actual_value; el.setAttribute('fl', "");}
}
