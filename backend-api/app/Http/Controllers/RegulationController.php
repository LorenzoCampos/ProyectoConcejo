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
use App\Services\Regulations\DemMessage;

class RegulationController extends Controller
{
    private $validTypes = ['ordinance', 'correspondence', 'minute', 'declaration', 'resolution', 'decree', 'dem-message'];

    private $validTypesFormodifiesRefulations = ['ordinance', 'resolution', 'decree'];

    public function indexPublished(Request $request): JsonResponse
    {
        // Obtener los posibles filtros de la request
        $type = $request->input('type');
        $from = $request->input('from'); // Fecha de inicio
        $to = $request->input('to'); // Fecha de fin
        $state = 'approved';
        $search = $request->input('search'); // Búsqueda de texto en el título
        $orderBy = $request->input('order_by', 'created_at'); // Ordenamiento, por defecto por fecha
        $orderDirection = $request->input('order_direction', 'desc'); // Dirección del ordenamiento, por defecto descendente

        // Construir la consulta base
        $query = Regulation::query();

        $query->when($state, function ($q) use ($state) {
            $q->where('state', $state);
        });

        // Excluir los tipos 'dem-message', 'correspondence' y 'minute'
        $query->whereNotIn('type', ['dem-message', 'correspondence', 'minute']);

        // Aplicar filtros condicionalmente
        $query->when($type, function ($q) use ($type) {
            $q->where('type', $type);
        });

        $query->when($search, function ($q) use ($search) {
            $q->where(function ($q) use ($search) {
                $q->where('subject', 'like', '%' . $search . '%')
                    ->orWhereHas('keywords', function ($q) use ($search) {
                        $q->where('word', 'like', '%' . $search . '%');
                    });
            });
        });

        $query->when($request->has('keywords'), function ($q) use ($request) {
            $q->whereHas('keywords', function ($q) use ($request) {
                $q->whereIn('word', $request->input('keywords'));
            });
        });

        $query->when($from && $to, function ($q) use ($from, $to) {
            $q->whereBetween('created_at', [$from, $to]);
        });

        $query->when($from && !$to, function ($q) use ($from) {
            $q->where('created_at', '>=', $from);
        });

        $query->when(!$from && $to, function ($q) use ($to) {
            $q->where('created_at', '<=', $to);
        });

        // si no se encontro ningun resultado.
        if ($query->count() == 0) {
            return response()->json(['message' => 'No se encontraron resultados'], 404);
        }

        // Ordenar resultados
        $query->orderBy($orderBy, $orderDirection);

        // Paginación de resultados
        $regulations = $query->paginate(15);

        // Retornar respuesta JSON
        return response()->json($regulations, 200);
    }

    public function relationsRegulations(Request $request): JsonResponse
    {
        // quiero que me debuelva los parametros enviados en la request
        // dd($request->all());

        $type = $request->input('type');
        $rule = $request->input('rule');
        $id = $request->input('id');
        $search = $request->input('search');

        // Validar el tipo
        if (!in_array($type, $this->validTypesFormodifiesRefulations)) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => [
                    'type' => 'Tipo de regulación no válido.'
                ],
            ], 422);
        }

        $query = Regulation::query()->when($id, function ($q) use ($id) {
            $q->where('id', '!=', $id);
        });

        if ($type === 'ordinance') {
            if ($rule === 'modified-by') {
                $query->when($type, function ($q) use ($type) {
                    $q->where('type', $type);
                });
            } else {
                // Si es de tipo ordinance buscar todos los estos tipos decree, ordinance y resolution
                $query->whereIn('type', ['decree', 'ordinance', 'resolution']);
            }
        } else {
            $query->when($type, function ($q) use ($type) {
                $q->where('type', $type);
            });
        }

        $query->when($search, function ($q) use ($search) {
            $q->where(function ($q) use ($search) {
                $q->where('subject', 'like', '%' . $search . '%')
                    ->orWhereHas('keywords', function ($q) use ($search) {
                        $q->where('word', 'like', '%' . $search . '%');
                    });
            });
        });

        // Si no se encontró ningún resultado
        if ($query->count() == 0) {
            return response()->json(['message' => 'No se encontraron resultados'], 404);
        }

        $regulations = $query->get();

        return response()->json($regulations, 200);
    }

    // filtros para las normativas
    public function index(Request $request): JsonResponse
    {
        // Obtener los posibles filtros de la request
        $type = $request->input('type');
        $from = $request->input('from'); // Fecha de inicio
        $to = $request->input('to'); // Fecha de fin
        $state = $request->input('state');
        $author_type = $request->input('author_type');
        $search = $request->input('search'); // Búsqueda de texto en el título
        $orderBy = $request->input('order_by', 'created_at'); // Ordenamiento, por defecto por fecha
        $orderDirection = $request->input('order_direction', 'desc'); // Dirección del ordenamiento, por defecto descendente

        // Construir la consulta base
        $query = Regulation::with('keywords');

        // Aplicar filtros condicionalmente
        $query->when($type, function ($q) use ($type) {
            $q->where('type', $type);
        });

        $query->when($state, function ($q) use ($state) {
            $q->where('state', $state);
        });

        $query->when($author_type, function ($q) use ($author_type) {
            $q->where('author_type', $author_type);
        });

        $query->when($search, function ($q) use ($search) {
            $q->where(function ($q) use ($search) {
                $q->where('subject', 'like', '%' . $search . '%')
                    ->orWhereHas('keywords', function ($q) use ($search) {
                        $q->where('word', 'like', '%' . $search . '%');
                    });
            });
        });

        $query->when($request->has('keywords'), function ($q) use ($request) {
            $q->whereHas('keywords', function ($q) use ($request) {
                $q->whereIn('word', $request->input('keywords'));
            });
        });

        $query->when($from && $to, function ($q) use ($from, $to) {
            $q->whereBetween('created_at', [$from, $to]);
        });

        $query->when($from && !$to, function ($q) use ($from) {
            $q->where('created_at', '>=', $from);
        });

        $query->when(!$from && $to, function ($q) use ($to) {
            $q->where('created_at', '<=', $to);
        });

        // si no se encontro ningun resultado.
        if ($query->count() == 0) {
            return response()->json(['message' => 'No se encontraron resultados'], 404);
        }

        // Ordenar resultados
        $query->orderBy($orderBy, $orderDirection);

        // Paginación de resultados
        $regulations = $query->paginate(15);

        // Retornar respuesta JSON
        return response()->json($regulations, 200);
    }

    public function show($id): JsonResponse
    {
        // Encontrar la regulación por su ID
        $regulation = Regulation::findOrFail($id);

        // Cargar las relaciones de la regulación
        $regulation->load(['keywords', 'authors', 'regulationsModified', 'regulationsThatModify', 'modifications.user']); // Carga la relación 'user' dentro de 'modifications'

        // Responder con la regulación y sus relaciones
        return response()->json($regulation, 200);
    }

    // STORE -------------------------------------------------------------------------------------------------------------------------------------

    public function store(Request $request)
    {
        $type = $request->input('type');

        // Validar el tipo
        if (!in_array($type, $this->validTypes)) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => [
                    'type' => 'Tipo de regulación no válido.'
                ],
            ], 422);
        }

        $regulationService = $this->getRegulationService($type, $request->all());

        // Validar los datos de entrada
        $validationErrors = $regulationService->validate(true);
        if ($validationErrors) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $validationErrors,
            ], 422);
        }

        // Verificar si el usuario tiene permiso para crear la regulación
        if (!$regulationService || !$regulationService->canCreate()) {
            return response()->json(['error' => 'No tiene permiso para crear esta regulación.'], 403);
        }

        // Preparar datos para la creación
        $data = $regulationService->getData();
        $data['number'] = $regulationService->generateNumber($type);

        if ($request->input('creation_date')) {
            $data['created_at'] = $request->input('creation_date');
        } else {
            $data['created_at'] = now(); // Si no se proporciona, usa la fecha actual
        }

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

        // return response()->json($request->all(), 200);

        // Encontrar la regulación por su ID
        $regulation = Regulation::findOrFail($id);

        $regulationAuxiliarService = $this->getRegulationService($regulation->type, $request->all());

        $validationErrors = $regulationAuxiliarService->validate(false);
        if ($validationErrors) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $validationErrors,
            ], 422);
        }

        $oldData = $regulationAuxiliarService->getData();

        // Fusionar los datos actuales con los nuevos datos enviados en la solicitud
        $mergedData = array_merge($regulation->toArray(), $request->all());

        // Instanciar el servicio de regulación con los datos fusionados
        $regulationService = $this->getRegulationService($regulation->type, $mergedData);

        // Verificar permisos de modificación
        if (!$regulationService->canModify($regulation->state)) {
            return response()->json(['error' => 'No tiene permiso para modificar esta regulación.'], 403);
        }

        // Validar los datos enviados
        $validationErrors = $regulationService->validate(false); // false para actualizaciones
        if ($validationErrors) {
            return response()->json(['message' => 'Error de validación', 'errors' => $validationErrors], 422);
        }

        // Manejar archivos PDF
        $data = [];
        if ($request->hasFile('pdf_process')) {
            // Subir el archivo PDF y obtener la ruta
            $pdfProcessPath = $regulationAuxiliarService->uploadPDF($request->file('pdf_process'));

            // Actualizar el campo en la base de datos
            $data['pdf_process'] = $pdfProcessPath;
        }

        if ($request->hasFile('pdf_approved')) {
            // Subir el archivo PDF y obtener la ruta
            $pdfApprovedPath = $regulationAuxiliarService->uploadPDF($request->file('pdf_approved'));

            // Actualizar el campo en la base de datos
            $data['pdf_approved'] = $pdfApprovedPath;
        }

        // Detectar cambios en los datos simples
        $changes = $regulationService->handleUpdate($regulation->toArray());

        // Actualizar los datos simples si hay cambios
        if (!empty($changes)) {
            $regulation->update($regulationService->mergeData($regulation->toArray()));
        }

        // Actualizar los datos relacionados con los PDFs
        if (!empty($data)) {
            $regulation->update($data);
        }

        // Manejo de relaciones
        $relationChanges = [];

        // Manejar palabras clave
        if ($request->has('keywords')) {
            $relationChanges['keywords'] = [
                'added' => array_diff($request->input('keywords'), $regulation->keywords->pluck('word')->toArray()),
                'removed' => array_diff($regulation->keywords->pluck('word')->toArray(), $request->input('keywords')),
            ];
            $regulationService->handleKeywords($regulation, $request->input('keywords'));
        }

        // Manejar autores
        if ($request->has('authors')) {
            $authorChanges = $regulationService->detectAuthorChanges($regulation, $request->input('authors'));
            $regulationService->handleAuthors($regulation, $request->input('authors'), $regulation->author_type);
            $relationChanges['authors'] = $authorChanges;
        }

        // Manejar regulaciones que esta regulación modifica
        if ($request->has('modifies')) {
            $validModifies = $regulationService->validateRegulationIds($request->input('modifies'));

            $relationChanges['modifies'] = [
                'added' => array_diff($validModifies, $regulation->regulationsModified->pluck('id')->toArray()),
                'removed' => array_diff($regulation->regulationsModified->pluck('id')->toArray(), $validModifies),
            ];

            $regulationService->relateModifies($regulation, $validModifies);
        }

        // Manejar regulaciones que modifican a esta regulación
        if ($request->has('modified_by')) {
            $validModifiedBy = $regulationService->validateRegulationIds($request->input('modified_by'));

            $relationChanges['modifiedBy'] = [
                'added' => array_diff($validModifiedBy, $regulation->regulationsThatModify->pluck('id')->toArray()),
                'removed' => array_diff($regulation->regulationsThatModify->pluck('id')->toArray(), $validModifiedBy),
            ];

            $regulationService->relateModifiedBy($regulation, $validModifiedBy);
        }

        // Registrar las modificaciones realizadas en la tabla 'modifications'
        if (!empty($changes) || !empty($relationChanges)) {
            $regulationService->logModification($regulation->id, $changes, $relationChanges);
        }

        // Devolver la regulación actualizada con sus relaciones cargadas
        return response()->json(
            $regulation->load(['keywords', 'authors', 'regulationsModified', 'regulationsThatModify', 'modifications']),
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
            'dem-message' => new DemMessage($data),
            default => null,
        };
    }
}
