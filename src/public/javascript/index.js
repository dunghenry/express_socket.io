const socket = io('http://localhost:4000');
const $ = document.querySelector.bind(document);
const btnRegister = $('#btnRegister');
const email = $('#email');
const username = $('#username');
const phone = $('#phone');
const list = $('#list');
document.addEventListener(
    'DOMContentLoaded',
    function (e) {
        socket.on('user_disconnected', (username) => {
            if (username) {
                alert(`${username} disconnected`);
            }
        });
        socket.on('register-failure', () => {
            alert('User is already registered');
        });
        socket.on('send-users', (users) => {
            list.innerHTML = '';
            let html = '';
            users.forEach((user, index) => {
                html += `<div id="item">
                    <div class="row">id: ${index + 1} || <span><b>${
                    user.username
                }</b></span></div>
                    <div class="row">${user.email} - ${user.phone}</span></div>
                </div>`;
            });
            list.innerHTML = html;
        });
        socket.on('register-sucess', (user) => {
            username.value = '';
            email.value = '';
            phone.value = '';
            alert('Register account successfully!');
            // console.log(user);
        });

        btnRegister.onclick = function () {
            const user = {
                username: username.value,
                email: email.value,
                phone: phone.value,
            };
            if (user.username && user.email && user.phone) {
                socket.emit('register', user);
            } else {
                alert('Please enter a username, email and phone');
            }
        };
    },
    false,
);
