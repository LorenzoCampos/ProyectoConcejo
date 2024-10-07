<?php

use App\Http\Controllers\NewsBannerController;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\UserController;

Route::prefix('v1')->group(function () {

    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('/vllc', function () {
            return 'Viva La Libertad Carajo';
        });
    });

    Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {

        Route::get('users/non-admin', [UserController::class, 'getNonAdminUsers']);
        Route::patch('users/{user}/role', [UserController::class, 'changeUserRole']);
        Route::get('roles', [UserController::class, 'getAllRoles']);

    });

    Route::middleware(['auth:sanctum', 'role:cm'])->group(function () {
        Route::get('news-banners', [NewsBannerController::class, 'getAllNewsAndBanners']);
        Route::get('banners', [NewsBannerController::class, 'getAllBanners']);
        Route::get('news', [NewsBannerController::class, 'getAllNews']);
        Route::get('news-banners/{id}', [NewsBannerController::class, 'show']);
        Route::post('news-banners/{id}', [NewsBannerController::class, 'store']);
        Route::patch('news-banners/{id}', [NewsBannerController::class, 'update']);
    });

    Route::get('banners/published', [NewsBannerController::class, 'getAllPublishedBanners']);
    Route::get('news/published', [NewsBannerController::class, 'getAllPublishedNews']);

});
