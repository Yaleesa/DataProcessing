// script for D3+ - Yaleesa Borgman- 6215262

var tooltipPosition = {'top':0,'left':0}

//function for making the barcharts
function bargraph(city){
    var w = 500;
    var h = 200;
    var barPadding = 100; 

    var cityData = cityDict[city]

    var graph = d3.select("div#graph")
                .append("svg")
                .attr("class", "svg graph")
                .attr("width", w )
                .attr("height", h);
    
    var storeList = []
    for (store in cityData){
        var gameList = []
        for (game in cityData[store]){
            stock = [cityData[store][game].newStock , cityData[store][game].usedStock]
            gameList.push([game,stock])
        }
        storeList.push([store,gameList])
        
    }
    appendStores(storeList)    

}

//function for managing the stores per city
function appendStores(storeList) {
    divcontainer = d3.select("div#graph_container")
    for (store in storeList) {
        divcontainer.append("div")
                    .attr("id", 'store'+store)
                    .attr('class', 'store_div')
        appendGames(storeList[store][0],storeList[store][1], store)
    }       
}

//function for managing the games (in this cae every game)
function appendGames(storeName, gameList, n) {
    // input format: [{"game1":[n,u]},{"game2":[n,u]}]
    // return div with multiple svg objects
     var target = d3.select("div#store"+n)
     target.append('text')
            .attr('class','store-name')
            .attr("text-anchor", "middle")
            .text(storeName)

     for (game in gameList) {
        target.append('svg')
            .attr("id", "game"+game)
            .attr('width', 250)
            .attr('height', 200)

        createBarChart(gameList[game][0], gameList[game][1], game, n)
     }
}

//function for making the actual barcharts
function createBarChart(gameName, stockData, gameN, storeN) {
    // input format: "gamename", [newStock, usedStock]
    // returns svg object with rect,rect,text
    var w = 60;
    var h = 200;
    var barPadding = 10; 
    var offSet = 95;
    
    graph = d3.select("div#store"+storeN+" svg#game"+gameN)

    graph.selectAll("rect")
            .data(stockData)
            .enter()
            .append("rect")
            .attr("x", function(d, i) {
                return offSet + (i * (w / stockData.length))
            })
            .attr("y", function(d) {
                return h - d * 28 - 30; 
            })
            .attr("width", 30)
            .attr("height", function(d) {
                return d * 28 + 5;  
            })

            .attr("fill", function(d) {
                if (d >= 3){
                    return "#00cc66"
                } else if (d >= 2){
                    return "#ffff99"
                } else if (d >= 1){
                    return "#ff9900"
                } else {
                    return "#cc3300"
                }

            });
    
   graph.selectAll("text")
        .data(stockData)
        .enter()
        .append("text")
        .text(function(d) {
            return d;
        })
         .attr("x", function(d, i) {
                return offSet + (i * (w / stockData.length) + 9);  
        })
        .attr("y", function(d) {
                return h - d * 28 - 17;              
        })
       .attr("font-family", "sans-serif")
       .attr("font-size", "11px")
       .attr("fill", "black")
   
    gameName = gameName.split(':')[0]
    graph.append('text')
        .text(gameName)
        .attr("x", function(d, i) {
                return 30+ i * (w / (stockData.length/2)) ;  
        })
        .attr("y", function(d) {
                return h - 7 * 24 + 19;             
        })
       .attr("font-family", "sans-serif")
       .attr("font-size", "13px")
       .attr("fill", "black");

    graph.append('text')
        .attr('id', 'stock')

    stocklabels = ['New', 'Used']

    graph.selectAll('stock')
        .data(stocklabels)
        .enter()
        .append("text")
        .text(function(d) {
            return d;
        })
         .attr("x", function(d, i) {
                return offSet + (i * (w / (stockData.length))) ;  
        })
        .attr("y", function(d) {
                return h - 5;          
        })
       .attr("font-family", "sans-serif")
       .attr("font-size", "11px")
       .attr("fill", "black");

}

//function for restructing the json data for use per store and their stock
function restruct(data){
    cityDict = {}
    for (gameTitle in data){
        var storeList = data[gameTitle]
        for (i in storeList) {
            var store = storeList[i]
            var city = store['city']

            if (!cityDict.hasOwnProperty(city)) {
                cityDict[city] = {}
            }
            var adres = store['adres']
            if (!cityDict[city].hasOwnProperty(adres)) {
                cityDict[city][adres] = {}    
            }
            
            cityDict[city][adres][gameTitle] = {
                'usedStock': store['usedStock'],
                'newStock': store['newStock']
            }

        }
        
    }

}

//function for setting the city on the map, and make them interactable
//triggers for making the barchart
function stores(){
    var storelist = [{store: "Amsterdam", positions:[250, 270]}, {store: "Eindhoven", positions:[300, 450]}]
    var stores = d3.select('#svg2')

    stores.selectAll('circle')
        .data(storelist)
        .enter()
        .append('circle')
        .attr('r', 10)
        .attr('cx', function(d){ return d.positions[0]})
        .attr('cy', function(d){ return d.positions[1]})
        .attr('fill', '#00cc66')
        .attr('id', function(d){return d.store})


        .on("mouseover", function(d) {
            setTooltipPosition(d.store)
       
            var xPosition =  tooltipPosition.left + 20;
            var yPosition =  tooltipPosition.top - 25;

            d3.select("#tooltip")
              .style("left", xPosition + "px")
              .style("top", yPosition + "px")
              .select("#value")
              .text(d.store);

            //Show the tooltip
            d3.select("#tooltip").classed("hidden", false);
        })
        .on("mouseout", function() {

        //Hide the tooltip
        d3.select("#tooltip").classed("hidden", true);

        })
        .on("click", function(d){
            container = d3.select('div#graph_container')
            divunit = container.selectAll('div')

            if (divunit.empty()) {
                bargraph(d.store)

            } else {
                divunit.remove()
                bargraph(d.store)     
            }     
        })
}

//getting the position of the circle (city) for later placing the tooltip 
function setTooltipPosition (id) {
    var circle = $('#'+id)
    if (circle.length != 0 ){
        tooltipPosition = circle.position()
    }
}


$(document).ready(function(){
    //import the map
    d3.xml("Blank_map_of_the_Netherlands.svg", "image/svg+xml", function(error, xml) {
      if (error) throw error;
      var container = document.getElementById('container')

      container.appendChild(xml.documentElement);
    });
    //import json data
    d3.json("data.json", function(error, json) {
        if (error) return console.warn(error);
        restruct(json)
        stores()
    });

});


