<?php

namespace App\Services\NewsBanners;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

abstract class BaseNewBanner
{
    protected $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * Validación específica definida en cada clase hija.
     * @param bool $isCreation Indica si es una validación para crear (true) o actualizar (false).
     */
    abstract public function validate(bool $isCreation = true);

    /**
     * Fusiona datos existentes con los nuevos.
     * Solo sobrescribe los campos enviados (valores no nulos).
     */

    public function mergeData(array $currentData): array
    {
        return array_merge($currentData, array_filter($this->data, function ($value) {
            return $value !== null; // Solo sobrescribe si el valor es no nulo
        }));
    }
    /**
     * Sube una imagen al almacenamiento público.
     * Devuelve la ruta de la imagen.
     */
    public function uploadImage(Request $request): ?string
    {
        $imagePath = $request->file('image')->store('images/news_banners', 'public');
        return 'https://api-concejoarroyoseco.duckdns.org/storage/' . $imagePath;

        // return 'https://bj0b5hq1-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/storage/' . $imagePath;

        return null;
    }

    /**
     * Elimina una imagen del almacenamiento público.
     */
    public function deleteImage($imagePath)
    {
        if ($imagePath) {
            $oldImagePath = str_replace('https://api-concejoarroyoseco.duckdns.org/storage/', '', $imagePath);

            // $oldImagePath = str_replace('https://bj0b5hq1-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/storage/', '', $imagePath);

            Storage::disk('public')->delete($oldImagePath);
        }
    }

    // Devuelve los datos preparados para guardar en la base de datos
    public function getData(): array
    {
        return $this->data;
    }
}
