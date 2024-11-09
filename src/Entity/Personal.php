<?php

namespace App\Entity;

use App\Repository\PersonalRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PersonalRepository::class)]
class Personal
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $Status = null;

    #[ORM\Column]
    private ?int $person_nbr_presco = null;

    #[ORM\Column]
    private ?int $person_nbr_primaire = null;

    #[ORM\Column]
    private ?int $person_nbr_college = null;

    #[ORM\Column]
    private ?int $person_nbr_lycee = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?District $district_person = null;

    #[ORM\Column]
    private ?string $anne_scolaire = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStatus(): ?string
    {
        return $this->Status;
    }

    public function setStatus(string $Status): static
    {
        $this->Status = $Status;

        return $this;
    }

    public function getPersonNbrPresco(): ?int
    {
        return $this->person_nbr_presco;
    }

    public function setPersonNbrPresco(int $person_nbr_presco): static
    {
        $this->person_nbr_presco = $person_nbr_presco;

        return $this;
    }

    public function getPersonNbrPrimaire(): ?int
    {
        return $this->person_nbr_primaire;
    }

    public function setPersonNbrPrimaire(int $person_nbr_primaire): static
    {
        $this->person_nbr_primaire = $person_nbr_primaire;

        return $this;
    }

    public function getPersonNbrCollege(): ?int
    {
        return $this->person_nbr_college;
    }

    public function setPersonNbrCollege(int $person_nbr_college): static
    {
        $this->person_nbr_college = $person_nbr_college;

        return $this;
    }

    public function getPersonNbrLycee(): ?int
    {
        return $this->person_nbr_lycee;
    }

    public function setPersonNbrLycee(int $person_nbr_lycee): static
    {
        $this->person_nbr_lycee = $person_nbr_lycee;

        return $this;
    }

    public function getDistrictPerson(): ?District
    {
        return $this->district_person;
    }

    public function setDistrictPerson(?District $district_person): static
    {
        $this->district_person = $district_person;

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
