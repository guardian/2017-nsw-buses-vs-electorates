//Guardian-specific responsive iframe function

iframeMessenger.enableAutoResize();

function init(data) {

	console.log("data", data);
	var isMobile;
	var windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	var scaleFactor = windowWidth/860;

	if (windowWidth < 610) {
			isMobile = true;
	}	

	if (windowWidth >= 610){
			isMobile = false;
	}

	var keyStuff = ["Liberal","Labor","Greens","Independent","Inner West", "Other STA regions"];

	var margin = {top: 0, right: 0, bottom: 0, left:0};
	var width = document.querySelector("#graphicContainer").getBoundingClientRect().width
	var height = width*0.6;					
	var marginQuint = [6, 12, 18, 24, 40];

	width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;
    

	d3.select("#graphicContainer svg").remove();

	var svg = d3.select("#graphicContainer").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.attr("id", "svg")
				.attr("overflow", "hidden");					

	
	
	var features = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	var keyGroup = svg.append("g").attr("transform", "translate(" + width*0.65 + "," + height*0.25 + ")");
	



	var linePattern = textures.lines()
  			.lighter();

  	var circlePattern = textures.circles();		

	svg.call(linePattern);
	svg.call(circlePattern);

	keyStuff.forEach(function(d,i) {

		keyGroup.append("rect")
			.attr("x", 0)
			.attr("y", (i * 50) *scaleFactor)
			.attr("width", 40 * scaleFactor)
			.attr("height", 40 * scaleFactor)
			.style("stroke", "#eeeeee")
			.style("stroke-width", "1px")
			.style("fill", function() { 
			if (d == 'Labor') {
				return 'rgb(252,146,114)';
			}

			else if (d == 'Liberal') {
				return 'rgb(158,202,225)';

			}

			else if (d == 'Greens') {
				return 'rgb(161,217,155)';
			}

			else if (d == 'Independent') {
				return '#fdadba';
			}

			else if (d == 'Inner West') {
				return linePattern.url();
			}

			else if (d === 'Other STA regions') {
				return circlePattern.url();
			}

			});

		keyGroup.append("text")
			.attr("x", 45 * scaleFactor)
			.attr("y", ((i * 50) * scaleFactor) + 23 * scaleFactor) 
			.text(d)


	});


	colBlue = ['rgb(198,219,239)','rgb(158,202,225)','rgb(107,174,214)','rgb(49,130,189)','rgb(8,81,156)'];
	colRed = ['rgb(252,187,161)','rgb(252,146,114)','rgb(251,106,74)','rgb(222,45,38)','rgb(165,15,21)'];
	colGreen = ['rgb(199,233,192)','rgb(161,217,155)','rgb(116,196,118)','rgb(49,163,84)','rgb(0,109,44)'];

	var scaleBlue = d3.scale.threshold()
					.domain(marginQuint)
					.range(colBlue);

	var scaleRed = d3.scale.threshold()
					.domain(marginQuint)
					.range(colRed);

	var scaleGreen = d3.scale.threshold()
					.domain(marginQuint)
					.range(colGreen);


	projection = d3.geo.mercator()
					.center([151,-33.9])
					.scale(width*60)
					.translate([width*0.2,height*0.7])


					// 	.center([151,-34.0])
					// .scale(width*100)
					// .translate([width*0.2,height*0.8])				

	var path = d3.geo.path()
		.projection(projection);
		
	var electorateData = (topojson.feature(data.electorates, data.electorates.objects.electoratemerge)).features;	
	var transportData = data.transport.features;
	var harbourData = data.boundary.features;

	console.log(electorateData)

	console.log(transportData)

	features.selectAll(".division")
		.data(electorateData, function(d) { return d['properties']['Name']; })
		.enter().append("path")
		.attr("d", path)
		.attr("id", function(d){ return d['properties']['Name'].replace(/ /g,"_");})
		.attr("title", function(d){ return d['properties']['Name'];})
		.style("stroke", "#eeeeee")
		.style("stroke-width", "1px")
		.style("fill", function(d) { 

			if (d['properties']['margins_pa'] == 'LAB') {
				return 'rgb(252,146,114)';
			}

			else if (d['properties']['margins_pa'] == 'LIB' || d['properties']['margins_pa'] == 'NAT') {
				return 'rgb(158,202,225)';

			}

			else if (d['properties']['margins_pa'] == 'GRN') {
				return 'rgb(161,217,155)';
			}

			else if (d['properties']['margins_pa'] == 'IND') {
				return '#fdadba';
			}
			 

		})
		.attr("class", "division");
			
	features.selectAll(".harbour")
		.data(harbourData)
		.enter().append("path")
		.attr("d", path)
		.style("fill", "#FFFFFF")
		.style("stroke", "#000000")
		.style("stroke-width", "1px")
		.attr("class", "harbour");	

	features.selectAll(".zones")
		.data(transportData)
		.enter().append("path")
		.attr("d", path)
		.attr("id", function(d){ return d['properties']['Name'].replace(/ /g,"_");})
		.attr("title", function(d){ return d['properties']['Name'];})
		.style("fill", function(d) { 
			if (d['properties']['Name'] == "6") {
				return linePattern.url();
			}
			else if (d['properties']['Name'] == "7" || d['properties']['Name'] == "8" || d['properties']['Name'] == "9") {
				return circlePattern.url();
			}
			else {
				return "none"
			}

			})
		.style("stroke", "#000000")
		.style("stroke-width", "1px")
		.attr("class", "zones");	


} // end init

d3.loadData()
    .json('electorates',"data/electorate-merge.json")
    .json('transport',"data/transport.json")
    .json('boundary',"data/boundary.json")
    .onload(function(data) {
    	init(data);
    	var lastWidth = document.querySelector("#graphicContainer").getBoundingClientRect().width
    	var to=null;
    	window.addEventListener('resize', function() {
	    	var thisWidth = document.querySelector("#graphicContainer").getBoundingClientRect().width
		    if (lastWidth != thisWidth) {
		      window.clearTimeout(to);
		      to = window.setTimeout(init(data), 500)
		    }
  		})

});

