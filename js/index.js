class App {
    constructor() {
        this.category = [
            'all',
            'breakfast',
            'soups',
            'garnish',
        ]
        this.dishes = [];
        this.visibleDishes = [];
        this.cart = [];
        this.totalCount = 0;
        this.totalPrice = 0;
        this.productsItems = document.querySelectorAll('.product-box__item');
    }

    getDishes() {
        let productCategory = '', productPrice = 0, productObject = {};
        this.productsItems.forEach((el, i) => {
            productCategory = el.dataset.cat;
            productPrice = el.querySelector('p[data-price]').innerHTML;
            productObject = {
                'product': el,
                'category': +productCategory,
                'price': parseInt(productPrice),
            }
            this.dishes.push(productObject)
        })
    }

    renderDishes(){
        this.dishes.forEach((el) => {
            if(this.visibleDishes.includes(el)){
                el.product.style.display = 'flex'
            }else{
                el.product.style.display = 'none'
            }
        })
    }

    filterDishes(catValue, priceVal){
        this.visibleDishes = [];

        if(catValue > 0 && priceVal > 0){
            this.visibleDishes = this.dishes.filter(dish => dish.category === catValue && dish.price <= priceVal)
        }else if(priceVal === 0 && catValue > 0){
            this.visibleDishes = this.dishes.filter(dish => dish.category === catValue)
        }else if(catValue === 0 && priceVal > 0 ){
            this.visibleDishes = this.dishes.filter(dish => dish.price <= priceVal)
        }else{
            this.visibleDishes = this.dishes.slice();
        }

        this.renderDishes()
    }


    filterHandler(cat, price) {
        const filterCat = document.querySelector(cat),
            filterPrice = document.querySelector(price);

        filterCat.addEventListener('change', (ev) => {
            this.filterDishes(+filterCat.value, +filterPrice.value);
        })

        filterPrice.addEventListener('change', (ev) => {
            this.filterDishes(+filterCat.value, +filterPrice.value);
        })
    }

    validateCount(){
        let inputs = document.querySelectorAll('.qty__item');
        inputs.forEach((inp, i) => {
            inp.addEventListener('change', () =>{
                if(inp.value < 0){
                    inp.value = 0;
                }
            })
        })

    }

    addToCart(){
        this.dishes.forEach((dish) => {
            let btn = dish.product.querySelector('.product-box__btn');
                 btn.addEventListener('click', () => {
                     let count = parseInt(dish.product.querySelector('.qty__item').value);
                     count = isNaN(count) ? 1 : count;
                     this.cart.push({dish: dish, count: count});
                     this.calculatePrice(this.cart);
            })
        });
    }

    calculatePrice(cart){
        this.totalCount = 0;
        this.totalPrice = 0;

        const quantityOutput = document.querySelector('#total-count'),
            priceOutput = document.querySelector('#total-price');

        cart.forEach((item)=>{
            this.totalPrice+= item.count * item.dish.price;
            this.totalCount += item.count;
        })

        quantityOutput.innerHTML = this.totalCount;
        priceOutput.innerHTML = this.totalPrice;
    }

    createModal(){
        if(!document.querySelector('.checkout-modal')) {
            let modal = document.createElement("div"),
                form = document.createElement("form"),
                nameInp = document.createElement("input"),
                emailImp = document.createElement("input"),
                submit = document.createElement("button");


            nameInp.setAttribute("type", "text");
            nameInp.setAttribute("name", "Name");
            nameInp.setAttribute("placeholder", "Имя");

            emailImp.setAttribute("type", "email");
            emailImp.setAttribute("name", "Email");
            emailImp.setAttribute("placeholder", "Email");

            submit.setAttribute("type", "submit");
            submit.classList.add('btn-check');
            submit.innerText = "Отправить";

            modal.classList.add('checkout-modal');
            form.appendChild(nameInp);
            form.appendChild(emailImp);
            form.appendChild(submit);
            modal.appendChild(form);

            document.body.appendChild(modal);

            form.addEventListener('submit', (ev) => {
                ev.preventDefault();

                let name = nameInp.value.trim(),
                    email = emailImp.value.trim();

                nameInp.value = name;
                emailImp.value = email;

                if(name.length > 0 && email.length > 0){
                    alert('Спасибо за покупку');
                    this.cart = [];
                    this.deleteModal();
                }else{
                    alert('Заполните пожалуйста все поля');
                }
            })

            modal.addEventListener('click', (ev)=> {
                let target = ev.target;
                if(target.classList.contains('checkout-modal')){
                    modal.remove();
                }
            });
        }
    }

    deleteModal(){
        const modal = document.querySelector('.checkout-modal');
        modal.remove();
    }

    checkoutHandler(){
        const checkoutBtn = document.querySelector('#btn-check');
        checkoutBtn.addEventListener('click', () => {
            this.createModal();
        })
    }


    init() {
        this.getDishes();
        this.filterHandler('#category', '#price');

        this.addToCart();
        this.validateCount();

        this.calculatePrice(this.cart);

        this.checkoutHandler();
    }
}

window.document.addEventListener("DOMContentLoaded", () => {
    window.app = new App();
    window.app.init();
})