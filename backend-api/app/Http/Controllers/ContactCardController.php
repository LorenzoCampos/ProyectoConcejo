<?php

namespace App\Http\Controllers;

use App\Models\ContactCard;
use DragonCode\PrettyArray\Services\Formatters\Json;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ContactCardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $contactCard = ContactCard::where('id', 1)->get();

        return response()->json($contactCard, 200);

        ['image_left' => $contactCard->image_left, 'image_right' => $contactCard->image_right];
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $image_left = $request->file('image_left');
        $image_right = $request->file('image_right');

        if ($request->hasFile('image_left')) {
            $imagePath = $request->file('image_left')->store('images/contact', 'public');
            // $endImageLeftPath = 'https://api-concejoarroyoseco.duckdns.org/storage/' . $imagePath;
            $endImageLeftPath = 'https://bj0b5hq1-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/storage/' . $imagePath;
        }

        if ($request->hasFile('image_right')) {
            $imagePath = $request->file('image_right')->store('images/contact', 'public');
            // $endImageRightPath = 'https://api-concejoarroyoseco.duckdns.org/storage/' . $imagePath;
            $endImageRightPath = 'https://bj0b5hq1-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/storage/' . $imagePath;
        }

        $ContactCard = ContactCard::create([
            'image_left' => $endImageLeftPath,
            'image_right' => $endImageRightPath,
        ]);

        return response()->json($ContactCard, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request): JsonResponse
    {
        $contactCard = ContactCard::find(1);

        $image_left = $request->file('image_left');
        $image_right = $request->file('image_right');

        if ($request->hasFile('image_left')) {
            $currentLeftImage = $contactCard->image_left;
            // $oldImageLeftPath = str_replace('https://api-concejoarroyoseco.duckdns.org/storage/', '', $currentLeftImage);

            $oldImageLeftPath = str_replace('https://bj0b5hq1-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/storage/', '', $currentLeftImage);
            Storage::disk('public')->delete($oldImageLeftPath);

            $imageLeftPath = $request->file('image_left')->store('images/contact', 'public');
            // $endImageLeftPath = 'https://api-concejoarroyoseco.duckdns.org/storage/' . $imagePath;
            $endImageLeftPath = 'https://bj0b5hq1-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/storage/' . $imageLeftPath;
        }

        if ($request->hasFile('image_right')) {
            $currentRightImage = $contactCard->image_right;
            // $oldImageRightPath = str_replace('https://api-concejoarroyoseco.duckdns.org/storage/', '', $currentRightImage);

            $oldImageRightPath = str_replace('https://bj0b5hq1-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/storage/', '', $currentRightImage);
            Storage::disk('public')->delete($oldImageRightPath);

            $imageRightPath = $request->file('image_right')->store('images/contact', 'public');
            // $endImageRightPath = 'https://api-concejoarroyoseco.duckdns.org/storage/' . $imagePath;
            $endImageRightPath = 'https://bj0b5hq1-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public/storage/' . $imageRightPath;
        }

        $newContactCard = [];

        if (isset($endImageLeftPath)) {
            $newContactCard['image_left'] = $endImageLeftPath;
        }
        if (isset($endImageRightPath)) {
            $newContactCard['image_right'] = $endImageRightPath;
        }

        $contactCard->update($newContactCard);

        return response()->json($contactCard, 200);
    }
}
