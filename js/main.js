let ALPizza = {
    init: function () {
        ALPizza.addListteners();
    },
    addListteners: function () {
        document.getElementById('logInButton').addEventListener('click',ALPizza.logIn);
        document.querySelectorAll('.option').forEach( item => item.addEventListener('click',ALPizza.getDate));
    },
    logIn: function(){
        document.getElementById('logIn').classList.add('hide');
    },
    getDate: function(){
        document.querySelector('.highlight').classList.remove('highlight');
        this.classList.add('highlight');
        document.querySelector('.contentTitle p').textContent = this.textContent;
    }
}

ALPizza.init();