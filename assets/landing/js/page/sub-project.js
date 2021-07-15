$(function () {
    var modal2 = document.getElementById('myModalPetunjuk');
    var btn2 = document.getElementById("myBtn");
    var span2 = document.getElementsByClassName("close petunjuk")[0];

    span2.onclick = function () {
        modal2.style.display = "none";
    }
    window.addEventListener("click", function (event) {
        if (event.target == modal2) {
            modal2.style.display = "none";
        }
    });
    var rangeData = function (callback, datas) {
        var dataX = parseFloat((100 / datas.length).toFixed(2));
        dataX += parseFloat((dataX / datas.length).toFixed(2));
        var initData = 0;
        var callbacks = callback["slider"];
        var callbackx = callback["detail"];
        for (i in datas) {
            var slideVal = parseInt(datas[i].description);
            callbackx[slideVal] = datas[i];
            if (i == 0)
                callbacks["min"] = slideVal;
            else if (i == datas.length - 1)
                callbacks["max"] = slideVal;
            else {
                initData += dataX;
                callbacks[initData.toString() + "%"] = slideVal;
            }
        }
    }
    _loadData();
    $('.service-menu-group').on("click", function () {
        if ($(this).data('card') != $('.card-service.active').attr('id')) {
            $('.card-service.active').hide().removeClass('active').addClass('d-none');
            $('#' + $(this).data('card')).removeClass('d-none').addClass('active').show();
            _loadData();
        }
    });

    $('button.social-attr').on("click", function () {
        if (!$(this).hasClass('active')) {
            $('.card-service.active').find('.social-attr.active').removeClass('active');
            $(this).addClass('active');
            _loadData();
        }
    });


    $.ajaxSetup({
        url: _ROUTE_URI['ajax-data-get-social-service-noauth'],
        global: false,
        beforeSend: function (xhr) {
            $('.card-service.active').find('.field-loading').fadeIn().show();
        },
        complete: function () {
            $('.card-service.active').find('.field-loading').hide();
        }
    });

    function _loadData() {
        var pSelector = $('.card-service.active');
        var subId = pSelector.attr('sub-id');
        var socialId = pSelector.find('.social-attr.active').attr('social-id');
        var verticalPrimary = document.getElementById(pSelector.find('.vertical-default').attr('id'));
        var data = { slider: {}, detail: {} };
        pSelector.find('.field-service').hide();
        pSelector.find('.field-blank').hide();
        $.post(_ROUTE_URI['ajax-data-get-social-service-noauth'], { sub_id: subId, social_id: socialId }, function (d) {
            if (d.length) {
                rangeData(data, d);
                pSelector.find('.field-service').fadeIn().show();
            } else {
                pSelector.find('.field-blank').fadeIn().show();
                pSelector.find('.field-blank-text').html($('.new_breadcrumb_area h2').html() + " - " + pSelector.find('.social-attr.active').html());
                data = { slider: { 'min': 0, 'max': 1 }, detail: {} };
            }
            if ($(".package-avatar").length)
                $(".package-avatar").remove();
            for (i in data.detail)
                $(".package-avatar-nest").append(`<img style="display:none" class="package-avatar item-` + data.detail[i].id + `" src="` + data.detail[i].image + `" alt="` + data.detail[i].image + `"/>`);
            if (typeof verticalPrimary.noUiSlider !== 'undefined')
                verticalPrimary.noUiSlider.destroy();
            noUiSlider.create(verticalPrimary, {
                start: 250,
                snap: true,
                behaviour: 'tap',
                tooltips: true,
                connect: "lower",
                orientation: 'vertical',
                direction: 'rtl',
                format: {
                    to: function (value) {
                        return value + ' ';
                    },
                    from: function (value) {
                        return value.replace(',-', '');
                    }
                },
                range: data.slider
            });
            verticalPrimary.noUiSlider.on('update', function (values, handle, unencoded, isTap, positions) {
                var pSelector = $('.card-service.active');
                if (Object.keys(data.detail).length) {
                    var context = data.detail[parseFloat(values[0]).toFixed(0).toString()];
                    pSelector.find(".btn-redir").attr("href", _ROUTE_URI['cart-item-social'].split('81').join(context.id).split('82').join((Math.floor(Math.random() * (200000 - 100000)) + 100000)));
                    pSelector.find('.package-detail').html("<i class='fa fa-plus'></i> " +
                        Number(context.description).formatMoney(0, ".", ".") + " <span>" + pSelector.find('.social-attr.active').html() + "</span>");
                    pSelector.find('.desk-price').html(null);
                    $.each(context.feature, function (i, item) {
                        pSelector.find('.desk-price').append(`<li>` + item + ``);
                    });
                    pSelector.find('.desk-price').append(`<li><b> ` + context.duration + ` Hari Proses Pengerjaan</b></li>`);
                    pSelector.find('.package-name').html(context.name.toUpperCase());
                    pSelector.find('.package-price').html(Number(context.selling_price).formatMoney(0, ".", ".") + ",-");
                    //pSelector.find('.package-avatar').attr("src", context.image);
                    $(".package-avatar").hide();
                    $(".package-avatar.item-" + context.id).show();
                } else {
                    pSelector.find('.desk-price').html(null);
                    pSelector.find('.package-name').html(null);
                    pSelector.find('.package-price').html(null);
                    $(".package-avatar").hide();
                    //pSelector.find('.package-avatar').attr("src", "");
                }
            })
        }, "json");
    }
});