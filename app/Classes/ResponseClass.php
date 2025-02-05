<?php

namespace App\Classes;

use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;

use function Laravel\Prompts\error;

class ResponseClass
{

    public static function broke($error, $message='Somethings went wrong ! Process Fail'){
        Log::warning('response'.$error);
        throw new HttpResponseException(response()->json(['message'=>$message], 500));
    }

    public static function respond($result, $message, $status){
        $response  = [
            'success' => true,
            'data' => $result,
            'message' => $message
        ];
        // Log::info($response);
        return response()->json($response, $status);
    }
}
