<!DOCTYPE html>
<html lang="en">
<head>
    <title> Kyle Watson's Portfolio - Personal </title>
    <meta charset="UTF-8" />
    <meta name="keywords" content="Portfolio, Student, Developer, Counter-Strike">
    <meta name="description" content="A simple portfolio to show off projects and attributes.">
    <meta name="author" content="Kyle Watson">
    <link rel="stylesheet" type="text/css" href="style.css" />
    <!--Font Awesome by Dave Gandy - http://fontawesome.io-->
    <!-- <i> tags used for glyphicons (styling) so technically incorrect use of HTML but hidden from accessibility with "aria-hidden=true" attribute-->
    <link rel="stylesheet" type="text/css" href="font-awesome-4.7.0/css/font-awesome.min.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script src="script.js"></script>
</head>
<body>
<header id="branding">
    <h1 class="row col-12">Personal Bio</h1>
    <nav id="navigation">
        <h2> Navigation </h2>
        <ul class="row">
            <li class="col-3"><a href="index.php"><span class="fa fa-home" aria-hidden="true"></span> Home </a></li>
            <li class="col-3"><a href="personal.php"><span class="fa fa-user" aria-hidden="true"></span> Personal Bio </a></li>
            <li class="title-nested col-3"><a href="projects/"><span class="fa fa-code" aria-hidden="true"></span> Projects </a>
                <ul class="nested-list">
                    <li><a href="projects/project1/"> <abbr title="Universal Serial Bus">USB</abbr> Backup </a></li>
                    <li><a href="projects/project2/"> <abbr title="Grand Theft Auto">GTA</abbr> Graphics Fix </a></li>
                    <li><a> More Coming Soon! </a></li>
                </ul>
            </li>
            <li class="col-3"><a href="contact.php"><span class="fa fa-address-book" aria-hidden="true"></span> Contact me </a></li>
        </ul>
    </nav>
</header>
<aside class="aside-3">
    <h2> Personal Overview</h2>
    <p> This Section gives a general overview of my personality, including:</p>
    <ul>
        <li ><a href="#interests">Interests <span class="fa fa-arrow-circle-up" aria-hidden="true"></span></a></li>
        <li><a href="#timetable">Timetable <span class="fa fa-arrow-circle-up" aria-hidden="true"></span></a></li>
        <li><a href="#photo">Photo <span class="fa fa-arrow-circle-up" aria-hidden="true"></span></a></li>
    </ul>
</aside>
<main id="bio" tabindex="-1">
    <!-- Content starts here -->
    <section id="top">

    </section>
    <section id="bottom">

    </section>
    <!-- Content ends here -->
</main>
<footer id="contact">
    <address>
        Created by some <a href="mailto:k.j.watson1@edu.salford.ac.uk">guy.</a>
    </address>
    <p>
        <?php
				echo "Last Modified: " . date("d/m/y H:m",filemtime(__FILE__));
			?>
    </p>
    <nav id="bottom-nav">
        <p>
            <a href="#branding"><span class="fa fa-arrow-circle-up" aria-hidden="true"></span> Back to the top.</a>
        </p>
    </nav>
</footer>
</body>
</html>
