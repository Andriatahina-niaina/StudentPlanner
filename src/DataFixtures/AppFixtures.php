<?php

namespace App\DataFixtures;

use App\Entity\Region;
use App\Entity\District;
use App\Entity\Etablishment;  // N'oublie pas d'ajouter la classe Etablishment
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $regions = [
            'ANALAMANGA', 'VAKINAKARATRA ', 'DIANA', 'SAVA', 'ALAOTRA-MANGORO',
            'AMORON I MANIA', 'ANALANJIROFO', 'ANDROY', 'ATSIMO-ANDREFANA', 'ATSIMO-ATSINANANA',
            'ANTSIRANANA', 'BETSIBOKA', 'BOENY', 'BONGOLAVA', 'FITOVINANY',
            'HAUTE-MATSIATRA', 'IHOROMBE', 'ITASY', 'MELAKY', 'MENABE','SOFIA','VATOVAVY'
        ];

        $districtNames = [
            'ANALAMANGA' => ['ANTANANARIVO AVARADRANO','AMBOHIDRATRIMO','ANKAZOBE','MANJAKANDRIANA','ANJOZOROBE','ANDRAMASINA','ANTANANARIVO ATSIMONDRANO'
            ],
        ];

        // Persister les régions et les districts associés
        foreach ($regionsWithDistricts as $regionName => $districts) {
            // Créer et persister l'objet Région
            $region = new Region();
            $region->setName($regionName);

            // Persister la région dans la base de données
            $manager->persist($region);

            // Ajouter des districts à chaque région
            foreach ($districts as $districtName) {
                // Créer et persister le district
                $district = new District();
                // Assurer que $districtName est une chaîne de caractères
                $district->setName($districtName); // C'est ici qu'on doit passer une chaîne, pas un tableau
                $district->setRegion($region); // Associer chaque district à sa région

                // Persister le district dans la base de données
                $manager->persist($district);
            }
        }
                $manager->flush();
    }
}