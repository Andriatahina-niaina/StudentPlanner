<?php

namespace App\Enum;

enum State: string
{
    case PRIVE = 'prive';
    case PUBLIC = 'public';

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}