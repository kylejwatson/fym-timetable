/**
 * Created by kyle on 06/12/16.
 */
$(document).ready(function(){
    var weekText;
    var weekJSON = $.getJSON("https://query.yahooapis.com/v1/public/yq" +
        "l?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Ff" +
        "irstyearmatters.info%2Fcs%2Ftt1-CC1.2.html%22%20and%20xpath%3D'" +
        "%2F%2Fdiv%5Bcontains(%40id%2C%22date%22)%5D%20%7C%20%2F%2Ftbody" +
        "%2Ftr'&format=json&callback=",
    function (data){
        var dateText = data.query.results.div.content;
        $("#top").html("<p>" + dateText + "</p>");
        var days = [];
        $.each(data.query.results.tr, function (index, value) {
            if(index>0){
                var myDay = new Day(index);
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
                            myDay.addData(myData);
                            myData.hour ++;
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

        $("#bottom").html("<table></table>");

        console.log(dateText.substr(7,3));
        switch(dateText.substr(7,3)){
            case "Mon":
                days[0].showData($("table"));
                days[0].logData($("table"));
                break;
            case "Tue":
                days[1].showData($("table"));
                break;
            case "Wed":
                days[2].showData($("table"));
                break;
            case "Thu":
                days[3].showData($("table"));
                break;
            case "Fri":
                days[4].showData($("table"));
        }
    });
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

function Day(index){
    this.datas = new Array();
    this.index = index;
    this.addData = function(newData){
        this.datas.push(newData);
    };
    this.logData = function(){
        $.each(this.datas,function(index,value){
            value.logText();
        });
    };
    this.showData = function(container){
        $.each(this.datas, function(i,v){
            container.append("<tr><td>" + v.htmlText() + "</td></tr>");
        });
    };

}

function Data(hour){
    this.texts = new Array();
    this.hour = hour;
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
