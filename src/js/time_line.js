// src/js./time_line.js
import * as d3 from 'd3';
import '../css/plot_styles.css';

export class time_line {
	constructor(container, data) {
		let container_div;
		if (typeof container === 'string') {
			container_div = document.querySelector(container);
		} else {
			container_div = container;
		}

		d3.select(container_div).attr('chart_type', 'time_line');

		container_div.innerHTML = '';
	
		container_div.classList.add('time_lineChart');
		container_div.classList.add('d3chart');
		container_div.classList.add('emissionstrajectory_chart');
		container_div.classList.add('chart_container');

		this.container = d3.select(container_div);

		// Declare the chart dimensions and margins.
		const width = 928;
		const height = 650;
		const marginTop = 50;
		const marginRight = 50;
		const marginBottom = 200;
		const marginLeft = 200;

		const svg = this.container
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('viewBox', [0, 0, width, height])
			.attr('preserveAspectRatio', 'xMinYMin meet')
			.attr('style', 'max-width: 100%; height: auto;');

		let asset_class = document.querySelector('#asset_class_selector').value,
		 sector = document.querySelector('#sector_selector').value,
		 allocation_method = document.querySelector('#allocation_method_selector').value,
		 equity_market = document.querySelector('#equity_market_selector').value;

		//filter data 
		let subdata = data
			.filter((d) => d.asset_class == asset_class)
			.filter((d) => d.sector == sector)
			.filter((d) => d.allocation_translation == allocation_method)
			.filter((d) => d.equity_market == equity_market);

		if (subdata.length == 0) {
			container_div.querySelector('svg').innerHTML = '';
			return;
		}

		const parseYear = d3.timeParse('%Y');

		const x = d3
			.scaleTime()
			.domain(d3.extent(subdata, (d) => parseYear(d.year)))
			.range([marginLeft, width - marginRight]);

		const y = d3
			.scaleLinear()
			.domain(d3.extent(subdata, (d) => d.value)).nice()
			.range([marginTop, height - marginBottom]);

		// Declare colours
		let line_color = '#1b324f',
		 scen_line_color = '#00c082';

		// Declare text labels
		let xtitle = '',
		 scen_label = 'Scenario', 
		 port_label = 'Portfolio', 
		 hoverover_value = 'Value: ',
		 footnote = '* start date of the analysis';

		const line = d3
		 	.line()
		 	.x(d => x(parseYear(d.year)))
		 	.y(d => y(d.value));
		
		let entries = d3.nest().key((d) => d.name);

		let linedata = entries.entries(subdata);

		// Add lines
		svg
			.selectAll('.line')
			.data(linedata)
			.enter()
			.append('path')
			.attr('class', 'line')
			.style('fill', 'none')
			.style('stroke', (d) => (d.values[0].plan == 'plan' ? line_color : scen_line_color))
			.style('stroke-width', '2px')
			.attr('id', (d) => d.key)
			.attr('d', (d) => line(d.values));

		// Add dots for datapoints
		svg
			.selectAll('.dot')
			.data(subdata)
			.enter()
			.append('circle')
			.attr('class', 'dot')
			.attr('r', 5)
			.style('stroke', '#fff')
			.style('fill', (d) => (d.plan == 'plan' ? line_color : scen_line_color))
			.attr('name', (d) => d.key)
			.attr('x_value', (d) => d.year)
			.attr('y_value', (d) => d.value)
			.attr('cx', (d) => x(parseYear(d.year)))
			.attr('cy', (d) => y(d.value))
			.on('mouseover', mouseover)
			.on('mousemove', mousemove)
			.on('mouseout', mouseout);

		const tooltip = d3
			.select(container_div)
			.append('div')
			.attr('class', 'd3tooltip')
			.style('display', 'none');

		// Add x axis
		const num_of_years = 1 + Math.abs(x.domain().reduce((a, b) => a.getFullYear() - b.getFullYear()));
		let tick_labels = d3
				.map(subdata, (d) => d.year)
				.keys()
				.slice(0, Math.min(num_of_years, 5) + 1);
		tick_labels[0] = '31-Dec-' + tick_labels[0] + '*'; 

		svg
			.append('g')
			.attr('class', 'axis')
			.attr('transform', 'translate(0,' + (height - marginBottom) + ')')
			.call(
				d3
					.axisBottom(x)
					.ticks(Math.min(num_of_years, 5))
					.tickFormat((d, i) => tick_labels[i])
			);	

		// Add y axis
		svg
			.append('g')
			.attr('class', 'axis')
			.attr('transform', 'translate(' + marginLeft + ',0)')
			.call(d3.axisLeft(y).ticks(6).tickFormat(d3.format('.3s')));
		
		// Add y axis title
		svg
			.append('text')
			.attr('class', 'axis')
			.attr('transform', `translate(${marginLeft /2},${(height - marginBottom)/2 + 15}) rotate(-90)`)
			.attr('x', 0)
			.attr('y', 0)
			.attr('dy', '1em')
			.style('text-anchor', 'middle')
			.text(subdata.map((d) => d.unit_translation)[0]);

		// Add footnote
		svg
		 	.append('g')
		 	.attr('class', 'footnote')
		 	.attr(
		 		'transform',
		 		'translate(' +
		 			(width - marginRight/2) +
		 			',' +
		 			(height - marginTop - 5 * marginBottom / 12) +
		 			')'
		 	)
			.append('text')
			.attr('x', 0)
			.attr('y', 0)
			.style('text-anchor', 'end')
			.style('alignment-baseline', 'central')
			.style('font-size', '1.2em')
			.text(footnote);

		// Add legend
		let legend_data = [port_label, subdata.map((d) => d.scenario)[0] + ' ' + scen_label];

		let legend = svg
			.append('g')
			.attr('class', 'legend')
			.attr('transform', 'translate(' + marginLeft + ',' + (height - marginBottom / 3) + ')')
			.selectAll('g')
			.data(legend_data)

		legend
		 	.enter()
			.append('line')
			.attr('x1', (d) => (d == port_label ? 0 : 200))
			.attr('x2', (d) => (d == port_label ? 60 : 260))
			.attr('y1', 0)
			.attr('y2', 0)
			.style('stroke-width', 2)
			.style('stroke', (d) => (d == port_label ? line_color : scen_line_color));

			legend
				.enter()
				.append('circle')
				.attr('r', 5)
				.attr('cx', (d) => (d == port_label ? 30 : 230))
				.attr('cy', 0)
				.style('stroke', '#fff')
				.style('fill', (d) => (d == port_label ? line_color : scen_line_color));

			legend
				.enter()
				.append('text')
				.attr('x', (d) => (d == port_label ? 70 : 270))
				.attr('y', 3)
				.text((d) => d)
				.attr('alignment-baseline', 'middle');

		function mouseover(d) {
			tooltip
				.html(
					(d.plan == 'plan' ? port_label : scen_label) +
						'<br>' +
						hoverover_value +
						d3.format('.5f')(d.value) +
						' ' +
						d.unit_translation
				)
				.style('display', 'inline-block')
				.style('left', d3.event.pageX + 10 + 'px')
				.style('top', d3.event.pageY - 20 + 'px');
		}

		function mousemove() {
			tooltip
				.style('left', d3.event.pageX + 10 + 'px')
				.style('top', d3.event.pageY - 20 + 'px');
		}

		function mouseout() {
			tooltip.style('display', 'none');
		}

		}
	}