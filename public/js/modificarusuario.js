$(document).on("click", ".modificar", function () { 
    var obj = (this).closest("tr");
    var id = $(obj).find(".id").html();
    var nombre = $(obj).find(".nombreUsuario").html();
    var nombreRol = $(obj).find(".nombreRol").html();
    var nombreModulo = $(obj).find(".nombreModulo").html();
    document.getElementById('MIDU').value = id;
    document.getElementById('MNU').value = nombre;
    $(document.getElementById('MMU')).find("option").each(function () {
        if($(this).html() == nombreModulo) {
            $(this).attr("selected", true);
            return;
        }
    });
    $(document.getElementById('MRU')).find("option").each(function () {
        if($(this).html() == nombreRol) {
            $(this).attr("selected", true);
            return;
        }
    });
});
