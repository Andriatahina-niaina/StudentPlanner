<?php

namespace App\Repository;

use App\Entity\Personal;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Personal>
 */
class PersonalRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Personal::class);
    }

    public function getDataGroupedByRegion(string $annee): array
    {
        return $this->createQueryBuilder('p')
            ->select('r.name as name, SUM(p.person_nbr_presco + p.person_nbr_primaire + p.person_nbr_college + p.person_nbr_lycee) as total')
            ->join('p.district_person', 'd')
            ->join('d.region', 'r')
            ->where('p.anne_scolaire = :annee')
            ->setParameter('annee', $annee)
            ->groupBy('r.id')
            ->getQuery()
            ->getResult();
    }

    public function getDataGroupedByDistrict(string $annee): array
    {
        return $this->createQueryBuilder('p')
            ->select('d.name as name, SUM(p.person_nbr_presco + p.person_nbr_primaire + p.person_nbr_college + p.person_nbr_lycee) as total')
            ->join('p.district_person', 'd')
            ->where('p.anne_scolaire = :annee')
            ->setParameter('annee', $annee)
            ->groupBy('d.id')
            ->getQuery()
            ->getResult();
    }
}
