import React from "react";
import "./index.css";
import * as d3 from "d3";

class CorrelationMatrix extends React.Component {
  render() {
    return <div id="matrix" />;
  }

  componentDidMount() {
    d3.csv(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_correlogram.csv"
    ).then(function(_data) {
      var data = [];

      console.log(_data);
      let rows = _data;

      rows.forEach(function(d) {
        var x = d[""];
        delete d[""];
        for (let prop in d) {
          var y = prop,
            value = d[prop];
          data.push({
            x: x,
            y: y,
            value: +value
          });
        }
      });

      var margin = {
          top: 25,
          right: 80,
          bottom: 25,
          left: 25
        },
        width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        domain = d3
          .set(
            data.map(function(d) {
              return d.x;
            })
          )
          .values(),
        num = Math.sqrt(data.length),
        color = d3
          .scaleLinear()
          .domain([-1, 0, 1])
          .range(["#B22222", "#fff", "#000080"]);

      var x = d3
          .scalePoint()
          .range([0, width])
          .domain(domain),
        y = d3
          .scalePoint()
          .range([0, height])
          .domain(domain),
        xSpace = x.range()[1] - x.range()[0],
        ySpace = y.range()[1] - y.range()[0];
      ySpace = y.range()[1] - y.range()[0];

      var svg = d3
        .select("#matrix")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var cor = svg
        .selectAll(".cor")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "cor")
        .attr("transform", function(d) {
          return "translate(" + x(d.x) + "," + y(d.y) + ")";
        });

      // it fits with v3
      // cor.append("rect")
      //   .attr("width", xSpace)
      //   .attr("height", ySpace)
      //   .attr("x", -xSpace / 2)
      //   .attr("y", -ySpace / 2)

      //edited to fit with v4 update  2/5/18
      cor
        .append("rect")
        .attr("width", xSpace / 10)
        .attr("height", ySpace / 10)
        .attr("x", -xSpace / 20)
        .attr("y", -ySpace / 20);

      cor
        .filter(function(d) {
          var ypos = domain.indexOf(d.y);
          var xpos = domain.indexOf(d.x);
          for (var i = ypos + 1; i < num; i++) {
            if (i === xpos) return false;
          }
          return true;
        })
        .append("text")
        .attr("y", 5)
        .text(function(d) {
          if (d.x === d.y) {
            return d.x;
          } else {
            return d.value.toFixed(2);
          }
        })
        .style("fill", function(d) {
          if (d.value === 1) {
            return "#000";
          } else {
            return color(d.value);
          }
        });

      cor
        .filter(function(d) {
          var ypos = domain.indexOf(d.y);
          var xpos = domain.indexOf(d.x);
          for (var i = ypos + 1; i < num; i++) {
            if (i === xpos) return true;
          }
          return false;
        })
        .append("circle")
        .attr("r", function(d) {
          return (width / (num * 2)) * (Math.abs(d.value) + 0.1);
        })
        .style("fill", function(d) {
          if (d.value === 1) {
            return "#000";
          } else {
            return color(d.value);
          }
        });

      var aS = d3
        .scaleLinear()
        .range([-margin.top + 5, height + margin.bottom - 5])
        .domain([1, -1]);

      var yA = d3
        .axisRight()
        .scale(aS)
        .tickPadding(7);

      var aG = svg
        .append("g")
        .attr("class", "y axis")
        .call(yA)
        .attr("transform", "translate(" + (width + margin.right / 2) + " ,0)");

      var iR = d3.range(-1, 1.01, 0.01);
      var h = height / iR.length + 3;
      iR.forEach(function(d) {
        aG.append("rect")
          .style("fill", color(d))
          .style("stroke-width", 0)
          .style("stoke", "none")
          .attr("height", h)
          .attr("width", 10)
          .attr("x", 0)
          .attr("y", aS(d));
      });
    });
  }
}

export default CorrelationMatrix;
