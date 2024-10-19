<?php

namespace App\Enum;

enum Category: string
{
    case PRESCOLAIRE = 'prescolaire';
    case PRIMAIRE = 'primaire';
    case COLLEGE = 'college';
    case LYCEE = 'lycee';

    // Optionnel : Méthode pour obtenir toutes les valeurs possibles
    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}