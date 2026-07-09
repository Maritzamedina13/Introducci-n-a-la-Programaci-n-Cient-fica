(function(){
"use strict";

var DATA = window.QUIZ_DATA;
if(!DATA){ throw new Error("quiz.js: falta window.QUIZ_DATA (¿olvidaste incluir el <script> de datos antes de assets/quiz.js?)"); }

var TOPICS = DATA.topics;
var BANK = DATA.bank;
var META = DATA.meta;
var QUIZ_LEN = Math.min(META.quizLen || 30, BANK.length);
var topicCount = Object.keys(TOPICS).length;

/* ---------------- build page shell ---------------- */
document.title = META.pageTitle || META.title;

var companionLink = META.companion
  ? '<p class="sub"><a class="back-link" href="' + META.companion.href + '">' + META.companion.label + ' →</a></p>'
  : "";

var app = document.getElementById("app");
app.innerHTML =
  '<header class="top">' +
    '<span class="eyebrow">' + META.eyebrow + '</span>' +
    '<h1>' + META.title + '</h1>' +
    '<p class="sub">' + META.sub + '</p>' +
    companionLink +
    '<p class="sub"><a class="back-link" href="../index.html">← Todos los módulos</a></p>' +
  '</header>' +

  '<section id="screen-start" class="card start-card">' +
    '<div class="eyebrow" style="margin-bottom:6px;">Elige el modo</div>' +
    '<div class="mode-grid">' +
      '<button class="mode-opt selected" data-mode="study" id="mode-study">' +
        '<span class="tag">Estudiar</span>' +
        '<span class="name">Revisión instantánea</span>' +
        '<span class="desc">Ves si acertaste justo al elegir cada respuesta, con la explicación al momento. Ideal para repasar.</span>' +
      '</button>' +
      '<button class="mode-opt" data-mode="eval" id="mode-eval">' +
        '<span class="tag">Evaluar</span>' +
        '<span class="name">Revisión al final</span>' +
        '<span class="desc">No hay pistas mientras respondes. Ves la corrección completa y tu nota al terminar las ' + QUIZ_LEN + ' preguntas.</span>' +
      '</button>' +
    '</div>' +
    '<div class="stats-line">' +
      '<span>Banco de preguntas: <b id="bank-total">' + BANK.length + '</b></span>' +
      '<span>Preguntas por partida: <b>' + QUIZ_LEN + '</b></span>' +
      '<span>Temas cubiertos: <b>' + topicCount + '</b></span>' +
    '</div>' +
    '<div class="btn-row">' +
      '<button class="btn" id="start-btn">Comenzar quiz →</button>' +
    '</div>' +
  '</section>' +

  '<section id="screen-quiz" class="hidden">' +
    '<div class="progress-row">' +
      '<span class="progress-count mono" id="progress-count">1 / ' + QUIZ_LEN + '</span>' +
      '<div class="progress-track"><div class="progress-fill" id="progress-fill" style="width:0%"></div></div>' +
      '<span id="mode-badge" class="mode-pill">Estudiar</span>' +
    '</div>' +
    '<div class="card q-card">' +
      '<div class="q-meta">' +
        '<span class="topic-pill" id="topic-pill">…</span>' +
      '</div>' +
      '<p class="q-text" id="q-text">…</p>' +
      '<div class="q-img-wrap" id="q-img-wrap"></div>' +
      '<div class="options" id="options"></div>' +
      '<div id="feedback"></div>' +
    '</div>' +
    '<div class="nav-row">' +
      '<button class="btn" id="next-btn" disabled>Siguiente →</button>' +
    '</div>' +
  '</section>' +

  '<section id="screen-results" class="hidden">' +
    '<div class="card score-card">' +
      '<div class="ring-wrap">' +
        '<svg width="128" height="128" viewBox="0 0 128 128">' +
          '<circle class="ring-bg" cx="64" cy="64" r="54"></circle>' +
          '<circle class="ring-fg" id="ring-fg" cx="64" cy="64" r="54" stroke-dasharray="339.3" stroke-dashoffset="339.3"></circle>' +
        '</svg>' +
        '<div class="ring-label">' +
          '<span class="pct" id="result-pct">0%</span>' +
          '<span class="frac" id="result-frac">0/' + QUIZ_LEN + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="score-copy">' +
        '<h2 id="result-title">Resultado</h2>' +
        '<p id="result-copy">…</p>' +
      '</div>' +
    '</div>' +
    '<div class="card breakdown">' +
      '<h3>Resultado por tema</h3>' +
      '<div id="topic-breakdown"></div>' +
    '</div>' +
    '<div class="btn-row">' +
      '<button class="btn" id="restart-btn">Nueva partida →</button>' +
    '</div>' +
    '<div class="review" id="review-list"></div>' +
  '</section>';

/* ---------------- helpers ---------------- */
function shuffle(arr){
  var a = arr.slice();
  for(var i=a.length-1;i>0;i--){
    var j = Math.floor(Math.random()*(i+1));
    var tmp=a[i]; a[i]=a[j]; a[j]=tmp;
  }
  return a;
}
function sample(arr, n){ return shuffle(arr).slice(0,n); }
function letterFor(i){ return String.fromCharCode(65+i); }

/* ---------------- state ---------------- */
var state = { mode:"study", questions:[], idx:0, answers:[] };

/* ---------------- DOM refs ---------------- */
var screenStart = document.getElementById("screen-start");
var screenQuiz = document.getElementById("screen-quiz");
var screenResults = document.getElementById("screen-results");
var modeStudyBtn = document.getElementById("mode-study");
var modeEvalBtn = document.getElementById("mode-eval");
var startBtn = document.getElementById("start-btn");
var restartBtn = document.getElementById("restart-btn");
var nextBtn = document.getElementById("next-btn");

modeStudyBtn.addEventListener("click", function(){ selectMode("study"); });
modeEvalBtn.addEventListener("click", function(){ selectMode("eval"); });
function selectMode(m){
  state.mode = m;
  modeStudyBtn.classList.toggle("selected", m==="study");
  modeEvalBtn.classList.toggle("selected", m==="eval");
}

startBtn.addEventListener("click", function(){
  buildQuiz();
  screenStart.classList.add("hidden");
  screenQuiz.classList.remove("hidden");
  screenResults.classList.add("hidden");
  renderQuestion();
});

restartBtn.addEventListener("click", function(){
  screenResults.classList.add("hidden");
  screenStart.classList.remove("hidden");
});

nextBtn.addEventListener("click", function(){
  if(state.idx < state.questions.length - 1){
    state.idx++;
    renderQuestion();
  } else {
    showResults();
  }
});

function buildQuiz(){
  var picked = sample(BANK, QUIZ_LEN);
  state.questions = picked.map(function(item){
    var order = shuffle([0,1,2,3]);
    var opts = order.map(function(oi){ return item.o[oi]; });
    var correctIdx = order.indexOf(item.c);
    return { t:item.t, q:item.q, o:opts, c:correctIdx, e:item.e, img:item.img || null };
  });
  state.idx = 0;
  state.answers = new Array(state.questions.length).fill(null);
}

function renderQuestion(){
  var i = state.idx;
  var item = state.questions[i];
  document.getElementById("progress-count").textContent = (i+1) + " / " + state.questions.length;
  document.getElementById("progress-fill").style.width = (((i+1)/state.questions.length)*100) + "%";
  document.getElementById("mode-badge").textContent = state.mode === "study" ? "Estudiar" : "Evaluar";
  document.getElementById("topic-pill").textContent = "TEMA " + String(item.t).padStart(2,"0") + " · " + TOPICS[item.t];
  document.getElementById("q-text").textContent = item.q;

  var imgWrap = document.getElementById("q-img-wrap");
  imgWrap.innerHTML = "";
  if(item.img){
    var img = document.createElement("img");
    img.className = "q-img";
    img.src = item.img;
    img.alt = "Gráfico de la pregunta";
    imgWrap.appendChild(img);
  }

  var optsWrap = document.getElementById("options");
  optsWrap.innerHTML = "";
  var fb = document.getElementById("feedback");
  fb.innerHTML = "";
  nextBtn.disabled = true;
  nextBtn.textContent = (i === state.questions.length - 1) ? "Ver resultados →" : "Siguiente →";

  var already = state.answers[i];

  item.o.forEach(function(optText, oi){
    var b = document.createElement("button");
    b.className = "opt";
    b.innerHTML = '<span class="letter">' + letterFor(oi) + '</span><span class="label"></span>';
    b.querySelector(".label").textContent = optText;
    b.addEventListener("click", function(){ selectOption(oi); });
    optsWrap.appendChild(b);
  });

  if(already !== null){
    applyAnswerState(already);
  }
}

function selectOption(oi){
  var i = state.idx;
  if(state.answers[i] !== null) return;
  state.answers[i] = oi;
  applyAnswerState(oi);
}

function applyAnswerState(oi){
  var i = state.idx;
  var item = state.questions[i];
  var buttons = document.querySelectorAll("#options .opt");
  var isCorrect = oi === item.c;

  buttons.forEach(function(btn, idx){
    btn.disabled = true;
    if(state.mode === "study"){
      if(idx === item.c) btn.classList.add("correct");
      if(idx === oi && idx !== item.c) btn.classList.add("wrong");
      if(idx === oi && idx === item.c) btn.classList.add("chosen");
    } else {
      if(idx === oi) btn.classList.add("chosen");
    }
  });

  var fb = document.getElementById("feedback");
  if(state.mode === "study"){
    fb.className = "feedback " + (isCorrect ? "good" : "bad");
    fb.innerHTML = '<span class="fic">' + (isCorrect ? "✓" : "✗") + '</span><span>' +
      (isCorrect ? "¡Correcto! " : "Incorrecto. La respuesta correcta es la " + letterFor(item.c) + ". ") +
      item.e + "</span>";
  } else {
    fb.className = "";
    fb.innerHTML = "";
  }
  nextBtn.disabled = false;
}

function showResults(){
  screenQuiz.classList.add("hidden");
  screenResults.classList.remove("hidden");

  var total = state.questions.length;
  var correct = 0;
  var byTopic = {};
  state.answers.forEach(function(ans, i){
    var item = state.questions[i];
    var ok = ans === item.c;
    if(ok) correct++;
    if(!byTopic[item.t]) byTopic[item.t] = {ok:0, total:0};
    byTopic[item.t].total++;
    if(ok) byTopic[item.t].ok++;
  });
  var pct = Math.round((correct/total)*100);

  var circumference = 2 * Math.PI * 54;
  var ring = document.getElementById("ring-fg");
  ring.setAttribute("stroke-dasharray", circumference.toFixed(1));
  ring.setAttribute("stroke-dashoffset", (circumference * (1 - correct/total)).toFixed(1));
  document.getElementById("result-pct").textContent = pct + "%";
  document.getElementById("result-frac").textContent = correct + "/" + total;

  var title, copy;
  if(pct >= 90){ title = "Dominio sólido"; copy = "Conoces el temario a fondo. Repite en modo Evaluar para mantenerlo fresco."; }
  else if(pct >= 70){ title = "Buen nivel"; copy = "Vas bien encaminado. Repasa los temas más flojos en el detalle de abajo."; }
  else if(pct >= 50){ title = "En progreso"; copy = "Hay base, pero conviene repasar. Usa el modo Estudiar en los temas peor puntuados."; }
  else { title = "A repasar"; copy = "Conviene volver al material y repetir el quiz en modo Estudiar antes de evaluarte de nuevo."; }
  document.getElementById("result-title").textContent = title;
  document.getElementById("result-copy").textContent = copy;

  var bd = document.getElementById("topic-breakdown");
  bd.innerHTML = "";
  Object.keys(byTopic).map(Number).sort(function(a,b){return a-b;}).forEach(function(t){
    var d = byTopic[t];
    var row = document.createElement("div");
    row.className = "topic-row";
    var barPct = (d.ok/d.total)*100;
    row.innerHTML =
      '<span class="tname">T' + String(t).padStart(2,"0") + ' · ' + TOPICS[t] + '</span>' +
      '<span class="tbar"><span style="width:' + barPct + '%"></span></span>' +
      '<span class="tfrac mono">' + d.ok + '/' + d.total + '</span>';
    bd.appendChild(row);
  });

  var review = document.getElementById("review-list");
  review.innerHTML = "";
  state.questions.forEach(function(item, i){
    var ans = state.answers[i];
    var ok = ans === item.c;
    var div = document.createElement("div");
    div.className = "card review-item " + (ok ? "ok" : "no");
    var yourLine = ans === null
      ? '<div class="rline yours no-text"><b>Tu respuesta:</b> sin responder</div>'
      : '<div class="rline yours ' + (ok?"ok-text":"no-text") + '"><b>Tu respuesta:</b> ' + letterFor(ans) + '. ' + item.o[ans] + '</div>';
    var correctLine = ok ? "" : '<div class="rline"><b>Correcta:</b> ' + letterFor(item.c) + '. ' + item.o[item.c] + '</div>';
    var imgLine = item.img ? '<img class="q-img rev" src="' + item.img + '" alt="Gráfico de la pregunta">' : "";
    div.innerHTML =
      '<div class="rmeta"><span class="topic-pill">T' + String(item.t).padStart(2,"0") + ' · ' + TOPICS[item.t] + '</span></div>' +
      '<p class="rq">' + (i+1) + ". " + item.q + '</p>' +
      imgLine +
      yourLine + correctLine +
      '<div class="rexpl">' + item.e + '</div>';
    review.appendChild(div);
  });
}

})();
