<?php

namespace App\Controller;

use App\Repository\EtablishmentRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class EtablishmentController extends AbstractController
{
    #[Route('/home/etablishment/{annee}', name: 'app_etablishment',defaults: ['annee' => null])]
    public function index(EtablishmentRepository $repository , ?string $annee): Response
    {
        $etablisment = $repository ->findBy(
            ['anne_scolaire' => $annee],
            ['anne_scolaire' => 'ASC']
        );

        $data = [
            'prescolaire' => ['public' => 0, 'privée' => 0],
            'primaire' => ['public' => 0, 'privée' => 0],
            'college' => ['public' => 0, 'privée' => 0],
            'lycee' => ['public' => 0, 'privée' => 0],
        ];

        foreach ($etablisment as $etablisment) {
            $status = strtolower($etablisment->getStatuJuridique()); // "public" ou "prive"

            $data['prescolaire'][$status] += $etablisment->getPrescoNombres();
            $data['primaire'][$status] += $etablisment->getPrimaireNombres();
            $data['college'][$status] += $etablisment->getCollegeNombres();
            $data['lycee'][$status] += $etablisment->getLyceeNombres();
        }

        return $this->render('etablishment/index.html.twig', [
            'annee' => $annee,
            'data' => $data,
        ]);
    }
}
