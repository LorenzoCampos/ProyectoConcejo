<?php

use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\UserController;

Route::middleware(["auth:sanctum"])->group(function () {
    Route::get('/vllc', function () {
        return "Viva La Libertad Carajo";
    });
});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {

    Route::get('/user/all', [UserController::class, 'getUsers']);
    Route::post('/user/role/{user}', [UserController::class, 'updateRole']);
    Route::middleware('auth:sanctum')->get('/role/all', [UserController::class, 'getAllRoles']);

});

Route::middleware('auth:sanctum')->get('/user/role', [UserController::class, 'getRole']);
