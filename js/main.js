let ALPizza = {
    option: null,
    init: function () {
        ALPizza.addListteners();
        document.querySelector('.highlight').dispatchEvent(new MouseEvent('click'));
    },
    addListteners: function () {
        document.getElementById('logInButton').addEventListener('click', ALPizza.logIn);
        document.querySelectorAll('.option').forEach(item => item.addEventListener('click', ALPizza.getDate));
        document.getElementById('add').addEventListener('click', ALPizza.addData);
        document.querySelector('.pizzaAdd').addEventListener('click', ALPizza.saveData);
    },
    logIn: function () {
        document.getElementById('logIn').classList.add('hide');
    },
    getDate: function () {
        document.querySelector('.highlight').classList.remove('highlight');
        this.classList.add('highlight');
        document.querySelector('.contentTitle p').textContent = this.textContent;

        ALPizza.option = this.textContent.trim();

        if (ALPizza.option == 'Pizzas' || ALPizza.option == 'Ingredients') {

            let url = `http://mad9124.rocks/api/${ALPizza.option.toLowerCase()}`;
            console.log(url);

            fetch(url)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    let content = document.querySelector('#listPage');
                    content.innerHTML = '';

                    let documentFragment = new DocumentFragment();

                    data.data.forEach((item) => {
                        let list = document.createElement('div');
                        let name = document.createElement('p');
                        let editDiv = document.createElement('div');
                        let edit = document.createElement('i');
                        let deleteButton = document.createElement('i');

                        name.textContent = item.name;

                        list.className = 'staffLis';
                        editDiv.className = 'edit';
                        edit.className = 'far fa-edit';
                        deleteButton.className = 'far fa-trash-alt';

                        deleteButton.addEventListener('click', () => ALPizza.deleteData(ALPizza.option.toLowerCase(), item._id));

                        editDiv.appendChild(edit);
                        editDiv.appendChild(deleteButton);
                        list.appendChild(name);
                        list.appendChild(editDiv);

                        documentFragment.appendChild(list);
                    })

                    content.appendChild(documentFragment);
                })
                .catch(err => console.log(err));
        }
    },
    deleteData: function (option, id) {
        console.log(option);
        console.log(id);
    },
    addData:function(){
        document.querySelector('.contentList').classList.add('hide');
        document.querySelector('.pizzaEdit').classList.remove('hide');
    },
    saveData:function(){
        document.querySelector('.contentList').classList.remove('hide');
        document.querySelector('.pizzaEdit').classList.add('hide');
    }
}

ALPizza.init();