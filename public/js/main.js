let idSelected = null; // untuk menyimpan id yg di-edit

const getCard = (contact) => {
    let card = document.createElement('div');
    card.dataset.id = contact.id;
    card.classList.add('card');
    card.classList.add('mb-2');

    let cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    cardBody.innerHTML = `<h5 class="contact-name">${contact.name}</h5>`;
    cardBody.innerHTML += `<p class="contact-phone">${contact.phone}</p>`;
    cardBody.innerHTML += `<p class="contact-address">${contact.address}</p>`;

    card.append(cardBody);

    let cardFooter = document.createElement('div');
    cardFooter.classList.add('card-footer');

    let aEdit = document.createElement('a')
    aEdit.href = '#';
    aEdit.classList.add('btn');
    aEdit.classList.add('btn-primary');
    aEdit.classList.add('mr-2');
    aEdit.innerText = 'Edit';

    aEdit.addEventListener('click', function(e) {
        e.preventDefault();

        document.getElementById('name').value = contact.name;
        document.getElementById('phone').value = contact.phone;
        document.getElementById('address').value = contact.address;

        idSelected = contact.id;
    });


    cardFooter.append(aEdit);

    let aDelete = document.createElement('a');
    aDelete.href = '#';
    aDelete.classList.add('btn');
    aDelete.classList.add('btn-danger');
    aDelete.innerText = 'Delete';

    aDelete.addEventListener('click', function(e) {
        e.preventDefault();

        if (confirm('Are you sure you want to delete?')) {
            fetch(`/delete/${contact.id}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        card.remove();
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => console.log(error));
        }
    });

    cardFooter.append(aDelete);

    card.append(cardFooter);

    return card;
}

document.getElementById('form-contact').addEventListener('submit', function(e) {
    e.preventDefault();

    let name = document.getElementById('name').value;
    let phone = document.getElementById('phone').value;
    let address = document.getElementById('address').value;

    if (idSelected !== null) {
        fetch(`/edit-contact/${idSelected}`, {
            method: 'POST',
            body: JSON.stringify({
                name: name,
                phone: phone,
                address: address,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const card = document.querySelector(`[data-id="${idSelected}"]`);

                if (card) {
                    card.querySelector('.contact-name').innerText = data.data.name;
                    card.querySelector('.contact-phone').innerText = data.data.phone;
                    card.querySelector('.contact-address').innerText = data.data.address;
                }

                document.getElementById('form-contact').reset();
                idSelected = null;
            } else {
                alert(data.message);
            }
        });
    } else {
        fetch('/add-contact', {
                method: 'POST',
                body: JSON.stringify({
                    name: name,
                    phone: phone,
                    address: address,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const elContent = document.getElementById('content');

                    elContent.prepend(getCard(data.data));

                    document.getElementById('form-contact').reset();
                } else {
                    alert(data.message);
                }
            });
    }
});

fetch('/contact')
    .then(response => response.json())
    .then(data => {
        const elContent = document.getElementById('content');

        data.forEach(contact => {
            elContent.prepend(getCard(contact));
        });
    })
    .catch(error => console.log(error));

