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
    $('#rating').raty(ratyOptions);

    return this.$el;
  },

  nextApod: function(event){
    event.preventDefault();
    if (this.currentDate.diff(moment(), 'days') < 0) {
      this.currentDate.add("days", 1);
      this._getApod();
      $('#rating').raty('reload');
    }
  },

  previousApod: function(event){
    event.preventDefault();
    this.currentDate.subtract("days", 1);
    this._getApod();
    $('#rating').raty('reload');
  },

  _getApod: function(){
    var view = this;
    $.getJSON("apod/" + this.param(), function(data){
      $("#title").text(data.title);
      $("#explanation").html("<b>Explanation:&nbsp;&nbsp;</b>" + data.explanation);
      $("#image_credit").html(data.image_credit);
      $("#votes").text(data.votes);

      if (data.type == "image"){
        $("#image").html("<img src='" + data.low_res_image_path + "' class='img-rounded' />");
      } else {
        $("#image").html('<iframe width="960" height="720" src="' + data.low_res_image_path + '" frameborder="0" allowfullscreen></iframe>');
      }

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
    var rating = $('#rating').raty('score');
    console.log(rating);
  },

  param: function(){
    return this.currentDate.format("YYMMDD");
  }

});

$(function(){
  var view = new Apod.View();
  view.render();
});
