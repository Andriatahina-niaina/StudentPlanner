<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class SalleClasseController extends AbstractController
{
    #[Route('/home/salle_classe', name: 'app_salle_classe')]
    public function index(): Response
    {
        return $this->render('salle_classe/index.html.twig', [
            'controller_name' => 'SalleClasseController',
        ]);
    }
}
