

var todoCollection = document.getElementsByClassName("card");
var todosArray = [];
var completedTodosArray = [];

var checkBox = document.getElementById("dateFilter");


showCards();
showList();


function showCards() {

    document.getElementById('cards').innerHTML = '';

    var i;
    for (i = 0; i < todosArray.length; i++) {
        var h3 = document.createElement("h3");
        var node2 = document.createTextNode(todosArray[i].title);
        h3.appendChild(node2);
    
        var para = document.createElement("p");
        para.setAttribute("class", "cardText");
        var node = document.createTextNode(todosArray[i].description);
        para.appendChild(node);
    
        var cardsDiv = document.getElementById("cards");
        var cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", "card");
        cardDiv.setAttribute("id", i);
    
        var btnWrapperDiv = document.createElement("div");
        btnWrapperDiv.setAttribute("class", "btnWrapper");
        
        var completeBtnDiv = document.createElement("button");
        completeBtnDiv.setAttribute("class", "completeBtn");
        completeBtnDiv.setAttribute("id", i);
        var node3 = document.createTextNode("complete");
        completeBtnDiv.appendChild(node3);
    
        var deleteBtnDiv = document.createElement("button");
        deleteBtnDiv.setAttribute("class", "deleteBtn");
        deleteBtnDiv.setAttribute("id", i);
        var node4 = document.createTextNode("delete");
        deleteBtnDiv.appendChild(node4);
    
        btnWrapperDiv.appendChild(completeBtnDiv);
        btnWrapperDiv.appendChild(deleteBtnDiv);
    
        cardDiv.appendChild(h3);
        cardDiv.appendChild(para);
        cardDiv.appendChild(btnWrapperDiv);
    
        cardsDiv.appendChild(cardDiv);
    } 

    updateClickListeners();
}


// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("todoBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

document.getElementById("form").addEventListener("submit", function(){
    let todoTitle = document.getElementById("form-title").value;
    let todoDesc = document.getElementById("form-description").value;
    let todoAuthor = document.getElementById("form-author").value;

    let todo = {
        title : todoTitle,
        description : todoDesc,
        author : todoAuthor,
        addedDate : new Date()
    }

    todosArray.push(todo);

    showCards();
    modal.style.display = "none";
    document.getElementById("form").reset();
    document.getElementById("charactersLeft").innerHTML = "(30 characters left)";
});



function updateClickListeners(){
    var dbElements = document.getElementsByClassName("deleteBtn");

    var myDeleteFunction = function() {
        let id = event.target.id;
        //document.getElementById("logo").innerHTML = "HIOF - deleteId: " + id;

        todosArray.splice(id, 1);
        showCards();
    };

    for (var i = 0; i < dbElements.length; i++) {
        dbElements[i].addEventListener('click', myDeleteFunction, false);
    }


    var cbElements = document.getElementsByClassName("completeBtn");

    var myCompleteFunction = function() {
        let id = event.target.id;
        //document.getElementById("logo").innerHTML = "HIOF - completeId: " + id;
        let todo = todosArray[id];
        todo.completedDate = new Date();

        completedTodosArray.push(todo);
        todosArray.splice(id, 1);
        showCards();
        showList();

        //document.getElementById("logo").innerHTML = "HIOF - compTodosArrLength: " + completedTodosArray.length;
    };

    for (var i = 0; i < cbElements.length; i++) {
        cbElements[i].addEventListener('click', myCompleteFunction, false);
    }

}

function showList(){

    document.getElementById('list').innerHTML = '';

    if(checkBox.checked == false){
        sortListByTitle();
    }
    else{
        sortListByDate();
    }

    var i;
    for (i = 0; i < completedTodosArray.length; i++) {

        var compDate = completedTodosArray[i].completedDate;
        var dd = String(compDate.getDate()).padStart(2, '0');
        var mm = String(compDate.getMonth() + 1).padStart(2, '0');
        var yy = compDate.getFullYear().toString().substr(-2);;

        compDate = mm + '.' + dd + '.' + yy;

        var titleSpan = document.createElement("span");
        titleSpan.setAttribute("class", "title");
        var node3 = document.createTextNode(completedTodosArray[i].title);
        titleSpan.appendChild(node3);

        var authorSpan = document.createElement("span");
        authorSpan.setAttribute("class", "author");
        var node4 = document.createTextNode(completedTodosArray[i].author);
        authorSpan.appendChild(node4);

        var descriptionSpan = document.createElement("span");
        descriptionSpan.setAttribute("class", "description");
        var node5 = document.createTextNode(completedTodosArray[i].description);
        descriptionSpan.appendChild(node5);

        var completedDateSpan = document.createElement("span");
        completedDateSpan.setAttribute("class", "completedDate");
        var node6 = document.createTextNode(compDate);
        completedDateSpan.appendChild(node6);

        var liElement = document.createElement("li");
        liElement.appendChild(titleSpan);
        liElement.appendChild(authorSpan);
        liElement.appendChild(descriptionSpan);
        liElement.appendChild(completedDateSpan);

        var completedTodosList = document.getElementById("list");

        completedTodosList.appendChild(liElement);

    }
}

function sortListByTitle(){
    completedTodosArray.sort(function(a, b){
        if(a.title < b.title) { return -1; }
        if(a.title > b.title) { return 1; }
        return 0;
    });
}

function sortListByDate(){
    completedTodosArray.sort(function(a,b){
        return b.completedDate.getTime() - a.completedDate.getTime()
    });
}


document.getElementById("dateFilter").addEventListener("change", function(){
    showList();
});

document.getElementById("form-description").addEventListener("input",function(){
    let nr = document.getElementById("form-description").value.length;
    nr = 30 - nr;
    document.getElementById("charactersLeft").innerHTML = "(" + nr + " characters left)";
});


