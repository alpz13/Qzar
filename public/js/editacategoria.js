$(document).on("click", ".modificar", function () { 
    var obj = (this).closest("tr");
    console.log(obj);
    var id = $(obj).find(".id").html();
    var nombrecategoria = $(obj).find(".nombreCat").html();
    document.getElementById('MCEID').value = id;
    document.getElementById('MCE').value = nombrecategoria;
    });