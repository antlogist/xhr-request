let users = null;

const container = document.getElementById("users");
container.classList.add("container", "my-5");

// Render form
const form = document.createElement("form");
form.classList.add("mb-5");
form.setAttribute("name", "addUserForm");

// Render form
function renderInputs(...arr) {
    arr.map((item, index) => {
        const formGroup = document.createElement("div");
        formGroup.classList.add("form-group");
        const label = document.createElement("label");
        label.setAttribute("for", `input-${item}`);
        label.classList.add("text-muted");
        label.textContent = item;
        formGroup.appendChild(label);
        const input = document.createElement("input");
        input.id = `input-${item}`;
        input.classList.add("form-control");
        input.setAttribute("name", item);
        switch (item) {
            case "email":
                input.setAttribute("type", "email");
                break;
            case "phone":
                input.setAttribute("type", "number");
                break;
            default:
                input.setAttribute("type", "text");
        }
        formGroup.appendChild(input);
        form.appendChild(formGroup);
    });
}

renderInputs("name", "email", "username", "phone", "website");

const sendButton = document.createElement("button");
sendButton.classList.add("btn", "btn-primary");
sendButton.textContent = "Send";
form.appendChild(sendButton);

container.appendChild(form);

// Get users
function getUsers(cb) {
    // xhr object
    const xhr = new XMLHttpRequest();
    // xhr open
    xhr.open("GET", "https://jsonplaceholder.typicode.com/users");
    // xhr load
    xhr.addEventListener("load", () => {
        // parse
        const responce = JSON.parse(xhr.responseText);
        users = responce;
        console.log(users);
        // callback
        cb(users);
    });
    // xhr error
    xhr.addEventListener("error", () => {
        console.log("error");
    });
    // xhr send
    xhr.send();
}

// Render list
const fragment = document.createDocumentFragment();
// list group div
const accordion = document.createElement("div");
accordion.id = "accordion";
accordion.classList.add("accordion");

function renderList(users) {
    users.map(user => {
        createTemplate(user);
    });
    fragment.appendChild(accordion);
    container.appendChild(fragment);
}

getUsers(renderList);

function createTemplate(user) {
    // card
    const card = document.createElement("div");
    card.classList.add("card");
    // header
    const header = document.createElement("div");
    header.classList.add("card-header");
    header.id = `heading${user.id}`;
    // h2
    const h2 = document.createElement("h2");
    h2.classList.add("mb-0");
    // button
    const button = document.createElement("button");
    button.classList.add("btn", "btn-link", "btn-block", "text-left");
    button.setAttribute("type", "button");
    button.setAttribute("data-toggle", "collapse");
    button.setAttribute("data-target", `#collapse-${user.id}`);
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-controls", `collapse-${user.id}`);
    button.textContent = user.name;
    // collapse div
    const collapseDiv = document.createElement("div");
    collapseDiv.id = `collapse-${user.id}`;
    collapseDiv.classList.add("collapse");
    collapseDiv.setAttribute("aria-labelledby", `heading${user.id}`);
    collapseDiv.setAttribute("data-parent", "#accordion");
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    cardBody.insertAdjacentHTML(
        "beforeend",
        `
            name: <i>${user.name}</i><br>
            email: <i>${user.email}</i><br>
            phone: <i>${user.phone}</i><br>
            website: <i>${user.website}</i><br>
        `
    );
    // append
    h2.appendChild(button);
    header.appendChild(h2);
    collapseDiv.appendChild(cardBody);
    // append card
    card.appendChild(header);
    card.appendChild(collapseDiv);
    accordion.appendChild(card);
}

const inputName = form.elements["name"];
const inputEmail = form.elements["email"];
const inputUserName = form.elements["username"];
const inputPhone = form.elements["phone"];
const inputWebsite = form.elements["website"];

form.addEventListener("submit", formSubmit);

// Form Submit
function formSubmit(e) {
    e.preventDefault();
    const name = inputName.value;
    const email = inputEmail.value;
    const userName = inputUserName.value;
    const phone = inputPhone.value;
    const website = inputWebsite.value;
    const body = JSON.stringify({
        name: name,
        email: email,
        username: userName,
        phone: phone,
        website: website
    });
    console.log(body);
    // xhr object
    const xhr = new XMLHttpRequest();
    // xhr open
    xhr.open("POST", "https://jsonplaceholder.typicode.com/users");
    // headers
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    // xhr load
    xhr.addEventListener("load", () => {
        // parse
        const responce = JSON.parse(xhr.responseText);
        renderList([responce]);
        console.log(responce);
    });
    // xhr error
    xhr.addEventListener("error", () => {
        console.log("error");
    });
    // xhr send
    xhr.send(body);
}
