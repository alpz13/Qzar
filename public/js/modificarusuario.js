$(document).on("click", ".modificar", function () { 
    var obj = (this).closest("tr");
    alert(obj);
    var id = $(obj).find(".id").html();
    var nombre = $(obj).find(".nombreUsuario").html();
    var nombreRol = $(obj).find(".nombreRol").html();
    var nombreModulo = $(obj).find(".nombreModulo").html();
    document.getElementById('MIDU').value = id;
    document.getElementById('MNU').value = nombre;
    document.getElementById('MRU').value = nombreRol;
    document.getElementById('MMU').value = nombreModulo;
});
