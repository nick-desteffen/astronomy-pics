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

Apod.Router = Backbone.Router.extend({

  routes: {
    ""      : "navigateToDate",
    ":date" : "navigateToDate"
  },

  initialize: function (options) {
    this.app = options.app;
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
  firstApod: new Date(1996, 0, 8), // 6/16/1995 is the oldest, but anything prior to 1/9/1996 is a different format.
  dateFormat: "YYMMDD",

  events: {
    "click .next"     : "nextApod",
    "click .previous" : "previousApod",
    "click #rating"   : "vote",
    "click #random"   : "random",
    "click .exp-link" : "navigateExplanationLink"
  },

  initialize: function () {
    this.router = new Apod.Router({app: this});
    Backbone.history.start({pushState: true});
    this.initializeDatePicker();
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
      $("#date").text(view.currentDate.format('MMMM Do, YYYY'));

      if (view.currentApod.get('type') == "image"){
        $("#image").html("<a href='" + view.currentApod.get('high_res_image_path') + "' target='_blank'><img src='" + view.currentApod.get('low_res_image_path') + "' class='img-rounded' /></a>");
        if (!$("#download").is(":visible")){ $("#download").show() }
        $("#download").attr("href", view.currentApod.get('high_res_image_path'));
        $("#download").attr("download", view.currentApod.get("slug"));
      } else if (view.currentApod.get('type') == "flash") {
        $("#download").hide();
        $("#image").html('<object type="application/x-shockwave-flash" data="http://apod.nasa.gov/apod/' + view.currentApod.get('low_res_image_path') + '" width="960" height="540"><param name="movie" value="http://apod.nasa.gov/apod/' + view.currentApod.get('low_res_image_path') + '" /></object>')
      } else {
        $("#download").hide();
        $("#image").html('<iframe width="960" height="720" src="' + view.currentApod.get('low_res_image_path') + '" frameborder="0" allowfullscreen></iframe>');
      }
      document.title = view.currentApod.get("title") + " | Astronomy Pics.net";
      view.formatLinks("#explanation a");
      view.formatLinks("#image_credit a");
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
    if (this.currentDate.diff(moment(this.firstApod), 'days') > 1) {
      this.currentDate.subtract("days", 1);
      this.router.navigate(this.param(), {trigger: true});
    }
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
      var votes = this.currentApod.get("votes");
      var average = _.reduce(votes, function(memo, num){
        return memo + num;
      }, 0) / votes.length;

      $("#average-rating").text("Average: " + Math.round(average) + " out of " + votes.length + " votes");
    } else {
      $("#average-rating").text("");
    }
  },

  formatLinks: function(selector){
    var links = $(selector);
    _this = this;
    links.each(function(index, link){
      var href = $(link).attr("href");
      if (href != undefined && !href.match(/http/)) {
        var date = href.match(/\d+/g)
        if ((date == undefined) || (moment(date[0], _this.dateFormat).diff(moment(_this.firstApod), 'days') < 1)) {
          $(link).attr("href", "http://apod.nasa.gov/apod/" + href);
        } else {
          $(link).attr("href", date[0]);
          $(link).addClass("exp-link");
        }
      }
      $(link).attr("target", "_blank");
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
    return this.currentDate.format(this.dateFormat);
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
  },

  random: function(event){
    event.preventDefault();
    var randomDate = new Date(this.firstApod.getTime() + Math.random() * (new Date().getTime() - this.firstApod.getTime()));
    this.currentDate = moment(randomDate);
    this.router.navigate(this.param(), {trigger: true});
  },

  initializeDatePicker: function(){
    var view = this;
    $('#datepicker').datepicker({
      autoclose: true,
      startDate: view.firstApod,
      endDate: new Date(),
      todayHighlight: true
    }).on('changeDate', function(event){
      view.currentDate = moment($("#datepicker").val());
      view.router.navigate(view.param(), {trigger: true});
    });
  },

  navigateExplanationLink: function(event){
    event.preventDefault();
    var date = $(event.target).attr("href");
    this.currentDate = moment(date, this.dateFormat);
    this.router.navigate(this.param(), {trigger: true});
  }

});

$(function(){
  window.view = new Apod.View();
  window.view.render();
});
