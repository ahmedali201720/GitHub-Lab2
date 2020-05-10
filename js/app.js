const input = document.getElementById("input"); // holds text from input task
const search = document.getElementById("search"); // holds values in search box
const assignedTo = document.getElementById("names"); // holds the name of designated
const filter = document.getElementById("filters"); // filters data
const list = document.getElementById("list"); // list that contains all tasks
const clear = document.querySelector(".clear"); // clear button
const date = document.getElementById("date");  // get element that holds date

const checked = "fa-check-circle";     // name of check icon
const unchecked = "fa-circle-thin";    // name of uncheck icon
const Line = "lineThrough"; // name of text decoration

search.addEventListener("change",SearchAction);
filter.addEventListener("change",FilterAction);

// variable to format date
const date_options = 
{
    weekday : "long",
    month:"short",
    day:"numeric"
};
const date_of_today = new Date();
const today = date_of_today.toLocaleDateString("en-US", date_options);
date.innerHTML = today;

// list that holds data of tasks and id of each one
let DataList, id;
// data variable holds the data in an item in local storage
let data = localStorage.getItem("MyTask");

if(data)
{
    DataList = JSON.parse(data);
    // get the length of data in the list and assign it to id variable to be a new id for next tasks.
    id = DataList.length;
    LoadData(DataList);
}
else
{
    id = 0 ;
    DataList = [] ;
}

//function that take datalist and add it elment by elemnt to the list shown.
function LoadData(data)
{
    data.forEach(function(i)
    {
        addToDo(i.designated , i.name, i.id, i.done, i.trash); // invoke add to do function each time
    });
}

clear.addEventListener("click", function()
{
    // clear local storage , the there is no data , reload and its cleared
    localStorage.clear();
    location.reload();
});

list.addEventListener("click", function(e)
{
    const element = e.target; // Get current element from list
    const job = element.attributes.job.value; // get the current job
    if(job == "complete")
    {
        completeToDo(element);
    }
    else if(job == "delete")
    {
        removeToDo(element);
    }
    localStorage.setItem("MyTask", JSON.stringify(DataList));
});

function addToDo(name , TaskToDo, id, isdone, isdeleted)
{
    if(isdeleted) return; 
    const done = isdone ? checked : unchecked;
    const line = isdone ? Line : "";
    const item = `<li class="item">
                    <i class="fa ${done} co" job="complete" id="${id}"></i>
                    <p class="text ${line}">${TaskToDo}</p>
                    <label>${name}</label>
                    <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                  </li>`;    
    list.insertAdjacentHTML("beforeend", item);
}

document.addEventListener("keyup",function(even)
{
    if(event.keyCode == 13)
    {
        const TaskToDo = input.value;
        if(TaskToDo)
        {
            addToDo(assignedTo.value, TaskToDo, id, false, false);
            DataList.push({
                name : TaskToDo,
                id : id,
                designated : assignedTo.value,
                date : today,
                done : false,
                trash : false
            });
           localStorage.setItem("MyTask", JSON.stringify(DataList)); 
            id++;
        }
        input.value = "";
    }
});

function completeToDo(TaskCompleted)
{
    TaskCompleted.classList.toggle(checked);
    TaskCompleted.classList.toggle(unchecked);
    TaskCompleted.parentNode.querySelector(".text").classList.toggle(Line);
    DataList[TaskCompleted.id].done = DataList[TaskCompleted.id].done ? false : true;
}

// function invoked when click remove
function removeToDo(TaskToDelete)
{
    TaskToDelete.parentNode.parentNode.removeChild(TaskToDelete.parentNode);
    DataList[TaskToDelete.id].trash = true;
}

function SearchAction()
{
    console.log("change");
    //*******************************

    let data = localStorage.getItem("MyTask");
    DataList = JSON.parse(data);

    var child = list.lastElementChild;  
    while (child) 
    { 
        list.removeChild(child); 
        child = list.lastElementChild; 
    } 
    DataList.forEach(function(i)
    {
        if(i.designated === search.value || i.name === search.value)
        {
           addToDo(i.designated , i.name, i.id, i.done, i.trash); // invoke add to do function each time
        }
    });
}

function FilterAction()
{
    let data = localStorage.getItem("MyTask");
    DataList = JSON.parse(data);

    var child = list.lastElementChild;  
    
    if(filter.value === "today")
    {
        while (child) 
        { 
            list.removeChild(child); 
            child = list.lastElementChild; 
        }
        DataList.forEach(function(i)
        {
           if(i.date === today)
           {
              addToDo(i.designated , i.name, i.id, i.done, i.trash); // invoke add to do function each time
           }
      });
    }
}

















