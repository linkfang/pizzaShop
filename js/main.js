let ALPizza = {
    option: null,
    basic: window.location.href,
    init: function () {
        ALPizza.addListteners();
        document.querySelector('.highlight').dispatchEvent(new MouseEvent('click'));
        console.log(ALPizza.basic);
    },
    addListteners: function () {
        document.getElementById('logInButton').addEventListener('click', ALPizza.logIn);
        document.querySelectorAll('.option').forEach(item => item.addEventListener('click', ALPizza.getDate));
        document.getElementById('add').addEventListener('click', ALPizza.addData);
        document.querySelector('.pizzaAdd').addEventListener('click', ALPizza.savePizza);
        document.querySelector('.ingredientAdd').addEventListener('click', ALPizza.saveIngredients);
        document.querySelectorAll('.cancelBtn').forEach(item => item.addEventListener('click', ALPizza.back));
        document.getElementById('changePass').addEventListener('click', ALPizza.password);
    },
    password: function () {
        let showedPage = document.querySelector('.show');
        showedPage.classList.add('hide');
        showedPage.classList.remove('show');
        document.querySelector('.changePasswordPage').classList.add('show');
        document.querySelector('.highlight').classList.remove('highlight');
        this.classList.add('highlight');
        history.pushState(null, null, `${ALPizza.basic}/changepassword`);      
    },
    back: function () {
        document.querySelector('.highlight').dispatchEvent(new MouseEvent('click'));

    },
    logIn: function () {
        document.getElementById('logIn').classList.remove('show');
    },
    getDate: function () {
        document.querySelector('.highlight').classList.remove('highlight');
        this.classList.add('highlight');
        document.querySelector('.changePasswordPage').classList.remove('show');
        document.querySelectorAll('.editForm').forEach(item => item.classList.remove('show'));
        document.querySelector('.contentList').classList.add('show');

        document.querySelector('.contentTitle p').textContent = this.textContent;

        document.getElementById('add').textContent = `+ Add New ${this.textContent.substring(0, this.textContent.lastIndexOf('s'))}`;
        ALPizza.option = this.textContent.trim().toLowerCase();

        history.pushState(null, null, `${ALPizza.basic}/${ALPizza.option}`);
        let url = `http://mad9124.rocks/api/${ALPizza.option}`;
        console.log(url);

        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data.data);
                let content = document.querySelector('#listPage');
                content.innerHTML = '';

                let documentFragment = new DocumentFragment();

                data.data.forEach((item) => {
                    let list = document.createElement('div');
                    let name = document.createElement('p');
                    let price = document.createElement('p');

                    let editDiv = document.createElement('div');
                    let edit = document.createElement('i');
                    let deleteButton = document.createElement('i');

                    name.textContent = item.name;
                    price.textContent = item.price;

                    list.className = 'staffLis';
                    editDiv.className = 'edit';
                    edit.className = 'far fa-edit';
                    deleteButton.className = 'far fa-trash-alt';

                    edit.addEventListener('click', () => ALPizza.addData(item));
                    deleteButton.addEventListener('click', () => ALPizza.deleteData(item._id));

                    editDiv.appendChild(edit);
                    editDiv.appendChild(deleteButton);
                    list.appendChild(name);
                    list.appendChild(price);

                    if (ALPizza.option == 'pizzas') {
                        let size = document.createElement('p');
                        size.textContent = item.size;
                        list.appendChild(size);
                        document.querySelector('#listTitle p:nth-child(3)').textContent = 'Size';
                    } else {
                        let quantity = document.createElement('p');
                        quantity.textContent = item.quantity;
                        list.appendChild(quantity);
                        document.querySelector('#listTitle p:nth-child(3)').textContent = 'Quantity';
                    }
                    list.appendChild(editDiv);

                    documentFragment.appendChild(list);
                })

                content.appendChild(documentFragment);
            })
            .catch(err => console.log(err));
    },
    deleteData: function (id) {
        console.log(id);
    },
    addData: function (item) {
        document.querySelector('.contentList').classList.remove('show');
        document.querySelector('.contentList').classList.add('hide');
        history.pushState(null, null, `${ALPizza.basic}/${ALPizza.option}edit`);    

        console.log(ALPizza.option);

        if (ALPizza.option == "pizzas") {
            document.querySelector('.pizzaEdit').classList.add('show');

            document.querySelector('.pizzaNameCtn input').value = '';
            document.querySelector('.pizzaPriceCtn input').value = '';

            fetch(`http://mad9124.rocks/api/ingredients`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    let content = document.querySelector('.pizzaIngredientsCtn .form-row');
                    content.innerHTML = "";
                    let documentFragment = new DocumentFragment();

                    data.data.forEach((item) => {
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

                    if (item.name) {
                        document.querySelector('.pizzaAdd').setAttribute('data-id', item._id);
                        document.querySelector('.pizzaNameCtn input').value = item.name;
                        document.querySelector('.pizzaPriceCtn input').value = item.price;
                        document.getElementsByName('size').forEach(pizza => {
                            if (pizza.value == item.size) {
                                pizza.checked = "checked";
                            }
                        });
                        document.getElementsByName('Gluten').forEach(gluten => {
                            let g = item.isGlutenFree ? "true" : "false";
                            if (gluten.value == g) {
                                gluten.checked = "checked";
                            }
                        });
                        item.ingredients.forEach(ingredient => {
                            document.getElementsByName('Ingredient').forEach(ing => {
                                if (ing.value == ingredient.name) {
                                    ing.checked = "checked";
                                }
                            });
                        });
                        item.extraToppings.forEach(ingredient => {
                            document.getElementsByName('ExIngredient').forEach(ing => {
                                if (ing.value == ingredient.name) {
                                    ing.checked = "checked";
                                }
                            });
                        });
                    }
                })
                .catch(err => console.log(err))
        } else if (ALPizza.option == "ingredients") {
            document.querySelector('.ingredientEdit').classList.add('show');

            document.querySelector('.ingredientNameCtn input').value = "";
            document.querySelector('.ingredientPriceCtn input').value = "";
            document.querySelector('.ingredientQuantityCtn input').value = '';

            if (item.name) {
                document.querySelector('.ingredientNameCtn input').value = item.name;
                document.querySelector('.ingredientPriceCtn input').value = item.price;
                document.querySelector('.ingredientQuantityCtn input').value = item.quantity;
                document.getElementsByName('GlutenIn').forEach(gluten => {
                    let g = item.isGlutenFree ? "true" : "false";
                    if (gluten.value == g) {
                        gluten.checked = "checked";
                    }
                });
                item.categories.forEach(categorie => {
                    document.getElementsByName('categories').forEach(cat => {
                        if (cat.value == categorie) {
                            cat.checked = "checked";
                        }
                    });
                });
            }
        }
    },
    savePizza: function () {
        document.querySelector('.highlight').dispatchEvent(new MouseEvent('click'));

        let name = document.querySelector('.pizzaNameCtn input').value;
        let price = document.querySelector('.pizzaPriceCtn input').value;
        let img = document.querySelector('.pizzaImageCtn input').value;
        let size;
        document.getElementsByName('size').forEach(item => {
            if (item.checked) {
                size = item.value;
            }
        });
        let glutenFree;
        document.getElementsByName('Gluten').forEach(item => {
            if (item.checked) {
                glutenFree = item.value == "ture" ? true : false;
            }
        });

        let ingredients = [];
        document.getElementsByName('Ingredient').forEach(item => {
            if (item.checked) {
                ingredients.push(item.value);
            }
        });
        let exIngredients = [];
        document.getElementsByName('ExIngredient').forEach(item => {
            if (item.checked) {
                exIngredients.push(item.value);
            }
        });

        ALPizza.newData = {
            name: name,
            price: price,
            size: size,
            isGlutenFree: glutenFree,
            imageUrl: img,
            ingredients: ingredients,
            extraToppings: exIngredients
        };

        if (document.querySelector('.pizzaAdd').getAttribute('data-id')) {
            document.querySelector('.pizzaAdd').removeAttribute("style");
        };
        ALPizza.postData('POST');
    },
    saveIngredients: function () {
        document.querySelector('.highlight').dispatchEvent(new MouseEvent('click'));
        
        let name = document.querySelector('.ingredientNameCtn input').value;
        let price = document.querySelector('.ingredientPriceCtn input').value;
        let quantity = document.querySelector('.ingredientQuantityCtn input').value;
        let glutenFree;
        document.getElementsByName('GlutenIn').forEach(item => {
            if (item.checked) {
                glutenFree = item.value == "ture" ? true : false;
            }
        });
        let img = document.querySelector('.ingredientImageCtn input').value;
        let categorie = [];
        document.getElementsByName('categories').forEach(item => {
            if (item.checked) {
                categorie.push(item.value);
            }
        });

        ALPizza.newData = {
            name: name,
            price: price,
            quantity: quantity,
            isGlutenFree: glutenFree,
            imageUrl: img,
            categories: categorie
        };
        ALPizza.postData('POST');
    },
    authToken: null,
    newData: null,
    editData: function (opt) {
        let url = `http://mad9124.rocks/api/${ALPizza.option}`;
        const headers = new Headers()
        headers.append('Content-Type', 'application/json;charset=UTF-8')
        if (authToken) {
            headers.append('Authorization', 'Bearer ' + authToken)
        }
        let jsonData = JSON.stringify(ALPizza.newData);
        let req = new Request(url, {
            headers: headers,
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            body: jsonData
        });
        fetch(req)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data) {
                    let not = `Added succesfully!`;
                    ALPizza.not(not);
                }
            })
            .catch(err => {
                console.error(err.code + ': ' + err.message);
            })
    },
    not: function (not) {
        alert(not);
    }
}

ALPizza.init();