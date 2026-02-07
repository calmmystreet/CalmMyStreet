import type { LatLngExpression } from 'leaflet';

export const COOKIE_NAME = 'calmmystreet_session';

export const color = [
	// https://coolors.co/163b7c-30705c-f6cc4d-8c3830-a3c43f-513b2c-e9963e-642c66-1e2939
	'bg-[#163B7C] text-white',
	'bg-[#30705C] text-white',
	'bg-[#F6CC4D] text-black',
	'bg-[#8C3830] text-white',
	'bg-[#A3C43F] text-black',
	'bg-[#513B2C] text-white',
	'bg-[#E9963E] text-white',
	'bg-[#642C66] text-white',
	'bg-[#1E2939] text-white',
];
export const tileLayer = 'https://tile-a.openstreetmap.fr/hot/{z}/{x}/{y}.png';
export const tileLayerAttribution =
	'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
export const maxZoom = 18;
export const center = [47.6061, -122.3328] as LatLngExpression;
export const esriOptions = {
	url: 'https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Seattle_Streets_1/FeatureServer/0',
	where: "ARTCLASS <= 3 AND PVMTCATEGORY <> 'MLTUSETRL'",
	fields: [
		'UNITIDSORT',
		'UNITDESC',
		'STNAME_ORD',
		'XSTRHI',
		'XSTRLO',
		'ARTCLASS',
		'ARTDESCRIPT',
		'SGNDBKROUTE',
		'NGHBRHDGRNWY',
		'TRANDESCRIPT',
		'PARKBOULEVARD',
		'PRIMARYDISTRICTCD',
	],
};
// the interface that goes along with the above filtered fields
export interface FeatureAttrs {
	UNITIDSORT: string;
	UNITDESC: string;
	STNAME_ORD: string;
	XSTRHI: string;
	XSTRLO: string;
	ARTCLASS: number;
	ARTDESCRIPT: string;
	SGNDBKROUTE: string;
	NGHBRHDGRNWY: string;
	TRANDESCRIPT: string;
	PARKBOULEVARD: string;
	PRIMARYDISTRICTCD: string;
	color: string;
}
