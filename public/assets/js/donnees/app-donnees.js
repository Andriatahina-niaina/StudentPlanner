document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('form-add-file').addEventListener('submit', function(event) {
        event.preventDefault()
        var nom = document.getElementById('nom').value
        var description = $("#description").val()
        var annee = $("#year").val()
        const file = $('#file')[0].files[0] // Récupérer le premier fichier sélectionné
        const formData = new FormData()
        formData.append('nom', nom)
        formData.append('description', description)
        formData.append('annee', annee)
        formData.append('file', file)
        const url = $("#form-add-file").attr("action")
        $.ajax({
            type: "POST", 
            url: url,
            cache: false,
            processData: false,
            contentType: false,
            data: formData,
            beforeSend: function () {
                loadingOverlay.style.display = "flex"
            },
            success:function (response) {
                loadingOverlay.style.display = "none"
                if(response){
                    if(response.status == "1"){Swal.fire("Enregistrement réussi!","Les données ont été enregistrées avec succès.","success")}
                    else{ Swal.fire({icon: 'error',text: response.message})}
                }
                $("#modalAddFile").modal("hide")
            },
            error:function (http_error) {
                let server_msg = http_error.responseText
                let code_label = http_error.statusText
                Swal.fire({icon: 'error',title: `Une erreur est survenue,(${code_label})`, text: `${server_msg}`})
                console.log(`Save Data :\nError Code : ${code_label} , \t ${server_msg}`)
                loadingOverlay.style.display = "none"
                $("#modalAddFile").modal("hide")
            }
        })
    })

    const loadFile = ()=>{
        annee = $("#filtre-annee").val()
        keyword = $("#filtre-keywords").val()

        loadingOverlay.style.display = "none"
        fetch(`/donnees/liste?annee=${annee}&keyword=${keyword}`)
            .then(response => response.json())
            .then(data => {
                var table = $('#tableData').DataTable({destroy: true, searching :false})
                table.clear().draw()
                tr=""
                data.forEach(item => {
                    var ajoutDate = moment(item.createdAt.date).tz(item.createdAt.timezone).format('DD/MM/YYYY HH:mm')
                    var source = (item.localite==0)?item.username:((item.localite<69)?`DREN ${item.username}`:`CISCO ${item.username}`)
                    cls = (item.isValid)?"":"bg-warning"
                    tr += `<tr class='row-data ${cls}' data-id='${item.id}' data-link='${item.link}' data-valid='${item.isValid}'>`
                    tr += ` <td>${item.name}</td>`
                    tr += ` <td>${item.description}</td>`
                    tr += ` <td align='right'>${item.annee}</td>`
                    tr += ` <td align='right'>${ajoutDate}</td>`
                    tr += ` <td>${source}</td>`
                    tr += ` <td align='center'><a href='../../uploads/donnees/${item.link}' id='down-${item.id}'><img src='../../assets/images/download.png' width='100' height='36'/></a></td>`
                    tr += `</tr>`
                })
                $("#tableData tbody").html(tr)
                loadingOverlay.style.display = "none"

                $(document).on('contextmenu','.row-data', function(event) {
                    event.preventDefault();
                    id = $(this).data('id')
                    file = `${$(this).data('link')}`
                    down_name = $(this).data('link')
                    valid =  $(this).data('valid')
                    new Contextual({
                        isSticky: false,
                        items: [
                            { label: 'Télécharger', onClick: function() {
                                $(`#down-${id}`).click();
                            }, shortcut: 'Ctrl+A' },
                            { type: 'seperator' },
                            { label: 'Valider / Invalider', onClick: function() {
                                if(valid){}
                                else{}
                            }, shortcut: 'Ctrl+A' },
                        ]
                    });
                });
            })
            .catch(error => {
                console.error('Liste Donnees : Une erreur s\'est produite :', error)
                loadingOverlay.style.display = "none"}
            )

    }
    loadFile()
    document.getElementById('btn-filtre').addEventListener('click', function(event) {
        loadFile()
    })

    document.getElementById('filtre-keywords').addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
            loadFile()
        }
    });
})

// Fonction pour télécharger un fichier au clic sur un bouton
const telechargerFichier =  (contenuFichier, link) => {
    var blob = new Blob([contenuFichier], { type: 'application/octet-stream' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = link

    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
}