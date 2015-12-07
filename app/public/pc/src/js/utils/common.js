// common setting
(function () {
    if (localStorage.access_token) {
        $.ajaxSetup({
            headers: {
                Authorization: 'Bearer ' + localStorage.access_token,
                'Content-Type': 'application/json'
            },
            error: function (xhr, status) {
                console.log('err', status)
            },
            processData: false,
        })
    }
}())