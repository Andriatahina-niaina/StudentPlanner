<?php

namespace App\DataFixtures;

use App\Entity\Region;
use App\Entity\District;
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
        foreach ($regions as $regionName) {
            $region = new Region();
            $region->setName($regionName);

            // Ajouter quelques districts à chaque région
            for ($i = 1; $i <= 5; $i++) {
                $district = new District();
                $district->setName("District {$i} of {$regionName}");
                $district->setRegion($region);

                $manager->persist($district);
            }

            $manager->persist($region);
        }

        $manager->flush();

    }
}
