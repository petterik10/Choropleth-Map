// Creating a Choropleth Map from U.S Educational Attainment .
// Using D3.js to visualize data with AJAX request and JSON API.
// Creating the project for freeCodeCamp Data Visualization Certification as a fourth project.

const width = 1200;
const height = 1050;
const padding = 85;

const tooltip = d3
  .select("#tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden")
  .attr("class", "tooltip")
  .attr("id", "tooltip");

const legendContainer = [
  { color: "rgba(200, 252, 167)", percentage: "3%" },
  { color: "rgba(136, 189, 100 )", percentage: "12%" },
  { color: "rgba(90, 154, 49)", percentage: "21%" },
  { color: "rgb(82, 172, 23)", percentage: "30%" },
  { color: "rgba(56, 132, 6)", percentage: "39%" },
  { color: "rgba(38, 88, 5 )", percentage: "57%" },
  { color: "rgba(37, 64, 20 )", percentage: "66%" },
];

const svg = d3.select("svg");
svg.attr("viewBox", `0 0 1000 650`);

const setLegendContainer = () => {
  const legend = svg
    .append("g")
    .attr("id", "legend")
    .selectAll("#legend")
    .data(legendContainer)
    .enter()
    .append("g")
    .attr("transform", "translate(-460, 0)");

  legend
    .append("rect")
    .attr("y", 69)
    .attr("x", (d, i) => {
      return width - 6 - padding + i * 25;
    })
    .attr("width", 25)
    .attr("height", 25)
    .attr("fill", (elem) => {
      return elem.color;
    })
    .style("stroke", "black");

  legend
    .append("text")
    .attr("x", (d, i) => {
      return width - 7 - padding + i * 25;
    })
    .attr("y", 104)
    .text((d) => {
      return d.percentage;
    })
    .attr("font-size", 10)
    .attr("text-anchor", "start")
    .attr("font-weight", "bold");
};

const SetData = (countyData, educationData) => {
  const geoJson = topojson.feature(countyData, countyData.objects.counties)
    .features;

  svg
    .selectAll("path")
    .data(geoJson)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("fill", (item) => {
      const countyID = item.id;
      const setCountyColor = educationData.filter((elem, i) => {
        return elem.fips == countyID;
      });
      if (setCountyColor[0].bachelorsOrHigher <= 3) {
        return "rgba(200, 252, 167)";
      } else if (setCountyColor[0].bachelorsOrHigher <= 12) {
        return "rgba(136, 189, 100 )";
      } else if (setCountyColor[0].bachelorsOrHigher <= 21) {
        return "rgba(90, 154, 49)";
      } else if (setCountyColor[0].bachelorsOrHigher <= 30) {
        return "rgb(82, 172, 23)";
      } else if (setCountyColor[0].bachelorsOrHigher <= 39) {
        return "rgba(56, 132, 6)";
      } else if (setCountyColor[0].bachelorsOrHigher <= 57) {
        return "rgba(38, 88, 5 )";
      } else if (setCountyColor[0].bachelorsOrHigher <= 66) {
        return "rgba(37, 64, 20 )";
      } else {
        return "rgba(20, 51, 0 )";
      }
    })
    .attr("data-fips", (elem) => {
      return elem.id;
    })
    .attr("data-education", (elem) => {
      const countyID = elem.id;
      const educationalDegree = educationData.filter((elem, i) => {
        return elem.fips == countyID;
      });
      return educationalDegree[0].bachelorsOrHigher;
    })
    .on("mouseover", (d, i) => {
      const countyID = d.id;
      const getTooltipInfo = educationData.filter((elem, i) => {
        return elem.fips == countyID;
      });
      tooltip.style("visibility", "visible");
      tooltip.html(`State: ${getTooltipInfo[0].state} <br>
          ${getTooltipInfo[0].area_name} <br>
          ${getTooltipInfo[0].bachelorsOrHigher}%
       `);
      tooltip.attr("data-education", getTooltipInfo[0].bachelorsOrHigher);
      tooltip
        .style("top", event.pageY - 2 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", (d) => {
      tooltip.style("visibility", "hidden");
    });

  setLegendContainer();
};

Promise.all([
  fetch(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
  ).then((resp) => resp.json()),
  fetch(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
  ).then((resp) => resp.json()),
]).then((res) => {
  SetData(res[0], res[1]);
});
