<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Regulation;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class RegulationController extends Controller
{
    // Guardar una nueva regulación
    public function store(Request $request)
    {
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
}
