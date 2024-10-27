$().ready(function() {
    $(document).on("submit","#formEdit", function(e){
        e.preventDefault()

        const user_id = $('#user-id').val()
        const username = $('#username').val()
        const email = $('#email').val()
        const avatar = $('#avatar')[0].files[0] // Obtenir le fichier d'avatar
        const password = $('#password').val()
        const password2 = $('#password2').val()
        url = $("#formEdit").attr("action")

        if(password !== password2){
            toastr.error('Erreur','Confirmation mot de passe incorrecte', {positionClass: "toast-top-full-width", escapeHtml:true});
            return false
        }
        const formData = new FormData();
        formData.append('user_id', user_id);
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('password2', password2);
        formData.append('avatar', avatar);
        
        $.ajax({
            type: "POST", 
            url: url,
            cache: false,
            processData: false,
            contentType: false,
            data: formData,
            beforeSend: function () {
                $.blockUI({ message: '<i class="fa fa-spinner fa-spin fa-3x"></i>' })
            },
            success:function (response) {
                //arakaraka ny response.reponse am server: error ou success
                if(response.response == "success"){
                    toastr.success('Notification de <b>succès</b>', 'Success', {positionClass: "toast-top-full-width", escapeHtml:true});
                    window.location.reload()
                }else{
                    toastr.success('Erreur', response.message, {positionClass: "toast-top-full-width", escapeHtml:true, progressBar:true});
                }
                $.unblockUI();
            },
            error:function (http_error) {
                let server_msg = http_error.responseText;
                let code_label = http_error.statusText;
                toastr.error('Erreur', server_msg, {progressBar:true});
                $.unblockUI(); 
            }
        });

        return false

    })// submit form
}) // document ready