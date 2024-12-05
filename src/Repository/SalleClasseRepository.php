<?php

namespace App\Repository;

use App\Entity\SalleClasse;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<SalleClasse>
 */
class SalleClasseRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SalleClasse::class);
    }

    public function getDataGroupedByRegion(string $annee): array
    {
        return $this->createQueryBuilder('s')
            ->select('r.name as name, SUM(s.salle_nbr_presco + s.salle_nbr_primaire + s.salle_nbr_college + s.salle_nbr_lycee) as total')
            ->join('s.district_salle', 'd')
            ->join('d.region', 'r')
            ->where('s.anne_scolaire = :annee')
            ->setParameter('annee', $annee)
            ->groupBy('r.id')
            ->getQuery()
            ->getResult();
    }

    public function getDataGroupedByDistrict(string $annee): array
    {
        return $this->createQueryBuilder('s')
            ->select('d.name as name, SUM(s.salle_nbr_presco + s.salle_nbr_primaire + s.salle_nbr_college + s.salle_nbr_lycee) as total')
            ->join('s.district_salle', 'd')
            ->where('s.anne_scolaire = :annee')
            ->setParameter('annee', $annee)
            ->groupBy('d.id')
            ->getQuery()
            ->getResult();
    }
}
