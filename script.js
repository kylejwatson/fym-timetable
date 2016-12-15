/**
 * Created by kyle on 06/12/16.
 */

$(document).on('pageshow',function(e,data){
    var header = $("div[data-role='header']:visible");
    var footer = $("div[data-role='footer']:visible");
    var content = $("div[data-role='content']:visible:visible");
    var viewport_height = $(window).height();
    console.log(viewport_height);
    console.log(header.height());
    console.log(footer.height());
    var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
    if((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
        content_height -= (content.outerHeight() - content.height());
    }
    $(".ui-content").height(content_height);
});

var showIndex = 3;
var dayLetters;
var days = [];
function loadData(){
    var weekJSON = $.getJSON("https://query.yahooapis.com/v1/public/yq" +
        "l?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Ff" +
        "irstyearmatters.info%2Fcs%2Ftt1-CC1.2.html%22%20and%20xpath%3D'" +
        "%2F%2Fdiv%5Bcontains(%40id%2C%22date%22)%5D%20%7C%20%2F%2Ftbody" +
        "%2Ftr'&format=json&callback=",
        function (data){
            var dateText = data.query.results.div.content;
            $(".foot").html(dateText);
            $.each(data.query.results.tr, function (index, value) {
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
                console.log("Each index: " + index);
                console.log("datas day: " + value.index);
                value.logData();
                value.showData();
            });
        });
}

function Day(index){
    this.datas = new Array();
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
        $("#"+this + " .head-day").html(""+ this);
        console.log("#"+this);
        console.log(dayLetters);
        var container = $("#"+this).find(".ui-content");
        console.log(container.html());
        container.html("<table></table>");
        $.each(this.datas, function(i,v){
            if(new Date($.now()).getHours() == v.hour) {
                container.children("table").append("<tr><td class='thishour'>" + v.htmlText() + "</td></tr>");
            }else{
                container.children("table").append("<tr><td>" + v.htmlText() + "</td></tr>");
            }

        });
        if(dayLetters == this + ""){
            console.log(this+"");
            $("#"+this).addClass("today");
            showIndex = this.index --;
            $.mobile.changePage($("#" + this));
        }
        console.log(this);
    };
    this.toString = function(){
        return this.text;
    }
}

function Data(hour){
    this.texts = new Array();
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
        console.log("html" + this.hour+this.texts[0]);
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
    $(".ui-content").on("swiperight",function(){
        if(showIndex > 0) {
            showIndex--;
        }else{
            showIndex = 4;
        }
        $.mobile.changePage($("#"+days[showIndex]), {transition: "flip"});
    });
    $(".ui-content").on("swipeleft",function(){
        if(showIndex < 4) {
            showIndex++;
        }else{
            showIndex = 0;
        }
        $.mobile.changePage($("#"+days[showIndex]), {transition: "flip"});
    });

    loadData();
});

function workshopGroup(){
    console.log($("input[name=group]:checked").val());
}

var panel = '' +
    '<div data-role="panel" id="myPanel" data-position="right" data-display="overlay"  data-theme="a">' +
    '   <h2>Settings</h2>' +
    '<div data-role="collapsible">' +
    '   <h1>Change Workshop</h1>' +
    '   <form>' +
    '       <fieldset id="workshop-group" data-role="workshop-group">' +
    '               <legend>Workshop Group:</legend>' +
    '               <label for="wg1">1</label>' +
    '               <input type="radio" name="group" id="wg1" value="wg1" onchange="workshopGroup()">' +
    '               <label for="wg2">2</label>' +
    '               <input type="radio" name="group" id="wg2" value="wg2" onchange="workshopGroup()">' +
    '               <label for="wg3">3</label>' +
    '               <input type="radio" name="group" id="wg3" value="wg3" onchange="workshopGroup()">' +
    '               <label for="wg4">4</label>' +
    '               <input type="radio" name="group" id="wg4" value="wg4" onchange="workshopGroup()">' +
    '       </fieldset>' +
    '    </form>' +
    '</div>'+
    '    <a id="settings" href="javascript:workshopGroup()" data-rel="close" class="ui-btn ui-btn-inline ui-shadow ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-left">Close panel</a>' +
    '</div>';

$(document).one('pagebeforecreate', function () {
    $.mobile.pageContainer.prepend(panel);
    $("#myPanel").panel().enhanceWithin();
});
