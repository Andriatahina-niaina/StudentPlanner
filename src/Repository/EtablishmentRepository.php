<?php

namespace App\Repository;

use App\Entity\Etablishment;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Etablishment>
 */
class EtablishmentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Etablishment::class);
    }

    public function getDataGroupedByRegion(string $annee): array
    {
        return $this->createQueryBuilder('e')
            ->select('r.name as region, SUM(e.presco_nombres + e.primaire_nombres + e.college_nombres + e.lycee_nombres) as total')
            ->join('e.district_etab', 'd')
            ->join('d.region', 'r')
            ->where('e.anne_scolaire = :annee')
            ->setParameter('annee', $annee)
            ->groupBy('r.id')
            ->getQuery()
            ->getResult();

    }

    public function getDataGroupedByDistrict(string $annee): array
    {
        return $this->createQueryBuilder('e')
            ->select('d.name as district, SUM(e.presco_nombres + e.primaire_nombres + e.college_nombres + e.lycee_nombres) as total')
            ->join('e.district_etab', 'd')
            ->where('e.anne_scolaire = :annee')
            ->setParameter('annee', $annee)
            ->groupBy('d.id')
            ->getQuery()
            ->getResult();

    }
}
