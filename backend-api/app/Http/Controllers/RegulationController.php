<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Regulation;
use App\Models\Author;
use App\Models\Keyword;

class RegulationController extends Controller
{
    // Constante con los nombres válidos de regulaciones y sus restricciones
    const TYPES_WITH_MULTIPLE_AUTHORS = ['Minuta', 'Declaracion', 'Resolucion', 'Decreto'];

    // Guardar una nueva regulación
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|in:Ordenanza,Minuta,Correspondencia,Declaracion,Resolucion,Decreto',
            'state' => 'in:process,approved',
            'author_type' => 'required|in:DEM,Particular,Concejal',
            'authors' => 'required|array',
            'authors.*' => 'string',
            'keywords' => 'nullable|array',
            'keywords.*' => 'string',
            'subject' => 'string'
        ]);

        $regulation = new Regulation();
        $regulation->name = $request->name;
        $regulation->state = $request->state ?? 'process';
        $regulation->created_at = now(); // Fecha de creación no modificable

        // Validar tipo de autor según el tipo de regulación
        $authorType = $request->author_type;
        if ($this->isAuthorTypeAllowed($request->name, $authorType)) {
            $regulation->save();

            // Guardar los autores
            foreach ($request->authors as $authorName) {
                $regulation->authors()->create([
                    'name' => $authorName,
                    'type' => $authorType
                ]);
            }

            // Guardar palabras clave, si las hay
            if ($request->keywords) {
                foreach ($request->keywords as $keyword) {
                    $regulation->keywords()->create([
                        'word' => $keyword
                    ]);
                }
            }

            return response()->json($regulation, 201);
        }

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
