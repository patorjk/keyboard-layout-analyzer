<!doctype html>
<html ng-app="kla">
<head>
    <meta charset="utf-8">
    <link rel="icon" type="image/png" href="./img/kb-q-10.png">

    <title>Keyboard Layout Analyzer - QWERTY vs Dvorak vs Colemak</title>

<!--
source code: https://github.com/patorjk/keyboard-layout-analyzer
-->

    <!-- vendor css -->
    <link href="/common/vendor/bootstrap-flat/dist/css/bootstrap.css" rel="stylesheet">
    <link href="/common/vendor/jqplot/jquery.jqplot.min.css" rel="stylesheet">
    
    <!-- app css -->
    <link rel="stylesheet" type="text/css" href="./css/main.css?2013.12" />
    <link rel="stylesheet" type="text/css" href="./css/kb-config.css?2013" />
    <link href="/common/pat/keyboard/css/keyboard.css" rel="stylesheet">

    <!-- vendor responsive css -->
    <!--<link href="/common/vendor/bootstrap/dist/css/bootstrap-responsive.css" rel="stylesheet">-->

    <!--[if lte IE 8]>
    <script>
        window.location = "/keyboard-layout-analyzer/v2";
    </script>
    <![endif]-->
    
    <!-- TODO: Google Analytic code here? -->

</head>
<body>
    <div id="fb-root"></div>
    <script>(function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=174660119251129";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));</script>

    <div class="navbar navbar-fixed-top" style='z-index:1001;'>
        <div class="navbar-inner">
            <div class="container">

                <!-- .btn-navbar is used as the toggle for collapsed navbar content -->
                <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                </a>

                <!-- Be sure to leave the brand out there if you want it shown -->
                <div class="brand" style='position:relative'>
                    
                    <div style='position:absolute; top:7px'>
                        <img src='img/kb-q-10.png'>
                    </div>
                    <div style='margin-left:40px'>
                        Keyboard Layout Analyzer
                    </div>
                </div>

                <!-- Everything you want hidden at 940px or less, place within here -->
                <div class="nav-collapse collapse">
                    <!-- .nav, .navbar-search, .navbar-form, etc -->
                    <ul class="nav pull-right">
                        <li navbar-link>
                            <a href="#/main">Main</a>
                        </li>
                        <li navbar-link>
                            <a href="#/config">Configuration</a>
                        </li>
                        <li navbar-link>
                            <a href="#/about">About</a>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    </div>

    <div id="view-container" class="container">
        <div id='view' 
            class='page'
            ng-view="" 
            ng-cloak
            ></div>
        <div id='kla-loading' class='text-center ng-cloak'>
            <p>
                <img src='http://patorjk.com/images/qwerty.png'/>
            </p>
            <p>
                <img src='img/loading2.gif'>
            </p>
            Loading, one moment please...
        </div>
    </div>

    <div id='newsModal' class='modal hide fade' tabindex='-1' role='dialog' aria-labelledby='resultLabel' aria-hidden='true'>
        <div class='modal-header'>
            <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>x</button>
            <h3 id='resultLabel'>News</h3>
        </div>
        <div class='modal-body'>

            <ul>
                <li>
                    2014.02.17: Added Colemak Estonian, Ina, TaserFR, "Arensito, Simplified, Objective-C", Burroughs Bower, and TNWMLC.
                </li>
                <li>
                    2014.02.01: Added Tallus, QWERTY (Danish), QWERTY (Danish - International), Antibracket, Programmer Dvorak with Ordered Numbers, Hackers Dvorak with Ordered Numbers, NasiraJ, Workman for Programmers, Si Wei, MTGAP Thumbshift, Kinesis Advantage Svorak-r, Kinesis Advantage Qwerty, QWERTY Thumbshift, Colemak Thumbshift, and ErgoDox-modified-UPD.
                </li>
                <li>
                    2014.01.09: Added Aus der Neo Welt and BuTeck-(AdNW).
                </li>
                <li>
                    2014.01.01: Added QWERTY-Programmer and ABCDEF.
                </li>
                <li>
                    2013.12.29: Added QWERTY Spanish (European), QWERTY Estonian (European), and Ergodox Neo2.
                </li>
                <li>
                    2013.12.15: Added HIEAMTSRN layout.
                </li>
                <li>
                    2013.12.08: Added CHIN and CHIN-Programmer layouts.
                </li>
                <li>
                    2013.11.30: Added MTGAP, QWERTY: Wide Mod, Arensito, CarpalxQ, Neo 2.0 (v2), and Colemak JJT layouts.
                </li>
                <li>
                    2013.11.24: Added NRSTM, Balance Twelve, STNDC, Ergodox Norman, Simplified Dvorak with UI Swap, and WidePDK Custom layouts.
                </li>
                <li>
                    2013.11.12: Added Kinesis Advantage Colemak layout.
                </li>
                <li>
                    2013.11.11: Added QWERTY (English Varient) layout.
                </li>
                <li>
                    2013.11.01: Added Spanish Dvorak layout.
                </li>
                <li>
                    2013.10.30: Added QWPR layout.
                </li>
                <li>
                    2013.10.26: Added TypeHacK, Colemak mod JPH, and JPPE layouts.
                </li>
                <li>
                    2013.10.18: Added Anglian layout.
                </li>
                <li>
                    2013.10.15: Added OISEAU, German Dvorak Type II, One-handed Dvorak (Left), and One-handed Dvorak (Right) layouts.
                </li>
                <li>
                    2013.10.05: Added ASHLEY-GUDYR layout.
                </li>
                <li>
                    2013.10.04: Added BvoFRaK layouts and the BÉPO layout.
                </li>
                <li>
                    2013.10.01: Added Asset, Colemak HU, QWERTY Thumb Mod and Typematrix layouts.
                </li>
                <li>
                    2013.09.18: Added Neo 2, Ergodox Colemak (v2), AOEYK, Ergodox QGMLWB/Cub, Ergodox QGMLWY/Cub and Ergodox Colemak/Cub layouts.
                </li>
                <li>
                    2013.09.16: Added Norman, EAton, Ergodox Colemak, and Ergodox Gelatin layouts.
                </li>
                <li>
                    2013.09.15: Added Ergodox QWERTY and Workman layouts.
                </li>
                <li>
                    2013.09.12: Colemak MOD UK layout added.
                </li>
                <li>
                    2013.08.20: Acemak 1 layout added.
                </li>
                <li>
                    2013.08.06: Klausler, Kaeteker's Modified Dvorak, and Simplified Dvorak W/ Caps as Backspace layouts added.
                </li>
                <li>
                    2013.07.26: Workman layout added.
                </li>
                <li>
                    2013.07.24: Programmer Colemak layout added.
                </li>
                <li>
                    2013.07.23: Minimak layouts added.
                </li>
                <li>
                    2013.07.22: AZERTY layout added.
                </li>
                <li>
                    2013.07.20: QWERFJ layout added.
                </li>
                <li>
                    2013.07.19: Vu Keys layout added.
                </li>
                <li>
                    2013.07.16: QGMLWB layout added.
                </li>
                <li>
                    2013.07.16: Tarmak layouts added.
                </li>
                <li>
                    2013.07.12: Version 3.0 released.
                </li>
            </ul>

        </div>

        <div class='modal-footer'>
            <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
        </div>
    </div>

    <div id='aboutModal' class='modal hide fade' tabindex='-1' role='dialog' aria-labelledby='resultLabel' aria-hidden='true'>
        <div class='modal-header'>
            <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>x</button>
            <h3 id='resultLabel'>About</h3>
        </div>
        <div class='modal-body'>
        This application allows you to compare layouts. See the About section for more details. 
        </div>

        <div class='modal-footer'>
            <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
        </div>
    </div>

    <div id='footer'>
        <div id='footer-col-set'>
            <div class='footer-col'>
                <div class='footer-col-header'>More apps from patorjk.com</div>
                <div class='footer-col-fixed-width'>
                    <ul>
                        <li>
                            <a href='http://patorjk.com/gradient-image-generator/'>Gradient Image Generator</a>
                        </li>
                        <li>
                            <a href='http://patorjk.com/software/taag/'>Text to ASCII Art Generator</a>
                        </li>
                        <li>
                            <a href='http://patorjk.com/typing-speed-test/'>Typing Speed Test</a>
                        </li>
                        <li>
                            <a href='http://patorjk.com/games/snake/'>JavaScript Snake Game</a>
                        </li>
                        <li>
                            <a href='http://patorjk.com/misc/scrollingtext/timewaster.php'>Scrolling Text Time Waster!</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class='footer-col' id='footer-news'>
                <div class='footer-col-header'>News</div>
                <div class='footer-col-fixed-width'>
                    <ul>
                        <li>
                            <a id='showNews' href='javascript:void(0);'>Latest News - 2014.02.17</a>
                        </li>
                        <li>
                            <a id='showAbout' href='javascript:void(0);'>About This App</a>
                        </li>
                        <li>
                            <a href="patorjk(at)gmail.com" class="email">Email me</a> if you have any suggestions. 
                        </li>
                    </ul>
                </div>
            </div>
            <div class='footer-col'>
                <div class='footer-col-header'>Social</div>
                <div >

                    <div class='social-btn'>
                        <div class="fb-like" data-href="http://patorjk.com/keyboard-layout-analyzer/" data-send="false" data-layout="button_count"  data-show-faces="false"></div>
                    </div>

                    <div class='social-btn'>
                        <a href="https://twitter.com/share" class="twitter-share-button" data-url="http://patorjk.com/keyboard-layout-analyzer/">Tweet</a>
                        <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
                    </div>

                    <div class='social-btn'>
                        <div class="g-plusone" data-size="medium"></div>
                        <script type="text/javascript">
                          (function() {
                            var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
                            po.src = 'https://apis.google.com/js/plusone.js';
                            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
                          })();
                        </script>
                    </div>

                </div>
            </div>
        </div>
    </div> <!-- end footer -->

    <!-- Vendor Scripts -->
    <script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
    <script src='/common/vendor/jqplot/jquery.jqplot.min.js'></script>
    <script src="/common/vendor/jqplot/plugins/jqplot.pieRenderer.min.js"></script>
    <script src="/common/vendor/jqplot/plugins/jqplot.barRenderer.min.js"></script>
    <script src="/common/vendor/jqplot/plugins/jqplot.categoryAxisRenderer.min.js"></script>
    <script src="/common/vendor/jqplot/plugins/jqplot.pointLabels.min.js"></script>

    <script src='/common/vendor/heatmap/heatmap.js'></script>

    <script src="/common/vendor/bootstrap-flat/dist/js/bootstrap.min.js"></script>
    <script src='https://ajax.googleapis.com/ajax/libs/angularjs/1.2.5/angular.min.js'></script>
    <script src='https://ajax.googleapis.com/ajax/libs/angularjs/1.2.5/angular-route.min.js'></script>
    <script src='https://ajax.googleapis.com/ajax/libs/angularjs/1.2.5/angular-animate.min.js'></script>
    <!--<script src='https://ajax.googleapis.com/ajax/libs/angularjs/1.1.4/angular.min.js'></script>-->

    <!-- Custom GUI -->
    <script src="/common/pat/keyboard/js/kb.js?2013.09.16"></script>
    <script src="/common/pat/keyboard/js/key.js?2014.01.01"></script>
    <script src="/common/pat/keyboard/js/key-dialog.js?2013.09.14"></script>
    <script src="/common/pat/keyboard/js/keyboard.js?2013.09.14"></script>

    <!-- App Scripts -->
    <script src="js/app.js?2014.01.01"></script>
    <script src="js/analyzer.js"></script>

    
    <script src="js/build/services.js?2014.01.08"></script>
    <script src="js/build/controllers.js?2014.01.08"></script>
    <script src="js/build/filters.js"></script>
    <script src="js/build/directives.js?2014.01.02"></script>
    <script src="js/build/templates.js?2014.02.17"></script>

    <!--<script src="js/animations.js"></script>-->

</body>
</html>