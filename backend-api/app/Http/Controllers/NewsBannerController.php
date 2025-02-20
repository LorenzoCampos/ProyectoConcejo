<?php

namespace App\Http\Controllers;

use App\Models\NewsBanner;
use Illuminate\Http\Request;
use App\Services\NewsBanners\Banner;
use App\Services\NewsBanners\News;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class NewsBannerController extends Controller
{
    // Obtener todas las noticias y banners
    public function getAllNewsAndBanners()
    {
        $newsBanners = NewsBanner::all();

        if (!$newsBanners) {
            return response()->json(['message' => 'No hay registros'], 404);  // Responder con status 404 si no hay registros
        }

        return response()->json($newsBanners, 200);  // Responder con status 200
    }


    public function getAllBanners()
    {
        $newsBanners = NewsBanner::where('type', 'banner')->get();

        if (!$newsBanners) {
            return response()->json(['message' => 'No hay registros'], 404);  // Responder con status 404 si no hay registros
        }

        return response()->json($newsBanners, 200);  // Responder con status 200
    }

    public function getAllPublishedBanners()
    {
        $newsBanners = NewsBanner::where('type', 'banner')->where('status', 1)->get();

        if (!$newsBanners) {
            return response()->json(['message' => 'No hay registros'], 404);  // Responder con status 404 si no hay registros
        }

        return response()->json($newsBanners, 200);  // Responder con status 200
    }

    public function getAllNews()
    {
        $newsBanners = NewsBanner::where('type', 'new')->get();

        if (!$newsBanners) {
            return response()->json(['message' => 'No hay registros'], 404);  // Responder con status 404 si no hay registros
        }

        return response()->json($newsBanners, 200);  // Responder con status 200
    }

    public function getAllPublishedNews()
    {
        $newsBanners = NewsBanner::where('type', 'new')->where('status', 1)->get();

        if (!$newsBanners) {
            return response()->json(['message' => 'No hay registros'], 404);  // Responder con status 404 si no hay registros
        }

        return response()->json($newsBanners, 200);  // Responder con status 200
    }

    // Obtener un solo registro (noticia o banner) por su ID
    public function show($id)
    {
        $newsBanner = NewsBanner::find($id);

        if (!$newsBanner) {
            return response()->json(['message' => 'Registro no encontrado'], 404);  // Responder con status 404 si no existe
        }

        return response()->json($newsBanner, 200);
    }

    // Crear un nuevo banner o noticia
    public function store(Request $request)
    {
        $type = $request->input('type');

        // Elegir la clase correcta según el tipo
        $bannerService = $type === 'banner' ? new Banner($request->all()) : new News($request->all());

        // Validar con contexto de creación
        $validationErrors = $bannerService->validate(true); // true para creación
        if ($validationErrors) {
            return response()->json(['message' => 'Error de validación', 'errors' => $validationErrors], 422);
        }

        // Subir imagen
        $path = $bannerService->uploadImage($request);

        // Crear el banner o noticia
        $newsBanner = NewsBanner::create(array_merge($bannerService->getData(), ['image' => $path]));

        return response()->json($newsBanner, 201);
    }

    // Actualizar un banner o noticia
    public function update(Request $request, $id)
    {
        $newsBanner = NewsBanner::findOrFail($id);

        $type = $request->input('type', $newsBanner->type);

        // Elegir la clase correcta según el tipo
        $newBannerService = $type === 'banner' ? new Banner($request->all()) : new News($request->all());

        // Fusionar datos existentes con los nuevos
        $mergedData = $newBannerService->mergeData($newsBanner->toArray());

        // Validar con contexto de actualización
        $validationErrors = $newBannerService->validate(false); // false para actualización
        if ($validationErrors) {
            return response()->json($validationErrors, 422);
        }

        // Manejo de la imagen
        if ($request->hasFile('image')) {
            $newBannerService->deleteImage($newsBanner->image);
            $mergedData['image'] = $newBannerService->uploadImage($request->input('image'));
        }

        // Actualizar solo si hay cambios
        $changes = array_filter($mergedData, function ($value, $key) use ($newsBanner) {
            return $newsBanner->{$key} !== $value;
        }, ARRAY_FILTER_USE_BOTH);

        if (!empty($changes)) {
            $newsBanner->update($changes);
        }

        return response()->json($newsBanner, 200);
    }

    // Eliminar un banner o noticia
    public function delete($id)
    {
        $newsBanner = NewsBanner::findOrFail($id);

        // Borrar imagen asociada
        (new Banner([]))->deleteImage($newsBanner->image);

        $newsBanner->delete();
        return response()->json(['message' => 'Banner eliminado con éxito'], 204);
    }
}
