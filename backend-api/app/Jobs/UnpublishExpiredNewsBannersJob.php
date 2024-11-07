<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\NewsBanner;
use Illuminate\Support\Facades\Log;

class UnpublishExpiredNewsBannersJob implements ShouldQueue
{
    /* use Dispatchable, InteractsWithQueue, Queueable, SerializesModels; */

    /**
     * Create a new job instance.
     */
    /* public function __construct()
    {
        
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Obtener todas las noticias y banners cuya fecha de expiración haya pasado
        $expiredNewsBanners = NewsBanner::where('status', 1)
            ->where('unpublication_date', '<=', now())
            ->get();

        // Actualizar el estado a "no publicado"
        foreach ($expiredNewsBanners as $newsBanner) {
            $newsBanner->status = 0;
            $newsBanner->save();
        }
        
        Log::info('Job ejecutado: Noticias y banners despublicados por fecha de expiración.');
    }

}

