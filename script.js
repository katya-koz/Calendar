/*
Users can check the current list of todo items. ✅
Every item specifies which day, month, and year it is due. ✅
Every item also specifies which level of importance it is (0, !, !!, !!!). ✅
Users can add items to the todo list for any day, month, year. ✅
Users can cross off items in the todo list as finished. ✅
Users can read a list of completed items. ✅
Users can undo a crossed off item (put it back in the todo list). ✅
Create a UML diagram to indicate the relationship between your classes. ✅

Create a todo list that works with a HTML, CSS graphical component. ✅
There is a filter feature which filters items via their level of importance ✅
The items in the todo list can belong in categories (homework, tests, chores, etc)✅
Users can also filter items via their category✅

The todo list also comes with a graphical calendar. To do so, you will likely need to use the Date object in JS or use a library like date-fns. ✅    
The calendar will display when items are due and how many items are due that day. ✅
The calendar will display one month at a time. ✅
There are two buttons that can be pressed to change which month is displayed. ✅
The calendar only has to work for the years 2022 - 2100. ✅

Bonus 1 (+5 %)
Create a notes section for each item so that the user can type a note and leave it in the item
The note can be read when viewing the item individually

Bonus 2 (+5 %)
The items in the todo list can be edited (name, due date, etc)

create ui class with a bunch of methods in there to load pages/render✅
*/
let currentPage;
let currentDate = new Date(); // date at initiliaztion 
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();

let selectedColumn; // represents the column in the calendar which the selected cell exists
let selectedRow; // row selected cell resides


const months = ["January ❄️", "Febuary 💘", "March 🦋", "April 🌧️", "May 🌷", "June 🌻", "July 🐬", "August ☀️", "September 🍁", "October 🎃", "November 🍂", "December ⛄️"]; //pretty emojis to translate month number to words

importanceInnerText = ["0", "!", "!!", "!!!"]; // inner text for importance drop down (global since used by multiple classes)
val = ["0", "1", "2", "3"]; // values for importance drop down  (global since used by multiple classes)

const calendarStorage = {} // stores all calendars
/* eg:
const calendarStorage = {
2022: {0: calendar, 1: calendar},
2023: {3: calendar}

} */
const allItemsStorage = []; // stores all the items... just a simple array :)

const categoryStorage = [categoryDefault = { title: 'General', color: "dbdbdb", element: document.createElement("div") }]; // initialize categories with a 'default', empty category 

function accessStorage() { // this is a global function which accesses the storage, checks if theres a calendar stored for the corresponding year and month, and if there isnt, the function creates one
  if (calendarStorage[currentYear] === undefined) { //if the year deosnt exist
    let obj = { // this is the way i was able to create a nested object :))
    }
    obj[currentMonth] = new Calendar();
    calendarStorage[currentYear] = obj;
  }
  else if (calendarStorage[currentYear][currentMonth] === undefined) { // if the month doesnt exist
    calendarStorage[currentYear][currentMonth] = new Calendar();
  }
  currentCalendar = calendarStorage[currentYear][currentMonth]; // declare current calendar 
}
function clearUI(parent) { // this function clears the ui
  primaryParentElement = document.getElementById(parent);
  while (primaryParentElement.firstChild) { // while the parent element still has children, remove them
    primaryParentElement.removeChild(primaryParentElement.firstChild);
  }
}

class RemoveButton { // this class represents an x button which is attached to every single item element. clicking this button will remove the item from the calendar storage as well as the allItemsStorage. it will then reload the page to redraw the elements (without the one you removed, obviously)
  constructor(year, month, itemId, row, column) { // these parameters are directly taken from the item class 
    this.element = document.createElement("button");
    this.element.setAttribute("class", "RemoveButton");
    this.element.innerText = "x";
    // date and location (row n column) items are tied to the item which the remove button is attached to so that the button can properly locate them in the storage, and... remove them!
    this.year = year;
    this.month = month;
    this.itemId = itemId;
    this.row = row;
    this.column = column;

    this.element.addEventListener("click", () => this.handleRemoveButtonClick());
  }
  handleRemoveButtonClick() { // actually handles removing and redrawing 
    // find index of the item the removeButton is attached to using the itemId in the calendarStorage
    this.index = calendarStorage[this.year][this.month].cells[this.row][this.column].toDoList.findIndex(object => {
      return object.itemId === this.itemId;
    });
    // use that index to remove the item in calendarStorage (i know the location is a bit of a mouthfull lol.. youll be seeing a lot more of that)
    calendarStorage[this.year][this.month].cells[this.row][this.column].toDoList.splice(this.index, 1);

    // do the same thing above, but for the 'allItemsStorage'
    this.index = allItemsStorage.findIndex(object => {
      return object.itemId === this.itemId;
    });
    allItemsStorage.splice(this.index, 1);

    //redrawing::: first, clear the page
    clearUI("first-parent");
    if (currentPage === "allItemsPage") { // check which page user is on, and redraw
      new AllItemsPage();
    } else if (currentPage === "completedItemsPage") {
      new CompletedItemsPage();
    } else if (currentPage === "calendarPage") {
      new CalendarPage();
    }
  }
}
class Importance { // class created to represent importance in an element
  constructor() {
    this.level = document.getElementById("input-importance").value
    this.element = document.createElement("div");
    this.element.innerText = importanceInnerText[this.level];
  }
}
class Category { // class created by createNewCategory page. when being applied to an item, this class is rather located in the categoryStorage, applying its attributes to the item, instead of being created in the item class
  constructor(color) {
    this.title = document.getElementById("input-category").value;
    this.color = color;
    this.element = document.createElement("div");
    this.element.innerText = this.title;
  }
}
class CreationDate { //simply a class to encapsulate the date an item was created
  constructor(year, month, date) {
    this.element = document.createElement("div");
    this.element.innerText = months[month] + " " + date + ", " + year;
  }
}
class ExpandButton {
  // this little button is similar to the removeButton in which it's attached to the item it corresponds to. clicking the expand button will show more fields of the item (date created, notes, importance)
  constructor(itemElement, notes, itemId, importance, creationDate) {
    this.element = document.createElement("button");
    this.element.setAttribute("class", "ExpandButton");
    this.element.innerText = "Expand";

    this.notes = notes;
    this.expanded = false;
    this.parentItemElement = itemElement;
    this.parentItemId = itemId;
    this.importance = importance;
    this.creationDate = creationDate;

    this.element.addEventListener("click", () => this.handleExpandButtonClick());
  }
  handleExpandButtonClick() {
    // essentially, clicking this button will draw in the expanded elements (date created, importance... etc) and will attach them to the parentItem (identified by "parentItemId")
    if (this.expanded === false) { // only expand if not already expanded

      this.noteElement = document.createElement("div");
      this.noteElement.setAttribute("id", "notes");
      this.noteElement.innerText = this.notes;

      this.parentItemElement.appendChild(this.importance.element);
      this.parentItemElement.appendChild(this.creationDate.element);
      this.parentItemElement.appendChild(this.noteElement);

      this.expanded = true;
      this.element.innerText = "Minimize";
    } else { // otherwise, close expanded tab 
      clearUI("expanded" + this.parentItemId);
      this.expanded = false;
      this.element.innerText = "Expand";
    }
  }
}
class ItemDisplay { // this is the actual item title element. i made it seperate so it can have a an event listener only applied to this element, not the whole item class (it would be difficult to press the bttons otherwise)
  constructor(title) {
    this.element = document.createElement("li");
    this.element.setAttribute("class", "ItemDisplay");
    this.element.innerText = title;
  }
}
class CalendarItemElement { // this is the element displayed in the calendar cells to represent the items 
  constructor(selectedCellId, title, color) {
    this.title = title;
    this.color = color;
    this.selectedCell = document.getElementById(selectedCellId);
    this.element = document.createElement("div");
    this.element.setAttribute("id", "visual-element");
    this.element.setAttribute("class", "visual-calendar-items")
    this.element.innerText = this.title;
    this.element.style.backgroundColor = this.color;
  }
}
class Item {
  completion = false; // by default, all to do items are incomplete
  constructor(idToSet) { //id to set corresponds the the index the item exists in the allItemsStorage
    this.element = document.getElementById(idToSet),

      this.year = currentCalendar.cells[selectedRow][selectedColumn].year;
    this.month = currentCalendar.cells[selectedRow][selectedColumn].month;
    this.date = currentCalendar.cells[selectedRow][selectedColumn].date;
    this.time = new Date(this.year, this.month, this.date);
    this.time = this.time.getTime();

    this.column = selectedColumn;
    this.row = selectedRow;
    this.itemId = idToSet;

    this.title = document.getElementById("input-list-item").value;
    this.note = document.getElementById("note-input").value;

    this.itemDisplay = new ItemDisplay(this.title); //create an item display element from the title
    this.element.appendChild(this.itemDisplay.element);
    this.itemDisplay.element.addEventListener("click", () => this.handleClick()); // add the event listener for when the item TITLE element gets clicked on

    this.categoryInput = document.getElementById("input-category").value;
    // as i mentioned previously, the category objcet is created in a different page. when being applied to an item, it is serached for by the title of the category, and its attributes are appled to the item
    this.index = categoryStorage.findIndex(object => {
      return object.title === this.categoryInput;
    });
    this.category = categoryStorage[this.index];
    this.element.appendChild(this.category.element);
    this.element.style.backgroundColor = this.category.color;

    this.importance = new Importance();
    this.creationDate = new CreationDate(this.year, this.month, this.date);
    this.removeButton = new RemoveButton(this.year, this.month, this.itemId, this.row, this.column);

    this.element.appendChild(this.removeButton.element);

    this.expanse = document.createElement("div"); // element where the expanded items will append to 
    this.expanse.setAttribute("id", "expanded" + this.itemId);
    this.element.appendChild(this.expanse);

    this.expandButton = new ExpandButton(this.expanse, this.note, this.itemId, this.importance, this.creationDate);
    this.element.appendChild(this.expandButton.element);

    this.calendarCellItem = new CalendarItemElement(currentCalendar.cells[selectedRow][selectedColumn].id, this.title, this.category.color); // this is the element displayed in the calendar cells to represent the item
  }
  handleClick() {
    if (this.completion === false) { // mark item as completed/incomplete when clicked
      this.element.style.textDecoration = "line-through";
      this.completion = true;
    } else {
      this.completion = false;
      this.element.style.textDecoration = "none";
      if (currentPage === "completedItemsPage") {
        clearUI("first-parent"); // first parent is an element (actually hardcoded into the html), to which every new page created can append to 
        new CompletedItemsPage(); // if on completeditemspage, redraw page to make sure the item disappears if clicked on (if its in completed items, and someone clicks on it, it marks its completion as false again thus removing it from the list... the page just needs to be redrawn)
      }
    }
  }
}
class Cell { // cell which belongs to the calendar
  static prevElement; // represents the previous selected element
  toDoList = []; //  items belonging to cell are stored here, in this simple array.
  cellItemElements = [];
  constructor(n, date) {
    this.fullDate = date;
    this.year = this.fullDate.getFullYear();
    this.month = this.fullDate.getMonth();
    this.date = this.fullDate.getDate();

    this.id = (n); // id relative to the entire calendar
    this.element = document.getElementById(n);
    this.element.addEventListener('click', () => this.handleClick());
  }
  handleClick() { // display clicked cell on to do list board
    selectedRow = ((((7 - this.id % 7) + this.id) / 7) - 1); // this equation ties the cell's id relative to the entire calendar, to the row its in
    selectedColumn = this.id - (7 * selectedRow); // finds column cell is in
    if (this.element != Cell.prevElement) { // if the current element the user is trying to select is not the same as the previously selected element, set this.element to the selected cell
      this.element.setAttribute("class", "cell selected-cell");
      if (Cell.prevElement != undefined) { // set the previous cell's id to its original class (if the previous cell exists)
        Cell.prevElement.setAttribute("class", "cell");
      }
      Cell.prevElement = this.element; // call the 'previous cell' which will be the current cell in the current method run; when another cell is clicked next time, it will function as the previous cell
    }
    this.displayToDo(); // will then call to display the to do list for the cell that was clicked on
  }
  renderItems(i) { // renders the elements for the items that belong to the cells
    this.toDoEntry = document.createElement("li");
    this.toDoEntry.setAttribute("id", "item" + i);
    this.toDoListParent.appendChild(currentCalendar.cells[selectedRow][selectedColumn].toDoList[i].element);
  }
  displayToDo() {
    this.toDoListParent = document.getElementById("to-do-list");
    clearUI("to-do-list"); // clear old to do list
    for (let i = 0; i < currentCalendar.cells[selectedRow][selectedColumn].toDoList.length; i++) {
      this.renderItems(i);// render items thru selected cell's toDoList
    }
  }
}
class DisabledCell {
  #fullDate;
  element;
  constructor(n, date) {
    this.#fullDate = date;
    this.date = this.#fullDate.getDate();
    this.id = n; // id relative to the entire calendar
    this.element = document.getElementById(n);
    this.element.setAttribute("class", "disabledCell");
  }
}
class Calendar { // calendar woooo!
  cells; // calendar has a cells array, and a first day (where the dates start)
  firstDay;
  lastDay;
  getDate() {
    this.firstDay = new Date(currentYear, currentMonth, 1);
    this.firstDay = this.firstDay.getDay(); // day of the week the 1st lands on

    this.lastDay = new Date(currentYear, currentMonth + 1, 0);
    this.lastDay = this.lastDay.getDate();
  }
  constructor() {
    this.getDate(); // call getDate function to grab first and last day
    this.cells = [];
    for (let i = 0; i < 6; i++) { // create a cells array for every row
      this.cells.push([]);
      for (let j = 0; j < 7; j++) { // populate it with cells for each day of the week
        let cell;
        if ((i * 7 + j) < this.firstDay || (i * 7 + j) > this.lastDay + (this.firstDay - 1)) { // if the cell is within the treshhold of the previous or next month, disable it
          cell = new DisabledCell((i * 7 + j), (new Date(currentYear, currentMonth, (i * 7 + j) - this.firstDay + 1)));
        } else { // otherwise, add this cell as normal 
          cell = new Cell((i * 7 + j), (new Date(currentYear, currentMonth, (i * 7 + j) - this.firstDay + 1)));
        }
        this.cells[i].push(cell);
      }
    }
  }
}
class CalendarPage {
  static daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  constructor() {
    // the code below is pretty redundant... just creating elements and appending them to one another, following a hierarchy
    this.primaryParentElement = document.getElementById("first-parent");

    document.getElementById("body").appendChild(this.primaryParentElement);

    //display date and nav buttons row
    this.dateAndNavButtons = document.createElement("div");
    this.dateAndNavButtons.setAttribute("id", "date-and-nav-buttons");
    this.primaryParentElement.appendChild(this.dateAndNavButtons);
    this.previousButton = document.createElement("button");
    this.previousButton.setAttribute("id", "previous-page");
    this.dateAndNavButtons.appendChild(this.previousButton);
    this.previousButton.innerText = "<"
    this.previousButton.setAttribute("class", "page-nav");
    this.previousButton.addEventListener('click', () => this.changePage("previous"));

    this.displayDate = document.createElement("h1");
    this.displayDate.setAttribute("id", "current-date");
    this.dateAndNavButtons.appendChild(this.displayDate);
    this.displayDate.innerText = (months[currentMonth] + " " + currentYear);

    this.nextButton = document.createElement("button");
    this.nextButton.setAttribute("id", "next-page");
    this.nextButton.setAttribute("class", "page-nav");
    this.dateAndNavButtons.appendChild(this.nextButton);
    this.nextButton.innerText = ">"
    this.nextButton.addEventListener('click', () => this.changePage("next"));

    // contains to do list, calendar, and ui
    this.mainInterface = document.createElement("div");
    this.mainInterface.setAttribute("id", "to-do-and-calendar");

    this.primaryParentElement.appendChild(this.mainInterface);

    //display user input row
    this.userInterfaceColumn = document.createElement("div");
    this.mainInterface.appendChild(this.userInterfaceColumn);
    this.userInterfaceColumn.setAttribute("id", "ui-column");

    // user text input
    this.userInput = document.createElement("input");
    this.userInput.setAttribute("id", "input-list-item");
    this.userInput.setAttribute("placeholder", "Add event here.")
    this.userInterfaceColumn.appendChild(this.userInput);

    // importance dropDown
    this.importanceDropMenu = document.createElement("select");
    this.importanceDropMenu.setAttribute("id", "input-importance");
    this.userInterfaceColumn.appendChild(this.importanceDropMenu);

    for (let i = 0; i < val.length; i++) {
      this.selectOption = document.createElement("option");
      this.selectOption.setAttribute("value", val[i]);
      this.selectOption.innerText = importanceInnerText[i];
      this.importanceDropMenu.appendChild(this.selectOption);
    }
    //category drop down 
    this.categoryDropMenu = document.createElement("select");
    this.categoryDropMenu.setAttribute("id", "input-category");
    this.userInterfaceColumn.appendChild(this.categoryDropMenu);
    for (let i = 0; i < categoryStorage.length; i++) {
      this.selectOption = document.createElement("option");
      this.selectOption.setAttribute("value", categoryStorage[i].title);
      this.selectOption.innerText = categoryStorage[i].title;
      this.categoryDropMenu.appendChild(this.selectOption);
    }

    //notes
    this.noteInput = document.createElement("TEXTAREA");
    this.noteInput.setAttribute("id", "note-input");
    this.noteInput.setAttribute("placeholder", "Add notes here.");
    this.userInterfaceColumn.appendChild(this.noteInput);

    //add button
    this.addButton = document.createElement("button");
    this.addButton.setAttribute("id", "add-button")
    this.addButton.addEventListener('click', () => this.addButtonClick());
    this.userInterfaceColumn.appendChild(this.addButton);
    this.addButton.innerText = "Add";

    //to do list 
    this.toDoList = document.createElement("div");
    this.toDoList.setAttribute("id", "to-do-list");

    this.mainInterface.appendChild(this.toDoList);

    // create calendar day elements
    this.calendar = document.createElement("div");
    this.calendar.setAttribute("class", "calendar");

    this.mainInterface.appendChild(this.calendar);

    //days of the week
    this.daysCalendar = document.createElement("div");
    this.daysCalendar.setAttribute("id", "days-container");
    this.calendar.appendChild(this.daysCalendar);

    for (let i = 0; i < CalendarPage.daysOfTheWeek.length; i++) {
      this.day = document.createElement("h4");
      this.day.setAttribute("id", "days-of-the-week");
      this.day.innerText = CalendarPage.daysOfTheWeek[i];
      this.daysCalendar.appendChild(this.day);
    }
    //create cells for calendar
    for (let i = 0; i < 6; i++) {
      this.row = document.createElement("div");
      this.row.setAttribute("class", "row");
      this.row.setAttribute("id", "row" + i);
      this.calendar.appendChild(this.row);
      for (let j = 0; j < 7; j++) {
        this.cell = document.createElement("div");
        this.cell.setAttribute("class", "cell");
        this.cell.setAttribute("id", i * 7 + j);
        this.row.appendChild(this.cell);
      }
    }
    accessStorage(); // access storage to declare currentCalendar
    this.loadCellElements();
    this.changeDate();
  }
  changeDate() { // change the display date
    this.displayDate = document.getElementById("current-date");
    this.displayDate.innerText = (months[currentMonth] + " " + currentYear);
  }
  loadCellElements() {
    for (let i = 0; i < 6; i++) { //fpr every calendar row...
      for (let j = 0; j < 7; j++) {  // for every column...
        document.getElementById("row" + i).replaceChild(currentCalendar.cells[i][j].element, document.getElementById(i * 7 + j)); // replace the cells currently being displayed with the cells that are stored in the calendar
        document.getElementById(i * 7 + j).innerText = currentCalendar.cells[i][j].date;// set each cell's innertext to its date 
        if (currentCalendar.cells[i][j].toDoList) { // if the cell's toDoList has any items in it, render their visual elements in the calendar
          for (let n = 0; n < currentCalendar.cells[i][j].toDoList.length; n++) { //for every item in the cell's toDoList....
            document.getElementById(i * 7 + j).appendChild(currentCalendar.cells[i][j].toDoList[n].calendarCellItem.element);
          }
        }
      }
    }
  }
  addButtonClick() { // this function runs when the 'add' button is clicked
    if (selectedColumn === undefined || selectedRow === undefined) {
      alert("Please select a day!");
    } // alert user if they are attempting to add an item without selecting a cell
    this.selectedCell = currentCalendar.cells[selectedRow][selectedColumn];
    this.toDoEntry = document.createElement("div");
    this.toDoEntry.setAttribute('class', "Item"); //create a div element for the to do list entry 
    this.toDoEntry.setAttribute("id", ("item" + (allItemsStorage.length)));

    document.getElementById("to-do-list").appendChild(this.toDoEntry);
    this.selectedCell.toDoList.push(new Item("item" + (allItemsStorage.length)));
    allItemsStorage.push(this.selectedCell.toDoList[this.selectedCell.toDoList.length - 1]); // push last (most recent) item in toDoList to all items list
    this.selectedCell.element.appendChild(this.selectedCell.toDoList[this.selectedCell.toDoList.length - 1].calendarCellItem.element); // append calendar's visual elemetn to the correspondig cell

    allItemsStorage.sort((a, b) => { // sort the items alphabetically so they display in order
      return a.time - b.time;
    });
    this.userInput.value = "";
  }
  changePage(direction) { // handle changing the page
    if (direction === "next") {
      if (currentMonth === 11) { // if month is december, and you're moving forward, add 1 to the year
        currentYear += 1;
        currentMonth = 0;
      }
      else {
        currentMonth += 1;
      }
    }
    else if (direction === "previous") {
      if (currentMonth === 0) { // if month is jan, and you're moving backward, add 1 to the year
        currentYear -= 1;
        currentMonth = 11;
      }
      else {
        currentMonth -= 1;
      }
    }

    clearUI("first-parent");
    new CalendarPage(); //first clear old calendarpage, then create a new one
    accessStorage();  // access storage, delcare new currentcalender (or fetch preloaded)
    this.loadCellElements();
    this.changeDate();
  }
}

class AllItemsPage {
  static filterKey;
  static isFiltered = false; //by default, this page is not filtered 
  renderItems(i) {
    this.toDoListParent = document.getElementById("all-items-list");
    this.toDoListParent.appendChild(allItemsStorage[i].element);
  }
  constructor() {
    //again... this part is super redundant.. just rendering in the html element
    this.primaryParentElement = document.getElementById("first-parent");

    //display date and nav buttons row
    this.secondaryParentElement = document.createElement("div");
    this.secondaryParentElement.setAttribute("id", "page-title");

    this.primaryParentElement.appendChild(this.secondaryParentElement);

    //title
    this.pageTitle = document.createElement("h1");
    this.secondaryParentElement.appendChild(this.pageTitle);
    this.pageTitle.innerText = "To Do";

    this.secondaryParentElement = document.createElement("div");
    this.secondaryParentElement.setAttribute("id", "filters");
    this.primaryParentElement.appendChild(this.secondaryParentElement);
    //filters
    for (let i = 0; i < val.length; i++) {
      this.importanceFilter = document.createElement("button");
      // this.idToSet = "filter" + i;
      this.importanceFilter.setAttribute("id", "filter" + i);
      this.importanceFilter.setAttribute("class", "importance-filter-button");
      this.secondaryParentElement.appendChild(this.importanceFilter);
      this.importanceFilter.innerText = importanceInnerText[i];
      this.importanceFilter.addEventListener('click', () => this.filter(val[i]));
    }

    // category dropDown
    this.categoryDropMenu = document.createElement("select");
    this.categoryDropMenu.setAttribute("id", "input-category");
    this.secondaryParentElement.appendChild(this.categoryDropMenu);

    for (let i = 0; i < categoryStorage.length; i++) {
      this.selectOption = document.createElement("option");
      this.selectOption.setAttribute("value", categoryStorage[i].title);
      this.selectOption.innerText = categoryStorage[i].title;
      this.categoryDropMenu.appendChild(this.selectOption);
    }

    this.categoryFilter = document.createElement("button");
    this.categoryFilter.setAttribute("id", "filter-by-category-button");
    this.secondaryParentElement.appendChild(this.categoryFilter);
    this.categoryFilter.innerText = "Filter by Category"
    this.categoryFilter.addEventListener('click', () => this.filter(document.getElementById("input-category").value));


    this.secondaryParentElement = document.createElement("div");
    this.secondaryParentElement.setAttribute("id", "all-items-list");
    this.primaryParentElement.appendChild(this.secondaryParentElement);

    if (AllItemsPage.isFiltered === true) { // if there is a filter being applied:
      for (let i = 0; i < allItemsStorage.length; i++) { // for every item in the storage... 
        if (allItemsStorage[i].importance.level === AllItemsPage.filterKey || allItemsStorage[i].category.title === AllItemsPage.filterKey) { //check if the item's filter (either the importance level, or category title) matches the item in the list
          this.renderItems(i); // if it matches, render it
        }
      }
    } else if (AllItemsPage.isFiltered === false) { // otherwise, if theres no filter, render allItemsStorage as normal
      for (let i = 0; i < allItemsStorage.length; i++) {
        this.renderItems(i);
      }
    }
    //this.isFiltered = false;
  }
  filter(key) { //runs when filter is applied 
    clearUI("first-parent"); //clear ui
    if (AllItemsPage.filterKey === key) { // if the new filter key is the samne as the old, just remove the filter (eg user presses same button twice)
      AllItemsPage.isFiltered = false;
    } else { // otherwise, change key, set filter to true
      AllItemsPage.filterKey = key;
      AllItemsPage.isFiltered = true;
    }
    new AllItemsPage(); //redraw
  }
}

class CompletedItemsPage { // this page is virtually the same as the allItemsPage... i will comment where there are distinctions
  static filterKey;
  static isFiltered = false;
  constructor() {
    this.primaryParentElement = document.getElementById("first-parent");

    //display date and nav buttons row
    this.secondaryParentElement = document.createElement("div");
    this.secondaryParentElement.setAttribute("id", "page-title");

    this.primaryParentElement.appendChild(this.secondaryParentElement);

    //title
    this.pageTitle = document.createElement("h1");
    this.secondaryParentElement.appendChild(this.pageTitle);
    this.pageTitle.innerText = "Completed";

    this.secondaryParentElement = document.createElement("div");
    this.secondaryParentElement.setAttribute("id", "filters");
    this.primaryParentElement.appendChild(this.secondaryParentElement);
    //filters
    for (let i = 0; i < val.length; i++) {
      this.importanceFilter = document.createElement("button");
      //this.idToSet = "filter" + i;
      this.importanceFilter.setAttribute("id", "filter" + i);
      this.secondaryParentElement.appendChild(this.importanceFilter);
      this.importanceFilter.setAttribute("class", "importance-filter");
      this.importanceFilter.innerText = importanceInnerText[i]
      this.importanceFilter.addEventListener('click', () => this.filter(val[i]));
    }
    // category dropDown
    this.categoryDropMenu = document.createElement("select");
    this.categoryDropMenu.setAttribute("id", "input-category");
    this.secondaryParentElement.appendChild(this.categoryDropMenu);

    for (let i = 0; i < categoryStorage.length; i++) {
      this.selectOption = document.createElement("option");
      this.selectOption.setAttribute("value", categoryStorage[i].title);
      this.selectOption.innerText = categoryStorage[i].title;
      this.categoryDropMenu.appendChild(this.selectOption);
    }
    this.categoryFilter = document.createElement("button");
    this.categoryFilter.setAttribute("id", "filter-by-category-button");
    this.secondaryParentElement.appendChild(this.categoryFilter);
    this.categoryFilter.innerText = "Filter by Category"
    this.categoryFilter.addEventListener('click', () => this.filter(document.getElementById("input-category").value));

    this.secondaryParentElement = document.createElement("div");
    this.secondaryParentElement.setAttribute("id", "completed-items-list");
    this.primaryParentElement.appendChild(this.secondaryParentElement);
    this.toDoListParent = document.getElementById("completed-items-list");

    if (CompletedItemsPage.isFiltered === true) {
      for (let i = 0; i < allItemsStorage.length; i++) {
        if (allItemsStorage[i].importance.level === CompletedItemsPage.filterKey && allItemsStorage[i].completion === true || allItemsStorage[i].category.title === CompletedItemsPage.filterKey) { // only render items that are complete from the completed items list (i saved a WHOLE array... i was initially goi9ng to use a completedItemsStorage array but thought this was better)
          this.renderItems(i);
        }
      }
    } else if (CompletedItemsPage.isFiltered === false) {
      for (let i = 0; i < allItemsStorage.length; i++) {
        if (allItemsStorage[i].completion === true) { // again, only render if the items are marked as complete
          this.renderItems(i);
        }
      }
    }
  }
  filter(key) {
    clearUI("first-parent");
    if (CompletedItemsPage.filterKey === key) {
      CompletedItemsPage.isFiltered = false;
    } else {
      CompletedItemsPage.filterKey = key;
      CompletedItemsPage.isFiltered = true;
    }
    new CompletedItemsPage();
  }
  renderItems(i) {
    this.toDoListParent.appendChild(allItemsStorage[i].element);
  }
}
class NewCategoryPage { // this page is where the user can create new categories 
  static colorPicked; // color picked for new category
  static prevElement;
  static colorVal = ["#dbdbdb", "#AB2424", "#E75252", "#FF8E8E", "#F1693C", "#FF8E51", "#FFC368", "#FFE45C", "#FFEA82", "#9FEB8E", "#3ABB29", "#64E752", "#9BF78F", "#25AC7F", "#52E7B5", "#52B9E7", "#527AE7", "#5620C9", "#8152E7", "#C3A6FF"]; // color codes for possible colors categories can be set to 
  constructor() {
    //UGH just more of this silly html rendering nonsense!
    this.primaryParentElement = document.getElementById("first-parent");

    this.secondaryParentElement = document.createElement("h1");
    this.secondaryParentElement.setAttribute("id", "page-title");
    this.secondaryParentElement.innerText = "Create New Category"

    this.primaryParentElement.appendChild(this.secondaryParentElement);

    this.secondaryParentElement = document.createElement("div");
    this.primaryParentElement.appendChild(this.secondaryParentElement);
    this.secondaryParentElement.setAttribute("id", "category-ui");

    this.userInput = document.createElement("input");
    this.userInput.setAttribute("id", "input-category");
    this.secondaryParentElement.appendChild(this.userInput);
    this.addButton = document.createElement("button");
    this.addButton.setAttribute("id", "add-category-button")
    this.addButton.addEventListener('click', () => this.addButtonClick());
    this.secondaryParentElement.appendChild(this.addButton);
    this.addButton.innerText = "Add";

    this.secondaryParentElement = document.createElement("div");
    this.primaryParentElement.appendChild(this.secondaryParentElement);
    this.secondaryParentElement.setAttribute("id", "colors-list");

    for (let i = 0; i < NewCategoryPage.colorVal.length; i++) { //color buttons are set to the color they represent, and their values too. this is super cool cuz i can add as many or as little colors as i want and it wil adjust accordingly
      this.colorButton = document.createElement("button");
      this.colorButton.setAttribute("id", "color" + i);
      this.colorButton.setAttribute("class", "colorButton");
      this.colorButton.setAttribute("value", NewCategoryPage.colorVal[i]);
      this.colorButton.style.backgroundColor = NewCategoryPage.colorVal[i];
      this.colorButton.addEventListener("click", () => this.setColorPicked(NewCategoryPage.colorVal[i], "color" + i));
      this.secondaryParentElement.appendChild(this.colorButton);
    }

    this.secondaryParentElement = document.createElement("div");
    this.primaryParentElement.appendChild(this.secondaryParentElement);
    this.secondaryParentElement.setAttribute("id", "category-list");

    for (let i = 0; i < categoryStorage.length; i++) { // render category item names so user can see which categories were created
      this.renderItems(i);
    }
  }
  setColorPicked(value, id) { // this function runs when a color is clicked on 
    this.element = document.getElementById(id);
    this.colorPicked = value; // the color picked is set to the value that was clicked on
    if (this.element != NewCategoryPage.prevElement) {
      this.element.style.border = "2px solid #05041a";
      if (NewCategoryPage.prevElement != undefined) {
        NewCategoryPage.prevElement.style.border = "transparent";
      }
    }
    NewCategoryPage.prevElement = this.element;
  }
  addButtonClick() { // add button adds the category to the category storage and renders it on the page
    categoryStorage.push(new Category(this.colorPicked));
    clearUI("first-parent");
    new NewCategoryPage();

    this.userInput.value = ""; //🅰️ one smal step for man one giant leap for smolbeankind
  }
  renderItems(i) {
    this.toDoListParent = document.getElementById("category-list");
    this.toDoListParent.appendChild(categoryStorage[i].element);
  }
}
class StaticUi { // navigation bar at the top 
  navCalendar() { // nav to calendar page... clear ui, set page, then create new page
    clearUI("first-parent");
    currentPage = "calendarPage";
    new CalendarPage();
  }
  navCompletedItems() {
    clearUI("first-parent");
    currentPage = "completedItemsPage";
    new CompletedItemsPage();
  }
  navAllItems() {
    clearUI("first-parent");
    currentPage = "allItemsPage";
    new AllItemsPage();
  }
  navNewCategory() {
    //this.clearUI();
    clearUI("first-parent");
    currentPage = "newCategoryPage";
    new NewCategoryPage();
  }
  constructor() {
    // you know it!!! more html rendering! (never doing this again.. so tedious)
    this.parentElement = document.getElementById("page-nav-buttons");

    //calendar button
    this.calendarButton = document.createElement("button");
    this.calendarButton.setAttribute("id", "calendar-nav"); // new
    this.calendarButton.setAttribute("class", "navigation");
    this.parentElement.appendChild(this.calendarButton);
    this.calendarButton.innerText = "Calendar"
    //completed items button
    this.completedItemsButton = document.createElement("button");
    this.completedItemsButton.setAttribute("id", "completed-items-nav");
    this.completedItemsButton.setAttribute("class", "navigation");
    this.parentElement.appendChild(this.completedItemsButton);
    this.completedItemsButton.innerText = "Completed Items"
    //allitems button
    this.allItemsButton = document.createElement("button");
    this.allItemsButton.setAttribute("id", "all-items-nav");
    this.allItemsButton.setAttribute("class", "navigation");
    this.parentElement.appendChild(this.allItemsButton);
    this.allItemsButton.innerText = "All Items"
    //new category button
    this.createCategoryButton = document.createElement("button");
    this.createCategoryButton.setAttribute("id", "create-category-nav");
    this.createCategoryButton.setAttribute("class", "navigation");
    this.parentElement.appendChild(this.createCategoryButton);
    this.createCategoryButton.innerText = "Create New Category"

    //event listeners
    this.calendarButton.addEventListener('click', () => this.navCalendar());
    this.completedItemsButton.addEventListener('click', () => this.navCompletedItems());
    this.allItemsButton.addEventListener('click', () => this.navAllItems());
    this.createCategoryButton.addEventListener('click', () => this.navNewCategory());
  }
}
new StaticUi(); // this is pretty crazy that this is technically the only real line of code being run procedurally... oop is insane!!