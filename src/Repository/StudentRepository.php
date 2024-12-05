<?php

namespace App\Repository;

use App\Entity\Student;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Student>
 */
class StudentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Student::class);
    }

    public function getDataGroupedByRegion(string $annee): array
    {
        return $this->createQueryBuilder('s')
            ->select('r.name as name, SUM(s.student_nbr_presco + s.student_nbr_primaire + s.student_nbr_college + s.student_nbr_lycee) as total')
            ->join('s.district_student', 'd')
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
            ->select('d.name as name, SUM(s.student_nbr_presco + s.student_nbr_primaire + s.student_nbr_college + s.student_nbr_lycee) as total')
            ->join('s.district_student', 'd')
            ->where('s.anne_scolaire = :annee')
            ->setParameter('annee', $annee)
            ->groupBy('d.id')
            ->getQuery()
            ->getResult();
    }
}
