<?php

namespace App\Entity;

use App\Repository\RegionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RegionRepository::class)]
class Region
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    /**
     * @var Collection<int, District>
     */
    #[ORM\OneToMany(targetEntity: District::class, mappedBy: 'region')]
    private Collection $district;

    public function __construct()
    {
        $this->district = new ArrayCollection();
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

    /**
     * @return Collection<int, District>
     */
    public function getDistrict(): Collection
    {
        return $this->district;
    }

    public function addDistrict(District $district): static
    {
        if (!$this->district->contains($district)) {
            $this->district->add($district);
            $district->setRegion($this);
        }

        return $this;
    }

    public function removeDistrict(District $district): static
    {
        if ($this->district->removeElement($district)) {
            // set the owning side to null (unless already changed)
            if ($district->getRegion() === $this) {
                $district->setRegion(null);
            }
        }

        return $this;
    }
    
}
