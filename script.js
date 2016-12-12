/**
 * Created by kyle on 06/12/16.
 */
$(document).ready(function(){
    var showIndex;
    var dayLetters;
    var days = [];
    var weekJSON = $.getJSON("https://query.yahooapis.com/v1/public/yq" +
        "l?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Ff" +
        "irstyearmatters.info%2Fcs%2Ftt1-CC1.2.html%22%20and%20xpath%3D'" +
        "%2F%2Fdiv%5Bcontains(%40id%2C%22date%22)%5D%20%7C%20%2F%2Ftbody" +
        "%2Ftr'&format=json&callback=",
    function (data){
        var dateText = data.query.results.div.content;
        $("#top").html("<p>" + dateText + "</p>");
        $.each(data.query.results.tr, function (index, value) {
            if(index>0){
                var myDay = new Day(index);

                /**m
                 * make into while loop so I can skip counters etc
                 */
                $.each(value.td, function (i, v){
                    if(i>0){
                        var myData = new Data(i);
                        if(v.div){
                            if(v.div.length == 2){
                                $.each(v.div, function (ind, val) {
                                    myData.addText(val.content);
                                });
                            }else{
                                myData.addText(v.div);
                            }
                        }else{
                            myData.addText(v.content);
                        }
                        if(v.colspan == 2){
                            v.colspan = 1;
                            value.td.splice(i, 0, v);
                        }
                        myDay.addData(myData);
                    }
                });
                days.push(myDay);
            }
        });

        $.each(days,function(index,value){
            console.log("Each index: " + index);
            console.log("datas day: " + value.index);
            value.logData();
        });
        dayLetters = dateText.substr(7,3);
        console.log(dayLetters);
        switch(dayLetters){
            case "Mon":
                showIndex = 0;
                break;
            case "Tue":
                showIndex = 1;
                break;
            case "Wed":
                showIndex = 2;
                break;
            case "Thu":
                showIndex = 3;
                break;
            case "Fri":
                showIndex = 4;
        }
        days[showIndex].showData($("#bottom"));
    });
    $("#prev").click(function(){
        if(showIndex > 0) {
            showIndex--;
        }else{
            showIndex = days.length-1;
        }
        days[showIndex].showData($("#bottom"));
    });
    $("#next").click(function(){
        if(showIndex < days.length-1) {
            showIndex++;
        }else{
            showIndex = 0;
        }
        days[showIndex].showData($("#bottom"));
    });

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
        this.showData = function(container){
            if(dayLetters == this){
                container.addClass("today");
            }else{
                container.removeClass("today");
            }
            container.html("<p>" + this + "</p>");
            container.append("<table></table>");
            $.each(this.datas, function(i,v){
                console.log(new Date($.now()).getHours() + " : " + v.hour);
                if(new Date($.now()).getHours() == v.hour) {
                    container.children("table").append("<tr><td class='thishour'>" + v.htmlText() + "</td></tr>");
                }else{
                    container.children("table").append("<tr><td>" + v.htmlText() + "</td></tr>");
                }

            });
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
});


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
