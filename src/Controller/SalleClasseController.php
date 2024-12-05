<?php

namespace App\Controller;

use App\Repository\SalleClasseRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SalleClasseController extends AbstractController
{
    #[Route('/home/salle_classe/{annee?}', name: 'app_salle_classe', defaults: ['annee' => '2016-2017'])]
    public function index(Request $request, SalleClasseRepository $repository, string $annee): Response
    {
        // Préparer les données pour les cartes
        $salles = $repository->findBy(['anne_scolaire' => $annee]);

        $data = [
            'prescolaire' => ['public' => 0, 'privée' => 0],
            'primaire' => ['public' => 0, 'privée' => 0],
            'college' => ['public' => 0, 'privée' => 0],
            'lycee' => ['public' => 0, 'privée' => 0],
        ];

        foreach ($salles as $salle) {
            $status = strtolower($salle->getSalleStatusJuridique());
            $data['prescolaire'][$status] += $salle->getSalleNbrPresco();
            $data['primaire'][$status] += $salle->getSalleNbrPrimaire();
            $data['college'][$status] += $salle->getSalleNbrCollege();
            $data['lycee'][$status] += $salle->getSalleNbrLycee();
        }

        // Préparer les données pour le graphique (par défaut : par région)
        $regionData = $repository->getDataGroupedByRegion($annee);
        $districtData = $repository->getDataGroupedByDistrict($annee);

        $regionLabels = array_column($regionData, 'name');
        $regionValues = array_column($regionData, 'total');
    
        $districtLabels = array_column($districtData, 'name');
        $districtValues = array_column($districtData, 'total');

        return $this->render('salle_classe/index.html.twig', [
            'annee' => $annee,
            'data' => $data,
            'region_chart_data' => ['labels' => $regionLabels, 'data' => $regionValues],
            'district_chart_data' => ['labels' => $districtLabels, 'data' => $districtValues],
            'filter' => $request->query->get('filter', 'region'),
        ]);
    }

    #[Route('/home/salle_classe/chart-data', name: 'app_salle_classe_chart_data', methods: ['GET'])]
    public function getChartData(Request $request, SalleClasseRepository $repository): JsonResponse
    {
        $annee = $request->query->get('annee', '2016-2017');
        $filterBy = $request->query->get('filter', 'region');

        if (!in_array($filterBy, ['region', 'district'])) {
            return new JsonResponse(['labels' => [], 'data' => []]);
        }

        $data = $filterBy === 'region'
            ? $repository->getDataGroupedByRegion($annee)
            : $repository->getDataGroupedByDistrict($annee);

        if ($filterBy === 'district' && empty($data)) {
            return new JsonResponse(['message' => 'Aucune donnée disponible pour le district sélectionné'], 404); // Définir un code d'état HTTP approprié
        }
            
        $labels = array_column($data, 'name');
        $values = array_column($data, 'total');

        return new JsonResponse(['labels' => $labels, 'data' => $values]);
    }
}
