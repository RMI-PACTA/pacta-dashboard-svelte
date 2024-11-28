import * as d3 from 'd3';
import { cumsum } from 'd3-array';

export class company_bubble {
	constructor(container, data) {
		let container_div;

		if (typeof container === 'string') {
			container_div = document.querySelector(container);
		} else {
			container_div = container;
		}

		container_div.innerHTML = '';

		container_div.classList.add('BubbleChart');
		container_div.classList.add('d3chart');
		container_div.classList.add('companybubble_chart');
		container_div.classList.add('chart_container');

		this.container = d3.select(container_div);

		// Declare the chart dimensions and margins.
		const width = 600;
		const height = 500;
		const marginTop = 40;
		const marginRight = 60;
		const marginBottom = 80;
		const marginLeft = 85;
		let size = height - marginTop - marginBottom;

		// Chart parameters
		let year_span = 5,
			xvar = 'plan_tech_share',
			yvar = 'y',
			zvar = 'port_weight',
			axis_color = '#A9A9A9',
			namevar = 'company_name',
			bblfill = '#1b324f',
			bblstroke = '#1b324f';

		// Labels
		let xtitle = 'Current capacity in low-carbon technologies',
			xsubtitle = '(as % of sector production capacity)',
			ytitle = 'Planned new capacity in low-carbon technologies',
			ysubtitle = '(as a % of the scenario target for YEAR)',
			xtooltip = xtitle,
			ytooltip = ytitle,
			ztooltip = 'Weight in portfolio (% of AUM)',
			legend_title = 'Portfolio weight';

		// Create the svg container
		const svg = this.container
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('viewBox', [0, 0, width, height])
			.attr('preserveAspectRatio', 'xMinYMin meet')
			.attr('style', 'max-width: 100%; height: auto;');

		// Filter data
		let sector = document.querySelector('#sector_selector').value,
			asset_class = document.querySelector('#asset_class_selector').value,
			scenario_source = document.querySelector('#scenario_source_selector').value,
			scenario = document.querySelector('#scenario_selector').value,
			allocation = document.querySelector('#allocation_method_selector').value;
		let subdata = data
			.filter((d) => d.asset_class == asset_class)
			.filter((d) => d.ald_sector_translation == sector)
			.filter((d) => d.scenario_source == scenario_source)
			.filter((d) => d.scenario == scenario)
			.filter((d) => d.allocation == allocation);

		var year_future = subdata.map((d) => d.year)[0] + year_span;
		var buffer = 0.0;

		// Axes
		let x = d3
			.scaleLinear()
			.range([0, size])
			.domain([0 - buffer, 1 + buffer])
			.nice();

		let y = d3
			.scaleLinear()
			.range([size, 0])
			.clamp(true)
			.domain([0 - buffer, 1 + buffer])
			.nice();

		let z = d3
			.scaleLinear()
			.range([1, 20])
			.domain(d3.extent(subdata, (d) => d[zvar]))
			.nice();

		// Draw axes
		let xaxis = d3.axisBottom(x).ticks(6).tickFormat(d3.format('.0%'));
		let yaxis = d3.axisLeft(y).ticks(6).tickFormat(d3.format('.0%'));

		svg
			.append('g')
			.attr('class', 'xaxis')
			.style('stroke-width', '1px')
			.attr('transform', 'translate(' + marginLeft + ',' + (height - marginBottom) + ')');

		svg.select('.xaxis').call(xaxis).selectAll('.domain').attr('stroke', axis_color);
		svg.select('.xaxis').selectAll('.tick').selectAll('line').attr('stroke', axis_color);
		svg.select('.xaxis').selectAll('text').style('font-size', '1.2em');

		svg
			.append('text')
			.attr('class', 'xtitle')
			.attr(
				'transform',
				'translate(' + (size / 2 + marginLeft) + ' ,' + (height - marginBottom + 40) + ')'
			)
			.style('text-anchor', 'middle')
			.text(xtitle);

		svg
			.append('text')
			.attr('class', 'xsubtitle')
			.attr(
				'transform',
				'translate(' + (size / 2 + marginLeft) + ' ,' + (height - marginBottom + 55) + ')'
			)
			.style('text-anchor', 'middle')
			.text(xsubtitle);

		svg
			.append('g')
			.attr('class', 'yaxis')
			.style('stroke-width', '1px')
			.attr(
				'transform',
				'translate(' +
					marginLeft +
					',' +
					(marginTop + Math.max(0, height - marginTop - marginBottom - size)) +
					')'
			);

		svg
			.append('text')
			.attr('class', 'ytitle')
			.attr('transform', 'rotate(-90)')
			.attr('x', -(height / 2))
			.attr('y', 10)
			.attr('dy', '1em')
			.style('text-anchor', 'middle')
			.text(ytitle);

		ysubtitle = ysubtitle.replaceAll('YEAR', year_future);

		svg
			.append('text')
			.attr('class', 'ysubtitle')
			.attr('transform', 'rotate(-90)')
			.attr('y', 25)
			.attr('x', -(height / 2))
			.attr('dy', '1em')
			.style('text-anchor', 'middle')
			.text(ysubtitle);

		svg.select('.yaxis').call(yaxis).selectAll('.domain').attr('stroke', axis_color);
		svg.select('.yaxis').selectAll('.tick').selectAll('line').attr('stroke', axis_color);
		svg.select('.yaxis').selectAll('text').style('font-size', '1.2em');

		// Mid lines
		svg
			.append('line')
			.attr(
				'transform',
				'translate(' +
					marginLeft +
					',' +
					(marginTop + Math.max(0, height - marginTop - marginBottom - size)) +
					')'
			)
			.attr('x1', x(0.5))
			.attr('x2', x(0.5))
			.attr('y1', y(0))
			.attr('y2', y(1))
			.attr('stroke', 'black')
			.attr('stroke-dasharray', '1, 2');

		svg
			.append('line')
			.attr(
				'transform',
				'translate(' +
					marginLeft +
					',' +
					(marginTop + Math.max(0, height - marginTop - marginBottom - size)) +
					')'
			)
			.attr('x1', x(0))
			.attr('x2', x(1))
			.attr('y1', y(0.5))
			.attr('y2', y(0.5))
			.attr('stroke', 'black')
			.attr('stroke-dasharray', '1, 2');

		// Bubbles
		svg
			.append('g')
			.attr(
				'transform',
				'translate(' +
					marginLeft +
					',' +
					(marginTop + Math.max(0, height - marginTop - marginBottom - size)) +
					')'
			)
			.selectAll('.bubble')
			.data(subdata)
			.enter()
			.append('circle')
			.attr('class', 'bubble')
			.attr('cx', (d) => x(d[xvar]))
			.attr('cy', (d) => y(d[yvar]))
			.attr('r', (d) => z(d[zvar]))
			.style('opacity', '0.7')
			.style('fill', bblfill)
			.attr('stroke', '#1b324f')
			.on('mouseover', mouseover)
			.on('mousemove', mousemove)
			.on('mouseout', mouseout);

		// Legend
		let ticks = z.ticks(3);
		let tick_size = ticks.map((d) => z(d));
		let cumsum_ticks = cumsum(tick_size.map((d) => d * 2));
		let legend_data = d3.zip(ticks, cumsum_ticks);

		let legend = svg
			.append('g')
			.attr(
				'transform',
				'translate(' + (size + marginLeft + marginRight / 4) + ',' + (marginTop + size / 5) + ')'
			);

		legend
			.selectAll('circle')
			.data(legend_data)
			.enter()
			.append('circle')
			.attr('cx', 35)
			.attr('cy', (d) => 20 + d[1])
			.attr('r', (d) => z(d[0]))
			.style('fill', bblfill)
			.attr('stroke', bblstroke)
			.style('opacity', '0.7');

		legend
			.selectAll('text')
			.data(legend_data)
			.enter()
			.append('text')
			.text((d) => d3.format('~%')(d[0].toPrecision(3)))
			.attr('alignment-baseline', 'central')
			.attr('font-size', '0.9em')
			.attr('x', 40 + z.range()[1])
			.attr('y', (d) => 20 + d[1]);

		legend
			.append('text')
			.attr('x', 10)
			.attr('y', 5)
			.attr('alignment-baseline', 'central')

			.text(legend_title);

		let tooltip = d3
			.select(container_div)
			.append('div')
			.attr('class', 'd3tooltip')
			.style('display', 'none');

		function mouseover(d) {
			let ztooltiptext = '<br>' + ztooltip + ': ' + d3.format('~%')(d[zvar].toPrecision(3));

			tooltip
				.html(
					'<b>' +
						d[namevar] +
						'</b><br><br>' +
						xtooltip +
						': ' +
						d3.format('.1%')(d[xvar]) +
						'<br>' +
						ytooltip +
						': ' +
						d3.format('.1%')(d[yvar]) +
						ztooltiptext
				)
				.style('display', 'inline-block')
				.style('left', d3.event.pageX + 10 + 'px')
				.style('top', d3.event.pageY - 20 + 'px');
		}

		function mousemove() {
			tooltip.style('left', d3.event.pageX + 10 + 'px').style('top', d3.event.pageY - 20 + 'px');
		}

		function mouseout() {
			tooltip.style('display', 'none');
		}
	}
}
