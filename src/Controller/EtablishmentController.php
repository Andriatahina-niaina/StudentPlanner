<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class EtablishmentController extends AbstractController
{
    #[Route('/etablishment', name: 'app_etablishment')]
    public function index(): Response
    {
        return $this->render('etablishment/index.html.twig', [
            'controller_name' => 'EtablishmentController',
        ]);
    }
}
