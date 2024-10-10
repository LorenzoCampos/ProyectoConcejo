<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Regulation;
use App\Models\Author;
use App\Models\Keyword;
use Illuminate\Support\Facades\Validator;

class RegulationController extends Controller
{
    // Constante con los nombres válidos de regulaciones y sus restricciones
    const TYPES_WITH_MULTIPLE_AUTHORS = ['Minuta', 'Declaracion', 'Resolucion', 'Decreto'];

    // Guardar una nueva regulación
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:Ordenanza,Minuta,Correspondencia,Declaracion,Resolucion,Decreto',

            'author_type' => 'required|in:Concejal,DEM,Particular',
            'authors' => 'array',
            'authors.*' => 'required|string',

            'state' => 'required|in:process,approved',
            'key_words' => 'array',
            'key_words.*' => 'required|string',
            'subject' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        if ($request->type == 'Correspondencia') {
            if (in_array($request->author_type, ['Concejal'])) {
                return response()->json([
                    'message' => 'Error de validación',
                    'errors' => [
                        'author_type' => 'El tipo de autor no puede ser ' . $request->author_type
                    ]
                ], 422);
            }

            if (in_array($request->author_type, ['DEM'])) {
                $regulation = Regulation::create([
                    'type' => $request->type,
                    'state' => $request->state,
                    'subject' => $request->subject
                ]);

                $regulation->authors()->create([
                    'name' => 'DEM',
                    'type' => $request->author_type
                ]);

                foreach ($request->key_words as $keyword) {
                    $regulation->keywords()->create([
                        'word' => $keyword
                    ]);
                }
            }
        }

        // $regulation = new Regulation();
        // $regulation->name = $request->name;
        // $regulation->state = $request->state ?? 'process';
        // $regulation->created_at = now(); // Fecha de creación no modificable

        // // Validar tipo de autor según el tipo de regulación
        // $authorType = $request->author_type;
        // if ($this->isAuthorTypeAllowed($request->name, $authorType)) {
        //     $regulation->save();

        //     // Guardar los autores
        //     foreach ($request->authors as $authorName) {
        //         $regulation->authors()->create([
        //             'name' => $authorName,
        //             'type' => $authorType
        //         ]);
        //     }

        //     // Guardar palabras clave, si las hay
        //     if ($request->keywords) {
        //         foreach ($request->keywords as $keyword) {
        //             $regulation->keywords()->create([
        //                 'word' => $keyword
        //             ]);
        //         }
        //     }

        //     return response()->json($regulation, 201);
        // }

        return response()->json(['error' => 'El tipo de autor no es válido para el tipo de regulación'], 422);
    }

    // Validar si el tipo de autor es permitido según el tipo de regulación
    private function isAuthorTypeAllowed($regulationType, $authorType)
    {
        switch ($regulationType) {
            case 'Ordenanza':
                return in_array($authorType, ['DEM', 'Concejal']);
            case 'Correspondencia':
                return in_array($authorType, ['Particular', 'DEM']);
            default:
                return $authorType === 'Concejal';
        }
    }
}
