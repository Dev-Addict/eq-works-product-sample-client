import {FC, useEffect, useRef} from 'react';
import {Point} from 'geojson';
import {GeoJSONSource, Map, NavigationControl, Popup} from 'mapbox-gl';
import styled from 'styled-components';

import {Poi} from '../../../../types/poi.type';

const Container = styled.div`
	height: 400px;
	border-radius: 8px;
`;

interface Props {
	pois: Poi[];
}

export const PoisMap: FC<Props> = ({pois}) => {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<Map>();

	useEffect(() => {
		if (mapRef.current) return;
		if (!mapContainerRef.current) return;

		mapRef.current = new Map({
			container: mapContainerRef.current,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [-70.9, 42.35],
			zoom: 1.5,
			accessToken: process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? '',
		});

		mapRef.current!.addControl(new NavigationControl());

		mapRef.current!.on('load', () => {
			mapRef.current!.addSource('pois', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: pois.map(({lat, lon, name}) => ({
						type: 'Feature',
						properties: {
							name,
						},
						geometry: {
							type: 'Point',
							coordinates: [lon, lat],
						},
					})),
				},
				cluster: true,
				clusterMaxZoom: 14,
				clusterRadius: 50,
			});

			mapRef.current!.addLayer({
				id: 'clusters',
				type: 'circle',
				source: 'pois',
				filter: ['has', 'point_count'],
				paint: {
					'circle-color': [
						'step',
						['get', 'point_count'],
						'#51bbd6',
						100,
						'#f1f075',
						750,
						'#f28cb1',
					],
					'circle-radius': [
						'step',
						['get', 'point_count'],
						20,
						100,
						30,
						750,
						40,
					],
				},
			});

			mapRef.current!.addLayer({
				id: 'cluster-count',
				type: 'symbol',
				source: 'pois',
				filter: ['has', 'point_count'],
				layout: {
					'text-field': '{point_count_abbreviated}',
					'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
					'text-size': 12,
				},
			});

			mapRef.current!.addLayer({
				id: 'unclustered-point',
				type: 'circle',
				source: 'pois',
				filter: ['!', ['has', 'point_count']],
				paint: {
					'circle-color': '#11b4da',
					'circle-radius': 4,
					'circle-stroke-width': 1,
					'circle-stroke-color': '#fff',
				},
			});

			mapRef.current?.on('click', 'clusters', (e) => {
				const features = mapRef.current?.queryRenderedFeatures(e.point, {
					layers: ['clusters'],
				})!;
				const clusterId = features[0].properties?.cluster_id;
				(
					mapRef.current?.getSource('pois') as GeoJSONSource
				)?.getClusterExpansionZoom(clusterId, (err, zoom) => {
					if (err) return;

					mapRef.current?.easeTo({
						center: (features[0].geometry as Point).coordinates as [
							number,
							number
						],
						zoom: zoom,
					});
				});
			});

			// When a click event occurs on a feature in
			// the unclustered-point layer, open a popup at
			// the location of the feature, with
			// description HTML from its properties.
			mapRef.current?.on('click', 'unclustered-point', (e) => {
				const coordinates = (
					e.features![0].geometry as Point
				).coordinates.slice();
				const name = e.features![0].properties?.name;

				while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
					coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
				}

				new Popup()
					.setLngLat(coordinates as [number, number])
					.setHTML(`location: ${name}`)
					.addTo(mapRef.current!);
			});

			mapRef.current!.on('mouseenter', 'clusters', () => {
				mapRef.current!.getCanvas().style.cursor = 'pointer';
			});
			mapRef.current!.on('mouseleave', 'clusters', () => {
				mapRef.current!.getCanvas().style.cursor = '';
			});
		});
	}, [mapRef.current, mapContainerRef.current]);

	return <Container ref={mapContainerRef} />;
};
