<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Regulation;
use Illuminate\Http\JsonResponse;
use App\Services\Regulations\Ordinance;
use App\Services\Regulations\Correspondence;
use App\Services\Regulations\Declaration;
use App\Services\Regulations\Resolution;
use App\Services\Regulations\Minute;
use App\Services\Regulations\Decree;

class RegulationController extends Controller
{
    // filtros para las normativas
    public function index(Request $request): JsonResponse
    {
        return response()->json(Regulation::all(), 200);
    }

    // STORE -------------------------------------------------------------------------------------------------------------------------------------

    public function store(Request $request)
    {
        $type = $request->input('type');
        $regulationService = $this->getRegulationService($type, $request->all());

        // Verificar si el usuario tiene permiso para crear la regulación
        if (!$regulationService || !$regulationService->canCreate()) {
            return response()->json(['error' => 'No tiene permiso para crear esta regulación.'], 403);
        }

        // Validar los datos de entrada
        $validationErrors = $regulationService->validate(true);
        if ($validationErrors) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $validationErrors,
            ], 422);
        }

        // Preparar datos para la creación
        $data = $regulationService->getData();
        $data['number'] = $regulationService->generateNumber($type);

        // Cargar PDFs si están presentes
        if ($request->hasFile('pdf_process')) {
            $pdfProcessPath = $regulationService->uploadPDF($request->file('pdf_process'));
            $data['pdf_process'] = $pdfProcessPath;
        }

        if ($request->hasFile('pdf_approved')) {
            $pdfApprovedPath = $regulationService->uploadPDF($request->file('pdf_approved'));
            $data['pdf_approved'] = $pdfApprovedPath;
        }

        // Crear la regulación
        $regulation = Regulation::create($data);

        // Manejar palabras clave
        if ($request->has('keywords')) {
            $regulationService->handleKeywords($regulation, $request->input('keywords'));
        }

        // Manejar autores
        if ($request->has('authors')) {
            $regulationService->handleAuthors($regulation, $request->input('authors'), $request->input('author_type'));
        }

        // Relacionar regulaciones que modifica
        if ($request->has('modifies')) {
            $validModifies = $regulationService->validateRegulationIds($request->input('modifies'));
            $regulationService->relateModifies($regulation, $validModifies);
        }

        // Relacionar regulaciones que la modifican
        if ($request->has('modified_by')) {
            $validModifiedBy = $regulationService->validateRegulationIds($request->input('modified_by'));
            $regulationService->relateModifiedBy($regulation, $validModifiedBy);
        }

        // Responder con la regulación creada y sus relaciones
        return response()->json(
            $regulation->load(['keywords', 'authors', 'regulationsModified', 'regulationsThatModify']),
            201
        );
    }

    // UPDATE -------------------------------------------------------------------------------------------------------------------------------------

    public function update(Request $request, $id)
    {
        // Encontrar la regulación por su ID
        $regulation = Regulation::findOrFail($id);

        // Obtener el servicio de la regulación basado en el tipo
        $regulationService = $this->getRegulationService($regulation->type, $request->all());

        // Verificar si el usuario tiene permiso para modificar la regulación
        if (!$regulationService->canModify($regulation->state)) {
            return response()->json(['error' => 'No tiene permiso para modificar esta regulación.'], 403);
        }

        // Validar los datos enviados en la solicitud
        $validationErrors = $regulationService->validate();
        if ($validationErrors) {
            return response()->json(['message' => 'Error de validación', 'errors' => $validationErrors], 422);
        }

        // Fusionar los datos actuales con los nuevos
        $mergedData = $regulationService->mergeData($regulation->toArray());
        $changes = $regulationService->handleUpdate($regulation->toArray());

        // Actualizar la regulación solo si hay cambios
        if (!empty($changes)) {
            $regulation->update($mergedData);
        }

        // Manejo de relaciones y cambios en ellas
        $relationChanges = [];

        // Manejar palabras clave
        if ($request->has('keywords')) {
            $regulationService->handleKeywords($regulation, $request->input('keywords'));
        }

        // Manejar autores
        if ($request->has('authors')) {
            $authorChanges = $regulationService->detectAuthorChanges($regulation, $request->input('authors'));
            $regulationService->handleAuthors($regulation, $request->input('authors'), $request->input('author_type'));
            $relationChanges['authors'] = $authorChanges;
        }

        // Manejar regulaciones que esta regulación modifica
        if ($request->has('modifies')) {
            $validModifies = $regulationService->validateRegulationIds($request->input('modifies'));
            $regulationService->relateModifies($regulation, $validModifies);

            // Registrar cambios en la relación
            $relationChanges['modifies'] = [
                'added' => array_diff($validModifies, $regulation->modifies->pluck('id')->toArray()),
                'removed' => array_diff($regulation->modifies->pluck('id')->toArray(), $validModifies),
            ];
        }

        // Manejar regulaciones que modifican a esta regulación
        if ($request->has('modified_by')) {
            $validModifiedBy = $regulationService->validateRegulationIds($request->input('modified_by'));
            $regulationService->relateModifiedBy($regulation, $validModifiedBy);

            // Registrar cambios en la relación
            $relationChanges['modifiedBy'] = [
                'added' => array_diff($validModifiedBy, $regulation->modifiedBy->pluck('id')->toArray()),
                'removed' => array_diff($regulation->modifiedBy->pluck('id')->toArray(), $validModifiedBy),
            ];
        }

        // Registrar las modificaciones realizadas
        if (!empty($changes) || !empty($relationChanges)) {
            $regulationService->logModification($regulation->id, $changes, $relationChanges);
        }

        // Devolver la regulación con sus relaciones cargadas
        return response()->json(
            $regulation->load(['keywords', 'authors', 'regulationsModified', 'regulationsThatModify']),
            200
        );
    }

    private function getRegulationService(string $type, array $data)
    {
        return match ($type) {
            'ordinance' => new Ordinance($data),
            'correspondence' => new Correspondence($data),
            'minute' => new Minute($data),
            'declaration' => new Declaration($data),
            'resolution' => new Resolution($data),
            'decree' => new Decree($data),
            default => null,
        };
    }
}
