<?php

namespace App\Entity;

use App\Repository\EtablishmentRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EtablishmentRepository::class)]
class Etablishment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $regionEtab = null;

    #[ORM\Column(length: 255)]
    private ?string $districkEtab = null;

    #[ORM\Column(length: 255)]
    private ?string $categEtab = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getRegionEtab(): ?string
    {
        return $this->regionEtab;
    }

    public function setRegionEtab(string $regionEtab): static
    {
        $this->regionEtab = $regionEtab;

        return $this;
    }

    public function getDistrickEtab(): ?string
    {
        return $this->districkEtab;
    }

    public function setDistrickEtab(string $districkEtab): static
    {
        $this->districkEtab = $districkEtab;

        return $this;
    }

    public function getCategEtab(): ?string
    {
        return $this->categEtab;
    }

    public function setCategEtab(string $categEtab): static
    {
        $this->categEtab = $categEtab;

        return $this;
    }
}
