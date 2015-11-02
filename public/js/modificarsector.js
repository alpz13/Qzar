$(document).on("click", ".modificar", function () { 
	var obj = (this).closest("tr");
    var id = $(obj).find(".id").html();
    document.getElementById('MIDU').value = id;
});
