<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />

    <title>Gestion des clients</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.datatables.net/1.10.25/css/dataTables.bootstrap5.min.css" rel="stylesheet">
</head>

<body class="font-sans antialiased dark:bg-black dark:text-white/50">
    <h1 class="position-relative py-2 px-4 text-bg-secondary text-center rounded-pill">Liste des clients</h1>
    <h3 class="position-relative py-2 px-4 text-bg-secondary text-center rounded-pill">Appli de gestion rapide des clients</h3>
    <button id="addClientBtn" class="btn btn-primary mb-3"  data-bs-toggle="modal" data-bs-target="#clientModal">Ajouter un client</button>

    <div class="px-7 ">

        <table class="table" id='mytable'>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Surname</th>
                <th scope="col">E-mail</th>
                <th scope="col">Adress</th>
                <th scope="col">Phone_number</th>
                <th scope='col'>Actions</th>
              </tr>
            </thead>
            </table>
    </div>

    <div class="modal fade" id="clientModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="clientModalLabel">Détails du client</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="clientForm">
                        <input type="hidden" id="clientId">
                        <div class="mb-3">
                            <label for="name" class="form-label">Nom</label>
                            <input type="text" class="form-control" id="name" required>
                        </div>
                        <div class="mb-3">
                            <label for="surname" class="form-label">Prénom</label>
                            <input type="text" class="form-control" id="surname" required>
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" required>
                        </div>
                        <div class="mb-3">
                            <label for="address" class="form-label">Adresse</label>
                            <input type="text" class="form-control" id="address" required>
                        </div>
                        <div class="mb-3">
                            <label for="phone_number" class="form-label">Numero de telephone</label>
                            <input type="text" class="form-control" id="phone_number" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                    <button type="button" class="btn btn-primary" id="saveClient">Enregistrer</button>
                </div>
            </div>
        </div>
    </div>
<div id="alertPlaceholder">

</div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.datatables.net/1.10.25/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.10.25/js/dataTables.bootstrap5.min.js"></script>
    <script src="{{asset('lib/utils.js')}}"></script>
</body>

</html>
