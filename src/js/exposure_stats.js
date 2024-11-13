import * as d3 from 'd3';

export class ExposureStatsTile {
	constructor(container, data) {
		let container_div;

		if (typeof container === 'string') {
			container_div = document.querySelector(container);
		} else {
			container_div = container;
		}

		container_div.innerHTML = '';

		d3.select(container_div).attr('chart_type', 'ExposureStatsTile');

		container_div.classList.add('ExposureStatsTile');
		container_div.classList.add('d3chart');
		container_div.classList.add('chart_container');

		this.container = d3.select(container_div);

		// Declare the chart dimensions and margins.
		const width = 250;
		const height = 120;
		const marginTop = 10;
		const marginRight = 5;
		const marginBottom = 5;
		const marginLeft = 5;

		// Declare text positions
		let asset_posiiton_x = (width - marginLeft) / 2,
			text_position_y = height - marginBottom - 35,
			perc_position_y = (height - marginBottom) / 2 - 10,
			sector_position_x = width - marginLeft;

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
			asset_class = document.querySelector('#asset_class_selector').value;

		let subdata = data.filter((d) => d.asset_type == asset_class).filter((d) => d.sector == sector);

		// Annotate with stats info - asset class
		svg
			.append('g')
			.attr('transform', 'translate(' + [asset_posiiton_x, marginTop] + ')')
			.append('text')
			.text(asset_class)
			.style('dominant-baseline', 'middle')
			.style('font-weight', 'bold')
			.style('text-anchor', 'end');

		svg
			.append('g')
			.attr('transform', 'translate(' + [asset_posiiton_x, perc_position_y] + ')')
			.append('text')
			.text(prcnt_format(subdata[0].percentage_value_invested))
			.style('dominant-baseline', 'middle')
			.style('font-weight', 'bold')
			.style('text-anchor', 'end')
			.style('font-size', '2.5em');

		let label_total = ['of the', 'total portfolio'];
		svg
			.append('g')
			.attr('transform', 'translate(' + [asset_posiiton_x, text_position_y] + ')')
			.selectAll('text')
			.data(label_total)
			.enter()
			.append('text')
			.attr('transform', (d, i) => 'translate(0, ' + i * 15 + ')')
			.text((d) => d)
			.style('dominant-baseline', 'middle')
			.style('text-anchor', 'end');

		// Annotate with stats info - sector
		svg
			.append('g')
			.attr('transform', 'translate(' + [sector_position_x, marginTop] + ')')
			.append('text')
			.text(sector)
			.style('dominant-baseline', 'middle')
			.style('font-weight', 'bold')
			.style('text-anchor', 'end');

		svg
			.append('g')
			.attr('transform', 'translate(' + [sector_position_x, perc_position_y] + ')')
			.append('text')
			.text(prcnt_format(subdata[0].perc_asset_val_sector))
			.style('dominant-baseline', 'middle')
			.style('font-weight', 'bold')
			.style('text-anchor', 'end')
			.style('font-size', '2.5em');

		let label_sector = ['of the', asset_class, 'portion of portfolio'];
		svg
			.append('g')
			.attr('transform', 'translate(' + [sector_position_x, text_position_y] + ')')
			.selectAll('text')
			.data(label_sector)
			.enter()
			.append('text')
			.attr('transform', (d, i) => 'translate(0, ' + i * 15 + ')')
			.text((d) => d)
			.style('dominant-baseline', 'middle')
			.style('text-anchor', 'end');

		function prcnt_format(num) {
			if (num == 0) {
				return '0%';
			} else if (num < 0.001) {
				return '< 0.1%';
			} else {
				return d3.format('.2p')(num);
			}
		}
	}
}
