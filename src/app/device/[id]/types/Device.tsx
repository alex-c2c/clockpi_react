import { DeviceType, DeviceOrientation } from "./enums";

export type DeviceProps = {
	id: number;
	name: string;
	desc: string;
	ipv4: string;
	type: DeviceType;
	orientation: DeviceOrientation;
	supportedColors: string[];
	defaultLabelColor: string;
	defaultLabelShadow: string;
	width: number;
	height: number;
	queue: number[];
	isDrawGrid: boolean;
	isEnabled: boolean;
	isShowTime: boolean;
};

export type DeviceCreateProps = Pick<
	DeviceProps,
	| "name"
	| "desc"
	| "ipv4"
	| "type"
	| "orientation"
>;

export type DeviceUpdateProps = Pick<
	DeviceProps,
	| "name"
	| "desc"
	| "ipv4"
	| "type"
	| "orientation"
	| "isDrawGrid"
	| "isEnabled"
	| "isShowTime"
>;
