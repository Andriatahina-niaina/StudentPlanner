$().ready(function() {

    $.blockUI.defaults.message = "<i class='fa fa-spinner fa-spin'></i><small>&nbsp; Traitement en cours...</small>"
    //$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
    $(window).on('beforeunload', function(){$.blockUI();});
	
    // validation alphanumerique
    $(document).on("keypress",".alpha-num",function(e){
        e.preventDefault()
        let code = e.keyCode || e.which; // 65-90 + 97 -12 + 32 + 48-57
        let char = String.fromCharCode(code)
        if((code>=65 && code <=97) || (code>=97 && code <=122) || (code === 32) || (code>=48 && code <= 57)){
            $(this).val($(this).val() + char)
            return false;
        }
    })

    // validation numerique
    $(document).on("keypress",".numerique",function(e){
        e.preventDefault()
        let code = e.keyCode || e.which; // 48-57
        let char = String.fromCharCode(code)
        if(code>=48 && code <= 57){
            $(this).val($(this).val() + char)
            return false;
        }
    })

})
const showNotif = function (className,title,message) {
	$('.tipso_style').tipso();
	$.notify(message, {
		className: className, // success/warning/info
		autoHide: true,
		autoHideDelay: 5000,
		clickToHide: true,
		position : 'top center',
		arrowShow: true,
		globalPosition: 'top center',
		gap: 10,  
	});

	$(".notifyjs-container").css( "width",'300px');
	$(".notifyjs-container").css( "padding",'10px !important');
	$(".notifyjs-container").css( "vertical-align",'middle');
	$(".notifyjs-container").css( "color",'#ffffff');
	$(".notifyjs-container").css( "margin",'0 auto');
}