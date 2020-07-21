class UserInputs {
    constructor(id, title, post) {
        this.id = id;
        this.title = title;
        this.post = post;
    }
}

class UI {
    inputEdit(){
        return {
            title: document.querySelector('#title').value,
            post: document.querySelector('#message').value
        }
    }
    // add post to UI using template strings
    addPost(item) {
        const html = document.querySelector('.post-list');
        const post = `<div class="card post-card mb-3" data-id=${item.id}>
        <div class="card-body">
         <h4>${item.title}</h4>
         <p>${item.post}</p>
         <div class="d-inline"><a href="#" class="btn btn-info btn-sm edit"><i class="fa fa-pencil"></i> EDIT</a></div>
         <a href="#" class="btn btn-danger btn-sm del"><i class="fa fa-trash-o"></i> DELETE</a>
        </div>
     </div>`;
     html.innerHTML += post;
    }

    showAlert(alertName) {
        document.querySelector(alertName).classList.add('showAlert');
        setTimeout(()=>{
            document.querySelector(alertName).classList.remove('showAlert');   
        }, 3000)
    }


    clearInput(){
        document.querySelector('#title').value = '';
        document.querySelector('#message').value = '';

    }

    deletePostFromUi(postItem){
        if(postItem.classList.contains('del')){
            postItem.parentElement.parentElement.remove();
            this.showAlert('.danger-alert');
        }
    }

    editState(item){
        if(item.classList.contains('edit')){
            const id = +item.parentElement.parentElement.parentElement.dataset.id;
            console.log(id);
            const LIST = Store.getPostFromLs();
            let filter = LIST.find(list => list.id === id);
            console.log(filter);
            document.querySelector('#title').value = filter.title;
            document.querySelector('#message').value = filter.post;
            document.querySelector('#update-btn').setAttribute('data-id', id);

            this.inEditMode();
           
        }

        
    }


    updateEdit(item){
        const id = +item.dataset.id;
        const input = this.inputEdit();
        let LIST = Store.getPostFromLs();
        LIST =  LIST.map(x => {
           if(x.id === id){
            x.title = input.title;
            x.post = input.post;
           }
           return x;
       });
        this.UpdateInUi(LIST);
        localStorage.setItem('list', JSON.stringify(LIST)); 
        this.showAlert('.warning-alert');

    }

    UpdateInUi(items){
        const html = document.querySelector('.post-list');
        let output = '';
        items.forEach(item => {
            output += `<div class="card post-card mb-3" data-id=${item.id}>
            <div class="card-body">
             <h4>${item.title}</h4>
             <p>${item.post}</p>
             <div class="d-inline"><a href="#" class="btn btn-info btn-sm edit"><i class="fa fa-pencil"></i> EDIT</a></div>
             <a href="#" class="btn btn-danger btn-sm del"><i class="fa fa-trash-o"></i> DELETE</a>
            </div>
         </div>`
        })
        html.innerHTML = output;
        this.outOfEditMode();
    }

    inEditMode(){
        document.querySelector('#post-btn').classList.add('d-none');
        document.querySelector('#update-btn').classList.remove('d-none');
        document.querySelector('#back-btn').classList.remove('d-none');

    }

    outOfEditMode(){
        document.querySelector('#post-btn').classList.remove('d-none');
        document.querySelector('#update-btn').classList.add('d-none');
        document.querySelector('#back-btn').classList.add('d-none');
        document.querySelector('#title').value = '';
        document.querySelector('#message').value = '';

    }

    

    
}

class Store {
    static addPostToLs(item){
        const LIST = Store.getPostFromLs();
        LIST.push(item);
        localStorage.setItem('list', JSON.stringify(LIST));
    }

    static getPostFromLs(){
        let LIST;
        if(localStorage.getItem('list') === null){
            LIST = [];
        }else{
            LIST = JSON.parse(localStorage.getItem('list'));
        }
        return LIST;
    }

    static deletePostFromLs(item){
        const LIST = Store.getPostFromLs();
        LIST.forEach((list, index)=> {
            if(list.id === +item){
                LIST.splice(index, 1);
            }
        })
        localStorage.setItem('list', JSON.stringify(LIST));
    }

    static displayLSList(){
        const LIST = Store.getPostFromLs();
        const ui = new UI();
        LIST.forEach(list => {
            ui.addPost(list);
        })
    }
}


// LIST OF EVENTS
document.querySelector('#post-btn').addEventListener('click', (e) => {
    const title = document.getElementById('title').value;
    const post = document.getElementById('message').value;

    // increament ID
    let ID;
    const LIST = Store.getPostFromLs();
    if(LIST.length > 0){
       ID =  LIST[LIST.length - 1].id + 1;
    }else{
        ID = 0
    }

    // create new object
    const data = new UserInputs(ID, title, post);
    const ui = new UI();

    // make sure inputs are filled
    if (title !== '' && post !== '') {
        ui.addPost(data);
        ui.showAlert('.success-alert');
        Store.addPostToLs(data);
        ui.clearInput();
    }

    e.preventDefault();
})

document.querySelector('.post-list').addEventListener('click', (e) => {
    const ui = new UI();
    ui.deletePostFromUi(e.target);
    Store.deletePostFromLs(e.target.parentElement.parentElement.dataset.id);
    e.preventDefault();
})

document.querySelector('.post-list').addEventListener('click', (e) => {
    const ui = new UI();
    ui.editState(e.target);
    e.preventDefault();
})

document.querySelector('#update-btn').addEventListener('click', (e)=>{
    const ui = new UI();
    ui.updateEdit(e.target);
    e.preventDefault();
})

document.querySelector('#back-btn').addEventListener('click', (e)=>{
    const ui = new UI();
    ui.outOfEditMode();
    e.preventDefault();
})


document.addEventListener('DOMContentLoaded', ()=>{
    Store.displayLSList();
})