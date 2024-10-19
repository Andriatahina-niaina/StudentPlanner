<?php

namespace App\Entity;

use App\Enum\Category;
use App\Enum\State;
use App\Repository\EtablishmentRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EtablishmentRepository::class)]
class Etablishment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'etablishments')]
    #[ORM\JoinColumn(nullable: false)]
    private ?District $district = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: 'string', enumType: Category::class)]
    private Category $categEtab;

    #[ORM\Column(type: 'string', enumType: State::class)]
    private State $etabState;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getCategEtab(): Category
    {
        return $this->categEtab;
    }

    public function setCategEtab(Category $categEtab): self
    {
        $this->categEtab = $categEtab;
        return $this;
    }

    public function getEtabState(): State
    {
        return $this->etabState;
    }

    public function setEtabState(State $etabState): self
    {
        $this->etabState = $etabState;
        return $this;
    }
}
