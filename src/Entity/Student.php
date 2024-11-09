<?php

namespace App\Entity;

use App\Repository\StudentRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: StudentRepository::class)]
class Student
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $status_juridique = null;

    #[ORM\Column]
    private ?int $student_nbr_presco = null;

    #[ORM\Column]
    private ?int $student_nbr_primaire = null;

    #[ORM\Column]
    private ?int $student_nbr_college = null;

    #[ORM\Column]
    private ?int $student_nbr_lycee = null;

    #[ORM\ManyToOne(inversedBy: 'students')]
    #[ORM\JoinColumn(nullable: false)]
    private ?District $district_student = null;

    #[ORM\Column]
    private ?string $anne_scolaire = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStatusJuridique(): ?string
    {
        return $this->status_juridique;
    }

    public function setStatusJuridique(string $status_juridique): static
    {
        $this->status_juridique = $status_juridique;

        return $this;
    }

    public function getStudentNbrPresco(): ?int
    {
        return $this->student_nbr_presco;
    }

    public function setStudentNbrPresco(int $student_nbr_presco): static
    {
        $this->student_nbr_presco = $student_nbr_presco;

        return $this;
    }

    public function getStudentNbrPrimaire(): ?int
    {
        return $this->student_nbr_primaire;
    }

    public function setStudentNbrPrimaire(int $student_nbr_primaire): static
    {
        $this->student_nbr_primaire = $student_nbr_primaire;

        return $this;
    }

    public function getStudentNbrCollege(): ?int
    {
        return $this->student_nbr_college;
    }

    public function setStudentNbrCollege(int $student_nbr_college): static
    {
        $this->student_nbr_college = $student_nbr_college;

        return $this;
    }

    public function getStudentNbrLycee(): ?int
    {
        return $this->student_nbr_lycee;
    }

    public function setStudentNbrLycee(int $student_nbr_lycee): static
    {
        $this->student_nbr_lycee = $student_nbr_lycee;

        return $this;
    }

    public function getDistrictStudent(): ?District
    {
        return $this->district_student;
    }

    public function setDistrictStudent(?District $district_student): static
    {
        $this->district_student = $district_student;

        return $this;
    }

    public function getAnneScolaire(): ?string
    {
        return $this->anne_scolaire;
    }

    public function setAnneScolaire(string $anne_scolaire): static
    {
        $this->anne_scolaire = $anne_scolaire;

        return $this;
    }

}
