import * as d3 from 'd3';
import { union } from 'd3-array'
import '../css/plot_styles.css';

export class techmix_sector {
    constructor(container, data) {

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
            .filter(d => d.equity_market == "Global Market")
            .filter(d => d.year == 2028);

        // create the stacked data for plotting
        let uniqueValueTypes = d3.map(subdata, (d) => d.val_type).keys();
		let subdataTech = getTechnologyDataForStacking(subdata, uniqueValueTypes);
        let subgroups = d3.keys(subdataTech[0]).slice(1);
        var stackedSubdata = d3.stack().keys(subgroups)(subdataTech);

        // Declare the chart dimensions and margins.
        const width = 928; // TODO: make variable based on container
        const height = 600; // TODO: make variable based on container
        const marginTop = 50; // TODO: make variable based on container - step-wise
        const marginRight = 40; // TODO: make variable based on container - step-wise 
        const marginBottom = 130; // TODO: make variable based on container - step-wise (will contain a legend)
        const marginLeft = 140; // TODO: make variable based on container - step-wise

        // Declare the x scale
        const x = d3.scaleLinear()
            .domain([0, 1])
            .range([marginLeft, width - marginRight]);

        // Declare the y scale
        const y = d3.scaleBand()
            .domain(uniqueValueTypes)
            .rangeRound([marginTop, height - marginBottom])
            .paddingInner(0.1)

        // Declare the colours
        const color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(d3.schemeSpectral[stackedSubdata.length])
            .unknown("#ccc");
            
        // Create the svg container
        const svg = this.container
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("style", "max-width: 100%; height: auto;");

        // Add rectangles for each stacked bar
        svg.append("g")
            .selectAll()
            .data(stackedSubdata)
            .join("g")
            .attr("fill", d => color(d.key))
            .attr("class", d => sector + " " + d.key)
            .selectAll("rect")
            .data(D => D.map(d => (d.key = D.key, d)))
            .join("rect")
            .attr("x", d => x(d[0]))
            .attr("y", d => y(d.data.val_type))
            .attr("height", y.bandwidth() - (height - marginTop - marginBottom)/10)
            .attr("width", d => x(d[1]) - x(d[0]))

        // Add bars for green technologies
        svg.append("g")
            .selectAll()
            .data(subdata)
            .join("g")
            .attr("class", d => "green_bar" + d.val_type)
            .attr("height", 5)
			.attr("fill", "green")
			.attr("visibility", (d) => (d.green ? "visible" : "hidden"))
            .append("rect")
            .attr("x", marginLeft)
            .attr("y", d => y(d.val_type) + (7.3 * y.bandwidth())/10)
            .attr("height", (height - marginTop - marginBottom)/30)
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
            .attr("transform", `translate(${marginLeft},0)`)
            .attr("class", "axis")
            .call(d3.axisLeft(y).tickSizeOuter(0))
            .call(g => g.selectAll(".domain").remove())
            .call(g => g.selectAll(".tick line").remove());

        // Add year labels on the right

        // Append legend rectangles
        let legend = svg.append("g")
            .attr("transform", `translate(${marginLeft},${height - marginBottom / 2})`)
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

        // Add hover overs

    }
}