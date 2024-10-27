$().ready(function() {
    $(document).on("submit","#formEdit", function(e){
        e.preventDefault()
        var fd = new FormData()
        if($("#password").val() !== $("#password2").val()){
            showNotif('error','Confirmation mot de passe incorrecte !','bottom right')
            return false
        }
        fd.append("id", $("#user-id").val())
        fd.append("email", $("#email").val())
        fd.append("username", $("#username").val())
        fd.append("avatar", $("#avatar")[0].files[0])
        fd.append("password", $("#password").val())
        fd.append("password2", $("#password2").val())
        url = $("#formEdit").attr("action")
        $.ajax({
            type: "POST", 
            url: url,
            data:fd,
            cache: false,
            processData: false,
            contentType: false,
            beforeSend: function () {
                $.blockUI({ message: "<i class='fas fa-spinner fa-spin'></i>" })
            },
            success:function (response) {
                //arakaraka ny response.reponse am server: error ou success
                $.unblockUI();
                if(response.response == "success"){
                    window.location.reload()
                }
                showNotif(response.response, response.message , "bottom right");
            },
            error:function (http_error) {
                let server_msg = http_error.responseText;
                let code_label = http_error.statusText;
                showNotif('danger', server_msg + ', ' + code_label, "bottom right");
                //console.log("Erreur :" + server_msg + ', ' + code_label,)
                $.unblockUI(); 
            }
        });

        return false

    })// submit form
}) // document ready