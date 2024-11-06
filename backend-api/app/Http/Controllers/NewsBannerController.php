<?php

namespace App\Http\Controllers;

use App\Models\NewsBanner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

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

    // Crear una nueva noticia o banner
    public function store(Request $request)
    {
        try {
            $request->validate([
                'type' => 'required|string|in:new,banner',
                'title' => 'nullable|string',  // Solo para noticias
                'description' => 'nullable|string',  // Solo para noticias
                'image' => 'required|image|mimes:jpeg,png,jpg',  // Validar que sea imagen y su tipo
                'status' => 'required|boolean|in:1,0',
                'publication_date' => 'nullable|date',
                'unpublication_date' => 'nullable|date',
            ]);

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
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Errores de validación.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    // Actualizar una noticia o banner existente parcialmente
    public function update(Request $request, $id)
    {
        try {
            // Validar los campos para la actualización
            $request->validate([
                'title' => 'nullable|string',  // Solo para noticias
                'description' => 'nullable|string',  // Solo para noticias
                'image' => 'nullable|image|mimes:jpeg,png,jpg',  // Validar que sea imagen y su tipo
                'status' => 'nullable|boolean|in:1,0',
                'publication_date' => 'nullable|date',
                'unpublication_date' => 'nullable|date',
            ]);

            // Buscar el registro en la base de datos
            $newsBanner = NewsBanner::findOrFail($id);

            // Actualizar solo los campos proporcionados
            if ($request->has('type')) {
                $newsBanner->type = $request->type;
            }
            if ($request->has('title')) {
                $newsBanner->title = $request->title;
            }
            if ($request->has('description')) {
                $newsBanner->description = $request->description;
            }
            if ($request->has('status')) {
                $newsBanner->status = $request->status;
            }
            if ($request->has('publication_date')) {
                $newsBanner->publication_date = $request->publication_date;
            }
            if ($request->has('unpublication_date')) {
                $newsBanner->unpublication_date = $request->unpublication_date;
            }

            if ($request->hasFile('image')) {
                // Eliminar la imagen anterior si existe
                if ($newsBanner->image) {
                    $oldImagePath = str_replace('https://lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public', '', $newsBanner->image);
                    Storage::disk('public')->delete($oldImagePath);
                }

                // Guardar la nueva imagen
                $imagePath = $request->file('image')->store('images', 'public');
                $newsBanner->image = 'https://lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/storage/' . $imagePath;
            }

            // Guardar los cambios en la base de datos
            $newsBanner->save();

            return response()->json($newsBanner, 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Errores de validación.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function delete($id)
    {
        $newsBanner = NewsBanner::find($id);

        if (!$newsBanner) {
            return response()->json(['message' => 'Registro no encontrado'], 404);
        }

        // Eliminar la imagen si existe
        if ($newsBanner->image) {
            Storage::delete($newsBanner->image);
        }

        // Eliminar el registro de la base de datos
        $newsBanner->delete();

        return response()->json(['message' => 'Registro eliminado correctamente'], 200);
    }
}
