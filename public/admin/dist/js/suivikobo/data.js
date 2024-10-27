$(document).ready(function(){

	$.blockUI.defaults.message = "<i class='fas fa-spinner fa-spin'></i><small>Traitement en cours...</small>"
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
	$(window).on('beforeunload', function(){$.blockUI();});

	//progressBar
	var intValPbar = 0
	
	// variable global pour la carte
	var map = null
    var layerGroup_point = null
	var shp_dren = null
	var shp_cisco = null
	const MyBingMapsKey = "AoRRWTdH7LrGGJlY4xtYjYTKVG6_BZTlBN6lww8bkB_pl0Ur3drAa91fnvix-Aqn"

	// variable global pour la table et entete
	var mydataTable;
	var array_thead = [] // entet table
	var array_static_head = ["_status", "_geolocation", "_submission_time"] // entete static 
	var array_variable = []


	/**
	 * mi charge ny fichier offline misy ny formulaires kobo
	 */
	var loadFormOffline = async()=>{
		$("#form-kobo").html("<option value='0'>-Selectionner un formulaire-</option>")
		await ($.getJSON("../data/kobo-form.js", function(jsonData){
			//success
			var koboForm = jsonData
			$.each(koboForm, function( index, form ) {
				// izay form misy submissions ihany no ajoutena anaty select
				if(parseInt(form.num_of_submissions) > 0){
					$("#form-kobo").append("<option value='"+form.formid+"'>"+form.title + "  [" + form.num_of_submissions + "]" + "</option>")
				}
			});
			//console.log( "koboForm Data: ",  koboForm);
			showNotif("info", "KOBO MEN", "Chargement des formulaires ok");
		}).fail(function( jqxhr, textStatus, error ) {
			var err = textStatus + ", " + error;
			console.log( "Request koboForm Failed: " + err );
		}))

		
	}

	loadFormOffline()

	/**
	 * @param {*} url :: nom_root controller pour action downloadDataForm
	 * mi download an'ilay form api/v1 an kobo
	 */
	var downloadFormKobo = async (url)=>{
		//url = "https://kc.kobotoolbox.org/api/v1/forms?format=json"
		await ($.ajax( {          
			type: "POST", 
            url: url,
			async: false,
            cache: false,
            processData: false,
            contentType: false,
            success:function (response) {
                //arakaraka ny response.reponse am server: error ou success
				loadFormOffline()
                showNotif(response.response,"KOBO MEN", response.message);
            },
            error:function (http_error) {
                let server_msg = http_error.responseText;
                let code_label = http_error.statusText;
                showNotif('danger', server_msg + ', ' + code_label, "bottom right");
                //console.log("Erreur :" + server_msg + ', ' + code_label,)
            }
		}))
	}

	$(document).on("click","#dwn-form", async function(){
		$.blockUI()
		await downloadFormKobo($(this).attr("data-url"))
		$.unblockUI()
	});



	/**********************DATA FORMULAIRES *** ********************************/
	/**
	 * 
	 * @param {*} formID : type Integer , ID du formulaire izay halaina offline [data-kobo-formID.js] 
	 * maka ny fichier js local misy ny données formulaire : data-kobo-formID.js
	 */
	  var  loadDataOffline = (formID) =>{
		if(parseInt(formID) < 100) return
		$.ajax({
			url : "../data/data-kobo-" + formID + ".js",
			dataType: "json",
			async: false,
		}).done(async function(jsonData){
			//success
			//offlineDataForm = jsonData
			showNotif("info","Chargement", "Chargement des données ok");
			$.blockUI()
			let [tb,mp,std,stc] = [false, false, false, false]

			// interval pour display pbar
			let itrv = setInterval(()=>{
				$("#dynamic-pb").attr("style", `width:${intValPbar}%`)
			},500)

			tb = await createTable(jsonData)
			intValPbar += 1
			if(tb){
				mp = await createMap(jsonData)
				intValPbar += 1
			}
			if(mp){
				std = await get_Stats_dren(jsonData)
			}
			if(std){
				stc = await get_Stats_cisco(jsonData)
			}
			if(stc){
				_tdb = await tdb(jsonData)
			}
			if(_tdb){
				intValPbar = 98 // forcena faranana ilay pbar au cas ou latsaka nefa efa vita ny traitement
				setTimeout(()=>{
					$("#dynamic-pb").hide()
					$.unblockUI()
					clearInterval(itrv)
					itrv = null
				},2000)
			}
			
		}).fail(function( jqxhr, textStatus, error ) {
			var err = textStatus + ", " + error;
			showNotif("error", 'Erreur',"Aucune donnée du Formulaire #" + formID + "  : " + err);
			console.log( "Aucune donnée du Formulaire #" + formID + "  : " + err );
			// fafaina ny dataTable raha fail ny json local
			actionNoDataOffline()
			return
		})

	}

	/**
	 * 
	 * @param {*} formID  : Int id du formulaire kobo ex : 11800
	 * @param {*} url_server_root  : nom_root controller pour action downloadDataForm
	 */
	/* download Data form online ****************************/
	var downloadDataOnline = async function(formID, url_server_root){
		//url = "https://kc.kobotoolbox.org/api/v1/data";
		//const formID = document.getElementById('form-kobo').options;
		fd = new FormData()
		fd.append("id",formID)
		await($.ajax({
			url: url_server_root,
			type: "POST", 
			async: false, // Mode synchrone
			data:fd,
			cache: false,
			processData: false,
			contentType: false,
			success:function (response) {
				//arakaraka ny response.reponse am server: error ou success
				console.log(response)
				showNotif('success', 'Chargement' , "Téléchargement Términé");
			},
			error:function (http_error) {
				let server_msg = http_error.responseText;
				let code_label = http_error.statusText;
				showNotif('danger', server_msg , code_label);
			}
		}))

		return new Promise(resolve => {resolve(true)})
		
	} //downloadDataForm


	/**
	 *  Execution telechargement données 
	 */
	$(document).on("click",".js-dwn-data", async function(){
		forms =  $(this).attr("data-count")
		url =  $(this).attr("data-url")
		$.blockUI()
		if(forms === "single"){
			// raha formulaire séléctionné ihany no alaina
			formID = $("#form-kobo").val()
			if(parseInt(formID) === 0)return 
			await downloadDataOnline(formID, url)
		}else{
			// raha toutes les formulaires dia bouclena ny select form
			$("#form-kobo option").each(async function(){
				formID = $(this).val()
				if(parseInt(formID) > 0){
					await downloadDataOnline(formID, url)
				}
			})
		}
		$.unblockUI()
		$("#form-kobo").change()
		$("#form-kobo").trigger('change'); // change select triggered
	});


	/*** change selection form dia miantso ny dowbnloadDataForm */
	$(document).on('change','#form-kobo', function() {
		no_form_selected = parseInt($(this).val()) == 0 
		$("#btngrp-dwnload").toggleClass( "d-none", no_form_selected );
		$("#data-table").toggleClass( "d-none", no_form_selected );
	});

	/**
	 * Execution bouton run rehefa avy misafidy formulaire
	 */
	$(document).on("click", "#btn-run", ()=> {
		if(parseInt($("#form-kobo").val()) === 0)return
		loadDataOffline($("#form-kobo").val())
	})

	// action atao raha tsisy données offline : fafana ny table, carte, gallery, sns
	var actionNoDataOffline = ()=>{
		if ( $.fn.dataTable.isDataTable('#data-table') ) {
			mydataTable.destroy()
			$("tr#th-data-table").empty()
			$("tr#tf-data-table").empty()
			$("#data-table tbody").empty()
		}
		$("#data-table").addClass("d-none")

		// remove map
		$("#map-container").empty()
		$("#map-container").append("<div id='map' style='width:100%;height:100vh'></div>")
		if(map){
			map.off();
			map.remove();
			map = null
		}

		//
	}

	var createTable = async (jsonFormData) => {
		actionNoDataOffline()

		array_variable =  Object.keys(jsonFormData[0]).filter(key => key[0] != "_");// entete dynamique arakaraka ny variable
		array_variable.sort()
		array_thead = array_variable.concat(array_static_head)
		
		// implementation thead dataTable
		$("#th-data-table").html("")
		$("#tf-data-table").html("")
		$.each(array_thead, function( index, val ) {
			$("#th-data-table").append("<th scope='col'>" + val + "</th>")
			$("#tf-data-table").append("<th scope='col'>" + val + "</th>")
		});

		// tbody
		$("#tb-data-table").html("")
		$.each(jsonFormData, function( index, form ) {
			let clss = (form["_geolocation"] != null && (Array.isArray(form["_geolocation"]) && form["_geolocation"][0] != null ))?'':'bg-danger'
			let row = "<tr class='" + clss + "'>"
			$.each(array_thead, function( index, val ) {
				if(Object.keys(form).indexOf(val) >= 0){
					row += "<td>" + form[val] + "</td>"
				}else{
					row += "<td class='text-warning'>-</td>"
				}
			})
			row += "</tr>"
			$("#tb-data-table").append(row)
			//console.log(row)
		})

		mydataTable = $('#data-table').DataTable({
			dom: 'Blfrtip',//'B<"clear">frtip',
			buttons: {
				buttons: ['excel' ]
			}
		})
		$("#data-table").removeClass("d-none")
		$(".buttons-excel span").html("<i class='fa fa-reply' aria-hidden=true></i>&nbsp;Exporter en fichier Excel")
		$(".buttons-excel").addClass("mb-3")

		return true
	}


	/**
	 * 
	 * @param {*} jsonFormData : Données du formulaire au format Json
	 * @returns 
	 */
	var createMap = (jsonFormData) => {
		// reinitialisation conteneur
		if(layerGroup_point){
			layerGroup_point.remove()
			layerGroup_point = null
		}
		if(map){
			map.off();
			map.remove();
			map = null
		}
		$("#map").empty()
		//creation carte
		map = L.map('map',{
			contextmenu: true,                
			fullscreenControl: {pseudoFullscreen: false}
		}).setView([-18.854, 47.285],7) //madagascar
		map.scrollWheelZoom.disable()
		L.control.scale().addTo(map)
		//var hash = new L.Hash(map)
		//var NONE_LAYER =  L.tileLayer("",{attribution: '&copy;DPE-MEN',})
		var OSM_LAYER = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution: '&copy;DPE-MEN',
			maxZoom: 22,
			minZoom: 6
		}).addTo(map);
		var IMAGERY_LAYER = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{
			attribution: 'Tiles &copy; Esri &mdash;',
			maxZoom: 22,
			minZoom: 6
		});
		var BING_LAYER = L.tileLayer.bing(MyBingMapsKey,{type: "CanvasDark"})
		var allOptions = {
			//"Default": NONE_LAYER,
			"OSM": OSM_LAYER,
			"BING": BING_LAYER,
			"IMAGERY" : IMAGERY_LAYER

		};
		L.control.layers(allOptions).addTo(map);

		shp_dren = L.geoJson(drenGeoJson, {
			style: {
				weight: 3,
				color: '#67748e', //lokon tsipika
				opacity: 1,
				fillColor: '#000',
				fillOpacity: 0.2
			},
			onEachFeature: (feature,layer)=>{
				layer.bindTooltip(`${feature.properties.dren}`, {permanent: false, opacity: 0.5}),
				layer.on({
					click:(e)=>{map.fitBounds(e.target.getBounds());},
					mouseOver:(e)=>{
						layer.setStyle({color: '#bbb',
							weight: 2,
							fillOpacity: 0.2
						});
						if (!L.Browser.ie && !L.Browser.opera) {/*layer.bringToFront();*/}
					},
					mouseOut:(e)=>{shp_dren.resetStyle(e.target);}
				})
			},
			filter: (feature)=>{//return (code_dren == 0)?true:(code_dren == feature.properties.code_dren)?true:false
				return (feature.properties.code_dren >= 0)
			}
		}).addTo(map)

		array_data_cisco = []
		shp_cisco = L.geoJson(ciscoGeoJson, {
			contextmenu:true,
			contextmenuItems: [
				{
					text: 'Centrer la carte ici',
					callback: (e) =>  {
						map.flyTo(e.latlng,15)
					}
				},
					'-', 
				{
					text: 'Zoom +',
					icon: '../admin/dist/img/zoom-in.png',
					callback: (e) =>{
						map.zoomIn();
					}
				},
				{
					text: 'Zoom -',
					icon: '../admin/dist/img/zoom-out.png',
					callback: (e) =>{
						map.zoomOut();
					}
				}
			], 
			style: {
				weight: 2,
				color: '#aaa', //lokon tsipika
				opacity: 1,
				fillColor: '#f4f4f4',
				fillOpacity: 0.1
			},
			onEachFeature: (feature,layer)=>{
				ttp = `<small class='tipso_style' data-tipso-title='CISCO' data-tipso-content='${feature.properties.cisco}' >CISCO ${feature.properties.cisco}</>`
				layer.bindTooltip(ttp, {permanent: false, opacity: 0.5}),
				layer.on({
					//click:(e)=>{map.fitBounds(e.target.getBounds());},
					mouseOver:(e)=>{
						layer.setStyle({color: '#aa0000',
							weight: 3,
							fillOpacity: 0.3
						});
						if (!L.Browser.ie && !L.Browser.opera) {/*layer.bringToFront();*/}
					},mouseOut:(e)=>{shp_cisco.resetStyle(e.target);}

				})
			},
			filter: (feature)=>{
				//return (code_dren == 0)?true:(code_dren == feature.properties.code_dren)?true:false
				return (feature.properties.code_cisco >=0 )
			}
		}).addTo(map)

		// implementation Marker isaky ny submission
		layerGroup_point = L.layerGroup()
		$.each(jsonFormData, function( index, form ) {
			if(Object.keys(form).indexOf("_geolocation") >= 0){
				if(Array.isArray(form["_geolocation"])){
					lat = (isNaN(parseFloat(form["_geolocation"][0])))?0:parseFloat(form["_geolocation"][0])
					lng = (isNaN(parseFloat(form["_geolocation"][1])))?0:parseFloat(form["_geolocation"][1])
					//console.log(lat,form["_geolocation"][0], lng,form["_geolocation"][1])
					p = L.marker([lat, lng])
					layerGroup_point.addLayer(p)
				}
			}
		})
		layerGroup_point.addTo(map)
		//console.log(array_data_dren,"\n*********\n",array_data_cisco)
		$("#map").css('height','100vh')
		$("#map").css('width','100vw')

		return new Promise(resolve => {resolve(true)})
	} // map

	
	/**
	 * Statistique submission par dren
	 * @param {*} jsonFormData 
	 * @returns 
	 */
	var array_data_dren = [] // array asiana ny objet DREN misy ny nbr submissions
	var get_Stats_dren = (jsonFormData)=>{
		//boucle  array_dren , fichier static efa azo anaty public data 
		$.each(jsonFormData,(index,dren)=>{
			_dren = {}
			_dren["code"] = dren.code
			_dren["name"] = dren.name
			_count = 0
			//form["question_1"] : code_dren anaty submissions
			$.each(jsonFormData,(index,form)=>{
				_count = (parseInt(form["question_1"]) === parseInt(dren.code))? _count + 1 : _count + 0
			})
			//layerGroup_point.eachLayer((marker)=>{ _count = (layer.contains(marker.getLatLng()))? _count + 1 : _count + 0})
			_dren["count"] = _count
			array_data_dren.push(_dren)
			intValPbar += 0.7 // 0.7 = 98/140 : 98% sisa tavela  / (22dren + 118district)
		})

		//-------------
		//- BAR CHART DREN-
		//-------------
		//console.log(array_data_dren)
		$("#barChart-dren").empty()
		$("#barChart-dren").html("")
		createBarChart("barChart-dren", array_data_dren)

		//promise pour la function async 
		return new Promise(resolve => {resolve(true)})
	}

	array_data_cisco = [] // array asiana ny submissions par cisco
	/**
	 * Obtenir Stat CISCO
	 * @param {*} jsonFormData 
	 * @returns 
	 */
	var get_Stats_cisco = (jsonFormData)=>{
		//boucle  array_cisco , fichier static efa azo anaty public data 
		$.each(jsonFormData,(index,cisco)=>{
			_cisco = {}
			_cisco["code_dren"] = cisco.code_dren
			_cisco["code"] = cisco.code
			_cisco["name"] = cisco.name
			_count = 0
			//form["question_2"] : code_cisco anaty submissions
			$.each(jsonFormData,(index,form)=>{
				// raha mitovy ny cisco. sy ny form["question_2"] am submissions dia alaina ny form["question_1"]
				if(parseInt(form["question_2"]) === parseInt(cisco.code)){
					_count += 1 
				} 
			})
			_cisco["count"] = _count
			array_data_cisco.push(_cisco)
			intValPbar += 0.7
		})

		// preparation liste et chart
		
		eval(`$("#list-dren").html("")`)
		eval(`$("#list-dren").empty()`)

		$.each(array_data_dren,(index,dren)=>{
			//<li class='list-group-item d-flex justify-content-between align-items-center'
			html =  `<a href="#!"><li class="list-group-item d-flex justify-content-between align-items-center js-getStatByDren" data-code="${dren.code}" >${dren.name}`
			clss = (dren.count == 0) ? "badge-danger" : "badge-primary"
            html += `<span class='badge ${clss} badge-pill'>${dren.count}</span></li></a>`
			$("#list-dren").append(html)
		})
		/*

		*/

		return new Promise(resolve => {resolve(true)})
	} // stats cisco


	/**
	 * Action sur click DREN pour obtenir stats cisco
	 */
	$(document).on("click", ".js-getStatByDren", function(){
		_code = $(this).attr("data-code")
		$(".js-getStatByDren").removeClass("active")
		$(this).addClass("active")
		array_c = array_data_cisco.filter(cisco => cisco.code_dren == _code)
		//console.log(_code, array_c)
		$("#barChart-cisco").empty()
		$("#barChart-cisco").html("")
		createBarChart("barChart-cisco", array_c)
	})//

	/*************  DashBoard *******************************************/
	/**
	 * 
	 * @param {*} jsonData 
	 */
	var tdb = (jsonData) => {
		html = ""
		count = 0

		//creation cadre asiana ny piechart

		//array_thead = entete tableau data
		$.each(array_variable,(key,val)=>{
			html += (count == 0)?'<div class="row mt-4">':'' // a la ligne isaky ny miverina ny compteur

			html += '<div class="col-lg-4">'
			html += '   <div class="card card">' 
			html += '       <div class="card-header bg-secondary text-white">'
			html += '       	<h3 class="card-title"><small>' + val + '</small></h3>'
			html += '       	<div class="card-tools">'
			html += '       		<button type="button" class="btn btn-tool" data-card-widget="collapse">'
			html += '       			<i class="fas fa-minus"></i>'
			html += '       		</button>'
			html += '       	</div>'
  			html += '       </div>'
			html += '		<div class="card-body">'
			html += '			<div id="chart-' + key + '-' + val.substr(0, 4)+ '"></div>'
			html += '		</div>'
			html += '	</div>'
			html += '</div>'
			count += 1
			// averina 0 ny compteur rehefa feno ny col-lg-4 * 3 dia hidiana ny row
			if(count == 3){
				html += '</div>'
				count = 0
			}
		})
		$("#rapport-tdb").html(html)
		//return true
		// creation tableau misy ny objet anaovana ny piechart
		var array_var = [] //tableau des variables ilaina
		count = 0
		$.each(array_variable,(key,val)=>{ // boucle an'ilay entete table
			var line = 0 // ijerevana ny ligne paire ou impaire anaovana ny chart pie/bar
			if(key>=0){ // tsy asiana condition 
				array_var.push(val) // izay variable manomnoka @ A sy B ihany no ilaina anaovana rapport
				_array_data = [] // tableau temporaire asiana ny liste donnees isaky ny variable
				$.each(jsonData,(index,form)=>{
					if(form[val] != null && form[val].length > 0){
						// sarahana par espace ny reponse raha maromaro 
						array_rep = (form[val])?form[val].split(' ') :[]
						$.each(array_rep,(ind,rep)=>{
							_array_data.push(rep)
						})
					}else{
						_array_data.push('N/F')
					}

				})
				//console.info(val,'\t',array_data,'\n')
				var tab_f = [...new Set(_array_data)] // tableau sans doublon an'ilay array_data
				tab_pie = [] // tableau asiana ny objet amin'ilay chart [{name:'nom',y:nombre}]
				tab_bar = [] // tableau asiana ny objet amin'ilay chart [['nom',nombre]]
				for(i=0;i<tab_f.length;i++){
					_objet = {}
					_arr = []

					temp = _array_data.filter(value => value == tab_f[i]) // manisa nombre reponse d'un variable
					
					//objet raha pie
					_objet.name = tab_f[i]
					_objet.y = temp.length

					// array raha bar
					_arr.push(tab_f[i])
					_arr.push(temp.length)

					tab_pie.push(_objet)
					tab_bar.push(_arr)
				}

				// ny colone 1-2-3 atao pie
				if(count<3){
					draw_pie("chart-" + key + "-" + val.substr(0, 4), tab_pie, val)
				}
				// ny colone 4-5-6 atao bar
				if(count>=3 && count <=5){
					draw_bar("chart-" + key + "-" + val.substr(0, 4), tab_bar, val)

				}
				count += 1

				//averina 0 ny counte rehefa feno 6 ny colone
				if(count > 5) count = 0
			}
		})

		return new Promise(resolve => {resolve(true)})
	} // tdb


	/**
	 * 
	 * @param {*} dom : ID du dom asiana an'ilay chart
	 * @param {*} array_object : données anaovana ilay chart, type: Tableau d'objet dren ou cisco
	 */
	// raha dren ilay array dia toy izao : 
	//		 array_object = [{code:1,name:'dren1',count:37},{code:2,name:'dren2',count:45},...]
	// raha cisco ilay array dia toy izao :
	//		 array_object = [{code:1,name:'cisco111',count:7},{code:222,name:'cisco2',count:12},...]
	var createBarChart = (dom, array_object) => {
		eval(`$("#"+dom).html("")`)
		eval(`$("#"+dom).empty()`)
		_labels = []
		_data = []
		$.each(array_object,(index, std)=>{
			_labels.push(std.name)
			_data.push(std.count)
		})
		var dataChart = {
			labels  : _labels,
			datasets: [
				{
					label               : 'Nombre des Submissions',
					backgroundColor     : 'rgba(60,141,188,0.9)',
					borderColor         : 'rgba(60,141,188,0.8)',
					pointRadius          : true,
					pointColor          : '#3b8bba',
					pointStrokeColor    : 'rgba(60,141,188,1)',
					pointHighlightFill  : '#fff',
					pointHighlightStroke: 'rgba(60,141,188,1)',
					data                : _data
				},
			]
		}
		var barChartCanvas = $("#"+dom).get(0).getContext('2d')
		var barChartData = $.extend(true, {}, dataChart)
		var dataBar = dataChart.datasets[0]
		barChartData.datasets[0] = dataBar
		var barChartOptions = {
			responsive              : true,
			maintainAspectRatio     : false,
			datasetFill             : false
		}
		new Chart(barChartCanvas, {
			type: 'bar',
			data: barChartData,
			options: barChartOptions
		})
	} // createBarChart


        //tracage bar collumn
	var draw_bar = (div_id,data,title)=>{
		Highcharts.chart(div_id, {
			chart: {
				type: 'column'
			},
			title: {
				text: title.split('_')[0]
			},
			subtitle: {
				text: 'Source: KOBO DPE-MEN'
			},
			xAxis: {
				type: 'category',
				labels: {
					rotation: -45,
					style: {
						fontSize: '12px',
						fontFamily: 'Verdana, sans-serif'
					}
				}
			},
			yAxis: {
				min: 0,
				title: {
					text: 'Nombre'
				}
			},
			legend: {
				enabled: false
			},
			tooltip: {
				pointFormat: title.split('_')[0] + '<b>{point.y:.0f}</b>'
			},
			series: [{
				name:  'rapport_' + title.split('_')[0],
				data: data,
				dataLabels: {
					enabled: true,
					rotation: -90,
					color: '#FFFFFF',
					align: 'right',
					format: '{point.y:.1f}', // one decimal
					y: 10, // 10 pixels down from the top
					style: {
						fontSize: '13px',
						fontFamily: 'Verdana, sans-serif'
					}
				}
			}]
		});
	}

    var draw_pie = (div_id,data,title)=>{
		// Build the chart
		Highcharts.chart(div_id, {
			chart: {
				plotBackgroundColor: null,//'#6c757d',
				plotBorderWidth: 1,
				plotShadow: true,
				type: 'pie'
			},
			title: {
				text: "Part des reponses"
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.0f}</b>'
			},
			accessibility: {
				point: {
					valueSuffix: '%'
				}
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: false
					},
					showInLegend: true
				}
			},
			series: [{
				name: '' + title.split('_')[0],
				colorByPoint: true,
				data: data
			}]
		});
    }
});

