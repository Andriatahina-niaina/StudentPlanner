<?php

namespace App\Controller;

use App\Repository\StudentRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class StudentController extends AbstractController
{
    #[Route('/home/student/{annee}', name: 'app_student' ,  defaults: ['annee' => null])]
    public function index(StudentRepository $repository, ?string $annee): Response
    {
        $etudiants = $repository ->findBy(
            ['anne_scolaire' => $annee],
            ['anne_scolaire' => 'ASC']
        );

        $data = [
            'prescolaire' => ['public' => 0, 'privée' => 0],
            'primaire' => ['public' => 0, 'privée' => 0],
            'college' => ['public' => 0, 'privée' => 0],
            'lycee' => ['public' => 0, 'privée' => 0],
        ];

        // Calcul des données
        foreach ($etudiants as $etudiant) {
            $status = strtolower($etudiant->getStatusJuridique()); // "public" ou "prive"

            $data['prescolaire'][$status] += $etudiant->getStudentNbrPresco();
            $data['primaire'][$status] += $etudiant->getStudentNbrPrimaire();
            $data['college'][$status] += $etudiant->getStudentNbrCollege();
            $data['lycee'][$status] += $etudiant->getStudentNbrLycee();
        }

        
        return $this->render('student/index.html.twig', [
            'annee' => $annee,
            'data' => $data,
        ]);
    }
}
