<?php

namespace App\Entity;

use App\Repository\EtablishmentRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EtablishmentRepository::class)]
class Etablishment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $statu_juridique = null;

    #[ORM\Column]
    private ?int $presco_nombres = null;

    #[ORM\Column]
    private ?int $primaire_nombres = null;

    #[ORM\Column]
    private ?int $college_nombres = null;

    #[ORM\Column]
    private ?int $lycee_nombres = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?District $district_etab = null;

    #[ORM\Column(length: 255)]
    private ?string $anne_scolaire = null;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStatuJuridique(): ?string
    {
        return $this->statu_juridique;
    }

    public function setStatuJuridique(string $statu_juridique): static
    {
        $this->statu_juridique = $statu_juridique;

        return $this;
    }

    public function getPrescoNombres(): ?int
    {
        return $this->presco_nombres;
    }

    public function setPrescoNombres(int $presco_nombres): static
    {
        $this->presco_nombres = $presco_nombres;

        return $this;
    }

    public function getPrimaireNombres(): ?int
    {
        return $this->primaire_nombres;
    }

    public function setPrimaireNombres(int $primaire_nombres): static
    {
        $this->primaire_nombres = $primaire_nombres;

        return $this;
    }

    public function getCollegeNombres(): ?int
    {
        return $this->college_nombres;
    }

    public function setCollegeNombres(int $college_nombres): static
    {
        $this->college_nombres = $college_nombres;

        return $this;
    }

    public function getLyceeNombres(): ?int
    {
        return $this->lycee_nombres;
    }

    public function setLyceeNombres(int $lycee_nombres): static
    {
        $this->lycee_nombres = $lycee_nombres;

        return $this;
    }

    public function getDistrictEtab(): ?District
    {
        return $this->district_etab;
    }

    public function setDistrictEtab(?District $district_etab): static
    {
        $this->district_etab = $district_etab;

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
