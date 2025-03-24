{{-- filepath: c:\xampp\htdocs\ProyectoConcejo\backend-api\resources\views\pdf\orden-del-dia.blade.php --}}
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Orden del Día</title>
    <style>
        * {
            box-sizing: border-box;
            padding: 0;
            margin: 0;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.5;
            margin: 0 130px 0 130px;
        }

        h1,
        h2 {
            text-align: center;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
            font-size: 8px;
        }

        .header img {
            margin-top: 10px;
            margin-bottom: 10px;
            max-width: 70px;
        }

        /* Ajusta el tamaño de la imagen */
        .section {
            margin-bottom: 15px;
        }

        .section-title {
            font-weight: bold;
            margin-bottom: 5px;
        }

        .sesion {
            margin-bottom: 5px;
        }

        .aprobacion {
            margin-bottom: 5px;
        }

        ul {
            list-style-type: none;
            padding-left: 0;
        }

        li {
            margin-bottom: 5px;
        }
    </style>
</head>

<body>
    <div class="header">
        <img src="{{ public_path('images/logopdf.png') }}" alt="Logo del Concejo"><br>
        H. Concejo Municipal Arroyo Seco<br>
        Belgrano 698 - Tel-Fax (03402) 427358<br>
        2128 Arroyo Seco - Pcia. Santa Fe<br>


    </div>

    <div class="section">
        <p class="sesion"><b>SESIÓN ORDINARIA:</b> {{ $date }}</p>
        <p class="aprobacion"><b>Aprobación del acta anterior:</b> N° {{ $acta }}</p>
    </div>

    @if ($correspondencias->isNotEmpty())
        <div class="section">
            <p class="section-title">Correspondencias recibidas:</p>
            <ul>
                @foreach ($correspondencias as $index => $item)
                    <li>
                        <b>{{ chr(97 + $index) }} -</b> {{ implode(', ', $item['autor/es']) }}: {{ $item['subject'] }}. (Cargo N° {{ $item['number'] }})
                    </li>
                @endforeach
            </ul>
        </div>
    @endif

    @if ($mensajes_dem->isNotEmpty())
        <div class="section">
            <p class="section-title">Mensajes del D.E.M:</p>
            <ul>
                @foreach ($mensajes_dem as $index => $item)
                    <li>
                        <b>{{ chr(97 + $index) }} -</b> {{ $item['subject'] }}. (Cargo N° {{ $item['number'] }})
                    </li>
                @endforeach
            </ul>
        </div>
    @endif

    @if ($proyectos_concejales->isNotEmpty())
        <div class="section">
            <p class="section-title">Proyectos de los señores concejales:</p>
            <ul>
                @foreach ($proyectos_concejales as $index => $item)
                    <li>
                        <b>{{ chr(97 + $index) }} -</b> {{ $item['type'] }}: {{ $item['subject'] }}.
                        {{ implode(', ', $item['autor/es']) }}. (Cargo N° {{ $item['number'] }})
                    </li>
                @endforeach
            </ul>
        </div>
    @endif

    @if ($comision_gobierno->isNotEmpty())
        <div class="section">
            <p class="section-title">5. DESPACHO DE LA COMISIÓN DE GOBIERNO:</p>
            <ul>
                @foreach ($comision_gobierno as $index => $item)
                    <li>
                        <b>{{ chr(97 + $index) }} -</b> {{ $item['item'] }}
                    </li>
                @endforeach
            </ul>
        </div>
    @endif

    @if ($comision_hacienda->isNotEmpty())
        <div class="section">
            <p class="section-title">6. DESPACHO DE LA COMISIÓN DE HACIENDA:</p>
            <ul>
                @foreach ($comision_hacienda as $index => $item)
                    <li>
                        <b>{{ chr(97 + $index) }} -</b> {{ $item['item'] }}
                    </li>
                @endforeach
            </ul>
        </div>
    @endif

    @if ($comision_obras->isNotEmpty())
        <div class="section">
            <p class="section-title">7. DESPACHO DE LA COMISIÓN DE OBRAS PUBLICAS:</p>
            <ul>
                @foreach ($comision_obras as $index => $item)
                    <li>
                        <b>{{ chr(97 + $index) }} -</b> {{ $item['item'] }}
                    </li>
                @endforeach
            </ul>
        </div>
    @endif

    @if ($comision_higiene->isNotEmpty())
        <div class="section">
            <p class="section-title">8. DESPACHO DE LA COMISIÓN DE HIGIENE:</p>
            <ul>
                @foreach ($comision_higiene as $index => $item)
                    <li>
                        <b>{{ chr(97 + $index) }} -</b> {{ $item['item'] }}
                    </li>
                @endforeach
            </ul>
        </div>
    @endif
</body>

</html>
