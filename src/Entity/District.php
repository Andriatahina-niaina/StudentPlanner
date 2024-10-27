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


    /**
     * @var Collection<int, SalleClasse>
     */
    #[ORM\OneToMany(targetEntity: SalleClasse::class, mappedBy: 'district_salle')]
    private Collection $salleClasses;

    /**
     * @var Collection<int, Student>
     */
    #[ORM\OneToMany(targetEntity: Student::class, mappedBy: 'district_student')]
    private Collection $students;


    public function __construct()
    {
        $this->etablishments = new ArrayCollection();
        $this->salleClasses = new ArrayCollection();
        $this->students = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getRegion(): ?Region
    {
        return $this->region;
    }

    public function setRegion(?Region $region): self
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

    /**
     * @return Collection<int, SalleClasse>
     */
    public function getSalleClasses(): Collection
    {
        return $this->salleClasses;
    }

    public function addSalleClass(SalleClasse $salleClass): static
    {
        if (!$this->salleClasses->contains($salleClass)) {
            $this->salleClasses->add($salleClass);
            $salleClass->setDistrictSalle($this);
        }

        return $this;
    }

    public function removeSalleClass(SalleClasse $salleClass): static
    {
        if ($this->salleClasses->removeElement($salleClass)) {
            // set the owning side to null (unless already changed)
            if ($salleClass->getDistrictSalle() === $this) {
                $salleClass->setDistrictSalle(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Student>
     */
    public function getStudents(): Collection
    {
        return $this->students;
    }

    public function addStudent(Student $student): static
    {
        if (!$this->students->contains($student)) {
            $this->students->add($student);
            $student->setDistrictStudent($this);
        }

        return $this;
    }

    public function removeStudent(Student $student): static
    {
        if ($this->students->removeElement($student)) {
            // set the owning side to null (unless already changed)
            if ($student->getDistrictStudent() === $this) {
                $student->setDistrictStudent(null);
            }
        }

        return $this;
    }

}
