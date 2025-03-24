<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\DayOrder;
use Illuminate\Http\Request;

use App\Models\Regulation;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class OrdenDelDiaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $from = $request->input('from'); // Fecha de inicio
        $to = $request->input('to'); // Fecha de fin
        $orderBy = $request->input('order_by', 'created_at'); // Ordenamiento, por defecto por fecha
        $orderDirection = $request->input('order_direction', 'desc'); // Dirección del ordenamiento, por defecto descendente

        $query = DayOrder::query();

        $query->when($from && $to, function ($q) use ($from, $to) {
            $q->whereBetween('date_creation', [$from, $to]);
        });

        $query->when($from && !$to, function ($q) use ($from) {
            $q->where('date_creation', '>=', $from);
        });

        $query->when(!$from && $to, function ($q) use ($to) {
            $q->where('date_creation', '<=', $to);
        });

        // si no se encontro ningun resultado.
        if ($query->count() == 0) {
            return response()->json(['message' => 'No se encontraron resultados'], 404);
        }

        // Ordenar resultados
        $query->orderBy($orderBy, $orderDirection);

        // Paginación de resultados
        $dayOrders = $query->paginate(15);

        return response()->json($dayOrders, 200);
    }

    public function delete($id): JsonResponse
    {
        $dayOrder = DayOrder::find($id);

        $dayOrder->delete();

        return response()->json(['message' => 'Se elimino correctamente'], 200);
    }

    public function orderDay(Request $request): JsonResponse
    {
        $from = $request->input('startDate'); // Fecha de inicio
        $to = $request->input('endDate'); // Fecha de fin

        // Filtrar normativas de tipo 'correspondence' con rango de fechas si están presentes
        $correspondence = Regulation::where('type', 'correspondence')
            ->when($from && $to, function ($query) use ($from, $to) {
                $query->whereBetween('created_at', [$from, $to]);
            })
            ->when($from && !$to, function ($query) use ($from) {
                $query->where('created_at', '>=', $from);
            })
            ->when(!$from && $to, function ($query) use ($to) {
                $query->where('created_at', '<=', $to);
            });

        $orderCorrespondence = $correspondence->get();

        $orderCorrespondence->load(['authors']);

        // Filtrar normativas de tipo 'dem-message' con rango de fechas si están presentes
        $demMessage = Regulation::where('type', 'dem-message')
            ->when($from && $to, function ($query) use ($from, $to) {
                $query->whereBetween('created_at', [$from, $to]);
            })
            ->when($from && !$to, function ($query) use ($from) {
                $query->where('created_at', '>=', $from);
            })
            ->when(!$from && $to, function ($query) use ($to) {
                $query->where('created_at', '<=', $to);
            });

        $orderDemMessage = $demMessage->get();

        // Filtrar normativas de tipo 'concejal' con rango de fechas si están presentes
        $project = Regulation::where('author_type', 'concejal')
            ->when($from && $to, function ($query) use ($from, $to) {
                $query->whereBetween('created_at', [$from, $to]);
            })
            ->when($from && !$to, function ($query) use ($from) {
                $query->where('created_at', '>=', $from);
            })
            ->when(!$from && $to, function ($query) use ($to) {
                $query->where('created_at', '<=', $to);
            });

        $orderProject = $project->get();

        $orderProject->load(['authors']);

        // Retornar la respuesta en formato JSON
        return response()->json([
            'correspondence' => $orderCorrespondence,
            'dem_message' => $orderDemMessage,
            'projects' => $orderProject,
        ], 200);
    }

    public function storeOrderDay(Request $request): JsonResponse
    {
        // Formato de fecha y acta
        $date = $request->input('date');
        $acta = $request->input('acta');

        // Obtener las regulaciones desde la base de datos
        $correspondences = Regulation::whereIn('id', $request->input('correspondence'))->get();
        $mensajesDem = Regulation::whereIn('id', $request->input('dem_message'))->get();
        $proyectosConcejales = Regulation::whereIn('id', $request->input('projects'))->get();

        $comision_gobierno = $request->input('comision_gobierno');
        $comision_hacienda = $request->input('comision_hacienda');
        $comision_obras = $request->input('comision_obras');
        $comision_higiene = $request->input('comision_higiene');


        // Construir el array dinámico
        $data = [
            'date' => $date,
            'acta' => $acta,
            'correspondencias' => $correspondences->map(function ($item) {
                return [
                    'autor/es' => $item->authors->pluck('name')->toArray(),
                    'subject' => $item->subject,
                    'number' => $item->number,
                ];
            }),
            'mensajes_dem' => $mensajesDem->map(function ($item) {
                return [
                    'subject' => $item->subject,
                    'number' => $item->number,
                ];
            }),
            'proyectos_concejales' => $proyectosConcejales->map(function ($item) {
                return [
                    'type' => $this->typeTranslate($item->type),
                    'subject' => $item->subject,
                    'autor/es' => $item->authors->pluck('name')->toArray(),
                    'number' => $item->number,
                ];
            }),
            'comision_gobierno' => collect($comision_gobierno)->map(function ($item) {
                return [
                    'item' => $item,
                ];
            }),
            'comision_hacienda' => collect($comision_hacienda)->map(function ($item) {
                return [
                    'item' => $item,
                ];
            }),
            'comision_obras' => collect($comision_obras)->map(function ($item) {
                return [
                    'item' => $item,
                ];
            }),
            'comision_higiene' => collect($comision_higiene)->map(function ($item) {
                return [
                    'item' => $item,
                ];
            }),
        ];

        // Generar el PDF con los datos dinámicos
        $pdf = Pdf::loadView('pdf.orden-del-dia', $data)
            ->setPaper('legal', 'portrait'); // Cambiar a tamaño oficio

        // Crear el nombre del archivo
        $fileName = 'Orden_del_Dia_' . $date . '.pdf';

        // Guardar el PDF en el sistema de archivos
        $filePath = 'day_orders/' . $fileName;
        Storage::disk('public')->put($filePath, $pdf->output());

        // Generar la URL personalizada del archivo
        $endPath = 'https://bj0b5hq1-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/storage/day_orders/' . $fileName;
        // $endPath = 'https://api-concejoarroyoseco.duckdns.org/storage/day_orders/' . $fileName;

        // Guardar en la base de datos
        $datOrder = DayOrder::create(['pdf_path' => $endPath, 'date_creation' => $date]);

        // Retornar la respuesta
        return response()->json($datOrder, 201);
    }

    public function typeTranslate($type)
    {
        switch ($type) {
            case 'ordinance':
                return 'Ordenanza';
            case 'correspondence':
                return 'Correspondencia';
            case 'declaration':
                return 'Declaración';
            case 'resolution':
                return 'Resolución';
            case 'minute':
                return 'Minuta';
            case 'decree':
                return 'Decreto';
            case 'dem-message':
                return 'Mensaje DEM';
            default:
                return 'Desconocido';
        }
    }
}
