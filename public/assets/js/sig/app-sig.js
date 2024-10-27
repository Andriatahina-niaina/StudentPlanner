document.addEventListener("DOMContentLoaded", function () {


    function populateSelectWithOptions(selectId, optionsData) {
        const selectElement = document.getElementById(selectId)
        selectElement.innerHTML = '<option value="0">--Choisir--</option>';
        optionsData.forEach(option => {
            const optionElement = document.createElement('option')
            optionElement.value = option.id;
            optionElement.textContent = `${option.name} / ${option.code}`;
            selectElement.appendChild(optionElement)
        })
    }
    function updateListeCisco(code_dren) {
        fetch(`/referentiel/cisco?code_dren=${code_dren}`)
            .then(response => response.json())
            .then(data => {
                populateSelectWithOptions("liste-cisco", data)
                populateSelectWithOptions("liste-cisco-sig", data)
            })
            .catch(error => {
                console.error('Une erreur s\'est produite :', error)
            }
        )
    }
    function updateListeZap(code_cisco) {
        fetch(`/referentiel/zap?code_cisco=${code_cisco}`)
            .then(response => response.json())
            .then(data => {populateSelectWithOptions("liste-zap", data)})
            .catch(error => {console.error('Une erreur s\'est produite :', error)}
        )
    }

    // evenement onChange select dren page data
    document.querySelector('#liste-dren').addEventListener('change', async (event) => {
        const code_dren = event.currentTarget.value;
        /* reinitialiser champ cisco et  */
        document.getElementById("liste-cisco").innerHTML = '<option value="0">--Choisir--</option>';
        document.getElementById("liste-zap").innerHTML = '<option value="0">--Choisir--</option>';
        if(code_dren != 0){ updateListeCisco(code_dren)}

    })
    // evenement onChange select dren page sig
    document.querySelector('#liste-dren-sig').addEventListener('change', async (event) => {
        const code_dren = event.currentTarget.value;
        /* reinitialiser champ cisco et  */
        document.getElementById("liste-cisco-sig").innerHTML = '<option value="0">--Choisir--</option>';
        if(code_dren != 0){ updateListeCisco(code_dren)}

    })

    // evenement onChange select cisco
    document.querySelector('#liste-cisco').addEventListener('change', async (event) => {
        const code_cisco = event.currentTarget.value;
        document.getElementById("liste-zap").innerHTML = '<option value="0">--Choisir--</option>';
        if(code_cisco != 0){  updateListeZap(code_cisco)}
    })


    // remplir table etablissement dans page data statistique sig
    function populateDataTableEtablissement(dren,cisco,zap) {
        loadingOverlay.style.display = "flex";
        fetch(`/fpe/etablissement/liste?dren=${dren}&cisco=${cisco}&zap=${zap}`)
            .then(response => response.json())
            .then(data => {
                // Initialiser les compteurs pour les stats
                var countIsS1_fpe = 0; //Tout niveau secteur prive dans fpe
                var countIsS1_sig = 0; //Tout niveau secteur prive dans sig

                var countIsN01S0_fpe = 0; //niveau 0 et 1 pour secteur pub dans fpe
                var countIsN01S0_sig = 0; //niveau 0 et 1 pour secteur pub dans sig

                var countIsN2S0_fpe = 0; //niveau 0 et 1 pour secteur pub dans fpe
                var countIsN2S0_sig = 0; //niveau 0 et 1 pour secteur pub dans sig

                var countIsN3S0_fpe = 0; //niveau 0 et 1 pour secteur pub dans fpe
                var countIsN3S0_sig = 0; //niveau 0 et 1 pour secteur pub dans sig

                var table = $('#dataTable').DataTable()
                /**
                 * cisco: 105 code : 105030001 commune : 10503 dren : 11 fokontany : 1050303 id : 2513 is_college : 1 is_eec : 0 is_lycee : 0
                 * is_presco : 0 is_primaire : 0 is_privee : 0 is_rurale : 1 n_cisco : "AMBOHIDRATRIMO" n_dren : "ANALAMANGA" n_zap : "AMBOHIDRATRIMO" name : "CEG AMBOHIDRATRIMO" village : "1050303@ANTSIMOMPARIHY"
                 * zap : 10503
                 */

                table.clear().draw()
                data.forEach(item => {
                    niveau = (item.is_lycee == 1)?'Lycée':(item.is_college == 1)?'College':(item.is_primaire == 1)?'Primaire': 'Préscolaire'
                    secteur = (item.is_privee == 1)?'Privée': 'Public'
                    coords = (item.lat == 0 || item.lng == 0)? 'N/D' : `${item.lat}, ${item.lng}`
                    table.row.add([item.n_dren, item.n_cisco, item.n_zap, item.code, item.name, niveau,secteur, coords]).draw()

                    // compter les occurrences 
                    if (item.is_privee == 1) { // si ecole privée
                        countIsS1_fpe ++
                        if(coords!='N/D'){ countIsS1_sig ++ }
                    } else { // si ecole publique
                        if(item.is_primaire == 1){
                            countIsN01S0_fpe ++
                            if(coords!='N/D'){ countIsN01S0_sig ++ }
                        }
                        if(item.is_college == 1){
                            countIsN2S0_fpe ++
                            if(coords!='N/D'){ countIsN2S0_sig ++ }
                        }
                        if(item.is_lycee == 1){
                            countIsN3S0_fpe ++
                            if(coords!='N/D'){ countIsN3S0_sig ++ }
                        }
                    }
                    
                })

                // Créer un objet avec les statistiques
                var statistics = {
                    countIsS1_fpe : countIsS1_fpe,
                    countIsS1_sig : countIsS1_sig,
                    countIsN01S0_fpe : countIsN01S0_fpe,
                    countIsN01S0_sig : countIsN01S0_sig,
                    countIsN2S0_fpe : countIsN2S0_fpe,
                    countIsN2S0_sig : countIsN2S0_sig,
                    countIsN3S0_fpe : countIsN3S0_fpe,
                    countIsN3S0_sig : countIsN3S0_sig
                };

                //niveau 1 public
                document.getElementById('countIsN01S0_fpe').setAttribute('aria-valuenow', `${(countIsN01S0_fpe / countIsN01S0_fpe * 100).toFixed(0)}`)
                document.getElementById('countIsN01S0_fpe').style.width = (countIsN01S0_fpe / countIsN01S0_fpe * 100) + '%';
                document.getElementById('countIsN01S0_fpe').innerHTML = `FPE : ${countIsN01S0_fpe}`
                document.getElementById('countIsN01S0_sig').setAttribute('aria-valuenow',  `${(countIsN01S0_sig / countIsN01S0_fpe * 100).toFixed(0)}`)
                document.getElementById('countIsN01S0_sig').style.width = (countIsN01S0_sig / countIsN01S0_fpe * 100) + '%';
                document.getElementById('countIsN01S0_sig').innerHTML = `SIG : ${countIsN01S0_sig}`
                document.getElementById('ptg_countIsN01S0').innerHTML =`Etablissements géolocalisés : ${ (countIsN01S0_sig / countIsN01S0_fpe * 100).toFixed(0) } %`

                //niveau 2 et 3 public
                for(let i=2;i<=3;i++){
                    var countIsNxS0_fpe = eval(`countIsN${i}S0_fpe`)
                    var countIsNxS0_sig = eval(`countIsN${i}S0_sig`)
                    document.getElementById(`countIsN${i}S0_fpe`).setAttribute('aria-valuenow', `${(countIsNxS0_fpe / countIsNxS0_fpe * 100).toFixed(0)}`)
                    document.getElementById(`countIsN${i}S0_fpe`).style.width = (countIsNxS0_fpe / countIsNxS0_fpe * 100) + '%';
                    document.getElementById(`countIsN${i}S0_fpe`).innerHTML = `FPE : ${countIsNxS0_fpe}`
                    document.getElementById(`countIsN${i}S0_sig`).setAttribute('aria-valuenow',  `${(countIsNxS0_sig / countIsNxS0_fpe * 100).toFixed(0)}`)
                    document.getElementById(`countIsN${i}S0_sig`).style.width = (countIsNxS0_sig / countIsNxS0_fpe * 100) + '%';
                    document.getElementById(`countIsN${i}S0_sig`).innerHTML = `SIG : ${countIsNxS0_sig}`
                    document.getElementById(`ptg_countIsN${i}S0`).innerHTML =`Etablissements géolocalisés : ${ (countIsNxS0_sig / countIsNxS0_fpe * 100).toFixed(0) } %`
                }

                //ecole privée
                document.getElementById('countIsS1_fpe').setAttribute('aria-valuenow', `${(countIsS1_fpe / countIsS1_fpe * 100).toFixed(0)}`)
                document.getElementById('countIsS1_fpe').style.width = (countIsS1_fpe / countIsS1_fpe * 100) + '%';
                document.getElementById('countIsS1_fpe').innerHTML = `FPE : ${countIsS1_fpe}`
                document.getElementById('countIsS1_sig').setAttribute('aria-valuenow',  `${(countIsS1_sig / countIsS1_fpe * 100).toFixed(0)}`)
                document.getElementById('countIsS1_sig').style.width = (countIsS1_sig / countIsS1_fpe * 100) + '%';
                document.getElementById('countIsS1_sig').innerHTML = `SIG : ${countIsS1_sig}`
                document.getElementById('ptg_countIsS1').innerHTML =`Etablissements géolocalisés : ${ (countIsS1_sig / countIsS1_fpe * 100).toFixed(0) } %`


                loadingOverlay.style.display = "none";
            })

            .catch(error => {
                console.error('populateDataTableEtablissement::Une erreur s\'est produite :', error)
                loadingOverlay.style.display = "none";
            }
        )
    }

    // boutton filtre data etablissement
    document.querySelector('#btn-filter').addEventListener('click', async (event) => {
        const dren = document.getElementById("liste-dren").value;
        const cisco = document.getElementById("liste-cisco").value;
        const zap = document.getElementById("liste-zap").value;
        if(dren == 0 && cisco == 0 && zap == 0 ){ return }
        populateDataTableEtablissement(dren,cisco,zap)
    })




    //Onglet SIG

    var map
    var tempEtabAddedSig = []
    var DataVillageSig

    
    var positionMarker = null // pour deplacement sur carte vers etab
    var dataEtabNonPointe = [] //tableau des données etablissement sans coordonnees
    var dataEtabPointe = [] //tableau des données etablissement avec coordonnees
    var tableListeEtab = $('#dataTable-sig').DataTable() //dataTable liste etab dans sig
    var tableEtabAdd = $('#tableEtabAdd').DataTable({lengthChange: false,searching: false}) //dataTable filtre ajout etab dans sig
    var availableEtab // toutes les etablissements fpe joint avec sig


    // LayerGroup pour les etab par niveau et par secteur
    var allMarkersGroup = L.layerGroup() // Global Layer
    // var layerGroup_n0s0 = L.layerGroup() // Niveau presco Secteur Public
    // var layerGroup_n1s0 = L.layerGroup() // Niveau primaire Secteur Public Public
    // var layerGroup_n2s0 = L.layerGroup() // Niveau college Secteur Public Public
    // var layerGroup_n3s0 = L.layerGroup() // Niveau lycee Secteur Public Public
    // var layerGroup_n0s1 = L.layerGroup() // Niveau presco Secteur Privee
    // var layerGroup_n1s1 = L.layerGroup() // Niveau primaire Secteur Public Privee
    // var layerGroup_n2s1 = L.layerGroup() // Niveau college Secteur Public Privee
    // var layerGroup_n3s1 = L.layerGroup() // Niveau lycee Secteur Public Privee
    // // layer Buffer pour les zone de recrutement
    // // var aireGroup_n0s0 = L.layerGroup() // aire presco Secteur Public
    // // var aireGroup_n1s0 = L.layerGroup() // aire primaire Secteur Public Public
    // // var aireGroup_n2s0 = L.layerGroup() // aire college Secteur Public Public
    // // var aireGroup_n3s0 = L.layerGroup() // aire lycee Secteur Public Public
    // // var aireGroup_n0s1 = L.layerGroup() // aire presco Secteur Privee
    // // var aireGroup_n1s1 = L.layerGroup() // aire primaire Secteur Public Privee
    // // var aireGroup_n2s1 = L.layerGroup() // aire college Secteur Public Privee
    // // var aireGroup_n3s1 = L.layerGroup() // aire lycee Secteur Public Privee

    var CurrentBonds = null

    //sahpe file
    var shp_dren = null
    var shp_cisco = null
    var shp_commune = null

    // Tableau de noms de groupe d'aires et de noms de couche d'établissement
    const aireGroupNames = ['aireGroup_n0s0', 'aireGroup_n1s0', 'aireGroup_n2s0', 'aireGroup_n3s0', 'aireGroup_n0s1', 'aireGroup_n1s1', 'aireGroup_n2s1', 'aireGroup_n3s1'];
    const etablissementGroupNames = ['layerGroup_n0s0', 'layerGroup_n1s0', 'layerGroup_n2s0', 'layerGroup_n3s0', 'layerGroup_n0s1', 'layerGroup_n1s1', 'layerGroup_n2s1', 'layerGroup_n3s1'];
    
    // Créez les groupes d'aires et ajoutez-les au tableau aireGroups
    for (const groupName of aireGroupNames) {
        window[groupName] = new L.layerGroup() // Créez un nouveau groupe d'aires
    }
    for (const groupName of etablissementGroupNames) {
        window[groupName] = new L.layerGroup() // Créez un nouveau groupe d'aires
    }

    // Fonction générique pour ajouter une couche à un groupe d'aires et à un groupe d'établissement
    function addToGroups(layer, aireGroupIndex, etablissementGroupIndex) {
        window[aireGroupNames[aireGroupIndex]].addLayer(layer);
        window[etablissementGroupNames[etablissementGroupIndex]].addLayer(layer);
    }
    

    // table tous etab dans fpe et sig 
    function populateDataTableSig(dren,cisco) {
        var loadingOverlay = document.getElementById("loading-overlay")
        loadingOverlay.style.display = "flex";

        //vider les layerGroup avant de remplir
        clearLayerGroup()
        dataEtabPointe = []
        dataEtabNonPointe = []

        tempEtabAddedSig = []


        fetch(`/fpe/etablissement/liste?dren=${dren}&cisco=${cisco}&zap=0`)
            .then(response => response.json())
            .then(data => {
                /**
                 * cisco: 105 code : 105030001 commune : 10503 dren : 11 fokontany : 1050303 id : 2513 is_college : 1 is_eec : 0 is_lycee : 0 * is_presco : 0 is_primaire : 0 is_privee : 0 is_rurale : 1 n_cisco : "AMBOHIDRATRIMO" n_dren : "ANALAMANGA" n_zap : "AMBOHIDRATRIMO" name : "CEG AMBOHIDRATRIMO" village : "1050303@ANTSIMOMPARIHY"
                 * zap : 10503
                 */
                tableListeEtab.clear().draw()
                data.forEach(item => {
                    
                    properties = {code:item.code,name:item.name}

                    niveau = (item.is_lycee == 1)?'Lycée':(item.is_college == 1)?'College':(item.is_primaire == 1)?'Primaire': 'Préscolaire' //pour affichage table
                    nv = (item.is_lycee == 1)?3:(item.is_college == 1)?2:(item.is_primaire == 1)?1:0

                    secteur = (item.is_privee == 1)?'Privée': 'Public'
                    coords = (item.lat == 0 || item.lng == 0)? 'N/D' : `${item.lat}, ${item.lng}`
                    //tableListeEtab.row.add([item.n_zap, item.code, item.name, niveau,secteur, coords]).draw()
                    
                    //creation marker etablissement et layer group
                    if(item.lat != 0 && item.lng != 0){
                        
                        coords = [item.lat, item.lng];
                        cls = (item.is_privee == 1)?'text-error':'text-primary'
                        var marker = L.marker(coords,{
                            properties : properties,
                            icon:new L.DivIcon({
                                className: 'custom-icon',
                                html: `<div class="js-div-marker-etab" style="display:flex,width:200px" data-name="${item.name}" data-code="${item.code}"><i class="fa fa-bullseye fa-2x ${cls}"></i><span class="label-etab">${item.name}</span></div>`
                            }),
                        })
                        allMarkersGroup.addLayer(marker) //tous les etab avec coordonnees
                        rayon = item.is_lycee == 1 ? 50 : item.is_college == 1 ? 5 : 2
                        color = item.is_lycee == 1 ? 'red' : item.is_college == 'yellow' ? 5 : 'blue'
                        var airePoint = turf.point([item.lng, item.lat]);
                        var buffer = turf.buffer(airePoint, rayon, { units: 'kilometers' })
                        var bufferPolygon = L.geoJSON(buffer);
                        bufferPolygon.setStyle({
                            color: color, 
                            fillColor: 'blue', 
                            fillOpacity: 0.01, 
                        })

                        //layer group _etablissement public
                        // if(item.is_privee == 0){
                        //     if(item.is_presco == 1){
                        //         layerGroup_n0s0.addLayer(marker);
                        //         aireGroup_n0s0.addLayer(bufferPolygon)
                        //     }
                        //     if(item.is_primaire == 1){
                        //         layerGroup_n1s0.addLayer(marker);aireGroup_n1s0.addLayer(bufferPolygon)}
                        //     if(item.is_college == 1){layerGroup_n2s0.addLayer(marker);aireGroup_n2s0.addLayer(bufferPolygon)}
                        //     if(item.is_lycee == 1){layerGroup_n3s0.addLayer(marker);aireGroup_n3s0.addLayer(bufferPolygon)} 
                        // }else{ //layer group _etablissement privee
                        //     if(item.is_presco == 1){layerGroup_n0s1.addLayer(marker);aireGroup_n0s1.addLayer(bufferPolygon)}
                        //     if(item.is_primaire == 1){layerGroup_n1s1.addLayer(marker);aireGroup_n1s1.addLayer(bufferPolygon)}
                        //     if(item.is_college == 1){layerGroup_n2s1.addLayer(marker);aireGroup_n2s1.addLayer(bufferPolygon)}
                        //     if(item.is_lycee == 1){layerGroup_n3s1.addLayer(marker);aireGroup_n3s1.addLayer(bufferPolygon)} 
                        // }


                        if (item.is_privee === 0) {
                            if (item.is_presco === 1) {
                                addToGroups(marker, 0, 0);
                                addToGroups(bufferPolygon, 0, 0);
                            }
                            if (item.is_primaire === 1) {
                                addToGroups(marker, 1, 1);
                                addToGroups(bufferPolygon, 1, 1);
                            }
                            if (item.is_college === 1) {
                                addToGroups(marker, 2, 2);
                                addToGroups(bufferPolygon, 2, 2);
                            }
                            if (item.is_lycee === 1) {
                                addToGroups(marker, 3, 3);
                                addToGroups(bufferPolygon, 3, 3);
                            }
                        } else { // Établissement privé
                            if (item.is_presco === 1) {
                                addToGroups(marker, 0, 4);
                                addToGroups(bufferPolygon, 0, 4);
                            }
                            if (item.is_primaire === 1) {
                                addToGroups(marker, 1, 5);
                                addToGroups(bufferPolygon, 1, 5);
                            }
                            if (item.is_college === 1) {
                                addToGroups(marker, 2, 6);
                                addToGroups(bufferPolygon, 2, 6);
                            }
                            if (item.is_lycee === 1) {
                                addToGroups(marker, 3, 7);
                                addToGroups(bufferPolygon, 3, 7);
                            }
                        }
                        dataEtabPointe.push(item)
                    }else{
                        dataEtabNonPointe.push(item)
                    }
                    
                })

                document.getElementById("loading-overlay").style.display = "none";
                $(document).on("click",".js-div-marker-etab", function(event){
                    event.preventDefault()
                    code = $(this).data('code')
                    nom = $(this).data('name')
                    Swal.fire("Information !",`Code:${code}<br/>Nom:${nom}`,"info")
                })

                //appel construction MAP
                initMap()

                // Sélectionnez etablissment dans table etab pour ajout
                $(document).on('click', '#tableEtabAdd tbody tr', function () {
                    $('#dataTable-sig tbody tr.selected').removeClass('selected')
                    $(this).addClass('selected')
                    var rowData = tableEtabAdd.row(this).data()
                    $("#nom-etab").val(rowData[1].trim())
                    $("#code-etab").val(rowData[0])
                    filterTable()
                })

            })
            .catch(error => {
                console.error('populateDataTableSig::Une erreur s\'est produite :', error)
                document.getElementById("loading-overlay").style.display = "none";
            }
        )
    }

    function updateListeEtabNonPointe(){
        tableEtabAdd.clear().draw()
        dataEtabNonPointe.forEach(item => {
            if (!tempEtabAddedSig.includes(parseInt(item.code))) {
                niveau = (item.is_lycee == 1)?'Lycée':(item.is_college == 1)?'College':(item.is_primaire == 1)?'Primaire': 'Préscolaire'
                secteur = (item.is_privee == 1)?'Privée': 'Public'
                tableEtabAdd.row.add([item.code, item.name, niveau,secteur, item.n_zap]).draw()
            }
            
        })
    }

    // Fonction pour filtrer le tableau en fonction du nom dans la formulaire ajout etablissement
    function filterTable() {
        filter = document.getElementById("nom-etab").value.toLowerCase()
        tableEtabAdd.clear().draw()
        dataEtabNonPointe.forEach(item => {
            if ((item.name.toLowerCase().indexOf(filter) > -1) && (!tempEtabAddedSig.includes(item.code))) {
                niveau = (item.is_lycee == 1)?'Lycée':(item.is_college == 1)?'College':(item.is_primaire == 1)?'Primaire': 'Préscolaire'
                secteur = (item.is_privee == 1)?'Privée': 'Public'
                tableEtabAdd.row.add([item.code, item.name, niveau,secteur, item.n_zap]).draw()
            }
            
        })
    }
    // Ajoutez un écouteur d'événements pour détecter les changements dans la zone de texte
    document.getElementById("nom-etab").addEventListener("input", filterTable)




    // initialisation et configuration des cartes ainsi que les couches 
    function initMap(){
        // Script Leaflet pour initialiser la carte
        document.getElementById("div-map").innerHTML = "<div id='map' style='height:100vh'></div>"
        const selectDren = document.getElementById("liste-dren-sig")
        const NOM_DREN = selectDren.options[selectDren.selectedIndex].text.split("/")[0].trim()
        const CODE_DREN = parseInt(selectDren.options[selectDren.selectedIndex].text.substr(-2))

        const selectCisco = document.getElementById("liste-cisco-sig")
        const NOM_CISCO= selectCisco.options[selectCisco.selectedIndex].text.split("/")[0].trim()
        const CODE_CISCO = parseInt(selectCisco.options[selectCisco.selectedIndex].text.substr(-3))

        const opts = {fullscreenControl: true,fullscreenControlOptions: {title:"Mode Plein ecran!",titleCancel:"Quitter mode plein ecran"}}
        map = L.map('map',opts).setView([-18.9189596,47.5135653], 6) //map

        map.scrollWheelZoom.disable()
        L.control.scale().addTo(map)

        var DEFAULT_LAYER = L.tileLayer('', {maxZoom: 22,attribution: '© MEN/DPE'})
        var OSM_LAYER = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 22,attribution: '© OpenStreetMap'})

        const MyBingMapsKey = "AoRRWTdH7LrGGJlY4xtYjYTKVG6_BZTlBN6lww8bkB_pl0Ur3drAa91fnvix-Aqn"
        //-18.91891771052786, lng: 47.51385211944581
        var IMAGERY_LAYER = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {maxZoom: 22, attribution: '&copy; Esri'})
        var BING_LAYER = L.tileLayer.bing(MyBingMapsKey,{type: "CanvasDark"})

        const Layer = {
            "DEFAULT" : DEFAULT_LAYER,
            "OSM" : OSM_LAYER,
            "IMAGERY" : IMAGERY_LAYER,
            "BING": BING_LAYER
        };
        //     end of tile provider
        DEFAULT_LAYER.addTo(map)

        map.flyTo([-18.91891771052786,47.51385211944581],6)

        //zoom control ahafahana mijery ny niveau de zoom rehefa hanao pointage
        const ZoomViewer = L.Control.extend({
            onAdd() {
                const container = L.DomUtil.create('div')
                const gauge = L.DomUtil.create('div', 'text-primary')
                container.style.width = '200px';
                container.style.background = 'rgba(255,255,255,0.5)';
                container.style.textAlign = 'left';
                map.on('zoomstart zoom zoomend', (ev) => {gauge.innerHTML = `Niveau de Zoom: ${map.getZoom()}`})
                container.appendChild(gauge)
                return container;
            }
        }) // ZoomViewer
        const zoomViewerControl = (new ZoomViewer({position: 'topright'})).addTo(map)

        // control localite map view
        L.Control.LocaliteControl = L.Control.extend({
            onAdd: function(map) {
            var el = L.DomUtil.create('div', 'leaflet-bar localite-control fa fa-2x')
            el.innerHTML = (!isNaN(CODE_CISCO))?`CISCO ${NOM_CISCO}`:`DREN ${NOM_DREN}`;
            return el;
            },
            onRemove: function(map) {/* Nothing to do here */}
        })
        L.control.myControl = function(opts) {
            return new L.Control.LocaliteControl(opts)
        }
        L.control.myControl({position: 'topright'}).addTo(map)
        $(".localite-control").css({"background":"#fff","padding":"5px"})

        shp_dren = null
        shp_cisco = null
        shp_commune = null

        //les styles 

        const regionStyle = {
            fillOpacity: 0.1,        // Opacité du remplissage
            color: '#00bbaa',          // Couleur de la bordure
            weight: 3                // Épaisseur de la bordure
        };
        
        // Style pour les districts (districts)
        const districtStyle = {
            fillOpacity: 0.1,          // Opacité du remplissage
            color: '#00aa00',            // Couleur de la bordure
            weight: 2                  // Épaisseur de la bordure
        };
        // Style pour les districts (districts)
        const communeStyle = {
            fillOpacity: 0.1,          // Opacité du remplissage
            color: '#aaaaaa',            // Couleur de la bordure
            weight: 1                  // Épaisseur de la bordure
        };

        function customPointToLayer(coords) {
            return L.circleMarker(coords, {
                radius: 10,
                fillColor: '#a00',
                color: '#000',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            })
        }
        // drenGeojson efa azo avy am base.twig
        shp_dren = L.geoJson(drenGeojson , {
            contextmenu:false,
            style : regionStyle,
            onEachFeature: (feature,layer)=>{ // action atao isaky ny feature
                layer.bindTooltip(feature.properties.REGION_NAM, {permanent: false, opacity: 0.5}),
                layer.on({
                    click:(e)=>{map.fitBounds(e.target.getBounds())},
                    mouseOver:(e)=>{layer.setStyle({color: 'red'})},
                    mouseOut:(e)=>{shp_dren.resetStyle(e.target)}
                })
            },
            filter: (feature)=>{
                return (parseInt(feature.properties.R_CODE) == CODE_DREN)
            }
        })

        // ciscoGeojson efa azo avy am base.twig
        shp_cisco = L.geoJson(ciscoGeoJson  , {
            contextmenu:true,
            style: districtStyle,
            onEachFeature: (feature,layer)=>{ // action atao isaky ny feature
                layer.bindTooltip(`CISCO ${feature.properties.cisco}`, {permanent: false, opacity: 0.5}),
                layer.on({
                    contextmenu:(e)=>{
                        new Contextual({
                            isSticky: false,
                            items: [
                                {label: 'Zoom +', onClick: () => {map.setZoom(map.getZoom() + 0.5)}},
                                {label: 'Zoom -', onClick: () => {map.zoomOut()}},
                                {type: 'seperator'},
                                {label: 'Aller vers cet endroi +', onClick: () => {centerMap(e)}}
                            ]
                        })
                    }
                })
            },
            filter: (feature)=>{
                return (!isNaN(CODE_CISCO))?(parseInt(feature.properties.code_cisco) == CODE_CISCO): (parseInt(feature.properties.code_dren)==CODE_DREN)
            }
        })


        // communeGeojson efa azo avy am base.twig
        shp_commune = L.geoJson(communeGeoJson , {
            contextmenu: (USER_DATA.CODE_LOCALITE === CODE_CISCO)?true:false,
            style : communeStyle,
            pointToLayer : customPointToLayer,
            onEachFeature: (feature,layer)=>{ // action atao isaky ny feature
                layer.bindTooltip(feature.properties.commune_na, {permanent: false, opacity: 0.8}),
                layer.on({
                    contextmenu:(e)=>{
                        $("#js-latitude").val(e.latlng.lat)
                        $("#js-longitude").val(e.latlng.lng)
                        new Contextual({
                            isSticky: false,
                            items: [
                                {label: 'Geolocaliser Etablissement', onClick: () => {
                                    if(USER_DATA.CODE_LOCALITE !== CODE_CISCO){
                                        Swal.fire("Attention !","Cette action est réservée exclusivement aux responsables de la zone.","error")
                                        return
                                    }
                                    if (map.getZoom() < 15){
                                        Swal.fire("Attention!"," Le niveau de zoom est trop bas. Le zoom minimum autorisé est de 16.","warning")
                                        return
                                    }
                                    updateListeEtabNonPointe()
                                    openFormAddEtab()

                                }},
                                {label: 'Geolocaliser Village', onClick: () => {
                                    if(USER_DATA.CODE_LOCALITE !== CODE_CISCO){
                                        Swal.fire("Attention !","Cette action est réservée exclusivement aux responsables de la zone.","error")
                                        return
                                    }                                    
                                    if (map.getZoom() < 15){
                                        Swal.fire("Attention!"," Le niveau de zoom est trop bas. Le zoom minimum autorisé est de 16.","warning")
                                        return
                                    }
                                    //openFormVillage(feature.properties.code_cisco)
                                }},
                                {type: 'seperator'},
                                {label: 'Zoom +', onClick: () => {map.setZoom(map.getZoom() + 0.5)}},
                                {label: 'Zoom -', onClick: () => {map.zoomOut()}},
                                {label: 'Aller vers cet endroi +', onClick: () => {centerMap(e)}},
                            ]
                        })
                    }
                })
            },
            filter: (feature)=>{
                return (!isNaN(CODE_CISCO))?(parseInt(feature.properties.code_cisco) == CODE_CISCO): (parseInt(feature.properties.code_dren)==CODE_DREN)
            }
        })


        //affichage sur map
        if(!isNaN(CODE_CISCO) && CODE_CISCO > 100 ){
            shp_cisco.addTo(map)
            shp_commune.addTo(map)
            CurrentBonds = shp_cisco.getBounds()
            map.fitBounds(CurrentBonds)

        }else{
            shp_dren.addTo(map)
            shp_cisco.addTo(map)
            shp_commune.addTo(map)
            CurrentBonds = shp_dren.getBounds()
            map.fitBounds(CurrentBonds)
        }
        
        //Objet control des affichages des layers group
        var overlayMaps = {
            "Préscolaire Public": window['layerGroup_n0s0'],
            "Préscolaire Privé": window['layerGroup_n0s1'],
            "Primaire Public": window['layerGroup_n1s0'],
            "Primaire Privé": window['layerGroup_n1s1'],
            "Collège Public": window['layerGroup_n2s0'],
            "Collège Privé": window['layerGroup_n2s1'],
            "Lycée Public": window['layerGroup_n3s0'],
            "Lycée Privé": window['layerGroup_n3s1'],
        }
        
        L.control.layers(Layer, overlayMaps,{ position: 'topright',collapsed: false }).addTo(map)
        showLayerGroup()
        //bouton por reinitialiser la map
        const btnInit  = L.easyButton('fa-crosshairs fa-lg', function(btn, map){
            if(shp_dren){shp_dren.remove()}
            if(shp_cisco){shp_cisco.remove()}
            if(shp_commune){shp_commune.remove()}

            //affichage sur map
            if(!isNaN(CODE_CISCO) && CODE_CISCO > 100 ){ //si carte cisco
                shp_cisco.addTo(map)
                shp_commune.addTo(map)
            }else{ // si carte dren
                shp_dren.addTo(map)
                shp_cisco.addTo(map)
                shp_commune.addTo(map)
            }
            map.fitBounds(CurrentBonds)
            
            // decoche et reaffiche les markers
            //clearLayerGroup()
            showLayerGroup()
            map.setZoom(9)
            if(positionMarker){positionMarker.remove()}
        },'Reinitialiser','btn-map-init')
        btnInit.addTo(map)
        document.getElementById("btn-map-init").style.width = "30px";
        document.getElementById("btn-map-init").style.height = "30px";
        
        //control fond de carte 
        //var CONTROL_FOND = L.control.layers(Layer).addTo(map)
        //CONTROL_FOND.setPosition('topleft')
        availableEtab = [...dataEtabNonPointe, ...dataEtabPointe]
        //console.log(dataEtabNonPointe.length,dataEtabPointe.length,availableEtab.length)


        // Créez un contrôle personnalisé en étendant L.Control
        var customControleSearch = L.Control.extend({
            onAdd: function(map) {
                var container = L.DomUtil.create('div', 'leaflet-control-custom')
                container.innerHTML = `
                    <div class="row" id="search-control">
                        <div class="col-lg-4">
                            <div class="form-group">
                                <div class="input-group">
                                    <span class="input-group-addon">
                                        <i id="search-icon" class="fa fa-search"></i>
                                    </span>
                                    <select class="form-control rounded-right" id="listEtab" style="width:100%"></select>
                                </div>
                            </div>
                        </div>
                    </div>
                `
                L.DomEvent.disableClickPropagation(container)
                return container;
            }
        })
        var customControlInstance = new customControleSearch({ position: 'topleft' }).addTo(map)
        //remplissage select option
        availableEtab.forEach(function(item) {
            if (item.hasOwnProperty('name') && item.hasOwnProperty('code')) {
                //listeEtab.push(`${item.code} / ${item.name}`)
                $("#listEtab").append($('<option>', {
                    value: `${item.code}`,
                    text: `${item.code} / ${item.name}`
                }))
            }
        })

        //pour recherche et allez vers un etablissement
        $('#listEtab').select2({
            placeholder: 'Rechercher un établissement par code ou nom'
        })
        $(".select2-container").css("z-index", 999999999) 

        $("#listEtab").on("change",function(){
            const code = $(this).val() //selectedValue.match(/(\d+)\s*\/\s*/)
            etab = searchCodeEtabInJSON(code)
            lat = parseFloat(etab.lat)
            lng = parseFloat(etab.lng)
            if (lat == 0 || lng == 0){console.log("non geolocalisé")}
            else{
                if(positionMarker){ positionMarker.remove() }
                positionMarker = L.circle([lat, lng], {
                    radius: 500, //metres
                    color: 'red', 
                    fillColor: 'green', 
                    fillOpacity: 0 
                })
                positionMarker.bindPopup(etab.name.trim()).openPopup()
                positionMarker.addTo(map)
                map.flyTo([lat, lng], 13)
            }
        })

        map.on('enterFullscreen', function(){
            $(".select2-container").css("z-index", 999999) 
            $(".leaflet-container").css("z-index", 0) 
            $('#listeEtab').select2('update')
            reduceMapZIndex()
		})
		map.on('exitFullscreen', function(){
            $(".select2-container").css("z-index", 999) 
            $(".leaflet-container").css("z-index", 9999) 
            $('#listeEtab').select2('update')
			restoreMapZIndex()
		})

        map.on('zoomend', function() {
            var currentZoom = map.getZoom()
            //var labelElements = document.querySelectorAll('.label-etab')
            if (currentZoom < 10) {
                $(".label-etab").css("font-size","0px")
            }
            if (currentZoom >= 10 && currentZoom <= 12) {
                $(".label-etab").css("font-size","8px")
            }
            if (currentZoom > 12 && currentZoom <= 14) {
                $(".label-etab").css("font-size","10px")
            }
            if (currentZoom > 14 ) {
                $(".label-etab").css("font-size","12px")
            }
        })    
        

        const aireControlDOM = L.Control.extend({
            options: {position: 'topright'},
            onAdd: function (map) {
                const container = L.DomUtil.create('div', 'custom-control');
                const checkbox = L.DomUtil.create('input', 'custom-control-checkbox', container);
                checkbox.type = 'checkbox';
                checkbox.id = 'aire-checkbox'; // ID de la case à cocher
                checkbox.checked = false; // Coché par défaut ou non
                checkbox.addEventListener('change', function () {
                    const isChecked = checkbox.checked
                    let hasLayer = false
                    for (let n = 0; n < 4; n++) {
                        for (let s = 0; s < 2; s++) {
                            var groupName = `aireGroup_n${n}s${s}`
                            const bufferLayer = window[groupName]
                            if (bufferLayer && map.hasLayer(bufferLayer)) {
                                if (isChecked) {
                                    bufferLayer.addTo(map);
                                } else {
                                    bufferLayer.remove();
                                }
                                hasLayer = true;
                            }
                        }
                    }
                    if (!hasLayer && isChecked) {
                        Swal.fire("Attention!", " Veuillez afficher au moins un groupe d'établissement", "warning");
                        $(this).prop("checked", false);
                    }
                })
                const label = L.DomUtil.create('label', 'custom-control-label', container);
                label.innerHTML = 'Aire';
                L.DomEvent.disableClickPropagation(container);
                return container;
            },
        })
        var aireControl = new aireControlDOM().addTo(map)

    } // mapInit()

    // recherche etab dans donnees etablissements par son code
    const searchCodeEtabInJSON = function (code) {
        res = null
        availableEtab.forEach(function (item) {
            if (parseInt(item.code) == parseInt(code)) {
                etab = {name:item.name,lat:item.lat,lng:item.lng}
                res = etab
                return
            }
        })
        return res;
    }

    //affichage des layersgroup pour etab
    const showLayerGroup = function (){
        for (let n = 0; n < 4; n++) {
            for (let s = 0; s < 2; s++) {
                const layerGroup = window[`layerGroup_n${n}s${s}`]
                if (layerGroup) {
                    layerGroup.eachLayer(function (marker) {
                        //ajouterMenuContextuel(marker, map)
                    })
                    layerGroup.remove()
                    layerGroup.addTo(map)
                }
            }
        }
    }

    const clearLayerGroup = function(){
        for (let n = 0; n < 4; n++) {
            for (let s = 0; s < 2; s++) {
                const layerGroup = window[`layerGroup_n${n}s${s}`]
                if (layerGroup) {
                    layerGroup.clearLayers()
                }
            }
        }
        allMarkersGroup.clearLayers()
    }

    // boutton filtre data etablissement
    document.querySelector('#filter-sig').addEventListener('click', async (event) => {
        const dren = document.getElementById("liste-dren-sig").value;
        const cisco = document.getElementById("liste-cisco-sig").value;
        if(dren == 0){ return }
        populateDataTableSig(dren,cisco)
    })

    // enrigestrer les donnees sig
    document.querySelector('#btn-save-sig').addEventListener("click", function () {
        const code = document.getElementById("code-etab").value;
        const longitude = parseFloat(document.getElementById("js-longitude").value)
        const latitude = document.getElementById("js-latitude").value;

        if(code.length != 9){alert("Veuillez séléctionner un établissement à géolocaliser"); return }
        if(latitude.length < 5){alert("Veuillez séléctionner un établissement à géolocaliser"); return }

        data = { code,longitude,latitude }
        fetch("/sig/save-etab-sig", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data) 
        })
        .then(response => response.json())
        .then((data) => {
            tempEtabAddedSig.push(parseInt(code))
            const marqueur = L.marker([latitude, longitude], {
                icon: L.icon({
                    iconUrl: '../../assets/images/marker-icon.png', // URL de l'icône verte
                    iconSize: [32, 32], // Taille de l'icône
                }),
            }).addTo(map)
            marqueur.bindPopup(code).openPopup()
            $("#modal-add-etab").modal("hide")
            cls = (data.status == '1')?"success":"error"
            Swal.fire("Enregistrement",data.message,cls)
        }).catch((error) => {console.error("Save Sig", error)})
        })

    const showCoordinates = function(e) {
        alert(e.latlng)
    }

    const centerMap = function(e) {
        map.flyTo(e.latlng ,14)
    }

    // Fonction pour réduire le z-index de la carte
    function reduceMapZIndex() {
        map.getContainer().style.zIndex = '1'; // Réduisez le z-index de la carte
    }

    // Fonction pour restaurer le z-index de la carte
    function restoreMapZIndex() {
        map.getContainer().style.zIndex = 'auto'; // Restaurez le z-index par défaut
    }


    const openFormAddEtab = function(){
        $("#modal-add-etab").modal("show")
        $("#code-etab").val("")
    }

    const openFormEditEtab = function(){
        $("#modal-add-etab").modal("show")
    }
})

