<!DOCTYPE html>
<html lang="en">
  <head>
    <title>{{title or ''}}</title>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="Nick DeSteffen">
    <meta name="google-site-verification" content="m3Rk_S9iv81Ha1ESS9BFA8UHbtzE2Z7m3DV0U0tR-yI" />

    <link href="/assets/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="/assets/bootstrap/css/bootstrap-responsive.min.css" rel="stylesheet" type="text/css" />
    <link href="/assets/css/datepicker.css" rel="stylesheet" type="text/css" />
    <link href="/assets/css/application.css" rel="stylesheet" type="text/css" />
  </head>
  <body>
    <div class="container-narrow">
      %include
      <hr>
      <div class="footer">
        <p><a href="/about">About</a>&nbsp;/&nbsp;<a href="http://apod.nasa.gov" target="_blank">Astronomy Picture of the Day</a></p>
      </div>
    </div>
    <script type="text/javascript" src="/assets/javascript/jquery-1.8.3.min.js"></script>
    <script type="text/javascript" src="/assets/javascript/underscore-min.js"></script>
    <script type="text/javascript" src="/assets/javascript/backbone-min.js"></script>
    <script type="text/javascript" src="/assets/javascript/moment.min.js"></script>
    <script type="text/javascript" src="/assets/javascript/bootstrap-datepicker.js"></script>
    <script type="text/javascript" src="/assets/javascript/jquery.raty.js"></script>
    <script type="text/javascript" src="/assets/javascript/application.js"></script>
    <script type="text/javascript">
      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-10081270-4']);
      _gaq.push(['_trackPageview']);

      (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();
    </script>
  </body>
</html>
