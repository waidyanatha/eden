$(document).ready(function(){

    $('.multichoice-graph').each(function(/* index */) {

        var $this = $(this),
            colors = ['#00AAA0', '#AFAEAE'], // Alternate between $persian-green & $darkgray
            data = JSON.parse($this.val()),
            scale = $this.data('scale'),
            precision = null,
            thousandGrouping = '3',
            thousandSeparator = ' ';
            numberFormatter = function(number) {

                var decimals = precision;
                if (number === null || typeof number == 'undefined') {
                    return '-';
                }
                var n = decimals || decimals == 0 ? number.toFixed(decimals) : number.toString();

                n = n.split('.');
                var n1 = n[0],
                    n2 = n.length > 1 ? '.' + n[1] : '';
                var re = new RegExp('\\B(?=(\\d{' + thousandGrouping + '})+(?!\\d))', 'g');
                n1 = n1.replace(re, thousandSeparator);
                return n1 + n2;
            },
            tooltipContent = function(data) {

                var color,
                    item = data.data,
                    label = item.label;
                if (label.substring(0, 6) == 'smiley') {
                    // Smiley Icon
                    label = '<i class="ucce ucce-' + label + '"> </i>';
                }
                if (data.index % 2 == 0) {
                    // Even
                    color = colors[0]
                } else {
                    // Odd
                    color = colors[1]
                }

                var tooltip = '<div class="pt-tooltip">' +
                               '<div class="pt-tooltip-label">' + label + '</div>' +
                               '<div class="pt-tooltip-text" style="background:' + color + '"><span class="pt-tooltip-value">' + item.value + '</span></div>' +
                              '</div>';
                return tooltip;
            },
            truncateLabel = function(label, len) {
                if (label && label.length > len) {
                    return label.substring(0, len-3).replace(/\s+$/g,'') + '...';
                } else {
                    return label;
                }
            };

        nv.addGraph(function() {
            var chart = nv.models.multiBarHorizontalChart()
                                 .x(function(d) { return d.label })
                                 .y(function(d) { return d.value })
                                 .margin({top: 10, right: 10, bottom: 40, left: 100})
                                 .showValues(true)      // Show bar value next to each bar.
                                 .duration(350)
                                 .showLegend(false)     // Hide the Legend (We only have 1 series, so meaningless)
                                 .barColor(colors)      // Alternate between $persian-green & $darkgray
                                 .showControls(false);  // Allow user to switch between "Grouped" and "Stacked" mode.

            chart.tooltip.contentGenerator(tooltipContent);

            chart.valueFormat(numberFormatter);
            chart.yAxis
                 .tickFormat(numberFormatter);
            chart.xAxis
                 .tickFormat(function(d) {
                    if (d.substring(0, 6) == 'smiley') {
                        // Smiley Icon
                        if (d == 'smiley-1') {
                            return '\u{f129}';
                        } else if (d == 'smiley-2') {
                            return '\u{f12a}';
                        } else if (d == 'smiley-3') {
                            return '\u{f12b}';
                        } else if (d == 'smiley-4') {
                            return '\u{f12c}';
                        } else if (d == 'smiley-5') {
                            return '\u{f12d}';
                        } else if (d == 'smiley-6') {
                            return '\u{f12e}';
                        }
                    } else {
                        return truncateLabel(d, 24);
                    }
                 });

            var svg = d3.select('#' + $this.parent().attr('id'))
                        .append('svg');
            svg.attr('class', 'nv')
               .datum(data)
               .call(chart);

            if ((scale == 6) || (scale == 7)) {
                svg.selectAll('.zero')
                   .select('text')
                   .classed('icon', true);
            }

            nv.utils.windowResize(chart.update);

            return chart;
        });
    });

    $('.heatmap-data').each(function(/* index */) {
        $(this).heatMap();
    });

});