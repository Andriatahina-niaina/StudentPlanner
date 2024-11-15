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
        $regionsWithDistricts = [
            'ALAOTRA-MANGORO' => ['AMBATONDRAZAKA','AMPARAFARAVOLA','ANDILAMENA','ANOSIBE ANALA','MORAMANGA'],

            'AMORON I MANIA' => ['AMBATOFINANDRAHANA','AMBOSITRA','FANDRIANA','MANANDRIANA'],

            'ANALAMANGA' => ['AMBOHIDRATRIMO', 'ANDRAMASINA', 'ANJOZOROBE', 'ANKAZOBE', 'ANTANANARIVO ATSIMONDRANO ', 
                            'ANTANANARIVO AVARADRANO ', 'ANTANANARIVO RENIVOHITRA','MANJAKANDRIANA'],

            'ANALANJIROFO' => ['FENERIVE-EST ','MANANARA-NORD ','MAROANTSETRA','SAINTE-MARIE ','SOANIERANA IVONGO','VAVATENINA '],

            'ANDROY' => ['AMBOVOMBE','BEKILY','BELOHA','TSIHOMBE'],

            'ANOSY' => ['AMBOASARY-SUD ','BETROKA','TAOLANARO'],

            'ATSIMO-ANDREFANA' => ['AMPANIHY','ANKAZOABO','BENENITRA','BEROROHA','BETIOKY','MOROMBE','SAKARAHA','TOLIARA I ','TOLIARA II '],

            'ATSIMO-ATSINANANA' => ['BEFOTAKA','FARAFANGANA','MIDONGY-SUD ','VANGAINDRANO','VONDROZO'],

            'ANTSINANANA' => ['ANTANAMBAO-MANAMPOTSY','BRICKAVILLE','MAHANORO','MAROLAMBO','TOAMASINA I','TOAMASINA II','VATOMANDRY '],

            'BETSIBOKA' => ['KANDREHO','MAEVATANANA','TSARATANANA'],

            'BOENY' => ['AMBATOBOENY','MAHAJANGA I','MAHAJANGA II','MAROVOAY','MITSINJO','SOALALA'],

            'BONGOLAVA' => ['FENOARIVOBE','TSIROANOMANDIDY'],

            'DIANA' => ['AMBANJA', 'AMBILOBE','ANTSIRANANA I','ANTSIRANANA II','NOSY-BE'],

            'HAUTE-MATSIATRA' => ['AMBALAVAO','AMBOHIMAHASOA','FIANARANTSOA I ','IKALAMAVONY','ISANDRA','LALANGINA','VOHIBATO'],

            'IHOROMBE' => ['IAKORA','IHOSY','IVOHIBE'],

            'ITASY' => ['ARIVONIMAMO','MIARINARIVO','SOAVINANDRIANA'],

            'MELAKY' => ['AMBATOMAINTY','ANTSALOVA','BESALAMPY','MAINTIRANO','MORAFENOBE'],

            'MENABE' => ['BELO SUR TSIRIBIHINA','MAHABO','MANJA','MIANDRIVAZO','MORONDAVA'],

            'SAVA' => ['ANDAPA','ANTALAHA','SAMBAVA','VOHIMARINA'],

            'SOFIA' => ['ANALALAVA','ANTSOHIHY','BEALANANA','BEFANDRIANA-NORD','MAMPIKONY','MANDRITSARA','PORT-BERG'],

            'VAKINAKARATRA' => ['AMBATOLAMPY', 'ANTANIFOTSY','ANTSIRABE I', 'ANTSIRABE II','BETAFO','FARATSIHO ','MANDOTO '],
            
            'VATOVAVY FITOVINANY' => ['IFANADIANA','IKONGO','MANAKARA','MANANJARY','NOSY-VARIKA','VOHIPENO'],
        ];

        
        foreach ($regionsWithDistricts as $regionName => $districtNames) {
            $region = new Region();
            $region->setName($regionName);

            $manager->persist($region);

            foreach ($districtNames as $districtName) {
                $district = new District();
                $district->setName($districtName);  
                $district->setRegion($region); 

                $manager->persist($district);
            }
        }
        $manager->flush();
    }
}
