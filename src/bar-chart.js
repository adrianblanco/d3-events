import * as d3 from 'd3'

const margin = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 20
}

const width = 700 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

const svg = d3
  .select('#bar-chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3.scaleBand().range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 85])
  .range([0, height])

// Set color scale for the continents
var colorScale = d3.scaleOrdinal().range(['#feebe2', '#fbb4b9', '#f768a1', '#c51b8a', '#7a0177'])

d3.csv(require('./countries.csv')).then(ready)

function ready(datapoints) {
  // Sort the countries from low to high
  datapoints = datapoints.sort((a, b) => {
    return a.life_expectancy - b.life_expectancy
  })

  // And set up the domain of the xPositionScale
  // using the read-in data
  const countries = datapoints.map(d => d.country)
  xPositionScale.domain(countries)

  /* Rectangles added here */
  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('x', d => {
      return xPositionScale(d.country)
    })
    .attr('y', d => {
    // To change from negative to positive
      return height - yPositionScale(d.life_expectancy)
    })
    .attr('width', 10)
    .attr('height', d => {
    // Example: console.log(heightScale(d.hamburgers))
      return yPositionScale(d.life_expectancy)
    })
    .attr('fill', d => {
      return 'blue'
    })

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(-width)
    .ticks(5)

  d3.select('.y-axis .domain').remove()
}

// Button selectors
// Is there a way to avoid if statements?

  d3.select('#Asia').on('click', function() {
    svg.selectAll('rect').attr('fill', function(d) {
      if (d.continent === 'Asia') {
        return 'pink'
      } else {
        return 'blue'
      }
    })
  })

  d3.select('#africa').on('click', function() {
    svg.selectAll('rect').attr('fill', function(d) {
      if (d.continent === 'Africa') {
        return 'pink'
      } else {
        return 'blue'
      }
    })
  })

  d3.select('#n-america').on('click', function() {
    svg.selectAll('rect').attr('fill', function(d) {
      if (d.continent === 'N. America') {
        return 'pink'
      } else {
        return 'blue'
      }
    })
  })

  d3.select('#low-gdp').on('click', function() {
    svg.selectAll('rect').attr('fill', function(d) {
      if (d.gdp_per_capita < 2000) { // According to the IMF, 2000 would be the barrier for the countries with the lowest GDP per capita
        return 'pink'
      } else {
        return 'blue'
      }
    })
  })

  d3.select('#color-continent').on('click', function() {
    svg.selectAll('rect').attr('fill', function(d) {
      return colorScale(d.continent)
    })
  })

  d3.select('#reset').on('click', function() {
    svg.selectAll('rect').attr('fill', 'blue')
  })