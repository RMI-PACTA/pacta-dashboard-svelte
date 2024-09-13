import * as d3 from 'd3';
import { union } from 'd3-array'
import '../css/plot_styles.css';

export class techmix_sector {
    constructor(container, data) {
        // Data needs to be ordered on year (increasing)
        // Data needs to have two years in 

        function getTechnologyDataForStacking(data, uniqueValueTypes) {
			var subdata_tech = [];

			uniqueValueTypes.forEach((item, index) => {
				subdata_tech[index] = {};
				subdata_tech[index]["val_type"] = item;
				data
					.filter((d) => d.val_type == item)
					.forEach((x) => {
						subdata_tech[index][x.technology] = x.value;
					});
			});

			return subdata_tech;
		}

        function getStackedDataPerYear(data, uniqueValueTypes, year) {

            let dataYear = data.filter(d => d.year == year);
            let subdataTech = getTechnologyDataForStacking(dataYear, uniqueValueTypes);
            let subgroups = d3.keys(subdataTech[0]).slice(1);
            let stackedSubdata = d3.stack().keys(subgroups)(subdataTech);

            return stackedSubdata
        };

        function getGreenBarsValsPerYear(data, uniqueValueTypes, year) {

            let dataYear = data.filter(d => d.year == year);
            let greenData = [];
            uniqueValueTypes.forEach((item, idx) => {
                greenData[idx] = {}
                greenData[idx]["val_type"] = item;
                greenData[idx]["green_sum"] = dataYear.filter(d => d.val_type == item)[0].green_sum;
            })

            return greenData
        };

        let container_div;

		if (typeof container === "string") {
			container_div = document.querySelector(container);
		} else {
			container_div = container;
		}

        container_div.classList.add("stacked_bars");
		container_div.classList.add("d3chart");
		container_div.classList.add("chart_container");

        this.container = d3.select(container_div);

        // Filter the data
        let sector = "Power"
        let subdata = data.filter(d => d.asset_class == "Listed Equity")
            .filter(d => d.ald_sector == sector)
            .filter(d => d.scenario_source == "GECO2023")
            .filter(d => d.scenario == "1.5C")
            .filter(d => d.equity_market == "Global Market");

        // create the stacked data for plotting
        let uniqueYears = d3.map(subdata, d => d.year).keys();
        let uniqueValueTypes = [];
        uniqueYears.forEach( (item, idx) => {
            uniqueValueTypes[idx] = d3.map(subdata.filter(d => d.year == item), d => d.val_type).keys()
        });
        let subdataTechPerYear = []
        uniqueYears.forEach( (item, idx) => {
            subdataTechPerYear[idx] = {};
            subdataTechPerYear[idx]["year"] = item;
            subdataTechPerYear[idx]["stackedData"] = getStackedDataPerYear(subdata, uniqueValueTypes[idx], item);
            subdataTechPerYear[idx]["greenBars"] = getGreenBarsValsPerYear(subdata, uniqueValueTypes[idx], item);
        });
        // TODO: make sure that this captures all possible technologies
        let subgroups = d3.map(subdataTechPerYear[0].stackedData, d => d.key).keys()

        // Declare the chart dimensions and margins.
        const width = 928; 
        const height = 650; 
        const marginTop = 50; 
        const marginRight = 50; 
        const marginBottom = 200; 
        const marginLeft = 200;

        // Declare the x scale
        const x = d3.scaleLinear()
            .domain([0, 1])
            .range([marginLeft, width - marginRight]);

        // Declare the y scales
        const y0 = d3.scaleBand()
            .domain(uniqueYears)
            .rangeRound([marginTop, height - marginBottom])
            .paddingInner(0.1);

        const yCurrent = d3.scaleBand()
            .domain(uniqueValueTypes[0])
            .rangeRound([0, y0.bandwidth()])
            .paddingInner(0.1);

        const yFuture = d3.scaleBand()
            .domain(uniqueValueTypes[1])
            .rangeRound([0, y0.bandwidth()])
            .paddingInner(0.1);

        let barHeight = Math.min(yCurrent.bandwidth() - yCurrent.bandwidth()/5, yFuture.bandwidth() - yFuture.bandwidth()/5)

        // Declare the colours
        const color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(d3.schemeSpectral[subgroups.length])
            .unknown("#ccc");
            
        // Create the svg container
        const svg = this.container
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("style", "max-width: 100%; height: auto;");

        // Add rectangles for each stacked bar - TODO: rewrite into two
        svg.append("g")
            .attr("transform", function(d) { return "translate(0, " + y0(subdataTechPerYear[0].year) + ")"; })
            .selectAll("g")
            .data(subdataTechPerYear[0].stackedData)
            .enter()
            .append("g")
            .attr("fill", D => color(D.key))
            .attr("class", D => sector + " " + D.key)
            .selectAll("rect")
            .data(D => D)
            .enter()
            .append("rect")
            .attr("x", D => x(D[0]))
            .attr("y", D => yCurrent(D.data.val_type))
            .attr("height", barHeight)
            .attr("width", D => x(D[1]) - x(D[0]))

        svg.append("g")
            .attr("transform", function(d) { return "translate(0, " + y0(subdataTechPerYear[1].year) + ")"; })
            .selectAll("g")
            .data(subdataTechPerYear[1].stackedData)
            .enter()
            .append("g")
            .attr("fill", D => color(D.key))
            .attr("class", D => sector + " " + D.key)
            .selectAll("rect")
            .data(D => D)
            .enter()
            .append("rect")
            .attr("x", D => x(D[0]))
            .attr("y", D => yFuture(D.data.val_type))
            .attr("height", barHeight)
            .attr("width", D => x(D[1]) - x(D[0]))


        // Add bars for green technologies
        svg.append("g")
            .attr("transform", function(d) { return "translate(0, " + y0(subdataTechPerYear[0].year) + ")"; })
            .selectAll()
            .data(subdataTechPerYear[0].greenBars)
            .join("g")
            .attr("class", d => "green_bar" + d.val_type)
            .attr("height", 5)
			.attr("fill", "green")
            .append("rect")
            .attr("x", marginLeft)
            .attr("y", d => yCurrent(d.val_type) + (11 * barHeight)/10)
            .attr("height", barHeight/5)
            .attr("width", d => x(d.green_sum) - x(0))

        svg.append("g")
            .attr("transform", function(d) { return "translate(0, " + y0(subdataTechPerYear[1].year) + ")"; })
            .selectAll()
            .data(subdataTechPerYear[1].greenBars)
            .join("g")
            .attr("class", d => "green_bar" + d.val_type)
            .attr("height", 5)
			.attr("fill", "green")
            .append("rect")
            .attr("x", marginLeft)
            .attr("y", d => yFuture(d.val_type) + (11 * barHeight)/10)
            .attr("height", barHeight/5)
            .attr("width", d => x(d.green_sum) - x(0))

        // Add the x axis (top and bottom) and tick labels
        svg.append("g")
            .attr("transform", `translate(0,${marginTop - marginTop/5})`)
            .attr("class", "axis")
            .call(d3.axisTop(x).ticks(5).tickFormat(d3.format('.0%')));

        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .attr("class", "axis")
            .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format('.0%')));

        // Add the y axis and tick labels
        svg.append("g")
            .attr("transform", `translate(${marginLeft},${y0(subdataTechPerYear[0].year)})`)
            .attr("class", "axis")
            .call(d3.axisLeft(yCurrent).tickSizeOuter(0))
            .call(g => g.selectAll(".domain").remove())
            .call(g => g.selectAll(".tick line").remove());

        svg.append("g")
            .attr("transform", `translate(${marginLeft},${y0(subdataTechPerYear[1].year)})`)
            .attr("class", "axis")
            .call(d3.axisLeft(yFuture).tickSizeOuter(0))
            .call(g => g.selectAll(".domain").remove())
            .call(g => g.selectAll(".tick line").remove());

        // Add year labels on the right

        // Append legend rectangles
        let legend = svg.append("g")
            .attr("transform", `translate(${marginLeft},${height - 2 * marginBottom / 3})`)
            .attr("class", "legend")
            .selectAll("g")
            .data(subgroups)
            .enter()
            .append("g")
            .attr("transform", function(d, i) {return "translate(" + ((i % 3) * 230 ) + ", " + Math.floor(i/3) * 30 + ")"; });

        legend.append("rect")
			.attr("width", 22)
			.attr("height", 22)
			.attr("class", d => sector + " " + d)

        // Append legend labels
        legend.append("text")
            .attr("x", 30)
            .attr("y", 20)
			.text(d => d);

        // Append legend for green bars
        let legendGreen = svg.append("g")
            .attr("transform", `translate(${marginLeft},${height - marginBottom / 4})`)
            .attr("class", "legend")
            .selectAll("g")
            .data(["Low-carbon technologies within a sector"])
            .enter()
            .append("g")
            
        legendGreen.append("rect")
        .attr("width", 22)
        .attr("height", 22)
        .attr("fill", "green")

        legendGreen.append("text")
        .attr("x", 30)
        .attr("y", 20)
        .text(d => d);

        // Add hover overs

    }
}