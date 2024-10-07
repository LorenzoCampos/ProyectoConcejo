<?php

namespace App\Http\Controllers;

use App\Models\NewsBanner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class NewsBannerController extends Controller
{
    // Obtener todas las noticias y banners
    public function index()
    {
        $newsBanners = NewsBanner::all();

        if (!$newsBanners) {
            return response()->json(['message' => 'No hay registros'], 404);  // Responder con status 404 si no hay registros
        }

        return response()->json($newsBanners, 200);  // Responder con status 200
    }


    public function indexBanners()
    {
        $newsBanners = NewsBanner::where('type', 'banner')->get();

        if (!$newsBanners) {
            return response()->json(['message' => 'No hay registros'], 404);  // Responder con status 404 si no hay registros
        }

        return response()->json($newsBanners, 200);  // Responder con status 200
    }

    public function indexBannersPublished()
    {
        $newsBanners = NewsBanner::where('type', 'banner')->where('status', 1)->get();

        if (!$newsBanners) {
            return response()->json(['message' => 'No hay registros'], 404);  // Responder con status 404 si no hay registros
        }

        return response()->json($newsBanners, 200);  // Responder con status 200
    }

    public function indexNews()
    {
        $newsBanners = NewsBanner::where('type', 'new')->get();

        if (!$newsBanners) {
            return response()->json(['message' => 'No hay registros'], 404);  // Responder con status 404 si no hay registros
        }

        return response()->json($newsBanners, 200);  // Responder con status 200
    }

    public function indexNewsPublished()
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

    // Crear una nueva noticia o banner
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'type' => 'required|string|in:new,banner',
                'title' => 'nullable|string',  // Solo para noticias
                'description' => 'nullable|string',  // Solo para noticias
                'image' => 'required|image|mimes:jpeg,png,jpg',  // Validar que sea imagen y su tipo
                'status' => 'required|boolean',
                'publication_date' => 'nullable|date',
                'unpublication_date' => 'nullable|date',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Guardar la imagen en la carpeta 'public/images'
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('images', 'public');
            }

            // Crear el registro en la base de datos
            $newsBanner = NewsBanner::create([
                'type' => $request->type,
                'title' => $request->title,
                'description' => $request->description,
                'image' => 'https://lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/storage/' . $imagePath,  // Guardar la ruta de la imagen
                'status' => $request->status,
                'publication_date' => $request->publication_date,
                'unpublication_date' => $request->unpublication_date,
            ]);

            return response()->json($newsBanner, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    // Actualizar una noticia o banner existente parcialmente
    public function update(Request $request, $id)
    {
        try {
            $newsBanner = NewsBanner::find($id);

            if (!$newsBanner) {
                return response()->json(['message' => 'Registro no encontrado'], 404);
            }

            // Validar solo los campos que se envían
            $validator = Validator::make($request->all(), [
                'type' => 'sometimes|string|in:new,banner',
                'title' => 'sometimes|string',
                'description' => 'sometimes|string',
                'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',  // Validación de imágenes
                'status' => 'sometimes|boolean',
                'publication_date' => 'sometimes|date',
                'unpublication_date' => 'sometimes|date',
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors(), 400);
            }

            // Si se ha enviado una nueva imagen, procesarla
            if ($request->hasFile('image')) {
                // Eliminar la imagen antigua si existe
                if ($newsBanner->image) {
                    Storage::delete($newsBanner->image);
                }

                // Guardar la nueva imagen y obtener la ruta
                $imagePath = $request->file('image')->store('public/images');
                $newsBanner->image = $imagePath;
            }

            // Actualizar los demás campos solo si están presentes en la solicitud
            $newsBanner->update($request->only([
                'type',
                'title',
                'description',
                'status',
                'publication_date',
                'unpublication_date'
            ]));

            return response()->json($newsBanner, 200);
        } catch (\Exception $e) {
            // Manejar el error
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
