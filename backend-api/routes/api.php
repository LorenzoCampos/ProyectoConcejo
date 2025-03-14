<?php

use App\Http\Controllers\NewsBannerController;
use App\Http\Controllers\RegulationController;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\UserController;

Route::prefix('v1')->group(function () {

    Route::get('/vllc', function () {
        return 'Viva La Libertad Carajo';
    });

    // Ruta pública para regulaciones publicadas
    Route::get('regulations/published', [RegulationController::class, 'indexPublished']);

    Route::middleware(['auth:sanctum'])->group(function () {

        Route::get('user', [UserController::class, 'show']);

        Route::post('user', [UserController::class, 'update']);

        Route::middleware(['permission:ver usuarios'])->get('users/non-admin', [UserController::class, 'getNonAdminUsers']);
        Route::middleware(['permission:modificar roles de usuarios', 'verified'])->patch('users/{user}/role', [UserController::class, 'changeUserRole']);
        Route::middleware(['permission:ver todos los roles'])->get('roles', [UserController::class, 'getAllRoles']);
    });

    Route::middleware(['auth:sanctum'])->group(function () {

        Route::middleware(['permission:ver normativa'])->get('regulations', [RegulationController::class, 'index']);
        Route::middleware(['permission:ver normativa'])->get('regulations/modified', [RegulationController::class,'modificationsRegulations']);
        Route::middleware(['permission:ver normativa'])->get('regulations/{id}', [RegulationController::class, 'show']);
        Route::middleware(['permission:crear normativa', 'verified'])->post('regulations', [RegulationController::class, 'store']);
        Route::middleware(['permission:modificar normativa', 'verified'])->post('regulations/{id}', [RegulationController::class, 'update']);
    });

    Route::middleware(['auth:sanctum', 'role:cm'])->group(function () {
        Route::get('news-banners', [NewsBannerController::class, 'getAllNewsAndBanners']);
        Route::get('banners', [NewsBannerController::class, 'getAllBanners']);
        Route::get('news', [NewsBannerController::class, 'getAllNews']);
        Route::get('news-banners/{id}', [NewsBannerController::class, 'show']);
        Route::middleware(['verified'])->post('news-banners', [NewsBannerController::class, 'store']);
        Route::middleware(['verified'])->post('news-banners/{id}', [NewsBannerController::class, 'update']);
        Route::middleware(['verified'])->delete('news-banners/{id}', [NewsBannerController::class, 'delete']);
    });

    Route::get('banners/published', [NewsBannerController::class, 'getAllPublishedBanners']);
    Route::get('news/published', [NewsBannerController::class, 'getAllPublishedNews']);
});
