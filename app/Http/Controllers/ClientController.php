<?php

namespace App\Http\Controllers;

use App\Classes\ResponseClass;
use App\Models\Client;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Http\Resources\ClientResource;

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

        $data = [
            'name' => $request->name,
            'surname'=> $request->surname,
            'address' => $request->address,
            'phone_number' => $request->phone_number,
            'email' => $request->email
        ];
        try {
            $client = Client::create($data);
            
            return ResponseClass::respond(ClientResource::collection($client), 'Client create successfuly !', 201);
        } catch (\Exception $e) {
            return ResponseClass::broke($e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $client = Client::find($id);
        return ResponseClass::respond(ClientResource::collection($client), '', 201);
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
            'email' => $request->email
        ];
try {
    Client::where('id', $id)->update($data);
    $client = Client::find($id);
    return ResponseClass::respond(ClientResource::collection($client), 'Client\'s Informatiosn updated succesfully', 201);
} catch (\Exception $e) {
    return ResponseClass::broke($e->getMessage());
}

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $client = Client::find($id);
        $client_name = $client->name;
        $client->delete();
    return ResponseClass::respond('', 'Client Deleted succesfully', 201);
    }
}
