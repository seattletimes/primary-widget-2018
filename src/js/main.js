// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
var $ = require("./lib/qsa");
var Tabletop = require("tabletop");
var key = "1dDoErtOImXlt3ivZBCnl95uygeV-XkxOfeTejP21J-8";

var resultsContainer = $.one(".races");

var fi = (condition, value) => condition ? value : "";

var raceTemplate = data => `
  <section class="race">
    <h3>${data.name}</h3>
    <ul class="results">
      ${data.candidates.map(c => `
      <li>
        <span class="name ${c.called ? "called" : ""}">${c.candidate}</span>
        <span class="divider"></span>
        <span class="result">${c.votes.toLocaleString().replace(/\.0+$/, "")}</span>
      `).join("")}
    </ul>
  </section>
`;

var callback = function(table) {
  var races = {};
  table.results.elements.forEach(function(el) {
    if (!races[el.race]) races[el.race] = {
      name: el.race,
      total: 0,
      candidates: []
    };
    var race = races[el.race];
    race.candidates.push(el);
    race.total += el.votes * 1;
  });
  var innerHTML = "";
  for (var r in races) {
    races[r].candidates.sort((a, b) => b.votes - a.votes);
    innerHTML += raceTemplate(races[r]);
  }
  resultsContainer.classList.remove("loading");
  resultsContainer.innerHTML = innerHTML;
  setTimeout(() => table.results.tabletop.fetch(), 30000);
}

new Tabletop({ key, callback, wanted: ["results"] });

