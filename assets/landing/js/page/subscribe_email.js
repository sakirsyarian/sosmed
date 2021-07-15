$(function(){
    var subscribeContainer = $("form.sm_subscribe_form");
    $.ajaxSetup({
        url: _ROUTE_URI['ajax-data-push-subscribe'],
        global: false,
        beforeSend: function(xhr){
            subscribeContainer.css('opacity', 0.5);
            subscribeContainer.find('button, input').prop('disabled', true)
            $('#subscribe_load').show();
        },
        complete: function(){
            subscribeContainer.css('opacity', 1);
            subscribeContainer.find('button, input').prop('disabled', false)
            $('#subscribe_load').hide();
        },
        error: function(a, b, c){
            subscribeContainer.css('opacity', 1);
            $('#subscribe_load').hide();
            $(".view-messages").html('<div class="alert alert-success alert-dismissible" id="alertSubscribe" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><i class="fa fa-check text-success"></i> ' + a.responseJSON.errors.email[0] + '</div>');
        }
    });
    $(document).on('submit', 'form.sm_subscribe_form', function (e) {
        e.preventDefault();
        $("#alertSubscribe").remove();
        var emailSubsriber = $(this).find('input[name=email]'),
        emailExpression = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if(emailSubsriber.val() == "" || emailSubsriber.val().length < 4 || !emailExpression.test(emailSubsriber.val())){
            $(".view-messages").html('<div class="alert alert-warning alert-dismissible" id="alertSubscribe" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><i class="fa fa-warning text-warning"></i> Email yang anda masukkan tidak valid!</div>');
            emailSubsriber.focus();
            return false;
        }
        $.post(_ROUTE_URI['ajax-data-push-subscribe'], { email: emailSubsriber.val() }, function(d) {
            $(".view-messages").html('<div class="alert alert-success alert-dismissible" id="alertSubscribe" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><i class="fa fa-check text-success"></i> Terima kasih, anda berhasil berlangganan dengan kami.</div>');
        });
    });
})
