<?php

namespace App\Entity;

use App\Repository\DistrictRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DistrictRepository::class)]
class District
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'district')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Region $region = null;

    /**
     * @var Collection<int, Etablishment>
     */
    #[ORM\OneToMany(targetEntity: Etablishment::class, mappedBy: 'district')]
    private Collection $etablishments;

    public function __construct()
    {
        $this->etablishments = new ArrayCollection();
    }

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

    public function getRegion(): ?Region
    {
        return $this->region;
    }

    public function setRegion(?Region $region): static
    {
        $this->region = $region;

        return $this;
    }

    /**
     * @return Collection<int, Etablishment>
     */
    public function getEtablishments(): Collection
    {
        return $this->etablishments;
    }

    public function addEtablishment(Etablishment $etablishment): static
    {
        if (!$this->etablishments->contains($etablishment)) {
            $this->etablishments->add($etablishment);
            $etablishment->setDistrict($this);
        }

        return $this;
    }

    public function removeEtablishment(Etablishment $etablishment): static
    {
        if ($this->etablishments->removeElement($etablishment)) {
            // set the owning side to null (unless already changed)
            if ($etablishment->getDistrict() === $this) {
                $etablishment->setDistrict(null);
            }
        }

        return $this;
    }
}
