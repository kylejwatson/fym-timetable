/**
 * Created by kyle on 06/12/16.
 * TODO: fix broken ass code
 *       -figure out why 'CNUndefined' can happen, whats not breaking it
 *       -port seperate json files to DBs so it works on server
 */

$(document).on('pageshow',function(data){
    var header = $("div[data-role='header']:visible");
    var footer = $("div[data-role='footer']:visible");
    var content = $("div[data-role='content']:visible:visible");
    var viewport_height = $(window).height();
    var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
    if((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
        content_height -= (content.outerHeight() - content.height());
    }
    $(".ui-content").height(content_height);
});

var showIndex = 3;
var dayLetters;
var days = [];
function loadData(group,course,year){
    course += "";
    group += "";
    year += "";
    var string;
    var subString = "tt1-";
    if(course == "CS" || course == "SE" || course == "CC"){
        subString += course + year;
        if(year != "F"){
            subString += "." + group;
        }
    }else{
        subString += course + year;
    }
    console.log(subString);
    string = "https://query.yahooapis.com/v1/public/yq" +
        "l?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Ff" +
        "irstyearmatters.info%2Fcs%2F" + subString + ".html%22%20and%20xpath%3D'" +
        "%2F%2Fdiv%5Bcontains(%40id%2C%22date%22)%5D%20%7C%20%2F%2Ftbody" +
        "%2Ftr'&format=json&callback=";
    var weekJSON = $.getJSON(string,
        function (data){
            var dateText = data.query.results.div.content;
            var tableResults = data.query.results.tr;
            $.post("save.php",
                {data: JSON.stringify(tableResults),
                name: subString},
                function(data, status){
                    console.log("Data: " + data + "\nStatus: " + status);
                });
            $(".foot").html(dateText);
            $.each(tableResults, function (index, value) {
                if(index>0){
                    var myDay = new Day(index);
                    for(var i = 1; i < value.td.length; i++) {
                        var myData = new Data(i);
                        var v = value.td[i];
                        if (v.div) {
                            if (v.div.length == 2) {
                                $.each(v.div, function (ind, val) {
                                    myData.addText(val.content);
                                });
                            } else {
                                myData.addText(v.div);
                            }
                        } else {
                            myData.addText(v.content);
                        }
                        if (v.colspan == 2) {
                            v.colspan = 1;
                            value.td.splice(i, 0, v);
                        }
                        myDay.addData(myData);
                    }
                    days.push(myDay);
                }
            });

            dayLetters = dateText.substr(7,3);
            $.each(days,function(index,value){
                value.logData();
                value.showData();
            });
        });
}

function Day(index){
    this.datas = [];
    this.index = index;
    switch(index){
        case 1:
            this.text = "Mon";
            break;
        case 2:
            this.text = "Tue";
            break;
        case 3:
            this.text = "Wed";
            break;
        case 4:
            this.text = "Thu";
            break;
        case 5:
            this.text = "Fri";
            break;
    }
    this.addData = function(newData){
        this.datas.push(newData);
    };
    this.logData = function(){
        $.each(this.datas,function(index,value){
            value.logText();
        });
    };
    this.showData = function(){
        var thisSelector = $("#"+this);
        $("#"+this + " .head-day").html(""+ this);
        var container = thisSelector.find(".ui-content");
        container.html("<table></table>");
        $.each(this.datas, function(i,v){
            if(new Date($.now()).getHours() == v.hour) {
                container.children("table").append("<tr><td class='thishour'>" + v.htmlText() + "</td></tr>");
            }else{
                container.children("table").append("<tr><td>" + v.htmlText() + "</td></tr>");
            }
        });
        if(dayLetters == this + ""){
            thisSelector.addClass("today");
            showIndex = this.index - 1;
            $.mobile.changePage(thisSelector);
        }
    };
    this.toString = function(){
        return this.text;
    }
}

function Data(hour){
    this.texts = [];
    this.hour = hour+8;
    this.isNow = false;
    this.addText = function(newText){
        this.texts.push(newText);
    };
    this.logText = function(){
        $.each(this.texts, function(index,value){
            console.log(index + " : " + value);
        });
    };
    this.htmlText = function(){
        return this.texts[0];
    };
}

function parseNumRange(range, hit){
    var dashIndex = range.indexOf("-");
    if(dashIndex == -1){
        return range == hit;
    }else{
        var firstNum = parseInt(range.slice(0,dashIndex));
        var secondNum = parseInt(range.slice(dashIndex+1));
        return firstNum <= parseInt(hit) && parseInt(hit) <= secondNum
    }
}

$(document).ready(function(){
    var pageContent = $(".ui-content");
    pageContent.on("swiperight",function(){
        if(showIndex > 0) {
            showIndex--;
        }else{
            showIndex = 4;
        }
        $.mobile.changePage($("#"+days[showIndex]), {transition: "flip"});
    });
    pageContent.on("swipeleft",function(){
        if(showIndex < 4) {
            showIndex++;
        }else{
            showIndex = 0;
        }
        $.mobile.changePage($("#"+days[showIndex]), {transition: "flip"});
    });

    workshopGroup();
});

function workshopGroup(){
    var checkedYear = $("input[name=year-r]:checked").val();
    var wg1 = $("#wg1");
    var wg4 = $("#wg4");
    var groupInputs = $("input[name=group]");
    switch(checkedYear){
        case "1":
            if(wg1.checkboxradio("option", "disabled")){
                groupInputs.checkboxradio("enable");
                groupInputs.checkboxradio("refresh");
            }else if(wg4.checkboxradio("option", "disabled")){
                wg4.checkboxradio("enable");
                wg4.checkboxradio("refresh");
            }
            break;
        case "2":
            if(wg1.checkboxradio("option", "disabled")) {
                groupInputs.checkboxradio("enable");
                groupInputs.checkboxradio("refresh");
            }
            wg4.checkboxradio("disable");
            wg4.attr("checked", false);
            wg4.checkboxradio("refresh");
            break;
        case "F":
            groupInputs.checkboxradio("disable");
            groupInputs.attr("checked", false);
            groupInputs.checkboxradio("refresh");
            break;
        //case
    }

    var checkedCourse = $("input[name=course-r]:checked").val();
    var y1 = $("#y1");
    var y3 = $("#y3");
    var yearInputs = $("input[name=year-r]");
    switch(checkedCourse){
        case "WD":
            groupInputs.checkboxradio("disable");
            groupInputs.attr("checked", false);
            groupInputs.checkboxradio("refresh");
            if(y1.checkboxradio("option", "disabled")){
                yearInputs.checkboxradio("enable");
            }
            if(checkedYear == "F") {
                y3.attr("checked", false);
                checkedYear = $("input[name=year-r]:checked").val();
            }
            y3.checkboxradio("disable");
            y3.checkboxradio("refresh");
            break;
        case "CN":
            groupInputs.checkboxradio("disable");
            groupInputs.attr("checked", false);
            groupInputs.checkboxradio("refresh");
            yearInputs.checkboxradio("disable");
            yearInputs.attr("checked", false);
            yearInputs.checkboxradio("refresh");
            break;
        default:
            if(wg1.checkboxradio("option", "disabled") && checkedYear != "F"){
                groupInputs.checkboxradio("enable");
                groupInputs.checkboxradio("refresh");
            }else if(wg4.checkboxradio("option", "disabled") && (checkedYear == "1")){
                wg4.checkboxradio("enable");
                wg4.checkboxradio("refresh");
            }
            if(y1.checkboxradio("option", "disabled")){
                yearInputs.checkboxradio("enable");
                yearInputs.checkboxradio("refresh");
            }else if(y3.checkboxradio("option", "disabled")){
                y3.checkboxradio("enable");
                y3.checkboxradio("refresh");
            }
    }

    var checkedGroup = $("input[name=group]:checked").val();
    if(checkedCourse == "CN"){
        checkedYear = 1;
        console.log("CN Debug: " + checkedCourse + checkedGroup + checkedYear);
    }
    var CSorSE = checkedCourse == "CS" || checkedCourse == "SE";

    if(checkedCourse == null){
        $("#c2").attr("checked", true);
        checkedCourse = "SE";
        CSorSE = true;
    }
    if(CSorSE && (checkedGroup == null)){
        $("#wg2").attr("checked", true);
        checkedGroup = "2";
    }
    if((CSorSE || checkedCourse == "WD") && (checkedYear == null)){
        y1.attr("checked", true);
        checkedYear = "1";
    }
    if(CSorSE && checkedYear == "1"){
        checkedCourse = "CC";
    }
    loadData(checkedGroup,checkedCourse,checkedYear);
}

var panel = '' +
    '<div data-role="panel" id="myPanel" data-position="right" data-display="overlay"  data-theme="a">' +
    '   <h2>Settings</h2>' +
    '   <div id="cset" data-role="collapsibleset">' +
    '<div id="y-collapsible" data-role="collapsible">' +
    '   <h1>Change Year</h1>' +
    '   <form>' +
    '       <fieldset id="year" data-role="year">' +
    '               <legend>Year:</legend>' +
    '               <label for="y1">First</label>' +
    '               <input type="radio" name="year-r" id="y1" value="1" onchange="workshopGroup()">' +
    '               <label for="y2">Second</label>' +
    '               <input type="radio" name="year-r" id="y2" value="2" onchange="workshopGroup()">' +
    '               <label for="y3">Final</label>' +
    '               <input type="radio" name="year-r" id="y3" value="F" onchange="workshopGroup()">' +
    '       </fieldset>' +
    '    </form>' +
    '</div>'+
    '<div id="c-collapsible" data-role="collapsible">' +
    '   <h1>Change Course</h1>' +
    '   <form>' +
    '       <fieldset id="course" data-role="course">' +
    '               <legend>Course:</legend>' +
    '               <label for="c1">Computer Science</label>' +
    '               <input type="radio" name="course-r" id="c1" value="CS" onchange="workshopGroup()">' +
    '               <label for="c2">Software Engineering</label>' +
    '               <input type="radio" name="course-r" id="c2" value="SE" onchange="workshopGroup()">' +
    '               <label for="c3">Web Development</label>' +
    '               <input type="radio" name="course-r" id="c3" value="WD" onchange="workshopGroup()">' +
    '               <label for="c4">Computer Networking</label>' +
    '               <input type="radio" name="course-r" id="c4" value="CN" onchange="workshopGroup()">' +
    '       </fieldset>' +
    '    </form>' +
    '</div>' +
    '<div id="w-collapsible" data-role="collapsible">' +
    '   <h1>Change Workshop</h1>' +
    '   <form>' +
    '       <fieldset id="workshop-group" data-role="workshop-group">' +
    '<legend>Workshop Group:</legend>' +
    '               <label for="wg1">1</label>' +
    '               <input type="radio" name="group" id="wg1" value="1" onchange="workshopGroup()">' +
    '               <label for="wg2">2</label>' +
    '               <input type="radio" name="group" id="wg2" value="2" onchange="workshopGroup()">' +
    '               <label for="wg3">3</label>' +
    '               <input type="radio" name="group" id="wg3" value="3" onchange="workshopGroup()">' +
    '               <label for="wg4">4</label>' +
    '               <input type="radio" name="group" id="wg4" value="4" onchange="workshopGroup()">' +
    '       </fieldset>' +
    '    </form>' +
    '</div>' +
    '</div>'+
    '    <a id="settings" href="javascript:b4workshopGroup()" data-rel="close" class="ui-btn ui-btn-inline ui-shadow ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-left">Close panel</a>' +
    '</div>';

$(document).one('pagebeforecreate', function () {
    $.mobile.pageContainer.prepend(panel);
    $("#myPanel").panel().enhanceWithin();
});

function b4workshopGroup(){
    $("#cset").children().collapsible("collapse");
    workshopGroup();
}