Apod = {};
// Apod.Model = Backbone.Model.extend({

// });

// Apod.Collection = Backbone.Collection.extend({
//   model: Apod.Model
// });

Apod.View = Backbone.View.extend({
  
  el: "#application",

  currentDate: null,
  
  events: {
    "click .next": "nextApod",
    "click .previous": "previousApod",
    "click #submit-vote": "vote"
  },

  initialize: function () {
    this.currentDate = moment();
    Backbone.View.prototype.initialize.apply(this, arguments);
  },

  render: function(){
    this._getApod();
    return this.$el;
  },

  nextApod: function(event){
    event.preventDefault();
    if (this.currentDate.diff(moment(), 'days') < 0) {
      this.currentDate.add("days", 1);
      this._getApod();
    }
  },

  previousApod: function(event){
    event.preventDefault();      
    this.currentDate.subtract("days", 1);
    this._getApod();
  },

  _getApod: function(){
    var view = this;
    $.getJSON("apod/" + this._param(), function(data){
      console.log(data);
      $("#title").text(data.title);
      $("#explanation").html(data.explanation);
      $("#image_credit").html(data.image_credit);
      $("#image").html("<img src='" + data.low_res_image_path + "' />");
      $("#votes").text(data.votes);

      view._formatLinks("#explanation a");
      view._formatLinks("#image_credit a");
    });
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
    var vote = $("#vote").val();

    $.post("apod/" + this._param() + "/vote", {vote: vote});
  },

  _param: function(){
    return this.currentDate.format("YYMMDD");
  }

});


$(function(){
  view = new Apod.View();
  view.render();
});
