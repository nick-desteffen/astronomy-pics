Apod = {};

var ratyOptions = {
  hints      : ['1', '2', '3', '4', '5'],
  noRatedMsg : 'not rated yet',
  path       : '/assets/images/',
  readOnly   : false,
  starOff    : 'img-full-star-grey.png',
  starOn     : 'img-full-star.png',
  width      : '235px'
}

Apod.View = Backbone.View.extend({

  el: "#application",

  currentDate: null,
  currentApod: null,

  events: {
    "click .next":     "nextApod",
    "click .previous": "previousApod",
    "click #rating":   "vote"
  },

  initialize: function () {
    this.currentDate = moment();
    Backbone.View.prototype.initialize.apply(this, arguments);
  },

  render: function(){
    this._getApod();
    this.ratingElement().raty(ratyOptions);
    this.showRating();

    return this.$el;
  },

  nextApod: function(event){
    event.preventDefault();
    if (this.currentDate.diff(moment(), 'days') < 0) {
      this.currentDate.add("days", 1);
      this._getApod();
      this.showRating();
    }
  },

  previousApod: function(event){
    event.preventDefault();
    this.currentDate.subtract("days", 1);
    this._getApod();
    this.showRating();
  },

  _getApod: function(){
    var view = this;
    $.getJSON("apod/" + this.param(), function(data){
      view.currentApod = new Backbone.Model(data);
      $("#title").text(view.currentApod.get('title'));
      $("#explanation").html("<b>Explanation:&nbsp;&nbsp;</b>" + view.currentApod.get('explanation'));
      $("#image_credit").html(view.currentApod.get('image_credit'));
      $("#date").text(view.currentDate.format('MMMM Do, YYYY'))
      view.showAverageRating();

      if (view.currentApod.get('type') == "image"){
        $("#image").html("<img src='" + view.currentApod.get('low_res_image_path') + "' class='img-rounded' />");
      } else {
        $("#image").html('<iframe width="960" height="720" src="' + view.currentApod.get('low_res_image_path') + '" frameborder="0" allowfullscreen></iframe>');
      }

      view._formatLinks("#explanation a");
      view._formatLinks("#image_credit a");
    });
  },

  showRating: function(){
    var existingVote = this.storedVote();
    var ratingElement = this.ratingElement();
    if (existingVote == null){
      ratingElement.raty('readOnly', false);
      ratingElement.raty('reload', {score: undefined});
    } else {
      ratingElement.raty('reload', {score: undefined});
      ratingElement.raty('score', parseInt(existingVote));
      ratingElement.raty('readOnly', true);
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
      var vote = this.ratingElement().raty('score');
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

  ratingElement: function(){
    return $("#rating");
  }

});

$(function(){
  window.view = new Apod.View();
  window.view.render();
});
