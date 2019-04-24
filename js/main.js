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

        document.querySelectorAll('.editForm').forEach(item => item.classList.add('hide'));
        document.querySelector('.contentList').classList.remove('hide');

        document.querySelector('.contentTitle p').textContent = this.textContent;

        ALPizza.option = this.textContent.trim().toLowerCase();

        if (ALPizza.option == 'pizzas' || ALPizza.option == 'ingredients') {

            let url = `http://mad9124.rocks/api/${ALPizza.option}`;
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

                        deleteButton.addEventListener('click', () => ALPizza.deleteData(ALPizza.option, item._id));

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

        if (ALPizza.option == "pizzas"){
            document.querySelector('.pizzaEdit').classList.remove('hide');

            fetch(`http://mad9124.rocks/api/ingredients`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                let content = document.querySelector('.pizzaIngredientsCtn .form-row');
                content.innerHTML = "";
                let documentFragment = new DocumentFragment();

                data.data.forEach((item)=>{
                    let ingredient = document.createElement('div');
                    let input = document.createElement('input');
                    let name = document.createElement('label');

                    ingredient.className = 'form-check';
                    input.className = 'form-check-input';
                    name.className = 'form-check-label';
                    name.textContent = item.name;

                    input.setAttribute('name', 'Ingredient');
                    input.setAttribute('type', 'checkbox');
                    name.setAttribute('for', item._id);
                    input.value = item._id;

                    ingredient.appendChild(input);
                    ingredient.appendChild(name);
                    documentFragment.appendChild(ingredient);
                })

                content.appendChild(documentFragment);
                document.querySelector('.pizzaExtraCtn .form-row').innerHTML = content.innerHTML;
                document.querySelector('.pizzaExtraCtn input').setAttribute('name', 'ExIngredient');

            })
            .catch(err=>console.log(err))
        } else if (ALPizza.option == "ingrediens"){
            document.querySelector('.ingredientEdit').classList.remove('hide');

        }
    },
    saveData:function(){
        document.querySelector('.contentList').classList.remove('hide');
        document.querySelector('.pizzaEdit').classList.add('hide');

        let name = document.querySelector('.pizzaNameCtn input').value;
        let price = document.querySelector('.pizzaPriceCtn input').value;
        let img = document.querySelector('.pizzaImageCtn input').value;
        let size;
        document.getElementsByName('size').forEach(item => {
            if(item.checked){
                size = item.value;
            }
        });
        let glutenFree;
        document.getElementsByName('Gluten').forEach(item => {
            if(item.checked){
                glutenFree = item.value == "ture" ? true : false;
            }
        });

        let ingredients = [];
        document.getElementsByName('Ingredient').forEach(item=>{
            if(item.checked){
                ingredients.push(item.value);
            }
        });
        let exIngredients = [];
        document.getElementsByName('ExIngredient').forEach(item=>{
            if(item.checked){
                exIngredients.push(item.value);
            }
        });

        let newPizza = {
            name: name,
            price: price,
            size: size,
            isGlutenFree: glutenFree,
            imageUrl: img,
            ingredients: ingredients,
            extraToppings: exIngredients
        }

        console.log(newPizza);
    }
}

ALPizza.init();