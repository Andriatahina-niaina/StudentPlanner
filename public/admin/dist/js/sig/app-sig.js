var map = null;
$(document).ready(function(){
   // map
   map = L.map('map-geo',{}).setView([-18.9189596,47.5135653], 2); //map
   map.scrollWheelZoom.disable();
   L.control.scale().addTo(map);
   var OSM_LAYER = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	   maxZoom: 20,
	   attribution: '© OpenStreetMap'
   })
   const MyBingMapsKey = "AoRRWTdH7LrGGJlY4xtYjYTKVG6_BZTlBN6lww8bkB_pl0Ur3drAa91fnvix-Aqn"
   //-18.91891771052786, lng: 47.51385211944581
   var IMAGERY_LAYER = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri'});
   var BING_LAYER = L.tileLayer.bing(MyBingMapsKey,{type: "CanvasDark"})
   var allOptions = {
	"OSM" : OSM_LAYER,
	"IMAGERY" : IMAGERY_LAYER,
	"BING": BING_LAYER
   };
   //     end of tile provider
   OSM_LAYER.addTo(map);
   var ctrl = L.control.layers(allOptions).addTo(map);
   ctrl.setPosition('topleft');
   map.flyTo([-18.91891771052786,47.51385211944581],6);

   //zoom control ahafahana mijery ny niveau de zoom rehefa hanao pointage
   const ZoomViewer = L.Control.extend({
		onAdd() {
			const container = L.DomUtil.create('div');
			const gauge = L.DomUtil.create('div');
			container.style.width = '200px';
			container.style.background = 'rgba(255,255,255,0.5)';
			container.style.textAlign = 'left';
			map.on('zoomstart zoom zoomend', (ev) => {
				gauge.innerHTML = `Niveau de Zoom: ${map.getZoom()}`;
			});
			container.appendChild(gauge);
			return container;
		}
	}); // ZoomViewer
	const zoomViewerControl = (new ZoomViewer({
		position: 'topright'
	  })).addTo(map);

	// control localite map view
	L.Control.LocaliteControl = L.Control.extend({
		onAdd: function(map) {
		  var el = L.DomUtil.create('div', 'leaflet-bar localite-control');
		  el.innerHTML = 'Nationale';
		  return el;
		},
		onRemove: function(map) {/* Nothing to do here */}
	  });
	  L.control.myControl = function(opts) {
		return new L.Control.LocaliteControl(opts);
	  }
	  L.control.myControl({
		position: 'topright'
	  }).addTo(map);

	$(".localite-control").css({"background":"#fff","padding":"5px"})

   var shp_dren = null
   var shp_cisco = null
   var shp_commune = null
   var shp_etab = null

   // layer point village et etab
   var layerGroup_vllg = null
   var interval_etab= null
   var interval_vllg = null

   // creation layerGroupe pour chaque entite
   var layerGroup_n0s0 = null
   var layerGroup_n1s0 = null
   var layerGroup_n2s0 = null
   var layerGroup_n3s0 = null
   var layerGroup_n0s1 = null
   var layerGroup_n1s1 = null
   var layerGroup_n2s1 = null
   var layerGroup_n3s1 = null
   var layerGroup_village = null

   // chargement couche dren : drenGeoJson efa azo avy @js
   var load_couche_dren = ()=>{
	shp_dren = L.geoJson(drenGeoJson, {
			contextmenu:false,
			style: {
				weight: 1,
				color: '#67748e', //lokon tsipika
				opacity: 1,
				fillColor: '#000', //lokon'ilay contenu
				fillOpacity: 0.2
			},
			onEachFeature: (feature,layer)=>{ // action atao isaky ny feature
				layer.bindTooltip(feature.properties.REGION_NAM, {permanent: false, opacity: 0.5}),
				layer.on({
					click:(e)=>{
						map.fitBounds(e.target.getBounds());
						if(shp_cisco) shp_cisco.remove()
						load_couche_cisco(parseInt(feature.properties.code_dren)) // appel creation couche cisco
						shp_cisco.addTo(map)
						// affichage localite sur map
						$(".localite-control").html(`DREN ${feature.properties.REGION_NAM}`)
					},
					mouseOver:(e)=>{
						layer.setStyle({
							color: '#1d1e22', //lokon tsipika
							weight: 2,
							fillOpacity: 0.1
						});
						if (!L.Browser.ie && !L.Browser.opera) {/*layer.bringToFront();*/} // support opera sy Edge/IE
					},
					mouseOut:(e)=>{
						shp_dren.resetStyle(e.target);
					}
				})
			},
			filter: (feature)=>{
				return (feature.properties.code_dren>=0)
			}
		}).addTo(map)

		// maka ny stat nationale
		get_statistique(0)
	}// shp_dren

	load_couche_dren()

    //charge couche cisco by code_dren , ciscoGeoJson efa azo avy @js
    var load_couche_cisco = (c_dren)=>{
		shp_cisco = L.geoJson(ciscoGeoJson, {
			contextmenu:false,
			style: {
				weight: 1,
				color: '#596CFF', //lokon tsipika
				opacity: 1,
				fillColor: '#5e72e4',
				fillOpacity: 0.3
			},
			onEachFeature: (feature,layer)=>{
				layer.bindTooltip(feature.properties.cisco, {permanent: false, opacity: 0.5})
				layer.on({
					click:(e)=>{
						map.fitBounds(e.target.getBounds());
						//chargement couche commune
						if(shp_commune) shp_commune.remove()
						load_couche_commune(parseInt(feature.properties.code_cisco))
						$("#hidden_code_cisco").val(parseInt(feature.properties.code_cisco))
						shp_commune.addTo(map)
						load_couche_etab(parseInt(feature.properties.code_cisco))
						load_couche_village(parseInt(feature.properties.code_cisco))

						//toolbar
						$('#toolbar').removeClass("d-none")

						// affichage localite sur map
						$(".localite-control").html(`CISCO ${feature.properties.cisco}`)

						//
						get_etab_geojson(parseInt(feature.properties.code_cisco))


						/*
						if(!interval_etab){
							interval_etab = setInterval(load_couche_etab,60000,parseInt(feature.properties.code_cisco));
						}else{
							clearInterval(interval_etab)
							interval_etab = null
						}
						if(!interval_vllg){
							interval_vllg = setInterval(load_couche_village,60000,parseInt(feature.properties.code_cisco));
						}else{
							clearInterval(interval_vllg)
							interval_vllg = null
						}
						*/


					},

				})
			},
			filter: (feature)=>{
				return (c_dren == feature.properties.code_dren)?true:false
			}
		})

		// maka ny stat an'ilay dren
		get_statistique(c_dren)
    } // shp_cisco


	// commune
    //charge couche commune by code_cisco
    // ato no misy ny traitement rehetra mikasika ny CRUD FKTN,VLLG,ETAB
    var load_couche_commune = (c_cisco)=>{
		//couche cisco
		shp_commune = L.geoJson(communeGeoJson,{
			contextmenu:true,
			style: {
				weight: 3,
				color: '#FBD38D', //lokon tsipika
				opacity: 1,
				fillColor: '#FBD38D',
				fillOpacity: 0.2
			},
			onEachFeature: (feature,layer)=>{
				commune_na = feature.properties.commune_na
				layer.bindTooltip(commune_na, {permanent: false, opacity: 0.7})
				layer.on({
					contextmenu:(e)=>{
						//console.log(e)
						new Contextual({
							isSticky: false,
							items: [
								{label: '+ Geolocaliser Etablissement', onClick: () => {
									if (map.getZoom() < 15){
										alert("Niveau de Zoom trop petit !\nZoom Minimun autoriser : 16")
										return
									}
									$(".js-latitude").val(e.latlng.lat);
									$(".js-longitude").val(e.latlng.lng);
									openFormEtab("cisco", feature.properties.code_cisco)

								}},
								{type: 'seperator'},
								{label: '+ Geolocaliser Village', onClick: () => {
									if (map.getZoom() < 15){
										alert("Niveau de Zoom trop petit !\nZoom Minimun autoriser : 16")
										return
									}
									$(".js-latitude").val(e.latlng.lat);
									$(".js-longitude").val(e.latlng.lng);
									openFormVillage(feature.properties.code_cisco)
								}},

							]
						});
					}
				})
			},
			filter: (feature)=>{
				return (c_cisco == feature.properties.code_cisco)?true:false
			}
		}).addTo(map)
		// voir control des couches
		// maka ny stat an'ilay cisco
		get_statistique(c_cisco)
    }// shp_commune


	// couche etab *
	// definition an'ireo  layerGroup hoan'ny etablissement
	var load_couche_etab = function (code_cisco){
			if(layerGroup_n0s0) layerGroup_n0s0.remove()
            layerGroup_n0s0 = L.layerGroup()
			L.geoJson(n0s0GeoJson,{
				onEachFeature: function(feature, layer){
					coords = [feature.properties.latitude,feature.properties.longitude];
					if(code_cisco == feature.properties.cisco){
						marker = L.marker(coords,{
							properties : feature.properties,
							icon:new L.DivIcon({
								className: 'n0s0-label',
								html: "&#127968;&nbsp;" + feature.properties.name
							}),
						})
						marker.bindPopup("<p> "+feature.properties.name + "</p>")
						layerGroup_n0s0.addLayer(marker)
					}
				}
			})
			if(layerGroup_n1s0) layerGroup_n1s0.remove()
            layerGroup_n1s0 = L.layerGroup()
			L.geoJson(n1s0GeoJson,{
				onEachFeature: function(feature, layer){
					coords = [feature.properties.latitude,feature.properties.longitude];
					if(code_cisco == feature.properties.cisco){
						marker = L.marker(coords,{
							properties : feature.properties,
							icon:new L.DivIcon({
								className: 'n1s0-label',
								html: "&#127968;&nbsp;" + feature.properties.name
							}),
						})
						marker.bindPopup("<p> "+feature.properties.name + "</p>")
						layerGroup_n1s0.addLayer(marker)
					}
				}
			})
			if(layerGroup_n2s0) layerGroup_n2s0.remove()
            layerGroup_n2s0 = L.layerGroup()
			L.geoJson(n2s0GeoJson,{
				onEachFeature: function(feature, layer){
					coords = [feature.properties.latitude,feature.properties.longitude];
					if(code_cisco == feature.properties.cisco){
						marker = L.marker(coords,{
							properties : feature.properties,
							icon:new L.DivIcon({
								className: 'n2s0-label',
								html: "&#127968;&nbsp;" + feature.properties.name
							}),
						})
						marker.bindPopup("<p> "+feature.properties.name + "</p>")
						layerGroup_n2s0.addLayer(marker)
					}
				}
			})
			if(layerGroup_n3s0) layerGroup_n3s0.remove()
            layerGroup_n3s0 = L.layerGroup()
			L.geoJson(n3s0GeoJson,{
				onEachFeature: function(feature, layer){
					coords = [feature.properties.latitude,feature.properties.longitude];
					if(code_cisco == feature.properties.cisco){
						marker = L.marker(coords,{
							properties : feature.properties,
							icon:new L.DivIcon({
								className: 'n3s0-label',
								html: "&#127968;&nbsp;" + feature.properties.name
							}),
						})
						marker.bindPopup("<p> "+feature.properties.name + "</p>")
						layerGroup_n3s0.addLayer(marker)
					}
				}
			})
			/* prive */
			if(layerGroup_n0s1) layerGroup_n0s1.remove()
            layerGroup_n0s1 = L.layerGroup()
			L.geoJson(n0s1GeoJson,{
				onEachFeature: function(feature, layer){
					coords = [feature.properties.latitude,feature.properties.longitude];
					if(code_cisco == feature.properties.cisco){
						marker = L.marker(coords,{
							properties : feature.properties,
							icon:new L.DivIcon({
								className: 'n0s1-label',
								html: "&#11093;&nbsp;" + feature.properties.name
							}),
						})
						marker.bindPopup("<p> "+feature.properties.name + "</p>")
						layerGroup_n0s1.addLayer(marker)
					}
				}
			})
			if(layerGroup_n1s1) layerGroup_n1s1.remove()
            layerGroup_n1s1 = L.layerGroup()
			L.geoJson(n1s1GeoJson,{
				onEachFeature: function(feature, layer){
					coords = [feature.properties.latitude,feature.properties.longitude];
					if(code_cisco == feature.properties.cisco){
						marker = L.marker(coords,{
							properties : feature.properties,
							icon:new L.DivIcon({
								className: 'n1s1-label',
								html: "&#11093;&nbsp;" + feature.properties.name
							}),
						})
						marker.bindPopup("<p> "+feature.properties.name + "</p>")
						layerGroup_n1s1.addLayer(marker)
					}
				}
			})
			if(layerGroup_n2s1) layerGroup_n2s1.remove()
            layerGroup_n2s1 = L.layerGroup()
			L.geoJson(n2s1GeoJson,{
				onEachFeature: function(feature, layer){
					coords = [feature.properties.latitude,feature.properties.longitude];
					if(code_cisco == feature.properties.cisco){
						marker = L.marker(coords,{
							properties : feature.properties,
							icon:new L.DivIcon({
								className: 'n2s1-label',
								html: "&#11093;&nbsp;" + feature.properties.name
							}),
						})
						marker.bindPopup("<p> "+feature.properties.name + "</p>")
						layerGroup_n2s1.addLayer(marker)
					}
				}
			})
			if(layerGroup_n3s1) layerGroup_n3s1.remove()
            layerGroup_n3s1 = L.layerGroup()
			L.geoJson(n3s1GeoJson,{
				onEachFeature: function(feature, layer){
					coords = [feature.properties.latitude,feature.properties.longitude];
					if(code_cisco == feature.properties.cisco){
						marker = L.marker(coords,{
							properties : feature.properties,
							icon:new L.DivIcon({
								className: 'n3s1-label',
								html: "&#11093;&nbsp;" + feature.properties.name
							}),
						})
						marker.bindPopup("<p> "+feature.properties.name + "</p>")
						layerGroup_n3s1.addLayer(marker)
					}
				}
			})

		}// shp_etab

		// couche vilage
		var load_couche_village= function (code_cisco){
			if(layerGroup_village) layerGroup_village.remove()
			layerGroup_village = null
            layerGroup_village = L.layerGroup()

			L.geoJson(villageGeoJson,{
				onEachFeature: function(feature, layer){
					ok = (typeof parseFloat(feature.properties.latitude) == "number")
					ok = ok && (typeof parseFloat(feature.properties.longitude) == "number")
					if(ok){
						coords = [feature.properties.latitude,feature.properties.longitude];
					}else{
						coords = [0,0];
					}

					if(code_cisco == feature.properties.cisco){
						error = (feature.properties.population == 0 || feature.properties.fokontany.length <7)
						html = (error)?` &nbsp; <small style='color:#f00'>${feature.properties.name}</small>`:` &nbsp; <small>${feature.properties.name}</small>`
						marker = L.marker(coords,{
							contextmenu:true,
							properties : feature.properties,
							icon:new L.DivIcon({
								className: 'village-label ',
								html: html
							}),
						})
						marker.bindPopup("<small>"+feature.properties.name + "</small>")
						marker.on({
							contextmenu:(e)=>{
								//console.log(e)
								new Contextual({
									isSticky: false,
									items: [
										{label: '! Modifier', onClick: () => {
											openFormEditVillage(feature.properties)
										}},
										{type: 'seperator'},
										{label: 'x Supprimer', onClick: () => {
											if(confirm(`Confirmer la suppression du village ${feature.properties.name} ?`)){
												alert("Opération non autorisée");
											}
										}},

									]
								})
							}
						})
						layerGroup_village.addLayer(marker)
					}
				}
			})

		}// shp_village

		var init_map = (map)=>{

			if(layerGroup_village ) layerGroup_village.remove()
			if(shp_etab ) shp_etab.remove()
			if(shp_commune ) shp_commune.remove()
			if(shp_cisco ) shp_cisco.remove()
			if(shp_dren ) shp_dren.remove()
			$("#code_cisco").val("")
			for(n=0;n<4;n++){
				eval("if(layerGroup_n"+n+"s0){layerGroup_n"+n+"s0.remove();}layerGroup_n"+n+"s0 = null;")
				eval("if(layerGroup_n"+n+"s1){layerGroup_n"+n+"s1.remove();}layerGroup_n"+n+"s1 = null;")
			}
			map.flyTo([-18.854,47.285],6)
			$('#toolbar').addClass("d-none")
			load_couche_dren()
			// affichage localite sur map
			$(".localite-control").html(`Nationale`)
		}

	var btnInit = L.easyButton('fa-crosshairs fa-lg', function(btn, map){
		init_map(map)
	},'Reinitialiser','btn-map-init')
	btnInit.addTo(map);


	/* event control couche village */
	$(document).on("click","#chk-vllg", function(){
		if($(this).prop("checked")){
			layerGroup_village.addTo(map)
		}else{
			layerGroup_village.remove()
		}
	})
	/* event control couche etab */
	$(".js-chk-etab").on("click",function(){
		niveau = $(this).attr("niveau");
		secteur =  $(this).attr("secteur");
		code_cisco = $("#code_cisco").val()
		if($(this).prop("checked")){
			for(n=0;n<4;n++){
				if(n==niveau && secteur == 0){eval("layerGroup_n"+n+"s0.addTo(map);")}
				if(n==niveau && secteur == 1){eval("layerGroup_n"+n+"s1.addTo(map);")}
			}
		}else{
			for(n=0;n<4;n++){
				if(n==niveau && secteur == 0){eval("layerGroup_n"+n+"s0.remove();")}
				if(n==niveau && secteur == 1){eval("layerGroup_n"+n+"s1.remove();")}
			}
		}
	});

	//ajouetr etab dans sig
	$(document).on("click",".js-save-etab-sig", function(){
		code = $("#fpe-etab").val()
		nom = $("#fpe-etab option:selected").text()
		if(code.length < 9 || nom.length < 4){
			alert("Veuillez verifier les champs !")
			return;
		}
		latitude = $(".js-latitude").val()
		longitude = $(".js-longitude").val()
		if(confirm("Confirmer l'ajout de l'etablissement " + nom + "?")){
			$.post($("#url-save-etab-sig").val(),{code,latitude,longitude}, function(data){
				showNotif("success","Enregistrement","Enregistrement ok")
				$("#staticBackdropEtab").modal("hide")
			})

		}
	})

	//ajouetr village dans sig
	$(document).on("click",".js-save-village", function(){
		fktn = $("#liste-fktn").val().split("-")
		fktn_n = $("#liste-fktn option:selected").text()
		dren = fktn[0]
		cisco = fktn[1]
		commune = fktn[2]
		zap = fktn[3]
		fktn = fktn[4]
		nom = $("#nom-village").val()
		code = fktn[4] + "@" + nom
		population = $("#population").val()
		isEau = ($("#isEau").prop("checked"))?1:0
		isElec = ($("#isElec").prop("checked"))?1:0
		isAirtel = ($("#isAirtel").prop("checked"))?1:0
		isTelma = ($("#isTelma").prop("checked"))?1:0
		isOrange = ($("#isOrange").prop("checked"))?1:0
		isCentre = ($("#isCentre").prop("checked"))?1:0
		code_etab = $("#fpe-etab-village").val()
		latitude = $(".js-latitude").val()
		longitude = $(".js-longitude").val()
		if(fktn.length < 5 || nom.length < 3 || nom.length < 5){
			alert("Veuillez verifier les champs !")
			return;
		}
		if(confirm("Confirmer l'ajout du village " + nom + " dans le fokontany "+fktn_n+"?")){
			data_ = {dren,cisco,commune,zap,fktn,code,nom,isEau,isElec,isAirtel,isTelma,isOrange,population,isCentre,code_etab,latitude,longitude}
			$.post($("#url-save-village").val(),data_, function(data){
				showNotif("success","Enregistrement","Enregistrement ok")
				$("#staticBackdropVillage").modal("hide")
			})

		}
	}) // ajout vllg

	//edit
	//ajouetr village dans sig
	$(document).on("click",".js-edit-village", function(){
		id=$("#hidden-id-village").val()
		fktn = $("#liste-fktn_").val().split("-")
		fktn_n = $("#liste-fktn_ option:selected").text()
		dren = fktn[0]
		cisco = fktn[1]
		commune = fktn[2]
		zap = fktn[3]
		fktn = fktn[4]
		nom = $("#nom-village_").val()
		code = fktn[4] + "@" + nom
		population = $("#population_").val()
		isEau = ($("#isEau_").prop("checked"))?1:0
		isElec = ($("#isElec_").prop("checked"))?1:0
		isAirtel = ($("#isAirtel_").prop("checked"))?1:0
		isTelma = ($("#isTelma_").prop("checked"))?1:0
		isOrange = ($("#isOrange_").prop("checked"))?1:0
		isCentre = ($("#isCentre_").prop("checked"))?1:0
		code_etab = $("#fpe-etab-village_").val()
		if(fktn.length < 5 || nom.length < 3 || nom.length < 5){
			alert("Veuillez verifier les champs !")
			return;
		}
		if(confirm("Confirmer la modification du village " + nom + " dans le fokontany "+fktn_n+"?")){
			data_ = {id,dren,cisco,commune,zap,fktn,code,nom,isEau,isElec,isAirtel,isTelma,isOrange,population,isCentre,code_etab}
			$.post($("#url-save-village").val(),data_, function(data){
				showNotif("success","Enregistrement","Enregistrement ok")
				$("#staticBackdropVillage_").modal("hide")
			})

		}
	})

	// download couche
	$(document).on("click", "#btn-down-couche-etab", function(){
		url = $(this).data("url")
		$.post(url,{}, function(data){
			showNotif("success","Telechargement Etablissement ok","Telechargement Etablissement ok")
		})
	})

	$(document).on("click", "#btn-down-couche-village", function(){
		url = $(this).data("url")
		$.post(url,{}, function(data){
			showNotif("success","Telechargement village ok","Telechargement village ok")
		})
	})

	if(typeof villageGeoJson == "undefined"){
		$("#btn-down-couche-village").click()
	}

}); // ready

const createRealtimeLayer = function (url, container) {
    return L.realtime(url, {
        interval: 60 * 1000,
        getFeatureId: function(f) {
            return f.properties.url;
        },
        cache: true,
        container: container,
        onEachFeature(f, l) {
            l.bindPopup(function() {
                return '<h3>' + f.properties.name + '</h3>'
            });
        }
    });
}
//fetch etablissement geojson
const get_etab_geojson = function(code){
	url = $("#url-etab-geojson").val() + `/${code}`
	alert(url)
	return
	$.post(url,function(data){
		//console.log(data)
		//return
		geojson = data
		clusterEtabGroup = L.markerClusterGroup().addTo(map)
		subgroup1 = L.featureGroup.subGroup(clusterEtabGroup)
		subgroup2 = L.featureGroup.subGroup(clusterEtabGroup)
		realtime1 = createRealtimeLayer(geojson, subgroup1).addTo(map),
		realtime2 = createRealtimeLayer(geojson, subgroup2);
	})
}

// statistique sig%fpe
const get_statistique = function(code){
	url = $("#url-stat").val()
	$(".js-spinner").html("<i class='fa fa-spinner fa-spin'></i>")
	//nbr-n2s0 pb-n2s0 stat-n2s0
	$.post(url,{code}, function(data){
		//console.log(data)
		//etabfpe , etabsig
		let sig_n1s0 = 0,sig_n2s0=0, sig_n3s0=0,sig_s1 = 0
		let fpe_n1s0 = 0,fpe_n2s0=0, fpe_n3s0=0,fpe_s1=0
		$.each(data.etabsig,(key, etab)=>{
			if(etab.is_privee == '0'){
				if(etab.is_primaire == '1'){sig_n1s0 ++}
				if(etab.is_college == '1'){sig_n2s0 ++}
				if(etab.is_lycee == '1'){sig_n3s0 ++}

			}else{sig_s1 ++}
		})
		$.each(data.etabfpe,(key, etab)=>{
			if(!etab.isPrivee){
				if(etab.isPrimaire){fpe_n1s0 ++}
				if(etab.isCollege){fpe_n2s0 ++}
				if(etab.isLycee){fpe_n3s0 ++}
			}else{fpe_s1 ++}
		})

		// affichage stat
		$("#nbr-n1s0").html(`${sig_n1s0} / ${fpe_n1s0}`)
		ptg = (fpe_n1s0==0)?0:parseInt(sig_n1s0 * 100 /fpe_n1s0)
		$("#pb-n1s0").css("width",`${ptg}%`)
		$("#stat-n1s0").html(`${ptg}%`)

		$("#nbr-n2s0").html(`${sig_n2s0} / ${fpe_n2s0}`)
		ptg = (fpe_n2s0==0)?0:parseInt(sig_n2s0 * 100 /fpe_n2s0)
		$("#pb-n2s0").css("width",`${ptg}%`)
		$("#stat-n2s0").html(`${ptg}%`)

		$("#nbr-n3s0").html(`${sig_n3s0} / ${fpe_n3s0}`)
		ptg = (fpe_n3s0==0)?0:parseInt(sig_n3s0 * 100 /fpe_n3s0)
		$("#pb-n3s0").css("width",`${ptg}%`)
		$("#stat-n3s0").html(`${ptg}%`)

		$("#nbr-s1").html(`${sig_s1} / ${fpe_s1}`)
		ptg = (fpe_s1==0)?0:parseInt(sig_s1 * 100 /fpe_s1)
		$("#pb-s1").css("width",`${ptg}%`)
		$("#stat-s1").html(`${ptg}%`)

	})
}

// creation LayerGroup ,
// dataGeoJson : nom fichier geojson à charger,
// nxsx :  niveau x et secteur x ( ex : n1s0, n0s1, etc...)
// code_cisco : code_cisco selectioné
const createLayer = function(dataGeoJson,nxsx,icon,code_cisco){
	L.geoJson(dataGeoJson,{
		onEachFeature: function(feature, layer){
			coords = [feature.properties.latitude,feature.properties.longitude];
			if(code_cisco == feature.properties.cisco){
				marker = L.marker(coords,{
					properties : feature.properties,
					icon:new L.DivIcon({
						className: nxsx + '-label',
						html: icon + "&nbsp;<span class='tipso_style marker_etab' title='" +  feature.properties.name +"'>" +  feature.properties.name +"</span>"
					}),
				})
				marker.bindPopup("<p> "+feature.properties.name + "</p>")
				eval("layerGroup_"+nxsx+".addLayer(marker)") //
			}
		}
	})
}// createLayer


//ouvrir formulaire ajout etab dans sig
const openFormEtab = function(localite,code){

	$("#staticBackdropEtab").modal("show")
	//<input type='text' class='form-control' placeholder='${code}000000'/><
	  // chargement liste etab fpe tsy hita anaty sig
	  url = $("#urlFpeNl").val() //url etab fpe non localise
	  $('#fpe-etab').html("")
	  $.post(url,{localite,code},function(data){
		  //console.log(data)
		  if(data.type === "success"){
			  //console.log(data.response)
			  dom = ""
			  $.each(data.response, (key,etab)=>{
				  dom += "<option value='"+etab.code+"'>"+etab.name+"</option>"
			  })
		  }else{
			  dom += `<option value="0">Aucune Etablissement trouvé</option>`
		  }
		  $('#fpe-etab').html(dom)
	  })
	  $('#fpe-etab').select2()
}//openFormEtab


//ouvrir formulaire ajout village dans sig
const openFormVillage = function(code){

	$("#staticBackdropVillage").modal("show")
	//<input type='text' class='form-control' placeholder='${code}000000'/><
	  // chargement liste etab fpe tsy hita anaty sig
	  url = $("#url-get-liste-fktn").val()
	  $('#liste-fktn').html("")
	  $.post(url,{code},function(data){
		  //console.log(data)
		  if(data.type === "success"){
			  dom = ""
			  $.each(data.response, (key,fktn)=>{
					_value = `${fktn.dren}-${fktn.cisco}-${fktn.commune}-${fktn.zap}-${fktn.code}`
				  dom += "<option value='"+_value+"'>"+fktn.name+"</option>"
			  })
		  }
		  $('#liste-fktn').html(dom)
	  })
	  $('#liste-fktn').select2()

	  //liste etab select
	  url = $("#url-etab-n1s0").val()
	  $('#fpe-etab-village').html("")
	  $.post(url,{code},function(data){
		  //console.log(data)
		  if(data.type === "success"){
			  //console.log(data.response)
			  dom = ""
			  $.each(data.response, (key,etab)=>{
				  dom += "<option value='"+etab.code+"'>"+etab.name+"</option>"
			  })
		  }else{
			  dom += `<option value="0">Aucune Etablissement trouvé</option>`
		  }
		  $('#fpe-etab-village').html(dom)
	  })
	  $('#fpe-etab-village').select2()
}//openFormEtab


//ouvrir formulaire edit village
const openFormEditVillage = function(properties){
	$("#staticBackdropVillage_").modal("show")
	url = $("#url-get-liste-fktn").val()
	$('#liste-fktn_').html("")
	code = properties.cisco
	$.post(url,{code},function(data){
		//console.log(data)
		if(data.type === "success"){
			dom = ""
			$.each(data.response, (key,fktn)=>{
				_value = `${fktn.dren}-${fktn.cisco}-${fktn.commune}-${fktn.zap}-${fktn.code}`
				dom += "<option value='"+_value+"'>"+fktn.name+"</option>"
			})
		}
		$('#liste-fktn_').html(dom)
	})
	$('#liste-fktn_').select2()

	//liste etab select
	url = $("#url-etab-n1s0").val()
	$('#fpe-etab-village_').html("")
	code = properties.cisco
	$.post(url,{code},function(data){
		//console.log(data)
		if(data.type === "success"){
			//console.log(data.response)
			dom = ""
			$.each(data.response, (key,etab)=>{
				dom += "<option value='"+etab.code+"'>"+etab.name+"</option>"
			})
		}
		$('#fpe-etab-village_').html(dom)
	})
	$('#fpe-etab-village_').select2()

	cd = `${properties.dren}-${properties.cisco}-${properties.commune}-${properties.zap}-${properties.fokontany}`
	$("#hidden-id-village").val(`${properties.id}`)
	$("#liste-fktn_").val(cd)
	$("#nom-village_").val(`${properties.name}`)
	$("#population_").val(`${properties.population}`)
	$("#isElec_").prop("checked",properties.isElec == 1)
	$("#isEau_").prop("checked",properties.isEau == 1)
	$("#isAirtel_").prop("checked",properties.isAirtel == 1)
	$("#isTelma_").prop("checked",properties.isTelma == 1)
	$("#isOrange_").prop("checked",properties.isOrange == 1)
	$("#isCentre_").prop("checked",properties.isCentre == 1)
	$("#fpe-etab-village_").val(`${properties.code_etab}`)

}//edit village

const showCoordinates = function(e) {
	alert(e.latlng);
}

const centerMap = function(e) {
	map.flyTo(e.latlng ,15);
}

const zoomIn = function(e) {
	map.zoomIn();
}

const zoomOut = function(e) {
	map.zoomOut();
}
/*
var showNotif = function (className,title,message) {
	$.notify(message, {
		className: className,
		autoHide: true,
		clickToHide: true,
		position : 'top center',
		arrowShow: true,
		globalPosition: 'top center',
		gap: 2,
	});
	$(".notifyjs-container").css( "width",'250px');
	$(".notifyjs-container").css( "color",'#ffffff');
	$(".notifyjs-container").css( "margin",'0 auto');
}
*/
