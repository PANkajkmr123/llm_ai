function login() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    $.ajax({
        type: "POST",
        data: { email, password },
        dataType: 'json',
        url: host + '/api/v1/admin/auth/login',
    }).done(function (data, textStatus, jqXHR) {
        // var headers = jqXHR.getAllResponseHeaders();
        //  var headerLines = headers.split('\n');
        // var headerMap = {};
        // headerLines.forEach(function (line) {
        //     var parts = line.split(': ');
        //     if (parts.length === 2) {
        //         var headerName = parts[0];
        //         var headerValue = parts[1];
        //         headerMap[headerName] = headerValue;
        //     }
        // });
       // If successful
        localStorage.setItem("name", data.data.name);
       localStorage.setItem("token", data.data.token);
     //  localStorage.setItem("accesstoken", headers.accesstoken);
       window.location.reload()
    }).fail(function (jqXHR, textStatus, errorThrown) {
        // If fail
        alert(jqXHR.responseJSON.error)
    });
}
