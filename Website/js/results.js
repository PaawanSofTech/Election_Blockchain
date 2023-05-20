window.onload=function(){

  var width = 400;
  var height = 400;
  var radius = 200;
  var innerRadius = 85;
  var textOffset = -50;
  var tweenDuration = 1050;

  //OBJECTS TO BE POPULATED WITH DATA LATER
  var lines, valueLabels, nameLabels;
  var pieData = [];
  var oldPieData = [];
  var filteredPieData = [];

  //D3 helper function to populate pie slice parameters from array data
  var donut = d3.layout.pie().value(function(d){
    return d.itemValue;
  }).sort(null);

  //D3 helper function to create colors from an ordinal scale
  // var color = d3.scale.category20();
  var color = d3.scale.ordinal()
    .range([ "#0066cc", "#00ff00","#ffff00", "#ff0000", "#990099", "#666699"]);
  // var color = d3.scale.ordinal()
    // .range(["#FF0000", "#009933" , "#0000FF"]);

  //D3 helper function to draw arcs, populates parameter "d" in path object
  var arc = d3.svg.arc()
    .startAngle(function(d){ return d.startAngle; })
    .endAngle(function(d){ return d.endAngle; })
    .innerRadius(innerRadius)
    .outerRadius(radius);

  ///////////////////////////////////////////////////////////
  // GENERATE FAKE DATA /////////////////////////////////////
  ///////////////////////////////////////////////////////////

  var data;

  var dataStructure = [
     {
        "data":[
          {
            "itemLabel":"B.J.P.",
            "itemValue":91
          },
          {
            "itemLabel":"I.N.C",
            "itemValue":30
          },
          {
            "itemLabel":"S.S",
            "itemValue":25
          },
          {
            "itemLabel":"A.J.P.",
            "itemValue":20
          },
          {
            "itemLabel":"L.J.P",
            "itemValue":15
          },
          {
            "itemLabel":"Other",
            "itemValue":142
          },

        ],
        "label":"2010",
        "fund":"Defensive"
     },

     {
      "data":[
        {
          "itemLabel":"B.J.P.",
          "itemValue":282
        },
        {
          "itemLabel":"I.N.C",
          "itemValue":44
        },
        {
          "itemLabel":"S.S",
          "itemValue":18
        },
        {
          "itemLabel":"A.A.P.",
          "itemValue":15
        },
        {
          "itemLabel":"L.J.P",
          "itemValue":16
        },
        {
          "itemLabel":"Other",
          "itemValue":189
        },

      ],
      "label":"2014",
      "fund":"Defensive"
   },

   {
    "data":[
      {
        "itemLabel":"B.J.P.",
        "itemValue":303
      },
      {
        "itemLabel":"I.N.C",
        "itemValue":52
      },
      {
        "itemLabel":"S.S",
        "itemValue":28
      },
      {
        "itemLabel":"A.J.P.",
        "itemValue":22
      },
      {
        "itemLabel":"L.J.P",
        "itemValue":25
      },
      {
        "itemLabel":"Other",
        "itemValue":162
      },

    ],
    "label":"2019",
    "fund":"Defensive"
 },
     
  ];

  ///////////////////////////////////////////////////////////
  // CREATE VIS & GROUPS ////////////////////////////////////
  ///////////////////////////////////////////////////////////

  var vis = d3.select("#pie-chart").append("svg:svg")
    .attr("width", '100%')
    .attr("height", '100%')
    .attr('viewBox','0 0 '+Math.min(width,height)+' '+Math.min(width,height))
    .attr('preserveAspectRatio','xMinYMin')
    .attr("transform", "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")");

  //GROUP FOR ARCS/PATHS
  var arc_group = vis.append("svg:g")
    .attr("class", "arc")
    .attr("transform", "translate(" + (width/2) + "," + (height/2) + ")");

  //GROUP FOR LABELS
  var label_group = vis.append("svg:g")
    .attr("class", "label_group")
    .attr("transform", "translate(" + (width/2) + "," + (height/2) + ")");

  //GROUP FOR CENTER TEXT
  var center_group = vis.append("svg:g")
    .attr("class", "center_group")
    .attr("transform", "translate(" + (width/2) + "," + (height/2) + ")");

  //PLACEHOLDER GRAY CIRCLE
  // var paths = arc_group.append("svg:circle")
  //     .attr("fill", "#EFEFEF")
  //     .attr("r", radius + 100);

  ///////////////////////////////////////////////////////////
  // CENTER TEXT ////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  //WHITE CIRCLE BEHIND LABELS
  var whiteCircle = center_group.append("svg:circle")
    .attr("fill", "white")
    .attr("r", innerRadius);

  //Gradient test

  ///////////////////////////////////////////////////////////
  // STREAKER CONNECTION ////////////////////////////////////
  ///////////////////////////////////////////////////////////

  // to run each time data is generated
  function update(number) {

    data = dataStructure[number].data;

    oldPieData = filteredPieData;
    pieData = donut(data);

    var sliceProportion = 0; //size of this slice
    filteredPieData = pieData.filter(filterData);
    function filterData(element, index, array) {
      element.name = data[index].itemLabel;
      element.value = data[index].itemValue;
      sliceProportion += element.value;
      return (element.value > 0);
    }

    //apply transparent gradient
    var grads = vis.append("defs")
        .selectAll("radialGradient")
        .data(donut(dataStructure[0].data))
        .enter().append("radialGradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", "100%")
        .attr("id", function(d, i) { return "grad" + i; });

    grads.append("stop").attr("offset", "20%")
      .style("stop-color", function(d, i) { return color(i); })
      .style("stop-opacity", 0.8);

    grads.append("stop").attr("offset", "44%")
      .style("stop-color", function(d, i) { return color(i); });


    grads.append("stop").attr("offset", "44.3%")
      .style("stop-color", function(d, i) { return color(i); })
      .style("stop-opacity", 0.5);

    //DRAW ARC PATHS
    paths = arc_group.selectAll("path").data(filteredPieData);
    paths.enter().append("svg:path")
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("fill", function(d, i) { return "url(#grad" + i + ")"; })
      .transition()
      .duration(tweenDuration)
      .attrTween("d", pieTween);
    paths
      .transition()
      .duration(tweenDuration)
      .attrTween("d", pieTween);
    paths.exit()
      .transition()
      .duration(tweenDuration)
      .attrTween("d", removePieTween)
      .remove();




    //DRAW LABELS WITH ENTITY NAMES
    nameLabels = label_group.selectAll("text.units").data(filteredPieData)
      .attr("transform", function(d) {
        return "translate(" + arc.centroid(d) + ")";
      })
      .attr("dy", function(d){
        if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
          return 25;
        } else {
          return 25;
        }
      })
      .style("text-anchor", "middle")
      .text(function(d){
        return d.name;
      });

    nameLabels.enter().append("svg:text")
      .attr("class", "units")
      .attr("transform", function(d) {
        return "translate(" + arc.centroid(d) + ")";
      })
      // .attr("dy", ".15em")
      .attr("dy", function(d){
        if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
          return 25;
        } else {
          return 25;
        }
      })
      .style("text-anchor", "middle")
      .text(function(d){
        return d.name;
      });
      // .attr("transform", function(d) {
      //   return "translate(" + Math.cos(((d.startAngle+d.endAngle - Math.PI)/2)) * (radius+textOffset) - 10 + "," + Math.sin((d.startAngle+d.endAngle - Math.PI)/2) * (radius+textOffset) + ")";
      // })
      // .attr("dy", function(d){
      //     if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
      //       return -75;
      //     } else {
      //       return 25;
      //     }
      //   })
      // .attr("text-anchor", function(d){
      //     if ((d.startAngle+d.endAngle)/2 < Math.PI ) {
      //       return "beginning";
      //     } else {
      //       return "end";
      //     }
      //   }).text(function(d){
      //     return d.name;
      //   });

    nameLabels.transition().duration(tweenDuration).attrTween("transform", textTween);

    nameLabels.exit().remove();

}

  ///////////////////////////////////////////////////////////
  // FUNCTIONS //////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  // Interpolate the arcs in data space.
  function pieTween(d, i) {
    var s0;
    var e0;
    if(oldPieData[i]){
      s0 = oldPieData[i].startAngle;
      e0 = oldPieData[i].endAngle;
    } else if (!(oldPieData[i]) && oldPieData[i-1]) {
      s0 = oldPieData[i-1].endAngle;
      e0 = oldPieData[i-1].endAngle;
    } else if(!(oldPieData[i-1]) && oldPieData.length > 0){
      s0 = oldPieData[oldPieData.length-1].endAngle;
      e0 = oldPieData[oldPieData.length-1].endAngle;
    } else {
      s0 = 0;
      e0 = 0;
    }
    var i = d3.interpolate({startAngle: s0, endAngle: e0}, {startAngle: d.startAngle, endAngle: d.endAngle});
    return function(t) {
      var b = i(t);
      return arc(b);
    };
  }

  function removePieTween(d, i) {
    s0 = 2 * Math.PI;
    e0 = 2 * Math.PI;
    var i = d3.interpolate({startAngle: d.startAngle, endAngle: d.endAngle}, {startAngle: s0, endAngle: e0});
    return function(t) {
      var b = i(t);
      return arc(b);
    };
  }

  function textTween(d, i) {
    var a;
    if(oldPieData[i]){
      a = (oldPieData[i].startAngle + oldPieData[i].endAngle - Math.PI)/2;
    } else if (!(oldPieData[i]) && oldPieData[i-1]) {
      a = (oldPieData[i-1].startAngle + oldPieData[i-1].endAngle - Math.PI)/2;
    } else if(!(oldPieData[i-1]) && oldPieData.length > 0) {
      a = (oldPieData[oldPieData.length-1].startAngle + oldPieData[oldPieData.length-1].endAngle - Math.PI)/2;
    } else {
      a = 0;
    }
    var b = (d.startAngle + d.endAngle - Math.PI)/2;

    var fn = d3.interpolateNumber(a, b);
    return function(t) {
      var val = fn(t);
      return "translate(" + Math.cos(val) * (radius+textOffset) + "," + (Math.sin(val) * (radius+textOffset) - 20) + ")";
    };
  }

  $( "#slider" ).slider({
      value: 0,
      min: 0,
      max: 4,
      step: 1,
      slide: function( event, ui ) {
        update(ui.value);
        console.log(ui.value);
      }
  })
  .each(function() {

    //
    // Add labels to slider whose values
    // are specified by min, max and whose
    // step is set to 1
    //

    // Get the options for this slider
    var opt = $(this).data().uiSlider.options;

    // Get the number of possible values
    var vals = opt.max - opt.min;

    // Space out values
    for (var i = 0; i <= vals; i++) {

      var el = $('<label>'+dataStructure[i].label+'</label>').css('left',(i/vals*100)+'%');

      $( "#slider" ).append(el);

    }

  });

  update(0);
}//]]>