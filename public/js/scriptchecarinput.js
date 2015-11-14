function checar(e) {
    k = (document.all) ? e.keyCode : e.which;
    if (k==8 || k==0) return true;
    patron = /[a-zA-Z\u00C0-\u00FF ]+/i;
    n = String.fromCharCode(k);
    return patron.test(n);
}