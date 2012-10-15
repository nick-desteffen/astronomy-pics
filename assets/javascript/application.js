Apod = {};
// Apod.Model = Backbone.Model.extend({

// });

// Apod.Collection = Backbone.Collection.extend({
//   model: Apod.Model
// });

Apod.View = Backbone.View.extend({
  
  el: "#viewport",

  currentDate: null,
  
  events: {
    "click .next": "nextApod",
    "click .previous": "previousApod"
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
    var date = this.currentDate.format("YYMMDD");
    $.getJSON("apod/" + date, function(data){
      console.log(data);
      $("#title").text(data.title);
      $("#explanation").html(data.explanation);
      $("#image_credit").html(data.image_credit);
      $("#image").html("<img src='" + data.low_res_image_path + "'/>");

      // Add target=_blank to all links
      var links = $("#explanation a");
      links = links.add($("#image_credit a"));
      links.each(function(index, link){
        $(link).attr("target", "_blank");
      });

    });
  }

});



$(function(){
  view = new Apod.View();
  view.render();
});
