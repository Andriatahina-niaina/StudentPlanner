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
        // Table associative des noms de régions avec leurs districts
        $regionsWithDistricts = [
            'ANALAMANGA' => ['ANTANANARIVO AVARADRANO', 'AMBOHIDRATRIMO', 'ANKAZOBE', 'MANJAKANDRIANA', 'ANJOZOROBE', 'ANDRAMASINA', 'ANTANANARIVO ATSIMONDRANO'],
            'ALAOTRA-MANGORO' => ['AMBATONDRAZAKA','MORAMANGA','ANDILAMENA','ANOSIBE ANALA'],
            'AMORON I MANIA' => ['AMBATOFINANDRAHANA','AMBOSITRA','FANDRIANA','MANANDRIANA',],
            'ANALANJIROFO' => ['SAINTE-MARIE','MAROANTSETRA','MANANARA-NORD','FENERIVE-EST','VAVATENINA','SOANIERANA IVONGO','AMPARAFARAVOLA'],
            'ANDROY' => ['BELOHA','TSIHOMBE','AMBOVOMBE','BEKILY'],
            'ANOSY' => ['BETROKA','AMBOASARY-SUD'],
            'ATSIMO-ANDREFANA' => ['TOLIARA I','BEROROHA','MOROMBE','ANKAZOABO','BETIOKY','AMPANIHY','SAKARAHA','TOLIARA II','BENENITRA'],
            'ATSIMO-ATSINANANA' => ['FARAFANGANA','VAGAINDRANO','MIDONGY-SUD','VONDROZO','BEFOTAKA'],
            'ANTSIRANANA' => ['TOAMASINA I','BRICKAVILLE','VATOMANDRY','MAHANORO','MAROLAMBO','TOAMASINA II','ANTANAMBAO-MANAMPOTSY'],
            'BETSIBOKA' => ['MAEVATANANA','TSARATANANA','KANDREHO'],
            'BOENY' => ['MAHAJANGA I','SOALALA','AMBATOBOENY','MAROVOAY','MITSINJO','MITSINJO','MAHAJANGA II'],
            'BONGOLAVA' => ['SOAVINANDRIANA','TSIROANOMANDIDY','FENOARIVOBE'],
            'DIANA' => ['ANTSIRANANA I', 'ANTSIRANANA II', 'AMBILOBE','NOSY-BE','AMBANJA'],
            'HAUTE-MATSIATRA' => ['FIANARANTSOA I','AMBALAVAO','AMBOHIMAHASOA','IKALAMAVONY','LALANGINA','VOHIBATO','ISANDRA'],
            'IHOROMBE' => ['IHOSY','IVOHIBE','IAKORA'],
            'ITASY' => ['ARIVONIMAMO','MIARINARIVO','SOAVINANDRIANA',],
            'MELAKY' => ['BESALAMPY','AMBATOMAINTY','ANTSALOVA','MAINTIRANO','MORAFENOBE'],
            'MENABE' => ['MANJA','MORONDAVA','MAHABO','BELO SUR TSIRIBIHINA','MIANDRIVAZO'],
            'SOFIA' => ['PORT-BERGE','MANDRITSARA','ANALALAVA','BEFANDRIANA-NORD','ANTSOHIHY','BEALANANA','MAMPIKONY'],
            'SAVA' => ['ANTALAHA','SAMBAVA','ANDAPA','VOHIMARINA',],
            'VAKINAKARATRA' => ['ANTSIRABE 1', 'ANTSIRABE 2','AMBATOLAMPY', 'BETAFO','ANTANIFOTSY','FARATSIHO','MANDOTO'],
            'VATOVAVY FITOVINANY' => ['IFANADIANA','NOSY-VARIKA','MANANJARY','MANAKARA','IKONGO','VOHIPENO'],
        ];

        // Boucle pour créer chaque région et ses districts associés
        foreach ($regionsWithDistricts as $regionName => $districtNames) {
            // Créer l'objet Région
            $region = new Region();
            $region->setName($regionName);

            // Persister la région dans la base de données
            $manager->persist($region);

            // Boucle pour ajouter chaque district associé à cette région
            foreach ($districtNames as $districtName) {
                // Créer l'objet District
                $district = new District();
                
                // Définir le nom du district en tant qu'une seule chaîne de caractères
                $district->setName($districtName);  // $districtName doit être passé dans un tableau car `name` est de type JSON
                $district->setRegion($region); // Associer le district à sa région

                // Persister le district dans la base de données
                $manager->persist($district);
            }
        }

        // Enregistrer tous les changements dans la base de données
        $manager->flush();
    }
}
