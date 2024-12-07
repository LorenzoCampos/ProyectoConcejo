<?php

namespace App\Services\Regulations;

use App\Models\Modification;
use App\Models\Regulation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Model;

abstract class BaseRegulation
{
    protected $data;
    protected $currentUser;

    public function __construct(array $data)
    {
        $this->data = $data;
        $this->currentUser = Auth::user(); // Usuario autenticado
    }

    // -----------------------------------------------------------------------------------------------------------

    /**
     * Validación específica definida en cada clase hija.
     */
    abstract public function validate();

    // -----------------------------------------------------------------------------------------------------------

    /**
     * Subir archivo PDF.
     *
     * @param \Illuminate\Http\UploadedFile $file Archivo a subir.
     * @param string $path Carpeta destino para el archivo.
     * @return string Ruta del archivo subido.
     */
    public function uploadPDF($file): string
    {
        $path = $file->store('pdfs', 'public');
        $endPath = 'https:lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/storage/' . $path;
        return $endPath;
    }

    // -----------------------------------------------------------------------------------------------------------

    /**
     * Eliminar archivo PDF existente.
     *
     * @param string|null $filePath Ruta del archivo a eliminar.
     */

    public function deletePDF(?string $filePath): void
    {
        if ($filePath) {
            Storage::disk('public')->delete($filePath);
        }
    }

    // -----------------------------------------------------------------------------------------------------------

    /**
     * Método genérico para sincronizar relaciones hasMany o belongsToMany.
     *
     * @param Model $regulation Instancia de la regulación.
     * @param string $relation Nombre de la relación en el modelo.
     * @param array $data Datos a sincronizar.
     * @param callable|null $transform Opcional: Transformar datos antes de sincronizarlos.
     */
    public function syncRelation(Model $regulation, string $relation, array $data, callable $transform = null): void
    {
        $relationMethod = $regulation->{$relation}();
        if (method_exists($relationMethod, 'sync')) {
            $relationMethod->sync($transform ? array_map($transform, $data) : $data);
        } else {
            $relationMethod->delete();
            foreach ($data as $item) {
                $relationMethod->create($transform ? $transform($item) : $item);
            }
        }
    }

    // -----------------------------------------------------------------------------------------------------------

    /**
     * Manejar autores asociados a una regulación.
     *
     * @param Model $regulation Instancia de la regulación.
     * @param array $authors Lista de autores (arreglo de ['type' => ..., 'name' => ...]).
     */
    public function handleAuthors(Model $regulation, array $authors, string $type): void
    {
        $this->syncRelation($regulation, 'authors', $authors, fn($author) => ['type' => $type, 'name' => $author]);
    }

    // -----------------------------------------------------------------------------------------------------------

    /**
     * Manejar palabras clave asociadas a una regulación.
     *
     * @param Model $regulation Instancia de la regulación.
     * @param array $keywords Lista de palabras clave (strings).
     */
    public function handleKeywords(Model $regulation, array $keywords): void
    {
        $this->syncRelation($regulation, 'keywords', $keywords, fn($word) => ['word' => $word]);
    }

    // -----------------------------------------------------------------------------------------------------------

    /**
     * Detectar cambios en los autores asociados.
     *
     * @param Model $regulation Instancia de la regulación.
     * @param array $newAuthors Nuevos autores enviados en la petición.
     * @return array Cambios detectados (added, removed).
     */
    public function detectAuthorChanges(Model $regulation, array $newAuthors): array
    {
        $currentAuthors = $regulation->authors->pluck('name')->toArray();

        return [
            'added' => array_diff($newAuthors, $currentAuthors),
            'removed' => array_diff($currentAuthors, $newAuthors),
        ];
    }

    // ------------------------------------------------------------------------------------------------------------

    /**
     * Validar IDs de regulaciones relacionadas antes de sincronizar.
     *
     * @param array $ids Arreglo de IDs a validar.
     * @return array IDs válidos.
     */
    public function validateRegulationIds(array $ids): array
    {
        return Regulation::whereIn('id', $ids)->pluck('id')->toArray();
    }

    // ------------------------------------------------------------------------------------------------------------

    /**
     * Relacionar una regulación con otras que modifica.
     *
     * @param Model $regulation Regulación actual.
     * @param array $modifiesIds IDs de las regulaciones que modifica.
     */
    public function relateModifies(Model $regulation, array $modifiesIds): void
    {
        $this->syncRelation($regulation, 'modifies', $modifiesIds);
    }

    // ------------------------------------------------------------------------------------------------------------

    /**
     * Relacionar una regulación con otras que la modifican.
     *
     * @param Model $regulation Regulación actual.
     * @param array $modifiedByIds IDs de las regulaciones que la modifican.
     */
    public function relateModifiedBy(Model $regulation, array $modifiedByIds): void
    {
        $this->syncRelation($regulation, 'modifiedBy', $modifiedByIds);
    }

    // -----------------------------------------------------------------------------------------------------------

    /**
     * Verificar si el usuario puede crear una regulación.
     */
    public function canCreate(): bool
    {
        if ($this->currentUser->hasRole(['admin', 'secretario'])) {
            // relacionar id del usuario a la regulacion
            $this->data['fk_user_creator'] = $this->currentUser->id;

            return true;
        }

        if ($this->currentUser->hasRole('concejal')) {
            // relacionar id del usuario a la regulacion
            $this->data['fk_user_creator'] = $this->currentUser->id;
            // Solo puede crear regulaciones donde el tipo de autor sea 'Concejal'
            return $this->data['author_type'] === 'concejal' &&
                isset($this->data['authors']) &&
                count($this->data['authors']) > 0;
        }

        return false;
    }

    // -----------------------------------------------------------------------------------------------------------

    /**
     * Verificar si el usuario puede modificar una regulación.
     */
    public function canModify(string $state): bool
    {
        // Admin y Secretario/a pueden modificar
        if ($this->currentUser->hasRole(['admin', 'secretary'])) {
            return true;
        }

        // Las regulaciones aprobadas no se pueden modificar
        return $state !== 'approved';
    }

    // -----------------------------------------------------------------------------------------------------------

    /**
     * Generar número correlativo único por tipo.
     */
    public function generateNumber(string $type): int
    {
        return Regulation::where('type', $type)->max('number') + 1;
    }

    // -----------------------------------------------------------------------------------------------------------

    /**
     * Validar que los autores sean válidos para el tipo de regulación.
     */
    public function validateAuthors(): bool
    {
        $authorType = $this->data['author_type'] ?? null;
        $authors = $this->data['authors'] ?? [];

        switch ($this->data['type']) {
            case 'ordinance':
                return in_array($authorType, ['DEM', 'Concejal']);
            case 'correspondence':
                return in_array($authorType, ['DEM', 'Particular']);
            case 'minute':
            case 'declaration':
            case 'resolution':
            case 'decree':
                return $authorType === 'Concejal' && count($authors) > 0;
            default:
                return false;
        }
    }

    // -----------------------------------------------------------------------------------------------------------

    /**
 * Registrar una modificación en la tabla 'modifications'.
 *
 * @param int $regulationId ID de la regulación.
 * @param array $changes Cambios en atributos simples.
 * @param array $relationChanges Cambios en relaciones (e.g., modifies, modifiedBy, authors).
 */
public function logModification(int $regulationId, array $changes, array $relationChanges = []): void
{
    foreach ($changes as $field => [$oldValue, $newValue]) {
        Modification::create([
            'fk_regulation' => $regulationId,
            'date' => now(),
            'name_cell' => $field,
            'old_cell' => $oldValue,
            'new_cell' => $newValue,
            'fk_old_user' => $this->currentUser->id,
            'fk_new_user' => $this->currentUser->id,
        ]);
    }

    foreach ($relationChanges as $relation => $items) {
        foreach ($items['added'] as $item) {
            Modification::create([
                'fk_regulation' => $regulationId,
                'date' => now(),
                'name_cell' => "relation: $relation - added",
                'old_cell' => null,
                'new_cell' => json_encode($item), // Serializar el objeto agregado.
                'fk_old_user' => $this->currentUser->id,
                'fk_new_user' => $this->currentUser->id,
            ]);
        }

        foreach ($items['removed'] as $item) {
            Modification::create([
                'fk_regulation' => $regulationId,
                'date' => now(),
                'name_cell' => "relation: $relation - removed",
                'old_cell' => json_encode($item), // Serializar el objeto eliminado.
                'new_cell' => null,
                'fk_old_user' => $this->currentUser->id,
                'fk_new_user' => $this->currentUser->id,
            ]);
        }
    }
}


    // -----------------------------------------------------------------------------------------------------------

    /**
     * Manejo de actualizaciones de datos.
     *
     * @param array $currentData Datos actuales de la regulación.
     * @return array Cambios realizados.
     */
    public function handleUpdate(array $currentData): array
    {
        $changes = array_filter($this->mergeData($currentData), function ($value, $key) use ($currentData) {
            return $currentData[$key] !== $value;
        }, ARRAY_FILTER_USE_BOTH);

        return $changes;
    }

    // -----------------------------------------------------------------------------------------------------------

    /**
     * Fusión de datos existentes con los nuevos.
     *
     * @param array $currentData Datos actuales.
     * @return array Datos combinados.
     */
    public function mergeData(array $currentData): array
    {
        return array_merge($currentData, array_filter($this->data, function ($value) {
            return $value !== null;
        }));
    }

    // -----------------------------------------------------------------------------------------------------------

    /**
     * Validar y asignar estado (solo Admin y Secretario/a pueden cambiar el estado).
     */
    public function validateAndSetState(array $currentData): void
    {
        if (isset($this->data['state']) && $this->data['state'] !== $currentData['state']) {
            if ($this->currentUser->hasRole(['Admin', 'Secretary'])) {
                return; // Permitir cambio de estado
            }
            unset($this->data['state']); // Revertir si el usuario no tiene permiso
        }
    }

    // -----------------------------------------------------------------------------------------------------------

    /**
     * Prepara los datos para guardar en la base de datos.
     *
     * @return array Datos listos para guardar.
     */
    public function getData(): array
    {
        return $this->data;
    }
}