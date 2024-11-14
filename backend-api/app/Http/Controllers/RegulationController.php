<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Regulation;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Symfony\Component\Console\Input\Input;

class RegulationController extends Controller
{
    // Guardar una nueva regulación
    public function store(Request $request): JsonResponse
    {
        try {
            // 1. Validación inicial de campos comunes
            $request->validate([
                'type' => [
                    'required',
                    Rule::in(['Ordenanza', 'Minuta', 'Correspondencia', 'Declaracion', 'Resolucion', 'Decreto']),
                ],
                'author_type' => [
                    'required',
                    Rule::in(['DEM', 'Particular', 'Concejal']),
                ],
                'authors' => 'required|array|min:1',
                'authors.*' => 'string',
                'state' => [
                    'required',
                    Rule::in(['process', 'approved']),
                ],
                'key_words' => 'required|array',
                'key_words.*' => 'string',
                'subject' => 'nullable|string',
            ]);

            // 2. Validar si el tipo de autor está permitido para el tipo de regulación
            $regulationType = $request->input('type');
            $authorType = $request->input('author_type');

            if (!$this->isAuthorTypeAllowed($regulationType, $authorType)) {
                return response()->json(['error' => 'El tipo de autor no es válido para este tipo de regulación.'], 422);
            }

            // 3. Validaciones adicionales basadas en el tipo de regulación
            if ($regulationType === 'Correspondencia') {
                // Para Correspondencia, los campos regulation_to, regulation_from, pdf_process y pdf_approved deben estar ausentes
                $request->validate([
                    'regulation_to' => 'prohibited',
                    'regulation_from' => 'prohibited',
                    'pdf_process' => 'prohibited',
                    'pdf_approved' => 'prohibited',
                ]);
            } else {
                // Para otros tipos de regulación, estos campos son opcionales
                $request->validate([
                    'regulation_to' => 'nullable|array',
                    'regulation_to.*' => 'integer|exists:regulations,id',
                    'regulation_from' => 'nullable|array',
                    'regulation_from.*' => 'integer|exists:regulations,id',
                    'pdf_process' => 'nullable|file|mimes:pdf|max:2048',
                    'pdf_approved' => 'nullable|file|mimes:pdf|max:2048',
                ]);
            }

            // 4. Crear la regulación después de todas las validaciones
            $regulation = new Regulation();
            $regulation->type = $regulationType;
            $regulation->state = $request->input('state', 'process');
            $regulation->subject = $request->input('subject');
            $regulation->created_at = now();

            // Generar el número correlativo para el tipo de regulación
            $latestNumber = Regulation::where('type', $regulationType)->max('number');
            $regulation->number = $latestNumber ? $latestNumber + 1 : 1;

            $regulation->save();

            // 5. Guardar los autores
            foreach ($request->authors as $authorName) {
                $regulation->authors()->create([
                    'name' => $authorName,
                    'type' => $request->author_type
                ]);
            }

            // 6. Guardar las palabras clave
            foreach ($request->key_words as $keywordName) {
                $regulation->keywords()->create([
                    'word' => $keywordName
                ]);
            }

            // 7. Guardar regulaciones relacionadas si no es Correspondencia
            if ($regulationType !== 'Correspondencia') {
                // regulation_to
                if ($request->has('regulation_to')) {
                    $regulation->regulationsTo()->sync($request->regulation_to);
                }

                // regulation_from
                if ($request->has('regulation_from')) {
                    $regulation->regulationsFrom()->sync($request->regulation_from);
                }

                // 8. Guardar archivos PDF
                if ($request->hasFile('pdf_process')) {
                    $pdfProcessPath = $request->file('pdf_process')->store('pdfs', 'public');
                    $regulation->pdf_process = $pdfProcessPath;
                }

                if ($request->hasFile('pdf_approved')) {
                    $pdfApprovedPath = $request->file('pdf_approved')->store('pdfs', 'public');
                    $regulation->pdf_approved = $pdfApprovedPath;
                }
            }

            return response()->json([
                'message' => 'Regulación creada exitosamente',
                'regulation' => $regulation
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 400);
        }
    }
    // Validar si el tipo de autor es permitido según el tipo de regulación
    private function isAuthorTypeAllowed($regulationType, $authorType)
    {
        switch ($regulationType) {
            case 'Ordenanza':
                return in_array($authorType, ['DEM', 'Concejal']);
            case 'Correspondencia':
                return in_array($authorType, ['DEM', 'Particular']);
            case 'Minuta':
            case 'Declaracion':
            case 'Resolucion':
            case 'Decreto':
                return $authorType === 'Concejal';
            default:
                return false;
        }
    }

    public function show(Regulation $id): JsonResponse
    {
        $regulation = Regulation::find($id);

        if (!$regulation) {
            return response()->json(['message' => 'Registro no encontrado'], 404);  // Responder con status 404 si no existe
        }

        return response()->json([
            'regulation' => $regulation,
        ], 200);
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            // 1. Validar los datos entrantes
            $request->validate([
                'type' => [
                    'required',
                    Rule::in(['Ordenanza', 'Minuta', 'Correspondencia', 'Declaracion', 'Resolucion', 'Decreto']),
                ],
                'author_type' => [
                    'required',
                    Rule::in(['DEM', 'Particular', 'Concejal']),
                ],
                'authors' => 'required|array|min:1',
                'authors.*' => 'string',
                'state' => [
                    'required',
                    Rule::in(['process', 'approved']),
                ],
                'key_words' => 'required|array',
                'key_words.*' => 'string',
                'subject' => 'nullable|string',
            ]);

            // 2. Buscar la regulación en la base de datos
            $regulation = Regulation::findOrFail($id);

            // 3. Validar si el tipo de autor está permitido para el tipo de regulación
            $regulationType = $request->input('type');
            $authorType = $request->input('author_type');

            if (!$this->isAuthorTypeAllowed($regulationType, $authorType)) {
                return response()->json(['error' => 'El tipo de autor no es válido para este tipo de regulación.'], 422);
            }

            // 4. Validaciones adicionales basadas en el tipo de regulación
            if ($regulationType === 'Correspondencia') {
                // Prohibir campos específicos para 'Correspondencia'
                $request->validate([
                    'regulation_to' => 'prohibited',
                    'regulation_from' => 'prohibited',
                    'pdf_process' => 'prohibited',
                    'pdf_approved' => 'prohibited',
                ]);
            } else {
                // Para otros tipos de regulación, estos campos son opcionales
                $request->validate([
                    'regulation_to' => 'nullable|array',
                    'regulation_to.*' => 'integer|exists:regulations,id',
                    'regulation_from' => 'nullable|array',
                    'regulation_from.*' => 'integer|exists:regulations,id',
                    'pdf_process' => 'nullable|file|mimes:pdf|max:2048',
                    'pdf_approved' => 'nullable|file|mimes:pdf|max:2048',
                ]);
            }

            // 5. Actualizar la regulación con los nuevos datos
            $regulation->type = $request->input('type');
            $regulation->state = $request->input('state');
            $regulation->subject = $request->input('subject');
            $regulation->updated_at = now();

            // Guardar cambios en la base de datos
            $regulation->save();

            // 6. Actualizar los autores
            // Limpiar los autores antiguos y guardar los nuevos
            $regulation->authors()->delete();
            foreach ($request->authors as $authorName) {
                $regulation->authors()->create([
                    'name' => $authorName,
                    'type' => $request->author_type
                ]);
            }

            // 7. Actualizar las palabras clave
            // Limpiar las palabras clave antiguas y guardar las nuevas
            $regulation->keywords()->delete();
            foreach ($request->key_words as $keywordName) {
                $regulation->keywords()->create([
                    'word' => $keywordName
                ]);
            }

            // 8. Actualizar regulaciones relacionadas si no es 'Correspondencia'
            if ($regulationType !== 'Correspondencia') {
                // Actualizar 'regulation_to' si existe
                if ($request->has('regulation_to')) {
                    $regulation->regulationsTo()->sync($request->regulation_to);
                }

                // Actualizar 'regulation_from' si existe
                if ($request->has('regulation_from')) {
                    $regulation->regulationsFrom()->sync($request->regulation_from);
                }

                // 9. Actualizar los archivos PDF si se subieron
                if ($request->hasFile('pdf_process')) {
                    // Eliminar el archivo anterior y guardar el nuevo
                    if ($regulation->pdf_process) {
                        Storage::delete($regulation->pdf_process);
                    }
                    $pdfProcessPath = $request->file('pdf_process')->store('pdfs', 'public');
                    $regulation->pdf_process = $pdfProcessPath;
                }

                if ($request->hasFile('pdf_approved')) {
                    // Eliminar el archivo anterior y guardar el nuevo
                    if ($regulation->pdf_approved) {
                        Storage::delete($regulation->pdf_approved);
                    }
                    $pdfApprovedPath = $request->file('pdf_approved')->store('pdfs', 'public');
                    $regulation->pdf_approved = $pdfApprovedPath;
                }
            }

            // 10. Devolver la respuesta de éxito
            return response()->json([
                'message' => 'Regulación actualizada correctamente',
                'regulation' => $regulation
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 400);
        }
    }

}
