let amber = {
    init: function () {
        amber.addListteners();
    },
    addListteners: function () {
        document.getElementById('special').addEventListener('click', amber.jump);
        let target = document.getElementById('special');
        let tiny = new tinyshell(target);
        tiny.addEventListener("revealright", amber.swipeup);
    },
    jump: function () {
        document.getElementById('special').classList.add('jump');
        setTimeout(() => {
            document.getElementById('special').classList.remove('jump');
        }, 1000);
    },
    swipeup:function(){
        document.getElementById('special').classList.add('swipeup');
        setTimeout(() => {
            document.getElementById('special').classList.add('hide');
        }, 500);
    }
}

amber.init();