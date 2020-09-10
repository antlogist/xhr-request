const apiURL = "https://jsonplaceholder.typicode.com";
let users = null;

//DOM elements
const container = document.getElementById("users");
container.classList.add("container", "my-5");

// Render form
const form = document.createElement("form");
form.classList.add("mb-5");
form.setAttribute("name", "addUserForm");

// Render form inputs
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

// Call render inputs function
renderInputs("name", "email", "username", "phone", "website");

// Render form button
const sendButton = document.createElement("button");
sendButton.classList.add("btn", "btn-primary");
sendButton.textContent = "Send";
form.appendChild(sendButton);

// Append form
container.appendChild(form);

// GET and POST function
function http() {
    return {
        get(url, cb) {
            try {
                // xhr object
                const xhr = new XMLHttpRequest();
                // xhr open
                xhr.open("GET", url);
                // xhr load
                xhr.addEventListener("load", () => {
                    if (Math.floor(xhr.status / 100) !== 2) {
                        cb(`Error. Status code ${xhr.status}`, xhr);
                        return;
                    }
                    // parse
                    const response = JSON.parse(xhr.responseText);
                    users = response;
                    // callback
                    cb(null, users);
                });
                // xhr error
                xhr.addEventListener("error", () => {
                    console.log("error");
                });
                // xhr send
                xhr.send();
            } catch (error) {
                console.log(error);
            }
        },
        post(url, body, headers, cb) {
            // xhr object
            const xhr = new XMLHttpRequest();
            // xhr open
            xhr.open("POST", url);
            // headers
            if (headers) {
                Object.entries(headers).map(([key, value]) => {
                    xhr.setRequestHeader(key, value);
                });
            }
            // xhr load
            xhr.addEventListener("load", () => {
                if (Math.floor(xhr.status / 100) !== 2) {
                    cb(`Error. Status code ${xhr.status}`, xhr);
                    return;
                }
                // parse
                const response = JSON.parse(xhr.responseText);
                users = response;
                // callback
                cb(null, users);
            });
            // xhr error
            xhr.addEventListener("error", () => {
                console.log("error");
            });
            // xhr send
            console.log(body);
            xhr.send(JSON.stringify(body));
        }
    };
}

const myHttp = http();

myHttp.get(`${apiURL}/users`, (err, resp) => {
    if (err) {
        console.log(err);
        return;
    }
    renderList(resp);
});

// Render user list
const userFragment = document.createDocumentFragment();
const accordion = document.createElement("div");
accordion.id = "accordion";
accordion.classList.add("accordion");
// Render list function
function renderList(users, newUser = false) {
    if (!users.length) {
        return;
    }
    users.map(user => {
        // Call create user template
        createTemplate(user);
    });
    if (newUser === true) {
        return;
    }
    userFragment.appendChild(accordion);
    container.appendChild(userFragment);
}

// User list template
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
    card.appendChild(header);
    card.appendChild(collapseDiv);
    accordion.prepend(card);
}

// Get form inputs
const inputName = form.elements["name"];
const inputEmail = form.elements["email"];
const inputUserName = form.elements["username"];
const inputPhone = form.elements["phone"];
const inputWebsite = form.elements["website"];

// Send button click event
form.addEventListener("submit", formSubmit);

// Form Submit
function formSubmit(e) {
    e.preventDefault();
    const name = inputName.value;
    const email = inputEmail.value;
    const userName = inputUserName.value;
    const phone = inputPhone.value;
    const website = inputWebsite.value;
    const body = {
        name: name,
        email: email,
        username: userName,
        phone: phone,
        website: website
    };
    const headers = { "Content-Type": "application/json; charset=UTF-8" };
    // Post request
    myHttp.post(`${apiURL}/users`, body, headers, (err, resp) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(resp);
        renderList([resp], true);
    });
}
