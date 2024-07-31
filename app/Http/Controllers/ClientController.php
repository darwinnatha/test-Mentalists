<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Classes\ResponseClass;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\ClientResource;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $clients = Client::all();
        return ResponseClass::respond(ClientResource::collection($clients), '', 201);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClientRequest $request)
    {
        Log::alert($request);
        $data = [
            'name' => $request->name,
            'surname'=> $request->surname,
            'address' => $request->address,
            'phone_number' => $request->phone_number,
            'file_name' => $request->file_name,
            'email' => $request->email

        ];
        try {
            $data = $request->validated();

            if ($request->hasFile('file_name')) {
                $path = $request->file('file_name')->store('client_images', 'public');
                $data['file_name'] = $path;
            }
            $client = Client::create($data);
            return ResponseClass::respond(new ClientResource($client), 'Client created successfully!', 201);
        } catch (\Exception $e) {
            Log::warning('excep'.$e);
            return ResponseClass::broke($e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $client = Client::find($id);
        if ($client) {
            return ResponseClass::respond(new ClientResource($client), '', 201);
        } else {
            return ResponseClass::broke('Client not found', 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $client)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClientRequest $request, string $id)
    {
        $data = [
            'name' => $request->name,
            'surname'=> $request->surname,
            'address' => $request->address,
            'phone_number' => $request->phone_number,
            'email' => $request->email,
            'file_name' => $request->file_name,
        ];
        try {
            $data = $request->validated();
            $client = Client::findOrFail($id);

            if ($request->hasFile('file_name')) {
                // Supprimer l'ancienne image si elle existe
                if ($client->file_name) {
                    Storage::disk('public')->delete($client->file_name);
                }
                $path = $request->file('file_name')->store('client_images', 'public');
                $data['file_name'] = $path;
            }

            $client->update($data);
            return ResponseClass::respond(new ClientResource($client), 'Client\'s information updated successfully', 200);
        } catch (\Exception $e) {
            Log::warning('excep'.$e);
            return ResponseClass::broke($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $client = Client::find($id);
        if ($client) {
            $client_name = $client->name;
            $client->delete();
            return ResponseClass::respond('', 'Client deleted successfully', 201);
        } else {
            return ResponseClass::broke('Client not found', 404);
        }
    }
}
