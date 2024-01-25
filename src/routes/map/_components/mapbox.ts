import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken =
	'pk.eyJ1Ijoic29ja2l0b3MiLCJhIjoiY2t6NzUydWZwMGlyajJvbXVuZ2gyNTRjaiJ9.-fuONam95R59PjyGsEVdCQ';

const key = Symbol();

export type MBMapContext = {
	getMap: () => mapboxgl.Map | undefined;
};

export { key, mapboxgl };
