const width = 800
const height = 400
const margin = { top: 10, bottom: 10, left: 10, right: 10 }
const radius = 6;
const gap = 3;

const noOfDots = 100

let selectedCategory = "여자"
let nestedData = d3
    .nest()
    .key(function (d) {
        return d.category
    })
    .entries(data)

let positions = ["left", "right"]


function onClick(val) {
    selectedCategory = val;
    console.log("running : ", val);
    update();
}
let colour = d3.scaleOrdinal()
    .range(["#3366FF", "#FFCC33"])
    .domain(positions)

const svg = d3
    .select('#chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)

const g = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let nodes = []

let xScale = d3.scalePoint()
    .range([0, width])
    .domain(positions)
    .padding(0.5)

for (var i = 0; i < noOfDots - 1; i++) {
    node = {};
    nestedData.forEach(function (d) {
        node[d.key] = i < d.values[0].percentage ? d.values[0].position : d.values[1].position
    })
    nodes.push(node)
}

var simulation = d3
    .forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(5))
    .force('x', d3.forceX().x(function (d) {
        return xScale(d[selectedCategory])
    })
    )
    .force('y', d3.forceY().y((height / 2) + 10))
    .force('collision', d3.forceCollide().radius(function (d) {
        return radius + gap
    })
    )
    .stop()

runSimulation()

let nestByPosition = d3.nest()
    .key(function (d) {
        return d.position
    })
    .sortKeys(d3.ascending)
    .entries(data)


var labels = g.append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(nestByPosition)
    .enter()
    .append("g")
    .attr("transform", function (d) {
        return "translate(" + xScale(d.key) + "," + 50 + ")";
    })


labels.append("text")
    .attr("class", "label label-subcategory")
    .attr("y", 50)
    .style("fill", function (d) {
        return colour(d.key)
    })
    .text(function (d) {
        let index = d.values.findIndex(findCategory)
        return d.values[index].subcategory
    })

labels.append("text")
    .attr("class", "label label-percentage")
    .style("font-size", 30)
    .style("font-weight", "bold")
    .style("fill", function (d) {
        return colour(d.key)
    })
    .text(function (d) {
        let index = d.values.findIndex(findCategory)
        return d.values[index].percentage + "명"
    })

var people = g.append("g")
    .attr("class", "people")
    .selectAll('g')
    .data(nodes)
    .enter()
    .append('g')
    .attr("transform", function (d, i) {
        return "translate(" + d.x + "," + d.y + ") scale(0.2)";
    })
    .style("opacity", function (d) {
        return (Math.random() / 2) + 0.5
    })
    .style('fill', function (d) {
        return colour(d[selectedCategory])
    })

people.append("path")
    .attr("d", function (d, i) {
        return peopleIcons[(i % 2)].part1
    })

people.append("path")
    .attr("d", function (d, i) {
        return peopleIcons[(i % 2)].part2
    })


function update() {

    simulation.force('x', d3.forceX().x(function (d) {
        return xScale(d[selectedCategory])
    })
    )
        .on("tick", ticked)
        .alpha(1)
        .restart()

    labels.selectAll(".label-subcategory")
        .text(function (d) {
            let index = d.values.findIndex(findCategory)
            return d.values[index].subcategory
        })

    labels.selectAll(".label-percentage")
        .text(function (d) {
            let index = d.values.findIndex(findCategory)
            return d.values[index].percentage + "명"
        })
}

function runSimulation() {
    for (var i = 0; i < 120; i++) {
        simulation.tick()
    }
};

function findCategory(d) {
    return d.category == selectedCategory
};

function ticked() {
    people.transition()
        .duration(75)
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ") scale(0.2)";
        })
        .style('fill', function (d) {
            return colour(d[selectedCategory])
        })
};


