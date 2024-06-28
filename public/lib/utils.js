document.addEventListener('DOMContentLoaded', function () {
    const clientModal = new bootstrap.Modal(document.getElementById('clientModal'));
    let table;

    // Initialiser DataTables
    table = $('#mytable').DataTable({
        ajax: {
            url: '/api/clients',
            dataSrc: function (json) {
                console.log('Réponse API complète:', json);
                return json.data || [];
            }
        },
        columns: [
            { data: 'id' },
            { data: 'name' },
            { data: 'surname' },
            { data: 'email' },
            { data: 'address' },
            { data: 'phone_number' },
            {
                data: null,
                render: function (data, type, row) {
                    return `<button class="btn btn-sm btn-info view-btn" data-id='${JSON.stringify(data)}'>Voir</button> ` +
                        `<button class="btn btn-sm btn-primary edit-btn" data-id='${JSON.stringify(data)}'>Modifier</button> ` +
                        `<button class="btn btn-sm btn-danger delete-btn" data-id="${data.id}">Supprimer</button>`;
                }
            }
        ],
        responsive: true,
    });

    // Rafraîchir les données toutes les 15 secondes
    /* setInterval(function () {
        table.ajax.reload(null, false); // false pour éviter le repositionnement de la page après le rechargement
    }, 15000); */

    // Ouvrir le modal pour remplir un client
    document.getElementById('addClientBtn').addEventListener('click', function () {
        resetForm();
        const inputs = document.querySelectorAll('#clientForm input');
        inputs.forEach(input => input.disabled = false);
        document.getElementById('saveClient').style.display = 'block';
        document.getElementById('clientModalLabel').textContent = 'Ajouter un client';
        clientModal.show();
    });

    // Sauvegarder et modifier un Client
    document.getElementById('saveClient').addEventListener('click', function () {
        const saveButton = document.getElementById('saveClient');
        const originalText = saveButton.innerHTML;
        saveButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> En cours';
        saveButton.disabled = true;

        const id = document.getElementById('clientId').value;
        const data = {
            name: document.getElementById('name').value,
            surname: document.getElementById('surname').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            phone_number: document.getElementById('phone_number').value
        };

        const url = id ? `/api/clients/${id}` : '/api/clients';
        const method = id ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(response => {
                clientModal.hide();
                table.ajax.reload();
                // showAlert(response.message, 'success');
            })
            .catch(error => {
                console.log('Erreur: ' + error.message, 'danger');
            })
            .finally(() => {
                saveButton.innerHTML = originalText;
                saveButton.disabled = false;
            });
    });

    // Réinitialiser le formulaire
    function resetForm() {
        document.getElementById('clientId').value = '';
        document.getElementById('clientForm').reset();
    }

    // Fonction pour charger les données du client dans le modal
    function loadClientData(data, isEditable) {
        document.getElementById('clientId').value = data.id;
        document.getElementById('name').value = data.name;
        document.getElementById('surname').value = data.surname;
        document.getElementById('email').value = data.email;
        document.getElementById('address').value = data.address;
        document.getElementById('phone_number').value = data.phone_number

        const inputs = document.querySelectorAll('#clientForm input');
        inputs.forEach(input => input.disabled = !isEditable);

        document.getElementById('saveClient').style.display = isEditable ? 'block' : 'none';
        document.getElementById('clientModalLabel').textContent = isEditable ? 'Modifier un client' : 'Détails du client';

        clientModal.show();
    }

    // Voir un client
    document.getElementById('mytable').addEventListener('click', function (e) {
        if (e.target.classList.contains('view-btn')) {
            const data = JSON.parse(e.target.getAttribute('data-id'));
            loadClientData(data, false);
        }
    });

    // Modifier un client
    document.getElementById('mytable').addEventListener('click', function (e) {
        if (e.target.classList.contains('edit-btn')) {
            const data = JSON.parse(e.target.getAttribute('data-id'));
            loadClientData(data, true);
        }
    });

    function showAlert(message, type) {
        const alertPlaceholder = document.getElementById('alertPlaceholder');
        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            `  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`,
            `</div>`
        ].join('');

        alertPlaceholder.append(wrapper);

        setTimeout(function () {
            const alert = bootstrap.Alert.getOrCreateInstance(wrapper.querySelector('.alert'));
            alert.close();
        }, 5000);
    }
});
