// reset function
// add hint
window.onload = function () {
var cats = [
["everton", "liverpool", "swansea", "chelsea", "hull", "manchester city", "newcastle united"],
["alien", "dirty harry", "gladiator", "finding nemo", "jaws"],
["manchester", "milan", "madrid", "amsterdam", "prague"]
];
var hints = [
["Based in Mersyside", "Based in Mersyside", "First Welsh team to reach the Premier Leauge", "Owned by A russian Billionaire", "Once managed by Phil Brown", "2013 FA Cup runners up", "Gazza's first club"],
["alien - clue", "dirty harry- clue", "gladiator - clue", "Anamated Fish", "jaws- clue"],
["manchester - clue", "milan - clue", "madrid - clue", "amsterdam - clue", "prague - clue"]
];
var cat = cats[Math.floor(Math.random() * cats.length)];
var answer = cat[Math.floor(Math.random() * cat.length)];
answer = answer.replace(/\s/g, "-");
console.log(answer);
var a = cats.indexOf(cat);
var b = cat.indexOf(answer);
var results = [];
var lives = 5;
var counter = 0;
var space = 0;
var life = document.getElementById("mylives");
var catagory = document.getElementById("catagory");
var hint = document.getElementById("hint");
var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
't', 'u', 'v', 'w', 'x', 'y', 'z'];
//Reset
//  var reset = document.getElementById("reset");
//  reset.innerHTML = "Reset";
//   reset.onclick = function () {
//     var lives = 5;
//        var counter = 0;
//    life.innerHTML = "You have " + lives + " lives";
//    geuss = 0;
//   var answer = cat[Math.floor(Math.random() * cat.length)];
//   var choice = document.getElementById('choice');
//   results = [];
//   choice.remove();
//   result();
//   console.log(results);
// }
//Catagory
var selectCat = function () {
if (cat === cats[0]) {
catagory.innerHTML = "The Category Is Premier League Football Teams";
} else if (cat === cats[1]) {
catagory.innerHTML = "The Category Is Films";
} else if (cat === cats[2]) {
catagory.innerHTML = "The Category Is Cities";
}
}
selectCat();
// Lives
var comments = function () {
life.innerHTML = "You have " + lives + " lives";
if (lives < 1) {
life.innerHTML = "Game Over. \n The word was " + answer ;
}
for (var i = 0; i < results.length; i++) {
if ((counter + space) === results.length) {
life.innerHTML = "You Win!";
}
}
}
comments();
//Hint
clue.onclick = function() {
hint.innerHTML = "Clue: - " +  hints [a][b];
};
// Create results ul
var result = function () {
for (var i = 0; i < answer.length; i++) {
var correct = document.getElementById('result');
var choice = document.createElement('li');
choice.setAttribute('id', 'choice');
if (answer[i] === "-") {
choice.innerHTML = "-";
space += 1;
} else {
choice.innerHTML = "_";
}
results.push(choice);
correct.appendChild(choice);
}
}
result();
// OnClick Function
var check = function () {
list.onclick = function () {
//alert(this.innerHTML);
var geuss = (this.innerHTML);
this.setAttribute("class", "active");
this.onclick = null;
for (var i = 0; i < answer.length; i++) {
if (answer[i] === geuss) {
console.log("yes");
results[i].innerHTML = geuss;
counter += 1;
} else {
console.log("no");
}
}
var j = (answer.indexOf(geuss));
if (j === -1) {
lives -= 1;
comments();
} else {
comments();
}
}
}
// create alphabet ul
for (var i = 0; i < alphabet.length; i++) {
var letters = document.getElementById('alphabet');
var list = document.createElement('li');
list.id = 'letter';
list.innerHTML = alphabet[i];
check();
letters.appendChild(list);
}
}