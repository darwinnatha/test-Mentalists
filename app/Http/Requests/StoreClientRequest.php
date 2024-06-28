<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreClientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'string | required',
            'surname' => 'string ',
            'email' => 'email | required',
            'address' => 'string | required',
            'phone_number' => 'string',
            'file_name' => 'image|mimes:jpeg,png,jpg,gif|max:2048',

        ];
    }

    // public function failedValidation(Validator $validator){
    //     throw new HttpResponseException(response()->json([
    //     'success' => false,
    //     'message' => 'Validations errors',
    //     'data' => $validator->errors,
    //     ]))     ;
    // }
}
