<?php

namespace App\Entity;

use App\Repository\StudentRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: StudentRepository::class)]
class Student
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $student_status_juridique = null;

    #[ORM\Column]
    private ?int $student_nbr_presco = null;

    #[ORM\Column]
    private ?int $student_nbr_primaire = null;

    #[ORM\Column]
    private ?int $student_nbr_college = null;

    #[ORM\Column]
    private ?int $student_nbr_lycee = null;

    #[ORM\ManyToOne(inversedBy: 'students')]
    private ?District $district = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStudentStatusJuridique(): ?string
    {
        return $this->student_status_juridique;
    }

    public function setStudentStatusJuridique(string $student_status_juridique): static
    {
        $this->student_status_juridique = $student_status_juridique;

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

    public function getDistrict(): ?District
    {
        return $this->district;
    }

    public function setDistrict(?District $district): static
    {
        $this->district = $district;

        return $this;
    }
}
