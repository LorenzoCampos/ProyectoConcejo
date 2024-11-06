<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class CustomVerifyEmail extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('Verificar tu dirección de correo')
            ->greeting('Hola!')
            ->line('Por favor, haz clic en el siguiente enlace para verificar tu dirección de correo:')
            ->action('Verificar', $verificationUrl)
            ->line('Si no has sido tu, ignora este correo.');
    }

    protected function verificationUrl($notifiable)
    {
        // Genera la URL de verificación temporal con la ruta 'verification.verify'
        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(config('auth.verification.expire', 60)),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification())
            ]
        );

        // Define la URL base para el frontend (ajústala según tu entorno)
        $baseUrl = "https://lkfc51ph-443.brs.devtunnels.ms/ProyectoConcejo/backend-api/public";

        // Reemplaza la URL base por la del frontend
        $customerVerificationURL = str_replace(url('/'), $baseUrl, $verificationUrl);

        return $customerVerificationURL;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
