String.prototype.kformat = function() {
    a = this;
    for (k in arguments) {
      a = a.replace("{" + k + "}", arguments[k])
    }
    return a
}
Number.prototype.formatMoney = function(a, b, c) {
    var d = this
      , a = isNaN(a = Math.abs(a)) ? 2 : a
      , b = void 0 == b ? "." : b
      , c = void 0 == c ? "," : c
      , e = d < 0 ? "-" : ""
      , f = parseInt(d = Math.abs(+d || 0).toFixed(a)) + ""
      , g = (g = f.length) > 3 ? g % 3 : 0;
    return e + (g ? f.substr(0, g) + c : "") + f.substr(g).replace(/(\d{3})(?=\d)/g, "$1" + c) + (a ? b + Math.abs(d - f).toFixed(a).slice(2) : "")
}
var allowSubmit = $('.g-recaptcha').length ? false : true;

function capcha_filled () {
    allowSubmit = true;
}

function capcha_expired () {
    allowSubmit = false;
}

$(function () {
    'use strict';
    var alertw = {
        required: "Anda harus mengisi kolom ini",
        minlen: "Jumlah karakter harus lebih dari {0}",
        type: "Angka yang anda masukkan salah {0}"
    };
    $(document).on('submit', 'form:not(.noauto)', function (e) {
        //e.preventDefault();
        var $eerror = false,
            form = this;
        $(".cuslabel").remove();
        $(this).find(':input[required]:visible').each(function () {
            $(this).css('border-color', '');
            var matchto = $(this).data('matchd'),
                minlength = $(this).data('minlen'),
                regex = $(this).data('regx'),
                ttype = $(this).data('type');
            if ($(this).val() == '' || $(this).val().length < 1)
                $eerror = this.id + '|' + 'required';
            if (typeof minlength !== typeof undefined && minlength !== false) {
                var ml = parseInt(minlength);
                if (ml > $(this).val().length)
                    $eerror = this.id + '|' + 'minlen' + '|' + ml;
            }
            if (typeof matchto !== typeof undefined && matchto !== false) {
                if ($(this).val() !== $("#" + matchto).val())
                    $eerror = this.id + '|' + 'matchd';
            }
            if (typeof regex !== typeof undefined && regex !== false) {
                var match = regex.match(new RegExp('^/(.*?)/([gimy]*)$'));
                regex = new RegExp(match[1], match[2]);
                if (!regex.test($(this).val()))
                    $eerror = this.id + '|' + 'regx';
            }
            if (typeof ttype !== typeof undefined && ttype == 'number') {
                var min = $(this).attr('min');
                var max = $(this).attr('max');
                if (typeof min !== typeof undefined && min !== false && typeof max !== typeof undefined && max !== false) {
                    var fgd = parseInt($(this).val());
                    if (fgd > parseInt($(this).attr('max')) || fgd < parseInt($(this).attr('min')))
                        $eerror = this.id + '|' + 'type' + '|' + 'minimal ' + min + ' dan maksimal ' + max;
                }
            }
        });
        if(!allowSubmit)
            return false;
        if ($eerror) {
            console.log($eerror);
            var expl = $eerror.split('|'),
                target = '#' + expl[0],
                twarget = false;
            if ($('#p_' + expl[0]).length)
                twarget = $('#p_' + expl[0]);
            else if ($(target).parent('.form-group').length)
                twarget = $(target).parent('.form-group');
            if (twarget) {
                var errlabel = $(target).attr('label-' + expl[1]);
                if (typeof errlabel !== typeof undefined && errlabel !== false)
                    twarget.append('<small class="cuslabel">' + decodeURIComponent(errlabel) + '</small>');
                else {
                    if (typeof alertw[expl[1]] != 'undefined') {
                        var dolwew = typeof expl[2] != 'undefined' ? expl[2] : false,
                            dulwew = !dolwew ? alertw[expl[1]] : alertw[expl[1]].kformat(dolwew);
                        twarget.append('<small class="cuslabel">' + dulwew + '</small>');
                    }
                }
            }
            if($(target).is(':checkbox') || !$(target).is(':radio')) $(target).focus();
            $(target).css('border-color', 'rgb(185, 74, 72)');
            return false;
        }
        });
        $("#passwordstr").keyup(function () {
            var pwStrengthErrorThreshold = 50;
            var pwStrengthWarningThreshold = 75;
            var $newPassword1 = jQuery("#newPassword1");
            var pw = jQuery("#passwordstr").val();
            var pwlength = (pw.length);
            if (pwlength > 5) pwlength = 5;
            var numnumeric = pw.replace(/[0-9]/g, "");
            var numeric = (pw.length - numnumeric.length);
            if (numeric > 3) numeric = 3;
            var symbols = pw.replace(/\W/g, "");
            var numsymbols = (pw.length - symbols.length);
            if (numsymbols > 3) numsymbols = 3;
            var numupper = pw.replace(/[A-Z]/g, "");
            var upper = (pw.length - numupper.length);
            if (upper > 3) upper = 3;
            var pwstrength = ((pwlength * 10) - 20) + (numeric * 10) + (numsymbols * 15) + (upper * 10);
            if (pwstrength < 0) pwstrength = 0;
            if (pwstrength > 100) pwstrength = 100;
            $("#pstrength .progress-bar").removeClass("progress-bar-danger progress-bar-warning progress-bar-success").css("width", pwstrength + "%").attr('aria-valuenow', pwstrength);
            $("#pstrength .progress-bar .sr-only").html('Kekuatan Password Baru: ' + pwstrength + '%');
            if (pwstrength < pwStrengthErrorThreshold) {
                $("#pstrength .progress-bar").addClass("progress-bar-danger");
            } else if (pwstrength < pwStrengthWarningThreshold) {
                $("#pstrength .progress-bar").addClass("progress-bar-warning");
            } else {
                $("#pstrength .progress-bar").addClass("progress-bar-success");
            }
        });
});