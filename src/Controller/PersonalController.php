<?php

namespace App\Controller;

use App\Repository\PersonalRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class PersonalController extends AbstractController
{
    // Modifier la route pour accepter l'année scolaire dans l'URL (paramètre dynamique)
    #[Route('/home/personal/{annee}', name: 'app_personal', defaults: ['annee' => null])]
    public function index(PersonalRepository $repository, ?string $annee): Response
    {
        // Requête pour récupérer les données pour l'année sélectionnée
        $personals = $repository->findBy(
            ['anne_scolaire' => $annee],
            ['anne_scolaire' => 'ASC']
        );

        // Logique pour préparer les données
        $data = [
            'prescolaire' => ['public' => 0, 'privée' => 0],
            'primaire' => ['public' => 0, 'privée' => 0],
            'college' => ['public' => 0, 'privée' => 0],
            'lycee' => ['public' => 0, 'privée' => 0],
        ];

        foreach ($personals as $personal) {
            $status = strtolower($personal->getStatus());

            $data['prescolaire'][$status] += $personal->getPersonNbrPresco();
            $data['primaire'][$status] += $personal->getPersonNbrPrimaire();
            $data['college'][$status] += $personal->getPersonNbrCollege();
            $data['lycee'][$status] += $personal->getPersonNbrLycee();
        }

        return $this->render('personal/index.html.twig', [
            'annee' => $annee, 
            'data' => $data,
        ]);
    }

}
