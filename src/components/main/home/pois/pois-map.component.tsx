import {FC, useCallback, useEffect, useRef} from 'react';
import {Point} from 'geojson';
import {GeoJSONSource, Map, NavigationControl, Popup} from 'mapbox-gl';
import styled from 'styled-components';

import {Poi} from '../../../../types/poi.type';
import {PoiEvents} from '../../../../types/poi-events.type';
import {PoiStats} from '../../../../types/poi-stats.type';
import {fixNumber} from '../../../../utils/fix-number.util';
import {PoiSortOption} from '../../../../types/poi-sort-options.type';

const Container = styled.div`
	height: 400px;
	border-radius: 8px;
	position: relative;
	margin-bottom: 50px;
`;

const ColorsWrapper = styled.div`
	display: flex;
	flex-direction: row;
	position: absolute;
	height: 40px;
	width: 100%;
	bottom: -50px;
`;

const Colors = styled.div`
	width: 100%;
	height: 40px;
	display: flex;
	flex-direction: row;
	border-radius: 8px;
	overflow: hidden;
	background-color: #ffffff;
	gap: 4px;
`;

interface ColorProps {
	color: string;
}

const Color = styled.div<ColorProps>`
	flex: 1;
	height: 40px;
	background-color: ${({color}) => color};
`;

interface Props {
	pois: Poi[];
	poiEvents: PoiEvents;
	poiStats: PoiStats;
	sortBy: PoiSortOption;
}

export const PoisMap: FC<Props> = ({pois, poiEvents, poiStats, sortBy}) => {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<Map>();

	const handlePoisPoints = useCallback(
		(initialize?: boolean) => {
			if (!mapRef.current) return;
			if (!mapRef.current?.loaded()) return;

			let sorter: string;
			let minNumber: number;
			let maxNumber: number;
			let minMaxDifference: number;

			switch (sortBy) {
				case 'impressions':
				case 'clicks':
				case 'revenue':
					sorter = sortBy;
					const numbers = Object.values(poiStats).map((item) => item[sortBy]);
					minNumber = Math.floor(Math.min(...numbers));
					maxNumber = Math.floor(Math.max(...numbers));
					minMaxDifference = maxNumber - minNumber;
					break;
				default:
					sorter = 'events';
					const eventsNumbers = Object.values(poiEvents);
					minNumber = Math.floor(Math.min(...eventsNumbers));
					maxNumber = Math.floor(Math.max(...eventsNumbers));
					minMaxDifference = maxNumber - minNumber;
			}

			if (!initialize) {
				mapRef.current.removeLayer('clusters');
				mapRef.current.removeLayer('cluster-count');
				mapRef.current.removeLayer('unclustered-point');
				mapRef.current.removeSource('pois');
			}
			mapRef.current.addSource('pois', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: pois.map(({lat, lon, name, poi_id}) => ({
						type: 'Feature',
						properties: {
							name,
							events: poiEvents[poi_id],
							...poiStats[poi_id],
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

			mapRef.current.addLayer({
				id: 'clusters',
				type: 'circle',
				source: 'pois',
				filter: ['has', 'point_count'],
				paint: {
					'circle-color': [
						'step',
						['get', 'point_count'],
						'#51bbd6',
						2,
						'#f1f075',
						5,
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

			mapRef.current.addLayer({
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

			mapRef.current.addLayer({
				id: 'unclustered-point',
				type: 'circle',
				source: 'pois',
				filter: ['!', ['has', 'point_count']],
				paint: {
					'circle-radius': 8,
					'circle-stroke-width': 2,
					'circle-stroke-color': '#fff',
					'circle-color': [
						'step',
						['get', sorter],
						'#F34B3F',
						minNumber + Math.floor(minMaxDifference * 0.25),
						'#F68179',
						minNumber + Math.floor(minMaxDifference * 0.5),
						'#7AB889',
						minNumber + Math.floor(minMaxDifference * 0.75),
						'#569F68',
						maxNumber,
						'#40774E',
					],
				},
			});

			mapRef.current.on('click', 'clusters', (e) => {
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

			mapRef.current?.on('click', 'unclustered-point', (e) => {
				const coordinates = (
					e.features![0].geometry as Point
				).coordinates.slice();
				const {name, events, impressions, clicks, revenue} =
					e.features![0].properties || {};

				while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
					coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
				}

				new Popup()
					.setLngLat(coordinates as [number, number])
					.setHTML(
						`<h3>${name}</h3>
						Events: ${events || 0}
						<br/>Impressions: ${impressions || 0}
						<br/>Clicks: ${clicks || 0}
						<br/>Revenue: ${fixNumber(revenue) || 0}`
					)
					.addTo(mapRef.current!);
			});

			mapRef.current.on('mouseenter', 'clusters', () => {
				mapRef.current!.getCanvas().style.cursor = 'pointer';
			});
			mapRef.current.on('mouseleave', 'clusters', () => {
				mapRef.current!.getCanvas().style.cursor = '';
			});
		},
		[poiEvents, poiStats, pois, sortBy]
	);

	const renderColors = () =>
		['#000000', '#F34B3F', '#F68179', '#7AB889', '#569F68', '#40774E'].map(
			(color) => <Color color={color} key={color} />
		);

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

		mapRef.current!.on('load', handlePoisPoints.bind(true));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		handlePoisPoints();
	}, [handlePoisPoints]);

	return (
		<Container ref={mapContainerRef}>
			<ColorsWrapper>
				<Colors>{renderColors()}</Colors>
			</ColorsWrapper>
		</Container>
	);
};
