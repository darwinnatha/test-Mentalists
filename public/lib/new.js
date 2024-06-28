$(document).ready(function () {
    const clientModal = new bootstrap.Modal($('#clientModal')[0]);
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
            { data: null,
                render: function(data, type, row){
                    return`<img src="/storage/${data.file_name}" id='imagick' alt="Image preview" style="max-width: 80px; max-height: 200px;">
                    `;
                }
             },
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
    setInterval(function () {
        table.ajax.reload(null, false); // false pour éviter le repositionnement de la page après le rechargement
    }, 15000);

    // Ouvrir le modal pour remplir un client
    $('#addClientBtn').on('click', function () {
        resetForm();
        $('#clientForm input').prop('disabled', false);
        $('#saveClient').show();
        $('#clientModalLabel').text('Ajouter un client');
        clientModal.show();
    });

    $('#clientModal').on('hidden.bs.modal', function () {
        resetFormErrors();
    });

    // Sauvegarder et modifier un Client
    $('#saveClient').on('click', function () {
        const saveButton = $('#saveClient');
        const originalText = saveButton.html();
        saveButton.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> En cours');
        saveButton.prop('disabled', true);
        resetFormErrors();
        const id = $('#clientId').val();
        // const data = {
        //     name: $('#name').val(),
        //     surname: $('#surname').val(),
        //     email: $('#email').val(),
        //     address: $('#address').val(),
        //     phone_number: $('#phone_number').val()
        // };
        const formData = new FormData($('#clientForm')[0]);
        console.log(formData)

        const url = id ? `/api/clients/${id}` : '/api/clients';
        const method = id ? 'PUT' : 'POST';

        $.ajax({
            url: url,
            method: method,
            data: formData,
            processData: false,
            contentType: false,

        })
            .done(function (response) {
                clientModal.hide();
                table.ajax.reload();
                showAlert(response.message, 'success');
            })
            .fail(function (jqXHR) {
                if (jqXHR.status === 422) {
                    // Erreurs de validation
                    displayFormErrors(jqXHR.responseJSON.errors);
                } else {
                    // Autres types d'erreurs
                    console.log(jqXHR.responseText)
                    showAlert('Erreur: ' + jqXHR.responseText, 'danger');
                }
            })
            .always(function () {
                saveButton.html(originalText);
                saveButton.prop('disabled', false);
            });
    });

    function displayFormErrors(errors) {
        // Réinitialiser les erreurs précédentes
        $('.is-invalid').removeClass('is-invalid');
        $('.invalid-feedback').empty();

        // Parcourir les erreurs et les afficher
        Object.keys(errors).forEach(field => {
            const inputField = $(`#${field}`);
            const errorDiv = $(`#${field}Error`);

            inputField.addClass('is-invalid');
            errorDiv.text(errors[field][0]); // Afficher la première erreur pour ce champ
        });
    }

    $('#file_name').on('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreview img').attr('src', e.target.result);
                $('#imagePreview').show();
            }
            reader.readAsDataURL(file);
        }
    });

    // Réinitialiser le formulaire
    function resetForm() {
        $('#clientId').val('');
        $('#clientForm')[0].reset();
    }

    function resetFormErrors() {
        $('.is-invalid').removeClass('is-invalid');
        $('.invalid-feedback').empty();
    }

    // Fonction pour charger les données du client dans le modal
    function loadClientData(data, isEditable) {
        $('#clientId').val(data.id);
        $('#name').val(data.name);
        $('#surname').val(data.surname);
        $('#email').val(data.email);
        $('#address').val(data.address);
        $('#phone_number').val(data.phone_number);

        $('#clientForm input').prop('disabled', !isEditable);
        $('#saveClient').toggle(isEditable);
        $('#clientModalLabel').text(isEditable ? 'Modifier un client' : 'Détails du client');

        clientModal.show();
    }

    // Voir un client
    $('#mytable').on('click', '.view-btn', function () {
        const data = $(this).data('id');
        loadClientData(data, false);
    });

    // Modifier un client
    $('#mytable').on('click', '.edit-btn', function () {
        const data = $(this).data('id');
        loadClientData(data, true);
    });

    // Supprimer un client
    $('#mytable').on('click', '.delete-btn', function () {
        var id = $(this).data('id');
        const url = ` /api/clients/${id}`
        if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
            $.ajax({
                url: url,
                method: 'DELETE',
                dataType: 'json',
                success: function (response) {
                    table.ajax.reload();
                    showAlert(response.message, 'success');
                },
                error: function (xhr) {
                    showAlert('Erreur lors de la suppression: ' + xhr.responseJSON.message, 'danger');
                }
            });
        }
    });

    function showAlert(message, type) {
        const alertPlaceholder = $('#alertPlaceholder');
        const wrapper = $('<div>').html([
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            `  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`,
            `</div>`
        ].join(''));

        alertPlaceholder.append(wrapper);

        setTimeout(function () {
            const alert = bootstrap.Alert.getOrCreateInstance(wrapper.find('.alert')[0]);
            alert.close();
        }, 5000);
    }
});
