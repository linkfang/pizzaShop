let amber = {
    init: function () {
        amber.addListteners();
    },
    addListteners: function () {
        document.getElementById('logInButton').addEventListener('click',amber.logIn);
    },
    logIn:function(){
        document.getElementById('logIn').classList.add("hide");
    }
}

amber.init();