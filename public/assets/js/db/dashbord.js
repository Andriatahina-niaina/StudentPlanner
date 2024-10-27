// Écouteur d'événement ou fonction qui déclenche l'appel
function updateChartWithNiveau(niveau) {
    fetch(`/comparaison-etab?niveau=${niveau}`)
        .then(response => response.json())
        .then(data => {
            config = {
                data: data,
                xkey: 'name',
                ykeys: ['nbr_s0', 'nbr_s1'],
                labels: ['Public', 'Privée'],
                fillOpacity: 0.6,
                behaveLikeLine: true,
                resize: true,
                pointFillColors:['#ffffff'],
                pointStrokeColors: ['black'],
                lineColors:['gray','red'],
                gridTextSize : 10,
                xLabelAngle: 45
            };
            config.element = 'bar-chart';
            config.stacked = true;
            document.querySelector('#bar-body').innerHTML = "<div id='bar-chart'></div>";
            Morris.Bar(config);
        })
        .catch(error => {
            console.error('Une erreur s\'est produite :', error);
        });
}

// evenement onChange select niveau
document.querySelector('#slc-niveau').addEventListener('change', async (event) => {
    const niveau = event.currentTarget.value;
    updateChartWithNiveau(niveau);
});

// declenchement pardefaut pour niveau prescolaire au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const selectElement = document.querySelector('#slc-niveau');
    const event = new Event('change', { niveau: 0 });
    selectElement.dispatchEvent(event);
})
