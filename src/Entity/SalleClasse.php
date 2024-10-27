<?php

namespace App\Entity;

use App\Repository\SalleClasseRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SalleClasseRepository::class)]
class SalleClasse
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $salle_status_juridique = null;

    #[ORM\Column]
    private ?int $salle_nbr_presco = null;

    #[ORM\Column]
    private ?int $salle_nbr_primaire = null;

    #[ORM\Column]
    private ?int $salle_nbr_college = null;

    #[ORM\Column]
    private ?int $salle_nbr_lycee = null;

    #[ORM\ManyToOne(inversedBy: 'salleClasses')]
    #[ORM\JoinColumn(nullable: false)]
    private ?District $district_salle = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSalleStatusJuridique(): ?string
    {
        return $this->salle_status_juridique;
    }

    public function setSalleStatusJuridique(string $salle_status_juridique): static
    {
        $this->salle_status_juridique = $salle_status_juridique;

        return $this;
    }

    public function getSalleNbrPresco(): ?int
    {
        return $this->salle_nbr_presco;
    }

    public function setSalleNbrPresco(int $salle_nbr_presco): static
    {
        $this->salle_nbr_presco = $salle_nbr_presco;

        return $this;
    }

    public function getSalleNbrPrimaire(): ?int
    {
        return $this->salle_nbr_primaire;
    }

    public function setSalleNbrPrimaire(int $salle_nbr_primaire): static
    {
        $this->salle_nbr_primaire = $salle_nbr_primaire;

        return $this;
    }

    public function getSalleNbrCollege(): ?int
    {
        return $this->salle_nbr_college;
    }

    public function setSalleNbrCollege(int $salle_nbr_college): static
    {
        $this->salle_nbr_college = $salle_nbr_college;

        return $this;
    }

    public function getSalleNbrLycee(): ?int
    {
        return $this->salle_nbr_lycee;
    }

    public function setSalleNbrLycee(int $salle_nbr_lycee): static
    {
        $this->salle_nbr_lycee = $salle_nbr_lycee;

        return $this;
    }

    public function getDistrictSalle(): ?District
    {
        return $this->district_salle;
    }

    public function setDistrictSalle(?District $district_salle): static
    {
        $this->district_salle = $district_salle;

        return $this;
    }
}
