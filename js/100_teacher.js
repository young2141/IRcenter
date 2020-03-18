let data = [
    {
        "category": "여자",
        "subcategory": "여자",
        "position": "left",
        "percentage": 38
    },
    {
        "category": "여자",
        "subcategory": "그 외",
        "position": "right",
        "percentage": 62
    },
    {
        "category": "남자",
        "subcategory": "남자",
        "position": "left",
        "percentage": 62
    },
    {
        "category": "남자",
        "subcategory": "그 외",
        "position": "right",
        "percentage": 38
    },
    {
        "category": "일반직",
        "subcategory": "일반직",
        "position": "left",
        "percentage": 62
    },
    {
        "category": "일반직",
        "subcategory": "그 외",
        "position": "right",
        "percentage": 38
    },
    {
        "category": "거주지2",
        "subcategory": "거주지(기타)",
        "position": "left",
        "percentage": 38
    },
    {
        "category": "거주지2",
        "subcategory": "그 외",
        "position": "right",
        "percentage": 62
    },
    {
        "category": "조기졸업",
        "subcategory": "조기졸업",
        "position": "left",
        "percentage": 1
    },
    {
        "category": "조기졸업",
        "subcategory": "그 외",
        "position": "right",
        "percentage": 99
    },
    {
        "category": "복수전공",
        "subcategory": "복수전공 이수 졸업",
        "position": "left",
        "percentage": 8
    },
    {
        "category": "복수전공",
        "subcategory": "그 외",
        "position": "right",
        "percentage": 92
    },
    {
        "category": "부전공",
        "subcategory": "부전공 이수 졸업",
        "position": "left",
        "percentage": 16
    },
    {
        "category": "부전공",
        "subcategory": "그 외",
        "position": "right",
        "percentage": 84
    },
    {
        "category": "대학원진학",
        "subcategory": "대학원진학",
        "position": "left",
        "percentage": 9
    },
    {
        "category": "대학원진학",
        "subcategory": "그 외",
        "position": "right",
        "percentage": 91
    },
    {
        "category": "내국인",
        "subcategory": "내국인",
        "position": "left",
        "percentage": 96
    },
    {
        "category": "내국인",
        "subcategory": "그 외",
        "position": "right",
        "percentage": 4
    },
    {
        "category": "외국인",
        "subcategory": "외국인",
        "position": "left",
        "percentage": 4
    },
    {
        "category": "외국인",
        "subcategory": "그 외",
        "position": "right",
        "percentage": 96
    }
]

let peopleIcons = [
    {
        "part1": "m 46.004,21.672 c 5.975,0 10.836,-4.861 10.836,-10.836 C 56.84,4.861 51.979,0 46.004,0 40.029,0 35.169,4.861 35.169,10.836 c 0,5.975 4.86,10.836 10.835,10.836 z",
        "part2": "M 68.074,54.008 59.296,26.81 C 58.826,25.354 57.26,24.214 55.73,24.214 H 54.418 53.48 38.526 37.588 36.276 c -1.53,0 -3.096,1.14 -3.566,2.596 l -8.776,27.198 c -0.26,0.807 -0.152,1.623 0.297,2.24 0.449,0.617 1.193,0.971 2.041,0.971 h 2.25 c 1.53,0 3.096,-1.14 3.566,-2.596 l 2.5,-7.75 v 10.466 0.503 29.166 c 0,2.757 2.243,5 5,5 h 0.352 c 2.757,0 5,-2.243 5,-5 V 60.842 h 2.127 v 26.166 c 0,2.757 2.243,5 5,5 h 0.352 c 2.757,0 5,-2.243 5,-5 V 57.842 57.339 46.869 l 2.502,7.754 c 0.47,1.456 2.036,2.596 3.566,2.596 h 2.25 c 0.848,0 1.591,-0.354 2.041,-0.971 0.45,-0.617 0.556,-1.433 0.296,-2.24 z"
    },
    {
        "part1": "m 49.437,19.672 c 5.424,0 9.836,-4.413 9.836,-9.836 C 59.273,4.413 54.861,0 49.437,0 c -5.423,0 -9.835,4.413 -9.835,9.836 0,5.423 4.411,9.836 9.835,9.836 z",
        "part2": "M 71.508,52.416 62.73,25.217 c -0.47,-1.456 -2.037,-2.596 -3.566,-2.596 h -2.127 c -0.031,0 -0.059,0.009 -0.09,0.01 -0.032,-0.001 -0.062,-0.01 -0.094,-0.01 h -14.83 c -0.058,0 -0.112,0.014 -0.169,0.017 -0.055,-0.003 -0.106,-0.017 -0.161,-0.017 h -1.654 c -1.53,0 -3.096,1.14 -3.566,2.596 l -8.777,27.198 c -0.26,0.807 -0.152,1.623 0.297,2.24 0.449,0.617 1.193,0.971 2.041,0.971 h 1.38 c 1.526,0 3.098,-1.135 3.579,-2.584 l 4.031,-12.159 v 6.562 c -0.678,0.403 -1.265,0.954 -1.616,1.572 l -6.617,11.684 c -0.414,0.73 -0.478,1.553 -0.175,2.258 0.302,0.705 0.942,1.226 1.757,1.43 l 7.232,1.809 v 29.005 c 0,2.206 1.794,4 4,4 h 0.976 c 2.206,0 4,-1.794 4,-4 V 68.348 c 0.34,0.033 0.699,0.052 1.069,0.052 0.472,0 0.925,-0.03 1.344,-0.083 v 26.886 c 0,2.206 1.794,4 4,4 h 0.976 c 2.206,0 4,-1.794 4,-4 V 66.08 l 6.542,-1.68 c 0.812,-0.208 1.45,-0.733 1.75,-1.44 0.3,-0.707 0.236,-1.53 -0.177,-2.259 L 61.468,49.017 C 61.118,48.398 60.53,47.848 59.852,47.445 V 40.56 l 4.336,12.505 c 0.499,1.437 2.08,2.562 3.6,2.562 h 1.382 c 0.848,0 1.591,-0.354 2.041,-0.971 0.449,-0.617 0.557,-1.434 0.297,-2.24 z"
    },
]
const width = 800
const height = 400
const margin = { top: 10, bottom: 10, left: 10, right: 10 }
const radius = 6;
const gap = 3;

const noOfDots = 100;

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
    .style("font-size", 25)
    .style("font-weight", "bold")
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
    .style("font-size", 35)
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


