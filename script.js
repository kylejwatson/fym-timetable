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
        dateText = "\nIt is Thursday 11th December 2016, which is Semester 1 Week 11 and is an 'odd' week.";
        $("#top").html("<p>" + dateText + "</p>");
        var datas = [];
        $.each(data.query.results.tr, function (index, value) {
            if(index>0){
                $.each(value.td, function (i, v){
                    if(i>0){
                        if(v.div){
                            if(v.div.length == 2){
                                var myData = new MultiData(index,i);
                                $.each(v.div, function (ind, val) {
                                    myData.addText(val);
                                });
                                datas.push(myData);
                            }else{
                                datas.push(new Data(v.div,index,i))
                            }
                        }else{
                            datas.push(new Data(v.content,index,i))
                        }
                    }
                });
            }
        });

        $.each(datas,function(index,value){
            console.log("Each index: " + index);
            console.log("datas day: " + value.day);
            console.log("datas hour: " + value.hour);
            console.log("datas text: " + value.text);
        });
        //alert(data.query.results.tr);
        /**
         * ############################################
         */
        /*$("#top").append("<table>");
        $("#top").append("</table>");
        var weekString = dateText.substr(dateText.indexOf("Week")+5,2);
        $.each(data.query.results.tr, function (index, value) {
            $("table").append("<tr id='row-" + index +"'>");
            $("table").append("</tr>");
            $.each(value.td, function (i, v){
                if(v.div){
                    //alert(v.div.length);
                    if(v.div.length == 2) {
                        //alert("2: " + v.div.length);
                        $("#row-" + index).append("<td id='row-"+index+"-col-"+i+"'></td>");
                        $.each(v.div, function (ind, val) {
                            var startWeeks = val.content.indexOf("(")+6;
                            var endWeeks = val.content.indexOf(")");
                            var stringWeeks = val.content.slice(startWeeks,endWeeks);
                            // alert("Before while" + stringWeeks);
                            var isWeek = false;
                            while(!isWeek){
                                var firstComma = stringWeeks.indexOf(",");
                                var curWeek;
                                if(firstComma != -1){
                                    curWeek = stringWeeks.slice(0,firstComma);
                                    stringWeeks = stringWeeks.slice(firstComma+1);
                                }else {
                                    curWeek = stringWeeks;
                                }
                                isWeek = parseNumRange(curWeek, weekString) || isWeek;
                                if(firstComma == -1){
                                    break;
                                }
                            }

                            if(isWeek) {
                                $("#row-" + index + "-col-" + i).append("<div class='week'>" + val.content + "</div>");
                            }else{
                                $("#row-" + index + "-col-" + i).append("<div>" + val.content + "</div>");
                            }
                        });
                    }else{
                        $("#row-" + index).append("<td border='1px'>" + v.div + "</td>");
                    }
                }else {
                    $("#row-" + index).append("<td border='2px'>" + v.content + "</td>");
                }
            });
        });
        console.log("." + dateText.substr(7,3) + "..");
        switch(dateText.substr(7,3)){
            case "Mon":
                $("#row-1").addClass("day");
                break;
            case "Tue":
                $("#row-2").addClass("day");
                break;
            case "Wed":
                $("#row-3").addClass("day");
                alert("test");
                break;
            case "Thu":
                $("#row-4").addClass("day");
                break;
            case "Fri":
                $("#row-5").addClass("day");
        }
        // alert(weekString);*/
    });
});

function parseNumRange(range, hit){
    var dashIndex = range.indexOf("-");
    if(dashIndex == -1){
        return range == hit;
    }else{
        var firstNum = parseInt(range.slice(0,dashIndex));
        var secondNum = parseInt(range.slice(dashIndex+1));
        if(firstNum <= parseInt(hit) && parseInt(hit) <= secondNum){
            return true;
        }else{
            return false;
        }
    }
}

function Data(text,day,hour){
    this.text = text;
    this.day = day;
    this.hour = hour;
    this.isNow = false;
}
function MultiData(day,hour){
    this.text = "MultiData";
    this.texts = new Array();
    this.day = day;
    this.hour = hour;
    this.isNow = false;
    this.addText = function(newText){
        this.texts.push(newText);
    };
}
