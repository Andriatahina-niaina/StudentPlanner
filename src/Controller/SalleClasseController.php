<?php

namespace App\Controller;

use App\Repository\SalleClasseRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class SalleClasseController extends AbstractController
{
    #[Route('/home/salle_classe/{annee}', name: 'app_salle_classe',defaults: ['annee' => null])]
    public function index(SalleClasseRepository $repository, ?string $annee): Response
    {
        // Requête pour récupérer les données pour une année scolaire spécifique
        $salles = $repository->findBy(
            ['anne_scolaire' => $annee],
            ['anne_scolaire' => 'ASC']
        );

        $data = [
            'prescolaire' => ['public' => 0, 'privée' => 0],
            'primaire' => ['public' => 0, 'privée' => 0],
            'college' => ['public' => 0, 'privée' => 0],
            'lycee' => ['public' => 0, 'privée' => 0],
        ];

    
        foreach ($salles as $salle) {
            $status = strtolower($salle->getSalleStatusJuridique()); // "public" ou "prive"

            $data['prescolaire'][$status] += $salle->getSalleNbrPresco();
            $data['primaire'][$status] += $salle->getSalleNbrPrimaire();
            $data['college'][$status] += $salle->getSalleNbrCollege();
            $data['lycee'][$status] += $salle->getSalleNbrLycee();
        }

    
        return $this->render('salle_classe/index.html.twig', [
            'annee' => $annee,
            'data' => $data,
        ]);
    }
}
