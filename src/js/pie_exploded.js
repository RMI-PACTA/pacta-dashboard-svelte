import * as d3 from 'd3';

export class PieExploded {
	constructor(container, data, labels_pie, opts) {
		let container_div;

		if (typeof container === 'string') {
			container_div = document.querySelector(container);
		} else {
			container_div = container;
		}

		container_div.innerHTML = '';

		d3.select(container_div).attr('chart_type', 'PieExploded');
		
		container_div.classList.add('PieExploded');
		container_div.classList.add('d3chart');
		container_div.classList.add('chart_container');

		this.container = d3.select(container_div);

		// Declare the chart dimensions and margins.
		const width = 700;
		const height = 500;
		const marginTop = 40;
		const marginRight = 40;
		const marginBottom = 110;
		const marginLeft = 110;

		// Create the svg container
		const svg = this.container
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('viewBox', [0, 0, width, height])
			.attr('preserveAspectRatio', 'xMinYMin meet')
			.attr('style', 'max-width: 100%; height: auto;');

	 	let asset_class =
 			typeof opts.default_class === 'undefined' ? 'Listed Equity' : opts.default_class;

		// Plot parameters
		let hole_percent = 0.4;
		let radius =
			Math.min(
				width - marginLeft - marginRight,
				height - marginTop - marginBottom
			) / 2;

		let pie_center = radius + marginLeft;
		let exploded_offset = 80;
		let text_right_offset = 50;
		let text_left_offset = 100;
		let minLabelSpacing = 16;
		let comment_position = marginRight + 150;
		let comment_height = height - marginBottom / 3;

			
		// Plot labels
		let numbers_long = { M: ' million', G: ' billion', T: ' trillion' };
		let unit = 'USD'; // TODO: make a parameter
		let comment = 'Total: ';

		// Declare colours
		let color = d3.scaleOrdinal(d3.schemeCategory10);
		const fillRange = (start, end) => {
			return Array(end - start + 1)
				.fill()
				.map((item, index) => start + index);
		};
		var greyscale = d3.scaleSequential(d3.interpolateGreys).domain([0, 30]);
		var greys15 = fillRange(5, 20).map((d) => greyscale(d));
		var greys = d3.scaleOrdinal().range(greys15);

		// Calculate plot coordinates
		let total_value = d3.sum(data, (d) => d.value);
 		var total_exploded_value = d3.sum(data, (d) => (d.exploded ? d.value : 0));
 		var percent_exploded = total_exploded_value / total_value;
 		var anglepush = Math.PI * 2 * (percent_exploded / 2);
 		var chart_startAngle = Math.PI * 0.5 - anglepush;
		let pie = d3
			.pie()
			.startAngle(chart_startAngle)
			.endAngle(Math.PI * 2 + chart_startAngle)
			.sort((a, b) => (a.exploded < b.exploded ? 1 : -1))
			.value((d) => d.value);
		let arc = d3
 			.arc()
 			.innerRadius(radius * hole_percent)
 			.outerRadius(radius)
 			.cornerRadius(5);

		// Declare hover overs tooltip
		let tooltip = this.container
			.append('div')
			.attr('class', 'd3tooltip')
			.style('display', 'none');

		// Calculate plot variables based on data
		var data_ready = pie(data);
		data_ready.forEach((d) => (d.midAngle = d3.mean([d.startAngle, d.endAngle])));
		data_ready.forEach((d) => (d.midAngle += d.midAngle <= Math.PI * 0.5 ? Math.PI * 2 : 0));
		data_ready.forEach((d) => (d.rightHalf = Math.sin(d.midAngle) > 0));
		data_ready.forEach((d) => (d.topHalf = Math.cos(d.midAngle) > 0));
		data_ready.forEach((d) => (d.quadrant = (d.topHalf ? 'N' : 'S') + (d.rightHalf ? 'E' : 'W')));
		data_ready.forEach(
			(d) => (d.ascending = Math.sin(d.midAngle) > 0 == Math.cos(d.midAngle) > 0 ? -1 : 1)
		);
		data_ready.forEach((d) => (d.texty = Math.round(point_coord(d.midAngle, radius)[1])));
		data_ready.forEach(
			(d) =>
				(d.textx = d.rightHalf
					? Math.round(point_coord(d.midAngle, radius)[0]) + text_right_offset
					: Math.round(point_coord(d.midAngle, radius)[0]) - text_left_offset)
		);
			
		data_ready.sort((a, b) => (a.quadrant > b.quadrant ? 1 : -1));
			
		data_ready.sort(function (a, b) {
			if (a.quadrant == b.quadrant) {
				if (a.midAngle > b.midAngle) return 1 * a.ascending;
				}
			return 0;
		});
			
		data_ready.forEach(function (d) {
		var point = point_coord(d.midAngle, radius);
		var offset = Math.abs(d.texty - point[1]);
			d.elbowx = d.rightHalf
				? d.textx - text_right_offset * numberSign(d.textx)
				: d.textx - text_left_offset * numberSign(d.textx);
		});
		data_ready.forEach((d) => (d.elbowy = d.texty));	
		data_ready.sort((a, b) => (a.startAngle > b.startAngle ? 1 : -1));
		data_ready = data_ready.sort((d) => d.data.exploded);

		// Plot pie slices
		let slices = svg
 			.append('g')
 			.attr('transform', 'translate(' + pie_center + ',' + height / 2 + ')')
			.selectAll('g')
			.data(data_ready)
			.enter()
			.append('g')
			.attr('transform', (d) =>
 				d.data.exploded ? 'translate(' + exploded_offset + ' 0)' : 'translate(0 0)'
			);
			
 		slices
 			.append('path')
 			.attr('class', (d) => (d.data.exploded ? d.data.key : 'non-PACTA'))
			.attr('d', arc)
 			.attr('fill', (d) => (d.data.exploded ? color(d.data.key) : greys(d.data.key)))
 			.attr('stroke', 'white')
 			.style('stroke-width', '2px')
 			.style('opacity', 1)
 			.on('mouseover', mouseover)
 			.on('mousemove', mousemove)
 			.on('mouseout', mouseout);

		// Slice labels
		var slicelabels = slices.filter((d) => d.data.exploded);
 		var linesLabels = slicelabels
 			.append('polyline')
 			.attr('stroke', 'black')
			.style('fill', 'none')
 			.attr('stroke-width', 1)
 			.attr('points', (d) => [
 				point_coord(d.midAngle, radius),
 				[d.elbowx, d.elbowy],
 				[d.textx - 2 * numberSign(d.textx), d.texty]
 			]);
 		var textLabels = slicelabels
 			.append('text')
 			.attr('x', function (d, i) {
 				return d.textx;
 			})
 			.attr('y', function (d, i) {
 				return d.texty;
 			})
 			.attr('text-anchor', function (d, i) {
 				return d.rightHalf ? 'start' : 'end';
 			})
 			.text((d) => d.data.key_translation + ' ' + prcnt_format(d.data.value / total_value))
 			.style('dominant-baseline', 'middle');
 		const alpha = 0.5;

		relaxLabels();
		
		// Annotation with total
		svg
 			.append('text')
 			.attr('transform', 'translate(' + [width - comment_position, comment_height] + ')')
 			.text(comment + prcnt_format(total_exploded_value / total_value))
 			.style('dominant-baseline', 'middle')
 			.style('font-weight', 'bold')
 			.style('text-anchor', 'start')
			.style('font-size','2em');

		function point_coord(angle, radius) {
 			return [radius * Math.sin(angle), radius * Math.cos(angle) * -1];
 		}

		function numberSign(number) {
			return number < 0 ? -1 : 1;
		}

		function prcnt_format(num) {
			if (num < 0.001) {
				return '< 0.1%';
			} else {
				return d3.format('.2p')(num);
			}
		}

		function num_format(num) {
			return (
				d3
					.format('.2s')(num)
					.replace(/M/, numbers_long.M)
					.replace(/G/, numbers_long.G)
					.replace(/T/, numbers_long.T) +
				' ' +
				unit
			);
		}

		function relaxLabels() {
			let again,
				thisLabel,
				thisLabelDoc,
				y1,
				thatLabel,
				thatLabelDoc,
				y2,
				deltaY,
				sign,
				adjustment,
				labelForLine;

			again = false;
			textLabels.each(function (d, i) {
				thisLabel = this;
				thisLabelDoc = d3.select(thisLabel);
				y1 = thisLabelDoc.attr('y');
				textLabels.each(function (d, i) {
					thatLabel = this;
					if (thisLabel == thatLabel) return;

					thatLabelDoc = d3.select(thatLabel);
					if (thisLabelDoc.attr('text-anchor') != thatLabelDoc.attr('text-anchor')) return;

					y2 = thatLabelDoc.attr('y');
					deltaY = y1 - y2;
					if (Math.abs(deltaY) > minLabelSpacing) return;

					again = true;
					sign = deltaY > 0 ? 1 : -1;
					adjustment = sign * alpha;
					thisLabelDoc.attr('y', +y1 + adjustment);
					thatLabelDoc.attr('y', +y2 - adjustment);
				});
			});

			if (again) {
				linesLabels.attr('points', function (d, i) {
					labelForLine = d3.select(textLabels.nodes()[i]);
					return [
						point_coord(d.midAngle, radius),
						[d.elbowx, labelForLine.attr('y')],
						[d.textx - 2 * numberSign(d.textx), labelForLine.attr('y')]
					];
				});
				setTimeout(relaxLabels, 20);
			}
		};

		function mouseover(d) {
			tooltip
				.html(
					d.data.key_translation +
						'<br>' +
						num_format(d.data.value) +
						' (' +
						prcnt_format(d.data.value / total_value) +
						')'
				)
				.style('display', 'inline-block')
				.style('left', d3.event.pageX + 10 + 'px')
				.style('top', d3.event.pageY - 20 + 'px');
		};

		function mousemove() {
			tooltip
				.style('left', d3.event.pageX + 10 + 'px')
				.style('top', d3.event.pageY - 20 + 'px');
		};

		function mouseout() {
			tooltip.style('display', 'none');
		};
 	}
 }
