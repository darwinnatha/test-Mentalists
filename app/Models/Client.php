<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable =[
        'name',
        'surname',
        'address',
        'phone_number',
        'email',
        'file_name'
    ];
}
