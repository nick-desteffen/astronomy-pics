Apod = {};

// TODOS
// - Calendar
// - Random button
// - Download button

var ratyOptions = {
  hints      : ['1', '2', '3', '4', '5'],
  noRatedMsg : 'not rated yet',
  path       : '/assets/images/',
  readOnly   : false,
  starOff    : 'img-full-star-grey.png',
  starOn     : 'img-full-star.png',
  width      : '235px'
}

Apod.Router = Backbone.Router.extend({

  routes: {
    ""      : "navigateToDate",
    ":date" : "navigateToDate"
  },

  initialize: function (options) {
    this.app = options.app
    Backbone.Router.prototype.initialize.apply(this, arguments);
  },

  navigateToDate: function(date){
    this.app.refresh(date);
  }

});

Apod.View = Backbone.View.extend({

  el: "#application",

  currentDate: null,
  currentApod: null,
  router: null,

  events: {
    "click .next":     "nextApod",
    "click .previous": "previousApod",
    "click #rating":   "vote"
  },

  initialize: function () {
    this.router = new Apod.Router({app: this});
    Backbone.history.start({pushState: true});
    Backbone.View.prototype.initialize.apply(this, arguments);
  },

  refresh: function(date){
    this.setDate(date);
    var view = this;
    $.getJSON("apod/" + this.param(), function(data){
      view.currentApod = new Backbone.Model(data);
      $("#title").text(view.currentApod.get('title'));
      $("#explanation").html("<b>Explanation:&nbsp;&nbsp;</b>" + view.currentApod.get('explanation'));
      $("#image_credit").html(view.currentApod.get('image_credit'));
      $("#date").text(view.currentDate.format('MMMM Do, YYYY'))

      if (view.currentApod.get('type') == "image"){
        $("#image").html("<a href='" + view.currentApod.get('high_res_image_path') + "' target='_blank'><img src='" + view.currentApod.get('low_res_image_path') + "' class='img-rounded' /></a>");
      } else {
        $("#image").html('<iframe width="960" height="720" src="' + view.currentApod.get('low_res_image_path') + '" frameborder="0" allowfullscreen></iframe>');
      }
      document.title = view.currentApod.get("title") + " | Astronomy Pics.net"
      view._formatLinks("#explanation a");
      view._formatLinks("#image_credit a");
      view.showAverageRating();
    });

    $('#rating').raty(ratyOptions);
    this.showRating();
  },

  nextApod: function(event){
    event.preventDefault();
    if (this.currentDate.diff(moment(), 'days') < 0) {
      this.currentDate.add("days", 1);
      this.router.navigate(this.param(), {trigger: true});
    }
  },

  previousApod: function(event){
    event.preventDefault();
    this.currentDate.subtract("days", 1);
    this.router.navigate(this.param(), {trigger: true});
  },

  showRating: function(){
    var existingVote = this.storedVote();
    if (existingVote == null){
      $('#rating').raty('readOnly', false);
      $('#rating').raty('reload', {score: undefined});
    } else {
      $('#rating').raty('reload', {score: undefined});
      $('#rating').raty('score', parseInt(existingVote));
      $('#rating').raty('readOnly', true);
    }
  },

  showAverageRating: function(){
    var existingVote = this.storedVote();
    if (existingVote){
      var votes = this.currentApod.get("votes")
      var average = _.reduce(votes, function(memo, num){
        return memo + num;
      }, 0) / votes.length;

      $("#average-rating").text("Average: " + Math.round(average) + " out of " + votes.length + " votes");
    } else {
      $("#average-rating").text("");
    }
  },

  _formatLinks: function(selector){
    var links = $(selector);
    links.each(function(index, link){
      $(link).attr("target", "_blank");
      var href = $(link).attr("href");
      if (href != undefined && !href.match("^http")) {
        $(link).attr("href", "http://apod.nasa.gov/apod/" + href);
      }
    });
  },

  vote: function(event){
    event.preventDefault();
    var existingVote = this.storedVote();
    if (existingVote == null) {
      var vote = $('#rating').raty('score');
      if (vote != ""){
        $.post("apod/" + this.param() + "/vote", {vote: vote});
      }
      localStorage[this.param()] = vote;
      this.currentApod.get("votes").push(vote);
      this.showAverageRating();
    }
  },

  param: function(){
    return this.currentDate.format("YYMMDD");
  },

  storedVote: function(){
    return localStorage.getItem(this.param());
  },

  setDate: function(date){
    if (date == undefined) {
      this.currentDate = moment();
    } else {
      var century = "20";
      if (date[0] == "9") { century = "19" }
      var formattedDate = century + date[0] + date[1] + "-" + date[2] + date[3] + "-" + date[4] + date[5];
      this.currentDate = moment(formattedDate);
    }
  }

});

$(function(){
  window.view = new Apod.View();
  window.view.render();
});
