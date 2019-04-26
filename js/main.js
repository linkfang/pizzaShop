let ALPizza = {
    option: null,
    basic: window.location.href,
    dataURL: 'http://zhou0160.edumedia.ca',
    userInfor: {
        firstName: "",
        lastName: "",
        email: ""
    },
    init: function () {
        ALPizza.addListteners();
        if (localStorage.getItem('token')) {
            ALPizza.authToken = localStorage.getItem('token');
            ALPizza.getUser();
        }
    },
    addListteners: function () {
        document.querySelector('.closeBtn').addEventListener('click',()=>{
            document.querySelector(".notification").classList.add("notificationHide");
        });
        window.onresize = function () {
            ALPizza.changeWidth();
        };
        document.querySelector('.fa-bars').addEventListener('click', ALPizza.showHum);
        document.querySelectorAll('.option').forEach(item => item.addEventListener('click', ALPizza.getData));
        document.getElementById('add').addEventListener('click', ALPizza.addData);
        document.querySelector('.submitPassword').addEventListener('click', ALPizza.changePass);
        document.querySelector('.pizzaAdd').addEventListener('click', ALPizza.savePizza);
        document.querySelector('.ingredientAdd').addEventListener('click', ALPizza.saveIngredients);
        document.querySelectorAll('.cancelBtn').forEach(item => item.addEventListener('click', ALPizza.back));
        document.getElementById('changePass').addEventListener('click', ALPizza.password);
        document.getElementById('logInButton').addEventListener('click', ALPizza.singIn);
        document.getElementById('logout').addEventListener('click', () => {
            if (ALPizza.hum) {
                ALPizza.hideHum();
            }
            document.getElementById('staffPage').classList.add('hide');
            document.getElementById('humburger').classList.add('hide');
            document.getElementById('logIn').classList.remove('hide');
            document.getElementById('logInPassword').value = '';
            ALPizza.authToken = null;
            localStorage.removeItem('token');
        });
        document.querySelector('.fa-eye-slash.U').addEventListener('click', () => {
            document.getElementById('signUpPassword').type = 'text';
            document.querySelector('.fa-eye.hide.U').classList.remove('hide');
            document.querySelector('.fa-eye-slash.U').classList.add('hide');
        });
        document.querySelector('.fa-eye.U').addEventListener('click', () => {
            document.getElementById('signUpPassword').type = 'password';
            document.querySelector('.fa-eye-slash.hide.U').classList.remove('hide');
            document.querySelector('.fa-eye.U').classList.add('hide');
        });
        document.querySelector('.fa-eye-slash.I').addEventListener('click', () => {
            document.getElementById('logInPassword').type = 'text';
            document.querySelector('.fa-eye.hide.I').classList.remove('hide');
            document.querySelector('.fa-eye-slash.I').classList.add('hide');
        });
        document.querySelector('.fa-eye.I').addEventListener('click', () => {
            document.getElementById('logInPassword').type = 'password';
            document.querySelector('.fa-eye-slash.hide.I').classList.remove('hide');
            document.querySelector('.fa-eye.I').classList.add('hide');
        });
        document.getElementById('singUpB').addEventListener('click', () => {
            document.getElementById('logInPassword').type = 'password';
            document.getElementById('signUpPassword').type = 'password';
            document.querySelectorAll('.fa-eye').forEach(item => item.classList.add('hide'));
            document.querySelectorAll('.fa-eye-slash').forEach(item => item.classList.remove('hide'));
            document.getElementById('logIn').classList.add('hide');
            document.getElementById('signUp').classList.remove('hide');
            document.getElementById('signUpFirstName').value = '';
            document.getElementById('signUpLastName').value = '';
            document.getElementById('signUpEmail').value = '';
            document.getElementById('signUpPassword').value = '';
        });
        document.getElementById('singInB').addEventListener('click', () => {
            document.getElementById('logInPassword').type = 'password';
            document.getElementById('signUpPassword').type = 'password';
            document.getElementById('logInPassword').value = '';
            document.querySelectorAll('.fa-eye').forEach(item => item.classList.add('hide'));
            document.querySelectorAll('.fa-eye-slash').forEach(item => item.classList.remove('hide'));
            document.getElementById('logIn').classList.remove('hide');
            document.getElementById('signUp').classList.add('hide');
        });
        document.getElementById('signUpButton').addEventListener('click', ALPizza.singUp);
        document.getElementById('staffContent').addEventListener('click', () => {
            if (ALPizza.hum) {
                ALPizza.hideHum()
            }
        });
    },
    getUser: function () {
        ALPizza.showLoading();
        const headers = new Headers();
        headers.append('Content-Type', 'application/json;charset=UTF-8');

        if (ALPizza.authToken) {
            headers.append('Authorization', 'Bearer ' + ALPizza.authToken)
        }

        let url = `${ALPizza.dataURL}/auth/users/me`;

        let req = new Request(url, {
            headers: headers,
            method: 'GET',
            mode: 'cors'
        });

        fetch(req)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);

                ALPizza.hideLoading();

                ALPizza.userInfor.firstName = data.data.firstName;
                ALPizza.userInfor.lastName = data.data.lastName;
                ALPizza.userInfor.email = data.data.email;

                if (data.data.isStaff) {
                    document.getElementById('staffPage').classList.remove('hide');
                    document.getElementById('logIn').classList.add('hide');
                    document.getElementById('humburger').classList.remove('hide');
                    document.querySelector('.shop p:nth-child(1)').dispatchEvent(new MouseEvent('click'));
                } else {
                    document.getElementById('userList').classList.remove('hide');
                    document.getElementById('logIn').classList.add('hide');
                }
            })
            .catch(err => console.log(err));
    },
    hum: null,
    showHum: function () {
        if (ALPizza.hum) {
            ALPizza.hideHum();
            return;
        }
        document.getElementById('staffNav').style.transform = 'translateX(0)';
        ALPizza.hum = true;
    },
    hideHum: function () {
        document.getElementById('staffNav').removeAttribute('style');
        ALPizza.hum = false;
    },
    changePass: function () {
        let newPass = document.querySelector('.newPasswordCtn>input').value;
        let conPass = document.querySelector('.confirmPasswordCtn>input').value;

        if (newPass != conPass) {
            alert('The tow passwords are not the same, try again!');
            return;
        }

        let url = `${ALPizza.dataURL}/auth/users/me`;

        const headers = new Headers();
        headers.append('Content-Type', 'application/json;charset=UTF-8');

        if (ALPizza.authToken) {
            headers.append('Authorization', 'Bearer ' + ALPizza.authToken)
        }

        let jsonData = JSON.stringify({
            password: newPass
        });

        let req = new Request(url, {
            headers: headers,
            method: 'PATCH',
            mode: 'cors',
            body: jsonData
        });

        fetch(req)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data.data) {
                    let not ={
                        title: 'Succeed',
                        detail:`Password has been changed.`
                    } ;
                    ALPizza.not(not);
                } else if (data.errors){
                    ALPizza.not(data.errors[0]);
                }
            })
            .catch(err => {
                console.error(err.code + ': ' + err.message);
            })

    },
    singUp: function () {
        let firstName = document.getElementById('signUpFirstName').value;
        let lastName = document.getElementById('signUpLastName').value;
        let email = document.getElementById('signUpEmail').value;
        let password = document.getElementById('signUpPassword').value;
        let userType;
        document.querySelectorAll('.userTypeSelect option').forEach((item) => {
            if (item.selected) {
                if (item.value) {
                    userType = true;
                } else {
                    userType = false;
                }
            }
        });

        let newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            isStaff: userType
        }

        ALPizza.showLoading();

        const headers = new Headers();
        headers.append('Content-Type', 'application/json;charset=UTF-8');

        let url = `${ALPizza.dataURL}/auth/users`;
        let pro = 'https://cors-anywhere.herokuapp.com/';

        let jsonData = JSON.stringify(newUser);

        let req = new Request(pro + url, {
            headers: headers,
            method: 'POST',
            mode: 'cors',
            body: jsonData
        });

        fetch(req)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                ALPizza.hideLoading();
                if (data.data) {
                    let not ={
                        title: 'Succeed',
                        detail:`New account has been created, you can sign in now.`
                    } ;
                    ALPizza.not(not);
                    document.querySelector('#singInB').dispatchEvent(new MouseEvent('click'));
                } else if (data.errors){
                    ALPizza.not(data.errors[0]);
                }
            })
            .catch(err => console.log(err));

    },
    singIn: function () {
        let email = document.getElementById('logInEmail').value;
        let password = document.getElementById('logInPassword').value;

        if (!email) {
            alert('You have to enter your email!');
            document.getElementById('logInEmail').focus();
            return;
        } else if (!password) {
            alert('You have to enter your password!');
            document.getElementById('logInPassword').focus();
            return;
        }

        ALPizza.showLoading();

        let user = {
            email: email,
            password: password
        }

        const headers = new Headers();
        headers.append('Content-Type', 'application/json;charset=UTF-8');

        let url = `${ALPizza.dataURL}/auth/tokens`;

        let jsonData = JSON.stringify(user);

        let req = new Request(url, {
            headers: headers,
            method: 'POST',
            mode: 'cors',
            body: jsonData
        });

        fetch(req)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                ALPizza.hideLoading();
                if (data.errors) {
                    alert(data.errors[0].title + " Please try again!");
                    return;
                }
                ALPizza.authToken = data.data.token;
                localStorage.setItem('token', ALPizza.authToken);
                ALPizza.getUser();
            })
            .catch(err => console.log(err));
    },
    userPage: function () {
        fetch(`${ALPizza.dataURL}/api/pizzas`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
            })
            .catch(err => console.log(err));
    },
    password: function () {
        if (ALPizza.hum) {
            ALPizza.hideHum();
        }
        document.querySelector('.newPasswordCtn>input').value = '';
        document.querySelector('.confirmPasswordCtn>input').value = '';
        document.querySelector('.confirmPasswordCtn>input').type = 'password';
        document.querySelector('.newPasswordCtn>input').type = 'password';

        document.querySelector('.userName').textContent = ALPizza.userInfor.firstName + " " + ALPizza.userInfor.lastName;
        document.querySelector('.passwordEmail').textContent = ALPizza.userInfor.email;

        let showedPage = document.querySelector('.show');
        showedPage.classList.add('hide');
        showedPage.classList.remove('show');
        document.querySelector('.changePasswordPage').classList.add('show');
        document.querySelector('.highlight').classList.remove('highlight');
        this.classList.add('highlight');
        document.querySelector('.contentTitle p').textContent = this.textContent;
        document.getElementById('add').classList.add('hide');
        // history.pushState(null, null, `${ALPizza.basic}/changepassword`)
    },
    back: function () {
        document.querySelector('.highlight').dispatchEvent(new MouseEvent('click'));
    },
    getData: function () {
        if (ALPizza.hum) {
            ALPizza.hideHum();
        }
        document.getElementById('add').classList.remove('hide');
        document.querySelector('.highlight').classList.remove('highlight');
        this.classList.add('highlight');
        document.querySelector('.changePasswordPage').classList.remove('show');
        document.querySelectorAll('.editForm').forEach(item => item.classList.remove('show'));
        document.querySelector('.contentList').classList.add('show');

        document.querySelector('.contentTitle p').textContent = this.textContent;

        document.getElementById('add').textContent = `+ Add New ${this.textContent.substring(0, this.textContent.lastIndexOf('s'))}`;
        ALPizza.option = this.textContent.trim().toLowerCase();

        // history.pushState(null, null, `${ALPizza.basic}/${ALPizza.option}`);

        ALPizza.showLoading();

        let url = `${ALPizza.dataURL}/api/${ALPizza.option}`;

        const headers = new Headers();
        headers.append('Content-Type', 'application/json;charset=UTF-8');

        let req = new Request(url, {
            // headers: headers,
            method: 'GET',
            mode: 'cors'
        });

        fetch(req)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                 ALPizza.hideLoading();                
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

        ALPizza.showLoading();

        const headers = new Headers();
        headers.append('Content-Type', 'application/json;charset=UTF-8');

        if (ALPizza.authToken) {
            headers.append('Authorization', 'Bearer ' + ALPizza.authToken)
        }

        let url = `${ALPizza.dataURL}/api/${ALPizza.option}/${id}`;

        let req = new Request(url, {
            headers: headers,
            method: 'DELETE',
            mode: 'cors'
        });

        fetch(req)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                ALPizza.hideLoading();

                if (data.data) {
                    let not ={
                        title: 'Succeed',
                        detail:`${data.data.name} has been deleted!`
                    } ;
                    ALPizza.not(not);
                    document.querySelector('.highlight').dispatchEvent(new MouseEvent('click'));
                } else if (data.errors){
                    ALPizza.not(data.errors[0]);
                }

            })
            .catch(err => console.log(err));
    },
    addData: function (item) {
        document.querySelector('.contentList').classList.remove('show');
        document.querySelector('.contentList').classList.add('hide');
        // history.pushState(null, null, `${ALPizza.basic}/${ALPizza.option}edit`);

        console.log(ALPizza.option);

        if (ALPizza.option == "pizzas") {
            document.querySelector('.pizzaEdit').classList.add('show');

            document.querySelector('.pizzaNameCtn input').value = '';
            document.querySelector('.pizzaPriceCtn input').value = '';

            document.getElementById('smallPi').checked = true;

            document.getElementsByName('size').forEach(pizza => {
                if (pizza.value == item.size) {
                    pizza.checked = "checked";
                }
            });

            fetch(`${ALPizza.dataURL}/api/ingredients`)
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
                    document.querySelectorAll('.pizzaExtraCtn input').forEach(item => item.name = 'ExIngredient');

                    if (item.name) {
                        document.querySelector('.pizzaAdd').setAttribute('data-id', item._id);
                        document.querySelector('.pizzaNameCtn input').value = item.name;
                        document.querySelector('.pizzaPriceCtn input').value = item.price;
                        document.getElementsByName('size').forEach(pizza => {
                            if (pizza.value == item.size) {
                                pizza.checked = "checked";
                            }
                        });

                        let g;
                        if (item.isGlutenFree) {
                            g = "true";
                        } else {
                            g = "false";
                        }

                        document.getElementsByName('Gluten').forEach(gluten => {
                            if (gluten.value == g) {
                                gluten.checked = true;
                            }
                        });
                        item.ingredients.forEach(ingredient => {
                            document.getElementsByName('Ingredient').forEach(ing => {
                                if (ing.value == ingredient._id) {
                                    ing.checked = true;
                                }
                            });
                        });
                        item.extraToppings.forEach(ex => {
                            document.getElementsByName('ExIngredient').forEach(ing => {
                                if (ing.value == ex._id) {
                                    ing.checked = true;
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
            document.getElementsByName('categories').forEach(cat => {
                cat.checked = false;
            });

            document.getElementById('noIn').checked = true;

            if (item.name) {
                document.querySelector('.ingredientAdd').setAttribute('data-id', item._id);
                document.querySelector('.ingredientNameCtn input').value = item.name;
                document.querySelector('.ingredientPriceCtn input').value = item.price;
                document.querySelector('.ingredientQuantityCtn input').value = item.quantity;
                document.getElementsByName('GlutenIn').forEach(gluten => {
                    let g = item.isGlutenFree ? "true" : "false";
                    if (gluten.value == g) {
                        gluten.checked = true;
                    }
                });
                item.categories.forEach(categorie => {
                    document.getElementsByName('categories').forEach(cat => {
                        if (cat.value == categorie) {
                            cat.checked = true;
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
                if (item.value == "ture") {
                    glutenFree = 'true';
                } else {
                    glutenFree = 'false';
                }
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
            let id = document.querySelector('.pizzaAdd').getAttribute('data-id');
            ALPizza.editData('PUT', id);
            document.querySelector('.pizzaAdd').removeAttribute("data-id");
        } else {
            ALPizza.editData('POST');
        }
    },
    saveIngredients: function () {

        let name = document.querySelector('.ingredientNameCtn input').value;
        let price = document.querySelector('.ingredientPriceCtn input').value;
        let quantity = document.querySelector('.ingredientQuantityCtn input').value;
        let glutenFree;
        document.getElementsByName('GlutenIn').forEach(item => {
            if (item.checked) {
                glutenFree = item.value;
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

        if (document.querySelector('.ingredientAdd').getAttribute('data-id')) {
            let id = document.querySelector('.ingredientAdd').getAttribute('data-id');
            ALPizza.editData('PUT', id);
            document.querySelector('.ingredientAdd').removeAttribute("data-id");
        } else {
            ALPizza.editData('POST');
        }
    },
    authToken: null,
    newData: null,
    editData: function (opt, id) {
        let url = `${ALPizza.dataURL}/api/${ALPizza.option}`;

        if (opt == 'PUT') {
            url = `${ALPizza.dataURL}/api/${ALPizza.option}/${id}`;
        }

        ALPizza.showLoading();
        const headers = new Headers();
        headers.append('Content-Type', 'application/json;charset=UTF-8');

        if (ALPizza.authToken) {
            headers.append('Authorization', 'Bearer ' + ALPizza.authToken)
        }
        let jsonData = JSON.stringify(ALPizza.newData);

        console.log(jsonData);

        let req = new Request(url, {
            headers: headers,
            method: opt,
            mode: 'cors',
            body: jsonData
        });

        fetch(req)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                ALPizza.hideLoading();
                document.querySelector('.highlight').dispatchEvent(new MouseEvent('click'));
               
                if (data.data) {
                    let not ={
                        title: 'Succeed',
                        detail:`${data.data.name} has been added.`
                    } ;

                    if(opt == 'PUT'){
                        not.detail = `${data.data.name} has been modified.`
                    }

                    ALPizza.not(not);
                } else if (data.errors){
                    ALPizza.not(data.errors[0]);
                }
            })
            .catch(err => {
                console.error(err.code + ': ' + err.message);
            })
    },
    not: function (not) {
        document.querySelector('.notification p:nth-child(1)').textContent = not.title;
        document.querySelector('.notification p:nth-child(2)').textContent = not.detail;
        
        document.querySelector(".notification").classList.remove("notificationHide");
        setTimeout(() => {
            document.querySelector(".notification").classList.add("notificationHide");
        }, 5000);
    },
    changeWidth: function () {
        let width = window.innerWidth;

        if (width < 550) {
            document.querySelector('#listTitle p:nth-child(3)').classList.add('hide');
            document.querySelectorAll('.staffLis p:nth-child(3)').forEach(item => item.classList.add('hide'));
            document.getElementById('listTitle').style.gridTemplateColumns = '1fr 1fr 1fr';
            if (document.querySelector('.staffLis')) {
                document.querySelector('.staffLis').style.gridTemplateColumns = '1fr 1fr 1fr';
            }

        } else {
            document.querySelector('#listTitle p:nth-child(3)').classList.remove('hide');
            document.querySelectorAll('.staffLis p:nth-child(3)').forEach(item => item.classList.remove('hide'));
            document.getElementById('listTitle').style.gridTemplateColumns = '1fr 1fr 1fr 1fr';
            if (document.querySelector('.staffLis')) {
                document.querySelector('.staffLis').style.gridTemplateColumns = '1fr 1fr 1fr 1fr';
            }
        }
    },
    taggleInputType: function (ops) {
        if (ops == "new") {
            if (document.querySelector('.newPasswordCtn>input').type == 'text') {
                document.querySelector('.newPasswordCtn>input').type = 'password';
            } else {
                document.querySelector('.newPasswordCtn>input').type = 'text';
            }
        } else {
            if (document.querySelector('.confirmPasswordCtn>input').type == 'text') {
                document.querySelector('.confirmPasswordCtn>input').type = 'password';
            } else {
                document.querySelector('.confirmPasswordCtn>input').type = 'text';
            }
        }
    },
    showLoading: function(){
        document.querySelector('.loadingOverlay').classList.remove('loadingOverlayHide');
    },
    hideLoading: function(){
        document.querySelector('.loadingOverlay').classList.add('loadingOverlayHide');
    }
}

ALPizza.init();