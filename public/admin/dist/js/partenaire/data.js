$(document).ready(function(){
    var table = $("#table-partenaire").DataTable({
		dom: 'Blfrtip',
		responsive: true, 
		lengthChange: false, 
		autoWidth: false,
		buttons: ["excel", "pdf", "print"]
	  });
	table.buttons().container().appendTo($("#control"));
	//alert($(".btn-group").length)
	//$(".btn-group").append("<button class='btn btn-primary buttons-html5' tabindex='0' type='button'><span>Ajouter</span>");
	$('.tipso_part').tipso({
		animationIn: '',
		animationOut: '',
		tooltipHover: true,
		delay  : 400,
	});

});

