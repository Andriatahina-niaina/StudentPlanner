<?php

namespace App\Controller;

use App\Repository\EtablishmentRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class EtablishmentController extends AbstractController
{
    #[Route('/home/etablishment/{annee?}', name: 'app_etablishment', defaults: ['annee' => '2016-2017'])]
    public function index(Request $request, EtablishmentRepository $repository, string $annee): Response
    {
        // Préparer les données pour les cartes
        $etablissements = $repository->findBy(['anne_scolaire' => $annee]);

        $data = [
            'prescolaire' => ['public' => 0, 'privée' => 0],
            'primaire' => ['public' => 0, 'privée' => 0],
            'college' => ['public' => 0, 'privée' => 0],
            'lycee' => ['public' => 0, 'privée' => 0],
        ];

        foreach ($etablissements as $etablissement) {
            $status = strtolower($etablissement->getStatuJuridique());
            $data['prescolaire'][$status] += $etablissement->getPrescoNombres();
            $data['primaire'][$status] += $etablissement->getPrimaireNombres();
            $data['college'][$status] += $etablissement->getCollegeNombres();
            $data['lycee'][$status] += $etablissement->getLyceeNombres();
        }

        // Récupérer les données pour le graphique (par défaut : par région)
        $regionData = $repository->getDataGroupedByRegion($annee);
        $districtData = $repository->getDataGroupedByDistrict($annee);

        $regionLabels = array_column($regionData, 'region');
        $regionValues = array_column($regionData, 'total');
    
        $districtLabels = array_column($districtData, 'district');
        $districtValues = array_column($districtData, 'total');

        return $this->render('etablishment/index.html.twig', [
            'annee' => $annee,
            'data' => $data,
            'region_chart_data' => ['labels' => $regionLabels, 'data' => $regionValues],
            'district_chart_data' => ['labels' => $districtLabels, 'data' => $districtValues],
            'filter' => $request->query->get('filter', 'region'),
        ]);
    }

    #[Route('/home/etablishment/chart-data', name: 'app_etablishment_chart_data', methods: ['GET'])]
    public function getChartData(Request $request, EtablishmentRepository $repository): JsonResponse
    {
        $annee = $request->query->get('annee', '2016-2017');
        $filterBy = $request->query->get('filter', 'region');

        if (!in_array($filterBy, ['region', 'district'])) {
            return new JsonResponse(['labels' => [], 'data' => []]);
        }

        // Récupérer les données en fonction du filtre sélectionné
        $data = $filterBy === 'region'
            ? $repository->getDataGroupedByRegion($annee)
            : $repository->getDataGroupedByDistrict($annee);

        if ($filterBy === 'district' && empty($data)) {
            return new JsonResponse(['message' => 'Aucune donnée disponible pour le district sélectionné'], 404); // Code HTTP 404 si aucune donnée n'est trouvée
        }

        $labels = array_column($data, 'region');
        $values = array_column($data, 'total');

        return new JsonResponse(['labels' => $labels, 'data' => $values]);
    }
}
