<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>{{title or ''}}</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="Nick DeSteffen">


    <link href="/assets/css/application.css" rel="stylesheet" type="text/css" />
    <link href="/assets/bootstrap/css/bootstrap.css" rel="stylesheet">

    <style type="text/css">
      body {
        padding-top: 20px;
        padding-bottom: 40px;
      }

      /* Custom container */
      .container-narrow {
        margin: 0 auto;
        max-width: 1000px;
      }
      .container-narrow > hr {
        margin: 30px 0;
      }

    </style>
    <link href="/assets/bootstrap/css/bootstrap-responsive.css" rel="stylesheet">
  </head>
  <body>
    <div class="container-narrow">
      <div class="masthead">
        <h3 class="muted">AstronomyPics.net</h3>
      </div>

      <hr>

      %include

      <hr>

      <div class="footer">
        <p><a href="/about">About</a>&nbsp;/&nbsp;<a href="http://apod.nasa.gov" target="_blank">Astronomy Picture of the Day</a></p>
      </div>
    </div>
    <script type="text/javascript" src="/assets/javascript/jquery-1.8.2.min.js"></script>
    <script type="text/javascript" src="/assets/javascript/underscore-min.js"></script>
    <script type="text/javascript" src="/assets/javascript/backbone-min.js"></script>
    <script type="text/javascript" src="/assets/javascript/moment.min.js"></script>
    <script type="text/javascript" src="/assets/javascript/jquery.raty.js"></script>
    <script type="text/javascript" src="/assets/javascript/application.js"></script>
  </body>
</html>
