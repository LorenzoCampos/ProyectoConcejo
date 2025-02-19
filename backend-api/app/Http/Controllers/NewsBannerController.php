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
        $newBannerService = $type === 'banner' ? new Banner($request->all()) : new News($request->all());

        // Validar con contexto de creación
        $validationErrors = $newBannerService->validate(true); // true para creación
        if ($validationErrors) {
            return response()->json($validationErrors, 422);
        }

        // si hay video_url
        if ($request->has('video_url')) {
            $url = $request->input('video_url');

            //     $response = Http::withHeaders([
            //         'User-Agent' => 'Mozilla/5.0'
            //     ])->get($url);

            //     return response()->json([$response->status(), $response->body()]); // Ver el código de estado y respuesta de Instagram

            //     if ($response->successful()) {
            //         $html = $response->body();
            //         preg_match('/<meta property="og:image" content="([^"]+)"/', $html, $matches);

            //         if (!empty($matches[1])) {
            //             $thumbnailUrl = $matches[1];

            //             // Descargar la imagen
            //             $imageData = file_get_contents($thumbnailUrl);
            //             $fileName = 'images/news_banners/' . uniqid() . '.jpg';

            //             // Guardar la imagen en el almacenamiento público
            //             Storage::put("public/$fileName", $imageData);
            //         }
            //     }

            $accessToken = 'EAAQHzhVvQjcBOZBCNWD38BoRcuAmwxLLlP5xu5oXbdop0YvyZA2aRfml1kxZCikaV27wS7dZC3ZA315atFHgiVDrMmWRMkLspdAx8jOPsDDRw7pF06s9tnPXLhT8MWQoJRpYOvoETA4WcFUVAo2BTq3OY22w1x7DZCSmH7MxPsyDjEFZCwg7U9dJqnhfeT00wzlvYWGsINanBuMWB06mZCSytTf1sw6fjB2PUwZDZD'; // Access Token válido
            $reelUrl = "https://www.instagram.com/reel/DFa6seOyK4t/"; // URL del Reel

            try {
                // 1️⃣ Obtener el MEDIA_ID del Reel
                $oembedUrl = "https://graph.facebook.com/v18.0/instagram_oembed?url=" . urlencode($reelUrl) . "&access_token=$accessToken";
                $oembedResponse = Http::get($oembedUrl);
                $oembedData = $oembedResponse->json();

                dd($oembedData);

                if (!isset($oembedData['id'])) {
                    return response()->json(['error' => 'No se pudo obtener el ID del Reel'], 400);
                }

                $mediaId = $oembedData['id'];

                // 2️⃣ Obtener la miniatura con el MEDIA_ID
                $instagramApiUrl = "https://graph.facebook.com/v18.0/$mediaId?fields=thumbnail_url&access_token=$accessToken";
                $response = Http::get($instagramApiUrl);
                $data = $response->json();



                if (!isset($data['thumbnail_url'])) {
                    return response()->json(['error' => 'No se pudo obtener la miniatura'], 400);
                }

                return response()->json(['thumbnail' => $data['thumbnail_url']]);
            } catch (\Exception $e) {
                return response()->json(['error' => 'Error al procesar la solicitud'], 500);
            }
        }

        // si hay imagen subir imagen
        $path = $request->hasFile('image') ? $newBannerService->uploadImage($request->input('image')) : null;

        // Crear el banner o noticia
        $newsBanner = NewsBanner::create(array_merge($newBannerService->getData(), ['image' => $path]));

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
